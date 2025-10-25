'use client'
// v2.1.3 - Fluxo financeiro completo implementado
// Fix: Interface para confirmação manual de transações financeiras
// Deploy: 2025-10-22 12:06 UTC

import { useState, useEffect } from 'react'
import { formatCurrency, formatDate } from '@/utils/format'
import { useFinancialTransactionsQuery, useConfirmTransactionMutation } from '@/hooks/useFinancialQuery'
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  DollarSign,
  CreditCard,
  Banknote,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Check,
  X
} from 'lucide-react'
import { useThemeContext } from '../../contexts/ThemeContext'
import { FINANCIAL_COLORS } from '@/constants/financialTheme'
import { toast } from 'react-hot-toast'

interface TransactionConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: any
  onConfirm: (transactionId: string) => void
  isPending?: boolean
}

const TransactionConfirmationModal = ({ isOpen, onClose, transaction, onConfirm, isPending = false }: TransactionConfirmationModalProps) => {
  const { currentTheme } = useThemeContext()
  const theme: 'light' | 'dark' = currentTheme === 'dark' ? 'dark' : 'light'

  if (!isOpen || !transaction) return null

  const getPaymentMethodIcon = (method: string) => {
    const methodUpper = method?.toUpperCase() || ''
    if (methodUpper.includes('PIX') || methodUpper.includes('DIGITAL')) {
      return <CreditCard className="w-5 h-5" />
    } else if (methodUpper.includes('DINHEIRO') || methodUpper.includes('CASH')) {
      return <Banknote className="w-5 h-5" />
    } else if (methodUpper.includes('CARTAO')) {
      return <CreditCard className="w-5 h-5" />
    }
    return <DollarSign className="w-5 h-5" />
  }

  const getPaymentMethodColor = (method: string) => {
    const methodUpper = method?.toUpperCase() || ''
    if (methodUpper.includes('PIX') || methodUpper.includes('DIGITAL')) {
      return 'text-green-600'
    } else if (methodUpper.includes('DINHEIRO') || methodUpper.includes('CASH')) {
      return 'text-green-700'
    } else if (methodUpper.includes('CARTAO')) {
      return 'text-blue-600'
    }
    return 'text-gray-600'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md`}>
        <div className="bg-blue-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Confirmar Pagamento</h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Informações da Transação */}
          <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Detalhes do Pagamento</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                {transaction.paymentMethod}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Valor:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Método:</span>
                <div className="flex items-center space-x-2">
                  {getPaymentMethodIcon(transaction.paymentMethod)}
                  <span className="text-gray-900 dark:text-white">{transaction.paymentMethod}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data:</span>
                <span className="text-gray-900 dark:text-white">{formatDate(transaction.transactionDate)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Aguardando Confirmação
                </span>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Descrição</h4>
            <p className="text-gray-700 dark:text-gray-300">{transaction.description}</p>
          </div>

          {/* Aviso de Segurança */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Confirmação Manual</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Este pagamento requer confirmação manual. Verifique se o valor foi recebido antes de confirmar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-4 rounded-b-2xl`}>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(transaction.id)}
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Confirmando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirmar Pagamento</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TransactionConfirmationManagement() {
  const { currentTheme } = useThemeContext()
  const theme: 'light' | 'dark' = currentTheme === 'dark' ? 'dark' : 'light'
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  // Queries da API
  const { data: transactionsData, isLoading, refetch } = useFinancialTransactionsQuery({
    status: statusFilter,
    search: searchTerm
  })
  
  const confirmMutation = useConfirmTransactionMutation()

  const transactions = transactionsData?.content || []

  const handleConfirmTransaction = async (transactionId: string) => {
    try {
      await confirmMutation.mutateAsync(transactionId)
      toast.success('✅ Pagamento confirmado com sucesso!')
      setShowConfirmationModal(false)
      setSelectedTransaction(null)
      refetch() // Atualizar lista
    } catch (error: any) {
      console.error('Erro ao confirmar transação:', error)
      toast.error(`❌ Erro ao confirmar pagamento: ${error.message || 'Erro desconhecido'}`)
    }
  }

  const openConfirmationModal = (transaction: any) => {
    setSelectedTransaction(transaction)
    setShowConfirmationModal(true)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Aguardando Confirmação',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          icon: <Clock className="w-4 h-4" />
        }
      case 'COMPLETED':
        return {
          label: 'Confirmado',
          color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          icon: <CheckCircle className="w-4 h-4" />
        }
      case 'CANCELLED':
        return {
          label: 'Cancelado',
          color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
          icon: <X className="w-4 h-4" />
        }
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          icon: <AlertCircle className="w-4 h-4" />
        }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Confirmação de Pagamentos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie confirmações de pagamentos pendentes
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="PENDING">Aguardando Confirmação</option>
            <option value="COMPLETED">Confirmados</option>
            <option value="CANCELLED">Cancelados</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 text-center`}>
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Não há transações com o filtro selecionado.
            </p>
          </div>
        ) : (
          transactions.map((transaction: any) => {
            const statusInfo = getStatusInfo(transaction.status)
            
            return (
              <div
                key={transaction.id}
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {transaction.description}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatCurrency(transaction.amount)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-4 h-4" />
                        <span>{transaction.paymentMethod}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(transaction.transactionDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openConfirmationModal(transaction)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      title="Ver Detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {transaction.status === 'PENDING' && (
                      <button
                        onClick={() => openConfirmationModal(transaction)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirmar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal de Confirmação */}
      <TransactionConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false)
          setSelectedTransaction(null)
        }}
        transaction={selectedTransaction}
        onConfirm={handleConfirmTransaction}
        isPending={confirmMutation.isPending}
      />
    </div>
  )
}
