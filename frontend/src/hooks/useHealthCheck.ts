import { useQuery } from '@tanstack/react-query'
import { buildApiUrl } from '@/services/api'

interface HealthStatus {
  status: 'UP' | 'DOWN'
  timestamp: string
}

const fetchHealthStatus = async (): Promise<HealthStatus> => {
  try {
    const url = buildApiUrl('core-service', 'actuator/health')
    const resp = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
      credentials: 'omit',
      mode: 'cors'
    })
    const data = resp.ok ? await resp.json() : { status: 'DOWN' }
    return { status: data.status || 'DOWN', timestamp: new Date().toISOString() }
  } catch (error) {
    console.warn('Health check failed, using fallback:', error)
    return { status: 'DOWN', timestamp: new Date().toISOString() }
  }
}

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: fetchHealthStatus,
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // 1 minuto
    retry: 1,
    throwOnError: false
  })
}