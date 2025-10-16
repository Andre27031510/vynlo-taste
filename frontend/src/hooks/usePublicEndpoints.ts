import { useState, useEffect } from 'react'
import { apiRequest } from '@/services/api'

export const usePublicEndpoints = () => {
  const [status, setStatus] = useState({
    health: 'checking',
    products: 'checking',
    test: 'checking'
  })

  useEffect(() => {
    const checkEndpoints = async () => {
      // Test health endpoint
      try {
        // ✅ CRITICAL FIX: /api/actuator/health + fetch direto (sem apiRequest/circuit breaker)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vynlotech.com'
        await fetch(`${baseUrl}/api/actuator/health`, { 
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(3000)
        })
        setStatus(prev => ({ ...prev, health: 'ok' }))
      } catch (error) {
        setStatus(prev => ({ ...prev, health: 'error' }))
      }

      // Test products endpoint
      try {
        await apiRequest('core-service', 'v1/products?page=0&size=1')
        setStatus(prev => ({ ...prev, products: 'ok' }))
      } catch (error) {
        setStatus(prev => ({ ...prev, products: 'error' }))
      }

      // Test v1/test endpoint
      try {
        await apiRequest('core-service', 'v1/test/ping')
        setStatus(prev => ({ ...prev, test: 'ok' }))
      } catch (error) {
        setStatus(prev => ({ ...prev, test: 'error' }))
      }
    }

    checkEndpoints()
  }, [])

  return status
}