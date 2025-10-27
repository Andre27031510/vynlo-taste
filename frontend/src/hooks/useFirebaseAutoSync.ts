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
      // ✅ CORREÇÃO: Verificar se há conteúdo antes de fazer .json()
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const text = await response.text()
        if (text && text.trim() !== '') {
          try {
            const result = JSON.parse(text)
            // Só logar se for sucesso REAL ou usuário já existe (silencioso)
            if (result.status === 'success' || result.status === 'already_exists') {
              // Remover log para não poluir console em produção
            } else if (result.status === 'error') {
              console.warn('⚠️ Firebase sync error from backend:', result.message)
            }
          } catch (jsonError) {
            // JSON inválido, ignorar silenciosamente
          }
        }
      }
    } else if (response.status === 401) {
      // ✅ Se for 401, o token está expirado/inválido - não logar para não poluir
      // O sistema já vai tentar refresh automaticamente via api.ts
    } else if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Auto-sync HTTP error:', response.status)
    }
  } catch (error) {
    // ✅ CORREÇÃO: Não logar 401 errors (são esperados e tratados automaticamente)
    const errorMessage = (error as Error).message
    if (!errorMessage.includes('401')) {
      console.warn('⚠️ Auto-sync silent fail (non-critical):', errorMessage)
    }
  }
}
// Modified: 2025-10-14 17:05 UTC | Silenced console errors + graceful error handling