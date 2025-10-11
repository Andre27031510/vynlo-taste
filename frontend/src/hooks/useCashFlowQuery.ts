'use client'
// v2.1.2 - Production ready for 3M+ users

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'

export interface CashFlowEntry {
  id: string
  type: 'inflow' | 'outflow'
  amount: number
  description: string
  category: string
  date: string
  reference?: string
  createdAt: string
}

export interface CashFlowSummary {
  totalInflow: number
  totalOutflow: number
  netCashFlow: number
  currentBalance: number
  projectedBalance: number
}

export interface CreateCashFlowData {
  type: 'inflow' | 'outflow'
  amount: number
  description: string
  category: string
  date: string
  reference?: string
}

const fetchCashFlowEntries = async (filters?: {
  type?: string
  category?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}): Promise<{ content: CashFlowEntry[], totalElements: number, totalPages: number }> => {
  const params = new URLSearchParams()
  if (filters?.type) params.append('type', filters.type)
  if (filters?.category) params.append('category', filters.category)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.size) params.append('size', filters.size.toString())

  const response = await apiRequest('core-service', `v1/cashflow/entries?${params.toString()}`)
  
  if (!response.ok) {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0
    }
  }
  
  return await response.json()
}

const fetchCashFlowSummary = async (filters?: {
  startDate?: string
  endDate?: string
}): Promise<CashFlowSummary> => {
  const params = new URLSearchParams()
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)

  const response = await apiRequest('core-service', `v1/cashflow/summary?${params.toString()}`)
  
  if (!response.ok) {
    return {
      totalInflow: 0,
      totalOutflow: 0,
      netCashFlow: 0,
      currentBalance: 0,
      projectedBalance: 0
    }
  }
  
  return await response.json()
}

const createCashFlowEntry = async (entryData: CreateCashFlowData): Promise<CashFlowEntry> => {
  const response = await apiRequest('core-service', 'v1/cashflow/entries', {
    method: 'POST',
    body: JSON.stringify(entryData)
  })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`Erro ao criar entrada de fluxo de caixa: ${response.status} - ${errorText}`)
  }
  
  return await response.json()
}

export const useCashFlowQuery = (filters?: {
  type?: string
  category?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}) => {
  return useQuery<{ content: CashFlowEntry[], totalElements: number, totalPages: number }>({
    queryKey: ['cashflow-entries', filters],
    queryFn: () => fetchCashFlowEntries(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}

export const useCashFlowSummaryQuery = (filters?: {
  startDate?: string
  endDate?: string
}) => {
  return useQuery<CashFlowSummary>({
    queryKey: ['cashflow-summary', filters],
    queryFn: () => fetchCashFlowSummary(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}

export const useCreateCashFlowMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createCashFlowEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashflow-entries'] })
      queryClient.invalidateQueries({ queryKey: ['cashflow-summary'] })
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao criar entrada de fluxo de caixa:', error)
    }
  })
}