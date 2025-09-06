'use client'

import { useState } from 'react'
import { 
  FileText, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Send,
  Clock,
  Shield
} from 'lucide-react'
import { syncWithSEFAZ, FiscalSyncRequest } from '@/services/amazonQService'
import toast from 'react-hot-toast'

// Skeleton para documentos fiscais
const DocumentSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      <div className="flex space-x-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  </div>
)

interface FiscalDocument {
  id: string
  number: string
  type: 'NFe' | 'NFCe' | 'CTe'
  status: 'pending' | 'authorized' | 'cancelled' | 'rejected'
  customer: string
  value: number
  issueDate: string
  dueDate?: string
  sefazStatus?: string
}

export default function FiscalManagement() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResults, setSyncResults] = useState<any>(null)
  const [selectedOperation, setSelectedOperation] = useState<'sync_nfe' | 'validate_xml' | 'check_status'>('sync_nfe')
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Dados simulados de documentos fiscais
  const [documents] = useState<FiscalDocument[]>([
    {
      id: '1',
      number: '000001234',
      type: 'NFe',
      status: 'authorized',
      customer: 'João Silva',
      value: 125.50,
      issueDate: '2024-01-15',
      sefazStatus: 'Autorizada'
    },
    {
      id: '2',
      number: '000001235',
      type: 'NFCe',
      status: 'pending',
      customer: 'Maria Santos',
      value: 89.90,
      issueDate: '2024-01-15',
      sefazStatus: 'Pendente'
    },
    {
      id: '3',
      number: '000001236',
      type: 'NFe',
      status: 'rejected',
      customer: 'Pedro Costa',
      value: 234.75,
      issueDate: '2024-01-14',
      sefazStatus: 'Rejeitada'
    }
  ])

  // Função para sincronizar com SEFAZ usando Amazon Q
  const handleSEFAZSync = async () => {
    setIsSyncing(true)
    
    try {
      // Preparar dados para sincronização
      const syncRequest: FiscalSyncRequest = {
        operation: selectedOperation,
        documents: selectedDocuments.length > 0 ? selectedDocuments : undefined,
        period: '30d' // Últimos 30 dias
      }

      // Chamar Amazon Q para sincronização fiscal
      const result = await syncWithSEFAZ(syncRequest)
      
      setSyncResults({
        operation: selectedOperation,
        response: result.response,
        confidence: result.confidence,
        processingTime: result.processingTime,
        timestamp: new Date().toISOString(),
        documentsProcessed: selectedDocuments.length || documents.length
      })

      toast.success('Sincronização com SEFAZ concluída!')
      
    } catch (error) {
      console.error('Erro na sincronização SEFAZ:', error)
      toast.error(error instanceof Error ? error.message : 'Erro na sincronização SEFAZ')
    } finally {
      setIsSyncing(false)
    }
  }

  // Filtrar documentos
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.number.includes(searchTerm) || 
                         doc.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Função para obter cor do status
  const getStatusColor = (status: FiscalDocument['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      authorized: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status]
  }

  // Função para obter ícone do status
  const getStatusIcon = (status: FiscalDocument['status']) => {
    const icons = {
      pending: Clock,
      authorized: CheckCircle,
      cancelled: XCircle,
      rejected: AlertCircle
    }
    const IconComponent = icons[status]
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão Fiscal</h1>
          <p className="text-gray-600 dark:text-gray-400">Sincronização com SEFAZ e gestão de documentos fiscais</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => toast.success('Importação de XML iniciada')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Upload className="w-4 h-4" />
            <span>Importar XML</span>
          </button>
          
          <button
            onClick={() => toast.success('Exportação iniciada')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Sincronização SEFAZ */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sincronização SEFAZ com Amazon Q</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Processamento inteligente de documentos fiscais</p>
          </div>
          
          <button
            onClick={handleSEFAZSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Shield className={`w-5 h-5 ${isSyncing ? 'animate-pulse' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar SEFAZ'}</span>
          </button>
        </div>

        {/* Seletor de operação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setSelectedOperation('sync_nfe')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedOperation === 'sync_nfe'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
          >
            <Send className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Sincronizar NF-e</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enviar documentos para SEFAZ</p>
          </button>

          <button
            onClick={() => setSelectedOperation('validate_xml')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedOperation === 'validate_xml'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
            }`}
          >
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Validar XML</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Verificar estrutura dos documentos</p>
          </button>

          <button
            onClick={() => setSelectedOperation('check_status')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedOperation === 'check_status'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
          >
            <RefreshCw className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Verificar Status</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Consultar situação no SEFAZ</p>
          </button>
        </div>

        {/* Resultados da sincronização */}
        {isSyncing ? (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-48"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          </div>
        ) : syncResults ? (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Sincronização Concluída
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {syncResults.documentsProcessed} documentos processados | 
                    Tempo: {syncResults.processingTime}ms
                  </p>
                </div>
              </div>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed break-words">
                {syncResults.response}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sincronização realizada em {new Date(syncResults.timestamp).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="authorized">Autorizada</option>
              <option value="cancelled">Cancelada</option>
              <option value="rejected">Rejeitada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum documento encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há documentos fiscais no momento.'}
            </p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{doc.type}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">#{doc.number}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{doc.customer}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Emitida em {new Date(doc.issueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    R$ {doc.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {getStatusIcon(doc.status)}
                    <span className="capitalize">{doc.status}</span>
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>SEFAZ:</strong> {doc.sefazStatus || 'Não consultado'}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      if (selectedDocuments.includes(doc.id)) {
                        setSelectedDocuments(prev => prev.filter(id => id !== doc.id))
                      } else {
                        setSelectedDocuments(prev => [...prev, doc.id])
                      }
                    }}
                    className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                      selectedDocuments.includes(doc.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {selectedDocuments.includes(doc.id) ? 'Selecionado' : 'Selecionar'}
                  </button>
                  
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}