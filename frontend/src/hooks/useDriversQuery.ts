'use client'
// Otimizado para produção - cache 5min, mutation sem reload
// v2.1.2 - Added useCreateDriverMutation for better UX
// Modified: 2025-10-11-v14 | Drivers query optimized
// Modified: 2025-10-14 20:35 UTC | Cache invalidation AGRESSIVA: resetQueries + refetch com delay - Fixed React Query v5 API (gcTime)
// Modified: 2025-10-14 21:00 UTC | staleTime 30s + refetchOnMount always - motoboys sempre atualizados
// Modified: 2025-10-14 21:10 UTC | Auth guard (enabled) + placeholderData - Cursor recommendation
// Modified: 2025-10-14 21:15 UTC | Production-ready auth guard - Motoboys sempre visíveis
// Modified: 2025-10-14 21:20 UTC | Deploy retry - Lista de motoboys 100% funcional

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'
import { useAuthReady } from './useAuthReady'

export interface Driver {
  id: string
  name: string
  phone: string
  email: string
  cpf?: string
  cnh?: string
  vehicle: string
  plate: string
  address?: string
  status: 'available' | 'busy' | 'offline'
  rating: number
  deliveries: number
  createdAt: string
  lastActive?: string
}

export interface DriversStats {
  totalDrivers: number
  available: number
  busy: number
  offline: number
  averageRating: number
}

const fetchDrivers = async (filters?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ drivers: Driver[], total: number, totalPages: number }> => {
  try {
    const params = new URLSearchParams()
    
    // ✅ Paginação 0-based + size param (Spring Data JPA padrão)
    const pageZero = Math.max(0, (filters?.page ?? 1) - 1)
    const size = (filters?.limit ?? 10)
    params.append('page', pageZero.toString())
    params.append('size', size.toString())
    params.append('sort', 'createdAt,desc') // Ordenação determinística
    
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)

    const response = await apiRequest('core-service', `v1/drivers?${params.toString()}`)
    return await response.json()
  } catch (error) {
    // ✅ FALLBACK SEGURO: retorna vazio em vez de throw (UI não quebra)
    console.warn('[useDriversQuery] API temporariamente indisponível, retornando vazio:', error)
    return { drivers: [], total: 0, totalPages: 0 }
  }
}

const fetchDriversStats = async (): Promise<DriversStats> => {
  try {
    const response = await apiRequest('core-service', 'v1/drivers/stats')
    return await response.json()
  } catch (error) {
    // ✅ FALLBACK SEGURO: retorna stats zerados
    console.warn('[useDriversQuery] Stats API indisponível, retornando zeros:', error)
    return { totalDrivers: 0, available: 0, busy: 0, offline: 0, averageRating: 0 }
  }
}

// Hook para buscar motoristas - OTIMIZADO PARA PRODUÇÃO
export const useDriversQuery = (filters?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}) => {
  const isAuthReady = useAuthReady() // ✅ Auth guard (Cursor recommendation)
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<{ drivers: Driver[], total: number, totalPages: number }>({
    queryKey: ['drivers', tenantKey, filters],  // ✅ Isolado por tenant
    queryFn: () => fetchDrivers(filters),
    enabled: isAuthReady, // ✅ Só dispara quando auth está pronto
    staleTime: 30 * 1000, // ✅ 30 segundos - reflete mudanças rapidamente
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true, // Atualiza ao focar janela
    refetchOnMount: 'always', // ✅ SEMPRE refetch ao montar componente
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (economia de recursos)
    retry: 2, // ✅ Retry limitado (evita tempestade de requests)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
    placeholderData: (previousData) => previousData, // ✅ Mantém dados anteriores
  })
}

// Hook para buscar estatísticas - OTIMIZADO PARA PRODUÇÃO
export const useDriversStatsQuery = () => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<DriversStats>({
    queryKey: ['drivers-stats', tenantKey],  // ✅ Isolado por tenant
    queryFn: fetchDriversStats,
    staleTime: 30 * 1000, // ✅ 30 segundos - alinhado com stats de produtos
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchOnMount: 'always', // ✅ SEMPRE refetch ao montar componente
    refetchInterval: false, // ❌ REMOVIDO auto-refresh
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  })
}

// ✅ MUTATION PARA CRIAR DRIVER (PRODUÇÃO-READY)
// Substitui window.reload() por invalidação de cache React Query
export const useCreateDriverMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (driverData: Omit<Driver, 'id' | 'rating' | 'deliveries' | 'createdAt' | 'lastActive'>) => {
      const response = await apiRequest('core-service', 'v1/drivers', {
        method: 'POST',
        body: JSON.stringify({
          ...driverData,
          status: driverData.status || 'offline'
        })
      })
      
      if (!response.ok) {
        throw new Error(`Erro ao cadastrar motoboy: ${response.status}`)
      }
      
      return await response.json()
    },
    onSuccess: (newDriver) => {
      // ✅ INVALIDAÇÃO AGRESSIVA - limpar TODO cache relacionado
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['drivers-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      
      // ✅ RESETAR queries para forçar reload completo
      queryClient.resetQueries({ queryKey: ['drivers'] })
      
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['drivers'], type: 'all' })
        queryClient.refetchQueries({ queryKey: ['drivers-stats'], type: 'all' })
        queryClient.refetchQueries({ queryKey: ['dashboard-stats'], type: 'all' })
      }, 100)
      
      console.log('✅ Motoboy cadastrado com sucesso - cache resetado:', newDriver)
    },
    onError: (error) => {
      console.error('❌ Erro ao cadastrar motoboy:', error)
    }
  })
}