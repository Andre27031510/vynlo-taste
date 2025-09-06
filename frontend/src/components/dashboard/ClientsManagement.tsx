'use client'

import React, { useMemo, useState, useCallback } from 'react'
// import { FixedSizeList as List } from 'react-window'
import {
  Users,
  Phone,
  Mail,
  Star,
  Edit,
  Eye,
  Trash2,
  Plus,
  X,
  Save,
  Search,
  Filter,
  TrendingUp,
  ShoppingBag,
  Clock
} from 'lucide-react'

type ClientStatus = 'active' | 'inactive'
type OrderFilter = 'all' | 'high' | 'medium' | 'low'

type Client = {
  id: string
  name: string
  phone: string
  email: string
  address?: string
  birthDate?: string
  preferences?: string
  status: ClientStatus
  orders: number
  total: number
  rating: number
  lastOrder?: string
  joinDate?: string
}

// Gerar dados simulados para teste de virtualização - Performance em listas longas
const generateMockClients = (count: number): Client[] => {
  const names = ['Maria Silva', 'João Santos', 'Ana Paula', 'Carlos Oliveira', 'Fernanda Costa', 'Ricardo Lima', 'Juliana Souza', 'Pedro Alves']
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com']
  const preferences = ['Sem lactose', 'Vegano', 'Sem glúten', 'Vegetariano', 'Sem açúcar']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `c${i + 1}`,
    name: names[i % names.length] + ` ${i + 1}`,
    phone: `(11) 9${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    email: `user${i + 1}@${domains[i % domains.length]}`,
    address: `Rua ${String.fromCharCode(65 + (i % 26))}, ${Math.floor(Math.random() * 999) + 1}`,
    birthDate: `19${80 + (i % 20)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    preferences: preferences[i % preferences.length],
    status: (i % 3 === 0 ? 'inactive' : 'active') as ClientStatus,
    orders: Math.floor(Math.random() * 100) + 1,
    total: Math.floor(Math.random() * 10000) + 100,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    lastOrder: `2025-0${Math.floor(Math.random() * 8) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    joinDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
  }))
}

const seedClients: Client[] = generateMockClients(1000) // Simula lista longa para testar virtualização

export default function ClientsManagement() {
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ClientStatus>('all')
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('all')

  const [clients, setClients] = useState<Client[]>(seedClients)

  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    preferences: '',
    status: 'active' as ClientStatus
  })

  const resetForm = () =>
    setClientForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      birthDate: '',
      preferences: '',
      status: 'active'
    })

  // Filtros memoizados para performance em listas longas
  const filteredClients = useMemo(() => {
    const term = (searchTerm || '').toLowerCase()
    return clients.filter((client) => {
      const name = (client.name || '').toLowerCase()
      const email = (client.email || '').toLowerCase()
      const phone = client.phone || ''

      const matchesSearch =
        term === '' ||
        name.includes(term) ||
        email.includes(term) ||
        phone.includes(searchTerm || '')

      const matchesStatus = statusFilter === 'all' || client.status === statusFilter
      const matchesOrder =
        orderFilter === 'all' ||
        (orderFilter === 'high' && client.orders > 40) ||
        (orderFilter === 'medium' && client.orders >= 20 && client.orders <= 40) ||
        (orderFilter === 'low' && client.orders < 20)

      return matchesSearch && matchesStatus && matchesOrder
    })
  }, [clients, searchTerm, statusFilter, orderFilter])

  // Métricas memoizadas para evitar recálculos desnecessários
  const clientMetrics = useMemo(() => {
    const totalClients = filteredClients.length
    const activeClients = filteredClients.filter((c) => c.status === 'active').length
    const totalRevenue = filteredClients.reduce((acc, c) => acc + c.total, 0)
    const averageRating = filteredClients.length > 0
      ? (filteredClients.reduce((acc, c) => acc + c.rating, 0) / filteredClients.length).toFixed(1)
      : '0.0'
    
    return { totalClients, activeClients, totalRevenue, averageRating }
  }, [filteredClients])

  // Componente de linha virtualizada para performance
  const ClientRow = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const client = filteredClients[index]
    if (!client) return null

    return (
      <div style={style} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-7 gap-4 px-6 py-4 items-center">
          {/* Cliente */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-manrope font-bold text-sm">{client.name.charAt(0)}</span>
            </div>
            <div>
              <span className="font-manrope font-medium text-gray-900 dark:text-white">{client.name}</span>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600 dark:text-gray-300">{client.rating}</span>
              </div>
            </div>
          </div>
          
          {/* Contato */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Phone className="w-4 h-4" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Mail className="w-4 h-4" />
              <span className="truncate">{client.email}</span>
            </div>
          </div>
          
          {/* Status */}
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {client.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          
          {/* Pedidos */}
          <div>
            <span className="font-manrope font-medium text-gray-900 dark:text-white">{client.orders}</span>
          </div>
          
          {/* Total Gasto */}
          <div>
            <span className="font-manrope font-bold text-green-600 dark:text-green-400">
              R$ {client.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          {/* Último Pedido */}
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              <span>{client.lastOrder || '-'}</span>
            </div>
          </div>
          
          {/* Ações */}
          <div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleViewClient(client)}
                className="btn-ghost p-2 text-blue-600 dark:text-blue-400 rounded-lg"
                title="Visualizar detalhes"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEditClientOpen(client)}
                className="btn-ghost p-2 text-green-600 dark:text-green-400 rounded-lg"
                title="Editar cliente"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedClient(client)
                  setShowDeleteModal(true)
                }}
                className="btn-ghost p-2 text-red-600 dark:text-red-400 rounded-lg"
                title="Excluir cliente"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }, [filteredClients])

  // Funções otimizadas com useCallback para evitar re-renders
  const handleCreateClient = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const newClient: Client = {
      id: `c_${Date.now()}`,
      name: clientForm.name.trim(),
      phone: clientForm.phone.trim(),
      email: clientForm.email.trim(),
      address: clientForm.address.trim(),
      birthDate: clientForm.birthDate || undefined,
      preferences: clientForm.preferences || undefined,
      status: clientForm.status,
      orders: 0,
      total: 0,
      rating: 0,
      lastOrder: undefined,
      joinDate: new Date().toISOString().substring(0, 10)
    }
    setClients((prev) => [newClient, ...prev])
    setShowModal(false)
    resetForm()
  }, [clientForm, resetForm])

  const handleEditClientOpen = useCallback((client: Client) => {
    setSelectedClient(client)
    setClientForm({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address || '',
      birthDate: client.birthDate || '',
      preferences: client.preferences || '',
      status: client.status
    })
    setShowEditModal(true)
  }, [])

  const handleUpdateClient = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) return
    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id
          ? {
              ...c,
              name: clientForm.name,
              phone: clientForm.phone,
              email: clientForm.email,
              address: clientForm.address || undefined,
              birthDate: clientForm.birthDate || undefined,
              preferences: clientForm.preferences || undefined,
              status: clientForm.status
            }
          : c
      )
    )
    setShowEditModal(false)
    setSelectedClient(null)
    resetForm()
  }, [selectedClient, clientForm, resetForm])

  const handleViewClient = useCallback((client: Client) => {
    setSelectedClient(client)
    setShowViewModal(true)
  }, [])

  const handleDeleteClientConfirm = useCallback(() => {
    if (!selectedClient) return
    setClients((prev) => prev.filter((c) => c.id !== selectedClient.id))
    setShowDeleteModal(false)
    setSelectedClient(null)
  }, [selectedClient])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setStatusFilter('all')
    setOrderFilter('all')
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-manrope font-bold text-gray-900 dark:text-white">Gestão de Clientes</h1>
          <p className="text-gray-600 dark:text-gray-300 font-manrope">Cadastre e gerencie seus clientes</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-success px-6 py-3 rounded-xl font-manrope font-semibold flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="card-primary rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Buscar Cliente</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Nome, telefone ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-primary w-full pl-10 pr-4 py-3 rounded-xl font-manrope"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | ClientStatus)}
              className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Volume de Pedidos</label>
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value as OrderFilter)}
              className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
            >
              <option value="all">Todos os Volumes</option>
              <option value="high">Alto (40+ pedidos)</option>
              <option value="medium">Médio (20-40 pedidos)</option>
              <option value="low">Baixo (menos de 20)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button onClick={clearFilters} className="btn-ghost w-full px-4 py-3 rounded-xl font-manrope font-medium flex items-center justify-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Limpar Filtros</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-manrope font-medium text-gray-600 dark:text-gray-300">Total de Clientes</p>
              <p className="text-3xl font-manrope font-bold text-gray-900 dark:text-white">{clientMetrics.totalClients}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-manrope font-medium text-gray-600 dark:text-gray-300">Clientes Ativos</p>
              <p className="text-3xl font-manrope font-bold text-green-600 dark:text-green-400">{clientMetrics.activeClients}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-manrope font-medium text-gray-600 dark:text-gray-300">Receita Total</p>
              <p className="text-3xl font-manrope font-bold text-emerald-600 dark:text-emerald-400">
                R$ {clientMetrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-manrope font-medium text-gray-600 dark:text-gray-300">Avaliação Média</p>
              <p className="text-3xl font-manrope font-bold text-yellow-600 dark:text-yellow-400">{clientMetrics.averageRating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista Virtualizada para Performance - Suporta milhares de clientes */}
      <div className="card-primary rounded-2xl overflow-hidden">
        {/* Header da tabela mantido para consistência visual */}
        <div className="bg-adaptive border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-7 gap-4 px-6 py-3">
            <div className="text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Cliente</div>
            <div className="text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Contato</div>
            <div className="text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Status</div>
            <div className="text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Pedidos</div>
            <div className="text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Total Gasto</div>
            <div className="text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Último Pedido</div>
            <div className="text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Ações</div>
          </div>
        </div>
        
        {/* Lista virtualizada - Renderiza apenas itens visíveis */}
        {filteredClients.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-muted">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-lg font-manrope font-medium mb-2 text-gray-900 dark:text-white">Nenhum cliente encontrado</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tente ajustar os filtros ou cadastrar um novo cliente</p>
            </div>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {filteredClients.map((client, index) => (
              <ClientRow key={client.id} index={index} style={{}} />
            ))}
          </div>
        )}
        
        {/* Informações de paginação/total */}
        {filteredClients.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Mostrando {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} de {clients.length} total
            </p>
          </div>
        )}
      </div>

      {/* Modal: Cadastrar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6" />
                  <h3 className="text-2xl font-manrope font-bold">Cadastrar Cliente</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Telefone</label>
                  <input
                    type="tel"
                    required
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">E-mail</label>
                  <input
                    type="email"
                    required
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Data de Nascimento</label>
                  <input
                    type="date"
                    value={clientForm.birthDate}
                    onChange={(e) => setClientForm({ ...clientForm, birthDate: e.target.value })}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Status</label>
                  <select
                    value={clientForm.status}
                    onChange={(e) => setClientForm({ ...clientForm, status: e.target.value as ClientStatus })}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Endereço Completo</label>
                <input
                  type="text"
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                  className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Preferências Alimentares</label>
                <textarea
                  value={clientForm.preferences}
                  onChange={(e) => setClientForm({ ...clientForm, preferences: e.target.value })}
                  className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  placeholder="Alergias, restrições, preferências..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 px-6 py-3 rounded-xl font-manrope font-medium">
                  Cancelar
                </button>
                <button type="submit" className="btn-success flex-1 px-6 py-3 rounded-xl font-manrope font-semibold flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Cadastrar Cliente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Visualizar */}
      {showViewModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="w-6 h-6" />
                  <h3 className="text-2xl font-manrope font-bold">Detalhes do Cliente</h3>
                </div>
                <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Nome Completo</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-gray-900 dark:text-white">{selectedClient.name}</div>
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Telefone</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-gray-900 dark:text-white">{selectedClient.phone}</div>
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">E-mail</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-gray-900 dark:text-white">{selectedClient.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Data de Nascimento</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-gray-900 dark:text-white">
                    {selectedClient.birthDate ? new Date(selectedClient.birthDate).toLocaleDateString('pt-BR') : 'Não informado'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Status</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-gray-900 dark:text-white">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedClient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedClient.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Data de Cadastro</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-gray-900 dark:text-white">
                    {selectedClient.joinDate ? new Date(selectedClient.joinDate).toLocaleDateString('pt-BR') : 'Não informado'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Endereço</label>
                <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-gray-900 dark:text-white">
                  {selectedClient.address || 'Não informado'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Preferências Alimentares</label>
                <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-gray-900 dark:text-white">
                  {selectedClient.preferences || 'Nenhuma preferência registrada'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-adaptive">
                <div className="text-center">
                  <div className="text-2xl font-manrope font-bold text-blue-600 dark:text-blue-400">{selectedClient.orders}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total de Pedidos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-manrope font-bold text-green-600 dark:text-green-400">
                    R$ {selectedClient.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Gasto</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-manrope font-bold text-yellow-600 dark:text-yellow-400">{selectedClient.rating}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Avaliação</div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button onClick={() => setShowViewModal(false)} className="btn-ghost px-6 py-3 rounded-xl font-manrope font-medium">
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar */}
      {showEditModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Edit className="w-6 h-6" />
                  <h3 className="text-2xl font-manrope font-bold">Editar Cliente</h3>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-white hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateClient} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Telefone</label>
                  <input
                    type="tel"
                    required
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">E-mail</label>
                  <input
                    type="email"
                    required
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Data de Nascimento</label>
                  <input
                    type="date"
                    value={clientForm.birthDate}
                    onChange={(e) => setClientForm({ ...clientForm, birthDate: e.target.value })}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Status</label>
                  <select
                    value={clientForm.status}
                    onChange={(e) => setClientForm({ ...clientForm, status: e.target.value as ClientStatus })}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Endereço Completo</label>
                <input
                  type="text"
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                  className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Preferências Alimentares</label>
                <textarea
                  value={clientForm.preferences}
                  onChange={(e) => setClientForm({ ...clientForm, preferences: e.target.value })}
                  className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  placeholder="Alergias, restrições, preferências..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-4 pt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-ghost flex-1 px-6 py-3 rounded-xl font-manrope font-medium">
                  Cancelar
                </button>
                <button type="submit" className="btn-success flex-1 px-6 py-3 rounded-xl font-manrope font-semibold flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Atualizar Cliente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Excluir */}
      {showDeleteModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <Trash2 className="w-6 h-6" />
                <h3 className="text-2xl font-manrope font-bold">Confirmar Exclusão</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h4 className="text-lg font-manrope font-semibold text-gray-900 dark:text-white mb-2">Excluir Cliente</h4>
                <p className="text-gray-600 dark:text-gray-300">Tem certeza que deseja excluir <strong>{selectedClient.name}</strong>?</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Esta ação não pode ser desfeita e removerá todos os dados do cliente.</p>
              </div>

              <div className="flex space-x-4 pt-4">
                <button onClick={() => setShowDeleteModal(false)} className="btn-ghost flex-1 px-6 py-3 rounded-xl font-manrope font-medium">
                  Cancelar
                </button>
                <button onClick={handleDeleteClientConfirm} className="btn-danger flex-1 px-6 py-3 rounded-xl font-manrope font-semibold">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}