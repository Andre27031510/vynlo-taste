// Otimizado para produção - cache 2min, sem auto-refresh
// v2.1.2 - Enterprise-grade caching
// Fixed: Removed auto-refresh for production
import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'

interface HealthStatus {
  status: 'UP' | 'DOWN'
  timestamp: string
}

const fetchHealthStatus = async (): Promise<HealthStatus> => {
  try {
    const response = await apiRequest('core-service', 'actuator/health')
    const data = await response.json()
    return {
      status: data.status || 'DOWN',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.warn('Health check failed, using fallback:', error)
    return {
      status: 'DOWN',
      timestamp: new Date().toISOString()
    }
  }
}

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: fetchHealthStatus,
    staleTime: 2 * 60 * 1000, // 2 minutos (health check pode ser mais frequente)
    cacheTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
    retry: 1,
    throwOnError: false
  })
}