'use client'
// Amazon Q Recommendation: Fallback Strategy com localStorage
// Garante que produtos nunca desaparecem mesmo em falhas totais
// Created: 2025-10-16 (Amazon Q diagnosis)
// Modified: 2025-10-18 (Multi-tenant isolation)

import { useEffect } from 'react'
import type { Product, ProductStats } from './useProductsQuery'
import { useTenantKey } from './useTenantKey'

// ✅ MULTI-TENANT: Keys agora incluem tenantKey para isolamento
const getProductsFallbackKey = (tenantKey: string) => `vynlo-products-fallback:${tenantKey}`
const getStatsFallbackKey = (tenantKey: string) => `vynlo-stats-fallback:${tenantKey}`
const MAX_AGE = 24 * 60 * 60 * 1000 // 24 horas
const MAX_FALLBACKS = 5 // Manter apenas os 5 tenants mais recentes

interface FallbackData<T> {
  data: T
  timestamp: number
}

// ✅ MULTI-TENANT: Salvar dados em localStorage com timestamp E tenantKey
export const saveProductsFallback = (tenantKey: string, data: { products: Product[], total: number, totalPages: number }) => {
  if (typeof window === 'undefined') return
  
  try {
    const fallback: FallbackData<typeof data> = {
      data,
      timestamp: Date.now()
    }
    const key = getProductsFallbackKey(tenantKey)
    localStorage.setItem(key, JSON.stringify(fallback))
    
    // Limpar fallbacks antigos (manter apenas os 5 mais recentes)
    cleanOldFallbacks()
  } catch (error) {
    // Silencioso - localStorage pode estar cheio
    console.warn('Failed to save products fallback:', error)
  }
}

// ✅ MULTI-TENANT: Salvar stats em localStorage com timestamp E tenantKey
export const saveStatsFallback = (tenantKey: string, data: ProductStats) => {
  if (typeof window === 'undefined') return
  
  try {
    const fallback: FallbackData<ProductStats> = {
      data,
      timestamp: Date.now()
    }
    const key = getStatsFallbackKey(tenantKey)
    localStorage.setItem(key, JSON.stringify(fallback))
    
    // Limpar fallbacks antigos
    cleanOldFallbacks()
  } catch (error) {
    console.warn('Failed to save stats fallback:', error)
  }
}

// ✅ MULTI-TENANT: Recuperar dados do localStorage usando tenantKey
export const getProductsFallback = (tenantKey: string): { products: Product[], total: number, totalPages: number } | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const key = getProductsFallbackKey(tenantKey)
    const stored = localStorage.getItem(key)
    if (!stored) return null
    
    const fallback: FallbackData<{ products: Product[], total: number, totalPages: number }> = JSON.parse(stored)
    
    // Verificar se dados não estão muito antigos
    if (Date.now() - fallback.timestamp > MAX_AGE) {
      localStorage.removeItem(key)
      return null
    }
    
    return fallback.data
  } catch (error) {
    console.warn('Failed to load products fallback:', error)
    return null
  }
}

// ✅ MULTI-TENANT: Recuperar stats do localStorage usando tenantKey
export const getStatsFallback = (tenantKey: string): ProductStats | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const key = getStatsFallbackKey(tenantKey)
    const stored = localStorage.getItem(key)
    if (!stored) return null
    
    const fallback: FallbackData<ProductStats> = JSON.parse(stored)
    
    // Verificar se dados não estão muito antigos
    if (Date.now() - fallback.timestamp > MAX_AGE) {
      localStorage.removeItem(key)
      return null
    }
    
    return fallback.data
  } catch (error) {
    console.warn('Failed to load stats fallback:', error)
    return null
  }
}

// ✅ MULTI-TENANT: Hook para auto-save em localStorage quando dados mudam
export const useProductsFallback = (data: { products: Product[], total: number, totalPages: number } | undefined) => {
  const tenantKey = useTenantKey()
  
  useEffect(() => {
    if (data?.products && data.products.length > 0) {
      saveProductsFallback(tenantKey, data)
    }
  }, [data, tenantKey])
}

// ✅ MULTI-TENANT: Hook para auto-save de stats em localStorage
export const useStatsFallback = (data: ProductStats | undefined) => {
  const tenantKey = useTenantKey()
  
  useEffect(() => {
    if (data && data.totalProducts > 0) {
      saveStatsFallback(tenantKey, data)
    }
  }, [data, tenantKey])
}

// ✅ Limpar fallbacks antigos (manter apenas os 5 mais recentes)
const cleanOldFallbacks = () => {
  if (typeof window === 'undefined') return
  
  try {
    // Pegar todas as chaves de fallback com timestamp
    const fallbackKeys: { key: string; timestamp: number }[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('vynlo-') && key.includes('-fallback:')) {
        try {
          const stored = localStorage.getItem(key)
          if (stored) {
            const data = JSON.parse(stored)
            fallbackKeys.push({ key, timestamp: data.timestamp || 0 })
          }
        } catch {
          // Ignorar entradas inválidas
        }
      }
    }
    
    // Ordenar por timestamp (mais recente primeiro)
    fallbackKeys.sort((a, b) => b.timestamp - a.timestamp)
    
    // Remover fallbacks antigos (manter apenas MAX_FALLBACKS mais recentes)
    if (fallbackKeys.length > MAX_FALLBACKS) {
      fallbackKeys.slice(MAX_FALLBACKS).forEach(({ key }) => {
        localStorage.removeItem(key)
        console.log(`🗑️ Fallback antigo removido: ${key}`)
      })
    }
  } catch (error) {
    console.warn('Failed to clean old fallbacks:', error)
  }
}

