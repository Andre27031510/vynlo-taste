import { useState, useEffect } from 'react'
import { apiRequest, buildApiUrl } from '@/services/api'

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

      // Fetch health status com requisição simples (sem headers extras) para evitar preflight
      let healthData = { status: 'DOWN' }
      try {
        const healthUrl = buildApiUrl('core-service', 'actuator/health')
        const resp = await fetch(healthUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
          credentials: 'omit',
          mode: 'cors'
        })
        if (resp.ok) {
          healthData = await resp.json()
        } else {
          console.warn('Health check non-OK:', resp.status)
        }
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
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return { stats, loading, error, refetch: fetchStats }
}