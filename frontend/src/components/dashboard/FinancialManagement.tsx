'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  Bell,
  Clock,
  DollarSign,
  UserCheck
} from 'lucide-react'
import { useThemeContext } from '../../contexts/ThemeContext'

export default function FinancialManagement() {
  const { currentTheme } = useThemeContext()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [accountForm, setAccountForm] = useState({
    supplier: '',
    description: '',
    amount: '',
    dueDate: '',
    status: 'pending',
    category: '',
    notes: '',
    priority: 'medium'
  })
  const [showNotifications, setShowNotifications] = useState(false)

  // Estados para dados
  const [accountsPayable, setAccountsPayable] = useState<any[]>([])
  const [accountsReceivable, setAccountsReceivable] = useState<any[]>([])
  const [cashFlowData, setCashFlowData] = useState<any>(null)
  const [integrationStatus, setIntegrationStatus] = useState<'connected' | 'disconnected' | 'syncing'>('connected')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Filtros e paginação (Transações)
  const [txType, setTxType] = useState<'all' | 'INCOME' | 'EXPENSE'>('all')
  const [txCategory, setTxCategory] = useState<'all' | 'Vendas' | 'Serviços' | 'Ingredientes' | 'Salários' | 'Utilidades' | 'Marketing'>('all')
  const [txMin, setTxMin] = useState<string>('')
  const [txMax, setTxMax] = useState<string>('')
  const [txStartDate, setTxStartDate] = useState<string>('')
  const [txEndDate, setTxEndDate] = useState<string>('')

  // Ordenação e paginação (Contas)
  const [sortBy, setSortBy] = useState<'dueDate' | 'amount' | 'status' | 'priority'>('dueDate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // Métricas gerais
  const totalReceivableAmount = accountsReceivable.reduce((sum, r: any) => sum + (r.amount || 0), 0)
  const totalPayableAmount = accountsPayable.reduce((sum, p: any) => sum + (p.amount || 0), 0)
  const totalOverdueCount = accountsPayable.filter(a => a.status === 'overdue').length
  const totalPendingCount = accountsPayable.filter(a => a.status === 'pending').length
  const netCash = typeof cashFlowData?.netCashFlow === 'number' ? cashFlowData.netCashFlow : (totalReceivableAmount - totalPayableAmount)

  // Carregar dados integrados do Fluxo de Caixa
  useEffect(() => {
    loadIntegratedData()
  }, [])

  const loadIntegratedData = async () => {
    try {
      // Simular carregamento de dados integrados do Fluxo de Caixa
      setIntegrationStatus('syncing')
      
      // Simular dados do Fluxo de Caixa
      const integratedData = {
        accountsPayable: [
          {
            id: 1,
            supplier: 'Fornecedor ABC',
            description: 'Compra de ingredientes',
            amount: 2500.00,
            dueDate: '2024-01-15',
            status: 'pending',
            category: 'Ingredientes',
            priority: 'high',
            source: 'cashflow'
          },
          {
            id: 2,
            supplier: 'Energia Elétrica',
            description: 'Conta de luz - Janeiro',
            amount: 850.00,
            dueDate: '2024-01-20',
            status: 'overdue',
            category: 'Utilidades',
            priority: 'critical',
            source: 'cashflow'
          }
        ],
        accountsReceivable: [
          {
            id: 1,
            customer: 'Cliente Premium',
            description: 'Venda de produtos',
            amount: 1500.00,
            dueDate: '2024-01-25',
            status: 'pending',
            category: 'Vendas',
            priority: 'medium',
            source: 'cashflow'
          }
        ],
        cashFlowSummary: {
          totalPayable: 3350.00,
          totalReceivable: 1500.00,
          netCashFlow: -1850.00,
          pendingPayments: 2,
          pendingReceipts: 1
        }
      }
      
      setAccountsPayable(integratedData.accountsPayable)
      setAccountsReceivable(integratedData.accountsReceivable)
      setCashFlowData(integratedData.cashFlowSummary)
      setIntegrationStatus('connected')
      
    } catch (error) {
      console.error('Erro ao carregar dados integrados:', error)
      setIntegrationStatus('disconnected')
    }
  }

  // Sincronizar com Fluxo de Caixa
  const syncWithCashFlow = async () => {
    try {
      setIntegrationStatus('syncing')
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simular sincronização
      await loadIntegratedData()
      setSuccessMessage('Dados sincronizados com sucesso!')
    } catch (error) {
      setErrorMessage('Erro na sincronização')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Calendar className="w-4 h-4" />
      case 'overdue': return <AlertCircle className="w-4 h-4" />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago'
      case 'pending': return 'Pendente'
      case 'overdue': return 'Vencido'
      default: return status
    }
  }

  // Funções para gerenciar contas
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Cadastrando conta:', accountForm)
    setShowModal(false)
    setAccountForm({ supplier: '', description: '', amount: '', dueDate: '', status: 'pending', category: '', notes: '', priority: 'medium' })
  }

  const handleViewAccount = (account: any) => {
    setSelectedAccount(account)
    setShowViewModal(true)
  }

  const handleEditAccount = (account: any) => {
    setSelectedAccount(account)
    setAccountForm({
      supplier: account.supplier,
      description: account.description,
      amount: account.amount.toString(),
      dueDate: account.dueDate,
      status: account.status,
      category: account.category,
      notes: account.notes || '',
      priority: account.priority || 'medium'
    })
    setShowEditModal(true)
  }

  const handleDeleteAccount = (account: any) => {
    setSelectedAccount(account)
    setShowDeleteModal(true)
  }

  const confirmDeleteAccount = () => {
    console.log('Excluindo conta:', selectedAccount)
    // TODO: Implementar integração com backend
    setShowDeleteModal(false)
    setSelectedAccount(null)
  }

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Atualizando conta:', accountForm)
    // TODO: Implementar integração com backend
    setShowEditModal(false)
    setSelectedAccount(null)
    setAccountForm({ supplier: '', description: '', amount: '', dueDate: '', status: 'pending', category: '', notes: '', priority: 'medium' })
  }

  // Filtrar contas baseado nos filtros aplicados
  const filteredAccounts = accountsPayable.filter(account => {
    const matchesSearch = searchTerm === '' || 
      account.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || account.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Calcular estatísticas baseadas nos filtros
  const totalPending = filteredAccounts.filter(a => a.status === 'pending').reduce((acc, a) => acc + a.amount, 0)
  const totalOverdue = filteredAccounts.filter(a => a.status === 'overdue').reduce((acc, a) => acc + a.amount, 0)
  const totalPaid = filteredAccounts.filter(a => a.status === 'paid').reduce((acc, a) => acc + a.amount, 0)

  // Funções para alertas inteligentes
  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getPriorityLevel = (account: any) => {
    const daysUntilDue = getDaysUntilDue(account.dueDate)
    
    if (account.status === 'overdue') return 'critical'
    if (account.status === 'paid') return 'low'
    
    // Salários sempre têm prioridade crítica
    if (account.category === 'Salários') return 'critical'
    
    if (daysUntilDue <= 3) return 'critical'
    if (daysUntilDue <= 7) return 'high'
    if (daysUntilDue <= 15) return 'medium'
    return 'low'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertCircle className="w-4 h-4" />
      case 'high': return <Clock className="w-4 h-4" />
      case 'medium': return <Bell className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Crítico'
      case 'high': return 'Alto'
      case 'medium': return 'Médio'
      case 'low': return 'Baixo'
      default: return 'Normal'
    }
  }

  // Filtrar contas que precisam de atenção
  const criticalAccounts = accountsPayable.filter(account => {
    const priority = getPriorityLevel(account)
    return priority === 'critical' || priority === 'high'
  })

  const salaryAccounts = accountsPayable.filter(account => account.category === 'Salários')
  const overdueAccounts = accountsPayable.filter(account => account.status === 'overdue')

  // Dados de transações para demonstração
  const recentTransactions = [
    {
      id: 1,
      description: 'Venda de Produtos',
      category: 'Vendas',
      provider: 'Cliente Premium',
      amount: 1500.00,
      type: 'INCOME',
      date: '2024-01-15'
    },
    {
      id: 2,
      description: 'Compra de Ingredientes',
      category: 'Ingredientes',
      provider: 'Fornecedor ABC',
      amount: 2500.00,
      type: 'EXPENSE',
      date: '2024-01-14'
    },
    {
      id: 3,
      description: 'Pagamento de Energia',
      category: 'Utilidades',
      provider: 'Energia Elétrica',
      amount: 850.00,
      type: 'EXPENSE',
      date: '2024-01-13'
    },
    {
      id: 4,
      description: 'Serviço de Marketing',
      category: 'Marketing',
      provider: 'Agência Digital',
      amount: 1200.00,
      type: 'EXPENSE',
      date: '2024-01-12'
    }
  ]

  // Referência para o dropdown de notificações
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Transações filtradas e métricas
  const filteredTransactions = recentTransactions.filter((tx) => {
    const matchType = txType === 'all' || tx.type === txType
    const matchCategory = txCategory === 'all' || tx.category === txCategory

    const min = txMin !== '' ? Number(txMin) : null
    const max = txMax !== '' ? Number(txMax) : null
    const matchMin = min === null || tx.amount >= min
    const matchMax = max === null || tx.amount <= max

    const start = txStartDate ? new Date(txStartDate) : null
    const end = txEndDate ? new Date(txEndDate) : null
    const txDate = new Date(tx.date)
    const matchStart = !start || txDate >= start
    const matchEnd = !end || txDate <= end

    return matchType && matchCategory && matchMin && matchMax && matchStart && matchEnd
  })

  const txIncomeTotal = filteredTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)
  const txExpenseTotal = filteredTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)
  const txBalance = txIncomeTotal - txExpenseTotal
  const txCount = filteredTransactions.length

  // Ordenação de contas (aplica sobre as contas já filtradas pelos filtros existentes)
  const statusOrder: Record<string, number> = { overdue: 0, pending: 1, paid: 2 }
  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (sortBy === 'dueDate') {
      const ad = new Date(a.dueDate).getTime()
      const bd = new Date(b.dueDate).getTime()
      return sortDir === 'asc' ? ad - bd : bd - ad
    }
    if (sortBy === 'amount') {
      return sortDir === 'asc' ? a.amount - b.amount : b.amount - a.amount
    }
    if (sortBy === 'status') {
      const as = statusOrder[a.status] ?? 99
      const bs = statusOrder[b.status] ?? 99
      return sortDir === 'asc' ? as - bs : bs - as
    }
    if (sortBy === 'priority') {
      const ap = priorityOrder[getPriorityLevel(a)] ?? 99
      const bp = priorityOrder[getPriorityLevel(b)] ?? 99
      return sortDir === 'asc' ? ap - bp : bp - ap
    }
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Gestão Financeira</h1>
          <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope`}>Controle completo das suas finanças</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`px-4 py-2 border rounded-lg font-manrope focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              currentTheme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
          </select>
          
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-manrope font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Ir para Dashboard</span>
          </button>
        </div>
      </div>

      {/* Sistema de Abas */}
      <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border`}>
        {/* Navegação das Abas */}
        <div className={`flex border-b ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-manrope font-medium transition-colors duration-200 ${
              activeTab === 'overview'
                ? currentTheme === 'dark'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                  : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : currentTheme === 'dark'
                  ? 'text-gray-300 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Visão Geral
          </button>
          
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-4 font-manrope font-medium transition-colors duration-200 ${
              activeTab === 'transactions'
                ? currentTheme === 'dark'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                  : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : currentTheme === 'dark'
                  ? 'text-gray-300 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Transações
          </button>
          
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-6 py-4 font-manrope font-medium transition-colors duration-200 ${
              activeTab === 'accounts'
                ? currentTheme === 'dark'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                  : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : currentTheme === 'dark'
                  ? 'text-gray-300 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Contas
          </button>
          
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-4 font-manrope font-medium transition-colors duration-200 ${
              activeTab === 'reports'
                ? currentTheme === 'dark'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                  : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : currentTheme === 'dark'
                  ? 'text-gray-300 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Relatórios
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6">
          {/* Aba: Visão Geral */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm text-green-600 font-manrope">Receitas</span>
                  </div>
                  <div className={`text-2xl font-bold font-manrope ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    R$ {(totalReceivableAmount + txIncomeTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'} text-sm`}>Recebimentos previstos e realizados</p>
                </div>

                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="text-sm text-red-600 font-manrope">Despesas</span>
                  </div>
                  <div className={`text-2xl font-bold font-manrope ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    R$ {(totalPayableAmount + txExpenseTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'} text-sm`}>Pagamentos previstos e realizados</p>
                </div>

                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-blue-600 font-manrope">Saldo</span>
                  </div>
                  <div className={`text-2xl font-bold font-manrope ${netCash + txBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {(netCash + txBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'} text-sm`}>Receitas - Despesas</p>
                </div>

                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <span className="text-sm text-yellow-600 font-manrope">Pendências</span>
                  </div>
                  <div className={`text-2xl font-bold font-manrope ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {totalPendingCount} pendentes • {totalOverdueCount} vencidas
                  </div>
                  <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'} text-sm`}>Contas a pagar por status</p>
                </div>
              </div>

              {/* Despesas por Categoria (exemplo) */}
              <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Despesas por Categoria</h3>
                  <button className={`${currentTheme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { category: 'Ingredientes', amount: 8500, color: 'bg-blue-500' },
                    { category: 'Salários', amount: 5200, color: 'bg-green-500' },
                    { category: 'Utilidades', amount: 2800, color: 'bg-yellow-500' },
                    { category: 'Marketing', amount: 1200, color: 'bg-purple-500' },
                    { category: 'Outros', amount: 750, color: 'bg-gray-500' }
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${c.color}`} />
                        <span className={`${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} font-manrope`}>{c.category}</span>
                      </div>
                      <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>R$ {c.amount.toLocaleString('pt-BR')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline simples de fluxo (próximos 5 vencimentos/recebimentos) */}
              <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Próximos Eventos</h3>
                </div>
                <div className="space-y-3">
                  {[...accountsPayable.map(a => ({...a, kind: 'PAGAR'})), ...accountsReceivable.map(r => ({...r, kind: 'RECEBER'}))]
                    .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 5)
                    .map((item: any) => (
                      <div key={`${item.kind}-${item.id}`} className={`${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4 flex items-center justify-between`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.kind === 'RECEBER' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {item.kind === 'RECEBER' ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
                          </div>
                          <div>
                            <div className={`font-manrope font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {item.kind === 'RECEBER' ? (item.customer || 'Cliente') : item.supplier}
                            </div>
                            <div className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{item.description}</div>
                          </div>
                      </div>
                      <div className="text-right">
                          <div className={`font-bold ${item.kind === 'RECEBER' ? 'text-green-600' : 'text-red-600'}`}>R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                          <div className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{new Date(item.dueDate).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Aba: Transações */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Transações Financeiras</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setSearchTerm('')
                      setTxType('all')
                      setTxCategory('all')
                      setTxMin('')
                      setTxMax('')
                      setTxStartDate('')
                      setTxEndDate('')
                    }}
                    className={`px-4 py-2 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-500 text-gray-200 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Filter className="w-4 h-4 inline-block mr-2" />
                    Limpar Filtros
                  </button>
                  <button 
                    onClick={() => {
                      // Simular exportação
                      const csvContent = "data:text/csv;charset=utf-8," + 
                        "Descrição,Categoria,Fornecedor,Valor,Tipo,Data\n" +
                        filteredTransactions.map(t => 
                          `${t.description},${t.category},${t.provider},${t.amount},${t.type},${t.date}`
                        ).join("\n")
                      const encodedUri = encodeURI(csvContent)
                      const link = document.createElement("a")
                      link.setAttribute("href", encodedUri)
                      link.setAttribute("download", "transacoes_filtradas.csv")
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                    className={`px-4 py-2 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-500 text-gray-200 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Download className="w-4 h-4 inline-block mr-2" />
                    Exportar CSV
                </button>
                </div>
              </div>

              {/* KPIs rápidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${currentTheme === 'dark' ? 'border-gray-600' : 'border-gray-100'} rounded-xl p-5`}>
                  <div className="text-sm font-manrope text-gray-500 mb-1">Receitas</div>
                  <div className="text-2xl font-bold text-green-600">R$ {txIncomeTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${currentTheme === 'dark' ? 'border-gray-600' : 'border-gray-100'} rounded-xl p-5`}>
                  <div className="text-sm font-manrope text-gray-500 mb-1">Despesas</div>
                  <div className="text-2xl font-bold text-red-600">R$ {txExpenseTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${currentTheme === 'dark' ? 'border-gray-600' : 'border-gray-100'} rounded-xl p-5`}>
                  <div className="text-sm font-manrope text-gray-500 mb-1">Saldo</div>
                  <div className={`text-2xl font-bold ${txBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {txBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${currentTheme === 'dark' ? 'border-gray-600' : 'border-gray-100'} rounded-xl p-5`}>
                  <div className="text-sm font-manrope text-gray-500 mb-1">Transações</div>
                  <div className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{txCount}</div>
                </div>
                </div>
                
              {/* Filtros */}
              <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl p-6 border`}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className={`block text-sm font-manrope mb-2 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Tipo</label>
                    <select value={txType} onChange={(e) => setTxType(e.target.value as any)} className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}>
                      <option value="all">Todas</option>
                      <option value="INCOME">Receitas</option>
                      <option value="EXPENSE">Despesas</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-manrope mb-2 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Categoria</label>
                    <select value={txCategory} onChange={(e) => setTxCategory(e.target.value as any)} className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}>
                      <option value="all">Todas</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Serviços">Serviços</option>
                      <option value="Ingredientes">Ingredientes</option>
                      <option value="Salários">Salários</option>
                      <option value="Utilidades">Utilidades</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-manrope mb-2 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Valor Mínimo</label>
                    <input value={txMin} onChange={(e) => setTxMin(e.target.value)} type="number" className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-manrope mb-2 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Valor Máximo</label>
                    <input value={txMax} onChange={(e) => setTxMax(e.target.value)} type="number" className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-manrope mb-2 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Data Início</label>
                    <input value={txStartDate} onChange={(e) => setTxStartDate(e.target.value)} type="date" className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-manrope mb-2 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Data Fim</label>
                    <input value={txEndDate} onChange={(e) => setTxEndDate(e.target.value)} type="date" className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`} />
                  </div>
                  </div>
                <div className="flex items-center justify-between mt-6">
                  <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Resultados: <strong>{txCount}</strong></span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { 
                        setTxType('all'); 
                        setTxCategory('all'); 
                        setTxMin(''); 
                        setTxMax(''); 
                        setTxStartDate(''); 
                        setTxEndDate('') 
                      }} 
                      className={`px-4 py-2 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-500 text-gray-200 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    >
                      Limpar Filtros
                    </button>
                    <button 
                      onClick={() => {
                        // Simular exportação
                        const csvContent = "data:text/csv;charset=utf-8," + 
                          "Descrição,Categoria,Fornecedor,Valor,Tipo,Data\n" +
                          filteredTransactions.map(t => 
                            `${t.description},${t.category},${t.provider},${t.amount},${t.type},${t.date}`
                          ).join("\n")
                        const encodedUri = encodeURI(csvContent)
                        const link = document.createElement("a")
                        link.setAttribute("href", encodedUri)
                        link.setAttribute("download", "transacoes_filtradas.csv")
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}
                      className={`px-4 py-2 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-500 text-gray-200 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Download className="w-4 h-4 inline-block mr-2" />
                      Exportar CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de transações */}
              <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border`}>
                <div className="p-6 space-y-4">
                  {filteredTransactions.map((t) => (
                    <div key={t.id} className={`${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {t.type === 'INCOME' ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
                            </div>
                            <div>
                          <div className={`font-manrope font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.description}</div>
                          <div className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{t.category} • {t.provider}</div>
                            </div>
                          </div>
                          <div className="text-right">
                        <div className={`font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'INCOME' ? '+' : '-'}R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <div className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{new Date(t.date).toLocaleDateString('pt-BR')}</div>
                        </div>
                      </div>
                    ))}
                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-10 text-sm text-gray-500">Nenhuma transação encontrada.</div>
                  )}
                  </div>
              </div>

              {/* Paginação mock */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Página 1 de 1</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      // Simular navegação
                      console.log('Navegando para página anterior')
                    }}
                    className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100"
                  >
                    Anterior
                  </button>
                  <button 
                    onClick={() => {
                      // Simular navegação
                      console.log('Navegando para próxima página')
                    }}
                    className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Aba: Contas */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Gestão de Contas</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      // Simular exportação
                      const csvContent = "data:text/csv;charset=utf-8," + 
                        "Fornecedor,Descrição,Valor,Vencimento,Status,Categoria,Prioridade\n" +
                        sortedAccounts.map((a: any) => 
                          `${a.supplier},${a.description},${a.amount},${a.dueDate},${a.status},${a.category},${getPriorityLevel(a)}`
                        ).join("\n")
                      const encodedUri = encodeURI(csvContent)
                      const link = document.createElement("a")
                      link.setAttribute("href", encodedUri)
                      link.setAttribute("download", "contas.csv")
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                    className={`px-4 py-2 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-500 text-gray-200 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Download className="w-4 h-4 inline-block mr-2" />
                    Exportar CSV
                  </button>
            </div>
              </div>

              {/* Filtros */}
              <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl p-6 border`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-sm font-manrope mb-2 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Buscar</label>
                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Fornecedor, descrição, categoria" className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-300' : 'bg-white border-gray-300'}`} />
            </div>
                  <div>
                    <label className={`block text-sm font-manrope mb-2 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}>
                      <option value="all">Todos</option>
                      <option value="pending">Pendente</option>
                      <option value="paid">Pago</option>
                      <option value="overdue">Vencido</option>
                    </select>
        </div>
                  <div>
                    <label className={`block text-sm font-manrope mb-2 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Categoria</label>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}>
                      <option value="all">Todas</option>
                      <option value="Ingredientes">Ingredientes</option>
                      <option value="Utilidades">Utilidades</option>
                      <option value="Bebidas">Bebidas</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Salários">Salários</option>
                    </select>
      </div>
                  <div>
                    <label className={`block text-sm font-manrope mb-2 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Ordenar por</label>
                    <div className="flex gap-2">
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className={`flex-1 px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}>
                        <option value="dueDate">Vencimento</option>
                        <option value="amount">Valor</option>
                        <option value="status">Status</option>
                        <option value="priority">Prioridade</option>
                      </select>
                      <select value={sortDir} onChange={(e) => setSortDir(e.target.value as any)} className={`px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}>
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                      </select>
                </div>
                </div>
              </div>
                            </div>
                            
              {/* KPIs de contas */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="text-sm text-gray-500 mb-1">Total Pendente</div>
                  <div className="text-2xl font-bold text-yellow-600">R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                            </div>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="text-sm text-gray-500 mb-1">Total Vencido</div>
                  <div className="text-2xl font-bold text-red-600">R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                            </div>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="text-sm text-gray-500 mb-1">Total Pago</div>
                  <div className="text-2xl font-bold text-green-600">R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                          </div>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="text-sm text-gray-500 mb-1">Contas Críticas</div>
                  <div className="text-2xl font-bold text-red-600">{criticalAccounts.length}</div>
                    </div>
                  </div>

              {/* Tabela de Contas */}
              <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border overflow-x-auto`}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={`${currentTheme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-600'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fornecedor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Descrição</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Valor</th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Vencimento</th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Prioridade</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className={`${currentTheme === 'dark' ? 'bg-gray-700 divide-gray-600' : 'bg-white divide-gray-200'} divide-y`}>
                    {sortedAccounts.map((account: any) => {
                      const priority = getPriorityLevel(account)
                        return (
                        <tr key={account.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`font-manrope font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{account.supplier}</div>
                            <div className="text-sm text-gray-500">{account.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{account.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-bold">R$ {account.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">{new Date(account.dueDate).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                              {getStatusIcon(account.status)}
                              {getStatusText(account.status)}
                              </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
                              {getPriorityIcon(priority)}
                              {getPriorityText(priority)}
                              </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleViewAccount(account)} className={`px-3 py-1 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-500 text-gray-200' : 'border-gray-300 text-gray-700'}`}><Eye className="w-4 h-4 inline-block" /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {sortedAccounts.length === 0 && (
                      <tr>
                        <td className="px-6 py-10 text-center text-sm text-gray-500" colSpan={7}>Nenhuma conta encontrada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                            </div>
                            
              {/* Paginação mock */}
                            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Página 1 de 1</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      // Simular navegação
                      console.log('Navegando para página anterior')
                    }}
                    className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100"
                  >
                    Anterior
                  </button>
                  <button 
                    onClick={() => {
                      // Simular navegação
                      console.log('Navegando para próxima página')
                    }}
                    className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100"
                  >
                    Próxima
                  </button>
                            </div>
                    </div>
                  </div>
                )}

          {/* Aba: Relatórios */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Relatórios Financeiros</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // Implementar exportação PDF usando jsPDF
                      import('jspdf').then(({ default: jsPDF }) => {
                        const doc = new jsPDF()
                        
                        // Configurações do documento
                        doc.setFont('helvetica')
                        doc.setFontSize(20)
                        doc.setTextColor(59, 130, 246) // Azul
                        
                        // Título
                        doc.text('Relatório Financeiro - Vynlo Taste', 20, 30)
                        
                        // Linha separadora
                        doc.setDrawColor(59, 130, 246)
                        doc.setLineWidth(0.5)
                        doc.line(20, 40, 190, 40)
                        
                        // Data do relatório
                        doc.setFontSize(12)
                        doc.setTextColor(107, 114, 128) // Cinza
                        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 55)
                        
                        // Resumo Executivo
                        doc.setFontSize(16)
                        doc.setTextColor(17, 24, 39) // Preto
                        doc.text('Resumo Executivo', 20, 75)
                        
                        doc.setFontSize(10)
                        doc.setTextColor(107, 114, 128)
                        
                        // Métricas principais
                        const metrics = [
                          ['Receita Total', `R$ ${(totalReceivableAmount + txIncomeTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
                          ['Despesa Total', `R$ ${(totalPayableAmount + txExpenseTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
                          ['Lucro Líquido', `R$ ${(txBalance + netCash).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
                          ['Margem de Lucro', `${txIncomeTotal > 0 ? Math.round(((txBalance + netCash) / Math.max(1, txIncomeTotal)) * 100) : 0}%`]
                        ]
                        
                        let yPos = 90
                        metrics.forEach(([label, value]) => {
                          doc.setTextColor(17, 24, 39)
                          doc.text(label, 20, yPos)
                          doc.setTextColor(59, 130, 246)
                          doc.text(value, 120, yPos)
                          yPos += 8
                        })
                        
                        // KPIs de Performance
                        yPos += 10
                        doc.setFontSize(16)
                        doc.setTextColor(17, 24, 39)
                        doc.text('KPIs de Performance', 20, yPos)
                        
                        yPos += 15
                        doc.setFontSize(10)
                        doc.setTextColor(107, 114, 128)
                        
                        const kpis = [
                          ['ROI', '18%'],
                          ['Ponto de Equilíbrio', 'R$ 42.000,00'],
                          ['Custo por Aquisição', 'R$ 32,00']
                        ]
                        
                        kpis.forEach(([label, value]) => {
                          doc.setTextColor(17, 24, 39)
                          doc.text(label, 20, yPos)
                          doc.setTextColor(59, 130, 246)
                          doc.text(value, 120, yPos)
                          yPos += 8
                        })
                        
                        // Análise de Contas
                        yPos += 10
                        doc.setFontSize(16)
                        doc.setTextColor(17, 24, 39)
                        doc.text('Análise de Contas', 20, yPos)
                        
                        yPos += 15
                        doc.setFontSize(10)
                        doc.setTextColor(107, 114, 128)
                        
                        const accountAnalysis = [
                          ['Total Pendente', `R$ ${totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
                          ['Total Vencido', `R$ ${totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
                          ['Total Pago', `R$ ${totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
                          ['Contas Críticas', `${criticalAccounts.length}`]
                        ]
                        
                        accountAnalysis.forEach(([label, value]) => {
                          doc.setTextColor(17, 24, 39)
                          doc.text(label, 20, yPos)
                          doc.setTextColor(59, 130, 246)
                          doc.text(value, 120, yPos)
                          yPos += 8
                        })
                        
                        // Recomendações
                        yPos += 10
                        doc.setFontSize(16)
                        doc.setTextColor(17, 24, 39)
                        doc.text('Recomendações', 20, yPos)
                        
                        yPos += 15
                        doc.setFontSize(10)
                        doc.setTextColor(107, 114, 128)
                        
                        const recommendations = [
                          '• Reduzir despesas em categorias com maior impacto (Ingredientes, Salários)',
                          '• Antecipar recebíveis com alto valor para melhorar caixa',
                          '• Renegociar contas vencidas críticas',
                          '• Implementar controle rigoroso de gastos operacionais'
                        ]
                        
                        recommendations.forEach((rec) => {
                          doc.text(rec, 20, yPos)
                          yPos += 8
                        })
                        
                        // Rodapé
                        doc.setFontSize(8)
                        doc.setTextColor(156, 163, 175)
                        doc.text('Vynlo Taste - Sistema de Gestão Financeira', 20, 280)
                        
                        // Salvar o PDF
                        doc.save('relatorio_financeiro_vynlo_taste.pdf')
                      }).catch(error => {
                        console.error('Erro ao carregar jsPDF:', error)
                        alert('Erro ao gerar PDF. Verifique se a biblioteca jsPDF está instalada.')
                      })
                    }}
                    className={`px-4 py-2 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-500 text-gray-200 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Download className="w-4 h-4 inline-block mr-2" />
                    Exportar PDF
                  </button>
                  <button 
                    onClick={() => {
                      // Simular exportação Excel
                      const csvContent = "data:text/csv;charset=utf-8," + 
                        "Métrica,Valor\n" +
                        `Receita Total,R$ ${(totalReceivableAmount + txIncomeTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
                        `Despesa Total,R$ ${(totalPayableAmount + txExpenseTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
                        `Lucro Líquido,R$ ${(txBalance + netCash).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
                        `Margem de Lucro,${txIncomeTotal > 0 ? Math.round(((txBalance + netCash) / Math.max(1, txIncomeTotal)) * 100) : 0}%\n` +
                        `ROI,18%\n` +
                        `Ponto de Equilíbrio,R$ 42.000,00\n` +
                        `Custo por Aquisição,R$ 32,00`
                      const encodedUri = encodeURI(csvContent)
                      const link = document.createElement("a")
                      link.setAttribute("href", encodedUri)
                      link.setAttribute("download", "relatorio_financeiro.csv")
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                    className={`px-4 py-2 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-500 text-gray-200 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Download className="w-4 h-4 inline-block mr-2" />
                    Exportar Excel
                  </button>
                </div>
              </div>

              {/* Resumo Executivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="text-sm text-gray-500 mb-1">Receita Total</div>
                  <div className="text-2xl font-bold text-green-600">R$ {(totalReceivableAmount + txIncomeTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="text-sm text-gray-500 mb-1">Despesa Total</div>
                  <div className="text-2xl font-bold text-red-600">R$ {(totalPayableAmount + txExpenseTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="text-sm text-gray-500 mb-1">Lucro Líquido</div>
                  <div className={`text-2xl font-bold ${txBalance + netCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {(txBalance + netCash).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="text-sm text-gray-500 mb-1">Margem de Lucro</div>
                  <div className={`text-2xl font-bold ${txIncomeTotal > 0 ? 'text-blue-600' : 'text-gray-500'}`}>{txIncomeTotal > 0 ? `${Math.round(((txBalance + netCash) / Math.max(1, txIncomeTotal)) * 100)}%` : '--'}</div>
                </div>
              </div>

              {/* Tendências (mock simples) */}
              <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                <h3 className={`text-lg font-manrope font-bold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tendências (Últimos 6 meses)</h3>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'} rounded-xl p-10 text-center text-gray-500`}>
                  Gráfico de linha (mock) - configure futuramente com Chart.js
                </div>
              </div>

              {/* KPIs de Performance (mock) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="text-sm text-gray-500 mb-1">ROI</div>
                  <div className="text-2xl font-bold text-blue-600">18%</div>
                </div>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="text-sm text-gray-500 mb-1">Ponto de Equilíbrio</div>
                  <div className="text-2xl font-bold text-purple-600">R$ 42.000,00</div>
                </div>
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                  <div className="text-sm text-gray-500 mb-1">Custo por Aquisição</div>
                  <div className="text-2xl font-bold text-orange-600">R$ 32,00</div>
              </div>
            </div>
            
              {/* Recomendações simples */}
              <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
                <h3 className={`text-lg font-manrope font-bold mb-3 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recomendações</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Reduzir despesas em categorias com maior impacto (Ingredientes, Salários).</li>
                  <li>Antecipar recebíveis com alto valor para melhorar caixa.</li>
                  <li>Renegociar contas vencidas críticas.</li>
                </ul>
                  </div>
                </div>
          )}
                  </div>
                </div>
                
      {/* Modal: Visualizar Conta */}
      {showViewModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-2xl p-6 max-w-md w-full mx-4 border`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Detalhes da Conta</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
                <div>
                <label className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fornecedor</label>
                <p className={`${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedAccount.supplier}</p>
                  </div>
              <div>
                <label className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Descrição</label>
                <p className={`${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedAccount.description}</p>
                </div>
                <div>
                <label className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Valor</label>
                <p className={`${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>R$ {selectedAccount.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
              <div>
                <label className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Vencimento</label>
                <p className={`${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{new Date(selectedAccount.dueDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                <label className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAccount.status)}`}>
                      {getStatusIcon(selectedAccount.status)}
                  {getStatusText(selectedAccount.status)}
                    </span>
                  </div>
              <div>
                <label className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Categoria</label>
                <p className={`${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedAccount.category}</p>
                </div>
              {selectedAccount.notes && (
                <div>
                  <label className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Observações</label>
                  <p className={`${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedAccount.notes}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Fechar
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Conta */}
      {showEditModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-2xl p-6 max-w-md w-full mx-4 border`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Editar Conta</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
                </button>
              </div>
            <form onSubmit={handleUpdateAccount} className="space-y-4">
                <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fornecedor</label>
                  <input
                    type="text"
                    value={accountForm.supplier}
                    onChange={(e) => setAccountForm({...accountForm, supplier: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  required
                  />
                </div>
                <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Descrição</label>
                <input 
                  type="text" 
                  value={accountForm.description} 
                  onChange={(e) => setAccountForm({...accountForm, description: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    required
                />
                </div>
                <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={accountForm.amount}
                    onChange={(e) => setAccountForm({...accountForm, amount: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  required
                  />
                </div>
                <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Vencimento</label>
                  <input
                    type="date"
                    value={accountForm.dueDate}
                    onChange={(e) => setAccountForm({...accountForm, dueDate: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  required
                  />
                </div>
                <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <select
                    value={accountForm.status}
                    onChange={(e) => setAccountForm({...accountForm, status: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="pending">Pendente</option>
                    <option value="paid">Pago</option>
                    <option value="overdue">Vencido</option>
                  </select>
                </div>
                <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Categoria</label>
                  <select
                  value={accountForm.category} 
                  onChange={(e) => setAccountForm({...accountForm, category: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Ingredientes">Ingredientes</option>
                  <option value="Utilidades">Utilidades</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Salários">Salários</option>
                  </select>
                </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Observações</label>
                <textarea
                  value={accountForm.notes}
                  onChange={(e) => setAccountForm({...accountForm, notes: e.target.value})}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Prioridade</label>
                <select 
                  value={accountForm.priority} 
                  onChange={(e) => setAccountForm({...accountForm, priority: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Atualizar
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Deletar Conta */}
      {showDeleteModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-2xl p-6 max-w-md w-full mx-4 border`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Confirmar Exclusão</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              </div>
            <div className="mb-6">
              <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Tem certeza que deseja excluir a conta de <strong>{selectedAccount.supplier}</strong> no valor de <strong>R$ {selectedAccount.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>?
              </p>
              <p className={`${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm mt-2`}>
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            <div className="flex gap-2">
              <button 
                onClick={confirmDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Excluir
              </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nova Conta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-2xl p-6 max-w-md w-full mx-4 border`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Nova Conta</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fornecedor</label>
                <input 
                  type="text" 
                  value={accountForm.supplier} 
                  onChange={(e) => setAccountForm({...accountForm, supplier: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Descrição</label>
                <input 
                  type="text" 
                  value={accountForm.description} 
                  onChange={(e) => setAccountForm({...accountForm, description: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Valor</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={accountForm.amount} 
                  onChange={(e) => setAccountForm({...accountForm, amount: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Vencimento</label>
                <input 
                  type="date" 
                  value={accountForm.dueDate} 
                  onChange={(e) => setAccountForm({...accountForm, dueDate: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Categoria</label>
                <select 
                  value={accountForm.category} 
                  onChange={(e) => setAccountForm({...accountForm, category: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Ingredientes">Ingredientes</option>
                  <option value="Utilidades">Utilidades</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Salários">Salários</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Observações</label>
                <textarea 
                  value={accountForm.notes} 
                  onChange={(e) => setAccountForm({...accountForm, notes: e.target.value})}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Prioridade</label>
                <select 
                  value={accountForm.priority} 
                  onChange={(e) => setAccountForm({...accountForm, priority: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Cadastrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
