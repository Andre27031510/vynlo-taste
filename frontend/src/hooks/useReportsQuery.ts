import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryAmazonQ } from '@/services/amazonQService'

// Tipos para relatórios
export interface SalesReport {
  period: string
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  topProducts: ProductSales[]
  salesByHour: HourlySales[]
}

export interface ProductSales {
  productId: string
  productName: string
  quantity: number
  revenue: number
}

export interface HourlySales {
  hour: number
  sales: number
  orders: number
}

export interface AnalyticsData {
  customerRetention: number
  growthRate: number
  predictedSales: number
  recommendations: string[]
}

// API functions
const fetchSalesReport = async (period: string = '7d'): Promise<SalesReport> => {
  const response = await fetch(`/api/reports/sales?period=${period}`)
  if (!response.ok) {
    throw new Error('Erro ao carregar relatório de vendas')
  }
  return response.json()
}

const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  const response = await fetch('/api/reports/analytics')
  if (!response.ok) {
    throw new Error('Erro ao carregar dados analíticos')
  }
  return response.json()
}

const runPredictiveAnalysis = async (): Promise<AnalyticsData> => {
  const response = await fetch('/api/reports/predictive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  if (!response.ok) {
    throw new Error('Erro ao executar análise preditiva')
  }
  return response.json()
}

// Custom hooks
export const useSalesReportQuery = (period: string = '7d') => {
  return useQuery({
    queryKey: ['reports', 'sales', period],
    queryFn: () => fetchSalesReport(period),
    staleTime: 300000, // 5 minutos

  })
}

export const useAnalyticsQuery = () => {
  return useQuery({
    queryKey: ['reports', 'analytics'],
    queryFn: fetchAnalyticsData,
    staleTime: 600000, // 10 minutos

  })
}

export const usePredictiveAnalysis = () => {
  return useMutation({
    mutationFn: runPredictiveAnalysis,
    onSuccess: () => {
      toast.success('Análise preditiva executada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro na análise preditiva')
    }
  })
}

// Hook para análise com Amazon Q
export const useAmazonQAnalysis = () => {
  return useMutation({
    mutationFn: ({ prompt, context }: { prompt: string; context?: any }) => 
      queryAmazonQ({ prompt, context, maxTokens: 1000, temperature: 0.3 }),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro na consulta Amazon Q')
    }
  })
}