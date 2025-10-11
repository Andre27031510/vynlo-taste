// Tipos para service discovery (v2.1.1 - circuit breaker fix)
type ServiceName = 'core-service' | 'financial-service'

// Service Discovery Simplificado
const getServiceUrl = (serviceName: ServiceName): string => {
  // Em produção, sempre usar api.vynlotech.com
  const isProd = typeof window !== 'undefined' && 
                 (window.location.hostname === 'vynlotech.com' || 
                  window.location.hostname === 'www.vynlotech.com')
  
  const baseUrl = isProd 
    ? 'https://api.vynlotech.com'
    : (process.env.NEXT_PUBLIC_API_URL || 'https://api.vynlotech.com')
  
  const urls: Record<ServiceName, string> = {
    'core-service': baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl,
    'financial-service': baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl
  }
  return urls[serviceName]
}

// Build version para forçar cache-busting
const BUILD_VERSION = '2.1.1-fix'

// Timeout condicional: produção deve ser mais agressivo
const getTimeout = () => {
  if (typeof window !== 'undefined') {
    const isProd = window.location.hostname === 'vynlotech.com' || 
                   window.location.hostname === 'www.vynlotech.com'
    return isProd ? 10000 : 15000 // Produção: 10s, Dev: 15s
  }
  return process.env.NODE_ENV === 'production' ? 10000 : 15000
}

export const API_CONFIG = {
  TIMEOUT: getTimeout(), // Condicional: 10s prod, 15s dev
  MAX_RETRIES: 2, // Reduzido - retry deve ser no backend
  CIRCUIT_BREAKER_THRESHOLD: 2, // Reduzido para facilitar fechamento
  BUILD_VERSION // Forçar rebuild
}

// Circuit Breaker Pattern para alta disponibilidade
class CircuitBreaker {
  private failures = 0
  private lastFailTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private readonly threshold = API_CONFIG.CIRCUIT_BREAKER_THRESHOLD
  private readonly timeout = 10000 // 10 segundos - reduzido para facilitar recuperação

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
    // Só adicionar Content-Type se houver body (evita preflight desnecessário em GET)
    const baseHeaders: Record<string, string> = {
      'Accept': 'application/json',
    }
    
    // Adicionar Content-Type apenas quando há body (POST, PUT, PATCH)
    if (options.body) {
      baseHeaders['Content-Type'] = 'application/json'
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...baseHeaders,
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

// Headers padrão com autenticação (sem Content-Type para evitar preflight em GET)
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  let token = null
  
  if (typeof window !== 'undefined') {
    try {
      const { getAuthInstance } = await import('@/config/firebase')
      const auth = getAuthInstance()
      
      if (auth?.currentUser) {
        token = await auth.currentUser.getIdToken()
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao obter token Firebase:', error)
      }
    }
  }
  
  return {
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
    
    // Adicionar Content-Type apenas quando há body
    const finalHeaders = {
      ...authHeaders,
      'X-Request-ID': generateUUID(),
      'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      ...options.headers
    }
    
    // Adicionar Content-Type se houver body e não foi especificado
    if (options.body && !finalHeaders['Content-Type']) {
      finalHeaders['Content-Type'] = 'application/json'
    }
    
    // Log detalhado em desenvolvimento para diagnóstico
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔵 API Request:`, {
        service: serviceName,
        endpoint,
        method: options.method || 'GET',
        url,
        hasBody: !!options.body,
        headers: finalHeaders
      })
    }
    
    const response = await fetchWithCircuitBreaker(url, { ...options, headers: finalHeaders })
    
    // Log de sucesso em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Success:`, {
        service: serviceName,
        endpoint,
        status: response.status,
        url
      })
    }
    
    return response
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API request failed:`, {
        service: serviceName,
        endpoint,
        url: buildApiUrl(serviceName, endpoint),
        error: error instanceof Error ? error.message : String(error),
        method: options.method || 'GET'
      })
    }
    throw error
  }
}