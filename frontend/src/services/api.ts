// API Service for Super Admin
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // KPI Methods
  async getKPIs() {
    return this.request('/admin/kpis')
  }

  // User Management Methods
  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.role && params.role !== 'all') queryParams.append('role', params.role)
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status)
    
    return this.request(`/admin/users?${queryParams.toString()}`)
  }

  async createUser(userData: any) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id: number, userData: any) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: number) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    })
  }

  async bulkUpdateUsers(userIds: number[], action: string) {
    return this.request('/admin/users/bulk', {
      method: 'PATCH',
      body: JSON.stringify({ userIds, action }),
    })
  }

  // Monitoring Methods
  async getSystemServices() {
    return this.request('/admin/monitoring/services')
  }

  async getPerformanceMetrics() {
    return this.request('/admin/monitoring/performance')
  }

  async getAuditLogs(params?: { level?: string; search?: string; limit?: number }) {
    const queryParams = new URLSearchParams()
    if (params?.level && params.level !== 'all') queryParams.append('level', params.level)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    return this.request(`/admin/monitoring/logs?${queryParams.toString()}`)
  }

  async startBackup() {
    return this.request('/admin/monitoring/backup', {
      method: 'POST',
    })
  }

  async getSystemConfig() {
    return this.request('/admin/monitoring/config')
  }

  async updateSystemConfig(config: any) {
    return this.request('/admin/monitoring/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    })
  }

  // Reports Methods
  async getBusinessMetrics(dateRange?: string) {
    const queryParams = dateRange ? `?range=${dateRange}` : ''
    return this.request(`/admin/reports/business${queryParams}`)
  }

  async generateReport(templateId: number) {
    return this.request(`/admin/reports/generate/${templateId}`, {
      method: 'POST',
    })
  }

  async exportData(format: 'pdf' | 'excel', filters?: any) {
    return this.request('/admin/reports/export', {
      method: 'POST',
      body: JSON.stringify({ format, filters }),
    })
  }

  async getReportTemplates() {
    return this.request('/admin/reports/templates')
  }

  // Auth Methods
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }
}

export const apiService = new ApiService()