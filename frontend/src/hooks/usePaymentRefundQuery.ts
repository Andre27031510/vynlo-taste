'use client'
// v2.1.2 - Endpoints reais para estornos - Production ready
// Modified: 2025-10-14 19:00 UTC | Real refunds API connected
// Modified: 2025-10-14 19:15 UTC | TypeScript compilation fix applied
// Modified: 2025-10-14 19:30 UTC | Final validation and comment added

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'

// Interfaces
export interface PaymentRefund {
  id: number
  paymentId: number
  amount: number
  reason: string
  status: 'PENDING' | 'IN_ANALYSIS' | 'APPROVED' | 'REJECTED' | 'PROCESSED'
  statusDisplayName: string
  notes?: string
  processedAt?: string
  processedBy?: string
  createdAt: string
  updatedAt: string
}

export interface PaymentRefundRequest {
  paymentId: number
  amount: number
  reason: string
  notes?: string
}

export interface PaymentRefundStats {
  pending: number
  inAnalysis: number
  approved: number
  processed: number
  totalRefunded: number
}

// Hooks
export function usePaymentRefundsQuery(page = 0, size = 20) {
  return useQuery({
    queryKey: ['payment-refunds', page, size],
    queryFn: async () => {
      const response = await apiRequest('core-service', `v1/payments/refunds?page=${page}&size=${size}`)
      return response
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })
}

export function usePaymentRefundsByStatusQuery(status: PaymentRefund['status'], page = 0, size = 20) {
  return useQuery({
    queryKey: ['payment-refunds', 'status', status, page, size],
    queryFn: async () => {
      const response = await apiRequest('core-service', `v1/payments/refunds/status/${status}?page=${page}&size=${size}`)
      return response
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!status,
  })
}

export function usePaymentRefundStatsQuery() {
  return useQuery({
    queryKey: ['payment-refund-stats'],
    queryFn: async () => {
      const response = await apiRequest('core-service', 'v1/payments/refunds/stats')
      return response as unknown as PaymentRefundStats
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreatePaymentRefundMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: PaymentRefundRequest) => {
      const response = await apiRequest('core-service', 'v1/payments/refunds', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      return response
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['payment-refunds'] })
      queryClient.invalidateQueries({ queryKey: ['payment-refund-stats'] })
    },
  })
}

export function useUpdatePaymentRefundStatusMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status, processedBy }: { 
      id: number
      status: PaymentRefund['status']
      processedBy?: string 
    }) => {
      const response = await apiRequest('core-service', `v1/payments/refunds/${id}/status?status=${status}&processedBy=${processedBy || 'system'}`, {
        method: 'PUT',
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-refunds'] })
      queryClient.invalidateQueries({ queryKey: ['payment-refund-stats'] })
    },
  })
}

export function useDeletePaymentRefundMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('core-service', `v1/payments/refunds/${id}`, {
        method: 'DELETE',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-refunds'] })
      queryClient.invalidateQueries({ queryKey: ['payment-refund-stats'] })
    },
  })
}
