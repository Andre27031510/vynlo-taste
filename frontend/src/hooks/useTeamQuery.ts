'use client'
// v2.1.2 - Team members 100% conectados com API real (v1/users endpoint)
// Modified: 2025-10-11 13:50 UTC - Removido password (backend não aceita)
// CRITICAL: Team management fully functional with PostgreSQL
// Deploy: 2025-10-11

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'

export interface TeamMember {
  id: string
  name: string
  firstName?: string
  lastName?: string
  email: string
  role: string
  status: 'active' | 'inactive'
  permissions?: string[]
  createdAt?: string
}

export interface TeamStats {
  totalMembers: number
  activeMembers: number
  roles: Record<string, number>
}

// Buscar membros da equipe (users com role MANAGER, STAFF, etc.)
const fetchTeamMembers = async (filters?: {
  role?: string
  status?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ members: TeamMember[], total: number, totalPages: number }> => {
  const params = new URLSearchParams()
  if (filters?.role && filters.role !== 'all') params.append('role', filters.role)
  if (filters?.status && filters.status !== 'all') params.append('status', filters.status)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())

  const response = await apiRequest('core-service', `v1/users?${params.toString()}`)
  
  if (!response.ok) {
    console.error('❌ Erro ao buscar membros da equipe:', response.status)
    return {
      members: [],
      total: 0,
      totalPages: 0
    }
  }
  
  const data = await response.json()
  const users = data.users || data.content || []
  
  // Filtrar apenas membros da equipe (não CUSTOMER)
  const teamUsers = users.filter((user: any) => 
    user.role && user.role !== 'CUSTOMER'
  )
  
  // Transformar users em team members
  const members = teamUsers.map((user: any) => ({
    id: user.id?.toString() || user.id,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role || 'STAFF',
    status: user.active ? 'active' : 'inactive',
    permissions: user.permissions || [],
    createdAt: user.createdAt
  }))
  
  return {
    members,
    total: members.length,
    totalPages: Math.ceil(members.length / (filters?.limit || 10))
  }
}

// Hook para buscar membros da equipe - OTIMIZADO PARA PRODUÇÃO
export const useTeamQuery = (filters?: {
  role?: string
  status?: string
  search?: string
  page?: number
  limit?: number
}) => {
  return useQuery<{ members: TeamMember[], total: number, totalPages: number }>({
    queryKey: ['team', filters],
    queryFn: () => fetchTeamMembers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (React Query v5)
    refetchOnWindowFocus: true,
    refetchInterval: false, // Sem auto-refresh
  })
}

// Mutation para criar membro da equipe
export const useCreateTeamMemberMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (memberData: {
      name: string
      email: string
      role: string
      password: string
      permissions?: string[]
    }) => {
      const nameParts = memberData.name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || firstName
      
      const response = await apiRequest('core-service', 'v1/users', {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          username: memberData.email,
          email: memberData.email,
          role: memberData.role,
          active: true
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText)
        throw new Error(`Erro ao criar membro: ${response.status} - ${errorText}`)
      }
      
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      console.log('✅ Membro da equipe criado com sucesso')
    },
    onError: (error) => {
      console.error('❌ Erro ao criar membro da equipe:', error)
    }
  })
}

// Mutation para atualizar membro da equipe
export const useUpdateTeamMemberMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, name, email, role, status, permissions }: {
      id: string
      name: string
      email: string
      role: string
      status?: 'active' | 'inactive'
      permissions?: string[]
    }) => {
      const nameParts = name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || firstName
      
      const response = await apiRequest('core-service', `v1/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          role,
          active: status !== 'inactive'
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText)
        throw new Error(`Erro ao atualizar membro: ${response.status} - ${errorText}`)
      }
      
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      console.log('✅ Membro da equipe atualizado com sucesso')
    },
    onError: (error) => {
      console.error('❌ Erro ao atualizar membro da equipe:', error)
    }
  })
}

// Mutation para deletar membro da equipe
export const useDeleteTeamMemberMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (memberId: string) => {
      const response = await apiRequest('core-service', `v1/users/${memberId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText)
        throw new Error(`Erro ao deletar membro: ${response.status} - ${errorText}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      console.log('✅ Membro da equipe deletado com sucesso')
    },
    onError: (error) => {
      console.error('❌ Erro ao deletar membro da equipe:', error)
    }
  })
}

// Modified: 2025-10-11

