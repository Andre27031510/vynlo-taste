import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

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

// API functions
const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch('/api/orders')
  if (!response.ok) {
    throw new Error('Erro ao carregar pedidos')
  }
  return response.json()
}

const fetchOrdersStats = async (): Promise<OrdersStats> => {
  const response = await fetch('/api/orders/stats')
  if (!response.ok) {
    throw new Error('Erro ao carregar estatísticas')
  }
  return response.json()
}

const updateOrderStatus = async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  if (!response.ok) {
    throw new Error('Erro ao atualizar pedido')
  }
  return response.json()
}

// Custom hooks
export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Refetch a cada minuto

  })
}

export const useOrdersStatsQuery = () => {
  return useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: fetchOrdersStats,
    staleTime: 60000, // 1 minuto

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