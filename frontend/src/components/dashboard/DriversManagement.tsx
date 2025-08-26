'use client'

import { useState } from 'react'
import { 
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Car,
  Star,
  Edit,
  Eye,
  Trash2,
  Plus,
  X,
  Save
} from 'lucide-react'

export default function DriversManagement() {
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [driverForm, setDriverForm] = useState({
    name: '',
    phone: '',
    email: '',
    cpf: '',
    cnh: '',
    vehicle: '',
    plate: '',
    address: ''
  })

  const drivers = [
    { id: 1, name: 'João Silva', phone: '(11) 99999-9999', email: 'joao@email.com', vehicle: 'Moto 150cc', plate: 'ABC-1234', rating: 4.8, deliveries: 156, status: 'available' },
    { id: 2, name: 'Pedro Santos', phone: '(11) 88888-8888', email: 'pedro@email.com', vehicle: 'Moto 160cc', plate: 'DEF-5678', rating: 4.6, deliveries: 142, status: 'busy' },
    { id: 3, name: 'Carlos Lima', phone: '(11) 77777-7777', email: 'carlos@email.com', vehicle: 'Moto 125cc', plate: 'GHI-9012', rating: 4.4, deliveries: 98, status: 'offline' }
  ]

  // Funções para gerenciar motoboys
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Cadastrando motoboy:', driverForm)
    setShowModal(false)
    setDriverForm({ name: '', phone: '', email: '', cpf: '', cnh: '', vehicle: '', plate: '', address: '' })
  }

  const handleViewDriver = (driver: any) => {
    setSelectedDriver(driver)
    setShowViewModal(true)
  }

  const handleEditDriver = (driver: any) => {
    setSelectedDriver(driver)
    setDriverForm({
      name: driver.name,
      phone: driver.phone,
      email: driver.email,
      cpf: driver.cpf || '',
      cnh: driver.cnh || '',
      vehicle: driver.vehicle,
      plate: driver.plate,
      address: driver.address || ''
    })
    setShowEditModal(true)
  }

  const handleDeleteDriver = (driver: any) => {
    setSelectedDriver(driver)
    setShowDeleteModal(true)
  }

  const confirmDeleteDriver = () => {
    console.log('Excluindo motoboy:', selectedDriver)
    // TODO: Implementar integração com backend
    // const updatedDrivers = drivers.filter(d => d.id !== selectedDriver.id)
    // setDrivers(updatedDrivers)
    setShowDeleteModal(false)
    setSelectedDriver(null)
  }

  const handleUpdateDriver = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Atualizando motoboy:', driverForm)
    // TODO: Implementar integração com backend
    setShowEditModal(false)
    setSelectedDriver(null)
    setDriverForm({ name: '', phone: '', email: '', cpf: '', cnh: '', vehicle: '', plate: '', address: '' })
  }

  // Filtrar motoboys baseado nos filtros aplicados
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = searchTerm === '' || 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    const matchesVehicle = vehicleFilter === 'all' || driver.vehicle === vehicleFilter
    
    return matchesSearch && matchesStatus && matchesVehicle
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-manrope font-bold text-primary">Gestão de Motoboys</h1>
          <p className="text-secondary font-manrope">Cadastre e gerencie seus entregadores</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary px-6 py-3 rounded-xl font-manrope font-semibold flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Motoboy</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="card-primary rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-manrope font-medium text-primary mb-2">Buscar Motoboy</label>
            <input
              type="text"
              placeholder="Nome, telefone ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
            />
          </div>
          
          <div>
            <label className="block text-sm font-manrope font-medium text-primary mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
            >
              <option value="all">Todos os Status</option>
              <option value="available">Disponível</option>
              <option value="busy">Ocupado</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-manrope font-medium text-primary mb-2">Tipo de Veículo</label>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
            >
              <option value="all">Todos os Veículos</option>
              <option value="Moto 125cc">Moto 125cc</option>
              <option value="Moto 150cc">Moto 150cc</option>
              <option value="Moto 160cc">Moto 160cc</option>
              <option value="Bicicleta">Bicicleta</option>
              <option value="Carro">Carro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-manrope font-medium text-secondary">Total de Motoboys</p>
              <p className="text-3xl font-manrope font-bold text-primary">{filteredDrivers.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-manrope font-medium text-secondary">Disponíveis</p>
              <p className="text-3xl font-manrope font-bold text-green-600 dark:text-green-400">{filteredDrivers.filter(d => d.status === 'available').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-manrope font-medium text-secondary">Em Entrega</p>
              <p className="text-3xl font-manrope font-bold text-orange-600 dark:text-orange-400">{filteredDrivers.filter(d => d.status === 'busy').length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
        
        <div className="card-primary rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-manrope font-medium text-secondary">Avaliação Média</p>
              <p className="text-3xl font-manrope font-bold text-yellow-600 dark:text-yellow-400">
                {filteredDrivers.length > 0 ? (filteredDrivers.reduce((acc, d) => acc + d.rating, 0) / filteredDrivers.length).toFixed(1) : '0.0'}
              </p>
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
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-primary uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-primary uppercase">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-primary uppercase">Veículo</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-primary uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-primary uppercase">Avaliação</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-primary uppercase">Entregas</th>
                <th className="px-6 py-3 text-left text-xs font-manrope font-medium text-primary uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-adaptive">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-muted">
                      <UserPlus className="w-16 h-16 mx-auto mb-4 text-muted" />
                      <p className="text-lg font-manrope font-medium mb-2 text-primary">Nenhum motoboy encontrado</p>
                      <p className="text-sm text-secondary">Tente ajustar os filtros ou cadastrar um novo motoboy</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover-primary transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-manrope font-bold text-sm">{driver.name.charAt(0)}</span>
                        </div>
                        <span className="font-manrope font-medium text-primary">{driver.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-secondary">
                          <Phone className="w-4 h-4" />
                          <span>{driver.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-secondary">
                          <Mail className="w-4 h-4" />
                          <span>{driver.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-primary">
                          <Car className="w-4 h-4" />
                          <span>{driver.vehicle}</span>
                        </div>
                        <span className="text-xs text-muted">{driver.plate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        driver.status === 'available' ? 'bg-green-100 text-green-800' :
                        driver.status === 'busy' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status === 'available' ? 'Disponível' :
                         driver.status === 'busy' ? 'Ocupado' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-manrope font-medium text-primary">{driver.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-manrope font-medium text-primary">{driver.deliveries}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDriver(driver)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Visualizar detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditDriver(driver)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Editar motoboy"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteDriver(driver)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Excluir motoboy"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserPlus className="w-6 h-6" />
                  <h3 className="text-2xl font-manrope font-bold">Cadastrar Motoboy</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={driverForm.name}
                    onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="Nome do motoboy"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Telefone</label>
                  <input
                    type="tel"
                    required
                    value={driverForm.phone}
                    onChange={(e) => setDriverForm({...driverForm, phone: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">E-mail</label>
                  <input
                    type="email"
                    required
                    value={driverForm.email}
                    onChange={(e) => setDriverForm({...driverForm, email: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">CPF</label>
                  <input
                    type="text"
                    required
                    value={driverForm.cpf}
                    onChange={(e) => setDriverForm({...driverForm, cpf: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="000.000.000-00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">CNH</label>
                  <input
                    type="text"
                    required
                    value={driverForm.cnh}
                    onChange={(e) => setDriverForm({...driverForm, cnh: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="Número da CNH"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Veículo</label>
                  <select
                    required
                    value={driverForm.vehicle}
                    onChange={(e) => setDriverForm({...driverForm, vehicle: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  >
                    <option value="">Selecione o veículo</option>
                    <option value="moto">Moto</option>
                    <option value="bicicleta">Bicicleta</option>
                    <option value="carro">Carro</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Placa do Veículo</label>
                  <input
                    type="text"
                    required
                    value={driverForm.plate}
                    onChange={(e) => setDriverForm({...driverForm, plate: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="ABC-1234"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Endereço</label>
                  <input
                    type="text"
                    required
                    value={driverForm.address}
                    onChange={(e) => setDriverForm({...driverForm, address: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="Endereço completo"
                  />
                </div>
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
                  className="btn-primary flex-1 px-6 py-3 rounded-xl font-manrope font-semibold flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Cadastrar Motoboy</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {showViewModal && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="w-6 h-6" />
                  <h3 className="text-2xl font-manrope font-bold">Detalhes do Motoboy</h3>
                </div>
                <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Nome Completo</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-primary">
                    {selectedDriver.name}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Telefone</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-primary">
                    {selectedDriver.phone}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">E-mail</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-primary">
                    {selectedDriver.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Veículo</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-primary">
                    {selectedDriver.vehicle}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Placa</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-primary">
                    {selectedDriver.plate}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Avaliação</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-primary flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{selectedDriver.rating}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Total de Entregas</label>
                  <div className="px-4 py-3 bg-adaptive border border-adaptive rounded-xl font-manrope text-primary">
                    {selectedDriver.deliveries}
                  </div>
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
      {showEditModal && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Edit className="w-6 h-6" />
                  <h3 className="text-2xl font-manrope font-bold">Editar Motoboy</h3>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-white hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdateDriver} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={driverForm.name}
                    onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="Nome do motoboy"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Telefone</label>
                  <input
                    type="tel"
                    required
                    value={driverForm.phone}
                    onChange={(e) => setDriverForm({...driverForm, phone: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">E-mail</label>
                  <input
                    type="email"
                    required
                    value={driverForm.email}
                    onChange={(e) => setDriverForm({...driverForm, email: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">CPF</label>
                  <input
                    type="text"
                    value={driverForm.cpf}
                    onChange={(e) => setDriverForm({...driverForm, cpf: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="000.000.000-00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">CNH</label>
                  <input
                    type="text"
                    value={driverForm.cnh}
                    onChange={(e) => setDriverForm({...driverForm, cnh: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="Número da CNH"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Veículo</label>
                  <select
                    required
                    value={driverForm.vehicle}
                    onChange={(e) => setDriverForm({...driverForm, vehicle: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                  >
                    <option value="">Selecione o veículo</option>
                    <option value="Moto 125cc">Moto 125cc</option>
                    <option value="Moto 150cc">Moto 150cc</option>
                    <option value="Moto 160cc">Moto 160cc</option>
                    <option value="Bicicleta">Bicicleta</option>
                    <option value="Carro">Carro</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Placa do Veículo</label>
                  <input
                    type="text"
                    required
                    value={driverForm.plate}
                    onChange={(e) => setDriverForm({...driverForm, plate: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="ABC-1234"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Endereço</label>
                  <input
                    type="text"
                    value={driverForm.address}
                    onChange={(e) => setDriverForm({...driverForm, address: e.target.value})}
                    className="input-primary w-full px-4 py-3 rounded-xl font-manrope"
                    placeholder="Endereço completo"
                  />
                </div>
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
                  <span>Atualizar Motoboy</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && selectedDriver && (
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
                <h4 className="text-lg font-manrope font-semibold text-primary mb-2">
                  Excluir Motoboy
                </h4>
                <p className="text-secondary">
                  Tem certeza que deseja excluir <strong>{selectedDriver.name}</strong>?
                </p>
                <p className="text-sm text-muted mt-2">
                  Esta ação não pode ser desfeita.
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
                  onClick={confirmDeleteDriver}
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