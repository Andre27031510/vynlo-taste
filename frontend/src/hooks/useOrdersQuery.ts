// Otimizado para produção - cache 5min, sem auto-refresh
// v2.1.2 - Type-safe queries with generics
// Modified: 2025-10-11-v13 | Orders query optimized - Fixed React Query v5 API (gcTime)
// Modified: 2025-10-14 21:00 UTC | staleTime 30s + refetchOnMount always - pedidos sempre atualizados
// Updated: 2025-10-20 | CRUD completo + mutations multi-tenant
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { apiRequest } from '@/services/api'

// Tipos para pedidos
export interface Order {
  id: string
  customerName: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  createdAt: string
  deliveryAddress?: string
  paymentMethod: string
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface OrdersStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  revenue: number
  averageOrderValue: number
}

const fetchOrders = async (filters?: { status?: string; search?: string; page?: number; limit?: number }): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> => {
  const startTime = Date.now()
  
  const params = new URLSearchParams()
  if (filters?.status && filters.status !== 'all') params.append('status', filters.status)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())
  
  const response = await apiRequest('core-service', `v1/orders?${params.toString()}`)
  const data = await response.json()
  
  console.log(`Orders fetched in ${Date.now() - startTime}ms`)
  return data
}

const fetchOrdersStats = async (): Promise<OrdersStats> => {
  const response = await apiRequest('core-service', 'v1/orders/stats')
  return response.json()
}

const updateOrderStatus = async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
  const response = await apiRequest('core-service', `v1/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
  const data = await response.json()
  
  console.log('Order status updated:', { orderId, status, success: true })
  return data
}



// Custom hooks
export const useOrdersQuery = (filters?: { status?: string; search?: string; page?: number; limit?: number }) => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<{ orders: Order[], total: number, totalPages: number }>({
    queryKey: ['orders', tenantKey, filters],  // ✅ Isolado por tenant
    queryFn: () => fetchOrders(filters),
    staleTime: 30 * 1000, // ✅ 30 segundos - reflete mudanças rapidamente
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true, // Atualiza ao focar janela
    refetchOnMount: true, // ✅ CRÍTICO: true (não 'always') - lista atualiza após criar pedido
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
    retry: 2, // Retry em caso de falha
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  })
}

export const useOrdersStatsQuery = () => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<OrdersStats>({
    queryKey: ['orders-stats', tenantKey],  // ✅ Isolado por tenant
    queryFn: fetchOrdersStats,
    staleTime: 30 * 1000, // ✅ 30 segundos - alinhado com outros stats
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchOnMount: true, // ✅ CRÍTICO: true (não 'always') - stats atualizam após criar pedido
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      // Invalidar queries relacionadas para refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Status do pedido atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar pedido')
    }
  })
}

// ===================================================================
// MUTATIONS CRUD COMPLETO - PADRÃO ENTERPRISE
// ===================================================================

export interface CreateOrderData {
  type: 'DELIVERY' | 'PICKUP' | 'DINE_IN'
  customerId: number
  items: {
    productId: number
    quantity: number
    unitPrice?: number
    itemNotes?: string
  }[]
  deliveryAddress?: string
  notes?: string
  paymentMethod?: string
  contactPhone?: string
  deliveryFee?: number
  discount?: number
  couponCode?: string
}

export interface UpdateOrderData {
  status?: Order['status']
  deliveryAddress?: string
  notes?: string
  paymentMethod?: string
}

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      const response = await apiRequest('core-service', 'v1/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao criar pedido')
      }
      return response.json()
    },
    onSuccess: () => {
      // ✅ INVALIDAÇÃO AGRESSIVA - igual aos produtos
      queryClient.invalidateQueries({ queryKey: ['orders', tenantKey] })
      queryClient.invalidateQueries({ queryKey: ['orders-stats', tenantKey] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      
      // ✅ RESETAR queries para forçar reload completo
      queryClient.resetQueries({ queryKey: ['orders', tenantKey] })
      queryClient.resetQueries({ queryKey: ['orders-stats', tenantKey] })
      
      // ✅ FORÇAR refetch imediato com delay
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['orders', tenantKey], type: 'all' })
        queryClient.refetchQueries({ queryKey: ['orders-stats', tenantKey], type: 'all' })
        queryClient.refetchQueries({ queryKey: ['dashboard-stats'], type: 'all' })
      }, 100)
      
      toast.success('✅ Pedido criado com sucesso!')
      console.log('✅ Pedido criado - cache resetado e refetch agressivo')
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao criar pedido:', error)
      toast.error(error.message || 'Erro ao criar pedido')
    }
  })
}

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient()
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: UpdateOrderData }) => {
      const response = await apiRequest('core-service', `v1/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao atualizar pedido')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', tenantKey] })
      queryClient.invalidateQueries({ queryKey: ['orders-stats', tenantKey] })
      toast.success('✅ Pedido atualizado com sucesso!')
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao atualizar pedido:', error)
      toast.error(error.message || 'Erro ao atualizar pedido')
    }
  })
}

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient()
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiRequest('core-service', `v1/orders/${orderId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao excluir pedido')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', tenantKey] })
      queryClient.invalidateQueries({ queryKey: ['orders-stats', tenantKey] })
      toast.success('✅ Pedido excluído com sucesso!')
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao excluir pedido:', error)
      toast.error(error.message || 'Erro ao excluir pedido')
    }
  })
}