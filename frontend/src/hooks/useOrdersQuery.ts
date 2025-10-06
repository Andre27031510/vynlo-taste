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
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => fetchOrders(filters),
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Refetch a cada minuto
    retry: 1, // Tentar apenas 1 vez antes de usar fallback
    retryDelay: 1000
  })
}

export const useOrdersStatsQuery = () => {
  return useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: fetchOrdersStats,
    staleTime: 60000, // 1 minuto
    retry: 1,
    retryDelay: 1000
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