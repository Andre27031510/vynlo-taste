'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, FileText, FileSpreadsheet, Download, 
  Calendar, Clock, Target, TrendingUp, Brain,
  X, Search, ChevronDown, ChevronUp, 
  Zap, Settings, Mail, Eye, Filter,
  CheckCircle, AlertTriangle, RefreshCw,
  Package, ShoppingCart, Users, DollarSign,
  Database, Activity, TrendingDown, ArrowUpRight
} from 'lucide-react'
import { useThemeContext } from '../../contexts/ThemeContext'

export default function ReportsAnalytics() {
  const { currentTheme } = useThemeContext()
  // Estados básicos
  const [selectedModule, setSelectedModule] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [showReportConfig, setShowReportConfig] = useState(false)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [reportType, setReportType] = useState('comprehensive')
  const [deliveryMethod, setDeliveryMethod] = useState('pdf')
  const [emailRecipient, setEmailRecipient] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedReports, setGeneratedReports] = useState<any[]>([])
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageType, setMessageType] = useState('success')

  // Estados para fluxo automático
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)
  const [syncInterval, setSyncInterval] = useState(5) // minutos
  const [lastSync, setLastSync] = useState(new Date())
  const [systemData, setSystemData] = useState({
    orders: { total: 0, pending: 0, completed: 0, revenue: 0 },
    menu: { totalItems: 0, lowStock: 0, outOfStock: 0 },
    teams: { totalEmployees: 0, online: 0, working: 0 },
    financial: { revenue: 0, expenses: 0, profit: 0 }
  })
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeUsers: 0,
    currentOrders: 0,
    systemHealth: 'excellent'
  })

  // Módulos disponíveis com integração automática
  const availableModules = [
    { 
      id: 'orders', 
      name: 'Pedidos', 
      icon: ShoppingCart, 
      color: 'blue',
      autoSync: true,
      dataSource: 'orders-database',
      lastUpdate: new Date()
    },
    { 
      id: 'menu', 
      name: 'Cardápio', 
      icon: Package, 
      color: 'green',
      autoSync: true,
      dataSource: 'menu-inventory',
      lastUpdate: new Date()
    },
    { 
      id: 'teams', 
      name: 'Equipes', 
      icon: Users, 
      color: 'purple',
      autoSync: true,
      dataSource: 'hr-system',
      lastUpdate: new Date()
    },
    { 
      id: 'financial', 
      name: 'Financeiro', 
      icon: DollarSign, 
      color: 'yellow',
      autoSync: true,
      dataSource: 'accounting-system',
      lastUpdate: new Date()
    }
  ]

  // Períodos disponíveis
  const periods = [
    { id: 'week', label: 'Semana', icon: Clock },
    { id: 'month', label: 'Mês', icon: Calendar },
    { id: 'quarter', label: 'Trimestre', icon: Target },
    { id: 'year', label: 'Ano', icon: TrendingUp }
  ]

  // Tipos de relatório
  const reportTypes = [
    { id: 'comprehensive', label: 'Relatório Completo' },
    { id: 'executive', label: 'Relatório Executivo' },
    { id: 'operational', label: 'Relatório Operacional' },
    { id: 'financial', label: 'Relatório Financeiro' }
  ]

  // Métodos de entrega
  const deliveryMethods = [
    { id: 'pdf', label: 'PDF', icon: FileText },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'download', label: 'Download', icon: Download }
  ]

  // Função para mostrar mensagens
  const displayMessage = (text: string, type: 'success' | 'error') => {
    setMessageText(text)
    setMessageType(type)
    setShowMessage(true)
    
    setTimeout(() => {
      setShowMessage(false)
    }, 3000)
  }

  // Função para sincronização automática com todos os módulos
  const syncAllModules = async () => {
    setIsLoading(true)
    
    try {
      // Simular sincronização com todos os módulos do sistema
      const syncPromises = availableModules.map(async (module) => {
        // Simular coleta de dados de cada módulo
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Atualizar dados do módulo
        const moduleData = await fetchModuleData(module.id)
        
        return {
          ...module,
          lastUpdate: new Date(),
          data: moduleData
        }
      })

      const updatedModules = await Promise.all(syncPromises)
      
      // Atualizar estado global do sistema
      updateSystemData(updatedModules)
      
      setLastSync(new Date())
      displayMessage('Sincronização automática concluída!', 'success')
      
    } catch (error) {
      displayMessage('Erro na sincronização automática', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para buscar dados de um módulo específico
  const fetchModuleData = async (moduleId: string) => {
    // Simular busca de dados reais do sistema
    switch (moduleId) {
      case 'orders':
        return {
          total: Math.floor(Math.random() * 1000) + 500,
          pending: Math.floor(Math.random() * 50) + 10,
          completed: Math.floor(Math.random() * 800) + 400,
          revenue: Math.floor(Math.random() * 50000) + 25000
        }
      case 'menu':
        return {
          totalItems: Math.floor(Math.random() * 200) + 100,
          lowStock: Math.floor(Math.random() * 20) + 5,
          outOfStock: Math.floor(Math.random() * 10) + 1
        }
      case 'teams':
        return {
          totalEmployees: Math.floor(Math.random() * 50) + 20,
          online: Math.floor(Math.random() * 30) + 10,
          working: Math.floor(Math.random() * 40) + 15
        }
      case 'financial':
        return {
          revenue: Math.floor(Math.random() * 100000) + 50000,
          expenses: Math.floor(Math.random() * 60000) + 30000,
          profit: Math.floor(Math.random() * 40000) + 20000
        }
      default:
        return {}
    }
  }

  // Função para atualizar dados do sistema
  const updateSystemData = (modules: any[]) => {
    const newSystemData = { ...systemData }
    
    modules.forEach(module => {
      if (module.data) {
        newSystemData[module.id as keyof typeof systemData] = module.data
      }
    })
    
    setSystemData(newSystemData)
  }

  // Função para monitoramento em tempo real
  const startRealTimeMonitoring = () => {
    const interval = setInterval(() => {
      // Atualizar métricas em tempo real
      setRealTimeMetrics(prev => ({
        activeUsers: Math.floor(Math.random() * 100) + 50,
        currentOrders: Math.floor(Math.random() * 50) + 20,
        systemHealth: Math.random() > 0.8 ? 'warning' : 'excellent'
      }))
    }, 30000) // A cada 30 segundos

    return () => clearInterval(interval)
  }

  // Efeito para sincronização automática
  useEffect(() => {
    if (autoSyncEnabled) {
      // Sincronização inicial
      syncAllModules()
      
      // Configurar sincronização automática
      const autoSyncInterval = setInterval(() => {
        syncAllModules()
      }, syncInterval * 60 * 1000) // Converter minutos para milissegundos

      return () => clearInterval(autoSyncInterval)
    }
  }, [autoSyncEnabled, syncInterval])

  // Efeito para monitoramento em tempo real
  useEffect(() => {
    const cleanup = startRealTimeMonitoring()
    return cleanup
  }, [])

  // Função para buscar dados
  const handleSearch = () => {
    if (!selectedModule) {
      displayMessage('Selecione um módulo primeiro!', 'error')
      return
    }

    setIsLoading(true)
    
    // Busca integrada com dados do sistema
    setTimeout(() => {
      setIsLoading(false)
      displayMessage('Busca integrada realizada com sucesso!', 'success')
    }, 2000)
  }

  // Função para gerar relatório integrado
  const generateReport = () => {
    if (!selectedModule) {
      displayMessage('Selecione um módulo primeiro!', 'error')
      return
    }

    setIsGeneratingReport(true)
    
    // Geração integrada com dados do sistema
    setTimeout(() => {
      const newReport = {
        id: Date.now(),
        module: selectedModule,
        moduleName: availableModules.find(m => m.id === selectedModule)?.name,
        period: selectedPeriod,
        type: reportType,
        delivery: deliveryMethod,
        generatedAt: new Date().toLocaleString('pt-BR'),
        dataSource: 'integrated-system',
        lastSync: lastSync.toLocaleString('pt-BR')
      }
      
      setGeneratedReports(prev => [newReport, ...prev])
      displayMessage('Relatório integrado gerado com sucesso!', 'success')
      setShowReportConfig(false)
      setIsGeneratingReport(false)
    }, 3000)
  }

  // Função para análise de IA integrada
  const runAIAnalysis = () => {
    setIsLoading(true)
    
    // Análise integrada com dados do sistema
    setTimeout(() => {
      setIsLoading(false)
      displayMessage('Análise de IA integrada concluída!', 'success')
      setShowAIAnalysis(true)
    }, 2000)
  }

  // Função para configurar relatórios automáticos
  const configureAutoReports = () => {
    displayMessage('Configurando relatórios automáticos integrados...', 'success')
    
    setTimeout(() => {
      displayMessage('Sistema de relatórios automáticos integrado configurado!', 'success')
    }, 1500)
  }

  // Função para visualizar relatório de exemplo
  const previewReport = () => {
    if (!selectedModule) {
      displayMessage('Selecione um módulo primeiro!', 'error')
      return
    }
    
    displayMessage('Visualizando relatório integrado de exemplo...', 'success')
  }

  // Função para limpar filtros
  const clearFilters = () => {
    setSelectedModule('')
    setSelectedPeriod('month')
    setStartDate('')
    setEndDate('')
    setSearchTerm('')
    displayMessage('Filtros limpos com sucesso!', 'success')
  }

  // Função para exportar relatório
  const exportSpecificReport = (reportId: number) => {
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      displayMessage('Relatório integrado exportado com sucesso!', 'success')
    }, 1500)
  }

  // Função para remover relatório
  const removeReport = (reportId: number) => {
    setGeneratedReports(prev => prev.filter(r => r.id !== reportId))
    displayMessage('Relatório removido com sucesso!', 'success')
  }

  // Função para atualizar dados
  const refreshData = () => {
    syncAllModules()
  }

  return (
    <div className="space-y-8">
      {/* Mensagem de Sucesso/Erro */}
      {showMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all duration-300 ${
          messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="font-medium">{messageText}</span>
          </div>
        </div>
      )}

      {/* Header Principal com Status de Integração */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-3">Gerador de Relatórios Integrado</h1>
            <p className="text-slate-300 text-lg">Sistema inteligente com fluxo automático integrado a todos os módulos</p>
            
            {/* Status de Integração */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-300">Sistema Integrado</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-300" />
                <span className="text-sm text-blue-300">Última Sincronização: {lastSync.toLocaleTimeString('pt-BR')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-300">Monitoramento Ativo</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="btn-secondary px-6 py-3 rounded-xl flex items-center space-x-3 shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="font-medium">
                {isLoading ? 'Sincronizando...' : 'Sincronizar Sistema'}
              </span>
            </button>
            <button
              onClick={runAIAnalysis}
              disabled={isLoading}
              className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-3 shadow-lg disabled:opacity-50"
            >
              <Brain className="w-5 h-5" />
              <span className="font-medium">Análise de IA</span>
            </button>
            <button
              onClick={configureAutoReports}
              className="btn-outline px-6 py-3 rounded-xl flex items-center space-x-3 shadow-lg"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Relatórios Automáticos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status de Integração dos Módulos */}
      <div className="card-primary rounded-2xl shadow-xl">
        <div className="p-6 border-b border-adaptive">
          <h3 className="label-primary text-xl mb-4">Status de Integração do Sistema</h3>
          <p className="text-secondary">Monitoramento em tempo real de todos os módulos integrados</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableModules.map((module) => {
              const IconComponent = module.icon
              const moduleData = systemData[module.id as keyof typeof systemData]
              const isSelected = selectedModule === module.id
              
              return (
                <div key={module.id} className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25' 
                    : 'border-adaptive hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                  
                  <h4 className="label-primary mb-2">{module.name}</h4>
                  <p className="text-secondary mb-4">Integrado e sincronizado</p>
                  
                  {/* Métricas em tempo real */}
                  <div className="space-y-2">
                    {moduleData && Object.entries(moduleData).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-xs">
                        <span className="text-muted capitalize">{key}:</span>
                        <span className="font-medium text-primary">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-xs text-muted">
                    Última atualização: {module.lastUpdate.toLocaleTimeString('pt-BR')}
                  </div>
                  
                  <button
                    onClick={() => setSelectedModule(module.id)}
                    className="btn-primary w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Selecionar
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Métricas do Sistema em Tempo Real */}
      <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border`}>
        <div className={`p-6 border-b ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Métricas do Sistema em Tempo Real</h3>
          <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Monitoramento contínuo de performance e saúde do sistema</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'} p-6 rounded-xl border`}>
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-600">Ativo</span>
                </div>
              </div>
              <h4 className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-900'} mb-2`}>{realTimeMetrics.activeUsers}</h4>
              <p className={`text-sm ${currentTheme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Usuários Ativos</p>
            </div>
            
            <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'} p-6 rounded-xl border`}>
              <div className="flex items-center justify-between mb-4">
                <ShoppingCart className="w-8 h-8 text-green-600" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-600">Processando</span>
                </div>
              </div>
              <h4 className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-green-300' : 'text-green-900'} mb-2`}>{realTimeMetrics.currentOrders}</h4>
              <p className={`text-sm ${currentTheme === 'dark' ? 'text-green-200' : 'text-green-700'}`}>Pedidos Ativos</p>
              <div className="mt-2 flex items-center text-green-600 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>+8%</span>
              </div>
            </div>
            
            <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'} p-6 rounded-xl border`}>
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-purple-600" />
                <div className={`flex items-center space-x-2`}>
                  <div className={`w-2 h-2 rounded-full ${
                    realTimeMetrics.systemHealth === 'excellent' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className={`text-xs ${
                    realTimeMetrics.systemHealth === 'excellent' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {realTimeMetrics.systemHealth === 'excellent' ? 'Excelente' : 'Atenção'}
                  </span>
                </div>
              </div>
              <h4 className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-900'} mb-2`}>99.9%</h4>
              <p className={`text-sm ${currentTheme === 'dark' ? 'text-purple-200' : 'text-purple-700'}`}>Uptime do Sistema</p>
              <div className="mt-2 flex items-center text-green-600 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>Estável</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Período e Busca */}
      <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border`}>
        <div className={`p-6 border-b ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Período de Análise e Busca Integrada</h3>
          <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Defina o intervalo de tempo e busque dados específicos do sistema integrado</p>
        </div>
        
        <div className="p-6">
          {/* Períodos */}
          <div className="mb-6">
            <label className={`${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-3`}>Período Padrão</label>
            <div className="flex items-center space-x-4">
              {periods.map((period) => {
                const IconComponent = period.icon
                return (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 ${
                      selectedPeriod === period.id 
                        ? 'btn-primary shadow-lg' 
                        : 'btn-ghost'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{period.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Datas Específicas */}
          <div className="mb-6">
            <label className={`${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-3`}>Datas Específicas (Opcional)</label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`input-primary w-full px-4 py-3 rounded-xl ${
                    currentTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`input-primary w-full px-4 py-3 rounded-xl ${
                    currentTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Busca e Filtros */}
          <div className="mb-6">
            <label className={`${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-3`}>Busca e Filtros Integrados</label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite termos de busca no sistema integrado..."
                  className={`input-primary w-full px-4 py-3 rounded-xl ${
                    currentTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading || !selectedModule}
                className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center space-x-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Buscando...' : 'Buscar'}</span>
              </button>
              <button
                onClick={clearFilters}
                className="btn-secondary px-6 py-3 rounded-xl font-medium"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações Avançadas */}
      <div className="card-primary rounded-2xl shadow-xl">
        <div className="p-6 border-b border-adaptive">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="label-primary text-xl">Configurações Avançadas</h3>
              <p className="text-secondary">Personalize seu relatório com opções avançadas</p>
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="btn-ghost text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center space-x-2 font-medium"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros Avançados</span>
              {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="p-6 border-t border-adaptive">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-primary mb-2">Tipo de Relatório</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="input-primary w-full px-4 py-3 rounded-xl"
                >
                  {reportTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label-primary mb-2">Método de Entrega</label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="input-primary w-full px-4 py-3 rounded-xl"
                >
                  {deliveryMethods.map(method => (
                    <option key={method.id} value={method.id}>{method.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {deliveryMethod === 'email' && (
              <div className="mt-6">
                <label className="label-primary mb-2">Email do Destinatário</label>
                <input
                  type="email"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  placeholder="exemplo@empresa.com"
                  className="input-primary w-full px-4 py-3 rounded-xl"
                />
              </div>
            )}

            {/* Configurações de Sincronização Automática */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Configurações de Sincronização Automática</h4>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={autoSyncEnabled}
                    onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-800">Ativar sincronização automática</span>
                </label>
                
      <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Intervalo de Sincronização (minutos)</label>
                  <select
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 minuto</option>
                    <option value={5}>5 minutos</option>
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={60}>1 hora</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Ações de Relatório */}
      <div className="card-primary rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h3 className="label-primary text-2xl mb-4">Gerar Relatório Integrado</h3>
          <p className="text-secondary mb-8">
            {selectedModule 
              ? `Pronto para gerar relatório integrado do módulo ${availableModules.find(m => m.id === selectedModule)?.name}`
              : 'Selecione um módulo para começar'
            }
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={previewReport}
              disabled={!selectedModule}
              className="btn-secondary px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Eye className="w-5 h-5" />
              <span>Visualizar Exemplo</span>
            </button>
            
            <button
              onClick={() => setShowReportConfig(true)}
              disabled={!selectedModule}
              className="btn-primary px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transform hover:-translate-y-1"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Configurar Relatório</span>
            </button>
          </div>
        </div>
      </div>

      {/* Relatórios Gerados */}
      {generatedReports.length > 0 && (
        <div className="card-primary rounded-2xl shadow-xl">
          <div className="p-6 border-b border-adaptive">
            <h3 className="label-primary text-xl">Relatórios Integrados Gerados</h3>
            <p className="text-secondary">Histórico dos relatórios criados com dados do sistema integrado</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {generatedReports.map((report) => (
                <div key={report.id} className="bg-adaptive p-4 rounded-xl border border-adaptive">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="label-primary">
                            {report.moduleName} - {reportTypes.find(t => t.id === report.type)?.label}
                          </h4>
                          <p className="text-secondary">
                            Período: {periods.find(p => p.id === report.period)?.label} | 
                            Gerado em: {report.generatedAt}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Fonte: {report.dataSource} | Sincronizado: {report.lastSync}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => exportSpecificReport(report.id)}
                        disabled={isLoading}
                        className="btn-success px-4 py-2 rounded-lg font-medium text-sm"
                      >
                        {isLoading ? 'Exportando...' : 'Exportar'}
                      </button>
                      <button
                        onClick={() => removeReport(report.id)}
                        className="btn-danger px-4 py-2 rounded-lg font-medium text-sm"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configuração de Relatório */}
      {showReportConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Configuração do Relatório Integrado</h3>
                <button
                  onClick={() => setShowReportConfig(false)}
                  className="btn-ghost text-white/80 hover:text-white transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Resumo da Configuração */}
                <div className="bg-adaptive p-6 rounded-xl">
                  <h4 className="label-primary mb-4">Resumo da Configuração Integrada</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-secondary">Módulo:</span>
                      <span className="ml-2 text-primary font-medium">
                        {availableModules.find(m => m.id === selectedModule)?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-secondary">Período:</span>
                      <span className="ml-2 text-primary font-medium">
                        {periods.find(p => p.id === selectedPeriod)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-secondary">Tipo:</span>
                      <span className="ml-2 text-primary font-medium">
                        {reportTypes.find(t => t.id === reportType)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-secondary">Entrega:</span>
                      <span className="ml-2 text-primary font-medium">
                        {deliveryMethods.find(d => d.id === deliveryMethod)?.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status de Integração */}
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800 font-medium">Sistema Integrado e Sincronizado</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Dados coletados automaticamente de todos os módulos do sistema
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-adaptive">
                <button
                  onClick={() => setShowReportConfig(false)}
                  className="btn-ghost px-6 py-3 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={generateReport}
                  disabled={isGeneratingReport}
                  className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center space-x-3 shadow-lg disabled:opacity-50"
                >
                  {isGeneratingReport ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Gerando...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Gerar Relatório Integrado</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Análise de IA */}
      {showAIAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Análise de IA Integrada Concluída</h3>
                <button
                  onClick={() => setShowAIAnalysis(false)}
                  className="btn-ghost text-white/80 hover:text-white transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Análise de Vendas Integrada</span>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    Padrões de consumo identificados com dados em tempo real de todos os módulos
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="text-green-800 font-medium">Previsões de Demanda Inteligentes</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Estimativas baseadas em dados integrados de pedidos, estoque e equipes
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-800 font-medium">Otimizações Sistêmicas</span>
                  </div>
                  <p className="text-sm text-purple-700 mt-2">
                    Recomendações para melhorar performance de todo o sistema integrado
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-secondary mb-4">
                  Todos os insights de IA estão baseados em dados integrados em tempo real
                </p>
                <button
                  onClick={() => setShowAIAnalysis(false)}
                  className="btn-primary px-6 py-3 rounded-xl font-bold"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}