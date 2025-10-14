'use client'
// Otimizado para produção - v2.1.2 - Type-safe stats
// Deploy: 2025-10-11

import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import ErrorBoundary from '@/components/ErrorBoundary'
import { formatCurrency } from '@/utils/format'
// Modified: 2025-10-14 18:05 UTC | Mock clients as empty arrays to prevent build error (verified ✓)
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Clock,
  Truck,
  Star,
  AlertCircle,
  Plus,
  UserPlus,
  Crown,
  Trophy,
  Target,
  Bell,
  MessageSquare,
  X,
  Save,
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Zap,
  Activity,
  CreditCard,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

function DashboardHomeContent() {
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [clientModalTab, setClientModalTab] = useState('register')
  const { currentTheme } = useTheme()
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
  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    preferences: ''
  })

  // Hook para métricas em tempo real
  const { stats: statsData, loading: statsLoading, error: statsError, refetch } = useDashboardStats()
  
  // Type-safe stats (garantir que não dará erro TypeScript)
  const stats = statsData || {
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeDrivers: 0,
    totalClients: 0,
    systemHealth: { orders: 'down', payments: 'down', delivery: 'down', integrations: 'down' }
  }

  // Estados para notificações em tempo real
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'order' | 'payment' | 'delivery' | 'system'
    title: string
    message: string
    timestamp: Date
    read: boolean
  }>>([])

  // Estados para fluxo automático
  const [autoSync, setAutoSync] = useState(true)
  const [syncStatus, setSyncStatus] = useState('synced')

  // ✅ MOCK DATA REMOVIDO (Modified: 2025-10-14 17:45 UTC)
  // topClients e registeredClients devem vir de useClientsQuery
  // TODO: Implementar seção "Top Clientes" com API real
  const topClients: any[] = []
  const registeredClients: any[] = []

  // Auto-sync com APIs reais
  useEffect(() => {
    if (!autoSync) return

    const updateInterval = setInterval(() => {
      refetch()
    }, 30000) // Atualiza a cada 30 segundos

    return () => clearInterval(updateInterval)
  }, [autoSync, refetch])

  // Simular notificações em tempo real - Reduzido para 3 notificações
  useEffect(() => {
    if (!autoSync) return

    const notificationInterval = setInterval(() => {
      const newNotification = {
        id: Date.now().toString(),
        type: ['order', 'payment', 'delivery', 'system'][Math.floor(Math.random() * 4)] as 'order' | 'payment' | 'delivery' | 'system',
        title: 'Nova Atividade',
        message: 'Sistema atualizado com sucesso',
        timestamp: new Date(),
        read: false
      }
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 2)])
    }, 10000)

    return () => clearInterval(notificationInterval)
  }, [autoSync])

  const handleDriverSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault()
      console.log('Cadastrando entregador:', driverForm)
      setShowDriverModal(false)
      setDriverForm({
        name: '', phone: '', email: '', cpf: '', cnh: '', vehicle: '', plate: '', address: ''
      })
    } catch (error) {
      console.error('Erro ao cadastrar entregador:', error)
    }
  }

  const handleClientSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault()
      console.log('Cadastrando cliente:', clientForm)
      setShowClientModal(false)
      setClientForm({
        name: '', phone: '', email: '', address: '', birthDate: '', preferences: ''
      })
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header com Métricas em Tempo Real */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Dashboard Vynlo Taste</h1>
          <p className="text-secondary text-lg">Visão geral completa do seu restaurante em tempo real</p>
          {statsError && (
            <div className="mt-2 flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Usando dados de fallback - Verifique a conexão com a API</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
              autoSync 
                ? 'btn-success' 
                : 'btn-secondary'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="font-medium">
              {autoSync ? 'Sincronização Ativa' : 'Sincronização Inativa'}
            </span>
            {statsLoading && <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>}
          </button>
          <button
            onClick={() => setShowDriverModal(true)}
            className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span className="font-medium">Adicionar Entregador</span>
          </button>
          <button
            onClick={() => setShowClientModal(true)}
            className="btn-outline px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span className="font-medium">Adicionar Cliente</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas em Tempo Real - Reduzido para 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-primary rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Pedidos</p>
              <p className="text-2xl font-bold text-primary">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded"></div>
                ) : (
                  stats.totalOrders
                )}
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12%</span>
          </div>
        </div>
        
        <div className="card-primary rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Receita Total</p>
              <p className="text-2xl font-bold text-primary">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-20 rounded"></div>
                ) : (
                  formatCurrency(stats?.totalRevenue)
                )}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+8%</span>
          </div>
        </div>
        
        <div className="card-primary rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Clientes Ativos</p>
              <p className="text-2xl font-bold text-primary">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded"></div>
                ) : (
                  stats.totalClients
                )}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Online</span>
          </div>
        </div>
      </div>

      {/* Status do Sistema - Simplificado */}
      <div className="card-primary rounded-2xl p-6">
        <h3 className="label-primary text-lg mb-4">Status do Sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-secondary">Pedidos</span>
            <span className={`font-medium ${
              stats.systemHealth.orders === 'up' ? 'text-green-600 dark:text-green-400' :
              stats.systemHealth.orders === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {stats.systemHealth.orders === 'up' ? 'OK' :
               stats.systemHealth.orders === 'warning' ? 'Atenção' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Pagamentos</span>
            <span className={`font-medium ${
              stats.systemHealth.payments === 'up' ? 'text-green-600 dark:text-green-400' :
              stats.systemHealth.payments === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {stats.systemHealth.payments === 'up' ? 'OK' :
               stats.systemHealth.payments === 'warning' ? 'Atenção' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Delivery</span>
            <span className={`font-medium ${
              stats.systemHealth.delivery === 'up' ? 'text-green-600 dark:text-green-400' :
              stats.systemHealth.delivery === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {stats.systemHealth.delivery === 'up' ? 'OK' :
               stats.systemHealth.delivery === 'warning' ? 'Atenção' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Integrações</span>
            <span className={`font-medium ${
              stats.systemHealth.integrations === 'up' ? 'text-green-600 dark:text-green-400' :
              stats.systemHealth.integrations === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {stats.systemHealth.integrations === 'up' ? 'OK' :
               stats.systemHealth.integrations === 'warning' ? 'Atenção' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Clientes */}
      <div className="card-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="label-primary text-lg">Top Clientes</h3>
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="text-secondary">Clientes VIP</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {topClients.map((client, index) => (
            <div key={client.id} className="flex items-center justify-between p-4 bg-adaptive rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                  {index === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
                  {index === 2 && <Trophy className="w-5 h-5 text-orange-600" />}
                  <span className="text-lg font-bold text-primary">#{index + 1}</span>
                </div>
                
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {client.avatar}
                </div>
                
                <div>
                  <h4 className="label-primary">{client.name}</h4>
                  <p className="text-secondary">
                    {client.orders} pedidos • 
                  </p>
                  <p className="text-xs text-muted">
                    Favorito: {client.favorite}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="btn-ghost p-2">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="btn-ghost p-2">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notificações em Tempo Real */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-theme">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-theme">Notificações em Tempo Real</h3>
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-4 rounded-xl border transition-all duration-200 ${
              notification.type === 'order' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
              notification.type === 'payment' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
              notification.type === 'delivery' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
              'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.type === 'order' ? 'bg-blue-100 dark:bg-blue-800' :
                    notification.type === 'payment' ? 'bg-green-100 dark:bg-green-800' :
                    notification.type === 'delivery' ? 'bg-yellow-100 dark:bg-yellow-800' :
                    'bg-gray-100 dark:bg-gray-600'
                  }`}>
                    {notification.type === 'order' && <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    {notification.type === 'payment' && <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />}
                    {notification.type === 'delivery' && <Truck className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                    {notification.type === 'system' && <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white transition-theme">{notification.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-theme">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 transition-theme">
                      {notification.timestamp.toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Novo Entregador */}
      {showDriverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Novo Entregador</h3>
                <button
                  onClick={() => setShowDriverModal(false)}
                  className="btn-ghost text-white/80 hover:text-white transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleDriverSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-primary mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={driverForm.name}
                    onChange={(e) => setDriverForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="label-primary mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={driverForm.phone}
                    onChange={(e) => setDriverForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="label-primary mb-2">Email</label>
                  <input
                    type="email"
                    value={driverForm.email}
                    onChange={(e) => setDriverForm(prev => ({ ...prev, email: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="label-primary mb-2">CPF</label>
                  <input
                    type="text"
                    value={driverForm.cpf}
                    onChange={(e) => setDriverForm(prev => ({ ...prev, cpf: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="label-primary mb-2">CNH</label>
                  <input
                    type="text"
                    value={driverForm.cnh}
                    onChange={(e) => setDriverForm(prev => ({ ...prev, cnh: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="label-primary mb-2">Veículo</label>
                  <input
                    type="text"
                    value={driverForm.vehicle}
                    onChange={(e) => setDriverForm(prev => ({ ...prev, vehicle: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="label-primary mb-2">Placa</label>
                  <input
                    type="text"
                    value={driverForm.plate}
                    onChange={(e) => setDriverForm(prev => ({ ...prev, plate: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="label-primary mb-2">Endereço</label>
                  <input
                    type="text"
                    value={driverForm.address}
                    onChange={(e) => setDriverForm(prev => ({ ...prev, address: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-adaptive">
                <button
                  type="button"
                  onClick={() => setShowDriverModal(false)}
                  className="btn-ghost px-6 py-3 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-3 rounded-xl font-bold"
                >
                  Cadastrar Entregador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Cliente */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Novo Cliente</h3>
                <button
                  onClick={() => setShowClientModal(false)}
                  className="btn-ghost text-white/80 hover:text-white transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleClientSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-primary mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={clientForm.name}
                    onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="label-primary mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="label-primary mb-2">Email</label>
                  <input
                    type="email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="label-primary mb-2">Data de Nascimento</label>
                  <input
                    type="date"
                    value={clientForm.birthDate}
                    onChange={(e) => setClientForm(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="label-primary mb-2">Endereço</label>
                  <input
                    type="text"
                    value={clientForm.address}
                    onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="label-primary mb-2">Preferências</label>
                  <textarea
                    value={clientForm.preferences}
                    onChange={(e) => setClientForm(prev => ({ ...prev, preferences: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    rows={3}
                    placeholder="Alergias, preferências alimentares, etc."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-adaptive">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="btn-ghost px-6 py-3 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-success px-6 py-3 rounded-xl font-bold"
                >
                  Cadastrar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardHome() {
  return (
    <ErrorBoundary 
      componentName="Dashboard Home"
      retryCount={3}
      onError={(error, errorInfo) => {
        console.error('Dashboard Home Error:', {
          error: error.message,
          component: 'DashboardHome',
          timestamp: new Date().toISOString()
        })
      }}
    >
      <DashboardHomeContent />
    </ErrorBoundary>
  )
}
