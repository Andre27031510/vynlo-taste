'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  Truck, 
  X, 
  Eye, 
  Plus,
  Search,
  Phone,
  MapPin,
  User,
  CreditCard,
  DollarSign,
  Zap
} from 'lucide-react'

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'in_transit' | 'delivered' | 'cancelled'

interface Order {
  id: string
  customer: {
    name: string
    phone: string
    address: string
  }
  items: {
    name: string
    quantity: number
    price: number
    notes?: string
  }[]
  total: number
  status: OrderStatus
  createdAt: Date
  estimatedTime: number
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  driver?: string
  paymentId?: string
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Estados para fluxo automático
  const [autoProcessing, setAutoProcessing] = useState(true)
  const [processingStats, setProcessingStats] = useState({
    totalOrders: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    lastUpdate: new Date()
  })

  // Simular recebimento automático de novos pedidos
  useEffect(() => {
    if (!autoProcessing) return

    const orderInterval = setInterval(() => {
      simulateNewOrder()
    }, 15000) // A cada 15 segundos

    return () => clearInterval(orderInterval)
  }, [autoProcessing])

  // Simular processamento automático de pagamentos
  useEffect(() => {
    if (!autoProcessing) return

    const paymentInterval = setInterval(() => {
      processPendingPayments()
    }, 8000) // A cada 8 segundos

    return () => clearInterval(paymentInterval)
  }, [autoProcessing])

  // Atualizar estatísticas automaticamente
  useEffect(() => {
    updateProcessingStats()
  }, [orders])

  // Carregar pedidos reais da API
  const loadOrders = async () => {
    try {
      // TODO: Implementar chamada para API real
      // const response = await fetch('/api/orders');
      // const data = await response.json();
      // setOrders(data);
      console.log('Carregando pedidos da API...');
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  }

  // Processar pagamentos pendentes automaticamente
  const processPendingPayments = () => {
    const pendingOrders = orders.filter(order => order.paymentStatus === 'pending')
    
    if (pendingOrders.length > 0) {
      // Simular processamento de pagamento
      const randomOrder = pendingOrders[Math.floor(Math.random() * pendingOrders.length)]
      
      // Simular sucesso ou falha no pagamento
      const paymentSuccess = Math.random() > 0.2 // 80% de sucesso
      
      if (paymentSuccess) {
        // Pagamento aprovado
        setOrders(prev => prev.map(order => 
          order.id === randomOrder.id 
            ? { ...order, paymentStatus: 'paid', paymentId: `p${Date.now()}` }
            : order
        ))
        
        // Em um sistema real, aqui enviaríamos para o fluxo de caixa
        console.log(`Pagamento aprovado para pedido ${randomOrder.id}`)
        
        // Simular atualização automática do status do pedido
        setTimeout(() => {
          setOrders(prev => prev.map(order => 
            order.id === randomOrder.id 
              ? { ...order, status: 'preparing' }
              : order
          ))
        }, 2000)
        
      } else {
        // Pagamento falhou
        setOrders(prev => prev.map(order => 
          order.id === randomOrder.id 
            ? { ...order, paymentStatus: 'failed' }
            : order
        ))
        
        console.log(`Pagamento falhou para pedido ${randomOrder.id}`)
      }
      
      // Atualizar estatísticas
      updateProcessingStats()
    }
  }

  // Atualizar estatísticas de processamento
  const updateProcessingStats = () => {
    const totalOrders = orders.length
    const pendingPayments = orders.filter(order => order.paymentStatus === 'pending').length
    const totalRevenue = orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0)

    setProcessingStats({
      totalOrders,
      pendingPayments,
      totalRevenue,
      lastUpdate: new Date()
    })

    // Em um sistema real, aqui enviaríamos as estatísticas para o dashboard principal
    console.log('Estatísticas atualizadas:', { totalOrders, pendingPayments, totalRevenue })
  }

  // Função para sincronizar com módulo de pagamentos
  const syncWithPaymentSystem = () => {
    const paidOrders = orders.filter(order => order.paymentStatus === 'paid')
    
    // Em um sistema real, aqui enviaríamos os dados para o módulo de pagamentos
    console.log('Sincronizando com módulo de pagamentos:', paidOrders)
    
    // Simular confirmação de sincronização
    setTimeout(() => {
      console.log('Sincronização com módulo de pagamentos concluída!')
    }, 1000)
  }

  // Função para sincronizar com fluxo de caixa
  const syncWithCashFlow = () => {
    const completedOrders = orders.filter(order => 
      order.paymentStatus === 'paid' && order.status === 'delivered'
    )
    
    // Em um sistema real, aqui enviaríamos os dados para o fluxo de caixa
    console.log('Sincronizando com fluxo de caixa:', completedOrders)
    
    // Simular confirmação de sincronização
    setTimeout(() => {
      console.log('Sincronização com fluxo de caixa concluída!')
    }, 1000)
  }

  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    preparing: { label: 'Preparando', color: 'bg-blue-100 text-blue-800', icon: ShoppingCart },
    ready: { label: 'Pronto', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    in_transit: { label: 'Saiu p/ Entrega', color: 'bg-purple-100 text-purple-800', icon: Truck },
    delivered: { label: 'Entregue', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: X }
  }

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    
    // Atualizar estatísticas automaticamente
    updateProcessingStats()
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch = order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getTimeElapsed = (createdAt: Date) => {
    const minutes = Math.floor((Date.now() - createdAt.getTime()) / 60000)
    return minutes < 60 ? `${minutes}min` : `${Math.floor(minutes / 60)}h ${minutes % 60}min`
  }

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas em Tempo Real */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-manrope font-bold text-primary">Gestão de Pedidos</h1>
          <p className="text-secondary font-manrope">Controle completo dos pedidos em tempo real</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={syncWithPaymentSystem}
            className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span className="font-manrope">Sincronizar Pagamentos</span>
          </button>
          <button 
            onClick={syncWithCashFlow}
            className="btn-success px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <DollarSign className="w-4 h-4" />
            <span className="font-manrope">Sincronizar Fluxo de Caixa</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card-primary rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-primary text-blue-600">Total de Pedidos</p>
              <p className="text-2xl font-bold text-primary">{processingStats.totalOrders}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card-primary rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-primary text-yellow-600">Pagamentos Pendentes</p>
              <p className="text-2xl font-bold text-primary">{processingStats.pendingPayments}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="card-primary rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-primary text-green-600">Receita Total</p>
              <p className="text-2xl font-bold text-primary">R$ {processingStats.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="card-primary rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-primary text-purple-600">Última Atualização</p>
              <p className="label-secondary">
                {processingStats.lastUpdate.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Controles de Filtro */}
      <div className="card-primary rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por cliente ou ID do pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-primary w-full pl-10 pr-4 py-3 rounded-lg"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="input-primary px-4 py-3 rounded-lg"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="preparing">Preparando</option>
              <option value="ready">Pronto</option>
              <option value="in_transit">Saiu p/ Entrega</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
            
            <button
              onClick={() => setAutoProcessing(!autoProcessing)}
              className={`px-4 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                autoProcessing 
                  ? 'btn-success' 
                  : 'btn-secondary'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="font-manrope">
                {autoProcessing ? 'Automático Ativo' : 'Automático Inativo'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="card-primary rounded-2xl">
        <div className="p-6 border-b border-adaptive">
          <h3 className="label-primary text-lg">
            Pedidos ({filteredOrders.length})
          </h3>
        </div>
        
        <div className="divide-y divide-adaptive">
          {filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon
            const paymentStatusColor = {
              pending: 'badge-warning',
              paid: 'badge-success',
              failed: 'badge-danger',
              refunded: 'badge-info'
            }[order.paymentStatus]

            return (
              <div key={order.id} className="p-6 hover-primary transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${statusConfig[order.status].color}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="label-primary text-lg">
                          {order.id}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColor}`}>
                          {order.paymentStatus === 'paid' ? 'Pago' : 
                           order.paymentStatus === 'pending' ? 'Pendente' :
                           order.paymentStatus === 'failed' ? 'Falhou' : 'Estornado'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-secondary">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{order.customer.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{order.customer.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{order.customer.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-manrope font-bold text-primary">
                      R$ {order.total.toFixed(2)}
                    </div>
                    <div className="text-secondary">
                      {getTimeElapsed(order.createdAt)} atrás
                    </div>
                    <div className="text-secondary">
                      {order.paymentMethod}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm text-secondary">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="btn-ghost p-2 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="input-primary px-3 py-2 rounded-lg text-sm"
                      >
                        <option value="pending">Pendente</option>
                        <option value="preparing">Preparando</option>
                        <option value="ready">Pronto</option>
                        <option value="in_transit">Saiu p/ Entrega</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal de Detalhes do Pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-manrope font-bold text-primary">
                  Detalhes do Pedido {selectedOrder.id}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn-ghost p-2 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="label-primary mb-2">Cliente</h4>
                  <div className="bg-adaptive p-3 rounded-lg">
                    <p className="text-secondary"><strong>Nome:</strong> {selectedOrder.customer.name}</p>
                    <p className="text-secondary"><strong>Telefone:</strong> {selectedOrder.customer.phone}</p>
                    <p className="text-secondary"><strong>Endereço:</strong> {selectedOrder.customer.address}</p>
                  </div>
                </div>

                <div>
                  <h4 className="label-primary mb-2">Itens</h4>
                  <div className="bg-adaptive p-3 rounded-lg">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-1">
                        <span className="text-secondary">{item.quantity}x {item.name}</span>
                        <span className="text-secondary">R$ {(item.quantity * item.price).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-adaptive pt-2 mt-2 font-semibold">
                      <span className="text-primary">Total: R$ {selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="label-primary mb-2">Informações do Pedido</h4>
                  <div className="bg-adaptive p-3 rounded-lg">
                    <p className="text-secondary"><strong>Status:</strong> {statusConfig[selectedOrder.status].label}</p>
                    <p className="text-secondary"><strong>Método de Pagamento:</strong> {selectedOrder.paymentMethod}</p>
                    <p className="text-secondary"><strong>Status do Pagamento:</strong> {
                      selectedOrder.paymentStatus === 'paid' ? 'Pago' : 
                      selectedOrder.paymentStatus === 'pending' ? 'Pendente' :
                      selectedOrder.paymentStatus === 'failed' ? 'Falhou' : 'Estornado'
                    }</p>
                    <p className="text-secondary"><strong>Criado em:</strong> {selectedOrder.createdAt.toLocaleString('pt-BR')}</p>
                    <p className="text-secondary"><strong>Tempo Estimado:</strong> {selectedOrder.estimatedTime} minutos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}