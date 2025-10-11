'use client'

import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'

export interface Delivery {
  id: string
  orderId: string
  customer: string
  address: string
  phone: string
  driver: string
  driverPhone: string
  status: 'preparing' | 'in_transit' | 'arrived' | 'delivered' | 'problem' | 'cancelled'
  estimatedTime: string
  distance: string
  total: number
  items: string[]
  createdAt: string
  source: 'whatsapp' | 'ifood' | 'balcao' | 'website'
  lastUpdate?: string
  driverLocation?: string
  notes?: string
}

export interface DeliveryStats {
  totalDeliveries: number
  inTransit: number
  preparing: number
  delivered: number
  problems: number
}

// Mock data para fallback
const mockDeliveries: Delivery[] = [
  {
    id: 'DEL001',
    orderId: '#1234',
    customer: 'João Silva',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 99999-9999',
    driver: 'Carlos Santos',
    driverPhone: '(11) 88888-8888',
    status: 'preparing',
    estimatedTime: '25 min',
    distance: '2.5 km',
    total: 45.90,
    items: ['1x Pizza Margherita'],
    createdAt: '14:30',
    source: 'whatsapp',
    lastUpdate: '14:30'
  },
  {
    id: 'DEL002',
    orderId: '#1235',
    customer: 'Maria Santos',
    address: 'Av. Principal, 456 - Bela Vista',
    phone: '(11) 88888-8888',
    driver: 'Roberto Lima',
    driverPhone: '(11) 66666-6666',
    status: 'in_transit',
    estimatedTime: '15 min',
    distance: '1.8 km',
    total: 65.00,
    items: ['2x Hambúrguer Especial'],
    createdAt: '14:45',
    source: 'ifood',
    lastUpdate: '14:50',
    driverLocation: 'Rua das Flores, 50 - Centro'
  },
  {
    id: 'DEL003',
    orderId: '#1236',
    customer: 'Pedro Costa',
    address: 'Rua do Comércio, 789 - Centro',
    phone: '(11) 77777-7777',
    driver: 'Ana Paula',
    driverPhone: '(11) 44444-4444',
    status: 'delivered',
    estimatedTime: 'Entregue',
    distance: '3.2 km',
    total: 28.90,
    items: ['1x Salada Caesar'],
    createdAt: '13:15',
    source: 'balcao',
    lastUpdate: '13:45'
  }
]

const mockStats: DeliveryStats = {
  totalDeliveries: 3,
  inTransit: 1,
  preparing: 1,
  delivered: 1,
  problems: 0
}

const fetchDeliveries = async (filters?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ deliveries: Delivery[], total: number, totalPages: number }> => {
  try {
    const params = new URLSearchParams()
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const response = await apiRequest('core-service', `v1/deliveries?${params.toString()}`)
    return await response.json()
  } catch (error) {
    console.warn('Deliveries API not available, using mock data:', error)
    
    // Aplicar filtros nos dados mock
    let filteredDeliveries = [...mockDeliveries]
    
    if (filters?.status && filters.status !== 'all') {
      filteredDeliveries = filteredDeliveries.filter(d => d.status === filters.status)
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredDeliveries = filteredDeliveries.filter(d => 
        d.customer.toLowerCase().includes(searchLower) ||
        d.orderId.toLowerCase().includes(searchLower) ||
        d.driver.toLowerCase().includes(searchLower)
      )
    }
    
    // Simular paginação
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedDeliveries = filteredDeliveries.slice(startIndex, endIndex)
    
    throw error
  }
}

const fetchDeliveryStats = async (): Promise<DeliveryStats> => {
  try {
    const response = await apiRequest('core-service', 'v1/deliveries/stats')
    return await response.json()
  } catch (error) {
    console.warn('Delivery stats API not available:', error)
    throw error
  }
}

// Hook para buscar entregas
export const useDeliveriesQuery = (filters?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['deliveries', filters],
    queryFn: () => fetchDeliveries(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
  })
}

// Hook para buscar estatísticas - OTIMIZADO PARA PRODUÇÃO
export const useDeliveryStatsQuery = () => {
  return useQuery({
    queryKey: ['delivery-stats'],
    queryFn: fetchDeliveryStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
  })
}