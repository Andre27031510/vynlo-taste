// Otimizado para produção - cache 2min, sem auto-refresh
// v2.1.2 - Enterprise-grade caching for health checks
// Fixed: Removed auto-refresh for production scalability
// Modified: 2025-10-11 - Fixed React Query v5 API (gcTime)
import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'

interface HealthStatus {
  status: 'UP' | 'DOWN'
  timestamp: string
}

// ✅ Health check SIMPLES - sem X-headers, sem preflight, não contribui para circuit breaker
const fetchHealthStatus = async (): Promise<HealthStatus> => {
  try {
    // Usar fetch direto (sem apiRequest) para evitar X-headers e preflight
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vynlotech.com'
    const url = `${baseUrl}/api/actuator/health`
    
    // ✅ Timeout curto para health (3s) - Cursor recommendation
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 segundos
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json' // Apenas Accept, sem custom headers
      },
      cache: 'no-cache',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    return {
      status: data.status || 'DOWN',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    // Silencioso em produção (não polui console com timeouts de health)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Health check failed:', error instanceof Error ? error.message : 'timeout')
    }
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
    gcTime: 5 * 60 * 1000, // 5 minutos (React Query v5: gcTime)
    refetchOnWindowFocus: true, // Atualiza ao focar
    refetchInterval: false, // ❌ REMOVIDO auto-refresh (produção)
    retry: 1,
    throwOnError: false
  })
}

// Modified: 2025-10-14 18:10 UTC | Cursor recommendations: 3s timeout + silent errors (verified ✓)