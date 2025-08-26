'use client'

import { useState } from 'react'
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
  DollarSign
} from 'lucide-react'

interface Delivery {
  id: string
  orderId: string
  customer: string
  address: string
  phone: string
  driver: string
  driverPhone: string
  status: string
  estimatedTime: string
  distance: string
  total: number
  items: string[]
  createdAt: string
  source: string
  lastUpdate?: string
  driverLocation?: string
  mobileSync?: boolean
  notes?: string
  driverPayment?: {
    type: 'fixed' | 'per_delivery' | 'hybrid'
    amount: number
    description?: string
    fixedAmount?: number
    perDeliveryAmount?: number
  }
}

export default function DeliveryManagement() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedDeliveryForPayment, setSelectedDeliveryForPayment] = useState<Delivery | null>(null)
  const [driverPaymentType, setDriverPaymentType] = useState<'fixed' | 'per_delivery' | 'hybrid'>('per_delivery')
  const [driverPaymentAmount, setDriverPaymentAmount] = useState('')
  const [driverPaymentFixedAmount, setDriverPaymentFixedAmount] = useState('')
  const [driverPaymentPerDeliveryAmount, setDriverPaymentPerDeliveryAmount] = useState('')
  const [driverPaymentDescription, setDriverPaymentDescription] = useState('')
  const [deliveries, setDeliveries] = useState<Delivery[]>([

    // Pedidos direcionados do módulo de pedidos aparecem aqui automaticamente
    {
      id: 'DEL001',
      orderId: '#1234',
      customer: 'João Silva',
      address: 'Rua das Flores, 123 - Centro',
      phone: '(11) 99999-9999',
      driver: 'Carlos Santos',
      driverPhone: '(11) 88888-8888',
      status: 'preparing',
      estimatedTime: '25 min',
      distance: '2.5 km',
      total: 45.90,
      items: ['1x Pizza Margherita'],
      createdAt: '14:30',
      source: 'whatsapp',
      lastUpdate: '14:30',
      driverLocation: undefined,
      mobileSync: true
    },
    {
      id: 'DEL002',
      orderId: '#1235',
      customer: 'Maria Santos',
      address: 'Av. Principal, 456 - Bela Vista',
      phone: '(11) 88888-8888',
      driver: 'Roberto Lima',
      driverPhone: '(11) 66666-6666',
      status: 'in_transit',
      estimatedTime: '15 min',
      distance: '1.8 km',
      total: 65.00,
      items: ['2x Hambúrguer Especial'],
      createdAt: '14:45',
      source: 'ifood',
      lastUpdate: '14:50',
      driverLocation: 'Rua das Flores, 50 - Centro',
      mobileSync: true
    },
    {
      id: 'DEL003',
      orderId: '#1236',
      customer: 'Pedro Costa',
      address: 'Rua do Comércio, 789 - Centro',
      phone: '(11) 77777-7777',
      driver: 'Ana Paula',
      driverPhone: '(11) 44444-4444',
      status: 'delivered',
      estimatedTime: 'Entregue',
      distance: '3.2 km',
      total: 28.90,
      items: ['1x Salada Caesar'],
      createdAt: '13:15',
      source: 'balcao',
      lastUpdate: '13:45',
      driverLocation: 'Rua do Comércio, 789 - Centro',
      mobileSync: true
    }
  ])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'preparing':
        return {
          label: 'Preparando',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Package className="w-4 h-4" />,
          bgColor: 'bg-yellow-50'
        }
      case 'in_transit':
        return {
          label: 'Em Trânsito',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Truck className="w-4 h-4" />,
          bgColor: 'bg-blue-50'
        }
      case 'arrived':
        return {
          label: 'Cheguei',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <MapPin className="w-4 h-4" />,
          bgColor: 'bg-purple-50'
        }
      case 'delivered':
        return {
          label: 'Entregue',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-4 h-4" />,
          bgColor: 'bg-green-50'
        }
      case 'problem':
        return {
          label: 'Problema',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertCircle className="w-4 h-4" />,
          bgColor: 'bg-red-50'
        }
      case 'cancelled':
        return {
          label: 'Cancelado',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          bgColor: 'bg-red-50'
        }
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="w-4 h-4" />,
          bgColor: 'bg-gray-50'
        }
    }
  }

  const updateDeliveryStatus = (deliveryId: string, newStatus: string, notes?: string) => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId 
        ? { 
            ...delivery, 
            status: newStatus, 
            lastUpdate: timeString,
            notes: notes || delivery.notes || undefined,
            estimatedTime: newStatus === 'delivered' ? 'Entregue' : delivery.estimatedTime,
            mobileSync: true
          }
        : delivery
    ))
    
    console.log(`🚚 Delivery ${deliveryId} atualizado para ${newStatus} às ${timeString}`)
    if (notes) console.log(`📝 Nota: ${notes}`)
    
    // TODO: Implementar integração com backend e WebSocket para sincronização mobile
    // socket.emit('update_delivery_status', { deliveryId, status: newStatus, timestamp: now, notes })
    
    // Simular sincronização com mobile
    setTimeout(() => {
      console.log(`✅ Status sincronizado com interface mobile`)
    }, 500)
  }

  // Função para abrir Maps com o endereço da entrega
  const openMaps = (address: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(mapsUrl, '_blank')
    console.log(`🗺️ Abrindo Maps para: ${address}`)
  }

  // Função para ligar para o cliente
  const callCustomer = (phone: string) => {
    const phoneNumber = phone.replace(/[^0-9]/g, '')
    window.location.href = `tel:+55${phoneNumber}`
    console.log(`📞 Ligando para cliente: ${phone}`)
  }

  // Função para ligar para o motoboy
  const callDriver = (driverPhone: string) => {
    const phoneNumber = driverPhone.replace(/[^0-9]/g, '')
    window.location.href = `tel:+55${phoneNumber}`
    console.log(`📱 Ligando para motoboy: ${driverPhone}`)
  }

  // Função para cancelar entrega
  const cancelDelivery = (deliveryId: string) => {
    if (confirm('Tem certeza que deseja cancelar esta entrega?')) {
      updateDeliveryStatus(deliveryId, 'cancelled', 'Entrega cancelada pelo administrador')
      console.log(`❌ Entrega ${deliveryId} cancelada`)
    }
  }

  // Função para reativar entrega cancelada
  const reactivateDelivery = (deliveryId: string) => {
    if (confirm('Deseja reativar esta entrega?')) {
      updateDeliveryStatus(deliveryId, 'preparing', 'Entrega reativada')
      console.log(`🔄 Entrega ${deliveryId} reativada`)
    }
  }

  // Função para marcar como "cheguei"
  const markAsArrived = (deliveryId: string) => {
    updateDeliveryStatus(deliveryId, 'arrived', 'Motoboy chegou ao destino')
    console.log(`📍 Entrega ${deliveryId} marcada como chegou`)
  }

  // Função para reportar problema
  const reportProblem = (deliveryId: string) => {
    const problem = prompt('Descreva o problema encontrado:')
    if (problem) {
      updateDeliveryStatus(deliveryId, 'problem', `Problema: ${problem}`)
      console.log(`⚠️ Problema reportado na entrega ${deliveryId}: ${problem}`)
    }
  }

  // Função para retomar entrega após problema
  const resumeDelivery = (deliveryId: string) => {
    updateDeliveryStatus(deliveryId, 'in_transit', 'Entrega retomada após resolução do problema')
    console.log(`▶️ Entrega ${deliveryId} retomada`)
  }

  // Funções para gerenciar pagamentos dos motoboys
  const openPaymentModal = (delivery: Delivery) => {
    setSelectedDeliveryForPayment(delivery)
    setShowPaymentModal(true)
    setDriverPaymentType('per_delivery')
    setDriverPaymentAmount('')
    setDriverPaymentFixedAmount('')
    setDriverPaymentPerDeliveryAmount('')
    setDriverPaymentDescription('')
  }

  const saveDriverPayment = () => {
    if (!selectedDeliveryForPayment) return
    
    let paymentData: any = {
      type: driverPaymentType,
      description: driverPaymentDescription || undefined
    }

    if (driverPaymentType === 'hybrid') {
      // Para pagamento híbrido, precisamos dos dois valores
      const fixedAmount = parseFloat(driverPaymentFixedAmount) || 0
      const perDeliveryAmount = parseFloat(driverPaymentPerDeliveryAmount) || 0
      
      if (fixedAmount <= 0 || perDeliveryAmount <= 0) {
        alert('Para pagamento híbrido, insira valores válidos para ambos os campos')
        return
      }
      
      paymentData = {
        ...paymentData,
        fixedAmount: fixedAmount,
        perDeliveryAmount: perDeliveryAmount,
        amount: fixedAmount + perDeliveryAmount // Total para exibição
      }
    } else {
      // Para pagamentos fixo ou por entrega
      if (!driverPaymentAmount || parseFloat(driverPaymentAmount) <= 0) {
        alert('Por favor, insira um valor válido para o pagamento')
        return
      }
      
      paymentData.amount = parseFloat(driverPaymentAmount)
    }

    setDeliveries(prev => prev.map(delivery => 
      delivery.id === selectedDeliveryForPayment.id 
        ? { ...delivery, driverPayment: paymentData }
        : delivery
    ))

    console.log(`💰 Pagamento configurado para ${selectedDeliveryForPayment.driver}: ${driverPaymentType} - R$ ${paymentData.amount}`)
    
    // TODO: Implementar integração com backend
    // socket.emit('update_driver_payment', { deliveryId: selectedDeliveryForPayment.id, payment: paymentData })
    
    setShowPaymentModal(false)
    setSelectedDeliveryForPayment(null)
  }

  const getTotalDriverPayments = () => {
    return deliveries
      .filter(d => d.driverPayment && d.driverPayment.amount)
      .reduce((total, delivery) => {
        if (delivery.driverPayment?.type === 'fixed') {
          return total + (delivery.driverPayment.amount || 0)
        } else if (delivery.driverPayment?.type === 'per_delivery') {
          return total + (delivery.driverPayment.amount || 0)
        } else if (delivery.driverPayment?.type === 'hybrid') {
          const fixedAmount = delivery.driverPayment.fixedAmount || 0
          const perDeliveryAmount = delivery.driverPayment.perDeliveryAmount || 0
          return total + fixedAmount + perDeliveryAmount
        }
        return total
      }, 0)
  }

  const getDriverEarnings = (driverName: string) => {
    return deliveries
      .filter(d => d.driver === driverName && d.driverPayment && d.driverPayment.amount)
      .reduce((total, delivery) => {
        if (delivery.driverPayment?.type === 'fixed') {
          return total + (delivery.driverPayment.amount || 0)
        } else if (delivery.driverPayment?.type === 'per_delivery') {
          return total + (delivery.driverPayment.amount || 0)
        } else if (delivery.driverPayment?.type === 'hybrid') {
          const fixedAmount = delivery.driverPayment.fixedAmount || 0
          const perDeliveryAmount = delivery.driverPayment.perDeliveryAmount || 0
          return total + fixedAmount + perDeliveryAmount
        }
        return total
      }, 0)
  }

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesStatus = selectedStatus === 'all' || delivery.status === selectedStatus
    const matchesSearch = delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.driver.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-manrope font-bold text-primary">Gestão de Delivery</h1>
          <p className="text-secondary font-manrope">Controle completo das entregas em tempo real</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-muted font-manrope flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>Interface Mobile: <a href="/mobile" className="text-blue-600 hover:underline">/mobile</a></span>
            </span>
            <span className="text-sm text-muted font-manrope flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>Código de Acesso: 1234</span>
            </span>
            <span className="text-sm text-green-600 font-manrope font-medium flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Tempo Real Ativo</span>
            </span>
            <span className="text-sm text-blue-600 font-manrope font-medium flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>Mobile Sincronizado</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-primary px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2">
            <Navigation className="w-4 h-4" />
            <span>Rastrear Todos</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-yellow-600 dark:text-yellow-400 text-sm font-manrope font-medium">
              {deliveries.filter(d => d.status === 'preparing').length} ativos
            </span>
          </div>
          <h3 className="text-2xl font-manrope font-bold text-primary mb-1">
            {deliveries.filter(d => d.status === 'preparing').length}
          </h3>
          <p className="text-secondary font-manrope text-sm">Preparando</p>
        </div>

        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-manrope font-medium">
              {deliveries.filter(d => d.status === 'in_transit').length} em rota
            </span>
          </div>
          <h3 className="text-2xl font-manrope font-bold text-primary mb-1">
            {deliveries.filter(d => d.status === 'in_transit').length}
          </h3>
          <p className="text-secondary font-manrope text-sm">Em Trânsito</p>
        </div>

        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-purple-600 dark:text-purple-400 text-sm font-manrope font-medium">
              {deliveries.filter(d => d.status === 'arrived').length} chegando
            </span>
          </div>
          <h3 className="text-2xl font-manrope font-bold text-primary mb-1">
            {deliveries.filter(d => d.status === 'arrived').length}
          </h3>
          <p className="text-secondary font-manrope text-sm">Chegando</p>
        </div>

        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-green-600 dark:text-green-400 text-sm font-manrope font-medium">
              {deliveries.filter(d => d.status === 'delivered').length} concluídas
            </span>
          </div>
          <h3 className="text-2xl font-manrope font-bold text-primary mb-1">
            {deliveries.filter(d => d.status === 'delivered').length}
          </h3>
          <p className="text-secondary font-manrope text-sm">Entregues</p>
          <div className="mt-2 flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
            <Phone className="w-3 h-3" />
            <span>Mobile Ativo</span>
          </div>
        </div>
      </div>

      {/* Card de Pagamentos dos Motoboys */}
      <div className="card-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary font-manrope flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Pagamentos dos Motoboys</span>
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-secondary font-manrope">Total Hoje:</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400 font-manrope">
              R$ {getTotalDriverPayments().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from(new Set(deliveries.map(d => d.driver))).map(driver => (
            <div key={driver} className="bg-adaptive rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-primary font-manrope">{driver}</span>
                <span className="text-sm text-secondary font-manrope">
                  {deliveries.filter(d => d.driver === driver).length} entregas
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary font-manrope">Ganhos:</span>
                <span className="font-semibold text-green-600 dark:text-green-400 font-manrope">
                  R$ {getDriverEarnings(driver).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card-primary rounded-2xl p-6">
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
        
        {/* Fluxograma de Status */}
        <div className="mt-6 pt-6 border-t border-adaptive">
          <h4 className="text-sm font-manrope font-semibold text-primary mb-3">Fluxo de Status das Entregas:</h4>
          <div className="flex items-center justify-center space-x-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-secondary">Preparando</span>
            </div>
            <span className="text-muted">→</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-secondary">Em Rota</span>
            </div>
            <span className="text-muted">→</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-secondary">Cheguei</span>
            </div>
            <span className="text-muted">→</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-secondary">Entregue</span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className="text-xs text-muted flex items-center justify-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Status atualizados via interface mobile pelos motoboys</span>
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Cards */}
      <div className="grid gap-6">
        {filteredDeliveries.map((delivery) => {
          const statusInfo = getStatusInfo(delivery.status)
          
          return (
            <div key={delivery.id} className={`card-primary rounded-2xl overflow-hidden`}>
              <div className={`${statusInfo.bgColor} dark:bg-opacity-20 px-6 py-4 border-b border-adaptive`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-manrope font-medium text-secondary">Pedido:</span>
                      <span className="font-manrope font-bold text-primary">{delivery.orderId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-manrope font-medium text-secondary">Delivery:</span>
                      <span className="font-manrope font-bold text-primary">{delivery.id}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-manrope font-medium border ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </span>
                      {/* Indicador de Status Mobile */}
                      <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 font-manrope bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <Phone className="w-3 h-3" />
                        <span>Mobile Sincronizado</span>
                      </div>
                    </div>
                    {delivery.source && (
                      <span className={`px-2 py-1 rounded-full text-xs font-manrope font-medium ${
                        delivery.source === 'whatsapp' ? 'bg-green-400 dark:bg-green-800 text-white dark:text-green-100 border border-green-600 dark:border-green-700 font-bold' :
                        delivery.source === 'ifood' ? 'bg-red-400 dark:bg-red-800 text-white dark:text-red-100 border border-red-600 dark:border-red-700 font-bold' :
                        delivery.source === 'balcao' ? 'bg-blue-400 dark:bg-blue-800 text-white dark:text-blue-100 border border-blue-600 dark:border-blue-700 font-bold' :
                        'bg-purple-400 dark:bg-purple-800 text-white dark:text-purple-100 border border-purple-600 dark:border-purple-700 font-bold'
                      }`}>
                        {delivery.source === 'whatsapp' ? 'WhatsApp' :
                         delivery.source === 'ifood' ? 'iFood' :
                         delivery.source === 'balcao' ? 'Balcão' : 'Website'}
                      </span>
                    )}
                    <div className="flex flex-col items-end text-xs text-muted font-manrope">
                      <span>Criado: {delivery.createdAt}</span>
                      {delivery.lastUpdate && delivery.lastUpdate !== delivery.createdAt && (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">Atualizado: {delivery.lastUpdate}</span>
                      )}
                      <span className="text-green-600 dark:text-green-400 font-medium flex items-center space-x-1">
                        <RotateCcw className="w-3 h-3" />
                        <span>Tempo Real</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="font-manrope font-semibold text-primary flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Cliente</span>
                    </h4>
                    <div className="space-y-2">
                      <p className="font-manrope font-medium text-primary">{delivery.customer}</p>
                      <p className="text-sm text-secondary font-manrope flex items-start space-x-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{delivery.address}</span>
                      </p>
                      <p className="text-sm text-secondary font-manrope flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{delivery.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div className="space-y-4">
                    <h4 className="font-manrope font-semibold text-primary flex items-center space-x-2">
                      <Truck className="w-4 h-4" />
                      <span>Entregador</span>
                    </h4>
                    <div className="space-y-2">
                      <p className="font-manrope font-medium text-primary">{delivery.driver}</p>
                      <p className="text-sm text-secondary font-manrope flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{delivery.driverPhone}</span>
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-secondary font-manrope">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{delivery.estimatedTime}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Navigation className="w-4 h-4" />
                          <span>{delivery.distance}</span>
                        </span>
                      </div>
                      {delivery.driverLocation && (
                        <div className="mt-2 p-2 bg-blue-200 dark:bg-blue-800 rounded-lg border border-blue-400 dark:border-blue-600">
                          <p className="text-xs text-blue-950 dark:text-white font-manrope flex items-center space-x-1 font-bold">
                            <MapPin className="w-3 h-3" />
                            <span><strong>Localização do Motoboy:</strong> {delivery.driverLocation}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4">
                    <h4 className="font-manrope font-semibold text-primary flex items-center space-x-2">
                      <Package className="w-4 h-4" />
                      <span>Pedido</span>
                    </h4>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        {delivery.items.map((item, index) => (
                          <p key={index} className="text-sm text-secondary font-manrope">{item}</p>
                        ))}
                      </div>
                      <p className="font-manrope font-bold text-lg text-primary">
                        Total: R$ {delivery.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Notas e Observações */}
                  {delivery.notes && (
                    <div className="space-y-4">
                      <h4 className="font-manrope font-semibold text-primary flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Notas e Observações</span>
                      </h4>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 font-manrope">{delivery.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t border-adaptive">
                  <div className="space-y-3">
                    {/* Status Update Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {delivery.status === 'preparing' && (
                        <button 
                          onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
                          className="btn-primary px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Marcar como Em Trânsito</span>
                        </button>
                      )}
                      
                      {delivery.status === 'in_transit' && (
                        <button 
                          onClick={() => markAsArrived(delivery.id)}
                          className="btn-primary px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Marcar como Cheguei</span>
                        </button>
                      )}
                      
                      {delivery.status === 'arrived' && (
                        <button 
                          onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                          className="btn-success px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Marcar como Entregue</span>
                        </button>
                      )}
                      
                      {['preparing', 'in_transit', 'arrived'].includes(delivery.status) && (
                        <button 
                          onClick={() => reportProblem(delivery.id)}
                          className="btn-danger px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Reportar Problema</span>
                        </button>
                      )}
                      
                      {delivery.status === 'problem' && (
                        <button 
                          onClick={() => resumeDelivery(delivery.id)}
                          className="btn-primary px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Retomar Entrega</span>
                        </button>
                      )}
                      
                      {(delivery.status === 'preparing' || delivery.status === 'in_transit') && (
                        <button 
                          onClick={() => cancelDelivery(delivery.id)}
                          className="btn-secondary px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Cancelar Entrega</span>
                        </button>
                      )}

                      {delivery.status === 'cancelled' && (
                        <button 
                          onClick={() => reactivateDelivery(delivery.id)}
                          className="btn-success px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Reativar Entrega</span>
                        </button>
                      )}
                    </div>
                    
                    {/* Utility Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-adaptive">
                      <button 
                        onClick={() => openMaps(delivery.address)}
                        className="btn-outline px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Rastrear no Maps</span>
                      </button>
                      
                      <button 
                        onClick={() => callCustomer(delivery.phone)}
                        className="btn-outline px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Ligar para Cliente</span>
                      </button>
                      
                      <button 
                        onClick={() => callDriver(delivery.driverPhone)}
                        className="btn-outline px-4 py-2 rounded-lg font-manrope font-medium flex items-center space-x-2"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Ligar para Motoboy</span>
                      </button>

                      <button 
                        onClick={() => openPaymentModal(delivery)}
                        className={`px-4 py-2 rounded-lg font-manrope font-medium transition-colors duration-200 flex items-center space-x-2 ${
                          delivery.driverPayment 
                            ? 'btn-success' 
                            : 'btn-primary'
                        }`}
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>{delivery.driverPayment ? 'Editar Pagamento' : 'Configurar Pagamento'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de Configuração de Pagamento */}
      {showPaymentModal && selectedDeliveryForPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="card-primary rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary font-manrope flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Configurar Pagamento</span>
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="btn-ghost text-muted hover:text-primary"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary font-manrope mb-2">
                  Motoboy
                </label>
                <div className="bg-adaptive rounded-lg p-3">
                  <span className="font-medium text-primary">{selectedDeliveryForPayment.driver}</span>
                  <span className="text-sm text-secondary ml-2">({selectedDeliveryForPayment.driverPhone})</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary font-manrope mb-2">
                  Tipo de Pagamento
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="per_delivery"
                      checked={driverPaymentType === 'per_delivery'}
                      onChange={(e) => setDriverPaymentType(e.target.value as 'fixed' | 'per_delivery' | 'hybrid')}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-secondary">Por Entrega (valor fixo por entrega)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="fixed"
                      checked={driverPaymentType === 'fixed'}
                      onChange={(e) => setDriverPaymentType(e.target.value as 'fixed' | 'per_delivery' | 'hybrid')}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-secondary">Valor Fixo (valor único para esta entrega)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="hybrid"
                      checked={driverPaymentType === 'hybrid'}
                      onChange={(e) => setDriverPaymentType(e.target.value as 'fixed' | 'per_delivery' | 'hybrid')}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-secondary">Híbrido (valor fixo + valor por entrega)</span>
                  </label>
                </div>
              </div>

              {/* Campos condicionais baseados no tipo de pagamento */}
              {driverPaymentType === 'hybrid' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary font-manrope mb-2">
                      Valor Fixo (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={driverPaymentFixedAmount}
                      onChange={(e) => setDriverPaymentFixedAmount(e.target.value)}
                      placeholder="0.00"
                      className="input-primary w-full px-3 py-2 rounded-lg font-manrope"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary font-manrope mb-2">
                      Valor por Entrega (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={driverPaymentPerDeliveryAmount}
                      onChange={(e) => setDriverPaymentPerDeliveryAmount(e.target.value)}
                      placeholder="0.00"
                      className="input-primary w-full px-3 py-2 rounded-lg font-manrope"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-primary font-manrope mb-2">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={driverPaymentAmount}
                    onChange={(e) => setDriverPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    className="input-primary w-full px-3 py-2 rounded-lg font-manrope"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-primary font-manrope mb-2">
                  Descrição (opcional)
                </label>
                <input
                  type="text"
                  value={driverPaymentDescription}
                  onChange={(e) => setDriverPaymentDescription(e.target.value)}
                  placeholder="Ex: Entrega urgente, distância longa..."
                  className="input-primary w-full px-3 py-2 rounded-lg font-manrope"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="btn-ghost flex-1 px-4 py-2 rounded-lg font-manrope font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveDriverPayment}
                  className="btn-primary flex-1 px-4 py-2 rounded-lg font-manrope font-medium"
                >
                  Salvar Pagamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}