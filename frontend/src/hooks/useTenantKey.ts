'use client'
/**
 * useTenantKey - Hook para obter tenant/user identifier
 * 
 * Usado para escopo de cache no React Query e localStorage
 * Garante isolamento completo entre tenants/usuários
 * 
 * Created: 2025-10-18 (Multi-tenant cache isolation)
 * @returns string - user.uid do Firebase ou 'anonymous' se não autenticado
 */

import { useAuth } from '@/contexts/AuthContext'

export const useTenantKey = (): string => {
  const { user } = useAuth()
  
  // Usar UID do Firebase como tenantKey
  // Em produção multi-tenant, você pode usar tenantId dos claims do JWT se disponível
  return user?.uid || 'anonymous'
}

/**
 * Hook para detectar se tenant mudou (usado para invalidação de cache)
 * @returns boolean - true se usuário está autenticado
 */
export const useIsAuthenticated = (): boolean => {
  const { user } = useAuth()
  return !!user
}

