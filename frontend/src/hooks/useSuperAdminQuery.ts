'use client'
// Super Admin Query Hook - Production-ready for Vynlo Platform
// Commit 4481aaf: Criado para conectar Super Admin às APIs reais
// Hooks: useClientsQuery, useCreateClientMutation, useSuspend/ActivateClientMutation
// 100% Type-safe com interfaces VynloClient e CreateClientData
// Created: 2025-10-16

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
// ANTES: Role não existia na interface (backend hardcoded como ADMIN)
// DEPOIS: Super Admin escolhe role ao criar usuário
export interface CreateClientData {
  companyName: string
  adminEmail: string
  adminPassword: string
  vynloProduct: string
  role: string  // ✅ ADMIN, MANAGER, STAFF, CUSTOMER (escolha dinâmica)
  cnpj?: string  // ✅ CNPJ da empresa (opcional)
  clientType?: string
  permissions?: string[]
}

// Interface para editar cliente (sem senha - não pode mudar)
export interface UpdateClientData {
  companyName: string
  vynloProduct: string
  role: string
  cnpj?: string
  clientType?: string
  permissions?: string[]
}

// Buscar todos os clientes
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

// Criar novo cliente
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

// Atualizar cliente existente
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

// Suspender cliente
const suspendClient = async (clientId: string): Promise<void> => {
  const response = await apiRequest('core-service', `v1/super-admin/client/${clientId}/suspend`, {
    method: 'PUT'
  })
  
  if (!response.ok) {
    throw new Error(`Erro ao suspender cliente: ${response.status}`)
  }
}

// Ativar cliente
const activateClient = async (clientId: string): Promise<void> => {
  const response = await apiRequest('core-service', `v1/super-admin/client/${clientId}/activate`, {
    method: 'PUT'
  })
  
  if (!response.ok) {
    throw new Error(`Erro ao ativar cliente: ${response.status}`)
  }
}

// Atualizar permissões
const updatePermissions = async (data: { clientId: string, permissions: string[] }): Promise<void> => {
  const response = await apiRequest('core-service', `v1/super-admin/client/${data.clientId}/permissions`, {
    method: 'PUT',
    body: JSON.stringify(data.permissions)
  })
  
  if (!response.ok) {
    throw new Error(`Erro ao atualizar permissões: ${response.status}`)
  }
}

// Buscar permissões disponíveis
const fetchAvailablePermissions = async (): Promise<Record<string, string[]>> => {
  const response = await apiRequest('core-service', 'v1/super-admin/client-permissions/available')
  
  if (!response.ok) {
    return {}
  }
  
  return await response.json()
}

// ===== HOOKS =====

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

export const useAvailablePermissionsQuery = () => {
  return useQuery<Record<string, string[]>>({
    queryKey: ['super-admin-permissions'],
    queryFn: fetchAvailablePermissions,
    staleTime: 60 * 60 * 1000, // 1 hora (permissões mudam raramente)
  })
}

