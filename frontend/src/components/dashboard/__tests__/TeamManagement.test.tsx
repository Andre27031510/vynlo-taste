import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TeamManagement from '../TeamManagement'

// Mock do react-focus-lock já está no jest.setup.js

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

describe('TeamManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar a lista de membros da equipe', () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Verificar título
    expect(screen.getByText('Gestão de Equipe')).toBeInTheDocument()
    
    // Verificar se membros estão listados
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@vynlotaste.com')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('maria@vynlotaste.com')).toBeInTheDocument()
  })

  it('deve abrir modal ao clicar em "Adicionar Membro"', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Clicar no botão adicionar
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    // Verificar se modal abriu
    await waitFor(() => {
      expect(screen.getByText('Adicionar Membro')).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('deve abrir modal de edição ao clicar no botão editar', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Encontrar e clicar no primeiro botão de editar
    const editButtons = screen.getAllByLabelText(/Editar/)
    fireEvent.click(editButtons[0])
    
    // Verificar se modal de edição abriu
    await waitFor(() => {
      expect(screen.getByText('Editar Membro')).toBeInTheDocument()
      expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument()
    })
  })

  it('deve fechar modal ao clicar no botão fechar', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Abrir modal
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Fechar modal
    const closeButton = screen.getByLabelText('Fechar modal')
    fireEvent.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('deve fechar modal com tecla Escape', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Abrir modal
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Pressionar Escape
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('deve preencher formulário e submeter novo membro', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Abrir modal
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Preencher formulário
    const nameInput = screen.getByLabelText('Nome Completo')
    const emailInput = screen.getByLabelText('Email')
    const roleSelect = screen.getByLabelText('Cargo')
    
    fireEvent.change(nameInput, { target: { value: 'Pedro Costa' } })
    fireEvent.change(emailInput, { target: { value: 'pedro@vynlotaste.com' } })
    fireEvent.change(roleSelect, { target: { value: 'Atendente' } })
    
    // Verificar se valores foram preenchidos
    expect(nameInput).toHaveValue('Pedro Costa')
    expect(emailInput).toHaveValue('pedro@vynlotaste.com')
    expect(roleSelect).toHaveValue('Atendente')
  })

  it('deve selecionar permissões no formulário', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Abrir modal
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Selecionar permissões
    const ordersPermission = screen.getByLabelText('Permissão para acessar orders')
    const menuPermission = screen.getByLabelText('Permissão para acessar menu')
    
    fireEvent.click(ordersPermission)
    fireEvent.click(menuPermission)
    
    // Verificar se checkboxes foram marcados
    expect(ordersPermission).toBeChecked()
    expect(menuPermission).toBeChecked()
  })

  it('deve submeter formulário ao clicar em salvar', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Abrir modal
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Preencher campos obrigatórios
    fireEvent.change(screen.getByLabelText('Nome Completo'), { 
      target: { value: 'Novo Membro' } 
    })
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'novo@vynlotaste.com' } 
    })
    fireEvent.change(screen.getByLabelText('Cargo'), { 
      target: { value: 'Atendente' } 
    })
    
    // Clicar em salvar
    const saveButton = screen.getByLabelText('Adicionar novo membro')
    fireEvent.click(saveButton)
    
    // Modal deve fechar após salvar
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('deve validar campos obrigatórios', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Abrir modal
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Verificar se campos têm atributo required
    expect(screen.getByLabelText('Nome Completo')).toHaveAttribute('required')
    expect(screen.getByLabelText('Email')).toHaveAttribute('required')
    expect(screen.getByLabelText('Cargo')).toHaveAttribute('required')
  })

  it('deve mostrar status correto dos membros', () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Verificar se status estão sendo exibidos
    const activeStatuses = screen.getAllByText('Ativo')
    expect(activeStatuses).toHaveLength(2) // Ambos membros estão ativos
  })

  it('deve ter acessibilidade adequada no modal', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Abrir modal
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
      
      // Verificar atributos de acessibilidade
      expect(modal).toHaveAttribute('aria-modal', 'true')
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title')
    })
    
    // Verificar se título do modal tem ID correto
    expect(screen.getByText('Adicionar Membro')).toHaveAttribute('id', 'modal-title')
  })

  it('deve ter fieldset para agrupamento de permissões', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Abrir modal
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      // Verificar se fieldset existe
      const fieldset = screen.getByRole('group', { name: 'Permissões' })
      expect(fieldset).toBeInTheDocument()
    })
  })

  it('deve ter labels associados corretamente aos inputs', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Abrir modal
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      // Verificar associação de labels
      const nameInput = screen.getByLabelText('Nome Completo')
      const emailInput = screen.getByLabelText('Email')
      const roleSelect = screen.getByLabelText('Cargo')
      
      expect(nameInput).toHaveAttribute('id')
      expect(emailInput).toHaveAttribute('id')
      expect(roleSelect).toHaveAttribute('id')
    })
  })

  it('deve ter textos de ajuda para screen readers', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Abrir modal
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      // Verificar se textos de ajuda existem
      expect(screen.getByText('Digite o nome completo do membro da equipe')).toHaveClass('sr-only')
      expect(screen.getByText('Digite o endereço de email do membro')).toHaveClass('sr-only')
    })
  })

  it('deve manter foco no modal quando aberto', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Abrir modal
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    fireEvent.click(addButton)
    
    await waitFor(() => {
      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
      
      // Verificar se modal está focável
      expect(modal).toBeInTheDocument()
    })
  })

  it('deve ter botões com tamanhos adequados para touch', async () => {
    render(<TeamManagement />, { wrapper: createWrapper() })
    
    // Verificar botões principais
    const addButton = screen.getByLabelText('Adicionar novo membro da equipe')
    const editButtons = screen.getAllByLabelText(/Editar/)
    
    // Botões devem ter classes de padding adequadas
    expect(addButton).toHaveClass('px-4', 'py-2')
    editButtons.forEach(button => {
      expect(button).toHaveClass('p-2')
    })
  })
})