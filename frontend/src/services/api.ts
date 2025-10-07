// Tipos para service discovery
type ServiceName = 'core-service' | 'financial-service'

// Service Discovery Simplificado
const getServiceUrl = (serviceName: ServiceName): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  const urls: Record<ServiceName, string> = {
    'core-service': baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl,
    'financial-service': baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl
  }
  return urls[serviceName]
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
export const buildApiUrl = (serviceName: ServiceName, endpoint: string): string => {
  const baseUrl = getServiceUrl(serviceName)
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${baseUrl}/api/${cleanEndpoint}`
}

// Headers padrão com autenticação
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  let token = null
  
  if (typeof window !== 'undefined') {
    try {
      const { getAuth } = await import('firebase/auth')
      const auth = getAuth()
      if (auth?.currentUser) {
        token = await auth.currentUser.getIdToken()
        console.log('Token obtido:', token ? 'Sim' : 'Não')
      } else {
        console.warn('Usuário não está logado no Firebase')
      }
    } catch (error) {
      console.error('Erro ao obter token Firebase:', error)
    }
  }
  
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
    const url = buildApiUrl(serviceName, endpoint)
    const authHeaders = await getAuthHeaders()
    const headers = {
      ...authHeaders,
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