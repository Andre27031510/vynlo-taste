'use client'

import { useState, useEffect } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext'
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Filter,
  Settings,
  Wifi,
  Smartphone,
  Monitor,
  Zap,
  RefreshCw,
  Clock,
  Save,
  WifiOff,
  Database,
  Cloud,
  Smartphone as Mobile,
  Monitor as Desktop,
  Globe,
  Check,
  X,
  AlertTriangle,
  Eye,
  BarChart3,
  FileText,
  Bell,
  Calculator,
  RotateCcw,
  Activity,
  Search,
  Info,
  Download,
  ArrowDown,
  Mail,
  Send,
  ArrowRight,
  Loader2,
  Brain
} from 'lucide-react'

// Interface para transações financeiras
interface FinancialTransaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  category: string
}

export default function PaymentManagement() {
  const { currentTheme } = useThemeContext()
  // Estado para transações de pagamento (integrado com fluxo de caixa)
  const [paymentTransactions, setPaymentTransactions] = useState<FinancialTransaction[]>([])

  // Estado para sincronização com fluxo de caixa
  const [cashFlowSync, setCashFlowSync] = useState({
    lastSync: new Date(),
    status: 'synced',
    pendingTransactions: 0,
    totalSynced: 0
  })

  // Estados para seções colapsáveis
  const [showIntegrationDetails, setShowIntegrationDetails] = useState(false)
  const [showRecentTransactions, setShowRecentTransactions] = useState(false)
  const [showSmartAlerts, setShowSmartAlerts] = useState(false)
  const [showCashFlowIntegration, setShowCashFlowIntegration] = useState(false)

  // Estados para seções colapsáveis da aba de relatórios
  const [showReportFilters, setShowReportFilters] = useState(true)
  const [showMainMetrics, setShowMainMetrics] = useState(true)
  const [showVolumeChart, setShowVolumeChart] = useState(true)
  const [showProviderAnalysis, setShowProviderAnalysis] = useState(true)
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(true)
  const [showTrendsForecasts, setShowTrendsForecasts] = useState(true)
  const [showSpecializedReports, setShowSpecializedReports] = useState(true)

  // Estados para funcionalidades dos relatórios
  const [reportPeriod, setReportPeriod] = useState('30')
  const [reportStartDate, setReportStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [reportEndDate, setReportEndDate] = useState(new Date().toISOString().split('T')[0])
  const [reportProvider, setReportProvider] = useState('all')
  const [reportStatus, setReportStatus] = useState('all')
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  // Estados para detalhes dos provedores
  const [showProviderDetails, setShowProviderDetails] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [providerDetails, setProviderDetails] = useState<any>(null)

  // Estados para menu de geração de relatórios
  const [showGenerateMenu, setShowGenerateMenu] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailRecipient, setEmailRecipient] = useState('')

  // Estados para seções colapsáveis da aba de taxas
  const [showFeesSummary, setShowFeesSummary] = useState(true)
  const [showProviderFees, setShowProviderFees] = useState(true)
  const [showFeesCalculator, setShowFeesCalculator] = useState(true)
  const [showFeesHistory, setShowFeesHistory] = useState(true)
  const [showFeesReports, setShowFeesReports] = useState(true)

  // Estados para funcionalidades da aba de taxas
  const [feesCalculatorData, setFeesCalculatorData] = useState({
    transactionValue: '',
    selectedProvider: '',
    transactionType: '',
    installments: '1',
    calculatedResult: {
      originalValue: 0,
      appliedRate: 0,
      feeAmount: 0,
      finalValue: 0
    }
  })
  const [isCalculating, setIsCalculating] = useState(false)
  const [isGeneratingFeesReport, setIsGeneratingFeesReport] = useState(false)
  const [showFeesModal, setShowFeesModal] = useState(false)
  const [editingProvider, setEditingProvider] = useState('')
  const [editingFees, setEditingFees] = useState({
    creditVista: '',
    creditParcelado: '',
    debit: '',
    pix: ''
  })

  // Estados para fluxo automático de pagamentos
  const [webhookLogs, setWebhookLogs] = useState<Array<{
    id: string
    timestamp: Date
    provider: string
    status: 'success' | 'error' | 'pending'
    message: string
    orderId?: string
    amount?: number
    customerName?: string
  }>>([])
  const [autoProcessing, setAutoProcessing] = useState(true)
  const [processingStats, setProcessingStats] = useState({
    totalReceived: 0,
    totalProcessed: 0,
    totalErrors: 0,
    lastProcessing: new Date()
  })

  // Estados para integração com máquinas de cartão
  const [integrationStatus, setIntegrationStatus] = useState({
    stone: { connected: false, lastSync: null, status: 'disconnected' },
    cielo: { connected: false, lastSync: null, status: 'disconnected' },
    rede: { connected: false, lastSync: null, status: 'disconnected' },
    pagseguro: { connected: false, lastSync: null, status: 'disconnected' },
    sicred: { connected: false, lastSync: null, status: 'disconnected' },
    pix: { connected: false, lastSync: null, status: 'disconnected' },
    cloud: { connected: false, lastSync: null, status: 'disconnected' }
  })
  const [webhookUrl, setWebhookUrl] = useState('https://vynlotaste.com/webhooks/payment')
  const [autoSync, setAutoSync] = useState(true)
  const [syncInterval, setSyncInterval] = useState(30)
  const [activeTab, setActiveTab] = useState('overview')

  // Estados para gestão de estornos
  const [showRefundRequests, setShowRefundRequests] = useState(false)
  const [showRefundSettings, setShowRefundSettings] = useState(false)
  const [refundSettings, setRefundSettings] = useState({
    policyDays: '30',
    minAmount: '10.00',
    autoApprove: false
  })
  const [refundRequests, setRefundRequests] = useState([])

  // Estados para auditoria com IA preditiva
  const [showAIRiskAnalysis, setShowAIRiskAnalysis] = useState(false)
  const [aiSettings, setAiSettings] = useState({
    sensitivity: 'medium',
    analysisPeriod: '7d',
    autoLearning: true,
    realTimeAlerts: true
  })
  const [aiAnalysisResults, setAiAnalysisResults] = useState({
    securityScore: 0,
    secureTransactions: 0,
    totalTransactions: 0,
    fraudDetected: 0
  })
  const [isRunningAI, setIsRunningAI] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [showAuditReports, setShowAuditReports] = useState(false)
  const [isGeneratingComplianceReport, setIsGeneratingComplianceReport] = useState(false)
  const [isGeneratingFraudReport, setIsGeneratingFraudReport] = useState(false)
  const [isGeneratingPerformanceReport, setIsGeneratingPerformanceReport] = useState(false)

  // Simular webhook de pagamento
  const simulatePaymentWebhook = () => {
    const providers = ['Stone', 'Cielo', 'PIX', 'PagSeguro']
    const statuses = ['success', 'error', 'pending']
    const customers = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Paula']
    
    const provider = providers[Math.floor(Math.random() * providers.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const amount = Math.random() * 500 + 50 // Entre R$ 50 e R$ 550
    const orderId = `ORD${Date.now()}`
    
    const newWebhookLog = {
      id: `webhook_${Date.now()}`,
      timestamp: new Date(),
      provider,
      status: status as 'success' | 'error' | 'pending',
      message: status === 'success' ? 'Pagamento aprovado' : 
               status === 'pending' ? 'Aguardando confirmação' : 'Falha no processamento',
      orderId,
      amount,
      customerName: customer
    }
    
    setWebhookLogs(prev => [newWebhookLog, ...prev.slice(0, 9)]) // Manter apenas os 10 mais recentes
    
    // Atualizar estatísticas
    setProcessingStats(prev => ({
      ...prev,
      totalReceived: prev.totalReceived + 1,
      totalProcessed: status === 'success' ? prev.totalProcessed + 1 : prev.totalProcessed,
      totalErrors: status === 'error' ? prev.totalErrors + 1 : prev.totalErrors,
      lastProcessing: new Date()
    }))
    
    // Se o pagamento foi aprovado, processar automaticamente
    if (status === 'success') {
      processSuccessfulPayment(newWebhookLog)
    }
  }

  // Simular recebimento de webhooks de pagamento
  useEffect(() => {
    if (!autoProcessing) return

    const webhookInterval = setInterval(() => {
      // Simular recebimento de webhook de pagamento
      simulatePaymentWebhook()
    }, 10000) // A cada 10 segundos

    return () => clearInterval(webhookInterval)
  }, [autoProcessing])

  // Fechar menu de geração quando clicar fora ou pressionar ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showGenerateMenu && !target.closest('.generate-menu-container')) {
        setShowGenerateMenu(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showGenerateMenu) {
        setShowGenerateMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showGenerateMenu])

  // Carregar webhooks reais da API
  const loadWebhooks = async () => {
    try {
      // TODO: Implementar chamada para API real
      // const response = await fetch('/api/webhooks');
      // const data = await response.json();
      // setWebhookLogs(data);
      console.log('Carregando webhooks da API...');
    } catch (error) {
      console.error('Erro ao carregar webhooks:', error);
    }
  }

  // Processar pagamento aprovado automaticamente
  const processSuccessfulPayment = async (webhookLog: any) => {
    try {
      // Simular processamento automático
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Criar transação de pagamento
      const newTransaction: FinancialTransaction = {
        id: `payment-${Date.now()}`,
        type: 'income',
        amount: webhookLog.amount!,
        description: `Pedido ${webhookLog.orderId} - ${webhookLog.customerName}`,
        category: 'Vendas',
        date: new Date().toISOString().split('T')[0]
      }

      // Adicionar à lista de transações
      setPaymentTransactions(prev => [newTransaction, ...prev])
      
      // Atualizar sincronização com fluxo de caixa
      setCashFlowSync(prev => ({
        ...prev,
        totalSynced: prev.totalSynced + 1,
        pendingTransactions: Math.max(0, prev.pendingTransactions - 1),
        lastSync: new Date()
      }))

      // Log de sucesso
      console.log(`Pagamento processado automaticamente: ${webhookLog.orderId}`)
      
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
    }
  }

  // Função para sincronizar transações com fluxo de caixa
  const syncWithCashFlow = () => {
    setCashFlowSync(prev => ({ ...prev, status: 'syncing' }))
    
    // Simular sincronização
    setTimeout(() => {
      const completedTransactions = paymentTransactions
      setCashFlowSync({
        lastSync: new Date(),
        status: 'synced',
        pendingTransactions: 0,
        totalSynced: completedTransactions.length
      })
      
      // Em um sistema real, aqui enviaríamos os dados para o fluxo de caixa
      console.log('Sincronizando com fluxo de caixa:', completedTransactions)
    }, 2000)
  }

  // Funções para funcionalidades dos relatórios
  const generateReport = async () => {
    setIsGeneratingReport(true)
    
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simular dados do relatório
      const mockReportData = {
        period: reportPeriod,
        startDate: reportStartDate,
        endDate: reportEndDate,
        provider: reportProvider,
        status: reportStatus,
        totalVolume: 45890.50,
        totalTransactions: 680,
        approvalRate: 98.7,
        averageTicket: 67.45,
        growthRate: 12.5,
        generatedAt: new Date()
      }
      
      setReportData(mockReportData)
      
      // Em um sistema real, aqui faríamos a chamada para a API
      console.log('Relatório gerado:', mockReportData)
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const exportReportPDF = () => {
    // Simular exportação de PDF
    console.log('Exportando relatório para PDF...')
    
    // Em um sistema real, aqui faríamos o download do PDF
    const link = document.createElement('a')
    link.href = '#'
    link.download = `relatorio-pagamentos-${new Date().toISOString().split('T')[0]}.pdf`
    link.click()
  }

  const generateExecutiveReport = () => {
    // Simular geração de relatório executivo
    console.log('Gerando relatório executivo...')
    
    // Em um sistema real, aqui faríamos a chamada para a API
    setTimeout(() => {
      console.log('Relatório executivo gerado com sucesso!')
    }, 2000)
  }

  const updateReportPeriod = (period: string) => {
    setReportPeriod(period)
    
    // Atualizar datas automaticamente baseado no período
    const today = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '7':
        startDate.setDate(today.getDate() - 7)
        break
      case '30':
        startDate.setDate(today.getDate() - 30)
        break
      case '90':
        startDate.setDate(today.getDate() - 90)
        break
      case '365':
        startDate.setDate(today.getDate() - 365)
        break
      default:
        startDate.setDate(today.getDate() - 30)
    }
    
    setReportStartDate(startDate.toISOString().split('T')[0])
    setReportEndDate(today.toISOString().split('T')[0])
    
    // Gerar relatório automaticamente
    generateReport()
  }

  const refreshReportData = () => {
    generateReport()
  }

  // Função para mostrar detalhes do provedor
  const showProviderDetailedAnalysis = (provider: string) => {
    setSelectedProvider(provider)
    
    // Simular dados detalhados do provedor
    const mockProviderDetails = {
      name: provider,
      totalVolume: provider === 'Stone' ? 19245.30 : provider === 'Cielo' ? 15680.20 : provider === 'PIX' ? 8965.00 : 2000.00,
      totalTransactions: provider === 'Stone' ? 285 : provider === 'Cielo' ? 232 : provider === 'PIX' ? 133 : 30,
      approvalRate: provider === 'Stone' ? 99.2 : provider === 'Cielo' ? 98.7 : provider === 'PIX' ? 97.5 : 95.0,
      averageTicket: provider === 'Stone' ? 67.53 : provider === 'Cielo' ? 67.59 : provider === 'PIX' ? 67.41 : 66.67,
      processingTime: provider === 'Stone' ? 1.8 : provider === 'Cielo' ? 2.1 : provider === 'PIX' ? 0.5 : 3.2,
      errorRate: provider === 'Stone' ? 0.8 : provider === 'Cielo' ? 1.3 : provider === 'PIX' ? 2.5 : 5.0,
      lastSync: new Date(),
      status: provider === 'Stone' ? 'connected' : provider === 'Cielo' ? 'connected' : provider === 'PIX' ? 'connected' : 'disconnected',
      monthlyGrowth: provider === 'Stone' ? 15.2 : provider === 'Cielo' ? 12.8 : provider === 'PIX' ? 25.3 : 8.1,
      topCategories: provider === 'Stone' ? ['Vendas Online', 'Serviços', 'Produtos'] : 
                     provider === 'Cielo' ? ['Restaurantes', 'Varejo', 'Serviços'] :
                     provider === 'PIX' ? ['Transferências', 'Pagamentos', 'Serviços'] : ['Outros'],
      recentTransactions: [
        { id: '1', amount: 45.90, status: 'completed', date: new Date(), customer: 'Cliente A' },
        { id: '2', amount: 67.80, status: 'completed', date: new Date(), customer: 'Cliente B' },
        { id: '3', amount: 32.50, status: 'pending', date: new Date(), customer: 'Cliente C' }
      ]
    }
    
    setProviderDetails(mockProviderDetails)
    setShowProviderDetails(true)
  }

  // Função para enviar relatório por email
  const sendReportByEmail = async (email: string) => {
    if (!email || !email.includes('@')) {
      alert('Por favor, insira um email válido')
      return
    }

    setIsSendingEmail(true)
    
    try {
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Em um sistema real, aqui faríamos a chamada para a API de email
      console.log(`Relatório enviado para: ${email}`)
      
      // Fechar menu e mostrar sucesso
      setShowGenerateMenu(false)
      setEmailRecipient('')
      alert(`Relatório enviado com sucesso para ${email}`)
      
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      alert('Erro ao enviar email. Tente novamente.')
    } finally {
      setIsSendingEmail(false)
    }
  }

  // Função para baixar todos os relatórios em PDF
  const downloadAllReportsPDF = async () => {
    try {
      // Simular geração de PDF
      console.log('Gerando PDF com todos os relatórios...')
      
      // Em um sistema real, aqui faríamos a chamada para a API de geração de PDF
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular download
      const link = document.createElement('a')
      link.href = '#'
      link.download = `relatorios-completos-${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
      
      // Fechar menu
      setShowGenerateMenu(false)
      
      console.log('PDF baixado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    }
  }

  // Funções para funcionalidades da aba de taxas
  const calculateFees = async () => {
    if (!feesCalculatorData.transactionValue || !feesCalculatorData.selectedProvider || !feesCalculatorData.transactionType) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsCalculating(true)
    
    try {
      // Simular cálculo de taxas
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const value = parseFloat(feesCalculatorData.transactionValue)
      let rate = 0
      
      // Definir taxas baseadas no provedor e tipo
      switch (feesCalculatorData.selectedProvider) {
        case 'Stone':
          if (feesCalculatorData.transactionType === 'Crédito à Vista') rate = 2.39
          else if (feesCalculatorData.transactionType === 'Crédito Parcelado') rate = 2.89
          else if (feesCalculatorData.transactionType === 'Débito') rate = 1.99
          break
        case 'Cielo':
          if (feesCalculatorData.transactionType === 'Crédito à Vista') rate = 2.49
          else if (feesCalculatorData.transactionType === 'Crédito Parcelado') rate = 2.99
          else if (feesCalculatorData.transactionType === 'Débito') rate = 2.09
          break
        case 'PIX':
          if (feesCalculatorData.transactionType === 'PIX') rate = 0.99
          break
        case 'PagSeguro':
          if (feesCalculatorData.transactionType === 'Cartão de Crédito') rate = 3.99
          else if (feesCalculatorData.transactionType === 'Boleto') rate = 3.49
          else if (feesCalculatorData.transactionType === 'PIX') rate = 1.99
          break
        default:
          rate = 2.5
      }
      
      const feeAmount = (value * rate) / 100
      const finalValue = value + feeAmount
      
      setFeesCalculatorData(prev => ({
        ...prev,
        calculatedResult: {
          originalValue: value,
          appliedRate: rate,
          feeAmount: feeAmount,
          finalValue: finalValue
        }
      }))
      
      console.log('Taxas calculadas:', { value, rate, feeAmount, finalValue })
      
    } catch (error) {
      console.error('Erro ao calcular taxas:', error)
      alert('Erro ao calcular taxas. Tente novamente.')
    } finally {
      setIsCalculating(false)
    }
  }

  const openFeesCalculator = () => {
    setShowFeesCalculator(true)
    console.log('Calculadora de taxas aberta')
  }

  const exportFeesConfig = () => {
    // Simular exportação de configurações
    console.log('Exportando configurações de taxas...')
    
    const configData = {
      providers: ['Stone', 'Cielo', 'PIX', 'PagSeguro'],
      lastUpdate: new Date().toISOString(),
      totalProviders: 4,
      averageRate: 2.89
    }
    
    // Em um sistema real, aqui faríamos o download do arquivo
    const link = document.createElement('a')
    link.href = '#'
    link.download = `configuracoes-taxas-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    console.log('Configurações exportadas:', configData)
  }

  const editProviderFees = (provider: string) => {
    setEditingProvider(provider)
    
    // Preencher dados atuais do provedor
    let currentFees = { creditVista: '', creditParcelado: '', debit: '', pix: '' }
    
    switch (provider) {
      case 'Stone':
        currentFees = { creditVista: '2.39', creditParcelado: '2.89', debit: '1.99', pix: '0.99' }
        break
      case 'Cielo':
        currentFees = { creditVista: '2.49', creditParcelado: '2.99', debit: '2.09', pix: '1.29' }
        break
      case 'PIX':
        currentFees = { creditVista: '0.99', creditParcelado: '1.29', debit: '0.79', pix: '0.99' }
        break
      case 'PagSeguro':
        currentFees = { creditVista: '3.99', creditParcelado: '4.49', debit: '3.49', pix: '1.99' }
        break
    }
    
    setEditingFees(currentFees)
    setShowFeesModal(true)
  }

  const saveProviderFees = async () => {
    if (!editingProvider) return
    
    try {
      // Simular salvamento das taxas
      console.log(`Salvando taxas para ${editingProvider}:`, editingFees)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Em um sistema real, aqui faríamos a chamada para a API
      alert(`Taxas de ${editingProvider} atualizadas com sucesso!`)
      
      setShowFeesModal(false)
      setEditingProvider('')
      setEditingFees({ creditVista: '', creditParcelado: '', debit: '', pix: '' })
      
    } catch (error) {
      console.error('Erro ao salvar taxas:', error)
      alert('Erro ao salvar taxas. Tente novamente.')
    }
  }

  const generateFeesReport = async () => {
    setIsGeneratingFeesReport(true)
    
    try {
      // Simular geração de relatório
      console.log('Gerando relatório de taxas...')
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Em um sistema real, aqui faríamos a chamada para a API
      const reportData = {
        generatedAt: new Date().toISOString(),
        totalProviders: 4,
        averageRate: 2.89,
        totalMonthlyFees: 1324.50,
        savings: 234.80
      }
      
      console.log('Relatório de taxas gerado:', reportData)
      alert('Relatório de taxas gerado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      alert('Erro ao gerar relatório. Tente novamente.')
    } finally {
      setIsGeneratingFeesReport(false)
    }
  }

  const compareProviders = () => {
    // Simular comparação de provedores
    console.log('Comparando provedores...')
    
    const comparisonData = {
      stone: { rate: 2.39, status: 'Melhor' },
      cielo: { rate: 2.49, status: 'Bom' },
      pix: { rate: 0.99, status: 'Excelente' },
      pagseguro: { rate: 3.99, status: 'Alto' }
    }
    
    console.log('Comparação de provedores:', comparisonData)
    alert('Comparação de provedores disponível no console')
  }

  const viewAllHistory = () => {
    // Simular visualização de todo o histórico
    console.log('Visualizando todo o histórico de alterações...')
    
    const fullHistory = [
      { date: '2024-01-15', provider: 'Stone', change: '2.49% → 2.39%', user: 'Admin' },
      { date: '2024-01-10', provider: 'PIX', change: 'Nova taxa 1.29%', user: 'Sistema' },
      { date: '2024-01-05', provider: 'Cielo', change: '2.59% → 2.49%', user: 'Financeiro' }
    ]
    
    console.log('Histórico completo:', fullHistory)
    alert('Histórico completo disponível no console')
  }



  // Funções para Estornos
  const createRefundRequest = async () => {
    try {
      // Simula criação de solicitação de estorno
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Solicitação de estorno criada com sucesso!')
    } catch (error) {
      alert('Erro ao criar solicitação de estorno')
    }
  }

  const viewRefundDetails = async (refundId: string) => {
    try {
      // Simula busca de detalhes do estorno
      await new Promise(resolve => setTimeout(resolve, 800))
      alert(`Detalhes do estorno ${refundId} carregados!`)
    } catch (error) {
      alert('Erro ao carregar detalhes do estorno')
    }
  }

  const approveRefund = async (refundId: string) => {
    try {
      setIsGeneratingFeesReport(true)
      // Simula aprovação do estorno
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert(`Estorno ${refundId} aprovado com sucesso!`)
    } catch (error) {
      alert('Erro ao aprovar estorno')
    } finally {
      setIsGeneratingFeesReport(false)
    }
  }

  const rejectRefund = async (refundId: string) => {
    try {
      // Simula rejeição do estorno
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`Estorno ${refundId} rejeitado!`)
    } catch (error) {
      alert('Erro ao rejeitar estorno')
    }
  }

  const requestMoreInfo = async (refundId: string) => {
    try {
      // Simula solicitação de informações adicionais
      await new Promise(resolve => setTimeout(resolve, 800))
      alert(`Solicitação de informações enviada para ${refundId}!`)
    } catch (error) {
      alert('Erro ao solicitar informações')
    }
  }

  const saveRefundSettings = async () => {
    try {
      // Simula salvamento das configurações
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Configurações de estorno salvas com sucesso!')
    } catch (error) {
      alert('Erro ao salvar configurações')
    }
  }

  // Funções para Auditoria com IA
  const runAIAnalysis = async () => {
    try {
      setIsRunningAI(true)
      // Simula execução da análise de IA
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simula resultados da IA
      setAiAnalysisResults({
        securityScore: 87,
        secureTransactions: 1180,
        totalTransactions: 1247,
        fraudDetected: 3
      })
      
      alert('Análise de IA concluída! Score de segurança: 87/100')
    } catch (error) {
      alert('Erro ao executar análise de IA')
    } finally {
      setIsRunningAI(false)
    }
  }

  const saveAISettings = async () => {
    try {
      // Simula salvamento das configurações da IA
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Configurações da IA salvas com sucesso!')
    } catch (error) {
      alert('Erro ao salvar configurações da IA')
    }
  }

  const viewAlertDetails = async (alertId: string) => {
    try {
      // Simula visualização de detalhes do alerta
      await new Promise(resolve => setTimeout(resolve, 800))
      alert(`Detalhes do alerta ${alertId} carregados!`)
    } catch (error) {
      alert('Erro ao carregar detalhes do alerta')
    }
  }

  const blockTransaction = async (transactionId: string) => {
    try {
      // Simula bloqueio de transação
      await new Promise(resolve => setTimeout(resolve, 1200))
      alert(`Transação ${transactionId} bloqueada com sucesso!`)
    } catch (error) {
      alert('Erro ao bloquear transação')
    }
  }

  const markAsFalsePositive = async (alertId: string) => {
    try {
      // Simula marcação como falso positivo
      await new Promise(resolve => setTimeout(resolve, 800))
      alert(`Alerta ${alertId} marcado como falso positivo!`)
    } catch (error) {
      alert('Erro ao marcar alerta')
    }
  }

  const requestVerification = async (alertId: string) => {
    try {
      // Simula solicitação de verificação
      await new Promise(resolve => setTimeout(resolve, 800))
      alert(`Verificação solicitada para alerta ${alertId}!`)
    } catch (error) {
      alert('Erro ao solicitar verificação')
    }
  }

  const generateComplianceReport = async () => {
    try {
      setIsGeneratingComplianceReport(true)
      // Simula geração de relatório de compliance
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Relatório de Compliance gerado com sucesso!')
    } catch (error) {
      alert('Erro ao gerar relatório de compliance')
    } finally {
      setIsGeneratingComplianceReport(false)
    }
  }

  const generateFraudReport = async () => {
    try {
      setIsGeneratingFraudReport(true)
      // Simula geração de relatório de fraude
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Relatório de Fraude gerado com sucesso!')
    } catch (error) {
      alert('Erro ao gerar relatório de fraude')
    } finally {
      setIsGeneratingFraudReport(false)
    }
  }

  const generatePerformanceReport = async () => {
    try {
      setIsGeneratingPerformanceReport(true)
      // Simula geração de relatório de performance
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Relatório de Performance gerado com sucesso!')
    } catch (error) {
      alert('Erro ao gerar relatório de performance')
    } finally {
      setIsGeneratingPerformanceReport(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Gestão de Pagamentos</h1>
          <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope`}>Controle todas as formas de pagamento</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span className="font-manrope">Integrações</span>
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span className="font-manrope">Nova Transação</span>
          </button>
        </div>
      </div>

      {/* Sistema de Navegação por Abas */}
      <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-2`}>
        <div className="flex items-center space-x-1">
          {/* Aba Visão Geral */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-manrope font-medium transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                : `${currentTheme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
            }`}
          >
            <Activity className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'overview' ? 'animate-pulse' : ''}`} />
            <span>Visão Geral</span>
          </button>

          {/* Aba Relatórios */}
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-manrope font-medium transition-all duration-300 ${
              activeTab === 'reports'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                : `${currentTheme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
            }`}
          >
            <BarChart3 className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'reports' ? 'animate-bounce' : ''}`} />
            <span>Relatórios</span>
          </button>

          {/* Aba Taxas */}
          <button
            onClick={() => setActiveTab('fees')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-manrope font-medium transition-all duration-300 ${
              activeTab === 'fees'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105'
                : `${currentTheme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
            }`}
          >
            <Calculator className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'fees' ? 'rotate-12' : ''}`} />
            <span>Taxas</span>
          </button>

          {/* Aba Estornos */}
          <button
            onClick={() => setActiveTab('refunds')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-manrope font-medium transition-all duration-300 ${
              activeTab === 'refunds'
                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg transform scale-105'
                : `${currentTheme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
            }`}
          >
            <RotateCcw className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'refunds' ? 'animate-spin' : ''}`} />
            <span>Estornos</span>
          </button>

          {/* Aba Auditoria */}
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-manrope font-medium transition-all duration-300 ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                : `${currentTheme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
            }`}
          >
            <FileText className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'audit' ? 'animate-pulse' : ''}`} />
            <span>Auditoria</span>
          </button>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'overview' && (
        <>
          {/* CARDS DE MÉTRICAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'} rounded-xl p-4 border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-medium`}>Webhooks Recebidos</p>
                  <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-blue-900'}`}>{processingStats.totalReceived}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'} rounded-xl p-4 border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium`}>Pagamentos Processados</p>
                  <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>{processingStats.totalProcessed}</p>
                </div>
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'} rounded-xl p-4 border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} font-medium`}>Transações Pendentes</p>
                  <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-yellow-900'}`}>{cashFlowSync.pendingTransactions}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200'} rounded-xl p-4 border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'} font-medium`}>Último Processamento</p>
                  <p className={`text-sm font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'}`}>
                    {processingStats.lastProcessing.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <Database className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Status das Integrações */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6 mb-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-blue-600" />
                <h3 className={`text-xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Status das Integrações</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowIntegrationDetails(!showIntegrationDetails)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  {showIntegrationDetails ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <span className={`w-3 h-3 rounded-full ${autoSync ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope`}>
                  {autoSync ? 'Sincronização Automática Ativa' : 'Sincronização Manual'}
                </span>
              </div>
            </div>
            
            {showIntegrationDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stone */}
                <div className={`border-2 rounded-xl p-4 ${
                  integrationStatus.stone.connected 
                    ? (currentTheme === 'dark' ? 'border-green-600 bg-gray-700' : 'border-green-200 bg-green-50')
                    : (currentTheme === 'dark' ? 'border-red-600 bg-gray-700' : 'border-red-200 bg-red-50')
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Mobile className="w-5 h-5 text-blue-600" />
                      <span className={`font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Stone</span>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${integrationStatus.stone.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </div>
                  <div className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>Status: {integrationStatus.stone.connected ? 'Conectado' : 'Desconectado'}</p>
                  </div>
                </div>

                {/* Cielo */}
                <div className={`border-2 rounded-xl p-4 ${
                  integrationStatus.cielo.connected 
                    ? (currentTheme === 'dark' ? 'border-green-600 bg-gray-700' : 'border-green-200 bg-green-50')
                    : (currentTheme === 'dark' ? 'border-red-600 bg-gray-700' : 'border-red-200 bg-red-50')
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Desktop className="w-5 h-5 text-orange-600" />
                      <span className={`font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cielo</span>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${integrationStatus.cielo.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </div>
                  <div className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>Status: {integrationStatus.cielo.connected ? 'Conectado' : 'Desconectado'}</p>
                  </div>
                </div>

                {/* PIX */}
                <div className={`border-2 rounded-xl p-4 ${
                  integrationStatus.pix.connected 
                    ? (currentTheme === 'dark' ? 'border-green-600 bg-gray-700' : 'border-green-200 bg-green-50')
                    : (currentTheme === 'dark' ? 'border-red-600 bg-gray-700' : 'border-red-200 bg-red-50')
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-green-600" />
                      <span className={`font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>PIX</span>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${integrationStatus.pix.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </div>
                  <div className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>Status: {integrationStatus.pix.connected ? 'Conectado' : 'Desconectado'}</p>
                  </div>
                </div>

                {/* Cloud */}
                <div className={`border-2 rounded-xl p-4 ${
                  integrationStatus.cloud.connected 
                    ? (currentTheme === 'dark' ? 'border-green-600 bg-gray-700' : 'border-green-200 bg-green-50')
                    : (currentTheme === 'dark' ? 'border-red-600 bg-gray-700' : 'border-red-200 bg-red-50')
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Cloud className="w-5 h-5 text-purple-600" />
                      <span className={`font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cloud</span>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${integrationStatus.cloud.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </div>
                  <div className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>Status: {integrationStatus.cloud.connected ? 'Conectado' : 'Desconectado'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logs de Webhooks em Tempo Real */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6 mb-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-green-600" />
                <h3 className={`text-xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Logs de Webhooks em Tempo Real</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoProcessing(!autoProcessing)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    autoProcessing 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {autoProcessing ? 'Parar' : 'Iniciar'} Processamento
                </button>
                <span className={`w-3 h-3 rounded-full ${autoProcessing ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope`}>
                  {autoProcessing ? 'Ativo' : 'Parado'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {webhookLogs.length === 0 ? (
                <div className={`text-center py-8 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Aguardando webhooks de pagamento...</p>
                  <p className="text-sm">Os logs aparecerão automaticamente quando os provedores enviarem notificações</p>
                </div>
              ) : (
                webhookLogs.map((log) => (
                  <div key={log.id} className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    log.status === 'success' 
                      ? (currentTheme === 'dark' ? 'bg-gray-700 border-green-600' : 'bg-green-50 border-green-200')
                      : log.status === 'pending' 
                      ? (currentTheme === 'dark' ? 'bg-gray-700 border-yellow-600' : 'bg-yellow-50 border-yellow-200')
                      : (currentTheme === 'dark' ? 'bg-gray-700 border-red-600' : 'bg-red-50 border-red-200')
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      log.status === 'success' ? 'bg-green-500' : 
                      log.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-mono`}>
                      {log.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                    <span className={`text-xs ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                      {log.provider}
                    </span>
                    <span className={`text-sm ${
                      log.status === 'success' 
                        ? (currentTheme === 'dark' ? 'text-green-300' : 'text-green-800')
                        : log.status === 'pending' 
                        ? (currentTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-800')
                        : (currentTheme === 'dark' ? 'text-red-300' : 'text-red-800')
                    }`}>
                      {log.message}
                    </span>
                    {log.orderId && (
                      <span className={`text-xs ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Pedido: {log.orderId}
                      </span>
                    )}
                    {log.amount && (
                      <span className={`text-xs ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                        
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Integração com Fluxo de Caixa */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6 mt-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-green-600" />
                <h3 className={`text-xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Integração com Fluxo de Caixa</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowCashFlowIntegration(!showCashFlowIntegration)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  {showCashFlowIntegration ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <span className={`w-3 h-3 rounded-full ${
                  cashFlowSync.status === 'synced' ? 'bg-green-500' : 
                  cashFlowSync.status === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
                <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope`}>
                  {cashFlowSync.status === 'synced' ? 'Sincronizado' : 
                   cashFlowSync.status === 'syncing' ? 'Sincronizando...' : 'Erro de Sincronização'}
                </span>
              </div>
            </div>
            
            {showCashFlowIntegration && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'} rounded-xl p-4 border`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-medium`}>Total de Transações</p>
                        <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-blue-900'}`}>{paymentTransactions.length}</p>
                      </div>
                      <CreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'} rounded-xl p-4 border`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium`}>Sincronizadas</p>
                        <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>{cashFlowSync.totalSynced}</p>
                      </div>
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'} rounded-xl p-4 border`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} font-medium`}>Pendentes</p>
                        <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-yellow-900'}`}>{cashFlowSync.pendingTransactions}</p>
                      </div>
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200'} rounded-xl p-4 border`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'} font-medium`}>Última Sincronização</p>
                        <p className={`text-sm font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'}`}>
                          {cashFlowSync.lastSync.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <Database className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between p-4 rounded-xl border ${
                  currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Info className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className={`font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Como Funciona a Integração</h4>
                      <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Todas as transações de pagamento são automaticamente sincronizadas com o módulo de fluxo de caixa, 
                        garantindo dados precisos e atualizados em tempo real.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={syncWithCashFlow}
                    disabled={cashFlowSync.status === 'syncing'}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-manrope font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-3"
                  >
                    <RefreshCw className={`w-5 h-5 ${cashFlowSync.status === 'syncing' ? 'animate-spin' : ''}`} />
                    <span>
                      {cashFlowSync.status === 'syncing' ? 'Sincronizando...' : 'Sincronizar Manualmente'}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Aba Relatórios */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Cabeçalho dos Relatórios */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-200'} rounded-2xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'} mb-2`}>Relatórios de Pagamentos</h3>
                <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-green-700'} font-manrope`}>Análises detalhadas e insights para tomada de decisões estratégicas</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={exportReportPDF}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar PDF</span>
                </button>
                <button 
                  onClick={generateExecutiveReport}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Relatório Executivo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filtros de Período */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h4 className={`text-lg font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Filtros de Período</h4>
                <button
                  onClick={() => setShowReportFilters(!showReportFilters)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  {showReportFilters ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Período:</span>
                <select 
                  value={reportPeriod}
                  onChange={(e) => updateReportPeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                  <option value="365">Último ano</option>
                </select>
              </div>
            </div>
            
            {showReportFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'} rounded-xl p-4 border`}>
                  <div className="text-center">
                    <p className={`text-sm ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-medium`}>Data Início</p>
                    <input 
                      type="date" 
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                      className={`mt-2 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        currentTheme === 'dark' 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'border-blue-300 bg-white text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'} rounded-xl p-4 border`}>
                  <div className="text-center">
                    <p className={`text-sm ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium`}>Data Fim</p>
                    <input 
                      type="date" 
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                      className={`mt-2 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        currentTheme === 'dark' 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'border-green-300 bg-white text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200'} rounded-xl p-4 border`}>
                  <div className="text-center">
                    <p className={`text-sm ${currentTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'} font-medium`}>Provedor</p>
                    <select 
                      value={reportProvider}
                      onChange={(e) => setReportProvider(e.target.value)}
                      className={`mt-2 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        currentTheme === 'dark' 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'border-purple-300 bg-white text-gray-900'
                      }`}
                    >
                      <option value="all">Todos</option>
                      <option value="stone">Stone</option>
                      <option value="cielo">Cielo</option>
                      <option value="pix">PIX</option>
                      <option value="pagseguro">PagSeguro</option>
                    </select>
                  </div>
                </div>
                
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'} rounded-xl p-4 border`}>
                  <div className="text-center">
                    <p className={`text-sm ${currentTheme === 'dark' ? 'text-orange-400' : 'text-orange-600'} font-medium`}>Status</p>
                    <select 
                      value={reportStatus}
                      onChange={(e) => setReportStatus(e.target.value)}
                      className={`mt-2 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        currentTheme === 'dark' 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'border-orange-300 bg-white text-gray-900'
                      }`}
                    >
                      <option value="all">Todos</option>
                      <option value="completed">Completado</option>
                      <option value="pending">Pendente</option>
                      <option value="error">Erro</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Métricas Principais */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h4 className={`text-lg font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Métricas Principais</h4>
                <button
                  onClick={() => setShowMainMetrics(!showMainMetrics)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  {showMainMetrics ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button 
                onClick={refreshReportData}
                disabled={isGeneratingReport}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isGeneratingReport ? 'animate-spin' : ''}`} />
                <span>{isGeneratingReport ? 'Atualizando...' : 'Atualizar Dados'}</span>
              </button>
            </div>
            
            {showMainMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Volume Total</p>
                      <p className="text-3xl font-bold"></p>
                      <p className="text-blue-200 text-sm mt-1">+12.5% vs mês anterior</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-blue-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Taxa de Aprovação</p>
                      <p className="text-3xl font-bold">98.7%</p>
                      <p className="text-green-200 text-sm mt-1">+2.1% vs mês anterior</p>
                    </div>
                    <CheckCircle className="w-12 h-12 text-green-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Ticket Médio</p>
                      <p className="text-3xl font-bold"></p>
                      <p className="text-purple-200 text-sm mt-1">+8.3% vs mês anterior</p>
                    </div>
                    <DollarSign className="w-12 h-12 text-purple-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Transações</p>
                      <p className="text-3xl font-bold">680</p>
                      <p className="text-orange-200 text-sm mt-1">+15.2% vs mês anterior</p>
                    </div>
                    <CreditCard className="w-12 h-12 text-orange-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gráfico de Volume por Período */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h4 className={`text-lg font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Volume de Pagamentos por Período</h4>
                <button
                  onClick={() => setShowVolumeChart(!showVolumeChart)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  {showVolumeChart ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => updateReportPeriod('7')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    reportPeriod === '7' 
                      ? (currentTheme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700')
                      : (currentTheme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }`}
                >
                  7D
                </button>
                <button 
                  onClick={() => updateReportPeriod('30')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    reportPeriod === '30' 
                      ? (currentTheme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700')
                      : (currentTheme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }`}
                >
                  30D
                </button>
                <button 
                  onClick={() => updateReportPeriod('90')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    reportPeriod === '90' 
                      ? (currentTheme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700')
                      : (currentTheme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }`}
                >
                  90D
                </button>
                <button 
                  onClick={() => updateReportPeriod('365')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    reportPeriod === '365' 
                      ? (currentTheme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700')
                      : (currentTheme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }`}
                >
                  1A
                </button>
              </div>
            </div>
            
            {showVolumeChart && (
              <div className={`h-80 rounded-xl p-6 flex items-center justify-center ${
                currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-br from-gray-50 to-gray-100'
              }`}>
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-600'} mb-2`}>Gráfico de Volume</h5>
                  <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'} text-sm`}>Visualização interativa dos volumes de pagamento ao longo do tempo</p>
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Cartão de Crédito</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>PIX</span>
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Débito</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Análise por Provedor */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h4 className={`text-lg font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Análise por Provedor de Pagamento</h4>
                <button
                  onClick={() => setShowProviderAnalysis(!showProviderAnalysis)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  {showProviderAnalysis ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button 
                onClick={() => showProviderDetailedAnalysis('all')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Ver Detalhes</span>
              </button>
            </div>
            
            {showProviderAnalysis && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Pizza */}
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-blue-100'} rounded-xl p-6 border`}>
                  <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-blue-900'} mb-4 text-center`}>Distribuição por Provedor</h5>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">42%</span>
                      </div>
                      <p className={`${currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-700'} font-medium`}>Stone - Maior Volume</p>
                    </div>
                  </div>
                </div>
                
                {/* Estatísticas Detalhadas */}
                <div className="space-y-4">
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl p-4 border hover:shadow-lg transition-shadow duration-200 cursor-pointer`} onClick={() => showProviderDetailedAnalysis('Stone')}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Stone</span>
                      <span className="text-green-600 font-bold"></span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '42%'}}></div>
                    </div>
                    <div className={`flex justify-between text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      <span>42% do total</span>
                      <span>285 transações</span>
                    </div>
                  </div>
                  
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl p-4 border hover:shadow-lg transition-shadow duration-200 cursor-pointer`} onClick={() => showProviderDetailedAnalysis('Cielo')}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cielo</span>
                      <span className="text-green-600 font-bold"></span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '34%'}}></div>
                    </div>
                    <div className={`flex justify-between text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      <span>34% do total</span>
                      <span>232 transações</span>
                    </div>
                  </div>
                  
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl p-4 border hover:shadow-lg transition-shadow duration-200 cursor-pointer`} onClick={() => showProviderDetailedAnalysis('PIX')}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>PIX</span>
                      <span className="text-green-600 font-bold"></span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '20%'}}></div>
                    </div>
                    <div className={`flex justify-between text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      <span>20% do total</span>
                      <span>133 transações</span>
                    </div>
                  </div>
                  
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl p-4 border hover:shadow-lg transition-shadow duration-200 cursor-pointer`} onClick={() => showProviderDetailedAnalysis('Outros')}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Outros</span>
                      <span className="text-green-600 font-bold"></span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{width: '4%'}}></div>
                    </div>
                    <div className={`flex justify-between text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      <span>4% do total</span>
                      <span>30 transações</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Análise de Performance */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h4 className={`text-lg font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Performance e Métricas de Qualidade</h4>
                <button
                  onClick={() => setShowPerformanceMetrics(!showPerformanceMetrics)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  {showPerformanceMetrics ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Score Geral:</span>
                <span className="text-2xl font-bold text-green-600">9.2/10</span>
              </div>
            </div>
            
            {showPerformanceMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} rounded-xl p-6 border`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'} mb-2`}>Taxa de Sucesso</h5>
                    <p className="text-3xl font-bold text-green-700">98.7%</p>
                    <p className="text-green-600 text-sm mt-1">Excelente</p>
                  </div>
                </div>
                
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} rounded-xl p-6 border`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-blue-900'} mb-2`}>Tempo Médio</h5>
                    <p className="text-3xl font-bold text-blue-700">2.3s</p>
                    <p className="text-blue-600 text-sm mt-1">Muito Rápido</p>
                  </div>
                </div>
                
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} rounded-xl p-6 border`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'} mb-2`}>Segurança</h5>
                    <p className="text-3xl font-bold text-purple-700">99.9%</p>
                    <p className="text-purple-600 text-sm mt-1">Máxima</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tendências e Previsões */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h4 className={`text-lg font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tendências e Previsões</h4>
                <button
                  onClick={() => setShowTrendsForecasts(!showTrendsForecasts)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  {showTrendsForecasts ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">Configurar Alertas</button>
            </div>
            
            {showTrendsForecasts && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} rounded-xl p-6 border`}>
                  <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'} mb-4`}>Projeção para Próximo Mês</h5>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'} font-medium`}>Volume Esperado:</span>
                      <span className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'}`}></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'} font-medium`}>Crescimento:</span>
                      <span className="text-xl font-bold text-green-600">+14.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'} font-medium`}>Transações:</span>
                      <span className="text-xl font-bold text-purple-900">~780</span>
                    </div>
                  </div>
                </div>
                
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'} rounded-xl p-6 border`}>
                  <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-orange-900'} mb-4`}>Insights Recomendados</h5>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <p className={`${currentTheme === 'dark' ? 'text-orange-300' : 'text-orange-700'} text-sm`}>PIX está crescendo 25% ao mês - considere promoções</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <p className={`${currentTheme === 'dark' ? 'text-orange-300' : 'text-orange-700'} text-sm`}>Stone tem melhor performance - otimize integração</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <p className={`${currentTheme === 'dark' ? 'text-orange-300' : 'text-orange-700'} text-sm`}>Taxa de erro baixa - sistema está estável</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Relatórios Especializados */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h4 className={`text-lg font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Relatórios Especializados</h4>
                <button
                  onClick={() => setShowSpecializedReports(!showSpecializedReports)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  {showSpecializedReports ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Menu Dropdown para Gerar Relatórios */}
              <div className="relative generate-menu-container">
                <button 
                  onClick={() => setShowGenerateMenu(!showGenerateMenu)}
                  disabled={isGeneratingReport}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>{isGeneratingReport ? 'Gerando...' : 'Gerar Todos'}</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${showGenerateMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menu Dropdown */}
                {showGenerateMenu && (
                  <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border z-50 ${
                    currentTheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <div className="p-4">
                      <h5 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Opções de Geração</h5>
                      
                      {/* Opção 1: Baixar PDF */}
                      <div className="mb-4">
                        <button
                          onClick={downloadAllReportsPDF}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border hover:from-blue-100 hover:to-blue-200 transition-all duration-200 ${
                            currentTheme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                              : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Download className="w-5 h-5 text-blue-600" />
                            <div className="text-left">
                              <p className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-blue-900'}`}>Baixar PDF</p>
                              <p className={`text-sm ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Download completo dos relatórios</p>
                            </div>
                          </div>
                          <ArrowDown className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>

                      {/* Opção 2: Enviar por Email */}
                      <div className="mb-4">
                        <div className={`p-3 rounded-lg border ${
                          currentTheme === 'dark' 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
                        }`}>
                          <div className="flex items-center space-x-3 mb-3">
                            <Mail className="w-5 h-5 text-green-600" />
                            <div className="text-left">
                              <p className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>Enviar por Email</p>
                              <p className={`text-sm ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Receba relatórios no seu email</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <input
                              type="email"
                              placeholder="Digite seu email"
                              value={emailRecipient}
                              onChange={(e) => setEmailRecipient(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                currentTheme === 'dark' 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'border-green-300 bg-white text-gray-900'
                              }`}
                            />
                            <button
                              onClick={() => sendReportByEmail(emailRecipient)}
                              disabled={isSendingEmail || !emailRecipient}
                              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                              {isSendingEmail ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>Enviando...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  <span>Enviar</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Opção 3: Gerar e Visualizar */}
                      <div>
                        <button
                          onClick={() => {
                            generateReport()
                            setShowGenerateMenu(false)
                          }}
                          disabled={isGeneratingReport}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border hover:from-purple-100 hover:to-purple-200 transition-all duration-200 disabled:opacity-50 ${
                            currentTheme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                              : 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Eye className="w-5 h-5 text-purple-600" />
                            <div className="text-left">
                              <p className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'}`}>Visualizar Online</p>
                              <p className={`text-sm ${currentTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>Gerar e visualizar no navegador</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-purple-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {showSpecializedReports && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} rounded-xl p-4 border hover:shadow-lg transition-shadow duration-200 cursor-pointer`}>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <h5 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-blue-900'}`}>Relatório Diário</h5>
                      <p className={`${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-sm`}>Resumo das 24h</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} rounded-xl p-4 border hover:shadow-lg transition-shadow duration-200 cursor-pointer`}>
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-8 h-8 text-green-600" />
                    <div>
                      <h5 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>Relatório Semanal</h5>
                      <p className={`${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'} text-sm`}>Análise de tendências</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} rounded-xl p-4 border hover:shadow-lg transition-shadow duration-200 cursor-pointer`}>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div>
                      <h5 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'}`}>Relatório Mensal</h5>
                      <p className={`${currentTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'} text-sm`}>Visão estratégica</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'} rounded-xl p-6 border`}>
                  <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-orange-900'} mb-4`}>Insights Recomendados</h5>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <p className={`${currentTheme === 'dark' ? 'text-orange-300' : 'text-orange-700'} text-sm`}>PIX está crescendo 25% ao mês - considere promoções</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <p className={`${currentTheme === 'dark' ? 'text-orange-300' : 'text-orange-700'} text-sm`}>Stone tem melhor performance - otimize integração</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <p className={`${currentTheme === 'dark' ? 'text-orange-300' : 'text-orange-700'} text-sm`}>Taxa de erro baixa - sistema está estável</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Detalhes dos Provedores */}
      {showProviderDetails && providerDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Análise Detalhada - {providerDetails.name}
                </h3>
                <button
                  onClick={() => setShowProviderDetails(false)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Métricas Principais */}
                <div className="space-y-4">
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} rounded-xl p-4 border`}>
                    <div className="text-center">
                      <p className={`text-sm ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-medium`}>Volume Total</p>
                      <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-blue-900'}`}></p>
                    </div>
                  </div>
                  
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} rounded-xl p-4 border`}>
                    <div className="text-center">
                      <p className={`text-sm ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium`}>Transações</p>
                      <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>{providerDetails.totalTransactions}</p>
                    </div>
                  </div>
                  
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} rounded-xl p-4 border`}>
                    <div className="text-center">
                      <p className={`text-sm ${currentTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'} font-medium`}>Taxa de Aprovação</p>
                      <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'}`}>{providerDetails.approvalRate}%</p>
                    </div>
                  </div>
                </div>

                {/* Métricas de Performance */}
                <div className="space-y-4">
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'} rounded-xl p-4 border`}>
                    <div className="text-center">
                      <p className={`text-sm ${currentTheme === 'dark' ? 'text-orange-400' : 'text-orange-600'} font-medium`}>Ticket Médio</p>
                      <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-orange-900'}`}></p>
                    </div>
                  </div>
                  
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200'} rounded-xl p-4 border`}>
                    <div className="text-center">
                      <p className={`text-sm ${currentTheme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>Tempo de Processamento</p>
                      <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-indigo-900'}`}>{providerDetails.processingTime}s</p>
                    </div>
                  </div>
                  
                  <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'} rounded-xl p-4 border`}>
                    <div className="text-center">
                      <p className={`text-sm ${currentTheme === 'dark' ? 'text-red-400' : 'text-red-600'} font-medium`}>Taxa de Erro</p>
                      <p className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-red-900'}`}>{providerDetails.errorRate}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl p-4 border`}>
                  <h4 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Informações do Sistema</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Status:</span>
                      <span className={`font-medium ${providerDetails.status === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                        {providerDetails.status === 'connected' ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Última Sincronização:</span>
                      <span className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {providerDetails.lastSync.toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Crescimento Mensal:</span>
                      <span className="font-medium text-green-600">+{providerDetails.monthlyGrowth}%</span>
                    </div>
                  </div>
                </div>

                <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl p-4 border`}>
                  <h4 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Categorias Principais</h4>
                  <div className="space-y-2">
                    {providerDetails.topCategories.map((category: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transações Recentes */}
              <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl p-4 border`}>
                <h4 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Transações Recentes</h4>
                <div className="space-y-2">
                  {providerDetails.recentTransactions.map((transaction: any) => (
                    <div key={transaction.id} className={`flex items-center justify-between p-2 rounded-lg ${
                      currentTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>#{transaction.id}</span>
                        <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{transaction.customer}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}></span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status === 'completed' ? 'Completado' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className={`flex items-center justify-end space-x-3 mt-6 pt-6 border-t ${currentTheme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                <button
                  onClick={() => setShowProviderDetails(false)}
                  className={`px-4 py-2 ${currentTheme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    // Aqui você pode implementar ações específicas para o provedor
                    console.log(`Ações para ${providerDetails.name}`)
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Ações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="space-y-6">
          {/* Cabeçalho Limpo */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-8`}>
            <div className="text-center">
              <h3 className={`text-3xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Gestão de Taxas</h3>
              <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg`}>Configure e gerencie as taxas dos seus provedores de pagamento</p>
            </div>
            
            {/* Cards de Resumo Simples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className={`text-center p-6 rounded-xl border ${
                currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
              }`}>
                <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <h4 className={`text-xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-blue-900'} mb-2`}>Taxa Média</h4>
                <p className="text-3xl font-bold text-blue-600">2.89%</p>
              </div>
              
              <div className={`text-center p-6 rounded-xl border ${
                currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
              }`}>
                <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h4 className={`text-xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'} mb-2`}>Custo Mensal</h4>
                <p className="text-3xl font-bold text-green-600"></p>
              </div>
              
              <div className={`text-center p-6 rounded-xl border ${
                currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
              }`}>
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h4 className={`text-xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'} mb-2`}>Provedores</h4>
                <p className="text-3xl font-bold text-purple-600">4</p>
              </div>
            </div>
          </div>

          {/* Provedores com Design Limpo */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border`}>
            <div className="flex items-center justify-between p-8 pb-6">
              <h4 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Provedores de Pagamento</h4>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowProviderFees(!showProviderFees)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  {showProviderFees ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button 
                  onClick={exportFeesConfig}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                    currentTheme === 'dark' 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
              </div>
            </div>
            
            {showProviderFees && (
              <div className="px-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Stone */}
                  <div className={`border rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 ${
                    currentTheme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h5 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Stone</h5>
                          <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Máquina de Cartão</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Ativo</span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Crédito à Vista</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2.39%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Crédito Parcelado</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2.89%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Débito</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1.99%</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => editProviderFees('Stone')}
                      className={`w-full py-2 rounded-lg transition-colors duration-200 font-medium ${
                        currentTheme === 'dark' 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      Editar Taxas
                    </button>
                  </div>

                  {/* Cielo */}
                  <div className={`border rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 ${
                    currentTheme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h5 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cielo</h5>
                          <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Gateway de Pagamento</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Ativo</span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Crédito à Vista</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2.49%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Crédito Parcelado</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2.99%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Débito</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2.09%</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => editProviderFees('Cielo')}
                      className={`w-full py-2 rounded-lg transition-colors duration-200 font-medium ${
                        currentTheme === 'dark' 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      Editar Taxas
                    </button>
                  </div>

                  {/* PIX */}
                  <div className={`border rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 ${
                    currentTheme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h5 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>PIX</h5>
                          <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Transferência Instantânea</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Ativo</span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>PIX Estático</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>0.99%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>PIX Dinâmico</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1.29%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>QR Code</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>0.79%</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => editProviderFees('PIX')}
                      className={`w-full py-2 rounded-lg transition-colors duration-200 font-medium ${
                        currentTheme === 'dark' 
                          ? 'bg-purple-600 text-white hover:bg-purple-700' 
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                      }`}
                    >
                      Editar Taxas
                    </button>
                  </div>

                  {/* PagSeguro */}
                  <div className={`border rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 ${
                    currentTheme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h5 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>PagSeguro</h5>
                          <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Plataforma Digital</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Revisão</span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Cartão de Crédito</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>3.99%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Boleto</span>
                        <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>3.49%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>PIX</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1.99%</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => editProviderFees('PagSeguro')}
                      className={`w-full py-2 rounded-lg transition-colors duration-200 font-medium ${
                        currentTheme === 'dark' 
                          ? 'bg-orange-600 text-white hover:bg-orange-700' 
                          : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                      }`}
                    >
                      Editar Taxas
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calculadora Profissional */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border`}>
            <div className="flex items-center justify-between p-8 pb-6">
              <div>
                <h4 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Calculadora Avançada de Taxas</h4>
                <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Simule diferentes cenários e compare custos entre provedores</p>
              </div>
              <button 
                onClick={() => setShowFeesCalculator(!showFeesCalculator)}
                className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
              >
                {showFeesCalculator ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {showFeesCalculator && (
              <div className="px-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Painel de Configuração */}
                  <div className="space-y-6">
                    <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} rounded-xl p-6 border`}>
                      <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-blue-900'} mb-4 flex items-center`}>
                        <Calculator className="w-5 h-5 mr-2" />
                        Configuração da Transação
                      </h5>
                      
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-blue-900'} mb-2`}>Valor da Transação</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 font-semibold">R$</span>
                            <input
                              type="number"
                              placeholder="0,00"
                              value={feesCalculatorData.transactionValue}
                              onChange={(e) => setFeesCalculatorData(prev => ({ ...prev, transactionValue: e.target.value }))}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                currentTheme === 'dark' 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'border-blue-300 bg-white text-gray-900'
                              }`}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-blue-900'} mb-2`}>Provedor</label>
                            <select 
                              value={feesCalculatorData.selectedProvider}
                              onChange={(e) => setFeesCalculatorData(prev => ({ ...prev, selectedProvider: e.target.value }))}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                currentTheme === 'dark' 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'border-blue-300 bg-white text-gray-900'
                              }`}
                            >
                              <option value="">Selecione</option>
                              <option value="Stone">Stone</option>
                              <option value="Cielo">Cielo</option>
                              <option value="PIX">PIX</option>
                              <option value="PagSeguro">PagSeguro</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-blue-900'} mb-2`}>Tipo</label>
                            <select 
                              value={feesCalculatorData.transactionType}
                              onChange={(e) => setFeesCalculatorData(prev => ({ ...prev, transactionType: e.target.value }))}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                currentTheme === 'dark' 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'border-blue-300 bg-white text-gray-900'
                              }`}
                            >
                              <option value="">Selecione</option>
                              <option value="Crédito à Vista">Crédito à Vista</option>
                              <option value="Crédito Parcelado">Crédito Parcelado</option>
                              <option value="Débito">Débito</option>
                              <option value="PIX">PIX</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-blue-900'} mb-2`}>Parcelas (se aplicável)</label>
                          <select 
                            value={feesCalculatorData.installments}
                            onChange={(e) => setFeesCalculatorData(prev => ({ ...prev, installments: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              currentTheme === 'dark' 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'border-blue-300 bg-white text-gray-900'
                            }`}
                          >
                            <option value="1">1x (à vista)</option>
                            <option value="2">2x</option>
                            <option value="3">3x</option>
                            <option value="6">6x</option>
                            <option value="12">12x</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} rounded-xl p-6 border`}>
                      <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'} mb-4 flex items-center`}>
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Cenários de Comparação
                      </h5>
                      
                      <div className="space-y-3">
                        <button 
                          onClick={() => setFeesCalculatorData(prev => ({ ...prev, transactionValue: '1000', selectedProvider: 'Stone', transactionType: 'Crédito à Vista' }))}
                          className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
                            currentTheme === 'dark' 
                              ? 'bg-gray-600 border-gray-500 hover:border-gray-400' 
                              : 'bg-white border-green-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>Cenário 1: Stone Crédito</span>
                            <span className={`text-xs ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}></span>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => setFeesCalculatorData(prev => ({ ...prev, transactionValue: '1000', selectedProvider: 'Cielo', transactionType: 'Crédito à Vista' }))}
                          className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
                            currentTheme === 'dark' 
                              ? 'bg-gray-600 border-gray-500 hover:border-gray-400' 
                              : 'bg-white border-green-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>Cenário 2: Cielo Crédito</span>
                            <span className={`text-xs ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}></span>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => setFeesCalculatorData(prev => ({ ...prev, transactionValue: '1000', selectedProvider: 'PIX', transactionType: 'PIX' }))}
                          className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
                            currentTheme === 'dark' 
                              ? 'bg-gray-600 border-gray-500 hover:border-gray-400' 
                              : 'bg-white border-green-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>Cenário 3: PIX</span>
                            <span className={`text-xs ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}></span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Painel de Resultados */}
                  <div className="space-y-6">
                    <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} rounded-xl p-6 border`}>
                      <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'} mb-4 flex items-center`}>
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Resultado do Cálculo
                      </h5>
                      
                      {feesCalculatorData.calculatedResult.originalValue > 0 ? (
                        <div className="space-y-4">
                          <div className={`${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-purple-200'} rounded-lg p-4 border`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Valor Original</span>
                              <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'}`}></span>
                            </div>
                            <div className="w-full bg-purple-200 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                          
                          <div className={`${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-purple-200'} rounded-lg p-4 border`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Taxa Aplicada</span>
                              <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'}`}>{feesCalculatorData.calculatedResult.appliedRate.toFixed(2)}%</span>
                            </div>
                            <div className="w-full bg-purple-200 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(feesCalculatorData.calculatedResult.appliedRate / 5) * 100}%` }}></div>
                            </div>
                          </div>
                          
                          <div className={`${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-purple-200'} rounded-lg p-4 border`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Valor da Taxa</span>
                              <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'}`}></span>
                            </div>
                            <div className="w-full bg-purple-200 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(feesCalculatorData.calculatedResult.feeAmount / feesCalculatorData.calculatedResult.originalValue) * 100}%` }}></div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                            <div className="text-center">
                              <p className="text-sm text-purple-100 mb-1">Valor Final</p>
                              <p className="text-3xl font-bold"></p>
                              <p className="text-xs text-purple-200 mt-1">Após aplicação da taxa</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`text-center py-8 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Calculator className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                          <p className="text-purple-600 font-medium">Configure os parâmetros acima</p>
                          <p className="text-purple-500 text-sm">e clique em calcular para ver os resultados</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                      <h5 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Ações Rápidas
                      </h5>
                      
                      <div className="space-y-3">
                        <button 
                          onClick={calculateFees}
                          disabled={isCalculating || !feesCalculatorData.transactionValue || !feesCalculatorData.selectedProvider || !feesCalculatorData.transactionType}
                          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                        >
                          {isCalculating ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Calculando...
                            </>
                          ) : (
                            <>
                              <Calculator className="w-5 h-5 mr-2" />
                              Calcular Taxas
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => setFeesCalculatorData(prev => ({ ...prev, transactionValue: '', selectedProvider: '', transactionType: '', installments: '1' }))}
                          className="w-full bg-orange-100 text-orange-700 py-2 rounded-lg font-medium hover:bg-orange-200 transition-colors duration-200"
                        >
                          Limpar Campos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between p-8 pb-6">
              <h4 className="text-2xl font-manrope font-bold text-gray-900">Ações Rápidas</h4>
              <button 
                onClick={() => setShowFeesReports(!showFeesReports)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showFeesReports ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {showFeesReports && (
              <div className="px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={compareProviders}
                    className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-200 text-center"
                  >
                    <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h5 className="font-semibold text-gray-900 mb-2">Comparar Provedores</h5>
                    <p className="text-sm text-gray-600">Análise de custos e benefícios</p>
                  </button>
                  
                  <button 
                    onClick={generateFeesReport}
                    disabled={isGeneratingFeesReport}
                    className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-200 text-center disabled:opacity-50"
                  >
                    <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {isGeneratingFeesReport ? 'Gerando...' : 'Relatório de Taxas'}
                    </h5>
                    <p className="text-sm text-gray-600">Análise mensal completa</p>
                  </button>
                  
                  <button 
                    onClick={viewAllHistory}
                    className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-200 text-center"
                  >
                    <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h5 className="font-semibold text-gray-900 mb-2">Histórico</h5>
                    <p className="text-sm text-gray-600">Todas as alterações</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'refunds' && (
        <div className="space-y-6">
          {/* Cabeçalho dos Estornos */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center">
              <h3 className="text-3xl font-manrope font-bold text-gray-900 mb-3">Gestão de Estornos</h3>
              <p className="text-gray-600 text-lg">Gerencie solicitações de estorno e acompanhe o status de reembolsos</p>
            </div>
            
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-red-900 mb-2">Pendentes</h4>
                <p className="text-3xl font-bold text-red-600">12</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                <div className="w-12 h-12 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-yellow-900 mb-2">Em Análise</h4>
                <p className="text-3xl font-bold text-yellow-600">8</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-green-900 mb-2">Aprovados</h4>
                <p className="text-3xl font-bold text-green-600">45</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-blue-900 mb-2">Total Estornado</h4>
                <p className="text-3xl font-bold text-blue-600"></p>
              </div>
            </div>
          </div>

          {/* Solicitações de Estorno */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between p-8 pb-6">
              <h4 className="text-2xl font-manrope font-bold text-gray-900">Solicitações de Estorno</h4>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowRefundRequests(!showRefundRequests)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showRefundRequests ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button 
                  onClick={createRefundRequest}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Solicitação</span>
                </button>
              </div>
            </div>
            
            {showRefundRequests && (
              <div className="px-8 pb-8">
                <div className="space-y-4">
                  {/* Solicitação 1 */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">Estorno #REF001</h5>
                          <p className="text-sm text-gray-500">Cliente: João Silva</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Pendente</span>
                        <span className="text-lg font-bold text-gray-900"></span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Motivo</p>
                        <p className="font-medium text-gray-900">Produto com defeito</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Data da Transação</p>
                        <p className="font-medium text-gray-900">15/12/2024</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Provedor</p>
                        <p className="font-medium text-gray-900">Stone</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => viewRefundDetails('REF001')}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                      >
                        Ver Detalhes
                      </button>
                      <button 
                        onClick={() => approveRefund('REF001')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                      >
                        Aprovar
                      </button>
                      <button 
                        onClick={() => rejectRefund('REF001')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>

                  {/* Solicitação 2 */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">Estorno #REF002</h5>
                          <p className="text-sm text-gray-500">Cliente: Maria Santos</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Em Análise</span>
                        <span className="text-lg font-bold text-gray-900"></span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Motivo</p>
                        <p className="font-medium text-gray-900">Cancelamento de pedido</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Data da Transação</p>
                        <p className="font-medium text-gray-900">14/12/2024</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Provedor</p>
                        <p className="font-medium text-gray-900">Cielo</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => viewRefundDetails('REF002')}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                      >
                        Ver Detalhes
                      </button>
                      <button 
                        onClick={() => requestMoreInfo('REF002')}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-medium"
                      >
                        Solicitar Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configurações de Estorno */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border`}>
            <div className="flex items-center justify-between p-8 pb-6">
              <h4 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Configurações de Estorno</h4>
              <button 
                onClick={() => setShowRefundSettings(!showRefundSettings)}
                className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
              >
                {showRefundSettings ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {showRefundSettings && (
              <div className="px-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} rounded-xl p-6 border`}>
                      <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-blue-900'} mb-4 flex items-center`}>
                        <Settings className="w-5 h-5 mr-2" />
                        Políticas de Estorno
                      </h5>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`${currentTheme === 'dark' ? 'text-gray-200' : 'text-blue-900'}`}>Prazo para estorno</span>
                          <select 
                            value={refundSettings.policyDays}
                            onChange={(e) => setRefundSettings(prev => ({ ...prev, policyDays: e.target.value }))}
                            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              currentTheme === 'dark' 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'bg-white border-blue-300 text-gray-900'
                            }`}
                          >
                            <option value="7">7 dias</option>
                            <option value="15">15 dias</option>
                            <option value="30">30 dias</option>
                            <option value="90">90 dias</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`${currentTheme === 'dark' ? 'text-gray-200' : 'text-blue-900'}`}>Valor mínimo</span>
                          <input
                            type="number"
                            value={refundSettings.minAmount}
                            onChange={(e) => setRefundSettings(prev => ({ ...prev, minAmount: e.target.value }))}
                            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24 ${
                              currentTheme === 'dark' 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'bg-white border-blue-300 text-gray-900'
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`${currentTheme === 'dark' ? 'text-gray-200' : 'text-blue-900'}`}>Aprovação automática</span>
                          <button 
                            onClick={() => setRefundSettings(prev => ({ ...prev, autoApprove: !prev.autoApprove }))}
                            className={`w-12 h-6 rounded-full transition-colors duration-200 ${refundSettings.autoApprove ? 'bg-blue-600' : 'bg-gray-300'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${refundSettings.autoApprove ? 'transform translate-x-6' : 'transform translate-x-1'}`}></div>
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        onClick={saveRefundSettings}
                        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                      >
                        Salvar Configurações
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} rounded-xl p-6 border`}>
                      <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'} mb-4 flex items-center`}>
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Estatísticas de Estorno
                      </h5>
                      
                      <div className="space-y-4">
                        <div className={`${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-green-200'} rounded-lg p-4 border`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`${currentTheme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Taxa de Aprovação</span>
                            <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>78.5%</span>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '78.5%' }}></div>
                          </div>
                        </div>
                        
                        <div className={`${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-green-200'} rounded-lg p-4 border`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`${currentTheme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Tempo Médio de Resposta</span>
                            <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>2.3 dias</span>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        
                        <div className={`${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-green-200'} rounded-lg p-4 border`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`${currentTheme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Satisfação do Cliente</span>
                            <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>4.2/5.0</span>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Cabeçalho da Auditoria */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-8`}>
            <div className="text-center">
              <h3 className={`text-3xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Auditoria de Pagamentos com IA Preditiva</h3>
              <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg`}>Detecte fraudes, anomalias e otimize processos com inteligência artificial</p>
            </div>
            
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className={`text-center p-6 rounded-xl border ${
                currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
              }`}>
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h4 className={`text-xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'} mb-2`}>Score de Risco</h4>
                <p className="text-3xl font-bold text-purple-600">Baixo</p>
              </div>
              
              <div className={`text-center p-6 rounded-xl border ${
                currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
              }`}>
                <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className={`text-xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-red-900'} mb-2`}>Alertas</h4>
                <p className="text-3xl font-bold text-red-600">3</p>
              </div>
              
              <div className={`text-center p-6 rounded-xl border ${
                currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
              }`}>
                <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className={`text-xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'} mb-2`}>Eficiência</h4>
                <p className="text-3xl font-bold text-green-600">94.2%</p>
              </div>
              
              <div className={`text-center p-6 rounded-xl border ${
                currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
              }`}>
                <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h4 className={`text-xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-blue-900'} mb-2`}>Transações</h4>
                <p className="text-3xl font-bold text-blue-600">1.247</p>
              </div>
            </div>
          </div>

          {/* IA Preditiva - Análise de Risco */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border`}>
            <div className="flex items-center justify-between p-8 pb-6">
              <h4 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>IA Preditiva - Análise de Risco</h4>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowAIRiskAnalysis(!showAIRiskAnalysis)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  {showAIRiskAnalysis ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button 
                  onClick={runAIAnalysis}
                  disabled={isRunningAI}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  {isRunningAI ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analisando...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      <span>Executar IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {showAIRiskAnalysis && (
              <div className="px-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Painel de Configuração da IA */}
                  <div className="space-y-6">
                    <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} rounded-xl p-6 border`}>
                      <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-purple-900'} mb-4 flex items-center`}>
                        <Settings className="w-5 h-5 mr-2" />
                        Configurações da IA
                      </h5>
                      
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-purple-900'} mb-2`}>Sensibilidade de Detecção</label>
                          <select 
                            value={aiSettings.sensitivity}
                            onChange={(e) => setAiSettings(prev => ({ ...prev, sensitivity: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              currentTheme === 'dark' 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'border-purple-300 bg-white text-gray-900'
                            }`}
                          >
                            <option value="low">Baixa (Menos alertas)</option>
                            <option value="medium">Média (Equilibrado)</option>
                            <option value="high">Alta (Mais alertas)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-purple-900'} mb-2`}>Período de Análise</label>
                          <select 
                            value={aiSettings.analysisPeriod}
                            onChange={(e) => setAiSettings(prev => ({ ...prev, analysisPeriod: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              currentTheme === 'dark' 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'border-purple-300 bg-white text-gray-900'
                            }`}
                          >
                            <option value="24h">Últimas 24 horas</option>
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d">Últimos 90 dias</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`${currentTheme === 'dark' ? 'text-gray-200' : 'text-purple-900'}`}>Aprendizado Automático</span>
                          <button 
                            onClick={() => setAiSettings(prev => ({ ...prev, autoLearning: !prev.autoLearning }))}
                            className={`w-12 h-6 rounded-full transition-colors duration-200 ${aiSettings.autoLearning ? 'bg-purple-600' : 'bg-gray-300'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${aiSettings.autoLearning ? 'transform translate-x-6' : 'transform translate-x-1'}`}></div>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`${currentTheme === 'dark' ? 'text-gray-200' : 'text-purple-900'}`}>Alertas em Tempo Real</span>
                          <button 
                            onClick={() => setAiSettings(prev => ({ ...prev, realTimeAlerts: !prev.realTimeAlerts }))}
                            className={`w-12 h-6 rounded-full transition-colors duration-200 ${aiSettings.realTimeAlerts ? 'bg-purple-600' : 'bg-gray-300'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${aiSettings.realTimeAlerts ? 'transform translate-x-6' : 'transform translate-x-1'}`}></div>
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        onClick={saveAISettings}
                        className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                      >
                        Salvar Configurações
                      </button>
                    </div>
                  </div>
                  
                  {/* Resultados da IA */}
                  <div className="space-y-6">
                    <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} rounded-xl p-6 border`}>
                      <h5 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'} mb-4 flex items-center`}>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Análise de Segurança
                      </h5>
                      
                      {aiAnalysisResults.securityScore > 0 ? (
                        <div className="space-y-4">
                          <div className={`${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-green-200'} rounded-lg p-4 border`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`${currentTheme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Score de Segurança</span>
                              <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>{aiAnalysisResults.securityScore}/100</span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${aiAnalysisResults.securityScore}%` }}></div>
                            </div>
                          </div>
                          
                          <div className={`${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-green-200'} rounded-lg p-4 border`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`${currentTheme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Transações Seguras</span>
                              <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>{aiAnalysisResults.secureTransactions}</span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(aiAnalysisResults.secureTransactions / aiAnalysisResults.totalTransactions) * 100}%` }}></div>
                            </div>
                          </div>
                          
                          <div className={`${currentTheme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-green-200'} rounded-lg p-4 border`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`${currentTheme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Fraudes Detectadas</span>
                              <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-green-900'}`}>{aiAnalysisResults.fraudDetected}</span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(aiAnalysisResults.fraudDetected / aiAnalysisResults.totalTransactions) * 100}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`text-center py-8 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-green-600'}`}>
                          <Brain className="w-16 h-16 text-green-300 mx-auto mb-4" />
                          <p className={`font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-green-600'}`}>Execute a análise de IA</p>
                          <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-green-500'}`}>para ver os resultados de segurança</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alertas e Anomalias */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border`}>
            <div className="flex items-center justify-between p-8 pb-6">
              <h4 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Alertas e Anomalias Detectadas</h4>
              <button 
                onClick={() => setShowAlerts(!showAlerts)}
                className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
              >
                {showAlerts ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {showAlerts && (
              <div className="px-8 pb-8">
                <div className="space-y-4">
                  {/* Alerta Crítico */}
                  <div className={`border rounded-xl p-6 ${
                    currentTheme === 'dark' 
                      ? 'border-red-600 bg-gray-700' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h5 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-red-900'}`}>Alerta Crítico - Possível Fraude</h5>
                          <p className={`text-sm ${currentTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Transação #TXN789 - </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Crítico</span>
                        <span className={`text-sm ${currentTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Há 2 horas</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Risco</p>
                        <p className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-red-900'}`}>Alto (95%)</p>
                      </div>
                      <div>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Padrão Detectado</p>
                        <p className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-red-900'}`}>Comportamento anômalo</p>
                      </div>
                      <div>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Localização</p>
                        <p className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-red-900'}`}>IP suspeito</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => viewAlertDetails('ALERT001')}
                        className={`px-4 py-2 transition-colors duration-200 font-medium ${
                          currentTheme === 'dark' 
                            ? 'text-red-400 hover:text-red-300' 
                            : 'text-red-600 hover:text-red-800'
                        }`}
                      >
                        Ver Detalhes
                      </button>
                      <button 
                        onClick={() => blockTransaction('TXN789')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                      >
                        Bloquear Transação
                      </button>
                      <button 
                        onClick={() => markAsFalsePositive('ALERT001')}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                          currentTheme === 'dark' 
                            ? 'bg-gray-600 text-white hover:bg-gray-500' 
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                      >
                        Falso Positivo
                      </button>
                    </div>
                  </div>

                  {/* Alerta Médio */}
                  <div className={`border rounded-xl p-6 ${
                    currentTheme === 'dark' 
                      ? 'border-yellow-600 bg-gray-700' 
                      : 'border-yellow-200 bg-yellow-50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h5 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-yellow-900'}`}>Alerta Médio - Volume Anômalo</h5>
                          <p className={`text-sm ${currentTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>Cliente: Empresa XYZ</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Médio</span>
                        <span className={`text-sm ${currentTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>Há 5 horas</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>Risco</p>
                        <p className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-yellow-900'}`}>Médio (65%)</p>
                      </div>
                      <div>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>Padrão Detectado</p>
                        <p className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-yellow-900'}`}>Volume acima da média</p>
                      </div>
                      <div>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>Valor</p>
                        <p className={`font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-yellow-900'}`}></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => viewAlertDetails('ALERT002')}
                        className={`px-4 py-2 transition-colors duration-200 font-medium ${
                          currentTheme === 'dark' 
                            ? 'text-yellow-400 hover:text-yellow-300' 
                            : 'text-yellow-600 hover:text-yellow-800'
                        }`}
                      >
                        Ver Detalhes
                      </button>
                      <button 
                        onClick={() => requestVerification('ALERT002')}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-medium"
                      >
                        Solicitar Verificação
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Relatórios de Auditoria */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border`}>
            <div className="flex items-center justify-between p-8 pb-6">
              <h4 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Relatórios de Auditoria</h4>
              <button 
                onClick={() => setShowAuditReports(!showAuditReports)}
                className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
              >
                {showAuditReports ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {showAuditReports && (
              <div className="px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={generateComplianceReport}
                    disabled={isGeneratingComplianceReport}
                    className={`p-6 border rounded-xl hover:shadow-lg transition-shadow duration-200 text-center disabled:opacity-50 ${
                      currentTheme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h5 className={`font-semibold mb-2 ${
                      currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {isGeneratingComplianceReport ? 'Gerando...' : 'Relatório de Compliance'}
                    </h5>
                    <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Conformidade regulatória</p>
                  </button>
                  
                  <button 
                    onClick={generateFraudReport}
                    disabled={isGeneratingFraudReport}
                    className={`p-6 border rounded-xl hover:shadow-lg transition-shadow duration-200 text-center disabled:opacity-50 ${
                      currentTheme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <Shield className="w-8 h-8 text-red-600 mx-auto mb-3" />
                    <h5 className={`font-semibold mb-2 ${
                      currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {isGeneratingFraudReport ? 'Gerando...' : 'Relatório de Fraude'}
                    </h5>
                    <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Análise de segurança</p>
                  </button>
                  
                  <button 
                    onClick={generatePerformanceReport}
                    disabled={isGeneratingPerformanceReport}
                    className={`p-6 border rounded-xl hover:shadow-lg transition-shadow duration-200 text-center disabled:opacity-50 ${
                      currentTheme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h5 className={`font-semibold mb-2 ${
                      currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {isGeneratingPerformanceReport ? 'Gerando...' : 'Relatório de Performance'}
                    </h5>
                    <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Métricas de eficiência</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para Editar Taxas dos Provedores */}
      {showFeesModal && editingProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl max-w-2xl w-full border`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Editar Taxas - {editingProvider}
                </h3>
                <button
                  onClick={() => setShowFeesModal(false)}
                  className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Crédito à Vista (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingFees.creditVista}
                    onChange={(e) => setEditingFees(prev => ({ ...prev, creditVista: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Crédito Parcelado (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingFees.creditParcelado}
                    onChange={(e) => setEditingFees(prev => ({ ...prev, creditParcelado: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Débito (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingFees.debit}
                    onChange={(e) => setEditingFees(prev => ({ ...prev, debit: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-2`}>PIX (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingFees.pix}
                    onChange={(e) => setEditingFees(prev => ({ ...prev, pix: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowFeesModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveProviderFees}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}