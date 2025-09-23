import { apiService } from '../services/api'

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    } as Response)
  })

  it('makes GET request to KPIs endpoint', async () => {
    await apiService.getKPIs()
    
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/admin/kpis',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    )
  })

  it('makes POST request to create user', async () => {
    const userData = { name: 'Test User', email: 'test@example.com' }
    
    await apiService.createUser(userData)
    
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/admin/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(userData)
      })
    )
  })

  it('handles API errors', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    } as Response)

    await expect(apiService.getKPIs()).rejects.toThrow('API Error: 500 Internal Server Error')
  })

  it('includes auth token when available', async () => {
    apiService.setToken('test-token')
    
    await apiService.getKPIs()
    
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token'
        })
      })
    )
  })
})