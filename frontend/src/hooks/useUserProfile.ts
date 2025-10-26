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
      console.warn('User profile not available')
      return null
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.warn('Error fetching user profile:', error)
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

