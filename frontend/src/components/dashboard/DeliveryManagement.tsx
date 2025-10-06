'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone,
  User,
  Package,
  Navigation,
  CheckCircle,
  AlertCircle,
  XCircle,
  RotateCcw,
  Filter,
  Search,
  DollarSign,
  RefreshCw,
  Eye
} from 'lucide-react'
import { useDeliveriesQuery, useDeliveryStatsQuery, Delivery } from '@/hooks/useDeliveryQuery'
import { useDebounce } from '@/hooks/useDebounce'

// Skeleton components - Memoizados
const DeliverySkeleton = memo(() => (
  <div className="card-primary rounded-2xl p-4 animate-pulse">
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
DeliverySkeleton.displayName = 'DeliverySkeleton'

const StatsSkeleton = memo(() => (
  <div className="card-primary rounded-2xl p-6 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  </div>
))
StatsSkeleton.displayName = 'StatsSkeleton'

// Componente de card de entrega memoizado
const DeliveryCard = memo(({ delivery, getStatusInfo, updateDeliveryStatus, markAsArrived, openMaps, callCustomer }: {
  delivery: Delivery
  getStatusInfo: (status: Delivery['status']) => any
  updateDeliveryStatus: (deliveryId: string, newStatus: Delivery['status']) => void
  markAsArrived: (deliveryId: string) => void
  openMaps: (address: string) => void
  callCustomer: (phone: string) => void
}) => {
  const statusInfo = useMemo(() => getStatusInfo(delivery.status), [getStatusInfo, delivery.status])
  
  const formattedTotal = useMemo(() => 
    delivery.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }), 
    [delivery.total]
  )
  
  const sourceLabel = useMemo(() => {
    const labels = {
      whatsapp: 'WhatsApp',
      ifood: 'iFood',
      balcao: 'Balcão',
      website: 'Website'
    }
    return labels[delivery.source] || 'Website'
  }, [delivery.source])
  
  const sourceColor = useMemo(() => {
    const colors = {
      whatsapp: 'bg-green-400 text-white',
      ifood: 'bg-red-400 text-white',
      balcao: 'bg-blue-400 text-white',
      website: 'bg-purple-400 text-white'
    }
    return colors[delivery.source] || 'bg-purple-400 text-white'
  }, [delivery.source])

  return (
    <div className="card-primary rounded-2xl p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-primary font-manrope">{delivery.customer}</h3>
          <p className="text-xs sm:text-sm text-secondary font-manrope">#{delivery.orderId} • {delivery.id}</p>
        </div>
        <div className="flex justify-between sm:block sm:text-right">
          <p className="text-lg sm:text-xl font-bold text-primary font-manrope">
            R$ {formattedTotal}
          </p>
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </span>
        </div>
      </div>

      <div className="mb-3 space-y-1">
        <p className="text-xs sm:text-sm text-secondary font-manrope flex items-start space-x-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="break-words">{delivery.address}</span>
        </p>
        <p className="text-xs sm:text-sm text-secondary font-manrope flex items-center space-x-2">
          <Truck className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{delivery.driver} • {delivery.estimatedTime} • {delivery.distance}</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <div className="text-xs text-muted font-manrope order-2 sm:order-1">
          {delivery.createdAt}
          {delivery.source && (
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${sourceColor}`}>
              {sourceLabel}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 sm:gap-2 order-1 sm:order-2">
          {delivery.status === 'preparing' && (
            <button 
              onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
              className="px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 transition-colors duration-200 flex-1 sm:flex-none"
            >
              Em Trânsito
            </button>
          )}
          
          {delivery.status === 'in_transit' && (
            <button 
              onClick={() => markAsArrived(delivery.id)}
              className="px-2 sm:px-3 py-1 bg-purple-600 text-white text-xs sm:text-sm rounded hover:bg-purple-700 transition-colors duration-200 flex-1 sm:flex-none"
            >
              Cheguei
            </button>
          )}
          
          {delivery.status === 'arrived' && (
            <button 
              onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
              className="px-2 sm:px-3 py-1 bg-green-600 text-white text-xs sm:text-sm rounded hover:bg-green-700 transition-colors duration-200 flex-1 sm:flex-none"
            >
              Entregue
            </button>
          )}
          
          <button 
            onClick={() => openMaps(delivery.address)}
            className="p-1 sm:p-2 text-secondary hover:text-blue-600 transition-colors duration-200"
          >
            <Navigation className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => callCustomer(delivery.phone)}
            className="p-1 sm:p-2 text-secondary hover:text-green-600 transition-colors duration-200"
          >
            <Phone className="w-4 h-4" />
          </button>
          
          <button className="p-1 sm:p-2 text-secondary hover:text-blue-600 transition-colors duration-200">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
})
DeliveryCard.displayName = 'DeliveryCard'

export default function DeliveryManagement() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // Debounce da busca para melhor performance
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Reset da página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, selectedStatus])

  // Usando TanStack Query para buscar dados com filtros
  const { 
    data: deliveriesData, 
    isLoading: deliveriesLoading, 
    error: deliveriesError,
    refetch: refetchDeliveries 
  } = useDeliveriesQuery({
    status: selectedStatus,
    search: debouncedSearchTerm,
    page: currentPage,
    limit: pageSize
  })

  const deliveries = deliveriesData?.deliveries || []
  const totalPages = deliveriesData?.totalPages || 1
  const totalDeliveries = deliveriesData?.total || 0

  const { 
    data: stats, 
    isLoading: statsLoading 
  } = useDeliveryStatsQuery()

  // Função para obter informações do status - Memoizada
  const getStatusInfo = useMemo(() => {
    const statusMap = {
      preparing: {
        label: 'Preparando',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Package className="w-4 h-4" />,
        bgColor: 'bg-yellow-50'
      },
      in_transit: {
        label: 'Em Trânsito',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Truck className="w-4 h-4" />,
        bgColor: 'bg-blue-50'
      },
      arrived: {
        label: 'Cheguei',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <MapPin className="w-4 h-4" />,
        bgColor: 'bg-purple-50'
      },
      delivered: {
        label: 'Entregue',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: 'bg-green-50'
      },
      problem: {
        label: 'Problema',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-red-50'
      },
      cancelled: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="w-4 h-4" />,
        bgColor: 'bg-red-50'
      }
    }
    
    return (status: Delivery['status']) => {
      return statusMap[status] || {
        label: status,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-gray-50'
      }
    }
  }, [])

  // Funções memoizadas para ações
  const updateDeliveryStatus = useCallback((deliveryId: string, newStatus: Delivery['status'], notes?: string) => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    
    console.log(`🚚 Delivery ${deliveryId} atualizado para ${newStatus} às ${timeString}`)
    if (notes) console.log(`📝 Nota: ${notes}`)
    
    refetchDeliveries()
  }, [refetchDeliveries])

  const openMaps = useCallback((address: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(mapsUrl, '_blank')
    console.log(`🗺️ Abrindo Maps para: ${address}`)
  }, [])

  const callCustomer = useCallback((phone: string) => {
    const phoneNumber = phone.replace(/[^0-9]/g, '')
    window.location.href = `tel:+55${phoneNumber}`
    console.log(`📞 Ligando para cliente: ${phone}`)
  }, [])

  const callDriver = useCallback((driverPhone: string) => {
    const phoneNumber = driverPhone.replace(/[^0-9]/g, '')
    window.location.href = `tel:+55${phoneNumber}`
    console.log(`📱 Ligando para motoboy: ${driverPhone}`)
  }, [])

  const markAsArrived = useCallback((deliveryId: string) => {
    updateDeliveryStatus(deliveryId, 'arrived', 'Motoboy chegou ao destino')
    console.log(`📍 Entrega ${deliveryId} marcada como chegou`)
  }, [updateDeliveryStatus])



  // Os filtros agora são aplicados no backend via query parameters
  const filteredDeliveries = deliveries

  return (
    <div className="space-y-6">
      {/* Header - Responsivo */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-manrope font-bold text-primary">Gestão de Delivery</h1>
          <p className="text-secondary font-manrope text-sm sm:text-base">Controle completo das entregas em tempo real</p>
          {deliveriesError && (
            <div className="mt-2 flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Usando dados de demonstração - API em desenvolvimento</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between sm:justify-end space-x-3">
          {!deliveriesError && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium">API Conectada</span>
            </div>
          )}
          <button
            onClick={() => refetchDeliveries()}
            disabled={deliveriesLoading}
            className="btn-primary px-3 sm:px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2 disabled:opacity-50 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${deliveriesLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <StatsSkeleton key={index} />
          ))
        ) : stats ? (
          <>
            <div className="card-primary rounded-2xl p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-secondary font-manrope text-xs sm:text-sm">Em Trânsito</p>
                  <p className="text-xl sm:text-2xl font-manrope font-bold text-primary">
                    {stats.inTransit}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-primary rounded-2xl p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-secondary font-manrope text-xs sm:text-sm">Preparando</p>
                  <p className="text-xl sm:text-2xl font-manrope font-bold text-primary">
                    {stats.preparing}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-primary rounded-2xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-secondary font-manrope text-xs sm:text-sm">Entregues</p>
                  <p className="text-xl sm:text-2xl font-manrope font-bold text-primary">
                    {stats.delivered}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>



      {/* Filters - Simplificado */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar por cliente, pedido ou entregador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-primary pl-10 pr-4 py-2 w-full rounded-lg font-manrope"
          />
        </div>
        
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input-primary px-4 py-2 rounded-lg font-manrope"
        >
          <option value="all">Todos os Status</option>
          <option value="preparing">Preparando</option>
          <option value="in_transit">Em Trânsito</option>
          <option value="arrived">Cheguei</option>
          <option value="delivered">Entregue</option>
          <option value="problem">Problema</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {/* Delivery Cards - Simplificado */}
      <div className="space-y-4">
        {deliveriesLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <DeliverySkeleton key={index} />
          ))
        ) : deliveriesError ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Erro ao carregar entregas
            </h3>
            <button
              onClick={() => refetchDeliveries()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma entrega encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Ajuste os filtros.' 
                : 'Não há entregas.'}
            </p>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <DeliveryCard 
              key={delivery.id} 
              delivery={delivery}
              getStatusInfo={getStatusInfo}
              updateDeliveryStatus={updateDeliveryStatus}
              markAsArrived={markAsArrived}
              openMaps={openMaps}
              callCustomer={callCustomer}
            />
          ))
        )}
      </div>

      {/* Paginação - Responsiva */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4">
          <div className="text-xs sm:text-sm text-secondary font-manrope text-center sm:text-left">
            Página {currentPage} de {totalPages}
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || deliveriesLoading}
              className="px-2 sm:px-3 py-1 border border-adaptive rounded text-xs sm:text-sm hover:bg-adaptive disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || deliveriesLoading}
              className="px-2 sm:px-3 py-1 border border-adaptive rounded text-xs sm:text-sm hover:bg-adaptive disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

    </div>
  )
}