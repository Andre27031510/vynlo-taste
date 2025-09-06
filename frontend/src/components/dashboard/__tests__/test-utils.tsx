import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Utilitários para testes - Vynlo Taste Dashboard
 * Fornece wrappers e helpers para facilitar os testes dos componentes
 */

// Mock personalizado para useTheme
export const mockUseTheme = (theme: 'light' | 'dark' | 'auto' = 'dark') => {
  const mockToggleTheme = jest.fn()
  
  jest.doMock('@/hooks/useTheme', () => ({
    useTheme: () => ({
      currentTheme: theme,
      toggleTheme: mockToggleTheme,
    }),
  }))
  
  return { mockToggleTheme }
}

// Mock personalizado para useAuth
export const mockUseAuth = (user = {
  displayName: 'Test User',
  email: 'test@vynlotaste.com'
}) => {
  const mockLogout = jest.fn()
  
  jest.doMock('@/contexts/AuthContext', () => ({
    useAuth: () => ({
      user,
      logout: mockLogout,
    }),
  }))
  
  return { mockLogout }
}

// Mock personalizado para react-responsive
export const mockUseMediaQuery = (isMobile = false, isTablet = false) => {
  jest.doMock('react-responsive', () => ({
    useMediaQuery: jest.fn((query) => {
      if (query.maxWidth === 768) return isMobile
      if (query.minWidth === 769 && query.maxWidth === 1024) return isTablet
      return false
    }),
  }))
}

// Wrapper customizado para React Query
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
})

interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = createTestQueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// Função de render customizada
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Helper para simular eventos de teclado
export const simulateKeyPress = (element: Element, key: string) => {
  const event = new KeyboardEvent('keydown', { key })
  element.dispatchEvent(event)
}

// Helper para verificar classes Tailwind
export const hasClass = (element: Element, className: string): boolean => {
  return element.classList.contains(className)
}

// Helper para verificar múltiplas classes
export const hasClasses = (element: Element, classNames: string[]): boolean => {
  return classNames.every(className => element.classList.contains(className))
}

// Mock para dados de pedidos
export const mockOrdersData = [
  {
    id: '1',
    customerName: 'João Silva',
    items: [
      { id: '1', name: 'Pizza Margherita', quantity: 1, price: 35.90 }
    ],
    total: 35.90,
    status: 'pending' as const,
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
    status: 'preparing' as const,
    createdAt: '2024-01-15T11:00:00Z',
    paymentMethod: 'PIX'
  }
]

// Mock para estatísticas de pedidos
export const mockOrdersStats = {
  totalOrders: 150,
  pendingOrders: 12,
  completedOrders: 138,
  revenue: 4500.00,
}

// Mock para membros da equipe
export const mockTeamMembers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@vynlotaste.com',
    role: 'Gerente',
    status: 'active' as const,
    permissions: ['orders', 'menu', 'reports']
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@vynlotaste.com',
    role: 'Atendente',
    status: 'active' as const,
    permissions: ['orders', 'clients']
  }
]

// Helper para aguardar animações
export const waitForAnimation = (duration = 300) => {
  return new Promise(resolve => setTimeout(resolve, duration))
}

// Helper para verificar acessibilidade básica
export const checkBasicAccessibility = (element: Element) => {
  const checks = {
    hasAriaLabel: element.hasAttribute('aria-label'),
    hasRole: element.hasAttribute('role'),
    isFocusable: element.hasAttribute('tabindex') || 
                 ['button', 'input', 'select', 'textarea', 'a'].includes(element.tagName.toLowerCase()),
    hasFocusStyles: hasClasses(element, ['focus:ring-2', 'focus:outline-none']) ||
                    hasClass(element, 'focus:ring-blue-500')
  }
  
  return checks
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }