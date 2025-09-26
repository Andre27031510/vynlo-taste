import { useEffect } from 'react'
import { getAuthInstance } from '@/config/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.vynlotech.com/api'

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
    
    const response = await fetch(`${API_BASE_URL}/api/v1/users/sync-firebase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      console.log('✅ Auto-sync successful:', result)
    } else {
      console.warn('⚠️ Auto-sync failed:', response.status)
    }
  } catch (error) {
    console.error('❌ Auto-sync error:', error)
  }
}