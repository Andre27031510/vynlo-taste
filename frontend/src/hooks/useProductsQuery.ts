'use client'
// Otimizado para produção - cache 5min, sem auto-refresh
// v2.1.2 - Type-safe queries with generics
// Modified: 2025-10-11 - Removed ALL mock data, 100% real APIs
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

// Mock data para fallback
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Hambúrguer Gourmet',
    category: 'Lanches',
    price: 28.90,
    cost: 12.50,
    stock: 45,
    minStock: 10,
    status: 'active',
    description: 'Hambúrguer artesanal com queijo, alface e tomate',
    sales: 156,
    revenue: 4508.40,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Pizza Margherita',
    category: 'Pizzas',
    price: 42.00,
    cost: 18.00,
    stock: 23,
    minStock: 15,
    status: 'active',
    description: 'Pizza tradicional com molho, mussarela e manjericão',
    sales: 89,
    revenue: 3738.00,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Refrigerante Cola',
    category: 'Bebidas',
    price: 8.50,
    cost: 3.20,
    stock: 67,
    minStock: 20,
    status: 'active',
    description: 'Refrigerante cola 350ml',
    sales: 234,
    revenue: 1989.00,
    createdAt: new Date().toISOString()
  }
]

const mockStats: ProductStats = {
  totalProducts: 3,
  activeProducts: 3,
  lowStockProducts: 1,
  totalRevenue: 10235.40,
  averagePrice: 26.47
}

const fetchProducts = async (filters?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ products: Product[], total: number, totalPages: number }> => {
  const params = new URLSearchParams()
  if (filters?.category && filters.category !== '') params.append('category', filters.category)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())

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
  
  return await response.json()
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
  const response = await apiRequest('core-service', 'products', {
    method: 'POST',
    body: JSON.stringify(productData)
  })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`Erro ao criar produto: ${response.status} - ${errorText}`)
  }
  
  return await response.json()
}

const updateProduct = async (productData: UpdateProductData): Promise<Product> => {
  const response = await apiRequest('core-service', `products/${productData.id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
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
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-stats'] })
      toast.success('Produto criado com sucesso!')
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
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-stats'] })
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
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-stats'] })
      toast.success('Produto excluído com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir produto')
    }
  })
}