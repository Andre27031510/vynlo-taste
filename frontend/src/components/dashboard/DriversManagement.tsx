'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { 
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Car,
  Star,
  Edit,
  Eye,
  Trash2,
  Plus,
  X,
  Save,
  RefreshCw,
  Search,
  Clock
} from 'lucide-react'
import { useDriversQuery, useDriversStatsQuery, Driver } from '@/hooks/useDriversQuery'
import { useDebounce } from '@/hooks/useDebounce'

// Skeleton components - Memoizados
const DriverSkeleton = memo(() => (
  <div className="card-primary rounded-2xl p-4 animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
      <div className="text-right space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      <div className="flex space-x-2">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
      </div>
    </div>
  </div>
))
DriverSkeleton.displayName = 'DriverSkeleton'

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

// Componente de card de motorista memoizado
const DriverCard = memo(({ driver, onViewDriver }: {
  driver: Driver
  onViewDriver: (driver: Driver) => void
}) => {
  const statusColor = useMemo(() => {
    const colors = {
      available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      busy: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      offline: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
    return colors[driver.status] || colors.offline
  }, [driver.status])
  
  const statusLabel = useMemo(() => {
    const labels = {
      available: 'Disponível',
      busy: 'Ocupado',
      offline: 'Offline'
    }
    return labels[driver.status] || 'Offline'
  }, [driver.status])
  
  const initial = useMemo(() => driver.name.charAt(0), [driver.name])

  return (
    <div className="card-primary rounded-2xl p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-manrope font-bold text-sm">{initial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-primary font-manrope truncate">{driver.name}</h3>
            <p className="text-xs sm:text-sm text-secondary font-manrope">{driver.phone}</p>
          </div>
        </div>
        <div className="flex justify-end sm:block">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="mb-3 space-y-1">
        <p className="text-xs sm:text-sm text-secondary font-manrope flex items-center space-x-2">
          <Car className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{driver.vehicle} • {driver.plate}</span>
        </p>
        <p className="text-xs sm:text-sm text-secondary font-manrope flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
          <span>{driver.rating} • {driver.deliveries} entregas</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <div className="text-xs text-muted font-manrope truncate order-2 sm:order-1">
          {driver.email}
        </div>
        
        <div className="flex space-x-2 order-1 sm:order-2">
          <button 
            onClick={() => onViewDriver(driver)}
            className="p-1 sm:p-2 text-secondary hover:text-blue-600 transition-colors duration-200"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button 
            className="p-1 sm:p-2 text-secondary hover:text-green-600 transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
})
DriverCard.displayName = 'DriverCard'

export default function DriversManagement() {
  const [showModal, setShowModal] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [driverForm, setDriverForm] = useState({
    name: '',
    phone: '',
    email: '',
    cpf: '',
    cnh: '',
    vehicle: '',
    plate: '',
    address: ''
  })

  // Debounce da busca para melhor performance
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Reset da página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, statusFilter])

  // Usando TanStack Query para buscar dados com filtros
  const { 
    data: driversData, 
    isLoading: driversLoading, 
    error: driversError,
    refetch: refetchDrivers 
  } = useDriversQuery({
    status: statusFilter,
    search: debouncedSearchTerm,
    page: currentPage,
    limit: pageSize
  })

  const drivers = driversData?.drivers || []
  const totalPages = driversData?.totalPages || 1
  const totalDrivers = driversData?.total || 0

  const { 
    data: stats, 
    isLoading: statsLoading 
  } = useDriversStatsQuery()

  // Funções memoizadas para gerenciar motoboys
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    console.log('Cadastrando motoboy:', driverForm)
    setShowModal(false)
    setDriverForm({ name: '', phone: '', email: '', cpf: '', cnh: '', vehicle: '', plate: '', address: '' })
  }, [driverForm])
  
  const resetForm = useCallback(() => {
    setDriverForm({ name: '', phone: '', email: '', cpf: '', cnh: '', vehicle: '', plate: '', address: '' })
  }, [])

  const handleViewDriver = useCallback((driver: Driver) => {
    setSelectedDriver(driver)
  }, [])

  // Os filtros agora são aplicados no backend via query parameters
  const filteredDrivers = drivers

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-manrope font-bold text-primary">Gestão de Motoboys</h1>
          <p className="text-secondary font-manrope text-sm sm:text-base">Cadastre e gerencie seus entregadores</p>
          {driversError && (
            <div className="mt-2 flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Usando dados de demonstração - API em desenvolvimento</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between sm:justify-end space-x-3">
          {!driversError && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium">API Conectada</span>
            </div>
          )}
          <button
            onClick={() => refetchDrivers()}
            disabled={driversLoading}
            className="p-2 text-secondary hover:text-primary transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${driversLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary px-3 sm:px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Motoboy</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </div>

      {/* Filtros - Simplificado */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar motoboy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-primary pl-10 pr-4 py-2 w-full rounded-lg font-manrope"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-primary px-3 py-2 rounded-lg font-manrope"
        >
          <option value="all">Todos</option>
          <option value="available">Disponível</option>
          <option value="busy">Ocupado</option>
          <option value="offline">Offline</option>
        </select>
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
                  <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-secondary font-manrope text-xs sm:text-sm">Total</p>
                  <p className="text-xl sm:text-2xl font-manrope font-bold text-primary">
                    {stats.totalDrivers}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-primary rounded-2xl p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <Car className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-secondary font-manrope text-xs sm:text-sm">Disponíveis</p>
                  <p className="text-xl sm:text-2xl font-manrope font-bold text-primary">
                    {stats.available}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-primary rounded-2xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-secondary font-manrope text-xs sm:text-sm">Avaliação</p>
                  <p className="text-xl sm:text-2xl font-manrope font-bold text-primary">
                    {stats.averageRating.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Driver Cards - Simplificado */}
      <div className="space-y-4">
        {driversLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <DriverSkeleton key={index} />
          ))
        ) : driversError ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <X className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Erro ao carregar motoboys
            </h3>
            <button
              onClick={() => refetchDrivers()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum motoboy encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Ajuste os filtros.' 
                : 'Cadastre um novo motoboy.'}
            </p>
          </div>
        ) : (
          filteredDrivers.map((driver) => (
            <DriverCard 
              key={driver.id} 
              driver={driver}
              onViewDriver={handleViewDriver}
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
              disabled={currentPage === 1 || driversLoading}
              className="px-2 sm:px-3 py-1 border border-adaptive rounded text-xs sm:text-sm hover:bg-adaptive disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || driversLoading}
              className="px-2 sm:px-3 py-1 border border-adaptive rounded text-xs sm:text-sm hover:bg-adaptive disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {/* Modal Responsivo */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
          <div className="card-primary rounded-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-primary font-manrope">Novo Motoboy</h3>
                <button onClick={() => setShowModal(false)} className="text-muted hover:text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    value={driverForm.name}
                    onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                    className="input-primary w-full px-3 py-2 rounded-lg font-manrope text-sm"
                    placeholder="Nome completo"
                  />
                </div>
                
                <div>
                  <input
                    type="tel"
                    required
                    value={driverForm.phone}
                    onChange={(e) => setDriverForm({...driverForm, phone: e.target.value})}
                    className="input-primary w-full px-3 py-2 rounded-lg font-manrope text-sm"
                    placeholder="Telefone"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    required
                    value={driverForm.email}
                    onChange={(e) => setDriverForm({...driverForm, email: e.target.value})}
                    className="input-primary w-full px-3 py-2 rounded-lg font-manrope text-sm"
                    placeholder="E-mail"
                  />
                </div>
                
                <div>
                  <select
                    required
                    value={driverForm.vehicle}
                    onChange={(e) => setDriverForm({...driverForm, vehicle: e.target.value})}
                    className="input-primary w-full px-3 py-2 rounded-lg font-manrope text-sm"
                  >
                    <option value="">Selecione o veículo</option>
                    <option value="Moto 125cc">Moto 125cc</option>
                    <option value="Moto 150cc">Moto 150cc</option>
                    <option value="Bicicleta">Bicicleta</option>
                  </select>
                </div>
                
                <div>
                  <input
                    type="text"
                    required
                    value={driverForm.plate}
                    onChange={(e) => setDriverForm({...driverForm, plate: e.target.value})}
                    className="input-primary w-full px-3 py-2 rounded-lg font-manrope text-sm"
                    placeholder="Placa do veículo"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-ghost w-full sm:flex-1 px-4 py-2 rounded-lg font-manrope font-medium text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary w-full sm:flex-1 px-4 py-2 rounded-lg font-manrope font-medium text-sm"
                  >
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes - Responsivo */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
          <div className="card-primary rounded-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-primary font-manrope">Detalhes do Motoboy</h3>
                <button onClick={() => setSelectedDriver(null)} className="text-muted hover:text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-manrope font-bold text-sm sm:text-base">{selectedDriver.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-primary font-manrope text-sm sm:text-base truncate">{selectedDriver.name}</h4>
                    <p className="text-xs sm:text-sm text-secondary">{selectedDriver.phone}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-secondary flex items-center space-x-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="break-all">{selectedDriver.email}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-secondary flex items-center space-x-2">
                    <Car className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{selectedDriver.vehicle} • {selectedDriver.plate}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-secondary flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                    <span>{selectedDriver.rating} • {selectedDriver.deliveries} entregas</span>
                  </p>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={() => setSelectedDriver(null)}
                    className="btn-ghost w-full px-4 py-2 rounded-lg font-manrope font-medium text-sm"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}