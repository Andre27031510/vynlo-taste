'use client'
// v2.1.2 - Production ready for 3M+ users
// Modified: 2025-10-14 20:50 UTC | Cursor: Paginação 0-based + sort=createdAt,desc

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'

export interface FiscalDocument {
  id: string
  type: 'nfe' | 'nfce' | 'receipt'
  number: string
  series: string
  status: 'issued' | 'cancelled' | 'pending'
  amount: number
  customerId?: string
  customerName?: string
  issuedAt: string
  xmlUrl?: string
  pdfUrl?: string
}

export interface NFEData {
  customerId: string
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
    description: string
  }>
  paymentMethod: string
  observations?: string
}

export interface SEFAZStatus {
  status: 'online' | 'offline' | 'unstable'
  lastCheck: number
  responseTime: number
  message: string
}

const fetchFiscalDocuments = async (filters?: {
  type?: string
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}): Promise<{ content: FiscalDocument[], totalElements: number, totalPages: number }> => {
  const params = new URLSearchParams()
  
  // ✅ Paginação 0-based + sort (Cursor recommendation)
  const pageZero = Math.max(0, (filters?.page ?? 1) - 1)
  const size = filters?.size ?? 10
  params.append('page', pageZero.toString())
  params.append('size', size.toString())
  params.append('sort', 'createdAt,desc') // Novas notas no topo
  
  if (filters?.type) params.append('type', filters.type)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)

  const response = await apiRequest('core-service', `v1/fiscal/documents?${params.toString()}`)
  
  if (!response.ok) {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0
    }
  }
  
  return await response.json()
}

const createNFE = async (nfeData: NFEData): Promise<FiscalDocument> => {
  const response = await apiRequest('core-service', 'v1/fiscal/nfe', {
    method: 'POST',
    body: JSON.stringify(nfeData)
  })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`Erro ao emitir NFe: ${response.status} - ${errorText}`)
  }
  
  return await response.json()
}

const fetchSEFAZStatus = async (): Promise<SEFAZStatus> => {
  const response = await apiRequest('core-service', 'v1/fiscal/sefaz/status')
  
  if (!response.ok) {
    return {
      status: 'offline',
      lastCheck: Date.now(),
      responseTime: 0,
      message: 'Erro ao conectar com SEFAZ'
    }
  }
  
  return await response.json()
}

export const useFiscalDocumentsQuery = (filters?: {
  type?: string
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}) => {
  return useQuery<{ content: FiscalDocument[], totalElements: number, totalPages: number }>({
    queryKey: ['fiscal-documents', filters],
    queryFn: () => fetchFiscalDocuments(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}

export const useCreateNFeMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createNFE,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiscal-documents'] })
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao emitir NFe:', error)
    }
  })
}

export const useSEFAZStatusQuery = () => {
  return useQuery<SEFAZStatus>({
    queryKey: ['sefaz-status'],
    queryFn: fetchSEFAZStatus,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: false,
  })
}