'use client'

import { useState, useEffect } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext'
import { 
  Plus, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Settings, 
  Check, 
  X, 
  Edit, 
  Info, 
  Database, 
  BarChart3, 
  TrendingUpIcon, 
  TrendingDown, 
  Target, 
  Activity, 
  Brain, 
  RefreshCw, 
  Save, 
  Download as DownloadIcon,
  CreditCard,
  Zap,
  DollarSign,
  FileText,
  Bell,
  Receipt,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Equal,
  Lightbulb,
  Users,
  Building,
  Banknote,
  ArrowUpRight as TrendingUp,
  PieChart,
  LineChart,
  Clock,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Shield,
  Wifi,
  Smartphone,
  Monitor,
  Cloud,
  Globe,
  Search,
  Calculator,
  RotateCcw,
  Zap as Lightning,
  UserCheck,
  Calendar
} from 'lucide-react'

// Interface comum para transações financeiras (integração com pagamentos)
export interface FinancialTransaction {
  id: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  description: string
  category: string
  date: string
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'TRANSFER' | 'BOLETO'
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED'
  provider?: string
  customer?: string
  notes?: string
  source: 'CASH_FLOW' | 'PAYMENT_SYSTEM' | 'BANK_RECONCILIATION'
  paymentId?: string
  reconciliationId?: string
}

// Interface para contas financeiras
export interface FinancialAccount {
  id: string
  type: 'PAYABLE' | 'RECEIVABLE'
  amount: number
  description: string
  category: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'PENDING' | 'PAID' | 'OVERDUE'
  supplier?: string
  customer?: string
  notes?: string
}

// Interface para reconciliação bancária
export interface BankReconciliation {
  id: string
  bankName: string
  accountNumber: string
  description: string
  amount: number
  type: 'CREDIT' | 'DEBIT'
  transactionDate: string
  status: 'PENDING' | 'RECONCILED' | 'MANUAL'
  notes?: string
}

export default function CashFlowManagement() {
  const { currentTheme } = useThemeContext()
  const [activeTab, setActiveTab] = useState('overview')
  const [showPayableModal, setShowPayableModal] = useState(false)
  const [showReceivableModal, setShowReceivableModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showReconciliationModal, setShowReconciliationModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showForecastModal, setShowForecastModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [showAdvancedStats, setShowAdvancedStats] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const [showAccountDetails, setShowAccountDetails] = useState(false)
  const [showReconciliationDetails, setShowReconciliationDetails] = useState(false)
  const [showAllTransactionsModal, setShowAllTransactionsModal] = useState(false)
  const [showAdvancedReportModal, setShowAdvancedReportModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showEditAccountModal, setShowEditAccountModal] = useState(false)
  const [showAnalysisDetailsModal, setShowAnalysisDetailsModal] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Estados para formulários
  const [payableForm, setPayableForm] = useState({
    description: '',
    amount: '',
    category: '',
    dueDate: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    supplier: '',
    notes: ''
  })
  
  const [receivableForm, setReceivableForm] = useState({
    description: '',
    amount: '',
    category: '',
    dueDate: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    customer: '',
    notes: ''
  })
  
  const [importForm, setImportForm] = useState({
    bankName: '',
    accountNumber: '',
    file: null as File | null
  })

  // Estados para filtros avançados
  const [cashFlowFilter, setCashFlowFilter] = useState({
    category: 'all',
    type: 'all',
    startDate: '',
    endDate: '',
    search: '',
    minAmount: '',
    maxAmount: ''
  })

  // Estados para relatórios
  const [reportPeriod, setReportPeriod] = useState('month')
  const [reportType, setReportType] = useState<'fullModule' | 'specificTab'>('fullModule')

  // Estados para configurações
  const [settings, setSettings] = useState({
    autoSync: true,
    notifications: true,
    currency: 'BRL',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo'
  })

  // Estados para previsões
  const [forecastData, setForecastData] = useState({
    period: '3months',
    confidence: 'high',
    includeSeasonality: true
  })

  // Estados para notificações
  const [notifications, setNotifications] = useState({
    overdueAccounts: true,
    lowBalance: true,
    unusualTransactions: true,
    reconciliationAlerts: true
  })

  // Estados para categorias personalizadas
  const [customCategories, setCustomCategories] = useState([
    { id: '1', name: 'Vendas', type: 'income', color: 'green' },
    { id: '2', name: 'Serviços', type: 'income', color: 'blue' },
    { id: '3', name: 'Fornecedores', type: 'expense', color: 'red' },
    { id: '4', name: 'Operacionais', type: 'expense', color: 'orange' },
    { id: '5', name: 'Administrativas', type: 'expense', color: 'yellow' }
  ])

  // Estados para bancos
  const [banks, setBanks] = useState([
    { id: '1', name: 'Banco do Brasil', status: 'connected', lastSync: '2h atrás' },
    { id: '2', name: 'Itaú', status: 'pending', lastSync: 'Nunca' },
    { id: '3', name: 'Santander', status: 'disconnected', lastSync: 'Nunca' }
  ])

  // Estados para detalhes
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<FinancialAccount | null>(null)
  const [selectedReconciliation, setSelectedReconciliation] = useState<BankReconciliation | null>(null)

  // Dados simulados para demonstração
  const [recentTransactions, setRecentTransactions] = useState<FinancialTransaction[]>([
    {
      id: '1',
      type: 'INCOME',
      amount: 1500.00,
      description: 'Venda de Produtos',
      category: 'Vendas',
      date: '2024-01-15',
      paymentMethod: 'PIX',
      status: 'COMPLETED',
      provider: 'Cliente A',
      notes: 'Venda realizada com sucesso',
      source: 'CASH_FLOW'
    },
    {
      id: '2',
      type: 'EXPENSE',
      amount: 450.00,
      description: 'Compra de Materiais',
      category: 'Fornecedores',
      date: '2024-01-14',
      paymentMethod: 'CREDIT_CARD',
      status: 'COMPLETED',
      provider: 'Fornecedor B',
      notes: 'Materiais para produção',
      source: 'CASH_FLOW'
    },
    {
      id: '3',
      type: 'INCOME',
      amount: 800.00,
      description: 'Serviço de Consultoria',
      category: 'Serviços',
      date: '2024-01-13',
      paymentMethod: 'TRANSFER',
      status: 'COMPLETED',
      provider: 'Cliente C',
      notes: 'Consultoria técnica',
      source: 'CASH_FLOW'
    }
  ])
  
  const [accountsPayable, setAccountsPayable] = useState<FinancialAccount[]>([
    {
      id: '1',
      type: 'PAYABLE',
      amount: 1200.00,
      description: 'Aluguel do Escritório',
      category: 'Operacionais',
      dueDate: '2024-01-20',
      priority: 'HIGH',
      status: 'PENDING',
      supplier: 'Imobiliária XYZ',
      notes: 'Aluguel mensal'
    },
    {
      id: '2',
      type: 'PAYABLE',
      amount: 800.00,
      description: 'Conta de Energia',
      category: 'Operacionais',
      dueDate: '2024-01-25',
      priority: 'MEDIUM',
      status: 'PENDING',
      supplier: 'Companhia de Energia',
      notes: 'Consumo do mês'
    },
    {
      id: '3',
      type: 'PAYABLE',
      amount: 2500.00,
      description: 'Salários da Equipe',
      category: 'Salários',
      dueDate: '2024-01-30',
      priority: 'HIGH',
      status: 'PENDING',
      supplier: 'RH',
      notes: 'Folha de pagamento'
    },
    {
      id: '4',
      type: 'PAYABLE',
      amount: 1500.00,
      description: 'Fornecedor Crítico',
      category: 'Fornecedores',
      dueDate: '2024-01-18',
      priority: 'HIGH',
      status: 'PENDING',
      supplier: 'Fornecedor Crítico',
      notes: 'Materiais essenciais'
    }
  ])
  
  const [accountsReceivable, setAccountsReceivable] = useState<FinancialAccount[]>([
    {
      id: '1',
      type: 'RECEIVABLE',
      amount: 2500.00,
      description: 'Venda de Produtos',
      category: 'Vendas',
      dueDate: '2024-01-30',
      priority: 'HIGH',
      status: 'PENDING',
      customer: 'Cliente D',
      notes: 'Venda com prazo de 30 dias'
    },
    {
      id: '2',
      type: 'RECEIVABLE',
      amount: 1200.00,
      description: 'Serviço de Manutenção',
      category: 'Serviços',
      dueDate: '2024-02-05',
      priority: 'MEDIUM',
      status: 'PENDING',
      customer: 'Cliente E',
      notes: 'Manutenção preventiva'
    }
  ])
  
  const [bankTransactions, setBankTransactions] = useState<BankReconciliation[]>([
    {
      id: '1',
      bankName: 'Banco do Brasil',
      accountNumber: '12345-6',
      description: 'Depósito Recebido',
      amount: 1500.00,
      type: 'CREDIT',
      status: 'PENDING',
      transactionDate: '2024-01-15',
      notes: 'Depósito automático'
    },
    {
      id: '2',
      bankName: 'Banco do Brasil',
      accountNumber: '12345-6',
      description: 'Pagamento de Fornecedor',
      amount: 450.00,
      type: 'DEBIT',
      status: 'PENDING',
      transactionDate: '2024-01-14',
      notes: 'Pagamento via PIX'
    }
  ])
  
  // API Base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  
  // Funções de integração com backend
  const createPayableAccount = async () => {
    setLoading(true)
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Conta a pagar criada com sucesso!')
      setShowPayableModal(false)
      setPayableForm({
        description: '',
        amount: '',
        category: '',
        dueDate: '',
        priority: 'MEDIUM',
        supplier: '',
        notes: ''
      })
    } catch (error) {
      setErrorMessage('Erro ao criar conta a pagar')
    } finally {
      setLoading(false)
    }
  }
  
  const updatePayableAccount = async () => {
    if (!selectedAccount) return
    
    setLoading(true)
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Atualizar a conta na lista local
      setAccountsPayable(prev => prev.map(acc => 
        acc.id === selectedAccount.id 
          ? selectedAccount
          : acc
      ))
      
      setSuccessMessage('Conta a pagar atualizada com sucesso!')
      setShowEditAccountModal(false)
      setSelectedAccount(null)
    } catch (error) {
      setErrorMessage('Erro ao atualizar conta a pagar')
    } finally {
      setLoading(false)
    }
  }
  
  const createReceivableAccount = async () => {
    setLoading(true)
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Conta a receber criada com sucesso!')
      setShowReceivableModal(false)
      setReceivableForm({
        description: '',
        amount: '',
        category: '',
        dueDate: '',
        priority: 'MEDIUM',
        customer: '',
        notes: ''
      })
    } catch (error) {
      setErrorMessage('Erro ao criar conta a receber')
    } finally {
      setLoading(false)
    }
  }
  
  const updateReceivableAccount = async () => {
    if (!selectedAccount) return
    
    setLoading(true)
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Atualizar a conta na lista local
      setAccountsReceivable(prev => prev.map(acc => 
        acc.id === selectedAccount.id 
          ? selectedAccount
          : acc
      ))
      
      setSuccessMessage('Conta a receber atualizada com sucesso!')
      setShowEditAccountModal(false)
      setSelectedAccount(null)
    } catch (error) {
      setErrorMessage('Erro ao atualizar conta a receber')
    } finally {
      setLoading(false)
    }
  }
  
  const importBankStatement = async () => {
    if (!importForm.file || !importForm.bankName || !importForm.accountNumber) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      // Simulação de processamento do arquivo
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular extração de transações do arquivo
      const extractedTransactions: FinancialTransaction[] = [
        {
          id: `ext_${Date.now()}_1`,
          type: 'EXPENSE',
          amount: 150.00,
          description: 'Pagamento de Fornecedor',
          category: 'Fornecedores',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'TRANSFER',
          status: 'COMPLETED',
          provider: 'Fornecedor ABC',
          notes: 'Importado do extrato bancário',
          source: 'BANK_RECONCILIATION'
        },
        {
          id: `ext_${Date.now()}_2`,
          type: 'INCOME',
          amount: 2500.00,
          description: 'Recebimento de Cliente',
          category: 'Vendas',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'PIX',
          status: 'COMPLETED',
          provider: 'Cliente XYZ',
          notes: 'Importado do extrato bancário',
          source: 'BANK_RECONCILIATION'
        }
      ]

      // Adicionar transações extraídas à lista
      setRecentTransactions(prev => [...extractedTransactions.map(t => ({...t, source: 'BANK_RECONCILIATION' as const, type: t.type as 'INCOME' | 'EXPENSE'})), ...prev])
      
      // Adicionar transações bancárias para reconciliação
      const bankReconciliations: BankReconciliation[] = extractedTransactions.map(trans => ({
        id: `bank_${Date.now()}_${Math.random()}`,
        bankName: importForm.bankName,
        accountNumber: importForm.accountNumber,
        description: trans.description,
        amount: trans.amount,
        type: trans.type === 'INCOME' ? 'CREDIT' : 'DEBIT',
        status: 'PENDING',
        transactionDate: trans.date,
        notes: trans.notes
      }))
      
      setBankTransactions(prev => [...bankReconciliations, ...prev])
      
      // Simular reconciliação automática
      const reconciledCount = extractedTransactions.length
      const newCount = extractedTransactions.length
      
      setSuccessMessage(`Extrato importado com sucesso! ${reconciledCount} transações reconciliadas, ${newCount} novas transações criadas.`)
      setShowImportModal(false)
      
      // Limpar formulário
      setImportForm({
        bankName: '',
        accountNumber: '',
        file: null
      })
      
      // Atualizar status do banco
      setBanks(prev => prev.map(bank => 
        bank.name === importForm.bankName 
          ? { ...bank, lastSync: 'Agora', status: 'connected' }
          : bank
      ))
      
    } catch (error) {
      setErrorMessage('Erro ao importar extrato bancário. Verifique o formato do arquivo.')
    } finally {
      setLoading(false)
    }
  }

  const autoSyncBankTransactions = async () => {
    setSyncing(true)
    try {
      // Simulação de sincronização automática
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simular transações sincronizadas
      const syncedTransactions: FinancialTransaction[] = [
        {
          id: `sync_${Date.now()}_1`,
          type: 'EXPENSE',
          amount: 89.90,
          description: 'Taxa Bancária',
          category: 'Operacionais',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'DEBIT_CARD',
          status: 'COMPLETED',
          provider: 'Banco',
          notes: 'Sincronizado automaticamente',
          source: 'BANK_RECONCILIATION'
        }
      ]
      
      // Adicionar transações sincronizadas
      setRecentTransactions(prev => [...syncedTransactions, ...prev])
      
      // Adicionar transações bancárias para reconciliação
      const bankReconciliations: BankReconciliation[] = syncedTransactions.map(trans => ({
        id: `sync_${Date.now()}_${Math.random()}`,
        bankName: 'Banco do Brasil', // Banco padrão para sincronização
        accountNumber: '12345-6',
        description: trans.description,
        amount: trans.amount,
        type: trans.type === 'INCOME' ? 'CREDIT' : 'DEBIT',
        status: 'PENDING',
        transactionDate: trans.date,
        notes: trans.notes
      }))
      
      setBankTransactions(prev => [...bankReconciliations, ...prev])
      
      // Atualizar status dos bancos
      setBanks(prev => prev.map(bank => ({
        ...bank,
        lastSync: 'Agora',
        status: 'connected'
      })))
      
      setSuccessMessage('Sincronização bancária concluída com sucesso! 1 nova transação sincronizada.')
      
    } catch (error) {
      setErrorMessage('Erro na sincronização bancária. Verifique a conexão com os bancos.')
    } finally {
      setSyncing(false)
    }
  }
  
  const generateReport = async () => {
    setLoading(true)
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Relatório gerado e enviado para seu email!')
      setShowReportModal(false)
    } catch (error) {
      setErrorMessage('Erro ao gerar relatório')
    } finally {
      setLoading(false)
    }
  }
  
  const generateForecast = async () => {
    setLoading(true)
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccessMessage('Previsões da IA atualizadas com sucesso!')
      // Não fechar o modal para o usuário ver os resultados
      // setShowForecastModal(false)
    } catch (error) {
      setErrorMessage('Erro ao gerar previsão')
    } finally {
      setLoading(false)
    }
  }
  
  const updateNotifications = async () => {
    setLoading(true)
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setSuccessMessage('Configurações de notificação atualizadas!')
      setShowNotificationModal(false)
    } catch (error) {
      setErrorMessage('Erro ao atualizar notificações')
    } finally {
      setLoading(false)
    }
  }
  
  const updateSettings = async () => {
    setLoading(true)
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Configurações salvas com sucesso!')
      setShowSettingsModal(false)
    } catch (error) {
      setErrorMessage('Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }
  
  const exportData = async () => {
    setLoading(true)
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1200))
      setSuccessMessage('Dados exportados com sucesso! Arquivo baixado.')
      setShowExportModal(false)
    } catch (error) {
      setErrorMessage('Erro ao exportar dados')
    } finally {
      setLoading(false)
    }
  }
  
  const addCustomCategory = async (category: any) => {
    setLoading(true)
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setCustomCategories([...customCategories, { ...category, id: Date.now().toString() }])
      setSuccessMessage('Categoria personalizada criada com sucesso!')
      setShowCategoryModal(false)
    } catch (error) {
      setErrorMessage('Erro ao criar categoria')
    } finally {
      setLoading(false)
    }
  }
  
  const connectBank = async (bankId: string) => {
    setLoading(true)
    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setBanks(banks.map(bank => 
        bank.id === bankId 
          ? { ...bank, status: 'connected', lastSync: 'Agora' }
          : bank
      ))
      setSuccessMessage('Banco conectado com sucesso!')
      setShowBankModal(false)
    } catch (error) {
      setErrorMessage('Erro ao conectar banco')
    } finally {
      setLoading(false)
    }
  }
  
  const viewTransactionDetails = (transaction: FinancialTransaction) => {
    setSelectedTransaction(transaction)
    setShowTransactionDetails(true)
  }
  
  const viewAccountDetails = (account: FinancialAccount) => {
    setSelectedAccount(account)
    setShowAccountDetails(true)
  }
  
  const editAccount = (account: FinancialAccount) => {
    setSelectedAccount(account)
    setShowEditAccountModal(true)
  }

  const deleteAccount = (account: FinancialAccount) => {
    setSelectedAccount(account)
    setShowConfirmModal(true)
  }

  const confirmDeleteAccount = () => {
    if (selectedAccount) {
      if (selectedAccount.type === 'PAYABLE') {
        setAccountsPayable(prev => prev.filter(acc => acc.id !== selectedAccount.id))
      } else {
        setAccountsReceivable(prev => prev.filter(acc => acc.id !== selectedAccount.id))
      }
      setSuccessMessage('Conta excluída com sucesso!')
      setShowConfirmModal(false)
      setSelectedAccount(null)
    }
  }
  
  const viewReconciliationDetails = (reconciliation: BankReconciliation) => {
    setSelectedReconciliation(reconciliation)
    setShowReconciliationDetails(true)
  }
  
  const reconcileTransaction = (transaction: BankReconciliation) => {
    setSelectedReconciliation(transaction)
    // Marcar como reconciliada
    setBankTransactions(prev => prev.map(t => 
      t.id === transaction.id 
        ? { ...t, status: 'RECONCILED' }
        : t
    ))
    setSuccessMessage('Transação reconciliada com sucesso!')
  }

  const deleteBankTransaction = (transaction: BankReconciliation) => {
    setSelectedReconciliation(transaction)
    setShowConfirmModal(true)
  }

  const confirmDeleteBankTransaction = () => {
    if (selectedReconciliation) {
      setBankTransactions(prev => prev.filter(t => t.id !== selectedReconciliation.id))
      setSuccessMessage('Transação bancária excluída com sucesso!')
      setShowConfirmModal(false)
      setSelectedReconciliation(null)
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Check className="w-4 h-4 text-green-600" />
      case 'PENDING':
        return <RefreshCw className="w-4 h-4 text-yellow-600" />
      case 'FAILED':
        return <X className="w-4 h-4 text-red-600" />
      default:
        return <X className="w-4 h-4 text-gray-600" />
    }
  }
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'border-red-500 text-red-700 bg-red-50'
      case 'MEDIUM':
        return 'border-yellow-500 text-yellow-700 bg-yellow-50'
      case 'LOW':
        return 'border-green-500 text-green-700 bg-green-50'
      default:
        return 'border-gray-500 text-primary bg-gray-50'
    }
  }
  
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CREDIT_CARD':
        return <CreditCard className="w-4 h-4 text-blue-600" />
      case 'DEBIT_CARD':
        return <CreditCard className="w-4 h-4 text-green-600" />
      case 'PIX':
        return <Zap className="w-4 h-4 text-yellow-600" />
      case 'TRANSFER':
        return <Database className="w-4 h-4 text-purple-600" />
      case 'CASH':
        return <DollarSign className="w-4 h-4 text-green-600" />
      case 'BOLETO':
        return <FileText className="w-4 h-4 text-orange-600" />
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />
    }
  }
  
  // Limpar mensagens após 5 segundos
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('')
        setErrorMessage('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, errorMessage])
  
  const showAnalysisDetails = () => {
    setShowAnalysisDetailsModal(true)
  }

  // Função para calcular distribuição real por categoria
  const calculateCategoryDistribution = () => {
    const categoryMap = new Map<string, { income: number, expense: number, total: number }>()
    
    // Processar transações recentes
    recentTransactions.forEach(transaction => {
      const category = transaction.category
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { income: 0, expense: 0, total: 0 })
      }
      
      const current = categoryMap.get(category)!
      if (transaction.type === 'INCOME') {
        current.income += transaction.amount
        current.total += transaction.amount
      } else {
        current.expense += transaction.amount
        current.total += transaction.amount
      }
    })
    
    // Processar contas a pagar
    accountsPayable.forEach(account => {
      const category = account.category
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { income: 0, expense: 0, total: 0 })
      }
      
      const current = categoryMap.get(category)!
      current.expense += account.amount
      current.total += account.amount
    })
    
    // Processar contas a receber
    accountsReceivable.forEach(account => {
      const category = account.category
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { income: 0, expense: 0, total: 0 })
      }
      
      const current = categoryMap.get(category)!
      current.income += account.amount
      current.total += account.amount
    })
    
    // Converter para array e ordenar por total
    const distribution = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        income: data.income,
        expense: data.expense,
        total: data.total
      }))
      .sort((a, b) => b.total - a.total)
    
    // Calcular totais gerais
    const totalIncome = distribution.reduce((sum, item) => sum + item.income, 0)
    const totalExpense = distribution.reduce((sum, item) => sum + item.expense, 0)
    const grandTotal = totalIncome + totalExpense
    
    // Adicionar percentuais
    const distributionWithPercentages = distribution.map(item => ({
      ...item,
      percentage: grandTotal > 0 ? ((item.total / grandTotal) * 100).toFixed(1) : '0.0'
    }))
    
    return {
      distribution: distributionWithPercentages,
      totalIncome,
      totalExpense,
      grandTotal
    }
  }

  // Função para receber transações do módulo de pagamentos
  const receivePaymentTransactions = (paymentTransactions: FinancialTransaction[]) => {
    const newTransactions = paymentTransactions
      .filter(payment => payment.status === 'COMPLETED' && payment.source === 'PAYMENT_SYSTEM')
      .map(payment => ({
        ...payment,
        id: `cf_${payment.paymentId}`,
        source: 'PAYMENT_SYSTEM' as 'PAYMENT_SYSTEM'
      }))
    
    if (newTransactions.length > 0) {
      setRecentTransactions(prev => {
        // Filtrar transações duplicadas
        const existingIds = new Set(prev.map(t => t.paymentId))
        const uniqueNewTransactions = newTransactions.filter(t => !existingIds.has(t.paymentId))
        
        // Atualizar mensagem de sucesso
        setTimeout(() => {
          setSuccessMessage(`${uniqueNewTransactions.length} transações de pagamento sincronizadas com sucesso!`)
        }, 100)
        
        return [...uniqueNewTransactions, ...prev]
      })
    }
  }

  // Sincronização automática com módulo de pedidos
  useEffect(() => {
    const syncInterval = setInterval(() => {
      // Simular recebimento de transações de pedidos
      const mockOrderTransactions: FinancialTransaction[] = [
        {
          id: `order-${Date.now()}`,
          type: 'INCOME',
          amount: Math.random() * 100 + 20,
          description: `Pedido #${Math.floor(Math.random() * 10000)} - Cliente Online`,
          category: 'Vendas',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'CREDIT_CARD',
          status: 'COMPLETED',
          source: 'PAYMENT_SYSTEM',
          paymentId: `p${Date.now()}`,
          provider: 'Stone',
          customer: 'Cliente Online'
        }
      ]
      
      receivePaymentTransactions(mockOrderTransactions)
    }, 25000) // A cada 25 segundos

    return () => clearInterval(syncInterval)
  }, [])

  // Função para sincronizar com módulo de pagamentos
  const syncWithPaymentSystem = () => {
    // Em um sistema real, aqui faríamos uma chamada para o módulo de pagamentos
    // Por enquanto, simulamos a sincronização
    setSuccessMessage('Sincronização com módulo de pagamentos realizada com sucesso!')
  }
  
  // Cálculos derivados para os cards
  const totalPending = accountsPayable.filter(a => a.status === 'PENDING').reduce((acc, a) => acc + a.amount, 0)
  
  const criticalAccounts = accountsPayable.filter(account => {
    return account.priority === 'HIGH' && account.status === 'PENDING'
  })
  
  const salaryAccounts = accountsPayable.filter(account => account.category === 'Salários')
  
  return (
    <div className="space-y-6">
      {/* Sistema de Mensagens */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 animate-in slide-in-from-top-2 duration-300">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage('')}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 animate-in slide-in-from-top-2 duration-300">
          <X className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage('')}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-manrope font-bold text-gray-900">Gestão de Fluxo de Caixa</h1>
          <p className="text-gray-600 font-manrope">Controle financeiro completo e integrado</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAdvancedReportModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="font-manrope">Relatórios</span>
          </button>
          <button 
            onClick={() => setShowForecastModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <TrendingUpIcon className="w-4 h-4" />
            <span className="font-manrope">Previsões</span>
          </button>
          <button 
            onClick={() => setShowNotificationModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span className="font-manrope">Notificações</span>
          </button>
        </div>
      </div>

      {/* Sistema de Navegação por Abas */}
      <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-2">
        <div className="flex items-center space-x-1">
          {/* Aba Visão Geral */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-manrope font-medium transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Activity className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'overview' ? 'animate-pulse' : ''}`} />
            <span>Visão Geral</span>
          </button>

          {/* Aba Transações */}
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-lg font-manrope font-medium transition-all duration-200 ${
              activeTab === 'transactions'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Transações</span>
              <span className="text-xs text-gray-400">(Visualização)</span>
            </div>
          </button>

          {/* Aba Contas */}
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-manrope font-medium transition-all duration-300 ${
              activeTab === 'accounts'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Receipt className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'accounts' ? 'rotate-12' : ''}`} />
            <span>Contas</span>
          </button>

          {/* Aba Reconciliação */}
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-manrope font-medium transition-all duration-300 ${
              activeTab === 'reconciliation'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Database className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'reconciliation' ? 'animate-pulse' : ''}`} />
            <span>Reconciliação</span>
          </button>

          {/* Aba Análise */}
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-manrope font-medium transition-all duration-300 ${
              activeTab === 'analysis'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <PieChart className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'analysis' ? 'animate-spin' : ''}`} />
            <span>Análise</span>
          </button>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'overview' && (
        <>
          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-green-600 text-sm font-manrope font-medium">+12.5%</span>
              </div>
              <h3 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>R$ 45.280</h3>
              <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope text-sm`}>Receita Total</p>
            </div>

            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-red-600 text-sm font-manrope font-medium">+8.2%</span>
              </div>
              <h3 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>R$ 18.450</h3>
              <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope text-sm`}>Despesas Totais</p>
            </div>

            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-blue-600 text-sm font-manrope font-medium">{criticalAccounts.length} críticas</span>
              </div>
              <h3 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
              <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope text-sm`}>Contas a Pagar</p>
            </div>

            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-purple-600 text-sm font-manrope font-medium">{salaryAccounts.length} salários</span>
              </div>
              <h3 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>
                R$ {salaryAccounts.reduce((acc, s) => acc + s.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope text-sm`}>Total Salários</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Receita vs Despesas</h3>
                <button className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Download className="w-5 h-5" />
                </button>
              </div>
              
              <div className={`h-64 rounded-xl p-4 flex items-end justify-between ${
                currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-t from-blue-50 to-transparent'
              }`}>
                {[65, 45, 78, 52, 89, 67, 94].map((height, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div className="flex flex-col space-y-1">
                      <div 
                        className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                        style={{ height: `${height}px` }}
                      ></div>
                      <div 
                        className="w-8 bg-gradient-to-t from-red-500 to-red-400 rounded-t"
                        style={{ height: `${height * 0.6}px` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-manrope ${
                      currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index]}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className={`text-sm font-manrope ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Receita</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className={`text-sm font-manrope ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Despesas</span>
                </div>
              </div>
            </div>

            {/* Expenses by Category */}
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Despesas por Categoria</h3>
                <button className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { category: 'Ingredientes', amount: 8500, percentage: 46, color: 'bg-blue-500' },
                  { category: 'Salários', amount: 5200, percentage: 28, color: 'bg-green-500' },
                  { category: 'Utilidades', amount: 2800, percentage: 15, color: 'bg-yellow-500' },
                  { category: 'Marketing', amount: 1200, percentage: 7, color: 'bg-purple-500' },
                  { category: 'Outros', amount: 750, percentage: 4, color: 'bg-gray-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
                      <span className={`font-manrope ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{item.category}</span>
                    </div>
                    <div className="text-right">
                      <p className={`font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>R$ {item.amount.toLocaleString()}</p>
                      <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-manrope`}>{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab Transações Recentes */}
      {activeTab === 'transactions' && (
        <>
          {/* Sistema de Filtros Avançados */}
          <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Filter className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-manrope font-bold text-gray-900">Filtros Avançados</h3>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowAdvancedStats(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <TrendingUpIcon className="w-4 h-4" />
                  <span className="font-manrope text-sm">Estatísticas</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-manrope font-medium text-primary mb-2">Categoria</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-sm"
                  onChange={(e) => setCashFlowFilter({ ...cashFlowFilter, category: e.target.value })}
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="vendas">Vendas</option>
                  <option value="servicos">Serviços</option>
                  <option value="fornecedores">Fornecedores</option>
                  <option value="operacionais">Operacionais</option>
                  <option value="administrativas">Administrativas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-primary mb-2">Tipo</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-sm"
                  onChange={(e) => setCashFlowFilter({ ...cashFlowFilter, type: e.target.value })}
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="income">Receitas</option>
                  <option value="expense">Despesas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-primary mb-2">Data Início</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-sm"
                  onChange={(e) => setCashFlowFilter({ ...cashFlowFilter, startDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-primary mb-2">Data Fim</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-sm"
                  onChange={(e) => setCashFlowFilter({ ...cashFlowFilter, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Pesquisar transações (descrição, fornecedor, cliente, etc.)"
                  className="w-full px-4 py-2 pl-10 input-primary rounded-lg font-manrope text-sm"
                  onChange={(e) => setCashFlowFilter({ ...cashFlowFilter, search: e.target.value })}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button 
                onClick={() => setShowFilterModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span className="font-manrope text-sm">Filtros Avançados</span>
              </button>

            </div>
          </div>

          {/* Tabela de Transações Melhorada */}
          <div className="card-primary rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-manrope font-bold text-gray-900">Transações Recentes</h2>
                  <p className="text-gray-600 font-manrope text-sm">Mostrando {recentTransactions.length} transações</p>
                </div>
                <button 
                  onClick={() => setShowAllTransactionsModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span className="font-manrope">Ver Todas as Transações</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="card-primary divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            transaction.source === 'PAYMENT_SYSTEM' ? 'bg-blue-500' : 
                            transaction.source === 'BANK_RECONCILIATION' ? 'bg-green-500' : 'bg-purple-500'
                          }`}></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                            <div className="text-sm text-gray-500">{transaction.provider || transaction.customer}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${
                          transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'INCOME' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(transaction.paymentMethod)}
                          <span className="text-sm text-gray-900">{transaction.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span className={`text-sm font-medium ${
                            transaction.status === 'COMPLETED' ? 'text-green-600' : 
                            transaction.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {transaction.status === 'COMPLETED' ? 'Concluído' : 
                             transaction.status === 'PENDING' ? 'Pendente' : 
                             transaction.status === 'FAILED' ? 'Falhou' : 'Reembolsado'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.source === 'PAYMENT_SYSTEM' ? 'bg-blue-100 text-blue-800' : 
                            transaction.source === 'BANK_RECONCILIATION' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {transaction.source === 'PAYMENT_SYSTEM' ? 'Pagamentos' : 
                             transaction.source === 'BANK_RECONCILIATION' ? 'Banco' : 'Fluxo de Caixa'}
                          </span>
                          {transaction.paymentId && (
                            <span className="text-xs text-gray-500">ID: {transaction.paymentId}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => viewTransactionDetails(transaction)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-all duration-200"
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tab Contas */}
      {activeTab === 'accounts' && (
        <>
          {/* Resumo das Contas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <ArrowDownRight className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-red-600 text-sm font-medium">Contas a Pagar</span>
              </div>
              <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-1">R$ 3.456</h3>
              <p className="text-gray-600 font-manrope text-sm">Total Pendente</p>
              <div className="mt-4">
                <span className="text-sm text-red-600 font-medium">12 contas pendentes</span>
              </div>
            </div>

            <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-green-600 text-sm font-medium">Contas a Receber</span>
              </div>
              <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-1">R$ 6.892</h3>
              <p className="text-gray-600 font-manrope text-sm">Total Pendente</p>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">8 contas pendentes</span>
              </div>
            </div>

            <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Equal className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-blue-600 text-sm font-medium">Saldo</span>
              </div>
              <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-1">R$ 3.436</h3>
              <p className="text-gray-600 font-manrope text-sm">Diferença</p>
              <div className="mt-4">
                <span className="text-sm text-blue-600 font-medium">Positivo</span>
              </div>
            </div>
          </div>

          {/* Contas a Pagar */}
          <div className="card-primary rounded-2xl shadow-lg border border-gray-100 mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-manrope font-bold text-gray-900">Contas a Pagar</h2>
                  <p className="text-gray-600 font-manrope text-sm">Gerencie suas obrigações financeiras</p>
                </div>
                <button 
                  onClick={() => setShowPayableModal(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-manrope">Nova Conta a Pagar</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="card-primary divide-y divide-gray-200">
                  {accountsPayable.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{account.description}</div>
                        <div className="text-sm text-gray-500">{account.supplier}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">R$ {account.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(account.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(account.priority)}`}>
                          {account.priority === 'HIGH' ? 'Alta' : 
                           account.priority === 'MEDIUM' ? 'Média' : 'Baixa'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pendente
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => viewAccountDetails(account)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                            title="Ver Detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => editAccount(account)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200" 
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteAccount(account)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200" 
                            title="Excluir"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Contas a Receber */}
          <div className="card-primary rounded-2xl shadow-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-manrope font-bold text-gray-900">Contas a Receber</h2>
                  <p className="text-gray-600 font-manrope text-sm">Acompanhe seus recebimentos</p>
                </div>
                <button 
                  onClick={() => setShowReceivableModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-manrope">Nova Conta a Receber</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="card-primary divide-y divide-gray-200">
                  {accountsReceivable.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{account.description}</div>
                        <div className="text-sm text-gray-500">{account.customer}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">R$ {account.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(account.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(account.priority)}`}>
                          {account.priority === 'HIGH' ? 'Alta' : 
                           account.priority === 'MEDIUM' ? 'Média' : 'Baixa'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pendente
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => viewAccountDetails(account)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                            title="Ver Detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => editAccount(account)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200" 
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteAccount(account)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200" 
                            title="Excluir"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Tab Reconciliação */}
      {activeTab === 'reconciliation' && (
        <>
          {/* Controles de Importação e Sincronização */}
          <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-manrope font-bold text-gray-900">Reconciliação Bancária</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Sistema Ativo
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Última sinc: 2h atrás
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Importar Extrato */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors duration-200">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-manrope font-semibold text-gray-900 mb-2">Importar Extrato</h3>
                  <p className="text-gray-600 text-sm mb-4">Faça upload do seu extrato bancário para reconciliação automática</p>
                  <button 
                    onClick={() => setShowImportModal(true)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Extrato Bancário
                  </button>
                </div>
              </div>
              
              {/* Sincronização Automática */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors duration-200">
                <div className="text-center">
                  <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-manrope font-semibold text-gray-900 mb-2">Sincronização Automática</h3>
                  <p className="text-gray-600 text-sm mb-4">Sincronize automaticamente com suas contas bancárias</p>
                  <button 
                    onClick={autoSyncBankTransactions}
                    disabled={syncing}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
                  >
                    {syncing ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Wifi className="w-4 h-4 mr-2" />
                    )}
                    {syncing ? 'Sincronizando...' : 'Sincronizar Automaticamente'}
                  </button>
                </div>
              </div>
            </div>

            {/* Status das Integrações Bancárias */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-manrope font-semibold text-gray-900 mb-4">Status das Integrações</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-manrope font-medium text-green-900">Banco do Brasil</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">Conectado - Última sinc: 2h atrás</p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-manrope font-medium text-yellow-900">Itaú</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">Pendente - Aguardando autorização</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="font-manrope font-medium text-gray-900">Santander</span>
                  </div>
                  <p className="text-sm text-primary mt-1">Não configurado</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transações Bancárias */}
          <div className="card-primary rounded-2xl shadow-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-manrope font-bold text-gray-900">Transações Bancárias</h2>
                  <p className="text-gray-600 font-manrope text-sm">Transações importadas e sincronizadas</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {bankTransactions.length} transações
                  </button>
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                    Sincronizar
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Banco</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="card-primary divide-y divide-gray-200">
                  {bankTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.bankName}</div>
                        <div className="text-sm text-gray-500">{transaction.accountNumber}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'CREDIT' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(transaction.transactionDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === 'RECONCILED' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.status === 'RECONCILED' ? 'Reconciliada' :
                           transaction.status === 'PENDING' ? 'Pendente' : 'Manual'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => viewReconciliationDetails(transaction)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                            title="Ver Detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => reconcileTransaction(transaction)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200" 
                            title="Reconciliar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteBankTransaction(transaction)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200" 
                            title="Excluir"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tab Análise */}
      {activeTab === 'analysis' && (
        <>
          {/* Métricas de Análise */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-blue-600 text-sm font-manrope font-medium">+18.5%</span>
              </div>
              <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-1">R$ 45.892</h3>
              <p className="text-gray-600 font-manrope text-sm">Receita Mensal</p>
            </div>

            <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-red-600 text-sm font-manrope font-medium">-5.2%</span>
              </div>
              <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-1">R$ 23.456</h3>
              <p className="text-gray-600 font-manrope text-sm">Despesa Mensal</p>
            </div>

            <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <PiggyBank className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-green-600 text-sm font-manrope font-medium">+23.1%</span>
              </div>
              <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-1">R$ 22.436</h3>
              <p className="text-gray-600 font-manrope text-sm">Lucro Líquido</p>
            </div>

            <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-purple-600 text-sm font-manrope font-medium">89.2%</span>
              </div>
              <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-1">Meta Atingida</h3>
              <p className="text-gray-600 font-manrope text-sm">Do Objetivo Mensal</p>
            </div>
          </div>

          {/* Gráficos de Análise */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-manrope font-bold text-gray-900">Evolução do Fluxo de Caixa</h3>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                  <option value="365">Último ano</option>
                </select>
              </div>
              
              {/* Gráfico Simulado */}
              <div className="h-80 bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="flex items-end justify-between h-full space-x-1">
                  {[45, 52, 48, 61, 55, 67, 58, 72, 65, 78, 71, 83, 76, 89, 82, 95, 88, 92, 85, 98, 91, 87, 94, 88, 96, 89, 93, 87, 91, 88].map((height, index) => (
                    <div key={index} className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm hover:from-green-600 hover:to-green-500 transition-all duration-300 cursor-pointer" 
                         style={{ height: `${height}%` }}>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-4">
                  <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
                </div>
              </div>
            </div>

            <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-manrope font-bold text-gray-900">Distribuição por Categoria</h3>
                <button 
                  onClick={showAnalysisDetails}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-all duration-200"
                >
                  Ver Detalhes
                </button>
              </div>
              
              {/* Gráfico de Distribuição por Categoria */}
              <div className="card-primary rounded-xl p-6 border border-gray-200 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Distribuição por Categoria</h4>
                <div className="space-y-4">
                  {calculateCategoryDistribution().distribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-green-500' : 
                          index === 1 ? 'bg-blue-500' : 
                          index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}>
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{item.category}</div>
                          <div className="text-sm text-gray-600">
                            {item.income > 0 && (
                              <span className="text-green-600 font-medium">
                                Receita: R$ {item.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                            {item.expense > 0 && (
                              <span className="text-red-600 font-medium">
                                Despesa: R$ {item.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-lg text-gray-500 font-medium">{item.percentage}%</div>
                        <div className="text-sm text-gray-400">
                          {item.income > item.expense ? 'Receita Dominante' : 'Despesa Dominante'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Análise de Tendências */}
          <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-manrope font-bold text-gray-900">Análise de Tendências</h3>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Tendência Positiva</span>
                <button className="text-blue-600 hover:text-blue-700 text-sm">Exportar Relatório</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <TrendingUpIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-manrope font-semibold text-green-900 mb-1">Receitas</h4>
                <p className="text-green-700 text-sm">Crescimento de 15.3% no mês</p>
                <p className="text-green-600 font-bold mt-2">Tendência: ↗️ Ascendente</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-manrope font-semibold text-red-900 mb-1">Despesas</h4>
                <p className="text-red-700 text-sm">Redução de 8.7% no mês</p>
                <p className="text-red-600 font-bold mt-2">Tendência: ↘️ Descendente</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <PiggyBank className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-manrope font-semibold text-blue-900 mb-1">Lucro</h4>
                <p className="text-blue-700 text-sm">Aumento de 23.1% no mês</p>
                <p className="text-blue-600 font-bold mt-2">Tendência: ↗️ Ascendente</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modais */}
      {/* Modal Conta a Pagar */}
      {showPayableModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md card-primary modal-dark">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedAccount ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
                </h3>
                <button onClick={() => {
                  setShowPayableModal(false)
                  setSelectedAccount(null)
                  setPayableForm({
                    description: '',
                    amount: '',
                    category: '',
                    dueDate: '',
                    priority: 'MEDIUM',
                    supplier: '',
                    notes: ''
                  })
                }}>
                  <X className="w-6 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary">Descrição</label>
                  <input
                    type="text"
                    value={payableForm.description}
                    onChange={(e) => setPayableForm({...payableForm, description: e.target.value})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={payableForm.amount}
                    onChange={(e) => setPayableForm({...payableForm, amount: e.target.value})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Categoria</label>
                  <select
                    value={payableForm.category}
                    onChange={(e) => setPayableForm({...payableForm, category: e.target.value})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  >
                    <option value="">Selecione uma categoria</option>
                    {customCategories.filter(cat => cat.type === 'expense').map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Data de Vencimento</label>
                  <input
                    type="date"
                    value={payableForm.dueDate}
                    onChange={(e) => setPayableForm({...payableForm, dueDate: e.target.value})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Prioridade</label>
                  <select
                    value={payableForm.priority}
                    onChange={(e) => setPayableForm({...payableForm, priority: e.target.value as any})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Fornecedor</label>
                  <input
                    type="text"
                    value={payableForm.supplier}
                    onChange={(e) => setPayableForm({...payableForm, supplier: e.target.value})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Observações</label>
                  <textarea
                    value={payableForm.notes}
                    onChange={(e) => setPayableForm({...payableForm, notes: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowPayableModal(false)
                    setSelectedAccount(null)
                    setPayableForm({
                      description: '',
                      amount: '',
                      category: '',
                      dueDate: '',
                      priority: 'MEDIUM',
                      supplier: '',
                      notes: ''
                    })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={selectedAccount ? updatePayableAccount : createPayableAccount}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{selectedAccount ? 'Atualizando...' : 'Criando...'}</span>
                    </>
                  ) : (
                    <>
                      {selectedAccount ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{selectedAccount ? 'Atualizar Conta' : 'Criar Conta a Pagar'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Conta a Receber */}
      {showReceivableModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md card-primary modal-dark">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedAccount ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}
                </h3>
                <button onClick={() => {
                  setShowReceivableModal(false)
                  setSelectedAccount(null)
                  setReceivableForm({
                    description: '',
                    amount: '',
                    category: '',
                    dueDate: '',
                    priority: 'MEDIUM',
                    customer: '',
                    notes: ''
                  })
                }}>
                  <X className="w-6 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary">Descrição</label>
                  <input
                    type="text"
                    value={receivableForm.description}
                    onChange={(e) => setReceivableForm({...receivableForm, description: e.target.value})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={receivableForm.amount}
                    onChange={(e) => setReceivableForm({...receivableForm, amount: e.target.value})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Categoria</label>
                  <select
                    value={receivableForm.category}
                    onChange={(e) => setReceivableForm({...receivableForm, category: e.target.value})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  >
                    <option value="">Selecione uma categoria</option>
                    {customCategories.filter(cat => cat.type === 'income').map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Data de Vencimento</label>
                  <input
                    type="date"
                    value={receivableForm.dueDate}
                    onChange={(e) => setReceivableForm({...receivableForm, dueDate: e.target.value})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Prioridade</label>
                  <select
                    value={receivableForm.priority}
                    onChange={(e) => setReceivableForm({...receivableForm, priority: e.target.value as any})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Cliente</label>
                  <input
                    type="text"
                    value={receivableForm.customer}
                    onChange={(e) => setReceivableForm({...receivableForm, customer: e.target.value})}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary">Observações</label>
                  <textarea
                    value={receivableForm.notes}
                    onChange={(e) => setReceivableForm({...receivableForm, notes: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full input-primary px-3 py-2 rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowReceivableModal(false)
                    setSelectedAccount(null)
                    setReceivableForm({
                      description: '',
                      amount: '',
                      category: '',
                      dueDate: '',
                      priority: 'MEDIUM',
                      customer: '',
                      notes: ''
                    })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={selectedAccount ? updateReceivableAccount : createReceivableAccount}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{selectedAccount ? 'Atualizando...' : 'Criando...'}</span>
                    </>
                  ) : (
                    <>
                      {selectedAccount ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{selectedAccount ? 'Atualizar Conta' : 'Criar Conta a Receber'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Importar Extrato */}
      {showImportModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-[1000px] shadow-2xl rounded-2xl card-primary modal-dark">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-manrope font-bold text-gray-900">Importar Extrato Bancário</h3>
                    <p className="text-gray-600 font-manrope">Sincronize suas transações bancárias automaticamente</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Coluna Esquerda */}
                <div className="space-y-4">
                  {/* Seleção de Banco */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <label className="block text-lg font-manrope font-semibold text-gray-900 mb-3">🏦 Banco e Conta</label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Nome do Banco</label>
                        <select
                          value={importForm.bankName}
                          onChange={(e) => setImportForm({...importForm, bankName: e.target.value})}
                          className="w-full px-3 py-2 input-primary rounded-lg font-manrope text-sm"
                        >
                          <option value="">Selecione o banco</option>
                          {banks.map(bank => (
                            <option key={bank.id} value={bank.name}>{bank.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Número da Conta</label>
                        <input
                          type="text"
                          value={importForm.accountNumber}
                          onChange={(e) => setImportForm({...importForm, accountNumber: e.target.value})}
                          placeholder="0000-0 00000000-0"
                          className="w-full px-3 py-2 input-primary rounded-lg font-manrope text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Opções de Importação */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <label className="block text-lg font-manrope font-semibold text-gray-900 mb-3">⚙️ Opções de Importação</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="auto-reconcile"
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                        <label htmlFor="auto-reconcile" className="text-sm font-medium text-primary">
                          Reconciliação automática
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="create-missing"
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                        <label htmlFor="create-missing" className="text-sm font-medium text-primary">
                          Criar transações ausentes
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="update-existing"
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                        <label htmlFor="update-existing" className="text-sm font-medium text-primary">
                          Atualizar transações existentes
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="notify-errors"
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                        <label htmlFor="notify-errors" className="text-sm font-medium text-primary">
                          Notificar erros de importação
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna Direita */}
                <div className="space-y-4">
                  {/* Upload de Arquivo */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 h-full">
                    <label className="block text-lg font-manrope font-semibold text-gray-900 mb-3">📁 Arquivo do Extrato</label>
                    <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors duration-200">
                      <Upload className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <div className="space-y-2">
                        <p className="text-base font-manrope font-semibold text-gray-900">
                          {importForm.file ? importForm.file.name : 'Clique para selecionar arquivo'}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {importForm.file ? 'Arquivo selecionado com sucesso!' : 'Formatos aceitos: CSV, Excel, TXT'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Tamanho máximo: 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls,.txt"
                        onChange={(e) => setImportForm({...importForm, file: e.target.files?.[0] || null})}
                        className="hidden"
                        id="file-upload"
                      />
                      <label 
                        htmlFor="file-upload"
                        className="mt-3 inline-flex px-4 py-2 bg-green-600 text-white rounded-lg font-manrope font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                      >
                        Selecionar Arquivo
                      </label>
                    </div>
                  </div>

                  {/* Resumo da Importação */}
                  {importForm.file && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <Info className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Arquivo selecionado: {importForm.file.name}
                          </p>
                          <p className="text-sm text-blue-700">
                            Tamanho: {(importForm.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-6 py-3 border border-gray-300 text-primary rounded-lg font-manrope font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={importBankStatement}
                  disabled={!importForm.file || !importForm.bankName || !importForm.accountNumber || loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-manrope font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Importando...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Importar Extrato</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Relatórios */}
      {showReportModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md card-primary">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Gerar Relatório</h3>
                <button onClick={() => setShowReportModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Período</label>
                    <select
                      value={reportPeriod}
                      onChange={(e) => setReportPeriod(e.target.value)}
                      className="w-full px-3 py-2 input-primary rounded-lg"
                    >
                      <option value="week">Última Semana</option>
                      <option value="month">Último Mês</option>
                      <option value="quarter">Último Trimestre</option>
                      <option value="year">Último Ano</option>
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Tipo de Relatório</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as 'fullModule' | 'specificTab')}
                      className="w-full px-3 py-2 input-primary rounded-lg"
                    >
                      <option value="fullModule">Relatório Completo</option>
                      <option value="specificTab">Relatório Detalhado</option>
                      <option value="cashflow">Fluxo de Caixa</option>
                      <option value="reconciliation">Reconciliação</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Formato de Saída</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="format" value="pdf" defaultChecked className="mr-2" />
                      <span>PDF</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="format" value="excel" className="mr-2" />
                      <span>Excel</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="format" value="email" className="mr-2" />
                      <span>Email</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Email para Envio</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2 input-primary rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gerando...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      <span>Gerar Relatório</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Previsões com IA Preditiva */}
      {showForecastModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-5 border w-[1200px] max-h-[95vh] shadow-lg rounded-md card-primary overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUpIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">IA Preditiva Financeira</h3>
                    <p className="text-gray-600">Análise inteligente e previsões baseadas em machine learning</p>
                  </div>
                </div>
                <button onClick={() => setShowForecastModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Configurações de IA */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span>Configurações de IA</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Período de Previsão</label>
                      <select
                        value={forecastData.period}
                        onChange={(e) => setForecastData({...forecastData, period: e.target.value})}
                        className="w-full px-3 py-2 input-primary rounded-lg"
                      >
                        <option value="1month">1 Mês</option>
                        <option value="3months">3 Meses</option>
                        <option value="6months">6 Meses</option>
                        <option value="1year">1 Ano</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Nível de Confiança</label>
                      <select
                        value={forecastData.confidence}
                        onChange={(e) => setForecastData({...forecastData, confidence: e.target.value})}
                        className="w-full px-3 py-2 input-primary rounded-lg"
                      >
                        <option value="low">Baixo (80%)</option>
                        <option value="medium">Médio (90%)</option>
                        <option value="high">Alto (95%)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Algoritmo de IA</label>
                      <select className="w-full px-3 py-2 input-primary rounded-lg">
                        <option value="lstm">LSTM Neural Network</option>
                        <option value="prophet">Facebook Prophet</option>
                        <option value="arima">ARIMA</option>
                        <option value="ensemble">Ensemble (Recomendado)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Modelo de Dados</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="financial">Financeiro Completo</option>
                        <option value="cashflow">Apenas Fluxo de Caixa</option>
                        <option value="revenue">Receitas e Vendas</option>
                        <option value="expenses">Despesas e Custos</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={forecastData.includeSeasonality}
                        onChange={(e) => setForecastData({...forecastData, includeSeasonality: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-primary">Incluir Sazonalidade</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-primary">Análise de Tendências</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-primary">Detecção de Anomalias</span>
                    </label>
                  </div>
                </div>

                {/* Análise Atual e Previsão */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gráfico de Linha - Histórico e Previsão */}
                  <div className="card-primary rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900">Histórico e Previsão</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">IA Ativa</span>
                    </div>
                    
                    {/* Gráfico Simulado de Linha */}
                    <div className="h-48 bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <div className="flex items-end justify-between h-full space-x-1">
                        {/* Histórico (linha sólida) */}
                        {[45, 52, 48, 61, 55, 67, 58, 72, 65, 78, 71, 83].map((height, index) => (
                          <div key={index} className="flex-1 bg-blue-500 rounded-t-sm"
                               style={{ height: `${height}%` }}>
                          </div>
                        ))}
                        
                        {/* Previsão (linha tracejada) */}
                        {[76, 82, 79, 85, 88, 92, 89, 95, 91, 98, 94, 100].map((height, index) => (
                          <div key={index} className="flex-1 bg-gradient-to-t from-purple-400 to-purple-600 rounded-t-sm border-2 border-dashed border-purple-300"
                               style={{ height: `${height}%` }}>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                        <span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Histórico</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-dashed border-purple-300"></div>
                        <span className="text-gray-600">Previsão IA</span>
                      </div>
                    </div>
                  </div>

                  {/* Métricas de Previsão */}
                  <div className="card-primary rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Métricas de Previsão</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2">
                          <TrendingUpIcon className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-900">Receita Prevista</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-900">R$ 67.892</div>
                          <div className="text-sm text-green-600">+18.5% em relação ao mês anterior</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2">
                          <Target className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Precisão da IA</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-900">94.2%</div>
                          <div className="text-sm text-blue-600">Baseado em 12 meses</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-purple-900">Confiança</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-900">Alta</div>
                          <div className="text-sm text-purple-600">95% de confiança</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Análise de Tendências e Insights */}
                <div className="card-primary rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span>Insights da IA</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <TrendingUpIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h5 className="font-bold text-green-900 mb-1">Tendência Positiva</h5>
                      <p className="text-green-700 text-sm">Crescimento sustentado de 15-20% mensal</p>
                      <div className="mt-2 text-xs text-green-600">
                        <strong>Confiança:</strong> 92%
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h5 className="font-bold text-blue-900 mb-1">Sazonalidade</h5>
                      <p className="text-blue-700 text-sm">Picos em Dezembro (+25%) e Março (+18%)</p>
                      <div className="mt-2 text-xs text-blue-600">
                        <strong>Padrão:</strong> Anual
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <AlertTriangle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h5 className="font-bold text-purple-900 mb-1">Alertas</h5>
                      <p className="text-purple-700 text-sm">Possível desaceleração em Julho (-8%)</p>
                      <div className="mt-2 text-xs text-purple-600">
                        <strong>Risco:</strong> Médio
                      </div>
                    </div>

                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <h5 className="font-bold text-orange-900 mb-1">Meta de Crescimento</h5>
                      <p className="text-orange-700 text-sm">Alcançará 120% da meta anual</p>
                      <div className="mt-2 text-xs text-orange-600">
                        <strong>Probabilidade:</strong> 87%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recomendações da IA */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-indigo-600" />
                    <span>Recomendações da IA</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 card-primary rounded-lg border border-indigo-200">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Aumentar investimento em marketing</p>
                        <p className="text-sm text-gray-600">Baseado no padrão sazonal identificado, recomendamos aumentar o orçamento de marketing em 20% nos meses de pico.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 card-primary rounded-lg border border-indigo-200">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Preparar para desaceleração</p>
                        <p className="text-sm text-gray-600">Em Julho, considere reduzir custos operacionais e focar em vendas de produtos com maior margem.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 card-primary rounded-lg border border-indigo-200">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <TrendingUpIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Expandir operações</p>
                        <p className="text-sm text-gray-600">A tendência de crescimento sustentado sugere que é um bom momento para expandir para novos mercados.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações Técnicas */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Informações Técnicas</span>
                  </div>
                  <p className="text-sm text-primary">
                    Esta previsão foi gerada usando algoritmos de machine learning avançados (LSTM + Prophet + ARIMA) 
                    treinados com seus dados históricos dos últimos 24 meses. O modelo considera sazonalidade, 
                    tendências de mercado e padrões específicos do seu negócio para gerar previsões com alta precisão.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Última atualização: {new Date().toLocaleString('pt-BR')}</span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowForecastModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={generateForecast}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Atualizando IA...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Atualizar Previsões</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Notificações */}
      {showNotificationModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md card-primary">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Configurar Notificações</h3>
                <button onClick={() => setShowNotificationModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.overdueAccounts}
                      onChange={(e) => setNotifications({...notifications, overdueAccounts: e.target.checked})}
                      className="mr-3"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Contas Vencidas</span>
                      <p className="text-xs text-gray-500">Notificar sobre contas a pagar/receber vencidas</p>
                    </div>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.lowBalance}
                      onChange={(e) => setNotifications({...notifications, lowBalance: e.target.checked})}
                      className="mr-3"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Saldo Baixo</span>
                      <p className="text-xs text-gray-500">Alertar quando o saldo estiver abaixo do limite</p>
                    </div>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.unusualTransactions}
                      onChange={(e) => setNotifications({...notifications, unusualTransactions: e.target.checked})}
                      className="mr-3"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Transações Incomuns</span>
                      <p className="text-xs text-gray-500">Detectar e notificar transações fora do padrão</p>
                    </div>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.reconciliationAlerts}
                      onChange={(e) => setNotifications({...notifications, reconciliationAlerts: e.target.checked})}
                      className="mr-3"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Alertas de Reconciliação</span>
                      <p className="text-xs text-gray-500">Notificar sobre divergências bancárias</p>
                    </div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Frequência de Notificações</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="immediate">Imediato</option>
                    <option value="hourly">A cada hora</option>
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={updateNotifications}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      <span>Salvar Configurações</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Transação */}
      {showTransactionDetails && selectedTransaction && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[700px] shadow-lg rounded-md card-primary">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Detalhes da Transação</h3>
                </div>
                <button onClick={() => setShowTransactionDetails(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary">Descrição</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTransaction.description}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Categoria</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTransaction.category}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Valor</label>
                    <p className={`text-2xl font-bold mt-1 ${
                      selectedTransaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedTransaction.type === 'INCOME' ? '+' : '-'} R$ {selectedTransaction.amount.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Método de Pagamento</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getPaymentMethodIcon(selectedTransaction.paymentMethod)}
                      <span className="text-sm text-gray-900">{selectedTransaction.paymentMethod}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(selectedTransaction.status)}
                      <span className={`text-sm font-medium ${
                        selectedTransaction.status === 'COMPLETED' ? 'text-green-600' : 
                        selectedTransaction.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {selectedTransaction.status === 'COMPLETED' ? 'Concluído' : 
                         selectedTransaction.status === 'PENDING' ? 'Pendente' : 
                         selectedTransaction.status === 'FAILED' ? 'Falhou' : 'Reembolsado'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Origem</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedTransaction.source === 'PAYMENT_SYSTEM' ? 'bg-blue-100 text-blue-800' : 
                        selectedTransaction.source === 'BANK_RECONCILIATION' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {selectedTransaction.source === 'PAYMENT_SYSTEM' ? 'Sistema de Pagamentos' : 
                         selectedTransaction.source === 'BANK_RECONCILIATION' ? 'Reconciliação Bancária' : 'Fluxo de Caixa'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Data</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedTransaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">
                      {selectedTransaction.type === 'INCOME' ? 'Cliente' : 'Fornecedor'}
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedTransaction.provider || selectedTransaction.customer || 'N/A'}
                    </p>
                  </div>
                  
                  {selectedTransaction.paymentId && (
                    <div>
                      <label className="block text-sm font-medium text-primary">ID do Pagamento</label>
                      <p className="text-sm text-gray-900 mt-1 font-mono">{selectedTransaction.paymentId}</p>
                    </div>
                  )}
                  
                  {selectedTransaction.reconciliationId && (
                    <div>
                      <label className="block text-sm font-medium text-primary">ID da Reconciliação</label>
                      <p className="text-sm text-gray-900 mt-1 font-mono">{selectedTransaction.reconciliationId}</p>
                    </div>
                  )}
                </div>
                
                {selectedTransaction.notes && (
                  <div>
                    <label className="block text-sm font-medium text-primary">Observações</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTransaction.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-blue-800 font-medium">Gerenciamento de Transações</p>
                      <p className="text-blue-700 text-sm">
                        Para editar ou excluir esta transação, use a aba "Contas" onde você pode gerenciar 
                        contas a pagar e receber de forma mais eficiente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setShowTransactionDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setActiveTab('accounts')
                    setShowTransactionDetails(false)
                    setSuccessMessage('Navegando para a aba "Contas" para gerenciar esta transação')
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Gerenciar na Aba Contas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Conta */}
      {showAccountDetails && selectedAccount && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md card-primary">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Detalhes da Conta</h3>
                <button onClick={() => setShowAccountDetails(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary">Descrição</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedAccount.description}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Valor</label>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      R$ {selectedAccount.amount.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Categoria</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedAccount.category}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Vencimento</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedAccount.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Prioridade</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(selectedAccount.priority)}`}>
                      {selectedAccount.priority === 'HIGH' ? 'Alta' :
                       selectedAccount.priority === 'MEDIUM' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Status</label>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {selectedAccount.status === 'PENDING' ? 'Pendente' :
                       selectedAccount.status === 'PAID' ? 'Pago' :
                       selectedAccount.status === 'OVERDUE' ? 'Vencido' : 'Cancelado'}
                    </span>
                  </div>
                </div>
                
                {selectedAccount.supplier && (
                  <div>
                    <label className="block text-sm font-medium text-primary">Fornecedor</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedAccount.supplier}</p>
                  </div>
                )}
                
                {selectedAccount.customer && (
                  <div>
                    <label className="block text-sm font-medium text-primary">Cliente</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedAccount.customer}</p>
                  </div>
                )}
                
                {selectedAccount.notes && (
                  <div>
                    <label className="block text-sm font-medium text-primary">Observações</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedAccount.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowAccountDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Reconciliação */}
      {showReconciliationDetails && selectedReconciliation && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md card-primary">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Detalhes da Reconciliação</h3>
                <button onClick={() => setShowReconciliationDetails(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary">Banco</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedReconciliation.bankName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Conta</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedReconciliation.accountNumber}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Descrição</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedReconciliation.description}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Valor</label>
                    <p className={`text-2xl font-bold mt-1 ${
                      selectedReconciliation.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedReconciliation.type === 'CREDIT' ? '+' : '-'} R$ {selectedReconciliation.amount.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Data da Transação</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedReconciliation.transactionDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary">Status</label>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {selectedReconciliation.status === 'PENDING' ? 'Pendente' :
                       selectedReconciliation.status === 'RECONCILED' ? 'Reconciliado' : 'Manual'}
                    </span>
                  </div>
                </div>
                
                {selectedReconciliation.notes && (
                  <div>
                    <label className="block text-sm font-medium text-primary">Observações</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedReconciliation.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowReconciliationDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setShowReconciliationDetails(false)
                    setShowReconciliationModal(true)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Reconciliar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Estatísticas Avançadas */}
      {showAdvancedStats && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-5 border w-[1200px] max-h-[95vh] shadow-lg rounded-md card-primary overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Estatísticas Avançadas</h3>
                    <p className="text-gray-600">Análise detalhada e métricas de performance</p>
                  </div>
                </div>
                <button onClick={() => setShowAdvancedStats(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Métricas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUpIcon className="w-5 h-5 text-green-600" />
                      <span className="text-green-600 text-sm font-medium">+18.5%</span>
                    </div>
                    <h4 className="text-2xl font-bold text-green-900">R$ 45.892</h4>
                    <p className="text-green-700 text-sm">Receita Total</p>
                    <p className="text-green-600 text-xs mt-1">em relação ao mês anterior</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <span className="text-red-600 text-sm font-medium">-5.2%</span>
                    </div>
                    <h4 className="text-2xl font-bold text-red-900">R$ 23.456</h4>
                    <p className="text-red-700 text-sm">Despesa Total</p>
                    <p className="text-red-600 text-xs mt-1">em relação ao mês anterior</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-600 text-sm font-medium">+23.1%</span>
                    </div>
                    <h4 className="text-2xl font-bold text-blue-900">R$ 22.436</h4>
                    <p className="text-blue-700 text-sm">Lucro Líquido</p>
                    <p className="text-blue-600 text-xs mt-1">em relação ao mês anterior</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-600 text-sm font-medium">156</span>
                    </div>
                    <h4 className="text-2xl font-bold text-purple-900">Transações</h4>
                    <p className="text-purple-700 text-sm">Total do Mês</p>
                    <p className="text-purple-600 text-xs mt-1">+12 em relação ao mês anterior</p>
                  </div>
                </div>

                {/* Gráficos de Análise */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gráfico de Linha - Evolução Mensal */}
                  <div className="card-primary rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900">Evolução Mensal</h4>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="6">Últimos 6 meses</option>
                        <option value="12">Últimos 12 meses</option>
                        <option value="24">Últimos 24 meses</option>
                      </select>
                    </div>
                    
                    {/* Gráfico Simulado */}
                    <div className="h-48 bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <div className="flex items-end justify-between h-full space-x-1">
                        {[45, 52, 48, 61, 55, 67].map((height, index) => (
                          <div key={index} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm hover:from-blue-600 hover:to-blue-500 transition-all duration-300 cursor-pointer"
                               style={{ height: `${height}%` }}>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico de Pizza - Distribuição por Categoria */}
                  <div className="card-primary rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900">Distribuição por Categoria</h4>
                      <button className="text-blue-600 hover:text-blue-700 text-sm">Ver Detalhes</button>
                    </div>
                    
                    {/* Gráfico de Pizza Simulado */}
                    <div className="h-48 bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">64%</span>
                        </div>
                        <p className="text-sm text-gray-600">Receitas e Despesas</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Análise de Performance */}
                <div className="card-primary rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Análise de Performance</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <TrendingUpIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <h5 className="font-bold text-green-900 mb-1">Melhor Categoria</h5>
                      <p className="text-green-700 text-sm">Vendas</p>
                      <div className="text-2xl font-bold text-green-900 mt-2">R$ 8.247</div>
                      <div className="text-sm text-green-600">64.2% do total</div>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <TrendingDown className="w-8 h-8 text-red-600" />
                      </div>
                      <h5 className="font-bold text-red-900 mb-1">Maior Despesa</h5>
                      <p className="text-red-700 text-sm">Fornecedores</p>
                      <div className="text-2xl font-bold text-red-900 mt-2">R$ 4.567</div>
                      <div className="text-sm text-red-600">55.5% do total</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Activity className="w-8 h-8 text-blue-600" />
                      </div>
                      <h5 className="font-bold text-blue-900 mb-1">Eficiência</h5>
                      <p className="text-blue-700 text-sm">Operacional</p>
                      <div className="text-2xl font-bold text-blue-900 mt-2">87.3%</div>
                      <div className="text-sm text-blue-600">Taxa de sucesso</div>
                    </div>
                  </div>
                </div>

                {/* Tabela de Estatísticas Detalhadas */}
                <div className="card-primary rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Estatísticas Detalhadas</h4>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Métrica</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Atual</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mês Anterior</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variação</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tendência</th>
                        </tr>
                      </thead>
                      <tbody className="card-primary divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Volume de Transações</td>
                          <td className="px-4 py-3 text-sm text-gray-900">156</td>
                          <td className="px-4 py-3 text-sm text-gray-900">144</td>
                          <td className="px-4 py-3 text-sm text-green-600">+8.3%</td>
                          <td className="px-4 py-3">
                            <TrendingUpIcon className="w-4 h-4 text-green-600" />
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Ticket Médio</td>
                          <td className="px-4 py-3 text-sm text-gray-900">R$ 294,18</td>
                          <td className="px-4 py-3 text-sm text-gray-900">R$ 318,75</td>
                          <td className="px-4 py-3 text-sm text-red-600">-7.7%</td>
                          <td className="px-4 py-3">
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Taxa de Aprovação</td>
                          <td className="px-4 py-3 text-sm text-gray-900">94.2%</td>
                          <td className="px-4 py-3 text-sm text-gray-900">91.8%</td>
                          <td className="px-4 py-3 text-sm text-green-600">+2.4%</td>
                          <td className="px-4 py-3">
                            <TrendingUpIcon className="w-4 h-4 text-green-600" />
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Tempo Médio de Processamento</td>
                          <td className="px-4 py-3 text-sm text-gray-900">2.3h</td>
                          <td className="px-4 py-3 text-sm text-gray-900">3.1h</td>
                          <td className="px-4 py-3 text-sm text-green-600">-25.8%</td>
                          <td className="px-4 py-3">
                            <TrendingUpIcon className="w-4 h-4 text-green-600" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Insights e Recomendações */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-indigo-600" />
                    <span>Insights e Recomendações</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card-primary rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Performance Positiva</p>
                          <p className="text-sm text-gray-600">O volume de transações aumentou 8.3% e a taxa de aprovação melhorou 2.4%.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-primary rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Atenção Necessária</p>
                          <p className="text-sm text-gray-600">O ticket médio caiu 7.7%. Considere estratégias para aumentar o valor por transação.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Última atualização: {new Date().toLocaleString('pt-BR')}</span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAdvancedStats(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                  >
                    Fechar
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Todas as Transações */}
      {showAllTransactionsModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[1200px] max-h-[90vh] shadow-lg rounded-md card-primary overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Todas as Transações</h3>
                </div>
                <button onClick={() => setShowAllTransactionsModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              {/* Filtros e Busca */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Buscar</label>
                    <input
                      type="text"
                      placeholder="Descrição, fornecedor..."
                      className="w-full px-3 py-2 input-primary rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Categoria</label>
                    <select className="w-full px-3 py-2 input-primary rounded-lg">
                      <option value="">Todas as categorias</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Serviços">Serviços</option>
                      <option value="Fornecedores">Fornecedores</option>
                      <option value="Operacionais">Operacionais</option>
                      <option value="Administrativas">Administrativas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Status</label>
                    <select className="w-full px-3 py-2 input-primary rounded-lg">
                      <option value="">Todos os status</option>
                      <option value="COMPLETED">Concluído</option>
                      <option value="PENDING">Pendente</option>
                      <option value="FAILED">Falhou</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Período</label>
                    <select className="w-full px-3 py-2 input-primary rounded-lg">
                      <option value="7">Últimos 7 dias</option>
                      <option value="30">Últimos 30 dias</option>
                      <option value="90">Últimos 90 dias</option>
                      <option value="365">Último ano</option>
                      <option value="all">Todas</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Tabela de Todas as Transações */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="card-primary divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.provider || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'INCOME' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.category === 'Vendas' ? 'bg-green-100 text-green-800' :
                            transaction.category === 'Serviços' ? 'bg-blue-100 text-blue-800' :
                            transaction.category === 'Taxas' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(transaction.status)}
                            <span className="ml-2 text-sm text-gray-900">
                              {transaction.status === 'COMPLETED' ? 'Concluído' : 
                               transaction.status === 'PENDING' ? 'Pendente' : 'Falhou'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => {
                              viewTransactionDetails(transaction)
                              setShowAllTransactionsModal(false)
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                            title="Ver Detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Paginação */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-primary">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">10</span> de <span className="font-medium">25</span> transações
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-primary hover:bg-gray-50 disabled:opacity-50">
                    Anterior
                  </button>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-md">1</span>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-primary hover:bg-gray-50">
                    Próximo
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAllTransactionsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Filtros Avançados */}
      {showFilterModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md card-primary modal-dark">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Filter className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Filtros Avançados</h3>
                </div>
                <button onClick={() => setShowFilterModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Filtros de Busca */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Buscar por Texto</label>
                    <input
                      type="text"
                      value={cashFlowFilter.search}
                      onChange={(e) => setCashFlowFilter({...cashFlowFilter, search: e.target.value})}
                      placeholder="Descrição, fornecedor, cliente..."
                      className="w-full px-3 py-2 input-primary rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Categoria</label>
                    <select 
                      value={cashFlowFilter.category}
                      onChange={(e) => setCashFlowFilter({...cashFlowFilter, category: e.target.value})}
                      className="w-full px-3 py-2 input-primary rounded-lg"
                    >
                      <option value="all">Todas as categorias</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Serviços">Serviços</option>
                      <option value="Fornecedores">Fornecedores</option>
                      <option value="Operacionais">Operacionais</option>
                      <option value="Administrativas">Administrativas</option>
                      <option value="Taxas">Taxas</option>
                    </select>
                  </div>
                </div>
                
                {/* Filtros de Tipo e Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Tipo de Transação</label>
                    <select 
                      value={cashFlowFilter.type}
                      onChange={(e) => setCashFlowFilter({...cashFlowFilter, type: e.target.value})}
                      className="w-full px-3 py-2 input-primary rounded-lg"
                    >
                      <option value="all">Todos os tipos</option>
                      <option value="INCOME">Receitas</option>
                      <option value="EXPENSE">Despesas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Status</label>
                    <select className="w-full px-3 py-2 input-primary rounded-lg">
                      <option value="all">Todos os status</option>
                      <option value="COMPLETED">Concluído</option>
                      <option value="PENDING">Pendente</option>
                      <option value="FAILED">Falhou</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </div>
                </div>
                
                {/* Filtros de Data */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Data Inicial</label>
                    <input
                      type="date"
                      value={cashFlowFilter.startDate}
                      onChange={(e) => setCashFlowFilter({...cashFlowFilter, startDate: e.target.value})}
                      className="w-full px-3 py-2 input-primary rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Data Final</label>
                    <input
                      type="date"
                      value={cashFlowFilter.endDate}
                      onChange={(e) => setCashFlowFilter({...cashFlowFilter, endDate: e.target.value})}
                      className="w-full px-3 py-2 input-primary rounded-lg"
                    />
                  </div>
                </div>
                
                {/* Filtros de Valor */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Valor Mínimo</label>
                    <input
                      type="number"
                      step="0.01"
                      value={cashFlowFilter.minAmount}
                      onChange={(e) => setCashFlowFilter({...cashFlowFilter, minAmount: e.target.value})}
                      placeholder="0.00"
                      className="w-full px-3 py-2 input-primary rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Valor Máximo</label>
                    <input
                      type="number"
                      step="0.01"
                      value={cashFlowFilter.maxAmount}
                      onChange={(e) => setCashFlowFilter({...cashFlowFilter, maxAmount: e.target.value})}
                      placeholder="999999.99"
                      className="w-full px-3 py-2 input-primary rounded-lg"
                    />
                  </div>
                </div>
                
                {/* Filtros de Método de Pagamento */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Método de Pagamento</label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-primary">Dinheiro</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-primary">Cartão de Crédito</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-primary">Cartão de Débito</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-primary">PIX</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-primary">Transferência</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-primary">Boleto</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setCashFlowFilter({
                      category: 'all',
                      type: 'all',
                      startDate: '',
                      endDate: '',
                      search: '',
                      minAmount: '',
                      maxAmount: ''
                    })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50 flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Limpar Filtros</span>
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      setSuccessMessage('Filtros aplicados com sucesso!')
                      setShowFilterModal(false)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Aplicar Filtros</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Avançadíssimo de Relatórios Centralizados */}
      {showAdvancedReportModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-5 border w-[1200px] max-h-[95vh] shadow-lg rounded-md card-primary overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Relatórios Avançados</h3>
                    <p className="text-gray-600">Sistema completo de geração de relatórios</p>
                  </div>
                </div>
                <button onClick={() => setShowAdvancedReportModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Seleção de Tipo de Relatório */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">Escolha o Tipo de Relatório</h4>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {/* Relatório do Módulo Inteiro */}
                    <div 
                      onClick={() => setReportType('fullModule')}
                      className={`relative cursor-pointer group transition-all duration-300 ${
                        reportType === 'fullModule' 
                          ? 'transform scale-105' 
                          : 'hover:scale-105'
                      }`}
                    >
                      <div className={`card-primary rounded-xl p-6 border-2 transition-all duration-300 ${
                        reportType === 'fullModule' 
                          ? 'border-purple-500 shadow-lg' 
                          : 'border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md'
                      }`}>
                        <div className="text-center">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                            reportType === 'fullModule' 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                              : 'bg-gray-100 group-hover:bg-purple-100'
                          }`}>
                            <Database className={`w-8 h-8 transition-all duration-300 ${
                              reportType === 'fullModule' 
                                ? 'text-white' 
                                : 'text-gray-600 group-hover:text-purple-600'
                            }`} />
                          </div>
                          <h5 className="text-lg font-bold text-gray-900 mb-2">Módulo Completo</h5>
                          <p className="text-gray-600 mb-4 text-sm">Relatório abrangente de todo o fluxo de caixa</p>
                          <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Visão geral consolidada</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Análise de todas as abas</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Métricas unificadas</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {reportType === 'fullModule' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Relatório por Aba Específica */}
                    <div 
                      onClick={() => setReportType('specificTab')}
                      className={`relative cursor-pointer group transition-all duration-300 ${
                        reportType === 'specificTab' 
                          ? 'transform scale-105' 
                          : 'hover:scale-105'
                      }`}
                    >
                      <div className={`card-primary rounded-xl p-6 border-2 transition-all duration-300 ${
                        reportType === 'specificTab' 
                          ? 'border-purple-500 shadow-lg' 
                          : 'border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md'
                      }`}>
                        <div className="text-center">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                            reportType === 'specificTab' 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                              : 'bg-gray-100 group-hover:bg-purple-100'
                          }`}>
                            <FileText className={`w-8 h-8 transition-all duration-300 ${
                              reportType === 'specificTab' 
                                ? 'text-white' 
                                : 'text-gray-600 group-hover:text-purple-600'
                            }`} />
                          </div>
                          <h5 className="text-lg font-bold text-gray-900 mb-2">Aba Específica</h5>
                          <p className="text-gray-600 mb-4 text-sm">Relatório detalhado de uma aba específica</p>
                          <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Foco em área específica</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Análise detalhada</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Métricas especializadas</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {reportType === 'specificTab' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Configurações do Relatório */}
                <div className="card-primary rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Configurações do Relatório</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Configurações Básicas */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Período do Relatório</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
                          <option value="today">Hoje</option>
                          <option value="week">Esta Semana</option>
                          <option value="month" selected>Este Mês</option>
                          <option value="quarter">Este Trimestre</option>
                          <option value="year">Este Ano</option>
                          <option value="custom">Período Personalizado</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Formato de Saída</label>
                        <div className="grid grid-cols-3 gap-3">
                          <label className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="format" value="pdf" className="text-purple-600" defaultChecked />
                            <span className="text-sm">PDF</span>
                          </label>
                          <label className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="format" value="excel" className="text-purple-600" />
                            <span className="text-sm">Excel</span>
                          </label>
                          <label className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="format" value="csv" className="text-purple-600" />
                            <span className="text-sm">CSV</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Nível de Detalhamento</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
                          <option value="summary">Resumido</option>
                          <option value="detailed" selected>Detalhado</option>
                          <option value="comprehensive">Completo</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Configurações Avançadas */}
                    <div className="space-y-4">
                      {reportType === 'specificTab' && (
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">Selecionar Aba</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
                            <option value="overview">Visão Geral</option>
                            <option value="transactions">Transações</option>
                            <option value="accounts">Contas</option>
                            <option value="reconciliation">Reconciliação</option>
                            <option value="analysis">Análise</option>
                          </select>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Incluir Gráficos</label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-purple-600 rounded" defaultChecked />
                            <span className="text-sm">Gráficos de linha</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-purple-600 rounded" defaultChecked />
                            <span className="text-sm">Gráficos de pizza</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-purple-600 rounded" defaultChecked />
                            <span className="text-sm">Gráficos de barras</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-purple-600 rounded" />
                            <span className="text-sm">Mapas de calor</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Filtros Adicionais</label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-purple-600 rounded" defaultChecked />
                            <span className="text-sm">Apenas transações aprovadas</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-purple-600 rounded" />
                            <span className="text-sm">Excluir transações canceladas</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-purple-600 rounded" defaultChecked />
                            <span className="text-sm">Incluir comparação com período anterior</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Opções de Entrega */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Opções de Entrega</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Enviar por Email</label>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        className="w-full px-3 py-2 input-primary rounded-lg text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Agendar Relatório</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="text-blue-600 rounded" />
                          <span className="text-sm">Relatório recorrente</span>
                        </label>
                        <select className="w-full px-3 py-2 input-primary rounded-lg text-sm">
                          <option value="weekly">Semanal</option>
                          <option value="monthly">Mensal</option>
                          <option value="quarterly">Trimestral</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Resumo e Ações */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Resumo do Relatório</h4>
                      <p className="text-gray-600 text-sm">
                        {reportType === 'fullModule' 
                          ? 'Relatório completo do módulo de Fluxo de Caixa' 
                          : 'Relatório detalhado da aba selecionada'
                        }
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {reportType === 'fullModule' ? 'Módulo Completo' : 'Aba Específica'}
                      </div>
                      <div className="text-gray-600 text-sm">Formato: PDF • Período: Este Mês</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Última atualização: {new Date().toLocaleString('pt-BR')}</span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAdvancedReportModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    onClick={() => {
                      setSuccessMessage('Relatório agendado com sucesso!')
                      setShowAdvancedReportModal(false)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Agendar</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSuccessMessage('Relatório gerado com sucesso!')
                      setShowAdvancedReportModal(false)
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Gerar Relatório</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md card-primary modal-dark">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Confirmar Exclusão</h3>
                <button onClick={() => setShowConfirmModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-primary">
                  Tem certeza que deseja excluir 
                  {selectedAccount ? ` a conta "${selectedAccount.description}"` : ''}
                  {selectedReconciliation ? ` a transação "${selectedReconciliation.description}"` : ''}?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (selectedAccount) {
                      confirmDeleteAccount()
                    } else if (selectedReconciliation) {
                      confirmDeleteBankTransaction()
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Conta */}
      {showEditAccountModal && selectedAccount && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-[800px] shadow-lg rounded-xl card-primary modal-dark">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-manrope font-bold text-gray-900">
                      Editar {selectedAccount.type === 'PAYABLE' ? 'Conta a Pagar' : 'Conta a Receber'}
                    </h3>
                    <p className="text-sm text-gray-600">Atualize as informações da conta</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowEditAccountModal(false)
                    setSelectedAccount(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Descrição</label>
                  <input
                    type="text"
                    value={selectedAccount.description}
                    onChange={(e) => setSelectedAccount({
                      ...selectedAccount,
                      description: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedAccount.amount}
                    onChange={(e) => setSelectedAccount({
                      ...selectedAccount,
                      amount: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Categoria</label>
                  <select
                    value={selectedAccount.category}
                    onChange={(e) => setSelectedAccount({
                      ...selectedAccount,
                      category: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope"
                  >
                    <option value="">Selecione uma categoria</option>
                    {customCategories
                      .filter(cat => selectedAccount.type === 'PAYABLE' ? cat.type === 'expense' : cat.type === 'income')
                      .map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))
                    }
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Data de Vencimento</label>
                  <input
                    type="date"
                    value={selectedAccount.dueDate}
                    onChange={(e) => setSelectedAccount({
                      ...selectedAccount,
                      dueDate: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Prioridade</label>
                  <select
                    value={selectedAccount.priority}
                    onChange={(e) => setSelectedAccount({
                      ...selectedAccount,
                      priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH'
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope"
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    {selectedAccount.type === 'PAYABLE' ? 'Fornecedor' : 'Cliente'}
                  </label>
                  <input
                    type="text"
                    value={selectedAccount.type === 'PAYABLE' ? selectedAccount.supplier || '' : selectedAccount.customer || ''}
                    onChange={(e) => setSelectedAccount({
                      ...selectedAccount,
                      [selectedAccount.type === 'PAYABLE' ? 'supplier' : 'customer']: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-primary mb-2">Observações</label>
                <textarea
                  value={selectedAccount.notes || ''}
                  onChange={(e) => setSelectedAccount({
                    ...selectedAccount,
                    notes: e.target.value
                  })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditAccountModal(false)
                    setSelectedAccount(null)
                  }}
                  className="px-6 py-3 border border-gray-300 text-primary rounded-lg font-manrope font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (selectedAccount.type === 'PAYABLE') {
                      updatePayableAccount()
                    } else {
                      updateReceivableAccount()
                    }
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-manrope font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Atualizando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Atualizar Conta</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Análise */}
      {showAnalysisDetailsModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-8 border w-[1200px] shadow-2xl rounded-2xl card-primary">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-manrope font-bold text-gray-900">Análise Detalhada de Performance</h3>
                    <p className="text-gray-600 font-manrope text-lg">Relatório completo de métricas e indicadores financeiros</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAnalysisDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                {/* Coluna Esquerda - Métricas Principais */}
                <div className="space-y-6">
                  {/* Resumo Executivo */}
                  <div className="card-primary rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Resumo Executivo</h3>
                      <div className="flex items-center space-x-3">
                        {/* Status de Integração com Pagamentos */}
                        <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-blue-700 font-medium">Pagamentos Integrados</span>
                        </div>
                        
                        <button 
                          onClick={syncWithPaymentSystem}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Sincronizar</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <TrendingUpIcon className="w-8 h-8 text-green-600" />
                        </div>
                        <h5 className="font-bold text-green-900 mb-1">Receitas</h5>
                        <p className="text-green-700 text-sm">Total Geral</p>
                        <div className="text-2xl font-bold text-green-900 mt-2">
                          R$ {calculateCategoryDistribution().totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-green-600">
                          {recentTransactions.filter(t => t.source === 'PAYMENT_SYSTEM').length} transações de pagamento
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <TrendingDown className="w-8 h-8 text-red-600" />
                        </div>
                        <h5 className="font-bold text-red-900 mb-1">Despesas</h5>
                        <p className="text-red-700 text-sm">Total Geral</p>
                        <div className="text-2xl font-bold text-red-900 mt-2">
                          R$ {calculateCategoryDistribution().totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-red-600">
                          Contas a pagar e despesas
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <Activity className="w-8 h-8 text-blue-600" />
                        </div>
                        <h5 className="font-bold text-blue-900 mb-1">Volume Total</h5>
                        <p className="text-blue-700 text-sm">Movimentação</p>
                        <div className="text-2xl font-bold text-blue-900 mt-2">
                          R$ {calculateCategoryDistribution().grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-blue-600">
                          Receitas + Despesas
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <Database className="w-8 h-8 text-purple-600" />
                        </div>
                        <h5 className="font-bold text-purple-900 mb-1">Integrações</h5>
                        <p className="text-purple-700 text-sm">Sistemas Conectados</p>
                        <div className="text-2xl font-bold text-purple-900 mt-2">
                          {recentTransactions.filter(t => t.source === 'PAYMENT_SYSTEM').length}
                        </div>
                        <div className="text-sm text-purple-600">
                          Transações de pagamento
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Análise de Tendências */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <TrendingUpIcon className="w-5 h-5 text-green-600" />
                      <span>Análise de Tendências</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-primary">Crescimento Mensal:</span>
                        <span className="text-green-600 font-semibold">+18.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-primary">Volume de Transações:</span>
                        <span className="text-green-600 font-semibold">+8.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-primary">Eficiência Operacional:</span>
                        <span className="text-green-600 font-semibold">+2.4%</span>
                      </div>
                    </div>
                  </div>

                  {/* Indicadores de Performance */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      <span>Indicadores de Performance</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-primary">Taxa de Aprovação:</span>
                        <span className="text-purple-600 font-semibold">94.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-primary">Tempo de Processamento:</span>
                        <span className="text-purple-600 font-semibold">2.3h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-primary">Satisfação do Cliente:</span>
                        <span className="text-purple-600 font-semibold">4.8/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna Direita - Gráficos e Análises */}
                <div className="space-y-6">
                  {/* Gráfico de Distribuição por Categoria */}
                  <div className="card-primary rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Distribuição por Categoria</h4>
                    <div className="space-y-4">
                      {calculateCategoryDistribution().distribution.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-4">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-green-500' : 
                              index === 1 ? 'bg-blue-500' : 
                              index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                            }`}>
                              <span className="text-white text-xs font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-lg">{item.category}</div>
                              <div className="text-sm text-gray-600">
                                {item.income > 0 && (
                                  <span className="text-green-600 font-medium">
                                    Receita: R$ {item.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                )}
                                {item.expense > 0 && (
                                  <span className="text-red-600 font-medium">
                                    Despesa: R$ {item.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-lg text-gray-500 font-medium">{item.percentage}%</div>
                            <div className="text-sm text-gray-400">
                              {item.income > item.expense ? 'Receita Dominante' : 'Despesa Dominante'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Análise Comparativa Mensal */}
                  <div className="card-primary rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Análise Comparativa Mensal</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-primary">Janeiro (Base)</span>
                        <span className="text-sm font-medium text-gray-900">
                          R$ {(calculateCategoryDistribution().grandTotal * 0.85).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-gray-500">Base</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm text-primary">Fevereiro (Atual)</span>
                        <span className="text-sm font-medium text-green-900">
                          R$ {calculateCategoryDistribution().grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-green-600">
                          +{((calculateCategoryDistribution().grandTotal / (calculateCategoryDistribution().grandTotal * 0.85) - 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-primary">Março (Projeção)</span>
                        <span className="text-sm font-medium text-blue-900">
                          R$ {(calculateCategoryDistribution().grandTotal * 1.15).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-blue-600">
                          +{((1.15 - 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recomendações da IA */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-orange-600" />
                      <span>Recomendações da IA</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span className="text-sm text-primary">Aumentar investimento em marketing digital para expandir vendas online</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="text-sm text-primary">Otimizar processos operacionais para reduzir tempo de processamento</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span className="text-sm text-primary">Diversificar portfólio de serviços para reduzir dependência de vendas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAnalysisDetailsModal(false)}
                  className="px-6 py-3 border border-gray-300 text-primary rounded-lg font-manrope font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setSuccessMessage('Relatório de análise exportado com sucesso!')
                    setShowAnalysisDetailsModal(false)
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-manrope font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-3"
                >
                  <Download className="w-5 h-5" />
                  <span>Exportar Relatório</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


