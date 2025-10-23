'use client'
// v2.1.3 - Fluxo financeiro completo implementado
// Fix: Hook para confirmação de transações financeiras
// Deploy: 2025-10-22 12:06 UTC

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'

export interface AccountPayable {
  id: string
  description: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
  supplier: string
  category?: string
}

export interface AccountReceivable {
  id: string
  description: string
  amount: number
  dueDate: string
  status: 'pending' | 'received' | 'overdue'
  customer: string
}

export interface FinancialSummary {
  totalReceivable: number
  totalPayable: number
  balance: number
  pendingTransactions: number
}

export interface TransactionData {
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: string
}

const fetchAccountsPayable = async (filters?: {
  status?: string
  page?: number
  size?: number
}): Promise<{ content: AccountPayable[], totalElements: number, totalPages: number }> => {
  const params = new URLSearchParams()
  
  // ✅ Paginação 0-based + sort (Cursor recommendation)
  const pageZero = Math.max(0, (filters?.page ?? 1) - 1)
  const size = filters?.size ?? 10
  params.append('page', pageZero.toString())
  params.append('size', size.toString())
  params.append('sort', 'createdAt,desc') // Novas contas no topo
  
  if (filters?.status) params.append('status', filters.status)

  const response = await apiRequest('core-service', `v1/financial/accounts/payable?${params.toString()}`)
  
  if (!response.ok) {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0
    }
  }
  
  return await response.json()
}

const fetchAccountsReceivable = async (filters?: {
  status?: string
  page?: number
  size?: number
}): Promise<{ content: AccountReceivable[], totalElements: number, totalPages: number }> => {
  const params = new URLSearchParams()
  
  // ✅ Paginação 0-based + sort (Cursor recommendation)
  const pageZero = Math.max(0, (filters?.page ?? 1) - 1)
  const size = filters?.size ?? 10
  params.append('page', pageZero.toString())
  params.append('size', size.toString())
  params.append('sort', 'createdAt,desc') // Novas contas no topo
  
  if (filters?.status) params.append('status', filters.status)

  const response = await apiRequest('core-service', `v1/financial/accounts/receivable?${params.toString()}`)
  
  if (!response.ok) {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0
    }
  }
  
  return await response.json()
}

const fetchFinancialSummary = async (): Promise<FinancialSummary> => {
  const response = await apiRequest('core-service', 'v1/financial/summary')
  
  if (!response.ok) {
    return {
      totalReceivable: 0,
      totalPayable: 0,
      balance: 0,
      pendingTransactions: 0
    }
  }
  
  return await response.json()
}

const createTransaction = async (transactionData: TransactionData): Promise<any> => {
  const response = await apiRequest('core-service', 'v1/financial/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData)
  })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`Erro ao criar transação: ${response.status} - ${errorText}`)
  }
  
  return await response.json()
}

export const useAccountsPayableQuery = (filters?: {
  status?: string
  page?: number
  size?: number
}) => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<{ content: AccountPayable[], totalElements: number, totalPages: number }>({
    queryKey: ['accounts-payable', tenantKey, filters],  // ✅ Isolado por tenant
    queryFn: () => fetchAccountsPayable(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}

export const useAccountsReceivableQuery = (filters?: {
  status?: string
  page?: number
  size?: number
}) => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<{ content: AccountReceivable[], totalElements: number, totalPages: number }>({
    queryKey: ['accounts-receivable', tenantKey, filters],  // ✅ Isolado por tenant
    queryFn: () => fetchAccountsReceivable(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}

export const useFinancialSummaryQuery = () => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<FinancialSummary>({
    queryKey: ['financial-summary', tenantKey],  // ✅ Isolado por tenant
    queryFn: fetchFinancialSummary,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}

export const useCreateTransactionMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts-payable'] })
      queryClient.invalidateQueries({ queryKey: ['accounts-receivable'] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] })
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao criar transação:', error)
    }
  })
}

export const useConfirmTransactionMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await apiRequest('core-service', `v1/financial-transactions/${transactionId}/confirm`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText)
        throw new Error(`Erro ao confirmar transação: ${response.status} - ${errorText}`)
      }
      
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] })
      queryClient.invalidateQueries({ queryKey: ['cashflow-summary'] })
      queryClient.invalidateQueries({ queryKey: ['cashflow-entries'] })
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao confirmar transação:', error)
    }
  })
}

export const useFinancialTransactionsQuery = (filters?: {
  status?: string
  search?: string
  page?: number
  size?: number
}) => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery({
    queryKey: ['financial-transactions', tenantKey, filters],  // ✅ Isolado por tenant
    queryFn: async () => {
      const params = new URLSearchParams()
      
      // Paginação 0-based
      const pageZero = Math.max(0, (filters?.page ?? 1) - 1)
      const size = filters?.size ?? 10
      params.append('page', pageZero.toString())
      params.append('size', size.toString())
      params.append('sort', 'createdAt,desc')
      
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status)
      if (filters?.search) params.append('search', filters.search)

      const response = await apiRequest('core-service', `v1/financial-transactions?${params.toString()}`)
      
      if (!response.ok) {
        return {
          content: [],
          totalElements: 0,
          totalPages: 0
        }
      }
      
      return await response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000,    // 5 minutos
    refetchInterval: false,
  })
}


// Modified: 2025-10-11-v6 | Category field for financial transactions
// Modified: 2025-10-14 20:50 UTC | Cursor: Paginação 0-based + sort=createdAt,desc