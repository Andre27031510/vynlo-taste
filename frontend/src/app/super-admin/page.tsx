'use client'

import { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy } from 'react'
import { 
  Users, 
  Settings, 
  Database, 
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Server,
  Lock,
  Zap,
  Info,
  X,
  Loader,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Bell,
  ArrowUp,
  ArrowDown,
  Target,
  Clock,
  Wifi,
  WifiOff,
  UserPlus,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  FileText,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Save,
  FolderOpen,
  AlertOctagon,
  CheckCircle2,
  XOctagon,
  Sliders,
  FileBarChart,
  BarChart4,
  FileSpreadsheet,
  FileDown,
  TrendingDown,
  Percent,
  MapPin,
  Star,
  Award
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

// Lazy loaded components for better performance
const LazyUserManagement = lazy(() => Promise.resolve({ default: memo(() => null) }))
const LazyMonitoringSystem = lazy(() => Promise.resolve({ default: memo(() => null) }))
const LazyReportsAnalytics = lazy(() => Promise.resolve({ default: memo(() => null) }))

// Accessible loading component
const AccessibleLoadingSpinner = memo(() => (
  <div 
    className="flex items-center justify-center py-12" 
    role="status" 
    aria-live="polite" 
    aria-label="Carregando conteúdo"
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
    <span className="sr-only">Carregando...</span>
  </div>
))

// Mock data for charts
const userGrowthData = [
  { month: 'Jan', users: 850, active: 720 },
  { month: 'Fev', users: 920, active: 780 },
  { month: 'Mar', users: 1050, active: 890 },
  { month: 'Abr', users: 1180, active: 980 },
  { month: 'Mai', users: 1234, active: 1050 },
  { month: 'Jun', users: 1320, active: 1120 }
]

const performanceData = [
  { time: '00:00', cpu: 15, memory: 45, disk: 30 },
  { time: '04:00', cpu: 12, memory: 42, disk: 28 },
  { time: '08:00', cpu: 25, memory: 55, disk: 35 },
  { time: '12:00', cpu: 35, memory: 65, disk: 45 },
  { time: '16:00', cpu: 28, memory: 58, disk: 38 },
  { time: '20:00', cpu: 23, memory: 52, disk: 32 }
]

const systemStatusData = [
  { name: 'Online', value: 98.5, color: '#10b981' },
  { name: 'Manutenção', value: 1.2, color: '#f59e0b' },
  { name: 'Offline', value: 0.3, color: '#ef4444' }
]

const trafficData = [
  { day: 'Seg', requests: 12500 },
  { day: 'Ter', requests: 15200 },
  { day: 'Qua', requests: 18900 },
  { day: 'Qui', requests: 16800 },
  { day: 'Sex', requests: 21300 },
  { day: 'Sáb', requests: 19600 },
  { day: 'Dom', requests: 14200 }
]

// Executive Dashboard Data
const revenueData = [
  { month: 'Jan', revenue: 125000, target: 120000 },
  { month: 'Fev', revenue: 142000, target: 135000 },
  { month: 'Mar', revenue: 158000, target: 150000 },
  { month: 'Abr', revenue: 167000, target: 160000 },
  { month: 'Mai', revenue: 189000, target: 175000 },
  { month: 'Jun', revenue: 205000, target: 190000 }
]

const ordersData = [
  { time: '00:00', orders: 45 },
  { time: '04:00', orders: 12 },
  { time: '08:00', orders: 89 },
  { time: '12:00', orders: 156 },
  { time: '16:00', orders: 134 },
  { time: '20:00', orders: 98 }
]

const kpiData = {
  activeUsers: { value: 1234, change: 12.5, trend: 'up' },
  revenue: { value: 205000, change: 8.7, trend: 'up' },
  orders: { value: 2847, change: -2.3, trend: 'down' },
  performance: { value: 98.5, change: 1.2, trend: 'up' }
}

const criticalAlerts = [
  { id: 1, type: 'error', message: 'Servidor de backup offline', time: '2 min atrás', priority: 'high' },
  { id: 2, type: 'warning', message: 'Uso de memória acima de 85%', time: '5 min atrás', priority: 'medium' },
  { id: 3, type: 'info', message: 'Atualização de segurança disponível', time: '15 min atrás', priority: 'low' }
]

// User Management Data
const mockUsers = [
  {
    id: 1,
    name: 'Ana Silva',
    email: 'ana.silva@vynlotaste.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2025-01-04 14:30',
    createdAt: '2024-12-01',
    permissions: ['read', 'write', 'delete', 'admin']
  },
  {
    id: 2,
    name: 'Carlos Santos',
    email: 'carlos.santos@vynlotaste.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2025-01-04 12:15',
    createdAt: '2024-11-15',
    permissions: ['read', 'write']
  },
  {
    id: 3,
    name: 'Maria Oliveira',
    email: 'maria.oliveira@vynlotaste.com',
    role: 'User',
    status: 'inactive',
    lastLogin: '2025-01-02 09:45',
    createdAt: '2024-10-20',
    permissions: ['read']
  },
  {
    id: 4,
    name: 'João Costa',
    email: 'joao.costa@vynlotaste.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2025-01-04 16:20',
    createdAt: '2024-09-10',
    permissions: ['read', 'write']
  },
  {
    id: 5,
    name: 'Fernanda Lima',
    email: 'fernanda.lima@vynlotaste.com',
    role: 'User',
    status: 'pending',
    lastLogin: 'Nunca',
    createdAt: '2025-01-03',
    permissions: ['read']
  }
]

const userActivities = [
  { id: 1, userId: 1, action: 'Login realizado', timestamp: '2025-01-04 14:30', ip: '192.168.1.100' },
  { id: 2, userId: 2, action: 'Pedido criado #1234', timestamp: '2025-01-04 12:15', ip: '192.168.1.101' },
  { id: 3, userId: 1, action: 'Usuário editado', timestamp: '2025-01-04 11:45', ip: '192.168.1.100' },
  { id: 4, userId: 4, action: 'Relatório gerado', timestamp: '2025-01-04 10:30', ip: '192.168.1.102' }
]

// Monitoring System Data
const systemServices = [
  { id: 1, name: 'API Gateway', status: 'online', uptime: '99.9%', responseTime: '45ms', lastCheck: '2025-01-04 16:30' },
  { id: 2, name: 'Database', status: 'online', uptime: '99.8%', responseTime: '12ms', lastCheck: '2025-01-04 16:30' },
  { id: 3, name: 'Redis Cache', status: 'online', uptime: '100%', responseTime: '2ms', lastCheck: '2025-01-04 16:30' },
  { id: 4, name: 'File Storage', status: 'warning', uptime: '98.5%', responseTime: '120ms', lastCheck: '2025-01-04 16:29' },
  { id: 5, name: 'Email Service', status: 'offline', uptime: '95.2%', responseTime: 'N/A', lastCheck: '2025-01-04 16:25' },
  { id: 6, name: 'Payment Gateway', status: 'online', uptime: '99.7%', responseTime: '89ms', lastCheck: '2025-01-04 16:30' }
]

const performanceMetrics = {
  cpu: { current: 23, threshold: 80, status: 'normal', history: [15, 18, 23, 25, 22, 20] },
  memory: { current: 67, threshold: 85, status: 'normal', history: [60, 65, 67, 70, 68, 65] },
  disk: { current: 45, threshold: 90, status: 'normal', history: [40, 42, 45, 47, 46, 44] },
  network: { current: 156, threshold: 1000, status: 'normal', history: [120, 140, 156, 180, 165, 150] }
}

const auditLogs = [
  { id: 1, timestamp: '2025-01-04 16:30:15', level: 'INFO', service: 'AUTH', message: 'Usuário ana.silva@vynlotaste.com realizou login', ip: '192.168.1.100' },
  { id: 2, timestamp: '2025-01-04 16:28:42', level: 'WARN', service: 'STORAGE', message: 'Espaço em disco acima de 80%', ip: 'system' },
  { id: 3, timestamp: '2025-01-04 16:25:33', level: 'ERROR', service: 'EMAIL', message: 'Falha ao enviar email de confirmação', ip: 'system' },
  { id: 4, timestamp: '2025-01-04 16:22:18', level: 'INFO', service: 'API', message: 'Pedido #1234 criado com sucesso', ip: '192.168.1.101' },
  { id: 5, timestamp: '2025-01-04 16:20:05', level: 'INFO', service: 'DB', message: 'Backup automático concluído', ip: 'system' },
  { id: 6, timestamp: '2025-01-04 16:15:22', level: 'WARN', service: 'CACHE', message: 'Cache hit rate abaixo de 90%', ip: 'system' }
]

const systemConfig = {
  general: {
    siteName: 'Vynlo Taste',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    maintenanceMode: false
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    twoFactorAuth: true
  },
  performance: {
    cacheEnabled: true,
    compressionEnabled: true,
    cdnEnabled: true,
    maxRequestSize: 10
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    webhookUrl: 'https://hooks.vynlotaste.com/alerts',
    alertThreshold: 85
  }
}

// Analytics and Reports Data
const businessMetrics = {
  revenue: {
    current: 205000,
    previous: 189000,
    growth: 8.5,
    target: 220000,
    data: [
      { month: 'Jan', value: 125000, target: 120000 },
      { month: 'Fev', value: 142000, target: 135000 },
      { month: 'Mar', value: 158000, target: 150000 },
      { month: 'Abr', value: 167000, target: 160000 },
      { month: 'Mai', value: 189000, target: 175000 },
      { month: 'Jun', value: 205000, target: 190000 }
    ]
  },
  orders: {
    current: 2847,
    previous: 2654,
    growth: 7.3,
    data: [
      { day: 'Seg', orders: 425, revenue: 12500 },
      { day: 'Ter', orders: 380, revenue: 15200 },
      { day: 'Qua', orders: 520, revenue: 18900 },
      { day: 'Qui', orders: 445, revenue: 16800 },
      { day: 'Sex', orders: 610, revenue: 21300 },
      { day: 'Sáb', orders: 467, revenue: 19600 }
    ]
  },
  customers: {
    total: 15420,
    new: 234,
    returning: 1890,
    churnRate: 2.3,
    satisfaction: 4.7
  },
  products: {
    topSelling: [
      { name: 'Pizza Margherita', sales: 1250, revenue: 31250 },
      { name: 'Hamburguer Artesanal', sales: 980, revenue: 29400 },
      { name: 'Sushi Combo', sales: 750, revenue: 37500 },
      { name: 'Salada Caesar', sales: 620, revenue: 12400 },
      { name: 'Lasanha Bolonhesa', sales: 580, revenue: 17400 }
    ],
    categories: [
      { name: 'Pizzas', percentage: 35, color: '#3b82f6' },
      { name: 'Hamburguer', percentage: 25, color: '#10b981' },
      { name: 'Sushi', percentage: 20, color: '#f59e0b' },
      { name: 'Saladas', percentage: 12, color: '#ef4444' },
      { name: 'Massas', percentage: 8, color: '#8b5cf6' }
    ]
  },
  geography: [
    { region: 'São Paulo', orders: 1250, revenue: 87500, growth: 12.5 },
    { region: 'Rio de Janeiro', orders: 890, revenue: 62300, growth: 8.2 },
    { region: 'Belo Horizonte', orders: 420, revenue: 29400, growth: 15.3 },
    { region: 'Brasília', orders: 287, revenue: 20090, growth: -2.1 }
  ]
}

const reportTemplates = [
  {
    id: 1,
    name: 'Relatório de Vendas Mensal',
    description: 'Análise completa das vendas do mês',
    type: 'sales',
    frequency: 'monthly',
    lastGenerated: '2025-01-01',
    status: 'active'
  },
  {
    id: 2,
    name: 'Performance de Produtos',
    description: 'Ranking dos produtos mais vendidos',
    type: 'products',
    frequency: 'weekly',
    lastGenerated: '2025-01-03',
    status: 'active'
  },
  {
    id: 3,
    name: 'Análise de Clientes',
    description: 'Comportamento e satisfação dos clientes',
    type: 'customers',
    frequency: 'monthly',
    lastGenerated: '2024-12-28',
    status: 'inactive'
  },
  {
    id: 4,
    name: 'Relatório Financeiro',
    description: 'Balanço financeiro e fluxo de caixa',
    type: 'financial',
    frequency: 'daily',
    lastGenerated: '2025-01-04',
    status: 'active'
  }
]

// Status Badge Component
const StatusBadge = ({ status, children }: { status: 'success' | 'warning' | 'error' | 'info', children: React.ReactNode }) => {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colors[status]} animate-pulse`}>
      {children}
    </span>
  )
}

// Tooltip Component
const Tooltip = ({ content, children }: { content: string, children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap animate-fade-in">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  )
}

// Modal Component - Accessible and Optimized
const Modal = memo(({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  const modalId = useMemo(() => `modal-${title.replace(/\s+/g, '-').toLowerCase()}`, [title])
  const titleId = useMemo(() => `${modalId}-title`, [modalId])
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus trap implementation
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastElement?.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault()
              firstElement?.focus()
            }
          }
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      firstElement?.focus()
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={`${modalId}-content`}
    >
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-xl sm:rounded-t-2xl">
          <h3 
            id={titleId}
            className="text-lg sm:text-xl font-bold text-slate-900 truncate pr-4"
          >
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 touch-manipulation flex-shrink-0"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5 text-slate-500" aria-hidden="true" />
          </button>
        </div>
        <div id={`${modalId}-content`} className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  )
})

// Animated Card Component
const AnimatedCard = ({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}>
      {children}
    </div>
  )
}

// KPI Card Component - Memoized and Accessible
const KPICard = memo(({ title, value, change, trend, icon: Icon, color, format = 'number' }: {
  title: string
  value: number
  change: number
  trend: 'up' | 'down'
  icon: any
  color: string
  format?: 'number' | 'currency' | 'percentage'
}) => {
  const formatValue = useCallback((val: number) => {
    switch (format) {
      case 'currency':
        return `R$ ${val.toLocaleString()}`
      case 'percentage':
        return `${val}%`
      default:
        return val.toLocaleString()
    }
  }, [format])

  const formattedValue = useMemo(() => formatValue(value), [formatValue, value])
  const trendLabel = useMemo(() => trend === 'up' ? 'Crescimento' : 'Declínio', [trend])
  const ariaLabel = useMemo(() => 
    `${title}: ${formattedValue}, ${trendLabel} de ${Math.abs(change)}% este mês`,
    [title, formattedValue, trendLabel, change]
  )
  
  return (
    <div 
      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer group touch-manipulation focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2"
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          // Handle click action
        }
      }}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex items-center space-x-1" aria-hidden="true">
          {trend === 'up' ? (
            <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
          ) : (
            <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
          )}
          <span className={`text-xs sm:text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
        </div>
      </div>
      <div>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1" id={`${title.replace(/\s+/g, '-').toLowerCase()}-label`}>
          {title}
        </p>
        <p 
          className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-manrope group-hover:scale-105 transition-transform duration-300 break-all"
          aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-label`}
        >
          {formattedValue}
        </p>
      </div>
      <div className="mt-3 sm:mt-4 flex items-center">
        <div className={`w-2 h-2 ${trend === 'up' ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2 animate-pulse`} aria-hidden="true"></div>
        <span className="text-xs text-slate-700 font-medium">
          {trendLabel} este mês
        </span>
      </div>
    </div>
  )
})

// Alert Component - Mobile Optimized
const AlertCard = ({ alert }: { alert: any }) => {
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50'
      case 'warning': return 'border-amber-200 bg-amber-50'
      default: return 'border-blue-200 bg-blue-50'
    }
  }
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
      default: return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
    }
  }
  
  return (
    <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${getAlertColor(alert.type)} hover:shadow-md transition-all duration-200 touch-manipulation`}>
      <div className="flex items-start space-x-2 sm:space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getAlertIcon(alert.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-1 break-words">{alert.message}</p>
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-600">{alert.time}</p>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
              alert.priority === 'high' ? 'bg-red-100 text-red-800' :
              alert.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {alert.priority === 'high' ? 'Alta' : alert.priority === 'medium' ? 'Média' : 'Baixa'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// User Table Component - Mobile Optimized
const UserTable = ({ users, onEdit, onDelete, onView, selectedUsers, onSelectUser, onSelectAll }: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-amber-100 text-amber-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800'
      case 'Manager': return 'bg-blue-100 text-blue-800'
      case 'User': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4 px-4">
        {users.map((user: any) => (
          <div key={user.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => onSelectUser(user.id)}
                  className="rounded border-slate-300 mt-1"
                />
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                  <p className="text-sm text-slate-600 truncate">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                  {user.status === 'active' ? 'Ativo' : user.status === 'inactive' ? 'Inativo' : 'Pendente'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">{user.lastLogin}</p>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onView(user)}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <table className="hidden sm:table w-full min-w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 sm:py-4 px-2 sm:px-4">
              <input
                type="checkbox"
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-slate-300"
              />
            </th>
            <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-slate-700 text-sm sm:text-base">Usuário</th>
            <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-slate-700 text-sm sm:text-base">Função</th>
            <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-slate-700 text-sm sm:text-base">Status</th>
            <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-slate-700 text-sm sm:text-base hidden lg:table-cell">Último Login</th>
            <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-slate-700 text-sm sm:text-base">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="py-3 sm:py-4 px-2 sm:px-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => onSelectUser(user.id)}
                  className="rounded border-slate-300"
                />
              </td>
              <td className="py-3 sm:py-4 px-2 sm:px-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs sm:text-sm">
                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">{user.name}</p>
                    <p className="text-xs sm:text-sm text-slate-600 truncate">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 sm:py-4 px-2 sm:px-4">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="py-3 sm:py-4 px-2 sm:px-4">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                  {user.status === 'active' ? 'Ativo' : user.status === 'inactive' ? 'Inativo' : 'Pendente'}
                </span>
              </td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-600 hidden lg:table-cell">{user.lastLogin}</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() => onView(user)}
                    className="p-1.5 sm:p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className="p-1.5 sm:p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-1.5 sm:p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// User Form Component
const UserForm = ({ user, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'User',
    status: user?.status || 'active',
    permissions: user?.permissions || ['read']
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...user, ...formData, id: user?.id || Date.now() })
  }

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Função</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          >
            <option value="User">Usuário</option>
            <option value="Manager">Gerente</option>
            <option value="Admin">Administrador</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="pending">Pendente</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">Permissões</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['read', 'write', 'delete', 'admin'].map(permission => (
            <label key={permission} className="flex items-center space-x-2 cursor-pointer touch-manipulation">
              <input
                type="checkbox"
                checked={formData.permissions.includes(permission)}
                onChange={() => togglePermission(permission)}
                className="rounded border-slate-300 w-4 h-4"
              />
              <span className="text-sm text-slate-700 capitalize">{permission}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors touch-manipulation"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 sm:px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
        >
          {user ? 'Atualizar' : 'Criar'} Usuário
        </button>
      </div>
    </form>
  )
}

// Service Status Component
const ServiceStatus = ({ service }: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-amber-600 bg-amber-100'
      case 'offline': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle2 className="w-5 h-5" />
      case 'warning': return <AlertOctagon className="w-5 h-5" />
      case 'offline': return <XOctagon className="w-5 h-5" />
      default: return <Monitor className="w-5 h-5" />
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">{service.name}</h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(service.status)}`}>
          {getStatusIcon(service.status)}
          <span className="text-sm font-medium capitalize">{service.status}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-600">Uptime:</span>
          <span className="ml-2 font-medium text-slate-900">{service.uptime}</span>
        </div>
        <div>
          <span className="text-slate-600">Resposta:</span>
          <span className="ml-2 font-medium text-slate-900">{service.responseTime}</span>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-500">
        Última verificação: {service.lastCheck}
      </div>
    </div>
  )
}

// Performance Metric Component
const PerformanceMetric = ({ title, metric, icon: Icon }: any) => {
  const getStatusColor = (current: number, threshold: number) => {
    const percentage = (current / threshold) * 100
    if (percentage >= 90) return 'text-red-600 bg-red-100'
    if (percentage >= 70) return 'text-amber-600 bg-amber-100'
    return 'text-green-600 bg-green-100'
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full ${getStatusColor(metric.current, metric.threshold)}`}>
          <span className="text-sm font-medium">{metric.status}</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-slate-900">{metric.current}%</span>
          <span className="text-sm text-slate-600">Limite: {metric.threshold}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              (metric.current / metric.threshold) * 100 >= 90 ? 'bg-red-500' :
              (metric.current / metric.threshold) * 100 >= 70 ? 'bg-amber-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min((metric.current / metric.threshold) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      <div className="text-xs text-slate-500">
        Histórico: {metric.history.join('% → ')}%
      </div>
    </div>
  )
}

// Progress Bar Component
const ProgressBar = ({ progress, label }: { progress: number, label: string }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm text-slate-600">{progress}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

// Business Metric Card Component
const BusinessMetricCard = ({ title, current, previous, growth, target, icon: Icon, format = 'currency' }: any) => {
  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return `R$ ${value.toLocaleString()}`
      case 'number':
        return value.toLocaleString()
      case 'percentage':
        return `${value}%`
      default:
        return value.toString()
    }
  }

  const isPositive = growth >= 0
  const targetProgress = target ? (current / target) * 100 : 0

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-slate-900">{title}</h3>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
          isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-semibold">{Math.abs(growth)}%</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-3xl font-black text-slate-900 font-manrope">{formatValue(current)}</p>
          <p className="text-sm text-slate-600">Anterior: {formatValue(previous)}</p>
        </div>
        
        {target && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-600">Meta: {formatValue(target)}</span>
              <span className="text-sm font-medium text-slate-900">{targetProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  targetProgress >= 100 ? 'bg-green-500' : 
                  targetProgress >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(targetProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Report Template Card Component
const ReportTemplateCard = ({ template, onGenerate, onEdit }: any) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales': return <BarChart4 className="w-5 h-5" />
      case 'products': return <PieChart className="w-5 h-5" />
      case 'customers': return <Users className="w-5 h-5" />
      case 'financial': return <DollarSign className="w-5 h-5" />
      default: return <FileBarChart className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            {getTypeIcon(template.type)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{template.name}</h3>
            <p className="text-sm text-slate-600">{template.description}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
          {template.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
        <span>Frequência: {template.frequency === 'daily' ? 'Diária' : template.frequency === 'weekly' ? 'Semanal' : 'Mensal'}</span>
        <span>Último: {template.lastGenerated}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onGenerate(template)}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileDown className="w-4 h-4" />
          <span>Gerar</span>
        </button>
        <button
          onClick={() => onEdit(template)}
          className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Export Button Component
const ExportButton = ({ type, onClick, loading = false }: { type: 'pdf' | 'excel', onClick: () => void, loading?: boolean }) => {
  const config = {
    pdf: { label: 'PDF', icon: FileDown, color: 'bg-red-600 hover:bg-red-700' },
    excel: { label: 'Excel', icon: FileSpreadsheet, color: 'bg-green-600 hover:bg-green-700' }
  }
  
  const { label, icon: Icon, color } = config[type]
  
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${color}`}
    >
      {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
      <span>{loading ? 'Gerando...' : label}</span>
    </button>
  )
}

// Real-time data with WebSocket integration
const useRealTimeData = () => {
  const [realTimeKpis, setRealTimeKpis] = useState(kpiData)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeKpis(prev => ({
        activeUsers: {
          ...prev.activeUsers,
          value: prev.activeUsers.value + Math.floor(Math.random() * 10 - 5)
        },
        revenue: {
          ...prev.revenue,
          value: prev.revenue.value + Math.floor(Math.random() * 1000 - 500)
        },
        orders: {
          ...prev.orders,
          value: prev.orders.value + Math.floor(Math.random() * 20 - 10)
        },
        performance: {
          ...prev.performance,
          value: Math.max(95, Math.min(100, prev.performance.value + (Math.random() * 2 - 1)))
        }
      }))
      setLastUpdate(new Date())
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return { realTimeKpis, lastUpdate, isLoading, error }
}

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState('')
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [monitoringTab, setMonitoringTab] = useState('services')
  const [logFilter, setLogFilter] = useState('all')
  const [logSearch, setLogSearch] = useState('')
  const [backupProgress, setBackupProgress] = useState(0)
  const [isBackupRunning, setIsBackupRunning] = useState(false)
  const [config, setConfig] = useState(systemConfig)
  const [reportsTab, setReportsTab] = useState('dashboard')
  const [dateRange, setDateRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [reportFilters, setReportFilters] = useState({
    startDate: '2024-12-01',
    endDate: '2025-01-04',
    category: 'all',
    region: 'all'
  })
  const { realTimeKpis, lastUpdate, isLoading: kpiLoading } = useRealTimeData()

  // Initialize with mock data
  useEffect(() => {
    if (activeTab === 'users') {
      setUsers(mockUsers)
    }
  }, [activeTab])

  // Memoized User Management Functions for Performance
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  const usersPerPage = 5
  const totalPages = useMemo(() => Math.ceil(filteredUsers.length / usersPerPage), [filteredUsers.length])
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    )
  }, [filteredUsers, currentPage])

  // Memoized callbacks for performance optimization
  const handleSelectUser = useCallback((userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }, [])

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedUsers(checked ? paginatedUsers.map(u => u.id) : [])
  }, [paginatedUsers])

  const handleEditUser = useCallback((user: any) => {
    setSelectedUser(user)
    setShowUserForm(true)
  }, [])

  const handleDeleteUser = useCallback((user: any) => {
    if (confirm(`Tem certeza que deseja excluir ${user.name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id))
    }
  }, [])

  const handleViewUser = useCallback((user: any) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }, [])

  const handleSaveUser = useCallback((userData: any) => {
    if (userData.id && users.find(u => u.id === userData.id)) {
      setUsers(prev => prev.map(u => u.id === userData.id ? userData : u))
    } else {
      setUsers(prev => [...prev, { ...userData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }])
    }
    setShowUserForm(false)
    setSelectedUser(null)
  }, [users])

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return
    
    switch (action) {
      case 'activate':
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u
        ))
        break
      case 'deactivate':
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'inactive' } : u
        ))
        break
      case 'delete':
        if (confirm(`Tem certeza que deseja excluir ${selectedUsers.length} usuários?`)) {
          setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)))
        }
        break
    }
    setSelectedUsers([])
  }

  // Reports and Analytics Functions
  const generateReport = async (template: any) => {
    console.log('Gerando relatório:', template.name)
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  const exportData = async (format: 'pdf' | 'excel') => {
    console.log(`Exportando dados em formato ${format}`)
    await new Promise(resolve => setTimeout(resolve, 1500))
  }

  const updateReportFilters = (key: string, value: any) => {
    setReportFilters(prev => ({ ...prev, [key]: value }))
  }

  // Monitoring Functions
  const [logs, setLogs] = useState(auditLogs)
  const [services, setServices] = useState(systemServices)
  const [metrics, setMetrics] = useState(performanceMetrics)

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesLevel = logFilter === 'all' || log.level.toLowerCase() === logFilter.toLowerCase()
      const matchesSearch = log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
                           log.service.toLowerCase().includes(logSearch.toLowerCase())
      return matchesLevel && matchesSearch
    })
  }, [logs, logFilter, logSearch])

  const startBackup = () => {
    setIsBackupRunning(true)
    setBackupProgress(0)
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackupRunning(false)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
  }

  // Initialize monitoring data
  useEffect(() => {
    if (activeTab === 'monitoring') {
      setServices(systemServices)
      setLogs(auditLogs)
      setConfig(systemConfig)
    }
  }, [activeTab])

  const updateConfig = (category: string, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  if (activeTab === 'reports') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2 font-manrope">
                Relatórios e Analytics
              </h1>
              <p className="text-lg text-slate-600">Análises avançadas e relatórios customizados</p>
            </div>
            <div className="mt-6 lg:mt-0 flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Voltar ao Dashboard
              </button>
              <div className="flex items-center space-x-2">
                <ExportButton type="pdf" onClick={() => exportData('pdf')} />
                <ExportButton type="excel" onClick={() => exportData('excel')} />
              </div>
            </div>
          </div>

          {/* Reports Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 mb-8">
            <div className="border-b border-slate-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'sales', label: 'Vendas', icon: TrendingUp },
                  { id: 'products', label: 'Produtos', icon: PieChart },
                  { id: 'customers', label: 'Clientes', icon: Users },
                  { id: 'templates', label: 'Relatórios', icon: FileBarChart }
                ].map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setReportsTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        reportsTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Dashboard Tab */}
              {reportsTab === 'dashboard' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Dashboard Executivo</h3>
                    <div className="flex items-center space-x-4">
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="7d">Últimos 7 dias</option>
                        <option value="30d">Últimos 30 dias</option>
                        <option value="90d">Últimos 90 dias</option>
                        <option value="1y">Último ano</option>
                      </select>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-slate-600">Tempo Real</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <BusinessMetricCard
                      title="Receita Total"
                      current={businessMetrics.revenue.current}
                      previous={businessMetrics.revenue.previous}
                      growth={businessMetrics.revenue.growth}
                      target={businessMetrics.revenue.target}
                      icon={DollarSign}
                      format="currency"
                    />
                    <BusinessMetricCard
                      title="Pedidos"
                      current={businessMetrics.orders.current}
                      previous={businessMetrics.orders.previous}
                      growth={businessMetrics.orders.growth}
                      icon={ShoppingCart}
                      format="number"
                    />
                    <BusinessMetricCard
                      title="Novos Clientes"
                      current={businessMetrics.customers.new}
                      previous={198}
                      growth={18.2}
                      icon={UserPlus}
                      format="number"
                    />
                    <BusinessMetricCard
                      title="Satisfação"
                      current={businessMetrics.customers.satisfaction}
                      previous={4.5}
                      growth={4.4}
                      icon={Star}
                      format="number"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue Chart */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Receita vs Meta</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={businessMetrics.revenue.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: 'none', 
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                            formatter={(value) => [`R$ ${value.toLocaleString()}`, '']}
                          />
                          <Legend />
                          <Bar dataKey="target" fill="#e2e8f0" name="Meta" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="value" fill="#10b981" name="Receita" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Orders Chart */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Pedidos por Dia</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={businessMetrics.orders.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: 'none', 
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="orders" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                            name="Pedidos"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Sales Tab */}
              {reportsTab === 'sales' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Análise de Vendas</h3>
                    <div className="flex items-center space-x-4">
                      <input
                        type="date"
                        value={reportFilters.startDate}
                        onChange={(e) => updateReportFilters('startDate', e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-slate-600">até</span>
                      <input
                        type="date"
                        value={reportFilters.endDate}
                        onChange={(e) => updateReportFilters('endDate', e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="bg-slate-50 rounded-xl p-6">
                        <h4 className="font-semibold text-slate-900 mb-4">Vendas por Região</h4>
                        <div className="space-y-4">
                          {businessMetrics.geography.map((region, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                              <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <div>
                                  <p className="font-medium text-slate-900">{region.region}</p>
                                  <p className="text-sm text-slate-600">{region.orders} pedidos</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900">R$ {region.revenue.toLocaleString()}</p>
                                <div className={`flex items-center space-x-1 ${
                                  region.growth >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {region.growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                  <span className="text-sm font-medium">{Math.abs(region.growth)}%</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-slate-50 rounded-xl p-6">
                        <h4 className="font-semibold text-slate-900 mb-4">Resumo do Período</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Total de Vendas</span>
                            <span className="font-semibold text-slate-900">R$ 205.000</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Total de Pedidos</span>
                            <span className="font-semibold text-slate-900">2.847</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Ticket Médio</span>
                            <span className="font-semibold text-slate-900">R$ 72</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Crescimento</span>
                            <div className="flex items-center space-x-1 text-green-600">
                              <TrendingUp className="w-4 h-4" />
                              <span className="font-semibold">8.5%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {reportsTab === 'products' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Análise de Produtos</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Products */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Produtos Mais Vendidos</h4>
                      <div className="space-y-3">
                        {businessMetrics.products.topSelling.map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{product.name}</p>
                                <p className="text-sm text-slate-600">{product.sales} vendas</p>
                              </div>
                            </div>
                            <p className="font-semibold text-slate-900">R$ {product.revenue.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Categories Chart */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Vendas por Categoria</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={businessMetrics.products.categories}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="percentage"
                          >
                            {businessMetrics.products.categories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: 'none', 
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                            formatter={(value) => [`${value}%`, 'Participação']}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Customers Tab */}
              {reportsTab === 'customers' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Análise de Clientes</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Users className="w-8 h-8 text-blue-600" />
                        <h4 className="font-semibold text-slate-900">Total de Clientes</h4>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">{businessMetrics.customers.total.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <UserPlus className="w-8 h-8 text-green-600" />
                        <h4 className="font-semibold text-slate-900">Novos Clientes</h4>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">{businessMetrics.customers.new}</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <RefreshCw className="w-8 h-8 text-purple-600" />
                        <h4 className="font-semibold text-slate-900">Clientes Recorrentes</h4>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">{businessMetrics.customers.returning}</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Star className="w-8 h-8 text-amber-600" />
                        <h4 className="font-semibold text-slate-900">Satisfação</h4>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">{businessMetrics.customers.satisfaction}/5</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Métricas de Retenção</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900 mb-2">{businessMetrics.customers.churnRate}%</p>
                        <p className="text-slate-600">Taxa de Churn</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900 mb-2">67%</p>
                        <p className="text-slate-600">Taxa de Retenção</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900 mb-2">R$ 156</p>
                        <p className="text-slate-600">LTV Médio</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Templates Tab */}
              {reportsTab === 'templates' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Relatórios Customizados</h3>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <FileBarChart className="w-4 h-4" />
                      <span>Novo Relatório</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportTemplates.map(template => (
                      <ReportTemplateCard
                        key={template.id}
                        template={template}
                        onGenerate={generateReport}
                        onEdit={(template: any) => console.log('Editando:', template.name)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'monitoring') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2 font-manrope">
                Sistema de Monitoramento
              </h1>
              <p className="text-lg text-slate-600">Monitoramento em tempo real e configurações do sistema</p>
            </div>
            <div className="mt-6 lg:mt-0 flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Voltar ao Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>

          {/* Monitoring Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 mb-8">
            <div className="border-b border-slate-200">
              <nav className="flex overflow-x-auto space-x-4 sm:space-x-8 px-4 sm:px-6 scrollbar-hide">
                {[
                  { id: 'services', label: 'Serviços', icon: Monitor },
                  { id: 'performance', label: 'Performance', icon: Activity },
                  { id: 'logs', label: 'Logs', icon: FileText },
                  { id: 'backup', label: 'Backup', icon: HardDrive },
                  { id: 'config', label: 'Config', icon: Sliders }
                ].map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setMonitoringTab(tab.id)}
                      className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap touch-manipulation ${
                        monitoringTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.id === 'config' ? 'Config' : tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Services Tab */}
              {monitoringTab === 'services' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Status dos Serviços</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-600">Atualização em tempo real</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                      <ServiceStatus key={service.id} service={service} />
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {monitoringTab === 'performance' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Métricas de Performance</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-600">Última atualização: {lastUpdate.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PerformanceMetric title="CPU" metric={performanceMetrics.cpu} icon={Cpu} />
                    <PerformanceMetric title="Memória" metric={performanceMetrics.memory} icon={MemoryStick} />
                    <PerformanceMetric title="Disco" metric={performanceMetrics.disk} icon={HardDrive} />
                    <PerformanceMetric title="Rede" metric={performanceMetrics.network} icon={Network} />
                  </div>
                </div>
              )}

              {/* Logs Tab */}
              {monitoringTab === 'logs' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Logs de Auditoria</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Buscar logs..."
                          value={logSearch}
                          onChange={(e) => setLogSearch(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <select
                        value={logFilter}
                        onChange={(e) => setLogFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Todos os Níveis</option>
                        <option value="info">INFO</option>
                        <option value="warn">WARN</option>
                        <option value="error">ERROR</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredLogs.map(log => {
                      const getLevelColor = (level: string) => {
                        switch (level) {
                          case 'ERROR': return 'bg-red-100 text-red-800'
                          case 'WARN': return 'bg-amber-100 text-amber-800'
                          case 'INFO': return 'bg-blue-100 text-blue-800'
                          default: return 'bg-gray-100 text-gray-800'
                        }
                      }
                      
                      return (
                        <div key={log.id} className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelColor(log.level)}`}>
                                  {log.level}
                                </span>
                                <span className="text-sm font-medium text-slate-700">{log.service}</span>
                                <span className="text-xs text-slate-500">{log.timestamp}</span>
                              </div>
                              <p className="text-sm text-slate-900">{log.message}</p>
                              <p className="text-xs text-slate-500 mt-1">IP: {log.ip}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Backup Tab */}
              {monitoringTab === 'backup' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Backup e Restore</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={startBackup}
                        disabled={isBackupRunning}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isBackupRunning ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        <span>{isBackupRunning ? 'Executando...' : 'Iniciar Backup'}</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                        <span>Restore</span>
                      </button>
                    </div>
                  </div>
                  
                  {isBackupRunning && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-blue-900 mb-4">Backup em Andamento</h4>
                      <ProgressBar progress={backupProgress} label="Progresso do Backup" />
                      <p className="text-sm text-blue-700 mt-2">
                        {backupProgress < 30 ? 'Preparando arquivos...' :
                         backupProgress < 70 ? 'Compactando dados...' :
                         backupProgress < 95 ? 'Finalizando backup...' : 'Backup concluído!'}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-lg p-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Backups Recentes</h4>
                      <div className="space-y-3">
                        {[
                          { date: '2025-01-04 16:00', size: '2.3 GB', status: 'Concluído' },
                          { date: '2025-01-03 16:00', size: '2.1 GB', status: 'Concluído' },
                          { date: '2025-01-02 16:00', size: '2.0 GB', status: 'Concluído' }
                        ].map((backup, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div>
                              <p className="text-sm font-medium text-slate-900">{backup.date}</p>
                              <p className="text-xs text-slate-600">{backup.size}</p>
                            </div>
                            <span className="text-xs text-green-600 font-medium">{backup.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Configurações de Backup</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Backup Automático</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Frequência</span>
                          <select className="text-sm border border-slate-300 rounded px-2 py-1">
                            <option>Diário</option>
                            <option>Semanal</option>
                            <option>Mensal</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Retenção</span>
                          <select className="text-sm border border-slate-300 rounded px-2 py-1">
                            <option>30 dias</option>
                            <option>60 dias</option>
                            <option>90 dias</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Config Tab */}
              {monitoringTab === 'config' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Configurações do Sistema</h3>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Save className="w-4 h-4" />
                      <span>Salvar Alterações</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* General Settings */}
                    <div className="bg-slate-50 rounded-lg p-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Configurações Gerais</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Site</label>
                          <input
                            type="text"
                            value={config.general.siteName}
                            onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Fuso Horário</label>
                          <select
                            value={config.general.timezone}
                            onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="America/Sao_Paulo">São Paulo (UTC-3)</option>
                            <option value="America/New_York">Nova York (UTC-5)</option>
                            <option value="Europe/London">Londres (UTC+0)</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Modo Manutenção</span>
                          <input
                            type="checkbox"
                            checked={config.general.maintenanceMode}
                            onChange={(e) => updateConfig('general', 'maintenanceMode', e.target.checked)}
                            className="rounded"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-slate-50 rounded-lg p-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Configurações de Segurança</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Timeout de Sessão (min)</label>
                          <input
                            type="number"
                            value={config.security.sessionTimeout}
                            onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Máx. Tentativas de Login</label>
                          <input
                            type="number"
                            value={config.security.maxLoginAttempts}
                            onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Autenticação 2FA</span>
                          <input
                            type="checkbox"
                            checked={config.security.twoFactorAuth}
                            onChange={(e) => updateConfig('security', 'twoFactorAuth', e.target.checked)}
                            className="rounded"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Performance Settings */}
                    <div className="bg-slate-50 rounded-lg p-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Configurações de Performance</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Cache Habilitado</span>
                          <input
                            type="checkbox"
                            checked={config.performance.cacheEnabled}
                            onChange={(e) => updateConfig('performance', 'cacheEnabled', e.target.checked)}
                            className="rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Compressão</span>
                          <input
                            type="checkbox"
                            checked={config.performance.compressionEnabled}
                            onChange={(e) => updateConfig('performance', 'compressionEnabled', e.target.checked)}
                            className="rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">CDN</span>
                          <input
                            type="checkbox"
                            checked={config.performance.cdnEnabled}
                            onChange={(e) => updateConfig('performance', 'cdnEnabled', e.target.checked)}
                            className="rounded"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-slate-50 rounded-lg p-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Configurações de Notificação</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Alertas por E-mail</span>
                          <input
                            type="checkbox"
                            checked={config.notifications.emailAlerts}
                            onChange={(e) => updateConfig('notifications', 'emailAlerts', e.target.checked)}
                            className="rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Alertas por SMS</span>
                          <input
                            type="checkbox"
                            checked={config.notifications.smsAlerts}
                            onChange={(e) => updateConfig('notifications', 'smsAlerts', e.target.checked)}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Limite de Alerta (%)</label>
                          <input
                            type="number"
                            value={config.notifications.alertThreshold}
                            onChange={(e) => updateConfig('notifications', 'alertThreshold', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'users') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2 font-manrope">
                Gerenciamento de Usuários
              </h1>
              <p className="text-lg text-slate-600">Controle completo de usuários e permissões</p>
            </div>
            <div className="mt-6 lg:mt-0 flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Voltar ao Dashboard
              </button>
              <button
                onClick={() => { setSelectedUser(null); setShowUserForm(true) }}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                <span>Novo Usuário</span>
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas as Funções</option>
                <option value="Admin">Administrador</option>
                <option value="Manager">Gerente</option>
                <option value="User">Usuário</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="pending">Pendente</option>
              </select>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-4 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Importar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">
                  {selectedUsers.length} usuário(s) selecionado(s)
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="flex items-center space-x-1 px-3 py-2 text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Ativar</span>
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="flex items-center space-x-1 px-3 py-2 text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Desativar</span>
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="flex items-center space-x-1 px-3 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Usuários ({filteredUsers.length})</h3>
            </div>
            <UserTable
              users={paginatedUsers}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onView={handleViewUser}
              selectedUsers={selectedUsers}
              onSelectUser={handleSelectUser}
              onSelectAll={handleSelectAll}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Mostrando {((currentPage - 1) * usersPerPage) + 1} a {Math.min(currentPage * usersPerPage, filteredUsers.length)} de {filteredUsers.length} usuários
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Form Modal */}
          <Modal
            isOpen={showUserForm}
            onClose={() => { setShowUserForm(false); setSelectedUser(null) }}
            title={selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
          >
            <UserForm
              user={selectedUser}
              onSave={handleSaveUser}
              onCancel={() => { setShowUserForm(false); setSelectedUser(null) }}
            />
          </Modal>

          {/* User Details Modal */}
          <Modal
            isOpen={isUserModalOpen}
            onClose={() => { setIsUserModalOpen(false); setSelectedUser(null) }}
            title="Detalhes do Usuário"
          >
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedUser.name}</h3>
                    <p className="text-slate-600">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Função</label>
                    <p className="text-slate-900">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                    <p className="text-slate-900">{selectedUser.status}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Último Login</label>
                    <p className="text-slate-900">{selectedUser.lastLogin}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Criado em</label>
                    <p className="text-slate-900">{selectedUser.createdAt}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Permissões</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.permissions.map((permission: string) => (
                      <span key={permission} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Atividades Recentes</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {userActivities
                      .filter(activity => activity.userId === selectedUser.id)
                      .map(activity => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-sm text-slate-900">{activity.action}</span>
                          <span className="text-xs text-slate-600">{activity.timestamp}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Skip Links for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Pular para conteúdo principal
      </a>
      <a 
        href="#navigation" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Pular para navegação
      </a>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <main id="main-content" role="main" tabIndex={-1}>
        {/* Executive Header - Accessible and Mobile First */}
        <header className="mb-8 sm:mb-12" role="banner">
          <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-2 sm:mb-4 font-manrope">
                Dashboard Executivo
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 font-manrope leading-relaxed px-4 lg:px-0">
                Visão estratégica completa do Vynlo Taste
              </p>
            </div>
            
            {/* Navigation - Accessible */}
            <nav className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:flex-wrap sm:gap-3 lg:flex-nowrap lg:space-x-4" role="navigation" aria-label="Navegação principal">
              {/* Action Buttons - Accessible */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3" role="group" aria-label="Ações principais">
                <button
                  onClick={() => setActiveTab('users')}
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-3 sm:py-2 bg-white rounded-xl shadow-lg border border-slate-100 hover:shadow-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 touch-manipulation"
                  aria-label="Ir para gerenciamento de usuários"
                  aria-pressed={activeTab === 'users'}
                >
                  <Users className="w-4 h-4 text-slate-600" aria-hidden="true" />
                  <span className="text-sm font-semibold text-slate-800">Usuários</span>
                </button>
                <button
                  onClick={() => setActiveTab('monitoring')}
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-3 sm:py-2 bg-white rounded-xl shadow-lg border border-slate-100 hover:shadow-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 touch-manipulation"
                  aria-label="Ir para sistema de monitoramento"
                  aria-pressed={activeTab === 'monitoring'}
                >
                  <Monitor className="w-4 h-4 text-slate-600" aria-hidden="true" />
                  <span className="text-sm font-semibold text-slate-800">Monitor</span>
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-3 sm:py-2 bg-white rounded-xl shadow-lg border border-slate-100 hover:shadow-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 touch-manipulation"
                  aria-label="Ir para relatórios e analytics"
                  aria-pressed={activeTab === 'reports'}
                >
                  <FileBarChart className="w-4 h-4 text-slate-600" aria-hidden="true" />
                  <span className="text-sm font-semibold text-slate-800">Relatórios</span>
                </button>
              </div>
              
              {/* Status Indicators - Accessible */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3" role="group" aria-label="Indicadores de status">
                <div 
                  className="flex items-center justify-center space-x-2 bg-white px-3 sm:px-4 py-2 rounded-xl shadow-lg border border-slate-100"
                  role="status"
                  aria-live="polite"
                  aria-label="Sistema em tempo real ativo"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">Tempo Real</span>
                </div>
                <div 
                  className="bg-white px-3 sm:px-4 py-2 rounded-xl shadow-lg border border-slate-100"
                  role="status"
                  aria-live="polite"
                  aria-label={`Última atualização: ${lastUpdate.toLocaleTimeString()}`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" aria-hidden="true" />
                    <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">
                      {lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </header>

        {/* Executive KPIs - Accessible Grid */}
        <section 
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12"
          role="region"
          aria-labelledby="kpis-heading"
        >
          <h2 id="kpis-heading" className="sr-only">Indicadores chave de performance</h2>
          
          <Suspense fallback={<AccessibleLoadingSpinner />}>
            <AnimatedCard delay={100}>
              <Tooltip content="Usuários ativos em tempo real">
                <KPICard
                  title="Usuários Ativos"
                  value={realTimeKpis.activeUsers.value}
                  change={realTimeKpis.activeUsers.change}
                  trend={realTimeKpis.activeUsers.trend}
                  icon={Users}
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
              </Tooltip>
            </AnimatedCard>
          </Suspense>

          <Suspense fallback={<AccessibleLoadingSpinner />}>
            <AnimatedCard delay={200}>
              <Tooltip content="Receita total do mês">
                <KPICard
                  title="Receita Mensal"
                  value={realTimeKpis.revenue.value}
                  change={realTimeKpis.revenue.change}
                  trend={realTimeKpis.revenue.trend}
                  icon={DollarSign}
                  color="bg-gradient-to-br from-green-500 to-green-600"
                  format="currency"
                />
              </Tooltip>
            </AnimatedCard>
          </Suspense>

          <Suspense fallback={<AccessibleLoadingSpinner />}>
            <AnimatedCard delay={300}>
              <Tooltip content="Total de pedidos processados">
                <KPICard
                  title="Pedidos Hoje"
                  value={realTimeKpis.orders.value}
                  change={realTimeKpis.orders.change}
                  trend={realTimeKpis.orders.trend}
                  icon={ShoppingCart}
                  color="bg-gradient-to-br from-amber-500 to-amber-600"
                />
              </Tooltip>
            </AnimatedCard>
          </Suspense>

          <Suspense fallback={<AccessibleLoadingSpinner />}>
            <AnimatedCard delay={400}>
              <Tooltip content="Performance geral do sistema">
                <KPICard
                  title="Performance"
                  value={realTimeKpis.performance.value}
                  change={realTimeKpis.performance.change}
                  trend={realTimeKpis.performance.trend}
                  icon={Target}
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                  format="percentage"
                />
              </Tooltip>
            </AnimatedCard>
          </Suspense>
        </section>

        {/* Critical Alerts - Mobile Optimized */}
        <AnimatedCard delay={500} className="mb-8 sm:mb-12">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100">
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-manrope">Alertas Críticos</h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Monitoramento em tempo real</p>
                  </div>
                </div>
                <StatusBadge status="warning">{criticalAlerts.length} Ativos</StatusBadge>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {criticalAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* System Overview with Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Growth Chart */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-manrope mb-1">Crescimento de Usuários</h3>
                    <p className="text-slate-600 text-sm">Evolução mensal dos usuários</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorUsers)"
                      animationDuration={1500}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="active" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorActive)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-manrope mb-1">Performance do Sistema</h3>
                    <p className="text-slate-600 text-sm">Monitoramento em tempo real</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cpu" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      animationDuration={1500}
                      name="CPU %"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="memory" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      animationDuration={1500}
                      name="Memória %"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="disk" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      animationDuration={1500}
                      name="Disco %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Column */}
          <div className="space-y-8">
            {/* System Status Pie Chart */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-manrope mb-1">Status do Sistema</h3>
                    <p className="text-slate-600 text-sm">Distribuição de uptime</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={systemStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {systemStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value) => [`${value}%`, 'Uptime']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Traffic Bar Chart */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-manrope mb-1">Tráfego Semanal</h3>
                    <p className="text-slate-600 text-sm">Requisições por dia</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value) => [value.toLocaleString(), 'Requisições']}
                    />
                    <Bar 
                      dataKey="requests" 
                      fill="url(#colorBar)"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    >
                      <defs>
                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1e40af" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-manrope mb-2">Informações do Sistema</h2>
                <p className="text-slate-600 font-medium">Detalhes técnicos e status operacional do Vynlo Taste</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Versão do Sistema</h3>
                <p className="text-3xl font-black text-slate-900 font-manrope mb-2">v2.1.0</p>
                <p className="text-sm text-slate-600">Última atualização: 04/01/2025</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Tempo Online</h3>
                <p className="text-3xl font-black text-slate-900 font-manrope mb-2">127d</p>
                <p className="text-sm text-slate-600">Sem interrupções</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Próxima Manutenção</h3>
                <p className="text-3xl font-black text-slate-900 font-manrope mb-2">15d</p>
                <p className="text-sm text-slate-600">Programada para 19/01/2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={`Ação: ${selectedAction}`}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">
              {selectedAction}
            </h4>
            <p className="text-slate-600 mb-6">
              Esta ação abrirá o painel de {selectedAction.toLowerCase()} do sistema.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Loader className="w-4 h-4 animate-spin" />
                Executar
              </button>
            </div>
          </div>
        </Modal>
        </main>
      </div>
      
      <style jsx global>{`
        /* Screen Reader Only Class */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .focus\:not-sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: 0.5rem 1rem;
          margin: 0;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
        
        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .bg-gradient-to-br {
            background: white !important;
          }
          .text-slate-600 {
            color: #1f2937 !important;
          }
          .border-slate-100 {
            border-color: #374151 !important;
          }
        }
        
        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse,
          .animate-spin,
          .animate-fade-in,
          .animate-slide-up {
            animation: none !important;
          }
          .transition-all,
          .transition-colors,
          .transition-transform {
            transition: none !important;
          }
        }
        
        /* Focus Visible Enhancement */
        .focus\:ring-2:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* Scrollbar Hide for Mobile */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}