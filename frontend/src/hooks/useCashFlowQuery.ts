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
  status: 'confirmed' | 'pending' | 'cancelled'
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
  
  // ✅ Paginação 0-based + sort (Cursor recommendation)
  const pageZero = Math.max(0, (filters?.page ?? 1) - 1)
  const size = filters?.size ?? 10
  params.append('page', pageZero.toString())
  params.append('size', size.toString())
  params.append('sort', 'createdAt,desc') // Novas entradas no topo
  
  if (filters?.type) {
    // ✅ CORREÇÃO: Mapear tipos do frontend para backend
    const backendType = filters.type === 'inflow' ? 'INCOME' : 'EXPENSE'
    params.append('type', backendType)
  }
  if (filters?.category) params.append('category', filters.category)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)

  const response = await apiRequest('core-service', `v1/cashflow/entries?${params.toString()}`)
  
  if (!response.ok) {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0
    }
  }
  
  const data = await response.json()
  
  // ✅ CORREÇÃO: Mapear tipos do backend para frontend
  const mappedContent = data.content?.map((entry: any) => ({
    ...entry,
    type: entry.type === 'INCOME' ? 'inflow' : 'outflow',
    status: entry.status === 'CONFIRMED' ? 'confirmed' : 
            entry.status === 'PENDING' ? 'pending' : 'cancelled'
  })) || []
  
  return {
    ...data,
    content: mappedContent
  }
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
    
    // ✅ CORREÇÃO: Se for 401 após retry, redirecionar para login
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        console.error('❌ Sessão expirada após retry - redirecionando para login')
        window.location.href = '/login'
      }
      throw new Error('Sessão expirada. Faça login novamente.')
    }
    
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
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<{ content: CashFlowEntry[], totalElements: number, totalPages: number }>({
    queryKey: ['cashflow-entries', tenantKey, filters],  // ✅ Isolado por tenant
    queryFn: () => fetchCashFlowEntries(filters),
    staleTime: 0, // ✅ Atualizar imediatamente quando invalidado
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}

export const useCashFlowSummaryQuery = (filters?: {
  startDate?: string
  endDate?: string
}) => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<CashFlowSummary>({
    queryKey: ['cashflow-summary', tenantKey, filters],  // ✅ Isolado por tenant
    queryFn: () => fetchCashFlowSummary(filters),
    staleTime: 0, // ✅ Atualizar imediatamente quando invalidado
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

// Modified: 2025-10-11-v5 | Status field added for cash flow
// Modified: 2025-10-14 20:50 UTC | Cursor: Paginação 0-based + sort=createdAt,desc