// Mock fetch ANTES dos imports (padrão Big Tech - isolamento completo)
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock Firebase ANTES dos imports
jest.mock('@/config/firebase', () => ({
  getAuthInstance: jest.fn(() => ({
    currentUser: {
      getIdToken: jest.fn(() => Promise.resolve('mock-token')),
      getIdTokenResult: jest.fn(() => Promise.resolve({ expirationTime: new Date(Date.now() + 3600000).toISOString() }))
    },
    onAuthStateChanged: jest.fn()
  }))
}))

import { apiService } from '../services/api'

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock padrão: resposta de sucesso
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ success: true })
    } as Response)
    
    // Limpar token antes de cada teste
    apiService.clearToken()
  })

  afterEach(() => {
    apiService.clearToken()
  })

  it('makes GET request to KPIs endpoint', async () => {
    await apiService.getKPIs()
    
    expect(mockFetch).toHaveBeenCalled()
    const callArgs = (mockFetch.mock.calls[0] || [])[1] as RequestInit
    expect(callArgs?.method).toBe('GET')
  })

  it('makes POST request to create user', async () => {
    const userData = { name: 'Test User', email: 'test@example.com' }
    
    await apiService.createUser(userData)
    
    expect(mockFetch).toHaveBeenCalled()
    const callArgs = (mockFetch.mock.calls[0] || [])[1] as RequestInit
    expect(callArgs?.method).toBe('POST')
    expect(callArgs?.body).toBe(JSON.stringify(userData))
  })

  it('handles API errors correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Server Error' })
    } as Response)

    await expect(apiService.getKPIs()).rejects.toBeInstanceOf(Error)
  })

  it('includes auth token when manually set', async () => {
    apiService.setToken('test-token')
    
    await apiService.getKPIs()
    
    expect(mockFetch).toHaveBeenCalled()
    const callArgs = (mockFetch.mock.calls[0] || [])[1] as RequestInit
    const headers = callArgs?.headers as Record<string, string>
    expect(headers?.['Authorization']).toBe('Bearer test-token')
  })
})