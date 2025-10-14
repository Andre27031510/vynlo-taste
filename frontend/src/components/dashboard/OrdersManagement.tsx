'use client'
// Otimizado para produção - v2.1.2 - Type-safe queries
// Deploy: 2025-10-11

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { formatCurrency, formatDateTime } from '@/utils/format'
// Modified: 2025-10-14 16:42 UTC | Safe formatters applied
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
import { useOrdersQuery, useOrdersStatsQuery, useUpdateOrderStatus, type Order } from '@/hooks/useOrdersQuery'
import { useDebounce } from '@/hooks/useDebounce'
import toast from 'react-hot-toast'
import ErrorBoundary from '@/components/ErrorBoundary'

// Componente de skeleton para loading - Memoizado
const OrderSkeleton = memo(() => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
      <div className="text-right space-y-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
    <div className="flex justify-between items-center">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      <div className="flex space-x-2">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
      </div>
    </div>
  </div>
))
OrderSkeleton.displayName = 'OrderSkeleton'

const StatsSkeleton = memo(() => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  </div>
))
StatsSkeleton.displayName = 'StatsSkeleton'

// Componente de card de pedido memoizado
const OrderCard = memo(({ order, onStatusUpdate, getStatusColor, getStatusIcon, isUpdating }: {
  order: Order
  onStatusUpdate: (orderId: string, newStatus: Order['status']) => void
  getStatusColor: (status: Order['status']) => string
  getStatusIcon: (status: Order['status']) => JSX.Element
  isUpdating: boolean
}) => {
  const formattedDate = useMemo(() => 
    formatDateTime(order.createdAt), 
    [order.createdAt]
  )
  
  const formattedTotal = useMemo(() => 
    formatCurrency(order.total), 
    [order.total]
  )
  
  const itemsText = useMemo(() => 
    `${order.items.length} ${order.items.length === 1 ? 'item' : 'itens'}`, 
    [order.items.length]
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{order.customerName}</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">#{order.id}</p>
        </div>
        <div className="flex justify-between sm:block sm:text-right">
          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            R$ {formattedTotal}
          </p>
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="capitalize">{order.status}</span>
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {itemsText} • {order.paymentMethod}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <div className="text-xs text-gray-500 dark:text-gray-500 order-2 sm:order-1">
          {formattedDate}
        </div>
        
        <div className="flex flex-wrap gap-2 order-1 sm:order-2">
          {order.status === 'pending' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'preparing')}
              disabled={isUpdating}
              className="px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex-1 sm:flex-none"
            >
              Preparar
            </button>
          )}
          
          {order.status === 'preparing' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'ready')}
              disabled={isUpdating}
              className="px-2 sm:px-3 py-1 bg-green-600 text-white text-xs sm:text-sm rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 flex-1 sm:flex-none"
            >
              Pronto
            </button>
          )}
          
          {order.status === 'ready' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'delivered')}
              disabled={isUpdating}
              className="px-2 sm:px-3 py-1 bg-purple-600 text-white text-xs sm:text-sm rounded hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 flex-1 sm:flex-none"
            >
              Entregar
            </button>
          )}
          
          <button className="p-1 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
})
OrderCard.displayName = 'OrderCard'

function OrdersManagementContent() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // Debounce da busca para melhor performance
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Reset da página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, statusFilter])

  // Usando TanStack Query para buscar dados com filtros
  const { 
    data: ordersData, 
    isLoading: ordersLoading, 
    error: ordersError,
    refetch: refetchOrders 
  } = useOrdersQuery({
    status: statusFilter,
    search: debouncedSearchTerm,
    page: currentPage,
    limit: pageSize
  })

  // Type-safe data extraction with proper fallback
  const ordersResponse = ordersData as { orders: Order[], total: number, totalPages: number } | undefined
  const orders = ordersResponse?.orders ?? []
  const totalPages = ordersResponse?.totalPages ?? 1
  const totalOrders = ordersResponse?.total ?? 0

  const { 
    data: statsData, 
    isLoading: statsLoading 
  } = useOrdersStatsQuery()
  
  // Type-safe stats extraction
  const stats = statsData as { total: number, pending: number, completed: number, revenue: number, averageOrderValue: number } | undefined

  const updateOrderMutation = useUpdateOrderStatus()

  // Os filtros agora são aplicados no backend via query parameters
  const filteredOrders = orders

  // Função para atualizar status do pedido - Memoizada
  const handleStatusUpdate = useCallback((orderId: string, newStatus: Order['status']) => {
    updateOrderMutation.mutate({ orderId, status: newStatus })
  }, [updateOrderMutation])

  // Função para obter cor do status - Memoizada
  const getStatusColor = useMemo(() => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      preparing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ready: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      delivered: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return (status: Order['status']) => colors[status] || colors.pending
  }, [])

  // Função para obter ícone do status - Memoizada
  const getStatusIcon = useMemo(() => {
    const icons = {
      pending: Clock,
      preparing: RefreshCw,
      ready: CheckCircle,
      delivered: Truck,
      cancelled: XCircle
    }
    return (status: Order['status']) => {
      const IconComponent = icons[status] || Clock
      return <IconComponent className="w-4 h-4" />
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header - Responsivo */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gestão de Pedidos</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Gerencie todos os pedidos do restaurante</p>

        </div>
        <div className="flex items-center justify-between sm:justify-end space-x-3">
          {!ordersError && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium">API Conectada</span>
            </div>
          )}
          <button
            onClick={() => refetchOrders()}
            disabled={ordersLoading}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statsLoading ? (
          // Skeleton para stats
          Array.from({ length: 3 }).map((_, index) => (
            <StatsSkeleton key={index} />
          ))
        ) : stats ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total de Pedidos</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{(stats as any)?.totalOrders || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{(stats as any)?.pendingOrders || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Concluídos</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{(stats as any)?.completedOrders || 0}</p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Filters - Simplificado */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="all">Todos</option>
          <option value="pending">Pendente</option>
          <option value="preparing">Preparando</option>
          <option value="ready">Pronto</option>
          <option value="delivered">Entregue</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {ordersLoading ? (
          // Skeleton loading para pedidos - Reduzido
          Array.from({ length: 4 }).map((_, index) => (
            <OrderSkeleton key={index} />
          ))
        ) : ordersError ? (
          // Estado de erro - Simplificado
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Erro ao carregar
            </h3>
            <button
              onClick={() => refetchOrders()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          // Estado vazio - Simplificado
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Ajuste os filtros.' 
                : 'Não há pedidos.'}
            </p>
          </div>
        ) : (
          // Lista de pedidos - Simplificada e Memoizada
          filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onStatusUpdate={handleStatusUpdate}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              isUpdating={updateOrderMutation.isPending}
            />
          ))
        )}
      </div>

      {/* Paginação - Responsiva */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            Página {currentPage} de {totalPages}
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || ordersLoading}
              className="px-2 sm:px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || ordersLoading}
              className="px-2 sm:px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrdersManagement() {
  return (
    <ErrorBoundary 
      componentName="Orders Management"
      retryCount={2}
      onError={(error, errorInfo) => {
        console.error('Orders Management Error:', {
          error: error.message,
          component: 'OrdersManagement',
          timestamp: new Date().toISOString()
        })
      }}
    >
      <OrdersManagementContent />
    </ErrorBoundary>
  )
}