import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from '../Header'

// Mock do hook useTheme
const mockToggleTheme = jest.fn()
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    currentTheme: 'dark',
    toggleTheme: mockToggleTheme,
  }),
}))

// Mock do contexto de autenticação
const mockLogout = jest.fn()
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      displayName: 'João Silva',
      email: 'joao@vynlotaste.com',
    },
    logout: mockLogout,
  }),
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

describe('Header Component', () => {
  const defaultProps = {
    sidebarCollapsed: false,
    setSidebarCollapsed: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar o header corretamente', () => {
    render(<Header {...defaultProps} />, { wrapper: createWrapper() })
    
    // Verificar se elementos principais estão presentes
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@vynlotaste.com')).toBeInTheDocument()
  })

  it('deve alternar o tema quando botões de tema são clicados', async () => {
    render(<Header {...defaultProps} />, { wrapper: createWrapper() })
    
    // Encontrar botões de tema pelos aria-labels
    const lightModeButton = screen.getByLabelText('Ativar modo claro')
    const darkModeButton = screen.getByLabelText('Ativar modo escuro')
    const autoModeButton = screen.getByLabelText('Ativar modo automático')
    
    // Testar clique no modo claro
    fireEvent.click(lightModeButton)
    expect(mockToggleTheme).toHaveBeenCalledWith('light')
    
    // Testar clique no modo escuro
    fireEvent.click(darkModeButton)
    expect(mockToggleTheme).toHaveBeenCalledWith('dark')
    
    // Testar clique no modo automático
    fireEvent.click(autoModeButton)
    expect(mockToggleTheme).toHaveBeenCalledWith('auto')
  })

  it('deve abrir e fechar o menu do usuário', async () => {
    render(<Header {...defaultProps} />, { wrapper: createWrapper() })
    
    // Encontrar botão do menu do usuário
    const userMenuButton = screen.getByLabelText('Menu do usuário')
    
    // Menu deve estar fechado inicialmente
    expect(screen.queryByText('Configurações')).not.toBeInTheDocument()
    
    // Abrir menu
    fireEvent.click(userMenuButton)
    await waitFor(() => {
      expect(screen.getByText('Configurações')).toBeInTheDocument()
      expect(screen.getByText('Sair')).toBeInTheDocument()
    })
    
    // Verificar aria-expanded
    expect(userMenuButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('deve executar logout quando botão sair é clicado', async () => {
    render(<Header {...defaultProps} />, { wrapper: createWrapper() })
    
    // Abrir menu do usuário
    const userMenuButton = screen.getByLabelText('Menu do usuário')
    fireEvent.click(userMenuButton)
    
    // Clicar em sair
    await waitFor(() => {
      const logoutButton = screen.getByText('Sair')
      fireEvent.click(logoutButton)
    })
    
    expect(mockLogout).toHaveBeenCalled()
  })

  it('deve permitir busca no campo de pesquisa', () => {
    render(<Header {...defaultProps} />, { wrapper: createWrapper() })
    
    const searchInput = screen.getByRole('searchbox')
    
    // Testar digitação no campo de busca
    fireEvent.change(searchInput, { target: { value: 'pedido 123' } })
    expect(searchInput).toHaveValue('pedido 123')
    
    // Testar limpeza com Escape
    fireEvent.keyDown(searchInput, { key: 'Escape' })
    expect(searchInput).toHaveValue('')
  })

  it('deve alternar sidebar quando botão mobile é clicado', () => {
    const setSidebarCollapsed = jest.fn()
    
    render(
      <Header sidebarCollapsed={false} setSidebarCollapsed={setSidebarCollapsed} />, 
      { wrapper: createWrapper() }
    )
    
    // Encontrar botão de toggle do sidebar (mobile)
    const sidebarToggle = screen.getByLabelText('Fechar menu lateral')
    fireEvent.click(sidebarToggle)
    
    expect(setSidebarCollapsed).toHaveBeenCalledWith(true)
  })

  it('deve mostrar notificações com contador', () => {
    render(<Header {...defaultProps} />, { wrapper: createWrapper() })
    
    // Verificar se botão de notificações está presente
    const notificationButton = screen.getByLabelText('Notificações (3 não lidas)')
    expect(notificationButton).toBeInTheDocument()
    
    // Verificar se contador está visível
    expect(screen.getByText('3 notificações não lidas')).toBeInTheDocument()
  })

  it('deve fechar menu do usuário com tecla Escape', async () => {
    render(<Header {...defaultProps} />, { wrapper: createWrapper() })
    
    // Abrir menu
    const userMenuButton = screen.getByLabelText('Menu do usuário')
    fireEvent.click(userMenuButton)
    
    await waitFor(() => {
      expect(screen.getByText('Configurações')).toBeInTheDocument()
    })
    
    // Pressionar Escape
    fireEvent.keyDown(userMenuButton, { key: 'Escape' })
    
    await waitFor(() => {
      expect(screen.queryByText('Configurações')).not.toBeInTheDocument()
    })
  })

  it('deve ter aria-pressed correto nos botões de tema', () => {
    render(<Header {...defaultProps} />, { wrapper: createWrapper() })
    
    // Como o tema atual é 'dark', o botão escuro deve ter aria-pressed="true"
    const darkModeButton = screen.getByLabelText('Ativar modo escuro')
    expect(darkModeButton).toHaveAttribute('aria-pressed', 'true')
    
    // Outros botões devem ter aria-pressed="false"
    const lightModeButton = screen.getByLabelText('Ativar modo claro')
    const autoModeButton = screen.getByLabelText('Ativar modo automático')
    
    expect(lightModeButton).toHaveAttribute('aria-pressed', 'false')
    expect(autoModeButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('deve manter foco acessível durante navegação', () => {
    render(<Header {...defaultProps} />, { wrapper: createWrapper() })
    
    // Verificar se elementos focáveis têm classes de foco
    const searchInput = screen.getByRole('searchbox')
    expect(searchInput).toHaveClass('focus:ring-2', 'focus:ring-blue-500')
    
    const userMenuButton = screen.getByLabelText('Menu do usuário')
    expect(userMenuButton).toHaveClass('focus:outline-none', 'focus:ring-2')
  })
})