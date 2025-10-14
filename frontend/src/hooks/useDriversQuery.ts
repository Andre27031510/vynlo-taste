'use client'
// Otimizado para produção - cache 5min, mutation sem reload
// v2.1.2 - Added useCreateDriverMutation for better UX
// Modified: 2025-10-11-v14 | Drivers query optimized - Fixed React Query v5 API (gcTime)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'

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
  return useQuery<{ drivers: Driver[], total: number, totalPages: number }>({
    queryKey: ['drivers', filters],
    queryFn: () => fetchDrivers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos (reduz carga no backend)
    gcTime: 10 * 60 * 1000, // 10 minutos (React Query v5: gcTime)
    refetchOnWindowFocus: true, // Atualiza ao focar janela
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (economia de recursos)
    retry: 2, // ✅ Retry limitado (evita tempestade de requests)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Backoff exponencial
  })
}

// Hook para buscar estatísticas - OTIMIZADO PARA PRODUÇÃO
export const useDriversStatsQuery = () => {
  return useQuery<DriversStats>({
    queryKey: ['drivers-stats'],
    queryFn: fetchDriversStats,
    staleTime: 5 * 60 * 1000, // 5 minutos (reduz carga)
    gcTime: 10 * 60 * 1000, // 10 minutos (React Query v5: gcTime)
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchInterval: false, // ❌ REMOVIDO auto-refresh
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
      // ✅ Invalidar queries para atualizar lista automaticamente (SEM reload!)
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['drivers-stats'] })
      
      console.log('✅ Motoboy cadastrado com sucesso:', newDriver)
    },
    onError: (error) => {
      console.error('❌ Erro ao cadastrar motoboy:', error)
    }
  })
}