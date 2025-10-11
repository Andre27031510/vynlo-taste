'use client'
// Otimizado para produção - cache 5min, mutation sem reload
// v2.1.2 - Added useCreateDriverMutation for better UX
// Modified: 2025-10-11 - Type-safe queries and mutations

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

// Mock data para fallback
const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '(11) 99999-9999',
    email: 'joao@email.com',
    vehicle: 'Moto 150cc',
    plate: 'ABC-1234',
    rating: 4.8,
    deliveries: 156,
    status: 'available',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Pedro Santos',
    phone: '(11) 88888-8888',
    email: 'pedro@email.com',
    vehicle: 'Moto 160cc',
    plate: 'DEF-5678',
    rating: 4.6,
    deliveries: 142,
    status: 'busy',
    createdAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    name: 'Carlos Lima',
    phone: '(11) 77777-7777',
    email: 'carlos@email.com',
    vehicle: 'Moto 125cc',
    plate: 'GHI-9012',
    rating: 4.4,
    deliveries: 98,
    status: 'offline',
    createdAt: '2024-01-05T09:15:00Z'
  },
  {
    id: '4',
    name: 'Ana Paula',
    phone: '(11) 66666-6666',
    email: 'ana@email.com',
    vehicle: 'Bicicleta',
    plate: 'JKL-3456',
    rating: 4.9,
    deliveries: 203,
    status: 'available',
    createdAt: '2024-01-01T08:00:00Z'
  }
]

const mockStats: DriversStats = {
  totalDrivers: 4,
  available: 2,
  busy: 1,
  offline: 1,
  averageRating: 4.7
}

const fetchDrivers = async (filters?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ drivers: Driver[], total: number, totalPages: number }> => {
  try {
    const params = new URLSearchParams()
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const response = await apiRequest('core-service', `v1/drivers?${params.toString()}`)
    return await response.json()
  } catch (error) {
    console.warn('Drivers API not available, using mock data:', error)
    
    // Aplicar filtros nos dados mock
    let filteredDrivers = [...mockDrivers]
    
    if (filters?.status && filters.status !== 'all') {
      filteredDrivers = filteredDrivers.filter(d => d.status === filters.status)
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredDrivers = filteredDrivers.filter(d => 
        d.name.toLowerCase().includes(searchLower) ||
        d.phone.includes(searchLower) ||
        d.email.toLowerCase().includes(searchLower) ||
        d.plate.toLowerCase().includes(searchLower)
      )
    }
    
    // Simular paginação
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex)
    
    throw error
  }
}

const fetchDriversStats = async (): Promise<DriversStats> => {
  try {
    const response = await apiRequest('core-service', 'v1/drivers/stats')
    return await response.json()
  } catch (error) {
    console.warn('Drivers stats API not available:', error)
    throw error
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
    cacheTime: 10 * 60 * 1000, // 10 minutos em cache
    refetchOnWindowFocus: true, // Atualiza ao focar janela
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (economia de recursos)
  })
}

// Hook para buscar estatísticas - OTIMIZADO PARA PRODUÇÃO
export const useDriversStatsQuery = () => {
  return useQuery<DriversStats>({
    queryKey: ['drivers-stats'],
    queryFn: fetchDriversStats,
    staleTime: 5 * 60 * 1000, // 5 minutos (reduz carga)
    cacheTime: 10 * 60 * 1000, // 10 minutos em cache
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