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

export const API_CONFIG = {
  TIMEOUT: 15000, // 15s para evitar aborts falsos em produção
  MAX_RETRIES: 2, // Reduzido - retry deve ser no backend
  CIRCUIT_BREAKER_THRESHOLD: 4, // Mais robusto: evita abrir por falhas pontuais/4xx
  BUILD_VERSION // Forçar rebuild
}

// Circuit Breaker Pattern para alta disponibilidade
class CircuitBreaker {
  private failures = 0
  private lastFailTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private readonly threshold = API_CONFIG.CIRCUIT_BREAKER_THRESHOLD
  private readonly timeout = 10000 // 10 segundos
  private testingHalfOpen = false

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      // janela de resfriamento
      if (Date.now() - this.lastFailTime > this.timeout) {
        // permitir apenas um teste em HALF_OPEN
        if (this.testingHalfOpen) {
          throw new Error('Circuit breaker is OPEN')
        }
        this.state = 'HALF_OPEN'
        this.testingHalfOpen = true
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure(error)
      throw error
    }
  }

  private onSuccess(): void {
    this.failures = 0
    this.state = 'CLOSED'
    this.testingHalfOpen = false
  }

  private shouldCountFailure(error: unknown): boolean {
    // Abort/timeout e erros de rede contam
    if (error && typeof error === 'object') {
      const anyErr = error as any
      if (anyErr.name === 'AbortError') return true
      if (anyErr.cbRetryable === true) return true
      if (typeof anyErr.message === 'string') {
        const match = anyErr.message.match(/HTTP\s+(\d{3})/)
        if (match) {
          const status = parseInt(match[1], 10)
          // Contabiliza apenas 5xx e 429 (sobrecarga/limite)
          if (status >= 500 || status === 429) return true
          return false
        }
        // TypeError: Failed to fetch (erros de rede)
        if (/Failed to fetch|NetworkError/i.test(anyErr.message)) return true
      }
    }
    // conservador: se não sabemos, não conta para não abrir indevidamente
    return false
  }

  private onFailure(error: unknown): void {
    // só abre o disjuntor para falhas recuperáveis (rede/5xx/429)
    if (!this.shouldCountFailure(error)) {
      // HALF_OPEN em teste deve ser liberado mesmo em falha não-contabilizada
      this.testingHalfOpen = false
      return
    }

    this.failures++
    this.lastFailTime = Date.now()
    if (this.failures >= this.threshold) {
      this.state = 'OPEN'
    }
    // liberar HALF_OPEN
    this.testingHalfOpen = false
  }
}

// Circuit breakers por ORIGIN para evitar blackout global entre serviços
const circuitBreakersByOrigin: Map<string, CircuitBreaker> = new Map()

const getCircuitBreakerForUrl = (url: string): CircuitBreaker => {
  let origin = ''
  try {
    origin = new URL(url).origin
  } catch {
    origin = 'default'
  }
  let cb = circuitBreakersByOrigin.get(origin)
  if (!cb) {
    cb = new CircuitBreaker()
    circuitBreakersByOrigin.set(origin, cb)
  }
  return cb
}

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
  const cb = getCircuitBreakerForUrl(url)
  return cb.execute(async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        // Só envia Content-Type quando houver body; evita preflight em GET
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        'Accept': 'application/json',
        ...options.headers
      },
      signal: options.signal || createTimeoutSignal(API_CONFIG.TIMEOUT)
    })
    
    if (!response.ok) {
      // Classificar erro para o CB: 5xx e 429 contam; 4xx típicos não
      const err: any = new Error(`HTTP ${response.status}`)
      err.cbStatus = response.status
      err.cbRetryable = response.status >= 500 || response.status === 429
      throw err
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
    // Não define Content-Type aqui; deixa para o fetch incluir quando houver body
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
    if (process.env.NODE_ENV === 'development') {
      console.error(`API request failed for ${serviceName}/${endpoint}:`, error)
    }
    throw error
  }
}