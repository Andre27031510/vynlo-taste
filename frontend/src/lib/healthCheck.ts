import { useState } from 'react'
import { apiRequest } from '@/services/api'

export interface HealthStatus {
  status: 'UP' | 'DOWN' | 'UNKNOWN'
  timestamp: string
  endpoints: {
    health: boolean
    orders: boolean
    users: boolean
    drivers: boolean
    deliveries: boolean
  }
  errors: string[]
}

export const performHealthCheck = async (): Promise<HealthStatus> => {
  const result: HealthStatus = {
    status: 'UNKNOWN',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: false,
      orders: false,
      users: false,
      drivers: false,
      deliveries: false
    },
    errors: []
  }

  // Test health endpoint
  try {
    // ✅ CRITICAL FIX: /api/actuator/health + fetch direto (sem apiRequest/circuit breaker)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vynlotech.com'
    const response = await fetch(`${baseUrl}/api/actuator/health`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000)
    })
    result.endpoints.health = response.ok
    if (!response.ok) {
      result.errors.push(`Health endpoint returned ${response.status}`)
    }
  } catch (error) {
    result.errors.push(`Health endpoint error: ${error}`)
  }

  // Test orders endpoint
  try {
    const response = await apiRequest('core-service', 'v1/orders/stats')
    result.endpoints.orders = response.ok
    if (!response.ok) {
      result.errors.push(`Orders endpoint returned ${response.status}`)
    }
  } catch (error) {
    result.errors.push(`Orders endpoint error: ${error}`)
  }

  // Test users endpoint
  try {
    const response = await apiRequest('core-service', 'v1/users/stats')
    result.endpoints.users = response.ok
    if (!response.ok) {
      result.errors.push(`Users endpoint returned ${response.status}`)
    }
  } catch (error) {
    result.errors.push(`Users endpoint error: ${error}`)
  }

  // Test drivers endpoint
  try {
    const response = await apiRequest('core-service', 'v1/drivers/stats')
    result.endpoints.drivers = response.ok
    if (!response.ok) {
      result.errors.push(`Drivers endpoint returned ${response.status}`)
    }
  } catch (error) {
    result.errors.push(`Drivers endpoint error: ${error}`)
  }

  // Test deliveries endpoint
  try {
    const response = await apiRequest('core-service', 'v1/deliveries/stats')
    result.endpoints.deliveries = response.ok
    if (!response.ok) {
      result.errors.push(`Deliveries endpoint returned ${response.status}`)
    }
  } catch (error) {
    result.errors.push(`Deliveries endpoint error: ${error}`)
  }

  // Determine overall status
  const workingEndpoints = Object.values(result.endpoints).filter(Boolean).length
  if (workingEndpoints === 0) {
    result.status = 'DOWN'
  } else if (workingEndpoints === Object.keys(result.endpoints).length) {
    result.status = 'UP'
  } else {
    result.status = 'UNKNOWN'
  }

  return result
}

// Hook para usar o health check
export const useHealthCheck = () => {
  const [status, setStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const result = await performHealthCheck()
      setStatus(result)
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return { status, loading, checkHealth }
}