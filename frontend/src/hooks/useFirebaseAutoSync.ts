import { useEffect } from 'react'
import { getAuthInstance } from '@/config/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { apiRequest } from '@/services/api'

export const useFirebaseAutoSync = () => {
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 3
    
    const initializeAuth = () => {
      const auth = getAuthInstance()
      if (!auth) {
        if (retryCount < maxRetries) {
          retryCount++
          console.warn(`Firebase Auth não inicializado, tentativa ${retryCount}/${maxRetries}`)
          setTimeout(initializeAuth, 1000 * retryCount)
          return
        }
        console.error('Firebase Auth falhou após múltiplas tentativas')
        return
      }

      const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
        if (user) {
          console.log('🔥 Firebase user detected, auto-syncing...', user.uid)
          await syncUserWithBackend(user)
        }
      })

      return unsubscribe
    }

    const unsubscribe = initializeAuth()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])
}

const syncUserWithBackend = async (user: User) => {
  try {
    const token = await user.getIdToken()
    
    const response = await apiRequest('core-service', 'v1/users/sync-firebase', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: user.email,
        firebaseUid: user.uid,
        displayName: user.displayName || 'Usuário Firebase',
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL
      })
    })

    if (response.ok) {
      const result = await response.json()
      // Só logar se for sucesso REAL ou usuário já existe (silencioso)
      if (result.status === 'success' || result.status === 'already_exists') {
        // Remover log para não poluir console em produção
        // console.log('✅ Auto-sync successful:', result)
      } else if (result.status === 'error') {
        console.warn('⚠️ Firebase sync error from backend:', result.message)
      }
    } else {
      console.warn('⚠️ Auto-sync HTTP error:', response.status)
    }
  } catch (error) {
    // Silenciar erros de sync em produção (não atrapalha UX)
    console.warn('⚠️ Auto-sync silent fail (non-critical):', (error as Error).message)
  }
}
// Modified: 2025-10-14 17:05 UTC | Silenced console errors + graceful error handling