'use client'
// Hook para detectar quando Firebase auth está pronto
// Previne race condition: queries não disparam até token estar disponível
// Modified: 2025-10-14 21:05 UTC | Created for auth guard (Cursor recommendation)
// Modified: 2025-10-14 21:20 UTC | Null check para auth - TypeScript strict mode compliant

import { useState, useEffect } from 'react'

export const useAuthReady = (): boolean => {
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    let mounted = true
    
    const checkAuth = async () => {
      if (typeof window === 'undefined') {
        if (mounted) setIsReady(true) // Server-side: permitir queries
        return
      }
      
      try {
        const { getAuthInstance } = await import('@/config/firebase')
        const auth = getAuthInstance()
        
        // ✅ Verificar se auth existe antes de usar
        if (!auth) {
          if (mounted) setIsReady(true) // Modo degradado
          return
        }
        
        // ✅ FIX: Verificar estado atual imediatamente
        if (auth.currentUser !== undefined) {
          // Auth já inicializado
          if (mounted) setIsReady(true)
          return
        }
        
        // Aguardar onAuthStateChanged processar APENAS UMA VEZ
        let hasInitialized = false
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (mounted && !hasInitialized) {
            hasInitialized = true
            // Auth está pronto (com ou sem usuário) - NUNCA MAIS MUDAR
            setIsReady(true)
            // ✅ NÃO chamar unsubscribe aqui - manter listener ativo
          }
        })
        
        // ✅ Cleanup apenas no unmount
        return () => {
          if (mounted) {
            unsubscribe()
          }
          mounted = false
        }
      } catch (error) {
        // Se Firebase falhar, permitir queries (modo degradado)
        if (mounted) {
          setIsReady(true)
        }
      }
    }
    
    checkAuth()
    
    return () => {
      mounted = false
    }
  }, [])
  
  return isReady
}
// Modified: 2025-10-14 21:35 UTC | CRITICAL FIX: Auth race condition - produtos não somem mais após tempo

