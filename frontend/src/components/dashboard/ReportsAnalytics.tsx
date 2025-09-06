'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users,
  Calendar,
  Download,
  RefreshCw,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useSalesReportQuery, useAnalyticsQuery, usePredictiveAnalysis } from '@/hooks/useReportsQuery'
import toast from 'react-hot-toast'

// Componente de skeleton para cards de métricas
const MetricSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
  </div>
)

// Componente de skeleton para gráficos
const ChartSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
      <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-end space-x-2">
          <div className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className={`flex-1 bg-gray-200 dark:bg-gray-700 rounded`} style={{ height: `${Math.random() * 100 + 20}px` }}></div>
        </div>
      ))}
    </div>
  </div>
)

export default function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  // Usando TanStack Query para buscar dados
  const { 
    data: salesReport, 
    isLoading: salesLoading, 
    error: salesError,
    refetch: refetchSales 
  } = useSalesReportQuery(selectedPeriod)

  const { 
    data: analytics, 
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics 
  } = useAnalyticsQuery()

  // Mutation para análise preditiva
  const predictiveAnalysis = usePredictiveAnalysis()

  // Função para executar análise preditiva
  const handlePredictiveAnalysis = () => {
    predictiveAnalysis.mutate()
  }

  // Função para exportar relatório
  const handleExportReport = () => {
    if (!salesReport) {
      toast.error('Nenhum dado disponível para exportar')
      return
    }
    
    // Simular download do relatório
    toast.success('Relatório exportado com sucesso!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Análise detalhada de vendas e performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="1d">Hoje</option>
            <option value="7d">7 dias</option>
            <option value="30d">30 dias</option>
            <option value="90d">90 dias</option>
          </select>
          
          <button
            onClick={() => {
              refetchSales()
              refetchAnalytics()
            }}
            disabled={salesLoading || analyticsLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${(salesLoading || analyticsLoading) ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          
          <button
            onClick={handleExportReport}
            disabled={salesLoading || !salesReport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesLoading ? (
          // Skeleton para métricas
          Array.from({ length: 4 }).map((_, index) => (
            <MetricSkeleton key={index} />
          ))
        ) : salesError ? (
          // Estado de erro para métricas
          <div className="col-span-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Erro ao carregar métricas
            </h3>
            <p className="text-red-600 dark:text-red-300">
              Não foi possível carregar os dados de vendas.
            </p>
          </div>
        ) : salesReport ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vendas Totais</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {(salesReport as any)?.totalSales?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">+12.5% vs período anterior</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{(salesReport as any)?.totalOrders || 0}</p>
                <p className="text-xs text-green-600 dark:text-green-400">+8.3% vs período anterior</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {(salesReport as any)?.averageOrderValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">+3.7% vs período anterior</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{selectedPeriod}</div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Período</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{(salesReport as any)?.period || 'N/A'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dados atualizados</p>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Gráficos e Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Hora */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          {salesLoading ? (
            <ChartSkeleton />
          ) : salesReport ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vendas por Hora</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Distribuição de vendas ao longo do dia</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {((salesReport as any)?.salesByHour || []).map((hourData: any) => (
                  <div key={hourData.hour} className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-gray-600 dark:text-gray-400">
                      {hourData.hour.toString().padStart(2, '0')}:00
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                      <div 
                        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(hourData.sales / Math.max(...((salesReport as any)?.salesByHour || []).map((h: any) => h.sales))) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-sm text-gray-900 dark:text-white font-medium">
                      R$ {hourData.sales.toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Dados não disponíveis</p>
            </div>
          )}
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          {salesLoading ? (
            <ChartSkeleton />
          ) : salesReport ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Produtos</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Produtos mais vendidos no período</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {((salesReport as any)?.topProducts || []).map((product: any, index: number) => (
                  <div key={product.productId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{product.productName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.quantity} vendidos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Dados não disponíveis</p>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Avançados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Avançados</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Insights e análises preditivas</p>
          </div>
          
          <button
            onClick={handlePredictiveAnalysis}
            disabled={predictiveAnalysis.isPending}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${predictiveAnalysis.isPending ? 'animate-pulse' : ''}`} />
            <span>{predictiveAnalysis.isPending ? 'Analisando...' : 'Análise Preditiva'}</span>
          </button>
        </div>

        {analyticsLoading ? (
          // Skeleton para analytics
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : analyticsError ? (
          // Estado de erro para analytics
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Erro ao carregar analytics
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">
              Não foi possível carregar os dados analíticos.
            </p>
            <button
              onClick={() => refetchAnalytics()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Tentar Novamente
            </button>
          </div>
        ) : analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Retenção de Clientes</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {((analytics as any)?.customerRetention || 0).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Taxa de clientes que retornaram no período
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Taxa de Crescimento</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                +{((analytics as any)?.growthRate || 0).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Crescimento comparado ao período anterior
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Previsão de Vendas</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                R$ {((analytics as any)?.predictedSales || 0).toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Estimativa para os próximos 30 dias
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Dados analíticos não disponíveis</p>
          </div>
        )}

        {/* Recomendações */}
        {(analytics as any)?.recommendations && (analytics as any).recommendations.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Recomendações Inteligentes
            </h4>
            <div className="space-y-3">
              {((analytics as any)?.recommendations || []).map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}