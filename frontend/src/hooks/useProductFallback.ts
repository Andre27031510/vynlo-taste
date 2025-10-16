'use client'
// Amazon Q Recommendation: Fallback Strategy com localStorage
// Garante que produtos nunca desaparecem mesmo em falhas totais
// Created: 2025-10-16 (Amazon Q diagnosis)

import { useEffect } from 'react'
import type { Product, ProductStats } from './useProductsQuery'

const PRODUCTS_FALLBACK_KEY = 'vynlo-products-fallback'
const STATS_FALLBACK_KEY = 'vynlo-stats-fallback'
const MAX_AGE = 24 * 60 * 60 * 1000 // 24 horas

interface FallbackData<T> {
  data: T
  timestamp: number
}

// Salvar dados em localStorage com timestamp
export const saveProductsFallback = (data: { products: Product[], total: number, totalPages: number }) => {
  if (typeof window === 'undefined') return
  
  try {
    const fallback: FallbackData<typeof data> = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(PRODUCTS_FALLBACK_KEY, JSON.stringify(fallback))
  } catch (error) {
    // Silencioso - localStorage pode estar cheio
    console.warn('Failed to save products fallback:', error)
  }
}

export const saveStatsFallback = (data: ProductStats) => {
  if (typeof window === 'undefined') return
  
  try {
    const fallback: FallbackData<ProductStats> = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(STATS_FALLBACK_KEY, JSON.stringify(fallback))
  } catch (error) {
    console.warn('Failed to save stats fallback:', error)
  }
}

// Recuperar dados do localStorage
export const getProductsFallback = (): { products: Product[], total: number, totalPages: number } | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(PRODUCTS_FALLBACK_KEY)
    if (!stored) return null
    
    const fallback: FallbackData<{ products: Product[], total: number, totalPages: number }> = JSON.parse(stored)
    
    // Verificar se dados não estão muito antigos
    if (Date.now() - fallback.timestamp > MAX_AGE) {
      localStorage.removeItem(PRODUCTS_FALLBACK_KEY)
      return null
    }
    
    return fallback.data
  } catch (error) {
    console.warn('Failed to load products fallback:', error)
    return null
  }
}

export const getStatsFallback = (): ProductStats | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(STATS_FALLBACK_KEY)
    if (!stored) return null
    
    const fallback: FallbackData<ProductStats> = JSON.parse(stored)
    
    // Verificar se dados não estão muito antigos
    if (Date.now() - fallback.timestamp > MAX_AGE) {
      localStorage.removeItem(STATS_FALLBACK_KEY)
      return null
    }
    
    return fallback.data
  } catch (error) {
    console.warn('Failed to load stats fallback:', error)
    return null
  }
}

// Hook para auto-save em localStorage quando dados mudam
export const useProductsFallback = (data: { products: Product[], total: number, totalPages: number } | undefined) => {
  useEffect(() => {
    if (data?.products && data.products.length > 0) {
      saveProductsFallback(data)
    }
  }, [data])
}

export const useStatsFallback = (data: ProductStats | undefined) => {
  useEffect(() => {
    if (data && data.totalProducts > 0) {
      saveStatsFallback(data)
    }
  }, [data])
}

