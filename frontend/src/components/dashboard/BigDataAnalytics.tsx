'use client'

import { useState } from 'react'
import { 
  Database, 
  Brain, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Zap,
  BarChart3,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'
import { runPredictiveAnalysis, analyzeSalesData, PredictiveAnalysisRequest } from '@/services/amazonQService'
import toast from 'react-hot-toast'

// Skeleton para análises
const AnalysisSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
)

export default function BigDataAnalytics() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<'sales_prediction' | 'customer_behavior' | 'inventory_optimization'>('sales_prediction')
  const [timeframe, setTimeframe] = useState('30d')

  // Dados simulados para análise (em produção viriam da API)
  const mockSalesData = [
    { date: '2024-01-01', sales: 15000, orders: 120, avgTicket: 125 },
    { date: '2024-01-02', sales: 18000, orders: 140, avgTicket: 128 },
    { date: '2024-01-03', sales: 22000, orders: 165, avgTicket: 133 }
  ]

  // Função para executar análise preditiva usando Amazon Q
  const handlePredictiveAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      // Preparar dados para análise
      const analysisRequest: PredictiveAnalysisRequest = {
        type: selectedAnalysisType,
        timeframe,
        data: {
          historicalSales: mockSalesData,
          currentMetrics: {
            totalRevenue: 450000,
            totalOrders: 3500,
            avgOrderValue: 128.57,
            customerRetention: 0.75
          },
          seasonalFactors: {
            month: new Date().getMonth() + 1,
            dayOfWeek: new Date().getDay(),
            isHoliday: false
          }
        }
      }

      // Chamar Amazon Q para análise preditiva
      const result = await runPredictiveAnalysis(analysisRequest)
      
      setAnalysisResults({
        type: selectedAnalysisType,
        timeframe,
        response: result.response,
        confidence: result.confidence,
        processingTime: result.processingTime,
        timestamp: new Date().toISOString()
      })

      toast.success('Análise preditiva concluída com sucesso!')
      
    } catch (error) {
      console.error('Erro na análise preditiva:', error)
      toast.error(error instanceof Error ? error.message : 'Erro na análise preditiva')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Função para análise de dados de vendas usando Amazon Q
  const handleSalesAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      const result = await analyzeSalesData(mockSalesData)
      
      setAnalysisResults({
        type: 'sales_analysis',
        response: result.response,
        confidence: result.confidence,
        processingTime: result.processingTime,
        timestamp: new Date().toISOString()
      })

      toast.success('Análise de vendas concluída!')
      
    } catch (error) {
      console.error('Erro na análise de vendas:', error)
      toast.error(error instanceof Error ? error.message : 'Erro na análise de vendas')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Big Data Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Análise preditiva e insights avançados com Amazon Q</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="7d">7 dias</option>
            <option value="30d">30 dias</option>
            <option value="90d">90 dias</option>
            <option value="1y">1 ano</option>
          </select>
          
          <button
            onClick={handleSalesAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            <BarChart3 className={`w-4 h-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
            <span>Analisar Vendas</span>
          </button>
        </div>
      </div>

      {/* Análise Preditiva */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Análise Preditiva com Amazon Q</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Previsões inteligentes baseadas em IA</p>
          </div>
          
          <button
            onClick={handlePredictiveAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Brain className={`w-5 h-5 ${isAnalyzing ? 'animate-pulse' : ''}`} />
            <span>{isAnalyzing ? 'Analisando...' : 'Executar Análise'}</span>
          </button>
        </div>

        {/* Seletor de tipo de análise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setSelectedAnalysisType('sales_prediction')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnalysisType === 'sales_prediction'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
          >
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Previsão de Vendas</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Projeções de receita e demanda</p>
          </button>

          <button
            onClick={() => setSelectedAnalysisType('customer_behavior')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnalysisType === 'customer_behavior'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
            }`}
          >
            <Users className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Comportamento do Cliente</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Padrões e preferências</p>
          </button>

          <button
            onClick={() => setSelectedAnalysisType('inventory_optimization')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnalysisType === 'inventory_optimization'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
          >
            <Database className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Otimização de Estoque</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gestão inteligente de inventário</p>
          </button>
        </div>

        {/* Resultados da análise */}
        {isAnalyzing ? (
          <AnalysisSkeleton />
        ) : analysisResults ? (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Análise Concluída
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Confiança: {(analysisResults.confidence * 100).toFixed(1)}% | 
                    Tempo: {analysisResults.processingTime}ms
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(analysisResults.response)
                    toast.success('Resultado copiado!')
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                {analysisResults.response}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Análise gerada em {new Date(analysisResults.timestamp).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Selecione um tipo de análise e clique em "Executar Análise" para começar</p>
          </div>
        )}
      </div>

      {/* Métricas em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dados Processados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2.4M</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400">+12.5%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Precisão das Previsões</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">94.2%</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400">Excelente</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">qualidade</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Análises Executadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">847</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-blue-600 dark:text-blue-400">Tempo médio: 2.3s</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Insights Gerados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-yellow-600 dark:text-yellow-400">23 ações pendentes</span>
          </div>
        </div>
      </div>
    </div>
  )
}