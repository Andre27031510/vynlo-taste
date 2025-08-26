'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, Smartphone, Globe, Truck, CheckCircle, AlertCircle, 
  Settings, Plus, RefreshCw, Zap, Wifi, WifiOff, TestTube,
  Download, Upload, Play, Pause, X, ArrowUpRight, Activity,
  Bell, Shield, Database, Link, Unlink, RotateCcw
} from 'lucide-react'
import { useThemeContext } from '../../contexts/ThemeContext'

export default function MultiChannelIntegration() {
  const { currentTheme } = useThemeContext()
  // Estados para funcionalidades
  const [isLoading, setIsLoading] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showNewIntegrationModal, setShowNewIntegrationModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)
  const [syncInterval, setSyncInterval] = useState(2) // minutos

  // Estados para dados dinâmicos
  const [integrations, setIntegrations] = useState<any[]>([
    { 
      id: 'whatsapp', 
      name: 'WhatsApp Business', 
      status: 'connected', 
      orders: 45, 
      icon: MessageSquare, 
      color: 'green',
      lastSync: new Date(),
      health: 'excellent',
      apiKey: 'wapp_123456',
      webhookUrl: 'https://api.whatsapp.com/webhook',
      autoReply: true,
      notifications: true
    },
    { 
      id: 'ifood', 
      name: 'iFood', 
      status: 'connected', 
      orders: 32, 
      icon: Truck, 
      color: 'red',
      lastSync: new Date(),
      health: 'good',
      apiKey: 'ifood_789012',
      webhookUrl: 'https://api.ifood.com/webhook',
      autoReply: true,
      notifications: true
    },
    { 
      id: 'ubereats', 
      name: 'Uber Eats', 
      status: 'connected', 
      orders: 28, 
      icon: Truck, 
      color: 'black',
      lastSync: new Date(),
      health: 'warning',
      apiKey: 'uber_345678',
      webhookUrl: 'https://api.ubereats.com/webhook',
      autoReply: false,
      notifications: true
    },
    { 
      id: 'website', 
      name: 'Site Próprio', 
      status: 'pending', 
      orders: 0, 
      icon: Globe, 
      color: 'blue',
      lastSync: null,
      health: 'disconnected',
      apiKey: null,
      webhookUrl: null,
      autoReply: false,
      notifications: false
    },
    { 
      id: 'app', 
      name: 'App Mobile', 
      status: 'disconnected', 
      orders: 0, 
      icon: Smartphone, 
      color: 'purple',
      lastSync: null,
      health: 'disconnected',
      apiKey: null,
      webhookUrl: null,
      autoReply: false,
      notifications: false
    }
  ])

  // Estados para métricas em tempo real
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    totalIntegrations: 5,
    activeIntegrations: 3,
    totalOrders: 105,
    syncRate: 99.9,
    lastUpdate: new Date(),
    healthScore: 87
  })

  // Estados para nova integração
  const [newIntegrationForm, setNewIntegrationForm] = useState({
    name: '',
    type: 'delivery',
    apiKey: '',
    webhookUrl: '',
    autoReply: true,
    notifications: true
  })

  // Estados para configurações
  const [settingsForm, setSettingsForm] = useState({
    globalAutoReply: true,
    globalNotifications: true,
    syncFrequency: 2,
    webhookTimeout: 30,
    retryAttempts: 3
  })

  // Função para mostrar mensagens
  const displayMessage = (text: string, type: 'success' | 'error') => {
    setMessageText(text)
    setMessageType(type)
    setShowMessage(true)
    
    setTimeout(() => {
      setShowMessage(false)
    }, 3000)
  }

  // Função para sincronizar todas as integrações
  const syncAllIntegrations = async () => {
    setIsLoading(true)
    
    try {
      // Simular sincronização com todos os canais
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Atualizar métricas com dados reais
      setRealTimeMetrics(prev => ({
        ...prev,
        totalOrders: Math.floor(Math.random() * 200) + 50,
        syncRate: Math.floor(Math.random() * 5) + 95,
        healthScore: Math.floor(Math.random() * 20) + 80,
        lastUpdate: new Date()
      }))
      
      // Atualizar status das integrações
      updateIntegrationStatuses()
      
      displayMessage('Todas as integrações foram sincronizadas com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro na sincronização das integrações', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para atualizar status das integrações
  const updateIntegrationStatuses = () => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.status === 'connected') {
        return {
          ...integration,
          orders: Math.floor(Math.random() * 100) + 10,
          lastSync: new Date(),
          health: Math.random() > 0.8 ? 'excellent' : 
                 Math.random() > 0.6 ? 'good' : 'warning',
          apiKey: integration.apiKey || '',
          webhookUrl: integration.webhookUrl || ''
        }
      }
      return integration
    }))
  }

  // Função para conectar integração
  const connectIntegration = async (integrationId: string) => {
    setIsProcessing(true)
    
    try {
      // Simular conexão
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: 'connected', 
              lastSync: new Date(),
              health: 'good',
              orders: Math.floor(Math.random() * 50) + 5,
              apiKey: integration.apiKey || '',
              webhookUrl: integration.webhookUrl || ''
            }
          : integration
      ))
      
      displayMessage('Integração conectada com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro ao conectar integração', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Função para desconectar integração
  const disconnectIntegration = async (integrationId: string) => {
    setIsProcessing(true)
    
    try {
      // Simular desconexão
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: 'disconnected', 
              lastSync: null,
              health: 'disconnected',
              orders: 0,
              apiKey: null,
              webhookUrl: null
            }
          : integration
      ))
      
      displayMessage('Integração desconectada com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro ao desconectar integração', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Função para testar integração
  const testIntegration = async (integrationId: string) => {
    setIsProcessing(true)
    
    try {
      // Simular teste
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Atualizar health da integração
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, health: 'excellent' }
          : integration
      ))
      
      displayMessage('Teste de integração realizado com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro no teste de integração', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Função para configurar integração
  const configureIntegration = (integration: any) => {
    setSelectedIntegration(integration)
    setShowSettingsModal(true)
  }

  // Função para salvar configurações
  const saveSettings = async () => {
    setIsProcessing(true)
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Atualizar integração com novas configurações
      if (selectedIntegration) {
        setIntegrations(prev => prev.map(integration => 
          integration.id === selectedIntegration.id 
            ? { ...integration, ...settingsForm }
            : integration
        ))
      }
      
      setShowSettingsModal(false)
      displayMessage('Configurações salvas com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro ao salvar configurações', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Função para adicionar nova integração
  const addNewIntegration = async () => {
    setIsProcessing(true)
    
    try {
      // Simular criação
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newIntegration = {
        id: `integration_${Date.now()}`,
        name: newIntegrationForm.name,
                  status: 'pending',
        orders: 0,
        icon: Globe,
        color: 'blue',
        lastSync: null,
                  health: 'disconnected',
        apiKey: newIntegrationForm.apiKey,
        webhookUrl: newIntegrationForm.webhookUrl,
        autoReply: newIntegrationForm.autoReply,
        notifications: newIntegrationForm.notifications
      }
      
      setIntegrations(prev => [...prev, newIntegration])
      setShowNewIntegrationModal(false)
      setNewIntegrationForm({
        name: '',
        type: 'delivery',
        apiKey: '',
        webhookUrl: '',
        autoReply: true,
        notifications: true
      })
      
      displayMessage('Nova integração criada com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro ao criar integração', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Função para exportar configurações
  const exportConfigurations = async () => {
    setIsLoading(true)
    
    try {
      // Simular exportação
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      displayMessage('Configurações exportadas com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro na exportação', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para importar configurações
  const importConfigurations = async () => {
    setIsLoading(true)
    
    try {
      // Simular importação
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      displayMessage('Configurações importadas com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro na importação', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para atualizar configurações de uma integração
  const updateIntegrationConfig = (id: string, key: string, value: any) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id ? { ...integration, [key]: value } : integration
    ))
  }

  // Efeito para sincronização automática
  useEffect(() => {
    if (autoSyncEnabled) {
      const interval = setInterval(() => {
        syncAllIntegrations()
      }, syncInterval * 60 * 1000)

      return () => clearInterval(interval)
    }
  }, [autoSyncEnabled, syncInterval])

  // Efeito para monitoramento em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Atualizar métricas em tempo real
      setRealTimeMetrics(prev => ({
        ...prev,
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 5),
        lastUpdate: new Date()
      }))
    }, 30000) // A cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Mensagem de Sucesso/Erro */}
      {showMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all duration-300 ${
          messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{messageText}</span>
          </div>
        </div>
      )}

      {/* Header com Controles */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integração Multi-Canal</h1>
          <p className="text-gray-600">Centralize pedidos de todos os canais integrado ao sistema</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={syncAllIntegrations}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 shadow-lg shadow-green-600/25 disabled:bg-green-400"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="font-medium">
              {isLoading ? 'Sincronizando...' : 'Sincronizar Tudo'}
            </span>
          </button>
          
          <button
            onClick={() => setShowNewIntegrationModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nova Integração</span>
        </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">{realTimeMetrics.activeIntegrations} ativas</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{realTimeMetrics.totalIntegrations}</h3>
          <p className="text-gray-600 text-sm">Integrações</p>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+2</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-blue-600 text-sm font-medium">+23%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{realTimeMetrics.totalOrders}</h3>
          <p className="text-gray-600 text-sm">Pedidos Hoje</p>
          <div className="mt-2 flex items-center text-blue-600 text-sm">
            <Activity className="w-4 h-4 mr-1" />
            <span>Em tempo real</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-purple-600 text-sm font-medium">WhatsApp</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">43%</h3>
          <p className="text-gray-600 text-sm">Canal Principal</p>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Ativo</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-yellow-600 text-sm font-medium">{realTimeMetrics.syncRate}%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Sync</h3>
          <p className="text-gray-600 text-sm">Sincronização</p>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <Zap className="w-4 h-4 mr-1" />
            <span>Automático</span>
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const IconComponent = integration.icon
          const statusColor = integration.status === 'connected' ? 'green' : 
                             integration.status === 'pending' ? 'yellow' : 'red'
          
          return (
            <div key={integration.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${integration.color}-100 rounded-xl flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 text-${integration.color}-600`} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColor === 'green' ? 'bg-green-100 text-green-800' :
                  statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {integration.status === 'connected' ? 'Conectado' :
                   integration.status === 'pending' ? 'Pendente' : 'Desconectado'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{integration.name}</h3>
              
              <div className="mb-4">
                <p className="text-2xl font-bold text-gray-900">{integration.orders}</p>
                <p className="text-sm text-gray-600">Pedidos hoje</p>
                {integration.lastSync && (
                  <p className="text-xs text-gray-500 mt-1">
                    Última sinc: {integration.lastSync.toLocaleTimeString('pt-BR')}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                {integration.status === 'connected' ? (
                  <>
                    <button 
                      onClick={() => configureIntegration(integration)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                  Configurar
                </button>
                    <button 
                      onClick={() => testIntegration(integration.id)}
                      disabled={isProcessing}
                      className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400"
                    >
                      <TestTube className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => disconnectIntegration(integration.id)}
                      disabled={isProcessing}
                      className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:bg-red-400"
                    >
                      <Unlink className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => connectIntegration(integration.id)}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm disabled:bg-green-400"
                  >
                    {isProcessing ? 'Conectando...' : 'Conectar'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* WhatsApp Integration Details */}
      <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>WhatsApp Business - Configuração</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportConfigurations}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm disabled:bg-blue-400"
            >
              <Download className="w-4 h-4 mr-1" />
              Exportar
            </button>
            <button
              onClick={importConfigurations}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm disabled:bg-green-400"
            >
              <Upload className="w-4 h-4 mr-1" />
              Importar
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configurações de API */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border`}>
            <h4 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Configurações de API</h4>
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>API Key</label>
                <input
                  type="text"
                  value={integrations.find(i => i.id === 'whatsapp')?.apiKey || ''}
                  onChange={(e) => updateIntegrationConfig('whatsapp', 'apiKey', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    currentTheme === 'dark' 
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="wapp_123456"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Webhook URL</label>
                <input
                  type="url"
                  value={integrations.find(i => i.id === 'whatsapp')?.webhookUrl || ''}
                  onChange={(e) => updateIntegrationConfig('whatsapp', 'webhookUrl', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    currentTheme === 'dark' 
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="https://api.whatsapp.com/webhook"
                />
              </div>
            </div>
          </div>
          
          {/* Configurações de Notificações */}
          <div className={`${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border`}>
            <h4 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Configurações de Notificações</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Resposta Automática</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={integrations.find(i => i.id === 'whatsapp')?.autoReply || false}
                    onChange={(e) => updateIntegrationConfig('whatsapp', 'autoReply', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Notificações Push</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={integrations.find(i => i.id === 'whatsapp')?.notifications || false}
                    onChange={(e) => updateIntegrationConfig('whatsapp', 'notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status e Métricas */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Status e Métricas</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-green-50'} p-3 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-600' : 'border-green-200'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Conectado</span>
              </div>
              <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-300' : 'text-green-600'} mt-1`}>Última sinc: {integrations.find(i => i.id === 'whatsapp')?.lastSync?.toLocaleTimeString('pt-BR')}</p>
            </div>
            <div className={`${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} p-3 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-600' : 'border-blue-200'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>Pedidos Hoje</span>
              </div>
              <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-300' : 'text-blue-600'} mt-1`}>{integrations.find(i => i.id === 'whatsapp')?.orders || 0} pedidos</p>
            </div>
            <div className={`${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'} p-3 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-600' : 'border-purple-200'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Saúde</span>
              </div>
              <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-300' : 'text-purple-600'} mt-1`}>{integrations.find(i => i.id === 'whatsapp')?.health === 'excellent' ? 'Excelente' : 'Boa'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nova Integração */}
      {showNewIntegrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Nova Integração</h3>
                <button
                  onClick={() => setShowNewIntegrationModal(false)}
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Nome da Integração</label>
                  <input
                    type="text"
                    value={newIntegrationForm.name}
                    onChange={(e) => setNewIntegrationForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    placeholder="Ex: Instagram Shopping"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Tipo</label>
                  <select
                    value={newIntegrationForm.type}
                    onChange={(e) => setNewIntegrationForm(prev => ({ ...prev, type: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                  >
                    <option value="delivery">Delivery</option>
                    <option value="social">Redes Sociais</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="payment">Pagamento</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">API Key</label>
                  <input
                    type="text"
                    value={newIntegrationForm.apiKey}
                    onChange={(e) => setNewIntegrationForm(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    placeholder="Chave da API"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Webhook URL</label>
                  <input
                    type="url"
                    value={newIntegrationForm.webhookUrl}
                    onChange={(e) => setNewIntegrationForm(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                    placeholder="https://exemplo.com/webhook"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newIntegrationForm.autoReply}
                      onChange={(e) => setNewIntegrationForm(prev => ({ ...prev, autoReply: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-primary">Resposta Automática</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newIntegrationForm.notifications}
                      onChange={(e) => setNewIntegrationForm(prev => ({ ...prev, notifications: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-primary">Notificações</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-adaptive">
                <button
                  onClick={() => setShowNewIntegrationModal(false)}
                  className="btn-ghost px-6 py-3 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={addNewIntegration}
                  disabled={isProcessing || !newIntegrationForm.name}
                  className="btn-primary px-6 py-3 rounded-xl transition-all duration-200 font-bold disabled:opacity-50"
                >
                  {isProcessing ? 'Criando...' : 'Criar Integração'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Configurações */}
      {showSettingsModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Configurações - {selectedIntegration.name}</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">API Key</label>
                  <input
                    type="text"
                    value={selectedIntegration.apiKey || ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Webhook URL</label>
                  <input
                    type="url"
                    value={selectedIntegration.webhookUrl || ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    className="input-primary w-full px-3 py-2 rounded-lg"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedIntegration.autoReply}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, autoReply: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-primary">Resposta Automática</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedIntegration.notifications}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, notifications: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-primary">Notificações</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-adaptive">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="btn-ghost px-6 py-3 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveSettings}
                  disabled={isProcessing}
                  className="btn-success px-6 py-3 rounded-xl transition-all duration-200 font-bold"
                >
                  {isProcessing ? 'Salvando...' : 'Salvar Configurações'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}