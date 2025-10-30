import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '@/components/dashboard/__tests__/test-utils'
import '@testing-library/jest-dom'
import SuperAdminPage from '../app/super-admin/page'
import { apiService } from '../services/api'

// Mock services
jest.mock('../services/api')
jest.mock('../hooks/useWebSocket', () => ({
  useWebSocket: () => ({
    subscribe: jest.fn(() => jest.fn()),
    send: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    isConnected: jest.fn(() => true)
  })
}))

const mockApiService = apiService as jest.Mocked<typeof apiService>

describe('SuperAdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockApiService.getKPIs.mockResolvedValue({
      activeUsers: { value: 1234, change: 12.5, trend: 'up' },
      revenue: { value: 205000, change: 8.7, trend: 'up' },
      orders: { value: 2847, change: -2.3, trend: 'down' },
      performance: { value: 98.5, change: 1.2, trend: 'up' }
    })
  })

  it('renders dashboard header correctly', async () => {
    render(<SuperAdminPage />)
    
    expect(screen.getByText('Dashboard Executivo')).toBeInTheDocument()
    expect(screen.getByText('Visão geral da plataforma Vynlo')).toBeInTheDocument()
  })

  it('displays KPI cards', async () => {
    render(<SuperAdminPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Usuários Ativos')).toBeInTheDocument()
      expect(screen.getByText('Receita Mensal')).toBeInTheDocument()
    })
  })

  it('switches between tabs', async () => {
    render(<SuperAdminPage />)
    
    const clientsButton = screen.getByText('Clientes')
    fireEvent.click(clientsButton)
    
    await waitFor(() => {
      expect(screen.getByText('Gerenciamento de Usuários')).toBeInTheDocument()
    })
  })

  it('has accessible regions', () => {
    render(<SuperAdminPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    mockApiService.getKPIs.mockRejectedValue(new Error('API Error'))
    
    render(<SuperAdminPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Usuários Ativos')).toBeInTheDocument()
    })
  })
})