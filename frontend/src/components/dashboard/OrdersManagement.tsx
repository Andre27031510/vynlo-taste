'use client'

import { useState } from 'react'
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  RefreshCw,
  Filter,
  Search,
  Eye,
  Edit
} from 'lucide-react'
import { useOrdersQuery, useOrdersStatsQuery, useUpdateOrderStatus, Order } from '@/hooks/useOrdersQuery'
import toast from 'react-hot-toast'

// Componente de skeleton para loading
const OrderSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      <div className="flex space-x-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  </div>
)

const StatsSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  </div>
)

export default function OrdersManagement() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Usando TanStack Query para buscar dados
  const { 
    data: orders = [], 
    isLoading: ordersLoading, 
    error: ordersError,
    refetch: refetchOrders 
  } = useOrdersQuery()

  const { 
    data: stats, 
    isLoading: statsLoading 
  } = useOrdersStatsQuery()

  const updateOrderMutation = useUpdateOrderStatus()

  // Filtrar pedidos baseado no status e termo de busca
  const filteredOrders = Array.isArray(orders) ? orders.filter((order: any) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  }) : []

  // Função para atualizar status do pedido
  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderMutation.mutate({ orderId, status: newStatus })
  }

  // Função para obter cor do status
  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      preparing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ready: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      delivered: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status] || colors.pending
  }

  // Função para obter ícone do status
  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      pending: Clock,
      preparing: RefreshCw,
      ready: CheckCircle,
      delivered: Truck,
      cancelled: XCircle
    }
    const IconComponent = icons[status] || Clock
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Pedidos</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie todos os pedidos do restaurante</p>
        </div>
        <button
          onClick={() => refetchOrders()}
          disabled={ordersLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          // Skeleton para stats
          Array.from({ length: 4 }).map((_, index) => (
            <StatsSkeleton key={index} />
          ))
        ) : stats ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total de Pedidos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{(stats as any)?.totalOrders || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{(stats as any)?.pendingOrders || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Concluídos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{(stats as any)?.completedOrders || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">R$</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receita</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    R$ {((stats as any)?.revenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente ou ID do pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="preparing">Preparando</option>
              <option value="ready">Pronto</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {ordersLoading ? (
          // Skeleton loading para pedidos
          Array.from({ length: 6 }).map((_, index) => (
            <OrderSkeleton key={index} />
          ))
        ) : ordersError ? (
          // Estado de erro
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Erro ao carregar pedidos
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">
              Não foi possível carregar os pedidos. Tente novamente.
            </p>
            <button
              onClick={() => refetchOrders()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          // Estado vazio
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há pedidos no momento.'}
            </p>
          </div>
        ) : (
          // Lista de pedidos
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pedido #{order.id}</p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{order.customerName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Itens:</h4>
                <div className="space-y-1">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{item.quantity}x {item.name}</span>
                      <span>R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order.deliveryAddress && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Entrega:</strong> {order.deliveryAddress}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Pagamento:</strong> {order.paymentMethod}
                </div>
                
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'preparing')}
                      disabled={updateOrderMutation.isPending}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      Preparar
                    </button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'ready')}
                      disabled={updateOrderMutation.isPending}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      Pronto
                    </button>
                  )}
                  
                  {order.status === 'ready' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'delivered')}
                      disabled={updateOrderMutation.isPending}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      Entregar
                    </button>
                  )}
                  
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}