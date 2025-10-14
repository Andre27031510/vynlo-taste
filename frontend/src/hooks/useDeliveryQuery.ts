'use client'
// Otimizado para produção - cache 5min, sem auto-refresh
// v2.1.2 - Type-safe queries with generics
// Modified: 2025-10-11-v15 | Delivery query optimized - Fixed React Query v5 API (gcTime)

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

const fetchDeliveries = async (filters?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ deliveries: Delivery[], total: number, totalPages: number }> => {
  const params = new URLSearchParams()
  if (filters?.status && filters.status !== 'all') params.append('status', filters.status)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())

  const response = await apiRequest('core-service', `v1/deliveries?${params.toString()}`)
  return await response.json()
}

const fetchDeliveryStats = async (): Promise<DeliveryStats> => {
  const response = await apiRequest('core-service', 'v1/deliveries/stats')
  return await response.json()
}

// Hook para buscar entregas - OTIMIZADO PARA PRODUÇÃO
export const useDeliveriesQuery = (filters?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}) => {
  return useQuery<{ deliveries: Delivery[], total: number, totalPages: number }>({
    queryKey: ['deliveries', filters],
    queryFn: () => fetchDeliveries(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (React Query v5: gcTime em vez de cacheTime)
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
  })
}

// Hook para buscar estatísticas - OTIMIZADO PARA PRODUÇÃO
export const useDeliveryStatsQuery = () => {
  return useQuery<DeliveryStats>({
    queryKey: ['delivery-stats'],
    queryFn: fetchDeliveryStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (React Query v5: gcTime)
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
  })
}