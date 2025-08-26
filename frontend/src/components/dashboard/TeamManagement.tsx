'use client'

import { useState } from 'react'
import { Users, Shield, Clock, MessageSquare, Plus, Settings, UserCheck, X, Save, Edit, Trash2, Eye, Phone, Mail, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

export default function TeamManagement() {
  const [employees] = useState([
    { id: 1, name: 'Ana Silva', role: 'Gerente', status: 'online', shift: 'Manhã', permissions: 'admin', email: 'ana@vynlotaste.com', phone: '(11) 99999-9999', address: 'Rua das Flores, 123', joinDate: '2023-01-15', salary: 3500, department: 'Administrativo' },
    { id: 2, name: 'Carlos Santos', role: 'Cozinheiro', status: 'online', shift: 'Tarde', permissions: 'kitchen', email: 'carlos@vynlotaste.com', phone: '(11) 88888-8888', address: 'Av. Principal, 456', joinDate: '2023-03-20', salary: 2800, department: 'Cozinha' },
    { id: 3, name: 'Maria Costa', role: 'Garçonete', status: 'offline', shift: 'Noite', permissions: 'waiter', email: 'maria@vynlotaste.com', phone: '(11) 77777-7777', address: 'Rua Augusta, 789', joinDate: '2023-05-10', salary: 2200, department: 'Atendimento' }
  ])

  // Estados para funcionalidades
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false)
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [messageText, setMessageText] = useState('')
  const [messageRecipient, setMessageRecipient] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [isEditingEmployee, setIsEditingEmployee] = useState(false)

  // Formulário para novo funcionário
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    shift: 'Manhã',
    permissions: 'waiter',
    department: '',
    salary: '',
    address: ''
  })

  // Formulário para editar funcionário
  const [editEmployeeForm, setEditEmployeeForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    shift: 'Manhã',
    permissions: 'waiter',
    department: '',
    salary: '',
    address: ''
  })

  // Formulário para configurações
  const [settingsForm, setSettingsForm] = useState({
    workHours: '8',
    breakTime: '1',
    overtimeAllowed: true,
    autoSchedule: true,
    notifications: true
  })

  // Função para adicionar novo funcionário
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingEmployee(true)
    
    try {
      // Simular criação de funcionário
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Novo funcionário criado:', newEmployeeForm)
      alert('Funcionário cadastrado com sucesso!')
      
      // Limpar formulário e fechar modal
      setNewEmployeeForm({
        name: '', role: '', email: '', phone: '', shift: 'Manhã', 
        permissions: 'waiter', department: '', salary: '', address: ''
      })
      setShowNewEmployeeModal(false)
      
    } catch (error) {
      alert('Erro ao cadastrar funcionário')
    } finally {
      setIsAddingEmployee(false)
    }
  }

  // Função para abrir configurações do funcionário
  const openEmployeeSettings = (employee: any) => {
    setSelectedEmployee(employee)
    setShowSettingsModal(true)
  }

  // Função para salvar configurações
  const handleSaveSettings = async () => {
    if (!selectedEmployee) return
    
    setIsSavingSettings(true)
    
    try {
      // Simular salvamento de configurações
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Configurações salvas para:', selectedEmployee.name)
      alert('Configurações salvas com sucesso!')
      
      setShowSettingsModal(false)
      setSelectedEmployee(null)
      
    } catch (error) {
      alert('Erro ao salvar configurações')
    } finally {
      setIsSavingSettings(false)
    }
  }

  // Função para abrir chat com funcionário
  const openEmployeeChat = (employee: any) => {
    setSelectedEmployee(employee)
    setMessageRecipient(employee.name)
    setShowMessageModal(true)
  }

  // Função para enviar mensagem
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !messageRecipient) return
    
    setIsSendingMessage(true)
    
    try {
      // Simular envio de mensagem
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log(`Mensagem enviada para ${messageRecipient}:`, messageText)
      alert('Mensagem enviada com sucesso!')
      
      // Limpar formulário e fechar modal
      setMessageText('')
      setMessageRecipient('')
      setShowMessageModal(false)
      setSelectedEmployee(null)
      
    } catch (error) {
      alert('Erro ao enviar mensagem')
    } finally {
      setIsSendingMessage(false)
    }
  }

  // Função para visualizar detalhes do funcionário
  const viewEmployeeDetails = (employee: any) => {
    setSelectedEmployee(employee)
    setShowEmployeeDetails(true)
  }

  // Função para editar funcionário
  const editEmployee = (employee: any) => {
    setSelectedEmployee(employee)
    // Preencher formulário com dados atuais
    setEditEmployeeForm({
      name: employee.name,
      role: employee.role,
      email: employee.email,
      phone: employee.phone,
      shift: employee.shift,
      permissions: employee.permissions,
      department: employee.department,
      salary: employee.salary.toString(),
      address: employee.address
    })
    setShowEditEmployeeModal(true)
  }

  // Função para salvar edição do funcionário
  const handleSaveEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee) return
    
    setIsEditingEmployee(true)
    
    try {
      // Simular salvamento da edição
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Funcionário editado:', editEmployeeForm)
      alert('Funcionário atualizado com sucesso!')
      
      // Atualizar dados na lista (em uma aplicação real, isso seria feito via API)
      // Por enquanto, apenas fechamos o modal
      setShowEditEmployeeModal(false)
      setSelectedEmployee(null)
      
    } catch (error) {
      alert('Erro ao atualizar funcionário')
    } finally {
      setIsEditingEmployee(false)
    }
  }

  // Função para remover funcionário
  const removeEmployee = (employee: any) => {
    if (confirm(`Tem certeza que deseja remover ${employee.name} da equipe?`)) {
      console.log('Funcionário removido:', employee.name)
      alert('Funcionário removido com sucesso!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-manrope font-bold text-gray-900 dark:text-white">Gestão de Equipe</h1>
          <p className="text-gray-600 dark:text-gray-300 font-manrope">Controle de acesso, turnos e comunicação interna</p>
        </div>
        <button 
          onClick={() => setShowNewEmployeeModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span className="font-manrope">Novo Funcionário</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-manrope font-medium">12 total</span>
          </div>
          <h3 className="text-2xl font-manrope font-bold text-gray-900 dark:text-white mb-1">8</h3>
          <p className="text-gray-600 dark:text-gray-300 font-manrope text-sm">Online Agora</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-green-600 dark:text-green-400 text-sm font-manrope font-medium">98%</span>
          </div>
          <h3 className="text-2xl font-manrope font-bold text-gray-900 dark:text-white mb-1">7h 45m</h3>
          <p className="text-gray-600 dark:text-gray-300 font-manrope text-sm">Média Diária</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-purple-600 dark:text-purple-400 text-sm font-manrope font-medium">5 níveis</span>
          </div>
          <h3 className="text-2xl font-manrope font-bold text-gray-900 dark:text-white mb-1">Seguro</h3>
          <p className="text-gray-600 dark:text-gray-300 font-manrope text-sm">Controle Acesso</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-yellow-600 dark:text-yellow-400 text-sm font-manrope font-medium">24 hoje</span>
          </div>
          <h3 className="text-2xl font-manrope font-bold text-gray-900 dark:text-white mb-1">156</h3>
          <p className="text-gray-600 dark:text-gray-300 font-manrope text-sm">Mensagens</p>
        </div>
      </div>

      {/* Team List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-manrope font-bold text-gray-900 dark:text-white">Equipe Ativa</h3>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {employees.map((employee) => (
            <div key={employee.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-manrope font-bold text-sm">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="text-lg font-manrope font-bold text-gray-900">{employee.name}</h4>
                      <span className={`w-3 h-3 rounded-full ${
                        employee.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                      }`}></span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-manrope">{employee.role}</span>
                      <span className="font-manrope">Turno: {employee.shift}</span>
                      <span className="font-manrope">Nível: {employee.permissions}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => viewEmployeeDetails(employee)}
                    className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => editEmployee(employee)}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openEmployeeSettings(employee)}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    title="Configurações"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openEmployeeChat(employee)}
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    title="Enviar mensagem"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeEmployee(employee)}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-manrope font-bold text-gray-900 dark:text-white mb-4">Comunicação Interna</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-manrope font-medium text-gray-900 dark:text-white">Nova mensagem da cozinha</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-manrope">Pedido #1234 pronto para entrega</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Novo Funcionário */}
      {showNewEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-manrope font-bold text-primary">Novo Funcionário</h3>
                <button
                  onClick={() => setShowNewEmployeeModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Nome Completo</label>
                    <input
                      type="text"
                      value={newEmployeeForm.name}
                      onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Cargo</label>
                    <input
                      type="text"
                      value={newEmployeeForm.role}
                      onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, role: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Email</label>
                    <input
                      type="email"
                      value={newEmployeeForm.email}
                      onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={newEmployeeForm.phone}
                      onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Turno</label>
                    <select
                      value={newEmployeeForm.shift}
                      onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, shift: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-lg"
                    >
                      <option value="Manhã">Manhã</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Noite">Noite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Permissões</label>
                    <select
                      value={newEmployeeForm.permissions}
                      onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, permissions: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-lg"
                    >
                      <option value="waiter">Garçom</option>
                      <option value="kitchen">Cozinha</option>
                      <option value="admin">Administrador</option>
                      <option value="manager">Gerente</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Departamento</label>
                    <input
                      type="text"
                      value={newEmployeeForm.department}
                      onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, department: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Salário</label>
                    <input
                      type="number"
                      value={newEmployeeForm.salary}
                      onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, salary: e.target.value }))}
                      className="input-primary w-full px-4 py-3 rounded-lg"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Endereço</label>
                  <input
                    type="text"
                    value={newEmployeeForm.address}
                    onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, address: e.target.value }))}
                    className="input-primary w-full px-4 py-3 rounded-lg"
                    required
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-adaptive">
                  <button
                    type="button"
                    onClick={() => setShowNewEmployeeModal(false)}
                    className="btn-ghost px-4 py-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingEmployee}
                    className="btn-primary px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isAddingEmployee ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Cadastrando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Cadastrar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Configurações do Funcionário */}
      {showSettingsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-manrope font-bold text-primary">
                  Configurações - {selectedEmployee.name}
                </h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Horas de Trabalho</label>
                  <input
                    type="number"
                    value={settingsForm.workHours}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, workHours: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Tempo de Pausa (horas)</label>
                  <input
                    type="number"
                    value={settingsForm.breakTime}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, breakTime: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="0"
                    max="4"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settingsForm.overtimeAllowed}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, overtimeAllowed: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">Permitir horas extras</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settingsForm.autoSchedule}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, autoSchedule: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">Agendamento automático</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settingsForm.notifications}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, notifications: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">Notificações ativas</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSavingSettings ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Salvar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Enviar Mensagem */}
      {showMessageModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-manrope font-bold text-gray-900 dark:text-white">
                  Enviar Mensagem
                </h3>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Para</label>
                  <input
                    type="text"
                    value={messageRecipient}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Mensagem</label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={4}
                    placeholder="Digite sua mensagem..."
                    required
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingMessage || !messageText.trim()}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSendingMessage ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>Enviar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Detalhes do Funcionário */}
      {showEmployeeDetails && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-manrope font-bold text-gray-900 dark:text-white">
                  Detalhes do Funcionário
                </h3>
                <button
                  onClick={() => setShowEmployeeDetails(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-manrope font-bold text-2xl">
                      {selectedEmployee.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-manrope font-bold text-gray-900 dark:text-white">{selectedEmployee.name}</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-300">{selectedEmployee.role}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`w-3 h-3 rounded-full ${
                        selectedEmployee.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                      }`}></span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{selectedEmployee.status}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{selectedEmployee.address}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Turno: {selectedEmployee.shift}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Permissões: {selectedEmployee.permissions}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Admissão: {selectedEmployee.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Informações Adicionais</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Departamento:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{selectedEmployee.department}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Salário:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">R$ {selectedEmployee.salary}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Funcionário */}
      {showEditEmployeeModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-manrope font-bold text-gray-900 dark:text-white">
                  Editar Funcionário - {selectedEmployee.name}
                </h3>
                <button
                  onClick={() => setShowEditEmployeeModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveEditEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Nome Completo</label>
                    <input
                      type="text"
                      value={editEmployeeForm.name}
                      onChange={(e) => setEditEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Cargo</label>
                    <input
                      type="text"
                      value={editEmployeeForm.role}
                      onChange={(e) => setEditEmployeeForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Email</label>
                    <input
                      type="email"
                      value={editEmployeeForm.email}
                      onChange={(e) => setEditEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={editEmployeeForm.phone}
                      onChange={(e) => setEditEmployeeForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Turno</label>
                    <select
                      value={editEmployeeForm.shift}
                      onChange={(e) => setEditEmployeeForm(prev => ({ ...prev, shift: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Manhã">Manhã</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Noite">Noite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Permissões</label>
                    <select
                      value={editEmployeeForm.permissions}
                      onChange={(e) => setEditEmployeeForm(prev => ({ ...prev, permissions: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="waiter">Garçom</option>
                      <option value="kitchen">Cozinha</option>
                      <option value="admin">Administrador</option>
                      <option value="manager">Gerente</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Departamento</label>
                    <input
                      type="text"
                      value={editEmployeeForm.department}
                      onChange={(e) => setEditEmployeeForm(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Salário</label>
                    <input
                      type="number"
                      value={editEmployeeForm.salary}
                      onChange={(e) => setEditEmployeeForm(prev => ({ ...prev, salary: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Endereço</label>
                  <input
                    type="text"
                    value={editEmployeeForm.address}
                    onChange={(e) => setEditEmployeeForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={() => setShowEditEmployeeModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isEditingEmployee}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isEditingEmployee ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Salvar Edição</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}