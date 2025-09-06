'use client'

import { useState, useEffect } from 'react'
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
  LogOut,
  Search,
  Menu,
  Home,
  List,
  Settings,
  Globe,
  Shield,
  Lock,
  Info,
  Heart,
  MessageCircle,
  ChevronRight
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
  notes?: string
  driverPayment?: {
    type: 'fixed' | 'per_delivery' | 'hybrid'
    amount: number
    description?: string
    fixedAmount?: number
    perDeliveryAmount?: number
  }
}

export default function MobilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [driverCode, setDriverCode] = useState('')
  const [driverName, setDriverName] = useState('')
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('active')
  const [showMenu, setShowMenu] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [completedDeliveries, setCompletedDeliveries] = useState<Delivery[]>([])
  const [settingsTab, setSettingsTab] = useState('profile')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('pt-BR')
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [locationSharing, setLocationSharing] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

     // Simular dados de entregas para diferentes motoboys
   const mockDeliveries: Delivery[] = [
           {
        id: 'DEL001',
        orderId: '#1234',
        customer: 'João Silva',
        address: 'Rua das Flores, 123 - Centro',
        phone: '(11) 99999-9999',
        driver: 'João Santos',
        driverPhone: '(11) 88888-8888',
        status: 'in_transit',
        estimatedTime: '25 min',
        distance: '2.5 km',
        total: 45.90,
        items: ['1x Pizza Margherita'],
        createdAt: '14:30',
        source: 'whatsapp',
        driverPayment: {
          type: 'per_delivery',
          amount: 8.50,
          description: 'Entrega padrão'
        }
      },
           {
        id: 'DEL002',
        orderId: '#1235',
        customer: 'Maria Santos',
        address: 'Av. Principal, 456 - Bela Vista',
        phone: '(11) 88888-8888',
        driver: 'João Santos',
        driverPhone: '(11) 88888-8888',
        status: 'preparing',
        estimatedTime: '15 min',
        distance: '1.8 km',
        total: 65.00,
        items: ['2x Hambúrguer Especial'],
        createdAt: '14:45',
        source: 'ifood',
        driverPayment: {
          type: 'per_delivery',
          amount: 7.00,
          description: 'Entrega próxima'
        }
      },
           {
        id: 'DEL003',
        orderId: '#1236',
        customer: 'Pedro Costa',
        address: 'Rua do Comércio, 789 - Centro',
        phone: '(11) 77777-7777',
        driver: 'Carlos Oliveira',
        driverPhone: '(11) 77777-7777',
        status: 'in_transit',
        estimatedTime: '20 min',
        distance: '3.0 km',
        total: 38.90,
        items: ['1x Hambúrguer Duplo'],
        createdAt: '14:20',
        source: 'balcao',
        driverPayment: {
          type: 'fixed',
          amount: 12.00,
          description: 'Entrega longa'
        }
      },
           {
        id: 'DEL004',
        orderId: '#1237',
        customer: 'Ana Oliveira',
        address: 'Av. das Palmeiras, 321 - Jardins',
        phone: '(11) 55555-5555',
        driver: 'Carlos Oliveira',
        driverPhone: '(11) 77777-7777',
        status: 'preparing',
        estimatedTime: '18 min',
        distance: '2.8 km',
        total: 52.00,
        items: ['1x Pizza Quatro Queijos'],
        createdAt: '14:35',
        source: 'whatsapp',
        driverPayment: {
          type: 'hybrid',
          amount: 15.00,
          fixedAmount: 8.00,
          perDeliveryAmount: 7.00,
          description: 'Entrega especial (fixo + por entrega)'
        }
      }
   ]

     // Simular dados de entregas concluídas para diferentes motoboys
   const mockCompletedDeliveries: Delivery[] = [
           {
        id: 'DEL005',
        orderId: '#1238',
        customer: 'Pedro Costa',
        address: 'Rua do Comércio, 789 - Centro',
        phone: '(11) 77777-7777',
        driver: 'João Santos',
        driverPhone: '(11) 88888-8888',
        status: 'delivered',
        estimatedTime: 'Entregue',
        distance: '3.2 km',
        total: 28.90,
        items: ['1x Salada Caesar'],
        createdAt: '13:15',
        source: 'balcao',
        driverPayment: {
          type: 'per_delivery',
          amount: 8.00,
          description: 'Entrega concluída'
        }
      },
           {
        id: 'DEL006',
        orderId: '#1239',
        customer: 'Ana Oliveira',
        address: 'Av. das Palmeiras, 321 - Jardins',
        phone: '(11) 55555-5555',
        driver: 'João Santos',
        driverPhone: '(11) 88888-8888',
        status: 'delivered',
        estimatedTime: 'Entregue',
        distance: '4.1 km',
        total: 89.90,
        items: ['1x Pizza Quatro Queijos', '1x Refrigerante'],
        createdAt: '12:30',
        source: 'whatsapp',
        driverPayment: {
          type: 'per_delivery',
          amount: 10.00,
          description: 'Entrega longa'
        }
      },
           {
        id: 'DEL007',
        orderId: '#1240',
        customer: 'Roberto Silva',
        address: 'Rua das Acácias, 456 - Vila Nova',
        phone: '(11) 66666-6666',
        driver: 'Carlos Oliveira',
        driverPhone: '(11) 77777-7777',
        status: 'delivered',
        estimatedTime: 'Entregue',
        distance: '2.7 km',
        total: 45.50,
        items: ['1x Pizza Margherita'],
        createdAt: '11:45',
        source: 'ifood',
        driverPayment: {
          type: 'per_delivery',
          amount: 7.50,
          description: 'Entrega padrão'
        }
      }
   ]

     useEffect(() => {
     if (isLoggedIn) {
       // Filtrar entregas apenas para o motoboy logado
       const driverDeliveries = mockDeliveries.filter(d => d.driver === driverName)
       const driverCompletedDeliveries = mockCompletedDeliveries.filter(d => d.driver === driverName)
       
       console.log(`Motorista logado: ${driverName}`)
       console.log(`Entregas ativas: ${driverDeliveries.length}`)
       console.log(`Entregas concluídas: ${driverCompletedDeliveries.length}`)
       
       setDeliveries(driverDeliveries)
       setCompletedDeliveries(driverCompletedDeliveries)
     }
   }, [isLoggedIn, driverName])

     // Sistema de códigos de acesso para diferentes motoboys
   const driverCodes = {
     '1234': 'João Santos',
     '5678': 'Carlos Oliveira',
     '9999': 'Pedro Silva'
   }

   const handleLogin = () => {
     if (driverCode.trim()) {
       // Validar código do motoboy
       if (driverCodes[driverCode as keyof typeof driverCodes]) {
         setDriverName(driverCodes[driverCode as keyof typeof driverCodes])
         setIsLoggedIn(true)
       } else {
         alert('Código inválido! Use: 1234 (João), 5678 (Carlos) ou 9999 (Pedro)')
       }
     }
   }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setDriverName('')
    setDriverCode('')
    setDeliveries([])
    setSelectedDelivery(null)
  }

  const updateDeliveryStatus = (deliveryId: string, newStatus: string, notes?: string) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId 
        ? { ...delivery, status: newStatus, notes }
        : delivery
    ))
    
    // Fechar modal se existir
    if (selectedDelivery) {
      setSelectedDelivery(null)
    }
    
    console.log(`🚚 Delivery ${deliveryId} atualizado para ${newStatus}`)
    if (notes) console.log(`📝 Nota: ${notes}`)
    
    // TODO: Implementar integração com backend
    // socket.emit('update_delivery_status', { deliveryId, status: newStatus, notes })
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

  // Funções para gerenciar configurações
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode)
    if (notifications) {
      showToast(`Modo ${!darkMode ? 'escuro' : 'claro'} ativado`)
    }
  }

  const handleNotificationToggle = () => {
    setNotifications(!notifications)
    if (!notifications) {
      showToast('Notificações ativadas')
    } else {
      showToast('Notificações desativadas')
    }
  }

  const handleAutoUpdateToggle = () => {
    setAutoUpdate(!autoUpdate)
    if (notifications) {
      showToast(`Atualização automática ${!autoUpdate ? 'ativada' : 'desativada'}`)
    }
  }

  const handleLocationSharingToggle = () => {
    setLocationSharing(!locationSharing)
    if (notifications) {
      showToast(`Compartilhamento de localização ${!locationSharing ? 'ativado' : 'desativado'}`)
    }
  }

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled)
    if (notifications) {
      showToast(`Som ${!soundEnabled ? 'ativado' : 'desativado'}`)
    }
  }

  const handleVibrationToggle = () => {
    setVibrationEnabled(!vibrationEnabled)
    if (notifications) {
      showToast(`Vibração ${!vibrationEnabled ? 'ativada' : 'desativada'}`)
    }
  }

  const showToast = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    
    // Simular vibração se ativada
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(100)
    }
    
    // Auto-hide após 3 segundos
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    if (notifications) {
      const languageNames = {
        'pt-BR': 'Português',
        'en-US': 'English',
        'es-ES': 'Español'
      }
      showToast(`Idioma alterado para ${languageNames[newLanguage as keyof typeof languageNames]}`)
    }
  }

  // Funções para calcular ganhos dos motoboys
  const getDriverEarnings = (driverName: string) => {
    const allDeliveries = [...deliveries, ...completedDeliveries]
    return allDeliveries
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

  const getTodayEarnings = (driverName: string) => {
    const today = new Date().toDateString()
    const allDeliveries = [...deliveries, ...completedDeliveries]
    return allDeliveries
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

  const getCompletedDeliveriesCount = (driverName: string) => {
    return completedDeliveries.filter(d => d.driver === driverName).length
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'preparing':
        return {
          label: 'Preparando',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Package className="w-4 h-4" />
        }
      case 'in_transit':
        return {
          label: 'Em Rota',
          color: 'bg-blue-100 text-blue-800',
          icon: <Truck className="w-4 h-4" />
        }
      case 'arrived':
        return {
          label: 'Cheguei',
          color: 'bg-purple-100 text-purple-800',
          icon: <MapPin className="w-4 h-4" />
        }
      case 'delivered':
        return {
          label: 'Entregue',
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />
        }
      case 'problem':
        return {
          label: 'Problema',
          color: 'bg-red-100 text-red-800',
          icon: <AlertCircle className="w-4 h-4" />
        }
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertCircle className="w-4 h-4" />
        }
    }
  }

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'active' && ['preparing', 'in_transit', 'arrived'].includes(delivery.status)) ||
      (activeTab === 'completed' && ['delivered', 'cancelled'].includes(delivery.status))
    
    const matchesSearch = delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesTab && matchesSearch
  })

     if (!isLoggedIn) {
     return (
       <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
         darkMode 
           ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
           : 'bg-gradient-to-br from-blue-50 to-purple-50'
       }`}>
         <div className={`transition-colors duration-300 rounded-3xl p-8 shadow-2xl w-full max-w-md ${
           darkMode 
             ? 'bg-gray-800 border border-gray-700' 
             : 'bg-white'
         }`}>
           <div className="text-center mb-8">
             <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Truck className="w-10 h-10 text-white" />
             </div>
             <h1 className={`text-2xl font-bold mb-2 ${
               darkMode ? 'text-white' : 'text-gray-900'
             }`}>Vynlo Taste</h1>
             <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Área do Motoboy</p>
           </div>
          
                     <div className="space-y-4">
             <div>
               <label className={`block text-sm font-medium mb-2 ${
                 darkMode ? 'text-gray-200' : 'text-gray-700'
               }`}>
                 Código de Acesso
               </label>
               <input
                 type="password"
                 value={driverCode}
                 onChange={(e) => setDriverCode(e.target.value)}
                 placeholder="Digite seu código"
                 className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono transition-colors ${
                   darkMode 
                     ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                     : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                 }`}
                 maxLength={4}
               />
             </div>
             
             <button
               onClick={handleLogin}
               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
             >
               Entrar
             </button>
           </div>
          
                     <div className="mt-6 text-center">
             <p className={`text-sm ${
               darkMode ? 'text-gray-400' : 'text-gray-500'
             }`}>
               Digite o código fornecido pela empresa
             </p>
             <div className={`mt-2 p-3 rounded-lg ${
               darkMode ? 'bg-gray-700' : 'bg-gray-100'
             }`}>
               <p className={`text-xs font-medium ${
                 darkMode ? 'text-gray-300' : 'text-gray-600'
               }`}>Códigos de Teste:</p>
               <p className={`text-xs ${
                 darkMode ? 'text-gray-400' : 'text-gray-500'
               }`}>
                 1234 (João) • 5678 (Carlos) • 9999 (Pedro)
               </p>
             </div>
           </div>
        </div>
      </div>
    )
  }

     // Tela de Histórico
   if (showHistory) {
     return (
       <div className={`min-h-screen transition-colors duration-300 ${
         darkMode 
           ? 'bg-gray-900 text-white' 
           : 'bg-gray-50 text-gray-900'
       }`}>
                 {/* Header */}
         <div className={`transition-colors duration-300 ${
           darkMode 
             ? 'bg-gray-800 border-gray-700' 
             : 'bg-white border-gray-200'
         } shadow-sm border-b`}>
           <div className="flex items-center justify-between p-4">
             <button
               onClick={() => setShowHistory(false)}
               className={`p-2 rounded-lg transition-colors ${
                 darkMode 
                   ? 'hover:bg-gray-700 text-gray-300' 
                   : 'hover:bg-gray-100 text-gray-600'
               }`}
             >
               <RotateCcw className="w-6 h-6" />
             </button>
             <div>
               <h1 className={`text-lg font-semibold ${
                 darkMode ? 'text-white' : 'text-gray-900'
               }`}>Histórico</h1>
               <p className={`text-sm ${
                 darkMode ? 'text-gray-300' : 'text-gray-600'
               }`}>Entregas concluídas</p>
             </div>
             <div className="w-10"></div>
           </div>
         </div>

        {/* Lista de Entregas Concluídas */}
        <div className="p-4 space-y-4">
                     {completedDeliveries.length === 0 ? (
             <div className="text-center py-12">
               <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
               <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Nenhuma entrega concluída</p>
             </div>
          ) : (
                         completedDeliveries.map((delivery) => (
               <div key={delivery.id} className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700' 
                   : 'bg-white border-gray-200'
               }`}>
                 <div className="flex items-start justify-between mb-3">
                   <div className="flex-1">
                     <div className="flex items-center space-x-2 mb-2">
                       <span className={`text-sm font-medium ${
                         darkMode ? 'text-gray-300' : 'text-gray-600'
                       }`}>Pedido:</span>
                       <span className={`font-semibold ${
                         darkMode ? 'text-white' : 'text-gray-900'
                       }`}>{delivery.orderId}</span>
                       <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                         <CheckCircle className="w-3 h-3" />
                         <span>Entregue</span>
                       </span>
                     </div>
                     <h3 className={`font-semibold mb-1 ${
                       darkMode ? 'text-white' : 'text-gray-900'
                     }`}>{delivery.customer}</h3>
                     <p className={`text-sm ${
                       darkMode ? 'text-gray-300' : 'text-gray-600'
                     }`}>{delivery.address}</p>
                   </div>
                   <div className="text-right">
                     <p className={`text-lg font-bold ${
                       darkMode ? 'text-white' : 'text-gray-900'
                     }`}>
                       
                     </p>
                     <p className={`text-sm ${
                       darkMode ? 'text-gray-400' : 'text-gray-500'
                     }`}>{delivery.createdAt}</p>
                   </div>
                 </div>
                 <div className={`flex items-center justify-between text-sm ${
                   darkMode ? 'text-gray-400' : 'text-gray-600'
                 }`}>
                   <span>{delivery.distance}</span>
                   <span>{delivery.source}</span>
                 </div>
               </div>
             ))
          )}
        </div>
      </div>
    )
  }

     // Tela de Configurações
   if (showSettings) {
     return (
       <div className={`min-h-screen transition-colors duration-300 ${
         darkMode 
           ? 'bg-gray-900 text-white' 
           : 'bg-gray-50 text-gray-900'
       }`}>
         {/* Header */}
         <div className={`transition-colors duration-300 ${
           darkMode 
             ? 'bg-gray-800 border-gray-700' 
             : 'bg-white border-gray-200'
         } shadow-sm border-b`}>
           <div className="flex items-center justify-between p-4">
             <button
               onClick={() => setShowSettings(false)}
               className={`p-2 rounded-lg transition-colors ${
                 darkMode 
                   ? 'hover:bg-gray-700 text-gray-300' 
                   : 'hover:bg-gray-100 text-gray-600'
               }`}
             >
               <RotateCcw className="w-6 h-6" />
             </button>
             <div>
               <h1 className={`text-lg font-semibold ${
                 darkMode ? 'text-white' : 'text-gray-900'
               }`}>Configurações</h1>
               <p className={`text-sm ${
                 darkMode ? 'text-gray-300' : 'text-gray-600'
               }`}>Preferências do sistema</p>
             </div>
             <div className="w-10"></div>
           </div>
         </div>

         {/* Tabs de Configurações */}
         <div className={`transition-colors duration-300 ${
           darkMode 
             ? 'bg-gray-800 border-gray-700' 
             : 'bg-white border-gray-200'
         } border-b`}>
           <div className="flex">
             <button
               onClick={() => setSettingsTab('profile')}
               className={`flex-1 py-3 text-sm font-medium transition-colors ${
                 settingsTab === 'profile'
                   ? 'text-blue-400 border-b-2 border-blue-400'
                   : darkMode 
                     ? 'text-gray-400 hover:text-gray-200' 
                     : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               Perfil
             </button>
             <button
               onClick={() => setSettingsTab('preferences')}
               className={`flex-1 py-3 text-sm font-medium transition-colors ${
                 settingsTab === 'preferences'
                   ? 'text-blue-400 border-b-2 border-blue-400'
                   : darkMode 
                     ? 'text-gray-400 hover:text-gray-200' 
                     : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               Preferências
             </button>
             <button
               onClick={() => setSettingsTab('security')}
               className={`flex-1 py-3 text-sm font-medium transition-colors ${
                 settingsTab === 'security'
                   ? 'text-blue-400 border-b-2 border-blue-400'
                   : darkMode 
                     ? 'text-gray-400 hover:text-gray-200' 
                     : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               Segurança
             </button>
             <button
               onClick={() => setSettingsTab('about')}
               className={`flex-1 py-3 text-sm font-medium transition-colors ${
                 settingsTab === 'about'
                   ? 'text-blue-400 border-b-2 border-blue-400'
                   : darkMode 
                     ? 'text-gray-400 hover:text-gray-200' 
                     : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               Sobre
             </button>
           </div>
         </div>

         {/* Conteúdo das Configurações */}
         <div className="p-4 space-y-4">
           {/* Perfil */}
           {settingsTab === 'profile' && (
             <div className="space-y-4">
               <div className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700' 
                   : 'bg-white border-gray-200'
               }`}>
                 <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                   darkMode ? 'text-white' : 'text-gray-900'
                 }`}>
                   <User className="w-5 h-5 text-blue-400" />
                   <span>Perfil do Motoboy</span>
                 </h3>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Nome:</span>
                     <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{driverName}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Telefone:</span>
                     <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>(11) 88888-8888</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Status:</span>
                     <span className="text-green-400 font-medium">Ativo</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Código:</span>
                     <span className={`font-medium font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>1234</span>
                   </div>
                 </div>
               </div>

                               <div className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Truck className="w-5 h-5 text-blue-400" />
                    <span>Informações de Trabalho</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Entregas Hoje:</span>
                      <span className="font-medium text-blue-400">{deliveries.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Entregas Concluídas:</span>
                      <span className="font-medium text-green-400">{getCompletedDeliveriesCount(driverName)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Ganhos Hoje:</span>
                      <span className="font-medium text-green-400"></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Ganho:</span>
                      <span className="font-medium text-green-400"></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avaliação:</span>
                      <span className="font-medium text-yellow-400">4.8 ⭐</span>
                    </div>
                  </div>
                </div>
             </div>
           )}

           {/* Preferências */}
           {settingsTab === 'preferences' && (
             <div className="space-y-4">
               <div className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700' 
                   : 'bg-white border-gray-200'
               }`}>
                 <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                   darkMode ? 'text-white' : 'text-gray-900'
                 }`}>
                   <Settings className="w-5 h-5 text-blue-400" />
                   <span>Configurações Gerais</span>
                 </h3>
                 <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                       <div>
                         <span className={`font-medium ${
                           darkMode ? 'text-white' : 'text-gray-900'
                         }`}>Notificações Push</span>
                         <p className={`text-sm ${
                           darkMode ? 'text-gray-400' : 'text-gray-500'
                         }`}>Receber alertas de novas entregas</p>
                       </div>
                       <button
                         onClick={handleNotificationToggle}
                         className={`w-12 h-6 rounded-full transition-colors ${
                           notifications ? 'bg-blue-500' : 'bg-gray-500'
                         }`}
                       >
                         <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                           notifications ? 'translate-x-6' : 'translate-x-1'
                         }`} />
                       </button>
                     </div>

                                        <div className="flex items-center justify-between">
                       <div>
                         <span className={`font-medium ${
                           darkMode ? 'text-white' : 'text-gray-900'
                         }`}>Modo Escuro</span>
                         <p className={`text-sm ${
                           darkMode ? 'text-gray-400' : 'text-gray-500'
                         }`}>Tema escuro para melhor visibilidade</p>
                       </div>
                       <button
                         onClick={handleDarkModeToggle}
                         className={`w-12 h-6 rounded-full transition-colors ${
                           darkMode ? 'bg-blue-500' : 'bg-gray-500'
                         }`}
                       >
                         <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                           darkMode ? 'translate-x-6' : 'translate-x-1'
                         }`} />
                       </button>
                     </div>

                                        <div className="flex items-center justify-between">
                       <div>
                         <span className={`font-medium ${
                           darkMode ? 'text-white' : 'text-gray-900'
                         }`}>Atualização Automática</span>
                         <p className={`text-sm ${
                           darkMode ? 'text-gray-400' : 'text-gray-500'
                         }`}>Sincronizar dados em tempo real</p>
                       </div>
                       <button
                         onClick={handleAutoUpdateToggle}
                         className={`w-12 h-6 rounded-full transition-colors ${
                           autoUpdate ? 'bg-blue-500' : 'bg-gray-500'
                         }`}
                       >
                         <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                           autoUpdate ? 'translate-x-6' : 'translate-x-1'
                         }`} />
                       </button>
                     </div>
                 </div>
               </div>

               <div className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700' 
                   : 'bg-white border-gray-200'
               }`}>
                 <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                   darkMode ? 'text-white' : 'text-gray-900'
                 }`}>
                   <MapPin className="w-5 h-5 text-blue-400" />
                   <span>Configurações de Localização</span>
                 </h3>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <span className={`font-medium ${
                         darkMode ? 'text-white' : 'text-gray-900'
                       }`}>Compartilhar Localização</span>
                       <p className={`text-sm ${
                         darkMode ? 'text-gray-400' : 'text-gray-500'
                       }`}>Permitir rastreamento em tempo real</p>
                     </div>
                     <button
                       onClick={handleLocationSharingToggle}
                       className={`w-12 h-6 rounded-full transition-colors ${
                         locationSharing ? 'bg-blue-500' : 'bg-gray-500'
                       }`}
                     >
                       <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                         locationSharing ? 'translate-x-6' : 'translate-x-1'
                       }`} />
                     </button>
                   </div>
                 </div>
               </div>

               <div className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700' 
                   : 'bg-white border-gray-200'
               }`}>
                 <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                   darkMode ? 'text-white' : 'text-gray-900'
                 }`}>
                   <Phone className="w-5 h-5 text-blue-400" />
                   <span>Configurações de Som</span>
                 </h3>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <span className={`font-medium ${
                         darkMode ? 'text-white' : 'text-gray-900'
                       }`}>Som</span>
                       <p className={`text-sm ${
                         darkMode ? 'text-gray-400' : 'text-gray-500'
                       }`}>Notificações sonoras</p>
                     </div>
                     <button
                       onClick={handleSoundToggle}
                       className={`w-12 h-6 rounded-full transition-colors ${
                         soundEnabled ? 'bg-blue-500' : 'bg-gray-500'
                       }`}
                     >
                       <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                         soundEnabled ? 'translate-x-6' : 'translate-x-1'
                       }`} />
                     </button>
                   </div>

                   <div className="flex items-center justify-between">
                     <div>
                       <span className={`font-medium ${
                         darkMode ? 'text-white' : 'text-gray-900'
                       }`}>Vibração</span>
                       <p className={`text-sm ${
                         darkMode ? 'text-gray-400' : 'text-gray-500'
                       }`}>Notificações por vibração</p>
                     </div>
                     <button
                       onClick={handleVibrationToggle}
                       className={`w-12 h-6 rounded-full transition-colors ${
                         vibrationEnabled ? 'bg-blue-500' : 'bg-gray-500'
                       }`}
                     >
                       <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                         vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
                       }`} />
                     </button>
                   </div>
                 </div>
               </div>

               <div className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700' 
                   : 'bg-white border-gray-200'
               }`}>
                 <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                   darkMode ? 'text-white' : 'text-gray-900'
                 }`}>
                   <Globe className="w-5 h-5 text-blue-400" />
                   <span>Idioma</span>
                 </h3>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Idioma Atual:</span>
                     <select
                       value={language}
                       onChange={(e) => handleLanguageChange(e.target.value)}
                       className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                         darkMode 
                           ? 'bg-gray-700 border-gray-600 text-white' 
                           : 'bg-white border-gray-300 text-gray-900'
                       }`}
                     >
                       <option value="pt-BR">Português (BR)</option>
                       <option value="en-US">English (US)</option>
                       <option value="es-ES">Español</option>
                     </select>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* Segurança */}
           {settingsTab === 'security' && (
             <div className="space-y-4">
               <div className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700' 
                   : 'bg-white border-gray-200'
               }`}>
                 <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                   darkMode ? 'text-white' : 'text-gray-900'
                 }`}>
                   <Shield className="w-5 h-5 text-blue-400" />
                   <span>Segurança da Conta</span>
                 </h3>
                 <div className="space-y-4">
                                        <button className={`w-full text-left p-3 rounded-lg border transition-colors mobile-button ${
                       darkMode 
                         ? 'border-gray-600 hover:bg-gray-700' 
                         : 'border-gray-200 hover:bg-gray-50'
                     }`}>
                       <div className="flex items-center justify-between">
                         <div>
                           <span className={`font-medium ${
                             darkMode ? 'text-white' : 'text-gray-900'
                           }`}>Alterar Código de Acesso</span>
                           <p className={`text-sm ${
                             darkMode ? 'text-gray-400' : 'text-gray-500'
                           }`}>Modificar senha de login</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-gray-400" />
                       </div>
                     </button>

                                        <button className={`w-full text-left p-3 rounded-lg border transition-colors mobile-button ${
                       darkMode 
                         ? 'border-gray-600 hover:bg-gray-700' 
                         : 'border-gray-200 hover:bg-gray-50'
                     }`}>
                       <div className="flex items-center justify-between">
                         <div>
                           <span className={`font-medium ${
                             darkMode ? 'text-white' : 'text-gray-900'
                           }`}>Autenticação em Duas Etapas</span>
                           <p className={`text-sm ${
                             darkMode ? 'text-gray-400' : 'text-gray-500'
                           }`}>Adicionar camada extra de segurança</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-gray-400" />
                       </div>
                     </button>

                     <button className={`w-full text-left p-3 rounded-lg border transition-colors mobile-button ${
                       darkMode 
                         ? 'border-gray-600 hover:bg-gray-700' 
                         : 'border-gray-200 hover:bg-gray-50'
                     }`}>
                       <div className="flex items-center justify-between">
                         <div>
                           <span className={`font-medium ${
                             darkMode ? 'text-white' : 'text-gray-900'
                           }`}>Histórico de Login</span>
                           <p className={`text-sm ${
                             darkMode ? 'text-gray-400' : 'text-gray-500'
                           }`}>Ver acessos recentes</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-gray-400" />
                       </div>
                     </button>
                 </div>
               </div>

               <div className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700' 
                   : 'bg-white border-gray-200'
               }`}>
                 <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                   darkMode ? 'text-white' : 'text-gray-900'
                 }`}>
                   <Lock className="w-5 h-5 text-blue-400" />
                   <span>Privacidade</span>
                 </h3>
                 <div className="space-y-4">
                                        <button className={`w-full text-left p-3 rounded-lg border transition-colors mobile-button ${
                       darkMode 
                         ? 'border-gray-600 hover:bg-gray-700' 
                         : 'border-gray-200 hover:bg-gray-50'
                     }`}>
                       <div className="flex items-center justify-between">
                         <div>
                           <span className={`font-medium ${
                             darkMode ? 'text-white' : 'text-gray-900'
                           }`}>Política de Privacidade</span>
                           <p className={`text-sm ${
                             darkMode ? 'text-gray-400' : 'text-gray-500'
                           }`}>Como seus dados são usados</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-gray-400" />
                       </div>
                     </button>

                     <button className={`w-full text-left p-3 rounded-lg border transition-colors mobile-button ${
                       darkMode 
                         ? 'border-gray-600 hover:bg-gray-700' 
                         : 'border-gray-200 hover:bg-gray-50'
                     }`}>
                       <div className="flex items-center justify-between">
                         <div>
                           <span className={`font-medium ${
                             darkMode ? 'text-white' : 'text-gray-900'
                           }`}>Termos de Uso</span>
                           <p className={`text-sm ${
                             darkMode ? 'text-gray-400' : 'text-gray-500'
                           }`}>Condições do serviço</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-gray-400" />
                       </div>
                     </button>
                 </div>
               </div>
             </div>
           )}

           {/* Sobre */}
           {settingsTab === 'about' && (
             <div className="space-y-4">
               <div className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700' 
                   : 'bg-white border-gray-200'
               }`}>
                 <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                   darkMode ? 'text-white' : 'text-gray-900'
                 }`}>
                   <Info className="w-5 h-5 text-blue-400" />
                   <span>Informações do Sistema</span>
                 </h3>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Versão:</span>
                     <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>1.0.0</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Build:</span>
                     <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>2024.01.15</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Plataforma:</span>
                     <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>React Native</span>
                   </div>
                 </div>
               </div>

               <div className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700' 
                   : 'bg-white border-gray-200'
               }`}>
                 <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                   darkMode ? 'text-white' : 'text-gray-900'
                 }`}>
                   <Heart className="w-5 h-5 text-blue-400" />
                   <span>Sobre o Vynlo Taste</span>
                 </h3>
                 <div className={`space-y-2 text-sm ${
                   darkMode ? 'text-gray-300' : 'text-gray-600'
                 }`}>
                   <p>Sistema de delivery inteligente desenvolvido para motoboys</p>
                   <p>Otimização de rotas e gestão de entregas em tempo real</p>
                   <p>Suporte 24/7 para dúvidas e problemas</p>
                 </div>
               </div>

               <div className={`transition-colors duration-300 rounded-xl shadow-sm border p-4 ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700' 
                   : 'bg-white border-gray-200'
               }`}>
                 <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
                   darkMode ? 'text-white' : 'text-gray-900'
                 }`}>
                   <MessageCircle className="w-5 h-5 text-blue-400" />
                   <span>Suporte</span>
                 </h3>
                 <div className="space-y-4">
                                        <button className={`w-full text-left p-3 rounded-lg border transition-colors mobile-button ${
                       darkMode 
                         ? 'border-gray-600 hover:bg-gray-700' 
                         : 'border-gray-200 hover:bg-gray-50'
                     }`}>
                       <div className="flex items-center justify-between">
                         <div>
                           <span className={`font-medium ${
                             darkMode ? 'text-white' : 'text-gray-900'
                           }`}>Central de Ajuda</span>
                           <p className={`text-sm ${
                             darkMode ? 'text-gray-400' : 'text-gray-500'
                           }`}>Tutoriais e FAQ</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-gray-400" />
                       </div>
                     </button>

                     <button className={`w-full text-left p-3 rounded-lg border transition-colors mobile-button ${
                       darkMode 
                         ? 'border-gray-600 hover:bg-gray-700' 
                         : 'border-gray-200 hover:bg-gray-50'
                     }`}>
                       <div className="flex items-center justify-between">
                         <div>
                           <span className={`font-medium ${
                             darkMode ? 'text-white' : 'text-gray-900'
                           }`}>Contatar Suporte</span>
                           <p className={`text-sm ${
                             darkMode ? 'text-gray-400' : 'text-gray-500'
                           }`}>Fale com nossa equipe</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-gray-400" />
                       </div>
                     </button>

                     <button className={`w-full text-left p-3 rounded-lg border transition-colors mobile-button ${
                       darkMode 
                         ? 'border-gray-600 hover:bg-gray-700' 
                         : 'border-gray-200 hover:bg-gray-50'
                     }`}>
                       <div className="flex items-center justify-between">
                         <div>
                           <span className={`font-medium ${
                             darkMode ? 'text-white' : 'text-gray-900'
                           }`}>Reportar Bug</span>
                           <p className={`text-sm ${
                             darkMode ? 'text-gray-400' : 'text-gray-500'
                           }`}>Informar problemas técnicos</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-gray-400" />
                       </div>
                     </button>
                 </div>
               </div>
             </div>
           )}

           {/* Toast de Notificação */}
           {showNotification && (
             <div className="fixed bottom-4 left-4 right-4 z-50">
               <div className={`rounded-lg shadow-lg p-4 transition-all duration-300 ${
                 darkMode 
                   ? 'bg-gray-800 border border-gray-600 text-white' 
                   : 'bg-white border border-gray-200 text-gray-900'
               }`}>
                 <div className="flex items-center space-x-3">
                   <div className={`w-2 h-2 rounded-full ${
                     notifications ? 'bg-green-500' : 'bg-gray-400'
                   }`} />
                   <span className="font-medium">{notificationMessage}</span>
                 </div>
               </div>
             </div>
           )}
         </div>
       </div>
     )
   }

     return (
     <div className={`min-h-screen transition-colors duration-300 ${
       darkMode 
         ? 'bg-gray-900 text-white' 
         : 'bg-gray-50 text-gray-900'
     }`}>
             {/* Header */}
       <div className={`transition-colors duration-300 ${
         darkMode 
           ? 'bg-gray-800 border-gray-700' 
           : 'bg-white border-gray-200'
       } shadow-sm border-b`}>
                   <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Entregas</h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Olá, {driverName}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>

          {/* Card de Resumo de Ganhos */}
          <div className={`mx-4 mb-4 p-4 rounded-xl ${
            darkMode ? 'bg-gray-700' : 'bg-green-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  darkMode ? 'text-green-300' : 'text-green-700'
                }`}>💰 Ganhos de Hoje</p>
                <p className={`text-2xl font-bold ${
                  darkMode ? 'text-green-300' : 'text-green-700'
                }`}></p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-green-600'
                }`}>Total Geral</p>
                <p className={`text-lg font-semibold ${
                  darkMode ? 'text-green-300' : 'text-green-700'
                }`}></p>
              </div>
            </div>
          </div>
        
                 {/* Tabs */}
         <div className={`flex border-b transition-colors duration-300 ${
           darkMode ? 'border-gray-700' : 'border-gray-200'
         }`}>
           <button
             onClick={() => setActiveTab('active')}
             className={`flex-1 py-3 text-sm font-medium transition-colors ${
               activeTab === 'active'
                 ? darkMode 
                   ? 'text-blue-400 border-b-2 border-blue-400'
                   : 'text-blue-600 border-b-2 border-blue-600'
                 : darkMode 
                   ? 'text-gray-400 hover:text-gray-200' 
                   : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             Ativas ({deliveries.filter(d => ['preparing', 'in_transit', 'arrived'].includes(d.status)).length})
           </button>
           <button
             onClick={() => setActiveTab('completed')}
             className={`flex-1 py-3 text-sm font-medium transition-colors ${
               activeTab === 'completed'
                 ? darkMode 
                   ? 'text-blue-400 border-b-2 border-blue-400'
                   : 'text-blue-600 border-b-2 border-blue-600'
                 : darkMode 
                   ? 'text-gray-400 hover:text-gray-200' 
                   : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             Concluídas ({deliveries.filter(d => ['delivered', 'cancelled'].includes(d.status)).length})
           </button>
         </div>
      </div>

             {/* Search */}
       <div className={`p-4 border-b transition-colors duration-300 ${
         darkMode 
           ? 'bg-gray-800 border-gray-700' 
           : 'bg-white border-gray-200'
       }`}>
         <div className="relative">
           <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
             darkMode ? 'text-gray-400' : 'text-gray-400'
           }`} />
           <input
             type="text"
             placeholder="Buscar entregas..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
               darkMode 
                 ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                 : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
             }`}
           />
         </div>
       </div>

      {/* Deliveries List */}
      <div className="p-4 space-y-4">
                 {filteredDeliveries.length === 0 ? (
           <div className="text-center py-12">
             <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Nenhuma entrega encontrada</p>
           </div>
        ) : (
          filteredDeliveries.map((delivery) => {
            const statusInfo = getStatusInfo(delivery.status)
            
            return (
                             <div
                 key={delivery.id}
                 className={`transition-colors duration-300 rounded-xl shadow-sm border overflow-hidden ${
                   darkMode 
                     ? 'bg-gray-800 border-gray-700' 
                     : 'bg-white border-gray-200'
                 }`}
               >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                                           <div className="flex items-center space-x-2 mb-2">
                       <span className={`text-sm font-medium ${
                         darkMode ? 'text-gray-300' : 'text-gray-600'
                       }`}>Pedido:</span>
                       <span className={`font-semibold ${
                         darkMode ? 'text-white' : 'text-gray-900'
                       }`}>{delivery.orderId}</span>
                       <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                         {statusInfo.icon}
                         <span>{statusInfo.label}</span>
                       </span>
                     </div>
                     
                     <h3 className={`font-semibold mb-1 ${
                       darkMode ? 'text-white' : 'text-gray-900'
                     }`}>{delivery.customer}</h3>
                     <p className={`text-sm flex items-start space-x-2 ${
                       darkMode ? 'text-gray-300' : 'text-gray-600'
                     }`}>
                       <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                       <span>{delivery.address}</span>
                     </p>
                   </div>
                   
                   <div className="text-right">
                     <p className={`text-lg font-bold ${
                       darkMode ? 'text-white' : 'text-gray-900'
                     }`}>
                       
                     </p>
                     <p className={`text-sm ${
                       darkMode ? 'text-gray-400' : 'text-gray-500'
                     }`}>{delivery.distance}</p>
                   </div>
                  </div>
                  
                                                         <div className={`flex items-center justify-between text-sm mb-4 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{delivery.estimatedTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{delivery.phone}</span>
                      </span>
                    </div>

                                         {/* Informações de Pagamento */}
                     {delivery.driverPayment && (
                       <div className={`mb-4 p-3 rounded-lg ${
                         darkMode ? 'bg-gray-700' : 'bg-green-50'
                       }`}>
                         <div className="flex items-center justify-between">
                           <span className={`text-sm font-medium ${
                             darkMode ? 'text-green-300' : 'text-green-700'
                           }`}>💰 Ganhos desta Entrega:</span>
                           <span className={`font-bold ${
                             darkMode ? 'text-green-300' : 'text-green-700'
                           }`}></span>
                         </div>
                         
                         {/* Detalhes do pagamento híbrido */}
                         {delivery.driverPayment.type === 'hybrid' && (
                           <div className={`mt-2 p-2 rounded ${
                             darkMode ? 'bg-gray-600' : 'bg-green-100'
                           }`}>
                             <div className="flex justify-between text-xs">
                               <span className={darkMode ? 'text-gray-300' : 'text-green-700'}>
                                 Fixo: 
                               </span>
                               <span className={darkMode ? 'text-gray-300' : 'text-green-700'}>
                                 + Por Entrega: 
                               </span>
                             </div>
                           </div>
                         )}
                         
                         {delivery.driverPayment.description && (
                           <p className={`text-xs mt-1 ${
                             darkMode ? 'text-gray-400' : 'text-green-600'
                           }`}>{delivery.driverPayment.description}</p>
                         )}
                         <div className={`text-xs mt-1 ${
                           darkMode ? 'text-gray-400' : 'text-green-600'
                         }`}>
                           Tipo: {
                             delivery.driverPayment.type === 'per_delivery' ? 'Por Entrega' : 
                             delivery.driverPayment.type === 'fixed' ? 'Valor Fixo' : 
                             'Híbrido (Fixo + Por Entrega)'
                           }
                         </div>
                       </div>
                     )}
                  
                                     {/* Action Buttons */}
                   <div className="flex flex-col sm:flex-row gap-2">
                     {delivery.status === 'preparing' && (
                       <button
                         onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
                         className="w-full sm:flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
                       >
                         <Truck className="w-4 h-4" />
                         <span>Iniciar Entrega</span>
                       </button>
                     )}
                    
                    {delivery.status === 'in_transit' && (
                      <button
                        onClick={() => updateDeliveryStatus(delivery.id, 'arrived')}
                        className="w-full sm:flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Cheguei</span>
                      </button>
                    )}
                    
                                         {delivery.status === 'arrived' && (
                       <button
                         onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                         className="w-full sm:flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 mobile-button"
                       >
                         <CheckCircle className="w-4 h-4" />
                         <span>Entregue</span>
                       </button>
                     )}
                    
                                                               {['preparing', 'in_transit', 'arrived'].includes(delivery.status) && (
                        <button
                          onClick={() => reportProblem(delivery.id)}
                          className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 mobile-button"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Problema</span>
                        </button>
                      )}
                     
                                           {delivery.status === 'problem' && (
                        <button
                          onClick={() => resumeDelivery(delivery.id)}
                          className="w-full sm:flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 mobile-button"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Retomar</span>
                        </button>
                      )}
                     
                                                                                       <button
                         onClick={() => openMaps(delivery.address)}
                         className={`w-full sm:w-auto border px-4 py-2 rounded-lg font-medium active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 mobile-button ${
                           darkMode 
                             ? 'border-gray-600 text-gray-200 hover:bg-gray-700' 
                             : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                         }`}
                       >
                         <Navigation className="w-4 h-4" />
                         <span>Maps</span>
                       </button>
                      
                                             <button
                         onClick={() => callCustomer(delivery.phone)}
                         className={`w-full sm:w-auto border px-4 py-2 rounded-lg font-medium active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 mobile-button ${
                           darkMode 
                             ? 'border-gray-600 text-gray-200 hover:bg-gray-700' 
                             : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                         }`}
                       >
                         <Phone className="w-4 h-4" />
                         <span>Ligar</span>
                       </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

             {/* Mobile Menu */}
       {showMenu && (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
           <div className={`absolute right-0 top-0 h-full w-72 sm:w-64 shadow-2xl transition-colors duration-300 ${
             darkMode ? 'bg-gray-800' : 'bg-white'
           }`}>
            <div className="p-6">
                             <div className="flex items-center space-x-3 mb-6">
                 <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                   <User className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <p className={`font-semibold ${
                     darkMode ? 'text-white' : 'text-gray-900'
                   }`}>{driverName}</p>
                   <p className={`text-sm ${
                     darkMode ? 'text-gray-300' : 'text-gray-600'
                   }`}>Motoboy</p>
                 </div>
               </div>
              
                             <nav className="space-y-2">
                 <button 
                   onClick={() => {
                     setShowHistory(false)
                     setShowSettings(false)
                     setShowMenu(false)
                   }}
                   className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left mobile-button transition-colors ${
                     darkMode 
                       ? 'hover:bg-gray-700 text-gray-200' 
                       : 'hover:bg-gray-100 text-gray-600'
                   }`}
                 >
                   <Home className="w-5 h-5" />
                   <span>Início</span>
                 </button>
                 <button 
                   onClick={() => {
                     setShowHistory(true)
                     setShowSettings(false)
                     setShowMenu(false)
                   }}
                   className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left mobile-button transition-colors ${
                     darkMode 
                       ? 'hover:bg-gray-700 text-gray-200' 
                       : 'hover:bg-gray-100 text-gray-600'
                   }`}
                 >
                   <List className="w-5 h-5" />
                   <span>Histórico</span>
                 </button>
                 <button 
                   onClick={() => {
                     setShowHistory(false)
                     setShowSettings(true)
                     setShowMenu(false)
                   }}
                   className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left mobile-button transition-colors ${
                     darkMode 
                       ? 'hover:bg-gray-700 text-gray-200' 
                       : 'hover:bg-gray-100 text-gray-600'
                   }`}
                 >
                   <Settings className="w-5 h-5" />
                   <span>Configurações</span>
                 </button>
               </nav>
              
                             <div className={`mt-6 pt-6 border-t transition-colors duration-300 ${
                 darkMode ? 'border-gray-700' : 'border-gray-200'
               }`}>
                 <button
                   onClick={handleLogout}
                   className={`w-full flex items-center space-x-3 p-3 rounded-lg mobile-button transition-colors ${
                     darkMode 
                       ? 'hover:bg-red-900 text-red-400' 
                       : 'hover:bg-red-50 text-red-600'
                   }`}
                 >
                   <LogOut className="w-5 h-5" />
                   <span>Sair</span>
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
