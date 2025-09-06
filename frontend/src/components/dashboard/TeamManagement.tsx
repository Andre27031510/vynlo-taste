'use client'

import { useState, useRef } from 'react'
import FocusLock from 'react-focus-lock'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save,
  UserCheck,
  UserX,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  permissions: string[]
}

export default function TeamManagement() {
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    permissions: [] as string[]
  })

  const modalRef = useRef<HTMLDivElement>(null)

  // Dados de exemplo
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@vynlotaste.com',
      role: 'Gerente',
      status: 'active',
      permissions: ['orders', 'menu', 'reports']
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@vynlotaste.com',
      role: 'Atendente',
      status: 'active',
      permissions: ['orders', 'clients']
    }
  ])

  // Gerenciamento de modal com focus trap
  const openModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member)
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        permissions: member.permissions
      })
    } else {
      setEditingMember(null)
      setFormData({ name: '', email: '', role: '', permissions: [] })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingMember(null)
    setFormData({ name: '', email: '', role: '', permissions: [] })
  }

  // Navegação por teclado no modal
  const handleModalKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }

  const handleSave = () => {
    // Lógica de salvamento aqui
    closeModal()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Equipe</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie membros da equipe e permissões</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Adicionar novo membro da equipe"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Membro</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{member.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {member.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                  
                  <button
                    onClick={() => openModal(member)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label={`Editar ${member.name}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {/* Lógica de exclusão */}}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                    aria-label={`Remover ${member.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal com Focus Trap */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onKeyDown={handleModalKeyDown}
        >
          <FocusLock>
            <div 
              ref={modalRef}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingMember ? 'Editar Membro' : 'Adicionar Membro'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label htmlFor="member-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  <input
                    id="member-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Digite o nome completo"
                    required
                    aria-describedby="name-help"
                  />
                  <div id="name-help" className="sr-only">
                    Digite o nome completo do membro da equipe
                  </div>
                </div>

                <div>
                  <label htmlFor="member-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    id="member-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="email@exemplo.com"
                    required
                    aria-describedby="email-help"
                  />
                  <div id="email-help" className="sr-only">
                    Digite o endereço de email do membro
                  </div>
                </div>

                <div>
                  <label htmlFor="member-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cargo
                  </label>
                  <select
                    id="member-role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                    aria-describedby="role-help"
                  >
                    <option value="">Selecione um cargo</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Atendente">Atendente</option>
                    <option value="Cozinheiro">Cozinheiro</option>
                    <option value="Entregador">Entregador</option>
                  </select>
                  <div id="role-help" className="sr-only">
                    Selecione o cargo do membro na equipe
                  </div>
                </div>

                <div>
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Permissões
                    </legend>
                    <div className="space-y-2">
                      {['orders', 'menu', 'clients', 'reports', 'settings'].map((permission) => (
                        <label key={permission} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  permissions: [...prev.permissions, permission] 
                                }))
                              } else {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  permissions: prev.permissions.filter(p => p !== permission) 
                                }))
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-2"
                            aria-describedby={`${permission}-help`}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                            {permission === 'orders' ? 'Pedidos' : 
                             permission === 'menu' ? 'Cardápio' :
                             permission === 'clients' ? 'Clientes' :
                             permission === 'reports' ? 'Relatórios' : 'Configurações'}
                          </span>
                          <div id={`${permission}-help`} className="sr-only">
                            Permissão para acessar {permission}
                          </div>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <button
                  onClick={closeModal}
                  className="w-full sm:w-auto px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded order-2 sm:order-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-1 sm:order-2"
                  aria-label={editingMember ? 'Salvar alterações do membro' : 'Adicionar novo membro'}
                >
                  <Save className="w-4 h-4" />
                  <span>{editingMember ? 'Salvar' : 'Adicionar'}</span>
                </button>
              </div>
            </div>
          </FocusLock>
        </div>
      )}
    </div>
  )
}