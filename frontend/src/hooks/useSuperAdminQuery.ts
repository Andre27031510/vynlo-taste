'use client'
/**
 * ============================================================================
 * Super Admin Query Hook - Production-ready for Vynlo Platform
 * ============================================================================
 * 
 * Histórico de Commits:
 * - Commit 4481aaf: Criado para conectar Super Admin às APIs reais
 * - Commit 2788a34: Adicionado campo "role" para seleção dinâmica
 * - Commit 5d75d82: Adicionado campo "cnpj" + edição de usuários
 * - Commit 6e4a162: Comentários expandidos (ESTE COMMIT)
 * 
 * 7 HOOKS EXPORTADOS:
 * 1. useClientsQuery() - Lista todos clientes
 * 2. useCreateClientMutation() - Criar novo cliente
 * 3. useUpdateClientMutation() - Editar cliente existente
 * 4. useSuspendClientMutation() - Suspender cliente
 * 5. useActivateClientMutation() - Ativar cliente
 * 6. useUpdatePermissionsMutation() - Atualizar permissões
 * 7. useAvailablePermissionsQuery() - Buscar permissões disponíveis
 * 
 * 7 ENDPOINTS BACKEND MAPEADOS:
 * GET /v1/super-admin/clients - Lista clientes
 * POST /v1/super-admin/create-client - Criar cliente
 * PUT /v1/super-admin/clients/{uid} - Editar cliente
 * PUT /v1/super-admin/client/{id}/suspend - Suspender
 * PUT /v1/super-admin/client/{id}/activate - Ativar
 * PUT /v1/super-admin/client/{id}/permissions - Atualizar permissões
 * GET /v1/super-admin/client-permissions/available - Permissões
 * 
 * 100% Type-safe com interfaces VynloClient, CreateClientData, UpdateClientData
 * Cache inteligente com TanStack Query (staleTime, gcTime, invalidation)
 * Toast notifications para feedback visual (react-hot-toast)
 * 
 * @version 2.1.0
 * @author Vynlo Tech
 * @created 2025-10-16
 * @modified 2025-10-17
 * ============================================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { apiRequest } from '@/services/api'

export interface VynloClient {
  id: string
  companyName: string
  adminEmail: string
  vynloProduct: 'TASTE' | 'EKKLESIA' | 'BOT' | 'SAUDE' | 'EDUCACAO' | 'PETSHOPS' | 'BARBEARIAS' | 'SERVICOS'
  clientType: string
  permissions: string[]
  status: 'ACTIVE' | 'SUSPENDED'
  createdAt: number
  lastLogin: number | null
  emailVerified: boolean
}

// Commit 2788a34: Adicionado campo "role" para seleção dinâmica
// Commit 5d75d82: Adicionado campo "cnpj" (CNPJ da empresa)
// ANTES: Role não existia na interface (backend hardcoded como ADMIN)
// DEPOIS: Super Admin escolhe role ao criar usuário
export interface CreateClientData {
  companyName: string         // Nome da empresa (obrigatório)
  adminEmail: string          // Email do admin (obrigatório, único)
  adminPassword: string       // Senha inicial (obrigatório, mín 8 chars)
  vynloProduct: string        // TASTE, EKKLESIA, BOT, etc (obrigatório)
  role: string                // ADMIN, MANAGER, STAFF, CUSTOMER (obrigatório)
  cnpj?: string               // CNPJ da empresa (opcional, formato validado)
  clientType?: string         // RESTAURANT, CHURCH, etc (opcional)
  permissions?: string[]      // Permissões granulares (opcional)
}

// Commit 5d75d82: Interface para editar cliente (sem email e senha)
// Email e senha NÃO podem ser editados após criação (segurança Firebase)
// Apenas dados de perfil e permissões podem ser atualizados
export interface UpdateClientData {
  companyName: string         // Nome da empresa (pode mudar)
  vynloProduct: string        // Produto Vynlo (pode migrar)
  role: string                // Nível de acesso (pode promover/rebaixar)
  cnpj?: string               // CNPJ (pode atualizar)
  clientType?: string         // Tipo de cliente (pode mudar)
  permissions?: string[]      // Permissões (pode atualizar)
}

/**
 * FUNÇÃO: fetchClients()
 * ENDPOINT: GET /v1/super-admin/clients
 * RETORNO: Array de VynloClient[] com todos os clientes
 * SEGURANÇA: Protegido por @PreAuthorize("hasRole('SUPER_ADMIN')") no backend
 * ERRO 403: Lança exceção se usuário não é Super Admin
 */
const fetchClients = async (): Promise<VynloClient[]> => {
  const response = await apiRequest('core-service', 'v1/super-admin/clients')
  
  if (!response.ok) {
    console.error('❌ Erro ao buscar clientes:', response.status)
    if (response.status === 403) {
      throw new Error('Acesso negado - você não é Super Admin')
    }
    return []
  }
  
  return await response.json()
}

/**
 * FUNÇÃO: createClient()
 * ENDPOINT: POST /v1/super-admin/create-client
 * BODY: { companyName, adminEmail, adminPassword, vynloProduct, role, cnpj, clientType }
 * RETORNO: Objeto com sucesso + dados do cliente criado
 * BACKEND: Cria usuário no Firebase + seta custom claims
 * VALIDAÇÕES: Email único, senha mín 8 chars, role válido
 */
const createClient = async (clientData: CreateClientData): Promise<any> => {
  const response = await apiRequest('core-service', 'v1/super-admin/create-client', {
    method: 'POST',
    body: JSON.stringify(clientData)
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(errorData.message || `Erro ao criar cliente: ${response.status}`)
  }
  
  return await response.json()
}

// Commit 5d75d82: Implementado função updateClient
// FUNCIONALIDADE: Atualizar dados de cliente existente via API
// - Endpoint: PUT /v1/super-admin/clients/{uid}
// - Body: { companyName, vynloProduct, role, cnpj, clientType }
// - Backend atualiza Firebase custom claims
// - Não permite atualizar email e password (segurança)
const updateClient = async (uid: string, clientData: UpdateClientData): Promise<VynloClient> => {
  const response = await apiRequest('core-service', `v1/super-admin/clients/${uid}`, {
    method: 'PUT',
    body: JSON.stringify(clientData)
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Erro ao atualizar cliente')
  }
  
  return await response.json()
}

/**
 * FUNÇÃO: suspendClient()
 * ENDPOINT: PUT /v1/super-admin/client/{id}/suspend
 * BODY: Nenhum (apenas clientId na URL)
 * BACKEND: Desabilita usuário no Firebase (disabled=true)
 * EFEITO: Usuário não consegue mais fazer login
 */
const suspendClient = async (clientId: string): Promise<void> => {
  const response = await apiRequest('core-service', `v1/super-admin/client/${clientId}/suspend`, {
    method: 'PUT'
  })
  
  if (!response.ok) {
    throw new Error(`Erro ao suspender cliente: ${response.status}`)
  }
}

/**
 * FUNÇÃO: activateClient()
 * ENDPOINT: PUT /v1/super-admin/client/{id}/activate
 * BODY: Nenhum (apenas clientId na URL)
 * BACKEND: Reabilita usuário no Firebase (disabled=false)
 * EFEITO: Usuário volta a conseguir fazer login
 */
const activateClient = async (clientId: string): Promise<void> => {
  const response = await apiRequest('core-service', `v1/super-admin/client/${clientId}/activate`, {
    method: 'PUT'
  })
  
  if (!response.ok) {
    throw new Error(`Erro ao ativar cliente: ${response.status}`)
  }
}

/**
 * FUNÇÃO: updatePermissions()
 * ENDPOINT: PUT /v1/super-admin/client/{id}/permissions
 * BODY: Array de strings com permissões (ex: ['READ_USERS', 'WRITE_ORDERS'])
 * BACKEND: Atualiza custom claims do Firebase
 * EFEITO: Permissões refletem no JWT do usuário
 */
const updatePermissions = async (data: { clientId: string, permissions: string[] }): Promise<void> => {
  const response = await apiRequest('core-service', `v1/super-admin/client/${data.clientId}/permissions`, {
    method: 'PUT',
    body: JSON.stringify(data.permissions)
  })
  
  if (!response.ok) {
    throw new Error(`Erro ao atualizar permissões: ${response.status}`)
  }
}

/**
 * FUNÇÃO: fetchAvailablePermissions()
 * ENDPOINT: GET /v1/super-admin/client-permissions/available
 * RETORNO: Objeto com permissões disponíveis por produto
 * EXEMPLO: { "TASTE": ["MANAGE_MENU", "VIEW_ORDERS"], "EKKLESIA": [...] }
 * CACHE: 1 hora (permissões mudam raramente)
 */
const fetchAvailablePermissions = async (): Promise<Record<string, string[]>> => {
  const response = await apiRequest('core-service', 'v1/super-admin/client-permissions/available')
  
  if (!response.ok) {
    return {}
  }
  
  return await response.json()
}

// ===== HOOKS =====

/**
 * HOOK: useClientsQuery()
 * RETORNA: { data, isLoading, error, refetch }
 * CACHE: 30s stale, 10min garbage collection
 * REFETCH: Automático ao voltar para janela
 * RETRY: Até 3x, exceto 403 (acesso negado)
 * USO: const { data: clients } = useClientsQuery()
 */
export const useClientsQuery = () => {
  return useQuery<VynloClient[]>({
    queryKey: ['super-admin-clients'],
    queryFn: fetchClients,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      const errorMsg = error?.message || ''
      if (errorMsg.includes('403') || errorMsg.includes('Acesso negado')) {
        return false // Não retry em 403
      }
      return failureCount < 3
    }
  })
}

/**
 * HOOK: useCreateClientMutation()
 * RETORNA: { mutate, isLoading, error }
 * INVALIDAÇÃO: Refetch lista de clientes após sucesso
 * TOAST: Sucesso (nome empresa) | Erro (mensagem backend)
 * USO: const { mutate } = useCreateClientMutation()
 *      mutate({ companyName, adminEmail, ... })
 */
export const useCreateClientMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-clients'] })
      toast.success(`Cliente "${data.companyName}" criado com sucesso!`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar cliente')
    }
  })
}

/**
 * HOOK: useSuspendClientMutation()
 * RETORNA: { mutate, isLoading }
 * EFEITO: Desabilita cliente no Firebase (disabled=true)
 * INVALIDAÇÃO: Refetch lista após sucesso
 * USO: const { mutate } = useSuspendClientMutation()
 *      mutate(clientId)
 */
export const useSuspendClientMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: suspendClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-clients'] })
      toast.success('Cliente suspenso com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao suspender cliente')
    }
  })
}

// Commit 5d75d82: Hook para atualizar cliente
// Invalida cache após sucesso (refetch automático)
// Toast de sucesso/erro
export const useUpdateClientMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ uid, data }: { uid: string, data: UpdateClientData }) => updateClient(uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-clients'] })
      toast.success('Cliente atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar cliente')
    }
  })
}

/**
 * HOOK: useActivateClientMutation()
 * RETORNA: { mutate, isLoading }
 * EFEITO: Reabilita cliente no Firebase (disabled=false)
 * INVALIDAÇÃO: Refetch lista após sucesso
 * USO: const { mutate } = useActivateClientMutation()
 *      mutate(clientId)
 */
export const useActivateClientMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: activateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-clients'] })
      toast.success('Cliente ativado com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao ativar cliente')
    }
  })
}

/**
 * HOOK: useUpdatePermissionsMutation()
 * RETORNA: { mutate, isLoading }
 * EFEITO: Atualiza custom claims do Firebase
 * INVALIDAÇÃO: Refetch lista após sucesso
 * USO: const { mutate } = useUpdatePermissionsMutation()
 *      mutate({ clientId, permissions: ['READ', 'WRITE'] })
 */
export const useUpdatePermissionsMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updatePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-clients'] })
      toast.success('Permissões atualizadas com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar permissões')
    }
  })
}

/**
 * HOOK: useAvailablePermissionsQuery()
 * RETORNA: { data, isLoading }
 * CACHE: 1 hora (permissões mudam raramente)
 * ESTRUTURA: { "TASTE": ["MANAGE_MENU"], "EKKLESIA": [...] }
 * USO: const { data: permissions } = useAvailablePermissionsQuery()
 */
export const useAvailablePermissionsQuery = () => {
  return useQuery<Record<string, string[]>>({
    queryKey: ['super-admin-permissions'],
    queryFn: fetchAvailablePermissions,
    staleTime: 60 * 60 * 1000, // 1 hora (permissões mudam raramente)
  })
}

