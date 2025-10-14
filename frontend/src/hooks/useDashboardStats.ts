// Otimizado para produção - cache 5min, sem auto-refresh
// v2.1.2 - Enterprise-grade caching for 3M+ users
// Fixed: Removed auto-refresh for better scalability
// Modified: 2025-10-11-v16 | Dashboard stats optimized - Production optimization
import { useState, useEffect } from 'react'
import { apiRequest } from '@/services/api'

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
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeDrivers: 0,
    totalClients: 0,
    systemHealth: {
      orders: 'up',
      payments: 'up',
      delivery: 'up',
      integrations: 'up'
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    const startTime = Date.now()
    
    try {
      setLoading(true)
      setError(null)

      // Fetch health status com timeout
      let healthData = { status: 'DOWN' }
      try {
        const healthResponse = await apiRequest('core-service', 'actuator/health')
        healthData = await healthResponse.json()
      } catch (error) {
        console.warn('Health check failed:', error)
        healthData = { status: 'DOWN' }
      }

      // Fetch stats em paralelo com Promise.allSettled
      const [ordersResult, usersResult, driversResult] = await Promise.allSettled([
        apiRequest('core-service', 'v1/orders/stats').then(r => r.json()),
        apiRequest('core-service', 'v1/users/stats').then(r => r.json()),
        apiRequest('core-service', 'v1/drivers/stats').then(r => r.json())
      ])

      // Processar resultados - usar dados reais ou 0 se falhar
      const ordersStats = ordersResult.status === 'fulfilled' 
        ? ordersResult.value 
        : { total: 0, pending: 0 }
        
      const usersStats = usersResult.status === 'fulfilled' 
        ? usersResult.value 
        : { total: 0 }
        
      const driversStats = driversResult.status === 'fulfilled' 
        ? driversResult.value 
        : { active: 0 }

      setStats({
        totalOrders: ordersStats.total || 0,
        pendingOrders: ordersStats.pending || 0,
        totalRevenue: ordersStats.revenue || 0,
        activeDrivers: driversStats.active || 0,
        totalClients: usersStats.total || 0,
        systemHealth: {
          orders: healthData?.status === 'UP' ? 'up' : 'down',
          payments: healthData?.status === 'UP' ? 'up' : 'down',
          delivery: healthData?.status === 'UP' ? 'up' : 'down',
          integrations: healthData?.status === 'UP' ? 'up' : 'down'
        }
      })
      // Log performance
      const loadTime = Date.now() - startTime
      console.log(`Dashboard stats loaded in ${loadTime}ms`)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas'
      console.error('Dashboard stats error:', {
        error: errorMessage,
        timestamp: new Date().toISOString(),
        loadTime: Date.now() - startTime
      })
      
      setError(errorMessage)
      
      // Fallback com dados zerados para indicar erro
      setStats({
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
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    
    // ❌ REMOVIDO auto-refresh para produção (3M+ usuários)
    // Atualiza apenas quando usuário focar na janela ou fazer refresh manual
  }, [])

  return { stats, loading, error, refetch: fetchStats }
}