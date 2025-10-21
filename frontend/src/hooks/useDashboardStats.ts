// Otimizado para produção - cache 5min, sem auto-refresh
// v2.1.2 - Enterprise-grade caching for 3M+ users
// Fixed: Removed auto-refresh for better scalability
// Modified: 2025-10-14 18:20 UTC | Health path fixed: /api/actuator/health + no Authorization (verified ✓) - Production optimization
// Modified: 2025-10-14 20:35 UTC | Stats mapping corrigido: totalUsers → totalClients (backend retorna totalUsers)
import { useState, useEffect } from 'react'
import { apiRequest } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  activeDrivers: number
  totalClients: number
  systemHealth: {
    orders: 'up' | 'down' | 'warning'
    payments: 'up' | 'down' | 'warning'
    delivery: 'up' | 'down' | 'warning'
    integrations: 'up' | 'down' | 'warning'
  }
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const startTime = Date.now()
      
      try {
        // Fetch health status com timeout
        let healthData = { status: 'DOWN' }
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vynlotech.com'
          const healthResponse = await fetch(`${baseUrl}/api/actuator/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(3000)
          })
          healthData = await healthResponse.json()
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Health check failed:', error)
          }
          healthData = { status: 'DOWN' }
        }

        // Fetch stats em paralelo
        const [ordersResult, usersResult, driversResult] = await Promise.allSettled([
          apiRequest('core-service', 'v1/orders/stats').then(r => r.json()),
          apiRequest('core-service', 'v1/users/stats').then(r => r.json()),
          apiRequest('core-service', 'v1/drivers/stats').then(r => r.json())
        ])

        const ordersStats = ordersResult.status === 'fulfilled' 
          ? ordersResult.value 
          : { totalOrders: 0, pendingOrders: 0, revenue: 0 }
          
        const usersStats = usersResult.status === 'fulfilled' 
          ? usersResult.value 
          : { totalUsers: 0, activeUsers: 0 }
          
        const driversStats = driversResult.status === 'fulfilled' 
          ? driversResult.value 
          : { active: 0, total: 0 }

        const stats: DashboardStats = {
          totalOrders: ordersStats.totalOrders || 0,
          pendingOrders: ordersStats.pendingOrders || 0,
          totalRevenue: ordersStats.revenue || 0,
          activeDrivers: driversStats.active || driversStats.total || 0,
          totalClients: usersStats.totalUsers || usersStats.activeUsers || 0,
          systemHealth: {
            orders: healthData?.status === 'UP' ? 'up' : 'down',
            payments: healthData?.status === 'UP' ? 'up' : 'down',
            delivery: healthData?.status === 'UP' ? 'up' : 'down',
            integrations: healthData?.status === 'UP' ? 'up' : 'down'
          }
        }

        const loadTime = Date.now() - startTime
        console.log(`Dashboard stats loaded in ${loadTime}ms`)
        
        return stats
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas'
        console.error('Dashboard stats error:', errorMessage)
        
        // Retornar dados zerados em caso de erro
        return {
          totalOrders: 0,
          pendingOrders: 0,
          totalRevenue: 0,
          activeDrivers: 0,
          totalClients: 0,
          systemHealth: {
            orders: 'down',
            payments: 'down',
            delivery: 'down',
            integrations: 'down'
          }
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false
  })
}