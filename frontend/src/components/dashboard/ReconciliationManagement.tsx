'use client'
// v2.1.3 - Interface de Reconciliação Financeira
// Deploy: 2025-10-22 16:30 UTC

import { useState, useEffect } from 'react'
import { formatCurrency, formatDate } from '@/utils/format'
import { useFinancialTransactionsQuery } from '@/hooks/useFinancialQuery'
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
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Bell,
  Shield,
  ShoppingCart
} from 'lucide-react'
import { useThemeContext } from '../../contexts/ThemeContext'
import { FINANCIAL_COLORS } from '@/constants/financialTheme'
import GenericModal from '../GenericModal'

interface Discrepancy {
  id: string
  type: string
  orderId: string
  amount?: number
  expectedAmount?: number
  actualAmount?: number
  difference?: number
  date: Date
  description: string
}

interface ReconciliationData {
  totalOrders: number
  totalTransactions: number
  totalCashFlow: number
  discrepancies: Discrepancy[]
  isBalanced: boolean
  lastReconciliation: Date
}

export default function ReconciliationManagement() {
  const { currentTheme } = useThemeContext()
  const theme: 'light' | 'dark' = currentTheme === 'dark' ? 'dark' : 'light'
  
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [showReconciliationModal, setShowReconciliationModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Queries da API
  const { data: transactionsData, isLoading: transactionsLoading, refetch: refetchTransactions } = useFinancialTransactionsQuery()

  // Estados para dados de reconciliação
  const [reconciliationData, setReconciliationData] = useState<ReconciliationData>({
    totalOrders: 0,
    totalTransactions: 0,
    totalCashFlow: 0,
    discrepancies: [],
    isBalanced: true,
    lastReconciliation: new Date()
  })

  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'discrepancy',
      severity: 'warning',
      message: 'Discrepância encontrada entre pedidos e transações',
      amount: 150.00,
      date: new Date(),
      status: 'pending'
    },
    {
      id: '2',
      type: 'missing_transaction',
      severity: 'critical',
      message: 'Transação financeira não encontrada para pedido #1234',
      amount: 89.50,
      date: new Date(),
      status: 'pending'
    }
  ])

  // Simular dados de reconciliação
  useEffect(() => {
    const mockReconciliationData = {
      totalOrders: 156,
      totalTransactions: 154,
      totalCashFlow: 152,
      discrepancies: [
        {
          id: '1',
          type: 'missing_transaction',
          orderId: '1234',
          amount: 89.50,
          date: new Date(),
          description: 'Pedido sem transação financeira'
        },
        {
          id: '2',
          type: 'amount_mismatch',
          orderId: '1235',
          expectedAmount: 150.00,
          actualAmount: 145.00,
          difference: 5.00,
          date: new Date(),
          description: 'Valor da transação não confere com o pedido'
        }
      ],
      isBalanced: false,
      lastReconciliation: new Date()
    }
    
    setReconciliationData(mockReconciliationData)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'balanced': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'discrepancy': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'info': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const handleReconcileNow = async () => {
    try {
      // Simular reconciliação
      setReconciliationData(prev => ({
        ...prev,
        isBalanced: true,
        discrepancies: [],
        lastReconciliation: new Date()
      }))
      
      setShowReconciliationModal(false)
    } catch (error) {
      console.error('Erro na reconciliação:', error)
    }
  }

  const handleResolveDiscrepancy = async (discrepancyId: string) => {
    try {
      setReconciliationData(prev => ({
        ...prev,
        discrepancies: prev.discrepancies.filter(d => d.id !== discrepancyId)
      }))
    } catch (error) {
      console.error('Erro ao resolver discrepância:', error)
    }
  }

  if (transactionsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
          <h1 className="text-3xl font-manrope font-bold text-gray-900 dark:text-white">
            Reconciliação Financeira
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Monitoramento e reconciliação automática de transações
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => refetchTransactions()}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
          
          <button
            onClick={() => setShowReconciliationModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Reconciliar Agora</span>
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Status Geral</p>
              <p className={`text-2xl font-bold ${reconciliationData.isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                {reconciliationData.isBalanced ? 'Balanceado' : 'Desbalanceado'}
              </p>
            </div>
            <div className={`p-3 rounded-full ${reconciliationData.isBalanced ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
              {reconciliationData.isBalanced ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reconciliationData.totalOrders}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Transações</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reconciliationData.totalTransactions}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Discrepâncias</p>
              <p className="text-2xl font-bold text-red-600">
                {reconciliationData.discrepancies.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Eye },
              { id: 'discrepancies', label: 'Discrepâncias', icon: AlertCircle },
              { id: 'alerts', label: 'Alertas', icon: Bell },
              { id: 'reports', label: 'Relatórios', icon: Download }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Última Reconciliação
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Data:</strong> {formatDate(reconciliationData.lastReconciliation)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(reconciliationData.isBalanced ? 'balanced' : 'discrepancy')}`}>
                        {reconciliationData.isBalanced ? 'Balanceado' : 'Desbalanceado'}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Discrepâncias:</strong> {reconciliationData.discrepancies.length}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Próxima Reconciliação
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Automática:</strong> A cada 5 minutos
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Diária:</strong> À meia-noite
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Status:</strong> 
                      <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/20 text-green-600">
                        Ativo
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'discrepancies' && (
            <div className="space-y-4">
              {reconciliationData.discrepancies.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhuma Discrepância Encontrada
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Todos os dados estão balanceados e consistentes.
                  </p>
                </div>
              ) : (
                reconciliationData.discrepancies.map(discrepancy => (
                  <div key={discrepancy.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {discrepancy.description}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Pedido:</strong> #{discrepancy.orderId}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Valor:</strong> {formatCurrency(discrepancy.amount || discrepancy.expectedAmount)}
                        </p>
                        {discrepancy.difference && (
                          <p className="text-sm text-red-600">
                            <strong>Diferença:</strong> {formatCurrency(discrepancy.difference)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleResolveDiscrepancy(discrepancy.id)}
                          className="btn-primary text-sm"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Resolver
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {alert.message}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Valor:</strong> {formatCurrency(alert.amount)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Data:</strong> {formatDate(alert.date)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="btn-secondary text-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="btn-secondary flex items-center justify-center space-x-2 p-4">
                  <Download className="w-5 h-5" />
                  <span>Relatório Diário</span>
                </button>
                <button className="btn-secondary flex items-center justify-center space-x-2 p-4">
                  <Download className="w-5 h-5" />
                  <span>Relatório Semanal</span>
                </button>
                <button className="btn-secondary flex items-center justify-center space-x-2 p-4">
                  <Download className="w-5 h-5" />
                  <span>Relatório Mensal</span>
                </button>
                <button className="btn-secondary flex items-center justify-center space-x-2 p-4">
                  <Download className="w-5 h-5" />
                  <span>Relatório de Discrepâncias</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Reconciliação */}
      <GenericModal
        isOpen={showReconciliationModal}
        onClose={() => setShowReconciliationModal(false)}
        title="Reconciliação Manual"
        type="add"
        size="md"
        onSubmit={handleReconcileNow}
      >
        <div className="space-y-4">
          <div className="text-center">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Executar Reconciliação Manual
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Esta ação irá verificar todas as transações e identificar discrepâncias.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              O que será verificado:
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Pedidos vs Transações Financeiras</li>
              <li>• Transações vs Entradas de Caixa</li>
              <li>• Valores e Datas</li>
              <li>• Status de Confirmação</li>
            </ul>
          </div>
        </div>
      </GenericModal>
    </div>
  )
}
