'use client'

import { useState } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Filter,
  Download,
  RefreshCw,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  PiggyBank,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useMediaQuery } from 'react-responsive'

interface CashFlowEntry {
  id: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  date: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

export default function CashFlowManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [filterType, setFilterType] = useState('all')
  
  // Responsividade
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 })

  // Dados simulados
  const [entries] = useState<CashFlowEntry[]>([
    {
      id: '1',
      type: 'income',
      category: 'Vendas',
      description: 'Vendas do dia',
      amount: 2500.00,
      date: '2024-01-15',
      status: 'confirmed'
    },
    {
      id: '2',
      type: 'expense',
      category: 'Fornecedores',
      description: 'Compra de ingredientes',
      amount: 800.00,
      date: '2024-01-15',
      status: 'confirmed'
    }
  ])

  const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0)
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0)
  const balance = totalIncome - totalExpense

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsivo */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Fluxo de Caixa</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Controle de entradas e saídas financeiras</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="7d">7 dias</option>
            <option value="30d">30 dias</option>
            <option value="90d">90 dias</option>
          </select>
          
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Entrada</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </div>

      {/* Cards de Resumo - Grid Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Entradas</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Saídas</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
              balance >= 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-red-100 dark:bg-red-900'
            }`}>
              <DollarSign className={`w-5 h-5 sm:w-6 sm:h-6 ${
                balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Saldo</p>
              <p className={`text-lg sm:text-2xl font-bold ${
                balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
              }`}>
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Projeção</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                R$ {(balance * 1.15).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros - Layout Responsivo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar transações..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="all">Todos</option>
              <option value="income">Entradas</option>
              <option value="expense">Saídas</option>
            </select>
            
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Transações - Responsiva */}
      <div className="space-y-3 sm:space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  entry.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  {entry.type === 'income' ? (
                    <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Minus className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{entry.description}</h3>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{entry.category}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start space-x-2 sm:space-x-0">
                <p className={`text-lg sm:text-xl font-bold ${
                  entry.type === 'income' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {entry.type === 'income' ? '+' : '-'}R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  entry.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : entry.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {entry.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {entry.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                  <span className="capitalize">{entry.status}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}