'use client'
// v2.1.2 - Production ready for 3M+ users
// Modified: 2025-10-14 20:50 UTC | Cursor: Paginação 0-based + sort=createdAt,desc

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'

export interface Payment {
  id: string
  amount: number
  method: string
  status: 'pending' | 'completed' | 'failed'
  orderId?: string
  customerId?: string
  createdAt: string
  updatedAt?: string
}

export interface PaymentProvider {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive'
  fees: number
}

export interface PaymentStats {
  totalPayments: number
  successfulPayments: number
  failedPayments: number
  totalAmount: number
}

export interface CreatePaymentData {
  amount: number
  method: string
  orderId?: string
  customerId?: string
}

export interface UpdatePaymentData {
  id: string
  status: 'pending' | 'completed' | 'failed'
  method?: string
}

const fetchPayments = async (filters?: {
  status?: string
  method?: string
  page?: number
  size?: number
}): Promise<{ content: Payment[], totalElements: number, totalPages: number }> => {
  const params = new URLSearchParams()
  
  // ✅ Paginação 0-based + sort (Cursor recommendation)
  const pageZero = Math.max(0, (filters?.page ?? 1) - 1)
  const size = filters?.size ?? 10
  params.append('page', pageZero.toString())
  params.append('size', size.toString())
  params.append('sort', 'createdAt,desc') // Novos pagamentos no topo
  
  if (filters?.status) params.append('status', filters.status)
  if (filters?.method) params.append('method', filters.method)

  const response = await apiRequest('core-service', `v1/payments?${params.toString()}`)
  
  if (!response.ok) {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0
    }
  }
  
  return await response.json()
}

const fetchPaymentProviders = async (): Promise<PaymentProvider[]> => {
  const response = await apiRequest('core-service', 'v1/payments/providers')
  
  if (!response.ok) {
    return []
  }
  
  return await response.json()
}

const fetchPaymentStats = async (): Promise<PaymentStats> => {
  const response = await apiRequest('core-service', 'v1/payments/stats')
  
  if (!response.ok) {
    return {
      totalPayments: 0,
      successfulPayments: 0,
      failedPayments: 0,
      totalAmount: 0
    }
  }
  
  return await response.json()
}

const createPayment = async (paymentData: CreatePaymentData): Promise<Payment> => {
  const response = await apiRequest('core-service', 'v1/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData)
  })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`Erro ao criar pagamento: ${response.status} - ${errorText}`)
  }
  
  return await response.json()
}

const updatePayment = async (paymentData: UpdatePaymentData): Promise<Payment> => {
  const response = await apiRequest('core-service', `v1/payments/${paymentData.id}`, {
    method: 'PUT',
    body: JSON.stringify(paymentData)
  })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`Erro ao atualizar pagamento: ${response.status} - ${errorText}`)
  }
  
  return await response.json()
}

export const usePaymentsQuery = (filters?: {
  status?: string
  method?: string
  page?: number
  size?: number
}) => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<{ content: Payment[], totalElements: number, totalPages: number }>({
    queryKey: ['payments', tenantKey, filters],  // ✅ Isolado por tenant
    queryFn: () => fetchPayments(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}

export const usePaymentProvidersQuery = () => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<PaymentProvider[]>({
    queryKey: ['payment-providers', tenantKey],  // ✅ Isolado por tenant
    queryFn: fetchPaymentProviders,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}

export const usePaymentStatsQuery = () => {
  // ✅ MULTI-TENANT: Incluir tenantKey para isolamento de cache
  const { useTenantKey } = require('./useTenantKey')
  const tenantKey = useTenantKey()
  
  return useQuery<PaymentStats>({
    queryKey: ['payment-stats', tenantKey],  // ✅ Isolado por tenant
    queryFn: fetchPaymentStats,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}

export const useCreatePaymentMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] })
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao criar pagamento:', error)
    }
  })
}

export const useUpdatePaymentMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updatePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] })
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao atualizar pagamento:', error)
    }
  })
}