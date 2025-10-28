'use client'

import { useEffect, useState, useCallback } from 'react'
import { Users, Building2 } from 'lucide-react'
import { apiRequest } from '@/services/api'

type Stats = {
  totalMembers: number
  totalChurches: number
}

export default function EkklesiaStats() {
  const [stats, setStats] = useState<Stats>({ totalMembers: 0, totalChurches: 0 })
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      
      // Buscar membros
      const membersRes = await apiRequest('core-service', '/v1/ekklesia/members?size=1')
      const membersJson = await membersRes.json()
      const totalMembers = membersJson.totalElements || 0

      // Buscar igrejas
      const churchesRes = await apiRequest('core-service', '/v1/ekklesia/churches?size=1')
      const churchesJson = await churchesRes.json()
      const totalChurches = churchesJson.totalElements || 0

      setStats({ totalMembers, totalChurches })
    } catch (e) {
      console.error('Erro ao carregar estatísticas:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Aguardar inicialização do Firebase Auth
    const timer = setTimeout(() => {
      fetchStats()
    }, 1000)

    return () => clearTimeout(timer)
  }, [fetchStats])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Membros</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMembers}</p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Igrejas</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalChurches}</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <Building2 className="w-6 h-6 text-green-600 dark:text-green-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

