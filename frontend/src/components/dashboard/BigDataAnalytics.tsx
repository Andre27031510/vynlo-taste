'use client'

import { useState, useEffect } from 'react'
import { 
  Database, TrendingUp, Brain, Target, Zap, AlertCircle, 
  RefreshCw, Settings, Download, Upload, Play, Pause, 
  CheckCircle, X, ArrowUpRight, Activity
} from 'lucide-react'
import { useThemeContext } from '../../contexts/ThemeContext'

export default function BigDataAnalytics() {
  const { currentTheme } = useThemeContext()
  // Estados para funcionalidades
  const [isLoading, setIsLoading] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [isProcessing, setIsProcessing] = useState(false)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)
  const [lastSync, setLastSync] = useState(new Date())

  // Estados para dados dinâmicos
  const [insights, setInsights] = useState([
    { 
      id: 1,
      type: 'prediction', 
      title: 'Pico de vendas previsto', 
      description: 'Sexta-feira às 19h - aumento de 35%', 
      confidence: 95,
      status: 'active',
      applied: false
    },
    { 
      id: 2,
      type: 'optimization', 
      title: 'Otimização de cardápio', 
      description: 'Remover "Salada Caesar" - baixa demanda', 
      confidence: 87,
      status: 'pending',
      applied: false
    },
    { 
      id: 3,
      type: 'trend', 
      title: 'Tendência sazonal', 
      description: 'Bebidas quentes aumentam 40% no inverno', 
      confidence: 92,
      status: 'active',
      applied: true
    }
  ])

  // Estados para métricas em tempo real
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    dataPoints: 156000,
    accuracy: 95,
    optimization: 87,
    processingSpeed: '24/7',
    activeModels: 3,
    lastUpdate: new Date()
  })

  // Estados para análise preditiva
  const [predictiveData, setPredictiveData] = useState([85, 92, 78, 95, 88, 102, 96])

  // Estados para modelos de ML
  const [mlModels, setMlModels] = useState([
    {
      id: 'demand-forecast',
      name: 'Previsão de Demanda',
      description: 'Prevê vendas futuras baseado em histórico',
      accuracy: 95,
      status: 'active',
      lastTraining: new Date()
    },
    {
      id: 'price-optimization',
      name: 'Otimização de Preços',
      description: 'Sugere preços ideais por produto',
      accuracy: 87,
      status: 'training',
      lastTraining: new Date()
    },
    {
      id: 'behavior-analysis',
      name: 'Análise de Comportamento',
      description: 'Identifica padrões dos clientes',
      accuracy: 92,
      status: 'active',
      lastTraining: new Date()
    }
  ])

  // Função para mostrar mensagens
  const displayMessage = (text: string, type: 'success' | 'error') => {
    setMessageText(text)
    setMessageType(type)
    setShowMessage(true)
    
    setTimeout(() => {
      setShowMessage(false)
    }, 3000)
  }

  // Função para sincronizar dados com o sistema
  const syncDataWithSystem = async () => {
    setIsLoading(true)
    
    try {
      // Simular sincronização com todos os módulos do sistema
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Atualizar métricas com dados reais
      setRealTimeMetrics(prev => ({
        ...prev,
        dataPoints: Math.floor(Math.random() * 200000) + 100000,
        accuracy: Math.floor(Math.random() * 10) + 90,
        optimization: Math.floor(Math.random() * 15) + 80,
        lastUpdate: new Date()
      }))
      
      setLastSync(new Date())
      displayMessage('Dados sincronizados com o sistema com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro na sincronização de dados', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para aplicar insight
  const applyInsight = async (insightId: number) => {
    setIsProcessing(true)
    
    try {
      // Simular aplicação do insight
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setInsights(prev => prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, applied: true, status: 'applied' }
          : insight
      ))
      
      displayMessage('Insight aplicado com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro ao aplicar insight', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Função para executar análise preditiva
  const runPredictiveAnalysis = async () => {
    setIsProcessing(true)
    
    try {
      // Simular análise preditiva
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Gerar novos dados preditivos
      const newPredictiveData = Array.from({ length: 7 }, () => 
        Math.floor(Math.random() * 40) + 70
      )
      
      setPredictiveData(newPredictiveData)
      displayMessage('Análise preditiva executada com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro na análise preditiva', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Função para exportar dados
  const exportData = async (format: string) => {
    setIsLoading(true)
    
    try {
      // Simular exportação
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      displayMessage(`Dados exportados em ${format} com sucesso!`, 'success')
      
    } catch (error) {
      displayMessage('Erro na exportação de dados', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para importar dados
  const importData = async () => {
    setIsLoading(true)
    
    try {
      // Simular importação
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      displayMessage('Dados importados com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro na importação de dados', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Efeito para sincronização automática
  useEffect(() => {
    if (autoSyncEnabled) {
      const interval = setInterval(() => {
        syncDataWithSystem()
      }, 5 * 60 * 1000) // 5 minutos

      return () => clearInterval(interval)
    }
  }, [autoSyncEnabled])

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
      <div className="flex justify-between items-start">
      <div>
          <h1 className="text-3xl font-bold text-gray-900">Big Data Analytics</h1>
          <p className="text-gray-600">Análise avançada com inteligência artificial integrada ao sistema</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={syncDataWithSystem}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 shadow-lg shadow-blue-600/25 disabled:bg-blue-400"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="font-medium">
              {isLoading ? 'Sincronizando...' : 'Sincronizar Sistema'}
            </span>
          </button>
          
          <button
            onClick={runPredictiveAnalysis}
            disabled={isProcessing}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 shadow-lg shadow-purple-600/25 disabled:bg-purple-400"
          >
            <Brain className="w-5 h-5" />
            <span className="font-medium">
              {isProcessing ? 'Analisando...' : 'Análise Preditiva'}
            </span>
          </button>
        </div>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-purple-600 text-sm font-medium">IA Ativa</span>
          </div>
          <h3 className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>{realTimeMetrics.accuracy}%</h3>
          <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Precisão Preditiva</p>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+2.3%</span>
          </div>
        </div>

        <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-blue-600 text-sm font-medium">Dados</span>
          </div>
          <h3 className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>{realTimeMetrics.dataPoints.toLocaleString()}</h3>
          <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Pontos de Dados</p>
          <div className="mt-2 flex items-center text-blue-600 text-sm">
            <Activity className="w-4 h-4 mr-1" />
            <span>Em tempo real</span>
          </div>
        </div>

        <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">Otimização</span>
          </div>
          <h3 className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>{realTimeMetrics.optimization}%</h3>
          <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Taxa de Sucesso</p>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+5.2%</span>
          </div>
        </div>

        <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-yellow-600 text-sm font-medium">Modelos</span>
          </div>
          <h3 className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>{realTimeMetrics.activeModels}</h3>
          <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Ativos</p>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Funcionando</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border`}>
        <div className={`p-6 border-b ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className={`text-xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Insights da Inteligência Artificial</h3>
        </div>
        
        <div className={`divide-y ${currentTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-100'}`}>
          {insights.map((insight, index) => (
            <div key={insight.id} className={`p-6 hover:${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-200`}>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{insight.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.confidence >= 90 ? 'bg-green-100 text-green-800' :
                      insight.confidence >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {insight.confidence}% confiança
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      insight.status === 'applied' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {insight.status === 'active' ? 'Ativo' : 
                       insight.status === 'applied' ? 'Aplicado' : 'Pendente'}
                    </span>
                  </div>
                  <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{insight.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!insight.applied ? (
                    <button 
                      onClick={() => applyInsight(insight.id)}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium disabled:bg-gray-400"
                    >
                      {isProcessing ? 'Aplicando...' : 'Aplicar'}
                  </button>
                  ) : (
                    <span className="text-green-600 text-sm font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Aplicado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive Analytics */}
      <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Análise Preditiva - Próximos 7 Dias</h3>
          <button
            onClick={runPredictiveAnalysis}
            disabled={isProcessing}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium disabled:bg-purple-400"
          >
            {isProcessing ? 'Analisando...' : 'Executar Análise'}
          </button>
        </div>
        
        <div className="h-64 bg-gradient-to-t from-purple-50 to-transparent rounded-xl p-4 flex items-end justify-between">
          {predictiveData.map((value, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all duration-500"
                style={{ height: `${(value / 120) * 200}px` }}
              ></div>
              <span className="text-xs text-gray-500">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}
              </span>
              <span className="text-xs text-purple-600 font-bold">{value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Machine Learning Models */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Modelos de Machine Learning</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportData('JSON')}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium disabled:bg-blue-400"
            >
              <Download className="w-4 h-4 mr-1" />
              Exportar
            </button>
            <button
              onClick={importData}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium disabled:bg-green-400"
            >
              <Upload className="w-4 h-4 mr-1" />
              Importar
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mlModels.map((model) => (
            <div key={model.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{model.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  model.status === 'active' ? 'bg-green-100 text-green-800' :
                  model.status === 'training' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {model.status === 'active' ? 'Ativo' : 
                   model.status === 'training' ? 'Treinando' : 'Inativo'}
                </span>
          </div>
          
              <p className="text-sm text-gray-600 mb-3">{model.description}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className={`h-2 rounded-full ${
                  model.accuracy >= 90 ? 'bg-green-600' :
                  model.accuracy >= 80 ? 'bg-blue-600' :
                  'bg-yellow-600'
                }`} style={{ width: `${model.accuracy}%` }}></div>
          </div>
          
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${
                  model.accuracy >= 90 ? 'text-green-600' :
                  model.accuracy >= 80 ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {model.accuracy}% precisão
                </span>
                <span className="text-xs text-gray-500">
                  {model.lastTraining.toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}