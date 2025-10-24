'use client'
// Otimizado para produção - cache 5min, sem auto-refresh
// v2.1.2 - Type-safe queries with generics
// Modified: 2025-10-11-v15 | Delivery query optimized
// Modified: 2025-10-14 21:00 UTC | staleTime 30s + refetchOnMount always - deliveries sempre atualizadas - Fixed React Query v5 API (gcTime)
// ✅ CORREÇÃO: Adicionado mutations para atualizar status de delivery

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'
import toast from 'react-hot-toast'

export interface Delivery {
  id: string
  orderId: string
  customer: string
  address: string
  phone: string
  driver: string
  driverPhone: string
  status: 'preparing' | 'in_transit' | 'arrived' | 'delivered' | 'problem' | 'cancelled' | 'PREPARING' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED' | 'PROBLEM' | 'CANCELLED'
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
  try {
    const params = new URLSearchParams()
    
    // ✅ CORREÇÃO: Enviar page 1-based e usar "limit"
    const pageOneBased = filters?.page ?? 1
    const limit = filters?.limit ?? 10
    params.append('page', pageOneBased.toString())
    params.append('limit', limit.toString())
    params.append('sort', 'createdAt,desc') // Ordenação determinística
    
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)

    const response = await apiRequest('core-service', `v1/deliveries?${params.toString()}`)
    return await response.json()
  } catch (error) {
    console.error('[useDeliveryQuery] Erro na API:', error)
    throw error  // Deixar React Query tratar o erro
  }
}

const fetchDeliveryStats = async (): Promise<DeliveryStats> => {
  try {
    const response = await apiRequest('core-service', 'v1/deliveries/stats')
    return await response.json()
  } catch (error) {
    // ✅ FALLBACK SEGURO: retorna stats zerados
    console.warn('[useDeliveryQuery] Stats API indisponível, retornando zeros:', error)
    return { totalDeliveries: 0, inTransit: 0, preparing: 0, delivered: 0, problems: 0 }
  }
}

// Hook para buscar entregas - OTIMIZADO PARA PRODUÇÃO
export const useDeliveriesQuery = (filters?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}) => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<{ deliveries: Delivery[], total: number, totalPages: number }>({
    queryKey: ['deliveries', tenantKey, filters],  // ✅ Isolado por tenant
    queryFn: () => fetchDeliveries(filters),
    staleTime: 30 * 1000, // ✅ 30 segundos - reflete mudanças rapidamente
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchOnMount: true, // ✅ CORREÇÃO: true (não 'always') - boolean válido
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
    retry: 2, // ✅ Retry limitado (evita tempestade de requests)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
  })
}

// Hook para buscar estatísticas - OTIMIZADO PARA PRODUÇÃO
export const useDeliveryStatsQuery = () => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<DeliveryStats>({
    queryKey: ['delivery-stats', tenantKey],  // ✅ Isolado por tenant
    queryFn: fetchDeliveryStats,
    staleTime: 30 * 1000, // ✅ 30 segundos - alinhado com outros stats
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchOnMount: 'always', // ✅ SEMPRE refetch ao montar componente
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
  })
}

// ✅ CORREÇÃO: Mutations para atualizar status de delivery
const updateDeliveryStatus = async ({ deliveryId, status }: { deliveryId: string; status: Delivery['status'] }) => {
  // ✅ CORREÇÃO: Converter status para UPPERCASE (backend espera UPPERCASE)
  const backendStatus = status.toUpperCase().replace('_', '_')
  
  const response = await apiRequest('core-service', `v1/deliveries/${deliveryId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: backendStatus })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao atualizar status do delivery')
  }
  
  return response.json()
}

export const useUpdateDeliveryStatusMutation = () => {
  const queryClient = useQueryClient()
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useMutation({
    mutationFn: updateDeliveryStatus,
    onSuccess: (data, variables) => {
      // ✅ INVALIDAÇÃO AGRESSIVA - limpar TODO cache relacionado
      queryClient.invalidateQueries({ queryKey: ['deliveries'] })
      queryClient.invalidateQueries({ queryKey: ['deliveries', tenantKey] })
      queryClient.invalidateQueries({ queryKey: ['delivery-stats'] })
      queryClient.invalidateQueries({ queryKey: ['delivery-stats', tenantKey] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      
      // ✅ RESETAR queries para forçar reload completo
      queryClient.resetQueries({ queryKey: ['deliveries', tenantKey] })
      queryClient.resetQueries({ queryKey: ['delivery-stats', tenantKey] })
      
      // ✅ FORÇAR refetch imediato com delay
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['deliveries', tenantKey], type: 'all' })
        queryClient.refetchQueries({ queryKey: ['delivery-stats', tenantKey], type: 'all' })
      }, 100)
      
      toast.success(`✅ Status do delivery atualizado para: ${variables.status}`)
      console.log('✅ Delivery status updated:', { deliveryId: variables.deliveryId, status: variables.status })
    },
    onError: (error) => {
      toast.error(`❌ Erro ao atualizar delivery: ${error.message}`)
      console.error('❌ Erro ao atualizar delivery:', error)
    }
  })
}