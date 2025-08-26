'use client'

import { useState } from 'react'
import { 
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
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

export default function ClientsManagement() {
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orderFilter, setOrderFilter] = useState('all')
  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    preferences: '',
    status: 'active'
  })

  const clients = [
    { 
      id: 1, 
      name: 'João Silva', 
      phone: '(11) 99999-9999', 
      email: 'joao@email.com', 
      address: 'Rua das Flores, 123 - Centro, São Paulo',
      birthDate: '1985-03-15',
      preferences: 'Sem glúten, vegetariano',
      status: 'active',
      orders: 47, 
      total: 2340.50, 
      lastOrder: '2 dias atrás',
      rating: 4.8,
      joinDate: '2022-01-15'
    },
    { 
      id: 2, 
      name: 'Maria Santos', 
      phone: '(11) 88888-8888', 
      email: 'maria@email.com', 
      address: 'Av. Paulista, 456 - Bela Vista, São Paulo',
      birthDate: '1990-07-22',
      preferences: 'Sem lactose',
      status: 'active',
      orders: 38, 
      total: 1890.30, 
      lastOrder: '1 dia atrás',
      rating: 4.6,
      joinDate: '2022-03-10'
    },
    { 
      id: 3, 
      name: 'Pedro Costa', 
      phone: '(11) 77777-7777', 
      email: 'pedro@email.com', 
      address: 'Rua Augusta, 789 - Consolação, São Paulo',
      birthDate: '1988-11-08',
      preferences: 'Sem restrições',
      status: 'inactive',
      orders: 32, 
      total: 1650.80, 
      lastOrder: '3 dias atrás',
      rating: 4.4,
      joinDate: '2022-05-20'
    },
    { 
      id: 4, 
      name: 'Ana Lima', 
      phone: '(11) 66666-6666', 
      email: 'ana@email.com', 
      address: 'Rua Oscar Freire, 321 - Jardins, São Paulo',
      birthDate: '1992-04-12',
      preferences: 'Vegana',
      status: 'active',
      orders: 28, 
      total: 1420.90, 
      lastOrder: 'Hoje',
      rating: 4.9,
      joinDate: '2022-08-05'
    },
    { 
      id: 5, 
      name: 'Carlos Oliveira', 
      phone: '(11) 55555-5555', 
      email: 'carlos@email.com', 
      address: 'Rua Haddock Lobo, 654 - Cerqueira César, São Paulo',
      birthDate: '1983-09-30',
      preferences: 'Sem açúcar',
      status: 'active',
      orders: 52, 
      total: 2980.75, 
      lastOrder: 'Ontem',
      rating: 4.7,
      joinDate: '2021-12-01'
    }
  ]

  // Funções para gerenciar clientes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Cadastrando cliente:', clientForm)
    setShowModal(false)
    setClientForm({ name: '', phone: '', email: '', address: '', birthDate: '', preferences: '', status: 'active' })
  }

  const handleViewClient = (client: any) => {
    setSelectedClient(client)
    setShowViewModal(true)
  }

  const handleEditClient = (client: any) => {
    setSelectedClient(client)
    setClientForm({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
      birthDate: client.birthDate,
      preferences: client.preferences,
      status: client.status
    })
    setShowEditModal(true)
  }

  const handleDeleteClient = (client: any) => {
    setSelectedClient(client)
    setShowDeleteModal(true)
  }

  const confirmDeleteClient = () => {
    console.log('Excluindo cliente:', selectedClient)
    // TODO: Implementar integração com backend
    // const updatedClients = clients.filter(c => c.id !== selectedClient.id)
    // setClients(updatedClients)
    setShowDeleteModal(false)
    setSelectedClient(null)
  }

  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Atualizando cliente:', clientForm)
    // TODO: Implementar integração com backend
    setShowEditModal(false)
    setSelectedClient(null)
    setClientForm({ name: '', phone: '', email: '', address: '', birthDate: '', preferences: '', status: 'active' })
  }

  // Filtrar clientes baseado nos filtros aplicados
  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    const matchesOrder = orderFilter === 'all' || 
      (orderFilter === 'high' && client.orders > 40) ||
      (orderFilter === 'medium' && client.orders >= 20 && client.orders <= 40) ||
      (orderFilter === 'low' && client.orders < 20)
    
    return matchesSearch && matchesStatus && matchesOrder
  })

  // Calcular estatísticas
  const totalClients = filteredClients.length
  const activeClients = filteredClients.filter(c => c.status === 'active').length
  const totalRevenue = filteredClients.reduce((acc, c) => acc + c.total, 0)
  const averageRating = filteredClients.length > 0 ? 
    (filteredClients.reduce((acc, c) => acc + c.rating, 0) / filteredClients.length).toFixed(1) : '0.0'

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

      {/* Filtros e Busca */}
      <div className="card-primary rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Buscar Cliente</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
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
              onChange={(e) => setStatusFilter(e.target.value)}
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
              onChange={(e) => setOrderFilter(e.target.value)}
              className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
            >
              <option value="all">Todos os Volumes</option>
              <option value="high">Alto (40+ pedidos)</option>
              <option value="medium">Médio (20-40 pedidos)</option>
              <option value="low">Baixo (menos de 20)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setOrderFilter('all')
              }}
              className="btn-ghost w-full px-4 py-3 rounded-xl font-manrope font-medium flex items-center justify-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Limpar Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-manrope font-medium text-gray-600 dark:text-gray-300">Total de Clientes</p>
              <p className="text-3xl font-manrope font-bold text-gray-900 dark:text-white">{totalClients}</p>
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
              <p className="text-3xl font-manrope font-bold text-green-600 dark:text-green-400">{activeClients}</p>
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
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
              <p className="text-3xl font-manrope font-bold text-yellow-600 dark:text-yellow-400">{averageRating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="card-primary rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-adaptive">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Pedidos</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Total Gasto</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Último Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-900 dark:text-white uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-adaptive">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-muted">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                      <p className="text-lg font-manrope font-medium mb-2 text-gray-900 dark:text-white">Nenhum cliente encontrado</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Tente ajustar os filtros ou cadastrar um novo cliente</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover-primary transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <Phone className="w-4 h-4" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <Mail className="w-4 h-4" />
                          <span>{client.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-manrope font-medium text-gray-900 dark:text-white">{client.orders}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-manrope font-bold text-green-600 dark:text-green-400">R$ {client.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span>{client.lastOrder}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewClient(client)}
                          className="btn-ghost p-2 text-blue-600 dark:text-blue-400 rounded-lg transition-colors duration-200"
                          title="Visualizar detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditClient(client)}
                          className="btn-ghost p-2 text-green-600 dark:text-green-400 rounded-lg transition-colors duration-200"
                          title="Editar cliente"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClient(client)}
                          className="btn-ghost p-2 text-red-600 dark:text-red-400 rounded-lg transition-colors duration-200"
                          title="Excluir cliente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro */}
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
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={clientForm.name}
                    onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
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
                    onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
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
                    onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Data de Nascimento</label>
                  <input
                    type="date"
                    value={clientForm.birthDate}
                    onChange={(e) => setClientForm({...clientForm, birthDate: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Status</label>
                  <select
                    value={clientForm.status}
                    onChange={(e) => setClientForm({...clientForm, status: e.target.value})}
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
                  required
                  value={clientForm.address}
                  onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                  className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>
              
              <div>
                <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Preferências Alimentares</label>
                <textarea
                  value={clientForm.preferences}
                  onChange={(e) => setClientForm({...clientForm, preferences: e.target.value})}
                  className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  placeholder="Alergias, restrições, preferências..."
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost flex-1 px-6 py-3 rounded-xl font-manrope font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-success flex-1 px-6 py-3 rounded-xl font-manrope font-semibold flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Cadastrar Cliente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
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
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-gray-900 dark:text-white">
                    {selectedClient.name}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Telefone</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-gray-900 dark:text-white">
                    {selectedClient.phone}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">E-mail</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-gray-900 dark:text-white">
                    {selectedClient.email}
                  </div>
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedClient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
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
                <button
                  onClick={() => setShowViewModal(false)}
                  className="btn-ghost px-6 py-3 rounded-xl font-manrope font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
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
                    onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
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
                    onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
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
                    onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Data de Nascimento</label>
                  <input
                    type="date"
                    value={clientForm.birthDate}
                    onChange={(e) => setClientForm({...clientForm, birthDate: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Status</label>
                  <select
                    value={clientForm.status}
                    onChange={(e) => setClientForm({...clientForm, status: e.target.value})}
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
                  required
                  value={clientForm.address}
                  onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                  className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>
              
              <div>
                <label className="block text-sm font-manrope font-medium text-gray-900 dark:text-white mb-2">Preferências Alimentares</label>
                <textarea
                  value={clientForm.preferences}
                  onChange={(e) => setClientForm({...clientForm, preferences: e.target.value})}
                  className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  placeholder="Alergias, restrições, preferências..."
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-ghost flex-1 px-6 py-3 rounded-xl font-manrope font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-success flex-1 px-6 py-3 rounded-xl font-manrope font-semibold flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Atualizar Cliente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
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
                <h4 className="text-lg font-manrope font-semibold text-gray-900 dark:text-white mb-2">
                  Excluir Cliente
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Tem certeza que deseja excluir <strong>{selectedClient.name}</strong>?
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Esta ação não pode ser desfeita e removerá todos os dados do cliente.
                </p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-ghost flex-1 px-6 py-3 rounded-xl font-manrope font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteClient}
                  className="btn-danger flex-1 px-6 py-3 rounded-xl font-manrope font-semibold"
                >
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