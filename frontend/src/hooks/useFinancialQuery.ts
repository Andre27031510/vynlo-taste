'use client'
// v2.1.2 - Production ready for 3M+ users

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
  if (filters?.status) params.append('status', filters.status)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.size) params.append('size', filters.size.toString())

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
  if (filters?.status) params.append('status', filters.status)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.size) params.append('size', filters.size.toString())

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
  return useQuery<{ content: AccountPayable[], totalElements: number, totalPages: number }>({
    queryKey: ['accounts-payable', filters],
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
  return useQuery<{ content: AccountReceivable[], totalElements: number, totalPages: number }>({
    queryKey: ['accounts-receivable', filters],
    queryFn: () => fetchAccountsReceivable(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}

export const useFinancialSummaryQuery = () => {
  return useQuery<FinancialSummary>({
    queryKey: ['financial-summary'],
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

// Modified: 2025-10-11 - Added category field