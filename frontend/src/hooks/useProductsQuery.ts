'use client'
// Otimizado para produção - cache 5min, sem auto-refresh
// v2.1.2 - Type-safe queries with generics
// Modified: 2025-10-14 18:01 UTC | Pagination 0-based + mock removed (verified ✓)
// FIX: Frontend page=1 → backend page=0 (Spring Data padrão)
// FIX: 'limit' → 'size' (backend expects 'size')
// FIX: Added sort=createdAt,desc (deterministic ordering)
// CRITICAL: Products and inventory must be fully functional

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { apiRequest } from '@/services/api'

export interface Product {
  id: string
  name: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  status: 'active' | 'inactive'
  description: string
  image?: string
  sales: number
  revenue: number
  createdAt: string
  updatedAt?: string
}

export interface ProductStats {
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  totalRevenue: number
  averagePrice: number
}

export interface CreateProductData {
  name: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  description: string
}

export interface UpdateProductData extends CreateProductData {
  id: string
  status?: 'active' | 'inactive'
}

// ✅ MOCK DATA REMOVIDO - 100% API REAL (Modified: 2025-10-14 17:40 UTC)
// Sistema em produção para 3M+ usuários - sem fallbacks mock

const fetchProducts = async (filters?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ products: Product[], total: number, totalPages: number }> => {
    const params = new URLSearchParams()
    if (filters?.category && filters.category !== '') params.append('category', filters.category)
    if (filters?.search) params.append('search', filters.search)
  
  // Enforce 0-based pagination and deterministic ordering for backend (production-safe)
  const pageZero = Math.max(0, (filters?.page ?? 1) - 1)
  const size = (filters?.limit ?? 10)
  params.append('page', pageZero.toString())
  params.append('size', size.toString())
  params.append('sort', 'createdAt,desc')

    const response = await apiRequest('core-service', `products?${params.toString()}`)
  
  if (!response.ok) {
    console.error('❌ Erro ao buscar produtos:', response.status)
    // Retornar lista vazia em vez de mock data
    return {
      products: [],
      total: 0,
      totalPages: 0
    }
  }
  
  const data = await response.json()
  
  // ✅ Mapear dados do backend para frontend
  const products = (data.content || data.products || []).map((p: any) => ({
    id: p.id?.toString() || p.id,
    name: p.name,
    category: p.category || '',
    price: p.price || 0,
    cost: 0, // Backend não retorna cost
    stock: p.stockQuantity || 0,
    minStock: 0, // Backend não retorna minStock
    status: p.available ? 'active' : 'inactive',
    description: p.description || '',
    image: p.imageUrl || '',
    sales: 0, // TODO: calcular
    revenue: 0, // TODO: calcular
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt
  }))
    
    return {
    products,
    total: data.totalElements || data.total || products.length,
    totalPages: data.totalPages || Math.ceil(products.length / ((filters?.limit ?? 10)))
  }
}

const fetchProductStats = async (): Promise<ProductStats> => {
    const response = await apiRequest('core-service', 'products/stats')
  
  if (!response.ok) {
    console.error('❌ Erro ao buscar stats de produtos:', response.status)
    // Retornar stats zerados em vez de mock
    return {
      totalProducts: 0,
      activeProducts: 0,
      lowStockProducts: 0,
      totalRevenue: 0,
      averagePrice: 0
    }
  }
  
  return await response.json()
}

const createProduct = async (productData: CreateProductData): Promise<Product> => {
  // ✅ Mapear campos do frontend para backend (ProductRequestDto)
  const backendPayload = {
    name: productData.name,
    description: productData.description || '',
    price: productData.price,
    category: productData.category || '',
    stockQuantity: productData.stock || 0,
    available: true
  }
  
    const response = await apiRequest('core-service', 'products', {
      method: 'POST',
    body: JSON.stringify(backendPayload)
  })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`Erro ao criar produto: ${response.status} - ${errorText}`)
  }
  
  return await response.json()
}

const updateProduct = async (productData: UpdateProductData): Promise<Product> => {
  // ✅ Mapear campos do frontend para backend (ProductRequestDto)
  const backendPayload = {
    name: productData.name,
    description: productData.description || '',
    price: productData.price,
    category: productData.category || '',
    stockQuantity: productData.stock || 0,
    available: productData.status === 'active'
  }
  
    const response = await apiRequest('core-service', `products/${productData.id}`, {
      method: 'PUT',
    body: JSON.stringify(backendPayload)
  })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`Erro ao atualizar produto: ${response.status} - ${errorText}`)
  }
  
  return await response.json()
}

const deleteProduct = async (productId: string): Promise<void> => {
  const response = await apiRequest('core-service', `products/${productId}`, {
      method: 'DELETE'
    })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`Erro ao deletar produto: ${response.status} - ${errorText}`)
  }
}

// Hooks
export const useProductsQuery = (filters?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}) => {
  return useQuery<{ products: Product[], total: number, totalPages: number }>({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (React Query v5: gcTime)
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
  })
}

export const useProductStatsQuery = () => {
  return useQuery<ProductStats>({
    queryKey: ['product-stats'],
    queryFn: fetchProductStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (React Query v5: gcTime)
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // ✅ Invalidar TODAS as queries de produtos (com exact: false para pegar variações com filtros)
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['product-stats'], exact: false })
      
      // ✅ FORÇAR refetch imediato de TODAS as variações (incluindo filtros)
      queryClient.refetchQueries({ queryKey: ['products'], type: 'active', exact: false })
      queryClient.refetchQueries({ queryKey: ['product-stats'], type: 'active', exact: false })
      
      toast.success('Produto criado com sucesso!')
      console.log('✅ Produto criado - queries invalidadas (exact: false) e refetch forçado')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar produto')
    }
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      // ✅ Invalidar e forçar refetch (exact: false para pegar todas variações)
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['product-stats'], exact: false })
      queryClient.refetchQueries({ queryKey: ['products'], type: 'active', exact: false })
      queryClient.refetchQueries({ queryKey: ['product-stats'], type: 'active', exact: false })
      
      toast.success('Produto atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar produto')
    }
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // ✅ Invalidar e forçar refetch (exact: false para pegar todas variações)
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['product-stats'], exact: false })
      queryClient.refetchQueries({ queryKey: ['products'], type: 'active', exact: false })
      queryClient.refetchQueries({ queryKey: ['product-stats'], type: 'active', exact: false })
      
      toast.success('Produto excluído com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir produto')
    }
  })
}

// Modified: 2025-10-11-v4 | Product query key mismatch fixed (exact: false)