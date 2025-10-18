'use client'
/**
 * useTenantChange - Hook para detectar mudanças de tenant/usuário
 * 
 * Quando o tenant muda (logout/login com outro usuário):
 * 1. Invalida todas as queries do React Query
 * 2. Limpa localStorage do tenant anterior
 * 3. Force refetch das queries críticas
 * 
 * Previne vazamento de dados entre sessões de diferentes usuários
 * 
 * Created: 2025-10-18 (Multi-tenant cache isolation)
 */

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTenantKey } from './useTenantKey'

export const useTenantChange = () => {
  const tenantKey = useTenantKey()
  const previousTenantRef = useRef<string | null>(null)
  const queryClient = useQueryClient()
  
  useEffect(() => {
    // Na primeira execução, apenas armazenar o tenant atual
    if (previousTenantRef.current === null) {
      previousTenantRef.current = tenantKey
      return
    }
    
    // Se tenant mudou, limpar cache e storage
    if (previousTenantRef.current !== tenantKey) {
      console.log(`🔄 Tenant mudou: ${previousTenantRef.current} → ${tenantKey}`)
      
      // 1. Limpar localStorage do tenant anterior
      clearTenantStorage(previousTenantRef.current)
      
      // 2. Invalidar TODAS as queries do React Query
      queryClient.invalidateQueries()
      
      // 3. Force refetch das queries críticas (após pequeno delay para garantir que invalidação foi processada)
      setTimeout(() => {
        queryClient.refetchQueries({ 
          queryKey: ['products'], 
          type: 'active',
          exact: false 
        })
        queryClient.refetchQueries({ 
          queryKey: ['product-stats'], 
          type: 'active',
          exact: false 
        })
        queryClient.refetchQueries({ 
          queryKey: ['dashboard-stats'], 
          type: 'active',
          exact: false 
        })
        queryClient.refetchQueries({ 
          queryKey: ['users'], 
          type: 'active',
          exact: false 
        })
        queryClient.refetchQueries({ 
          queryKey: ['drivers'], 
          type: 'active',
          exact: false 
        })
      }, 100)
      
      console.log('✅ Cache limpo e invalidado para novo tenant:', tenantKey)
    }
    
    // Atualizar referência do tenant atual
    previousTenantRef.current = tenantKey
  }, [tenantKey, queryClient])
}

/**
 * Limpar localStorage do tenant anterior
 * Remove todas as chaves vynlo-* que contenham o tenantKey
 */
const clearTenantStorage = (tenantKey: string) => {
  if (typeof window === 'undefined') return
  
  try {
    // Pegar todas as chaves que correspondem ao padrão vynlo-*-fallback:{tenantKey}
    const keysToRemove: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('vynlo-') && key.includes(`:${tenantKey}`)) {
        keysToRemove.push(key)
      }
    }
    
    // Remover todas as chaves identificadas
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log(`🗑️ Removido localStorage: ${key}`)
    })
    
    if (keysToRemove.length > 0) {
      console.log(`✅ ${keysToRemove.length} entradas de localStorage removidas para tenant ${tenantKey}`)
    }
  } catch (error) {
    console.error('Erro ao limpar localStorage:', error)
  }
}

