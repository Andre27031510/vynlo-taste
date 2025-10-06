// Tipos para service discovery
type ServiceName = 'core-service' | 'financial-service'
type Environment = 'development' | 'production'

// Service Discovery Enterprise
class ServiceDiscovery {
  private static instance: ServiceDiscovery
  private services: Map<ServiceName, string> = new Map()
  private lastUpdate = 0
  private readonly CACHE_TTL = 300000 // 5 minutos

  static getInstance(): ServiceDiscovery {
    if (!ServiceDiscovery.instance) {
      ServiceDiscovery.instance = new ServiceDiscovery()
    }
    return ServiceDiscovery.instance
  }

  async getServiceUrl(serviceName: ServiceName): Promise<string> {
    const now = Date.now()
    if (now - this.lastUpdate > this.CACHE_TTL) {
      await this.updateServices()
    }
    return this.services.get(serviceName) || this.getFallbackUrl(serviceName)
  }

  private async updateServices(): Promise<void> {
    try {
      const env = (process.env.NEXT_PUBLIC_ENVIRONMENT as Environment) || 'development'
      if (env === 'development') {
        this.services.set('core-service', 'http://localhost:8080/api')
        this.services.set('financial-service', 'http://localhost:8081/api')
      } else {
        // Em produção, usar AWS ELB/ALB com health checks
        this.services.set('core-service', 'https://core-api.vynlotech.com/api')
        this.services.set('financial-service', 'https://financial-api.vynlotech.com/api')
      }
      this.lastUpdate = Date.now()
    } catch (error) {
      console.error('Service discovery failed:', error)
    }
  }

  private getFallbackUrl(serviceName: ServiceName): string {
    const fallbacks: Record<ServiceName, string> = {
      'core-service': 'http://localhost:8080/api',
      'financial-service': 'http://localhost:8081/api'
    }
    return fallbacks[serviceName] || 'http://localhost:8080/api'
  }
}

export const API_CONFIG = {
  TIMEOUT: 5000, // Reduzido para produção
  MAX_RETRIES: 2, // Reduzido - retry deve ser no backend
  CIRCUIT_BREAKER_THRESHOLD: 5
}

// Circuit Breaker Pattern para alta disponibilidade
class CircuitBreaker {
  private failures = 0
  private lastFailTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private readonly threshold = API_CONFIG.CIRCUIT_BREAKER_THRESHOLD
  private readonly timeout = 60000 // 1 minuto

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > this.timeout) {
        this.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess(): void {
    this.failures = 0
    this.state = 'CLOSED'
  }

  private onFailure(): void {
    this.failures++
    this.lastFailTime = Date.now()
    if (this.failures >= this.threshold) {
      this.state = 'OPEN'
    }
  }
}

const circuitBreaker = new CircuitBreaker()

// Criar AbortController compatível
const createTimeoutSignal = (timeout: number): AbortSignal => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), timeout)
  return controller.signal
}

// Fetch otimizado para produção
export const fetchWithCircuitBreaker = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  return circuitBreaker.execute(async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      signal: options.signal || createTimeoutSignal(API_CONFIG.TIMEOUT)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    return response
  })
}

// Service-aware URL builder
export const buildApiUrl = async (serviceName: ServiceName, endpoint: string): Promise<string> => {
  const serviceDiscovery = ServiceDiscovery.getInstance()
  const baseUrl = await serviceDiscovery.getServiceUrl(serviceName)
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${baseUrl}/${cleanEndpoint}`
}

// Headers padrão com autenticação
export const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// Gerar UUID compatível
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Requisições enterprise com service discovery
export const apiRequest = async (
  serviceName: ServiceName,
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    const url = await buildApiUrl(serviceName, endpoint)
    const headers = {
      ...getAuthHeaders(),
      'X-Request-ID': generateUUID(),
      'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      ...options.headers
    }
    
    return await fetchWithCircuitBreaker(url, { ...options, headers })
  } catch (error) {
    console.error(`API request failed for ${serviceName}/${endpoint}:`, error)
    throw error
  }
}