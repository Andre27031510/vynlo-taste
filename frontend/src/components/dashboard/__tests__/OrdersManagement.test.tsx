import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import OrdersManagement from '../OrdersManagement'

// Mock axios
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock dos hooks personalizados
const mockRefetchOrders = jest.fn()
const mockUpdateOrderMutation = {
  mutate: jest.fn(),
  isLoading: false,
}

jest.mock('@/hooks/useOrdersQuery', () => ({
  useOrdersQuery: () => ({
    data: [
      {
        id: '1',
        customerName: 'João Silva',
        items: [
          { id: '1', name: 'Pizza Margherita', quantity: 1, price: 35.90 }
        ],
        total: 35.90,
        status: 'pending',
        createdAt: '2024-01-15T10:00:00Z',
        deliveryAddress: 'Rua das Flores, 123',
        paymentMethod: 'Cartão de Crédito'
      },
      {
        id: '2',
        customerName: 'Maria Santos',
        items: [
          { id: '2', name: 'Hambúrguer Clássico', quantity: 2, price: 25.50 }
        ],
        total: 51.00,
        status: 'preparing',
        createdAt: '2024-01-15T11:00:00Z',
        paymentMethod: 'PIX'
      }
    ],
    isLoading: false,
    error: null,
    refetch: mockRefetchOrders,
  }),
  useOrdersStatsQuery: () => ({
    data: {
      totalOrders: 150,
      pendingOrders: 12,
      completedOrders: 138,
      revenue: 4500.00,
    },
    isLoading: false,
  }),
  useUpdateOrderStatus: () => mockUpdateOrderMutation,
}))

// Wrapper para React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('OrdersManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar a lista de pedidos corretamente', () => {
    render(<OrdersManagement />, { wrapper: createWrapper() })
    
    // Verificar se título está presente
    expect(screen.getByText('Gestão de Pedidos')).toBeInTheDocument()
    
    // Verificar se pedidos estão listados
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    
    // Verificar se valores estão formatados corretamente
    expect(screen.getByText('R$ 35,90')).toBeInTheDocument()
    expect(screen.getByText('R$ 51,00')).toBeInTheDocument()
  })

  it('deve exibir estatísticas dos pedidos', () => {
    render(<OrdersManagement />, { wrapper: createWrapper() })
    
    // Verificar estatísticas
    expect(screen.getByText('150')).toBeInTheDocument() // Total de pedidos
    expect(screen.getByText('12')).toBeInTheDocument()  // Pendentes
    expect(screen.getByText('138')).toBeInTheDocument() // Concluídos
    expect(screen.getByText('R$ 4.500,00')).toBeInTheDocument() // Receita
  })

  it('deve filtrar pedidos por status', async () => {
    render(<OrdersManagement />, { wrapper: createWrapper() })
    
    // Encontrar select de filtro
    const statusFilter = screen.getByDisplayValue('Todos os Status')
    
    // Filtrar por pendentes
    fireEvent.change(statusFilter, { target: { value: 'pending' } })
    
    // Verificar se apenas pedidos pendentes são mostrados
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument()
    })
  })

  it('deve buscar pedidos por nome do cliente', async () => {
    render(<OrdersManagement />, { wrapper: createWrapper() })
    
    // Encontrar campo de busca
    const searchInput = screen.getByPlaceholderText('Buscar por cliente ou ID do pedido...')
    
    // Buscar por "João"
    fireEvent.change(searchInput, { target: { value: 'João' } })
    
    // Verificar se apenas João Silva aparece
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument()
    })
  })

  it('deve atualizar status do pedido quando botão é clicado', async () => {
    render(<OrdersManagement />, { wrapper: createWrapper() })
    
    // Encontrar botão "Preparar" para pedido pendente
    const prepareButton = screen.getByText('Preparar')
    
    // Clicar no botão
    fireEvent.click(prepareButton)
    
    // Verificar se mutation foi chamada com parâmetros corretos
    expect(mockUpdateOrderMutation.mutate).toHaveBeenCalledWith({
      orderId: '1',
      status: 'preparing'
    })
  })

  it('deve mostrar botões de ação apropriados para cada status', () => {
    render(<OrdersManagement />, { wrapper: createWrapper() })
    
    // Pedido pendente deve ter botão "Preparar"
    expect(screen.getByText('Preparar')).toBeInTheDocument()
    
    // Pedido em preparo deve ter botão "Pronto"
    expect(screen.getByText('Pronto')).toBeInTheDocument()
  })

  it('deve atualizar dados quando botão atualizar é clicado', () => {
    render(<OrdersManagement />, { wrapper: createWrapper() })
    
    // Encontrar botão de atualizar
    const refreshButton = screen.getByText('Atualizar')
    
    // Clicar no botão
    fireEvent.click(refreshButton)
    
    // Verificar se refetch foi chamado
    expect(mockRefetchOrders).toHaveBeenCalled()
  })

  it('deve exibir skeleton loading quando isLoading é true', () => {
    // Mock para estado de loading
    jest.doMock('@/hooks/useOrdersQuery', () => ({
      useOrdersQuery: () => ({
        data: [],
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      }),
      useOrdersStatsQuery: () => ({
        data: null,
        isLoading: true,
      }),
      useUpdateOrderStatus: () => mockUpdateOrderMutation,
    }))
    
    const { rerender } = render(<OrdersManagement />, { wrapper: createWrapper() })
    
    // Forçar re-render com novo mock
    rerender(<OrdersManagement />)
    
    // Verificar se skeletons estão presentes (elementos com animate-pulse)
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('deve exibir estado de erro quando há falha na requisição', () => {
    // Mock para estado de erro
    jest.doMock('@/hooks/useOrdersQuery', () => ({
      useOrdersQuery: () => ({
        data: [],
        isLoading: false,
        error: new Error('Erro ao carregar pedidos'),
        refetch: mockRefetchOrders,
      }),
      useOrdersStatsQuery: () => ({
        data: null,
        isLoading: false,
      }),
      useUpdateOrderStatus: () => mockUpdateOrderMutation,
    }))
    
    const { rerender } = render(<OrdersManagement />, { wrapper: createWrapper() })
    rerender(<OrdersManagement />)
    
    // Verificar se mensagem de erro está presente
    expect(screen.getByText('Erro ao carregar pedidos')).toBeInTheDocument()
    expect(screen.getByText('Tentar Novamente')).toBeInTheDocument()
  })

  it('deve exibir estado vazio quando não há pedidos', () => {
    // Mock para estado vazio
    jest.doMock('@/hooks/useOrdersQuery', () => ({
      useOrdersQuery: () => ({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      }),
      useOrdersStatsQuery: () => ({
        data: {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          revenue: 0,
        },
        isLoading: false,
      }),
      useUpdateOrderStatus: () => mockUpdateOrderMutation,
    }))
    
    const { rerender } = render(<OrdersManagement />, { wrapper: createWrapper() })
    rerender(<OrdersManagement />)
    
    // Verificar se mensagem de estado vazio está presente
    expect(screen.getByText('Nenhum pedido encontrado')).toBeInTheDocument()
  })

  it('deve formatar datas corretamente', () => {
    render(<OrdersManagement />, { wrapper: createWrapper() })
    
    // Verificar se data está formatada em português brasileiro
    expect(screen.getByText('15/01/2024 07:00:00')).toBeInTheDocument()
  })

  it('deve desabilitar botões durante loading de mutation', () => {
    // Mock para loading state
    const mockLoadingMutation = {
      mutate: jest.fn(),
      isLoading: true,
    }
    
    jest.doMock('@/hooks/useOrdersQuery', () => ({
      useOrdersQuery: () => ({
        data: [
          {
            id: '1',
            customerName: 'João Silva',
            items: [{ id: '1', name: 'Pizza', quantity: 1, price: 35.90 }],
            total: 35.90,
            status: 'pending',
            createdAt: '2024-01-15T10:00:00Z',
            paymentMethod: 'Cartão'
          }
        ],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      }),
      useOrdersStatsQuery: () => ({ data: null, isLoading: false }),
      useUpdateOrderStatus: () => mockLoadingMutation,
    }))
    
    const { rerender } = render(<OrdersManagement />, { wrapper: createWrapper() })
    rerender(<OrdersManagement />)
    
    // Verificar se botão está desabilitado durante loading
    const prepareButton = screen.getByText('Preparar')
    expect(prepareButton).toBeDisabled()
  })
})