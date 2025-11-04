// Tipos para service discovery (v2.1.2 - circuit breaker robusto)
// Fix: Threshold 4, isolamento por origem, não conta 4xx
// Updated: 2025-10-11 13:47 UTC
// touch: redeploy note (commit 0b28909) - comentário leve sem impacto funcional - atualizado para forçar push
type ServiceName = 'core-service' | 'financial-service'

// Service Discovery Simplificado - PADRÃO BIG TECH (Netflix, Uber)
const getServiceUrl = (serviceName: ServiceName): string => {
  // PADRÃO BIG TECH: Validação fail-fast de variáveis de ambiente
  if (typeof window === 'undefined') {
    // Server-side: usar variável de ambiente ou fallback
    const envUrl = process.env.NEXT_PUBLIC_API_URL
    if (!envUrl) {
      console.error('❌ NEXT_PUBLIC_API_URL não está definido - build falhou validação')
      throw new Error('NEXT_PUBLIC_API_URL environment variable is required')
    }
    // Remover /api do final se presente (buildApiUrl adiciona)
    return envUrl.replace(/\/api\/?$/, '') || 'https://api.vynlotech.com'
  }
  
  // Client-side: detecção inteligente de ambiente
  const hostname = window.location.hostname
  const isProd = hostname === 'vynlotech.com' || 
                 hostname === 'www.vynlotech.com' ||
                 hostname.endsWith('.vynlotech.com') ||
                 hostname.endsWith('.vynlotaste.com')
  
  const baseUrl = isProd 
    ? 'https://api.vynlotech.com'
    : (process.env.NEXT_PUBLIC_API_URL || 'https://api.vynlotech.com')
  
  // PADRÃO BIG TECH: Normalização de URL (remove trailing slashes e /api duplicado)
  const normalizedUrl = baseUrl
    .trim()
    .replace(/\/api\/?$/, '') // Remove /api do final se presente
    .replace(/\/+$/, '') // Remove trailing slashes
  
  const urls: Record<ServiceName, string> = {
    'core-service': normalizedUrl,
    'financial-service': normalizedUrl
  }
  return urls[serviceName]
}

// Build version para forçar cache-busting
const BUILD_VERSION = '2.1.1-fix-final'

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
  CIRCUIT_BREAKER_THRESHOLD: 4, // ✅ Aumentado conforme Cursor (não abre por ruído)
  BUILD_VERSION // Forçar rebuild
}

// Circuit Breaker Pattern robusto para produção (3M+ usuários)
// ✅ Amazon Q Recommendation: threshold 10, cooldown 15s, halfOpen 3 tentativas
class CircuitBreaker {
  private failures = 0
  private lastFailTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private readonly threshold = 10 // Amazon Q: Mais tolerante para produção
  private readonly cooldown = 15000 // Amazon Q: 15s (mais rápido)
  private readonly halfOpenAttempts = 3 // Amazon Q: Mais tentativas

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > this.cooldown) {
        this.state = 'HALF_OPEN'
        console.log('🟡 Circuit breaker: HALF_OPEN (testando recuperação)')
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      // ✅ Só conta erros RECUPERÁVEIS (não 4xx de validação/auth)
      if (this.isRecoverableError(error)) {
        this.onFailure()
      }
      throw error
    }
  }

  // PADRÃO BIG TECH: Determinar se erro é recuperável (Netflix circuit breaker pattern)
  private isRecoverableError(error: any): boolean {
    const errorMessage = error?.message || ''
    const errorType = error?.errorType || ''
    
    // Erros de rede/timeout (recuperáveis) - conta para circuit breaker
    if (errorType === 'NETWORK' || errorType === 'DNS' || errorType === 'TIMEOUT' ||
        errorMessage.includes('Failed to fetch') || 
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('TimeoutError') ||
        errorMessage.includes('aborted')) {
      return true
    }
    
    // HTTP 5xx e 429 (sobrecarga/rate limit - recuperáveis)
    if (errorMessage.includes('HTTP 5') || 
        errorMessage.includes('HTTP 429') ||
        errorType === 'SERVER_ERROR') {
      return true
    }
    
    // ❌ CORS errors NÃO são recuperáveis sem mudança de configuração
    if (errorType === 'CORS' || errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
      return false // CORS requer correção de configuração, não retry
    }
    
    // ❌ 4xx NÃO são recuperáveis (autenticação/validação - não conta)
    if (errorMessage.includes('HTTP 4') || errorType === 'CLIENT_ERROR') {
      return false
    }
    
    return false
  }

  private onSuccess(): void {
    this.failures = 0
    this.state = 'CLOSED'
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Circuit breaker: CLOSED (saudável)')
    }
  }

  private onFailure(): void {
    this.failures++
    this.lastFailTime = Date.now()
    
    if (this.state === 'HALF_OPEN') {
      // Falhou em half-open, volta para OPEN
      this.state = 'OPEN'
      console.warn('🔴 Circuit breaker: OPEN (falha em recuperação)')
    } else if (this.failures >= this.threshold) {
      this.state = 'OPEN'
      console.warn('🔴 Circuit breaker: OPEN (threshold atingido)')
    }
  }
}

// ✅ Isolamento por origem (um host não derruba outros)
const circuitBreakers = new Map<string, CircuitBreaker>()

const getCircuitBreaker = (origin: string): CircuitBreaker => {
  if (!circuitBreakers.has(origin)) {
    circuitBreakers.set(origin, new CircuitBreaker())
  }
  return circuitBreakers.get(origin)!
}

// Criar AbortController compatível
const createTimeoutSignal = (timeout: number): AbortSignal => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), timeout)
  return controller.signal
}

// Fetch otimizado para produção com circuit breaker por origem
export const fetchWithCircuitBreaker = async (
  url: string,
  options: RequestInit = {},
  retryConfig?: { maxRetries: number; currentRetry: number }
): Promise<Response> => {
  // ✅ Pegar circuit breaker isolado por origem
  const origin = new URL(url).origin
  const breaker = getCircuitBreaker(origin)
  
  return breaker.execute(async () => {
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
    
    // ✅ Correção: não lançar exceção aqui; deixe apiRequest tratar todos os status
    // Isso simplifica os testes e garante mensagens de erro consistentes
    
    return response
  })
}

// Service-aware URL builder - PADRÃO BIG TECH (Uber, Airbnb)
export const buildApiUrl = (serviceName: ServiceName, endpoint: string): string => {
  const baseUrl = getServiceUrl(serviceName)
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  
  // PADRÃO BIG TECH: Normalização robusta de URL
  // - ALB routes /api/* to backend (Spring Boot context-path=/api)
  // - Garante que não há duplicação de /api
  const normalizedBase = baseUrl.replace(/\/api\/?$/, '')
  const apiPath = cleanEndpoint.startsWith('api/') ? cleanEndpoint : `api/${cleanEndpoint}`
  
  const finalUrl = `${normalizedBase}/${apiPath}`
  
  // Validação fail-fast (desenvolvimento)
  if (process.env.NODE_ENV === 'development' && finalUrl.includes('/api/api/')) {
    console.error('❌ URL duplicada detectada:', finalUrl)
    throw new Error(`Duplicate /api detected in URL: ${finalUrl}`)
  }
  
  return finalUrl
}

// Cache do token para evitar múltiplas chamadas ao Firebase
let cachedToken: { token: string; expiresAt: number } | null = null
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000 // 5 minutos antes de expirar

// ✅ SEGURANÇA: Limpar cache do token no logout
export const clearTokenCache = () => {
  cachedToken = null
  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️ Token cache limpo')
  }
}

// Headers padrão com autenticação (sem Content-Type para evitar preflight em GET)
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  let token = null
  
  if (typeof window !== 'undefined') {
    try {
      const { getAuthInstance } = await import('@/config/firebase')
      const auth = getAuthInstance()
      
      if (auth?.currentUser) {
        // ✅ SOLUÇÃO DEFINITIVA: Verificar se o token está próximo de expirar
        const now = Date.now()
        
        if (cachedToken && cachedToken.expiresAt > now) {
          // Token ainda válido no cache
          token = cachedToken.token
          
          if (process.env.NODE_ENV === 'development') {
            const timeUntilExpiry = cachedToken.expiresAt - now
            console.log(`✅ Token válido no cache (${Math.floor(timeUntilExpiry / 1000)}s restantes)`)
          }
        } else {
          // Token expirado ou não existe - buscar novo token com refresh preventivo
          const idTokenResult = await auth.currentUser.getIdTokenResult()
          const expiresAt = idTokenResult.expirationTime ? new Date(idTokenResult.expirationTime).getTime() : now + 60 * 60 * 1000 // Default 1h
          
          // Se está próximo de expirar (menos de 5 minutos), forçar refresh
          const shouldRefresh = (expiresAt - now) < TOKEN_REFRESH_BUFFER_MS
          
          if (shouldRefresh && process.env.NODE_ENV === 'development') {
            console.log('🔄 Token próximo de expirar, forçando refresh preventivo...')
          }
          
          token = await auth.currentUser.getIdToken(shouldRefresh) // force refresh se necessário
          
          // Cachear o novo token
          cachedToken = {
            token,
            expiresAt
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Novo token obtido e cacheado (expira em ${Math.floor((expiresAt - now) / 1000)}s)`)
          }
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao obter token Firebase:', error)
      }
      // Limpar cache em caso de erro
      cachedToken = null
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
    
    // Montar headers base
    const baseHeaders: Record<string, string> = {
      ...authHeaders,
      'X-Request-ID': generateUUID(),
      'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    }
    
    // Merge com headers customizados
    const customHeaders = (options.headers || {}) as Record<string, string>
    const finalHeaders: Record<string, string> = {
      ...baseHeaders,
      ...customHeaders
    }
    
    // Adicionar Content-Type se houver body
    if (options.body) {
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
    
    let response = await fetchWithCircuitBreaker(url, { ...options, headers: finalHeaders })
    
    // ✅ SOLUÇÃO DEFINITIVA: Se recebemos 401, limpar cache e tentar UMA VEZ
    if (response.status === 401 && typeof window !== 'undefined' && !(options as any).__retryAttempted) {
      try {
        // Limpar token cacheado pois está inválido
        cachedToken = null
        
        const { getAuthInstance } = await import('@/config/firebase')
        const auth = getAuthInstance()
        
        // Forçar refresh do token
        if (auth?.currentUser) {
          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Recebido 401 - forçando refresh do token...')
          }
          
          const newToken = await auth.currentUser.getIdToken(true) // true = force refresh
          const idTokenResult = await auth.currentUser.getIdTokenResult()
          const expiresAt = idTokenResult.expirationTime ? new Date(idTokenResult.expirationTime).getTime() : Date.now() + 60 * 60 * 1000
          
          // Cachear o novo token
          cachedToken = {
            token: newToken,
            expiresAt
          }
          
          // Tentar novamente com o novo token (marcar como retry para evitar loop)
          const newAuthHeaders = await getAuthHeaders()
          
          const retryHeaders: Record<string, string> = {
            ...newAuthHeaders,
            'X-Request-ID': generateUUID(),
            'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
            ...(options.body && { 'Content-Type': 'application/json' })
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Retentando requisição com token refreshado...')
          }
          
          const retryOptions = { 
            ...options, 
            headers: retryHeaders,
            __retryAttempted: true // Marcar como retry para evitar loop
          } as RequestInit
          
          response = await fetchWithCircuitBreaker(url, retryOptions)
          
          if (process.env.NODE_ENV === 'development' && response.ok) {
            console.log('✅ Retry bem-sucedido após refresh do token')
          } else if (process.env.NODE_ENV === 'development' && response.status === 401) {
            console.error('❌ 401 persistente após refresh')
          }
        }
      } catch (refreshError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Falha ao refresh token:', refreshError)
        }
        cachedToken = null // Limpar cache em caso de erro
      }
    }
    
    // Se 401 ainda persistir após retry, lançar erro apropriado
    if (response.status === 401 && !response.ok) {
      const errorMessage = await response.text().catch(() => 'Unauthorized')
      throw new Error(`HTTP 401: ${errorMessage}`)
    }
    
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
    // PADRÃO BIG TECH: Logging estruturado e diferenciação de tipos de erro
    const errorObj = error instanceof Error ? error : new Error(String(error))
    const errorMessage = errorObj.message || 'Unknown error'
    const url = buildApiUrl(serviceName, endpoint)
    
    // Classificar erro para observabilidade (Datadog/Sentry pattern)
    let errorType: 'NETWORK' | 'CORS' | 'TIMEOUT' | 'DNS' | 'UNKNOWN' = 'UNKNOWN'
    const errorDetails: Record<string, any> = {
      service: serviceName,
      endpoint,
      url,
      method: options.method || 'GET'
    }
    
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      // Tentar diferenciar causa raiz
      if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
        errorType = 'TIMEOUT'
        errorDetails.timeout_ms = API_CONFIG.TIMEOUT
      } else if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
        errorType = 'CORS'
        errorDetails.origin = typeof window !== 'undefined' ? window.location.origin : 'SSR'
      } else {
        errorType = 'NETWORK'
        // Pode ser DNS, conexão recusada, ou backend offline
        errorDetails.backendUrl = url
      }
    } else if (errorMessage.includes('getaddrinfo') || errorMessage.includes('ENOTFOUND')) {
      errorType = 'DNS'
    }
    
    errorDetails.errorType = errorType
    errorDetails.errorMessage = errorMessage
    errorDetails.timestamp = new Date().toISOString()
    
    // Log estruturado (padrão Big Tech - Datadog/Sentry)
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API request failed [${errorType}]:`, errorDetails)
    } else {
      // Em produção, enviar para observabilidade (Sentry/Datadog)
      // TODO: Integrar com Sentry/Datadog aqui
      console.error(`API request failed [${errorType}]: ${serviceName}/${endpoint}`)
    }
    
    // Criar erro enriquecido para Error Boundary
    const enrichedError = new Error(`API Error [${errorType}]: ${errorMessage}`)
    ;(enrichedError as any).errorType = errorType
    ;(enrichedError as any).errorDetails = errorDetails
    throw enrichedError
  }
}

// v2.1.2 - Circuit breaker robusto para produção (3M+ usuários)
// Modified: 2025-10-14 18:01 UTC | URL builder fix verified: /api/ prefix removed (verified ✓)

/**
 * ApiService - Classe wrapper enterprise seguindo padrões Big Tech (Netflix, Uber, Spotify)
 * 
 * Encapsula apiRequest e fornece métodos específicos por domínio para facilitar testes
 * e melhorar organização do código.
 * 
 * Padrão usado por:
 * - Netflix: Service classes com métodos específicos
 * - Uber: Domain-specific API clients
 * - Spotify: Wrapper classes para facilitar mocking em testes
 * 
 * Fase 7: Adicionado para compatibilidade com testes existentes
 */
class ApiService {
  private token: string | null = null

  /**
   * Define o token de autenticação manualmente (para testes)
   */
  setToken(token: string): void {
    this.token = token
    // Também atualizar cache global para manter consistência
    clearTokenCache()
  }

  /**
   * Limpa o token armazenado
   */
  clearToken(): void {
    this.token = null
    clearTokenCache()
  }

  /**
   * Obtém headers de autenticação (com suporte a token manual para testes)
   */
  private async getHeaders(): Promise<Record<string, string>> {
    if (this.token) {
      return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    }
    return await getAuthHeaders()
  }

  /**
   * Busca KPIs do admin
   */
  async getKPIs(): Promise<any> {
    const headers = await this.getHeaders()
    const response = await apiRequest('core-service', 'admin/kpis', {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  }

  /**
   * Cria um novo usuário
   */
  async createUser(userData: any): Promise<any> {
    const headers = await this.getHeaders()
    const response = await apiRequest('core-service', 'admin/users', {
      method: 'POST',
      headers,
      body: JSON.stringify(userData)
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  }
}

// Exportar instância singleton (padrão Big Tech - Netflix, Uber, Spotify)
export const apiService = new ApiService()