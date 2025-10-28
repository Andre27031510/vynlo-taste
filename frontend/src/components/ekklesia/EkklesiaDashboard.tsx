'use client'

import { Users, Calendar, DollarSign, TrendingUp, Building2 } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function EkklesiaDashboard() {
  const { currentTheme } = useTheme()

  const stats = [
    {
      title: 'Membros Ativos',
      value: '—',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Eventos Este Mês',
      value: '—',
      change: '+3',
      trend: 'up',
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Entradas (Mês)',
      value: '—',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Taxa de Frequência',
      value: '—',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard - Ekklesia
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral da sua igreja
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                currentTheme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                  stat.color === 'green' ? 'bg-green-100 dark:bg-green-900' :
                  stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900' :
                  'bg-orange-100 dark:bg-orange-900'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-600 dark:text-blue-300' :
                    stat.color === 'green' ? 'text-green-600 dark:text-green-300' :
                    stat.color === 'purple' ? 'text-purple-600 dark:text-purple-300' :
                    'text-orange-600 dark:text-orange-300'
                  }`} />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.title}
              </p>
            </div>
          )
        })}
      </div>

      {/* Coming Soon Notice */}
      <div className={`p-8 rounded-xl ${
        currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } border-2 border-dashed ${
        currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-300'
      }`}>
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard em Construção
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            O dashboard completo com gráficos e análises será implementado em breve.
          </p>
        </div>
      </div>
    </div>
  )
}

