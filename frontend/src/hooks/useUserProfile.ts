'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { apiRequest } from '@/services/api'

export interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  profileImage?: string
}

const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await apiRequest('core-service', 'v1/auth/me')
    
    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('User profile not available, status:', response.status)
      }
      return null
    }
    
    // ✅ CORREÇÃO: Verificar se há conteúdo antes de fazer .json()
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Response não é JSON, status:', response.status)
      }
      return null
    }
    
    // Verificar se há conteúdo
    const text = await response.text()
    if (!text || text.trim() === '') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Response vazia')
      }
      return null
    }
    
    const data = JSON.parse(text)
    return data
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error fetching user profile:', error)
    }
    return null
  }
}

export const useUserProfile = () => {
  const { user } = useAuth()
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['user-profile', user?.uid],
    queryFn: fetchUserProfile,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1
  })
  
  return { profile, isLoading, error }
}

