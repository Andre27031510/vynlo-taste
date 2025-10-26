'use client'
// v2.2.0 - Modal de Equipe Profissionalizado
// Modified: 2025-10-25 | Modal totalmente funcional com UX profissional
// CRITICAL: Team management com validação avançada e feedback visual
// Deploy: 2025-10-25

import { useState, useRef, useEffect } from 'react'
import FocusLock from 'react-focus-lock'
import { useTeamQuery, useCreateTeamMemberMutation, useUpdateTeamMemberMutation, useDeleteTeamMemberMutation, type TeamMember } from '@/hooks/useTeamQuery'
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
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  User,
  Briefcase,
  Key
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function TeamManagement() {
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    permissions: [] as string[]
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)

  // ✅ DEBUG: Monitorar estado do modal
  useEffect(() => {
    console.log('🔍 DEBUG: showModal mudou para:', showModal)
  }, [showModal])

  // ✅ Usando React Query - dados reais da API
  const { data: teamData, isLoading } = useTeamQuery({ limit: 100 })
  const teamMembers = teamData?.members ?? []
  
  // ✅ Mutations React Query
  const createMutation = useCreateTeamMemberMutation()
  const updateMutation = useUpdateTeamMemberMutation()
  const deleteMutation = useDeleteTeamMemberMutation()

  // ✅ Validação de formulário
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email deve ter formato válido'
    }
    
    if (!formData.role) {
      errors.role = 'Cargo é obrigatório'
    }
    
    if (!editingMember && !formData.password.trim()) {
      errors.password = 'Senha é obrigatória para novos membros'
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ✅ Gerenciamento de modal profissionalizado
  const openModal = (member?: TeamMember) => {
    console.log('🔍 DEBUG: openModal chamado com member:', member)
    if (member) {
      setEditingMember(member)
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        password: '',
        permissions: member.permissions || []
      })
    } else {
      setEditingMember(null)
      setFormData({ name: '', email: '', role: '', password: '', permissions: [] })
    }
    setFormErrors({})
    setShowPassword(false)
    setIsSubmitting(false)
    console.log('🔍 DEBUG: setShowModal(true) sendo chamado')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingMember(null)
    setFormData({ name: '', email: '', role: '', password: '', permissions: [] })
    setFormErrors({})
    setShowPassword(false)
    setIsSubmitting(false)
  }

  // Navegação por teclado no modal
  const handleModalKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }

  // ✅ Submit profissionalizado com validação e feedback
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário')
      return
    }

    setIsSubmitting(true)
    
    try {
      if (editingMember) {
        // Atualizar membro existente
        await updateMutation.mutateAsync({
          id: editingMember.id,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: 'active',
          permissions: formData.permissions
        })
        toast.success('✅ Membro da equipe atualizado com sucesso!')
      } else {
        // Criar novo membro
        await createMutation.mutateAsync({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
          permissions: formData.permissions
        })
        toast.success('✅ Novo membro da equipe criado com sucesso!')
      }
      closeModal()
    } catch (error: any) {
      console.error('Erro ao salvar membro:', error)
      toast.error(`❌ Erro: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDelete = async (memberId: string) => {
    if (!confirm('Tem certeza que deseja remover este membro da equipe?')) {
      return
    }

    try {
      await deleteMutation.mutateAsync(memberId)
      toast.success('✅ Membro da equipe removido com sucesso!')
    } catch (error: any) {
      console.error('Erro ao deletar membro:', error)
      toast.error(`❌ Erro: ${error.message || 'Erro desconhecido'}`)
    }
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
                    onClick={() => handleDelete(member.id)}
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
              <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
                {/* Nome Completo */}
                <div>
                  <label htmlFor="member-name" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Nome Completo
                  </label>
                  <div className="relative">
                    <input
                      id="member-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, name: e.target.value }))
                        if (formErrors.name) {
                          setFormErrors(prev => ({ ...prev, name: '' }))
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                        formErrors.name 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Digite o nome completo"
                      required
                      aria-describedby="name-help name-error"
                    />
                    {formData.name && !formErrors.name && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {formErrors.name && (
                    <div id="name-error" className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.name}
                    </div>
                  )}
                  <div id="name-help" className="sr-only">
                    Digite o nome completo do membro da equipe
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="member-email" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="member-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, email: e.target.value }))
                        if (formErrors.email) {
                          setFormErrors(prev => ({ ...prev, email: '' }))
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                        formErrors.email 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="email@exemplo.com"
                      required
                      aria-describedby="email-help email-error"
                    />
                    {formData.email && !formErrors.email && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {formErrors.email && (
                    <div id="email-error" className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.email}
                    </div>
                  )}
                  <div id="email-help" className="sr-only">
                    Digite o endereço de email do membro
                  </div>
                </div>

                {/* Cargo */}
                <div>
                  <label htmlFor="member-role" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Cargo
                  </label>
                  <div className="relative">
                    <select
                      id="member-role"
                      value={formData.role}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, role: e.target.value }))
                        if (formErrors.role) {
                          setFormErrors(prev => ({ ...prev, role: '' }))
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                        formErrors.role 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                      aria-describedby="role-help role-error"
                    >
                      <option value="">Selecione um cargo</option>
                      <option value="MANAGER">Gerente</option>
                      <option value="STAFF">Atendente</option>
                      <option value="COOK">Cozinheiro</option>
                      <option value="DELIVERY">Entregador</option>
                    </select>
                    {formData.role && !formErrors.role && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {formErrors.role && (
                    <div id="role-error" className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.role}
                    </div>
                  )}
                  <div id="role-help" className="sr-only">
                    Selecione o cargo do membro na equipe
                  </div>
                </div>

                {/* Senha (apenas para novos membros) */}
                {!editingMember && (
                  <div>
                    <label htmlFor="member-password" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Key className="w-4 h-4 mr-2" />
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        id="member-password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, password: e.target.value }))
                          if (formErrors.password) {
                            setFormErrors(prev => ({ ...prev, password: '' }))
                          }
                        }}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                          formErrors.password 
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Digite uma senha segura"
                        required
                        aria-describedby="password-help password-error"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <div id="password-error" className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.password}
                      </div>
                    )}
                    <div id="password-help" className="sr-only">
                      Digite uma senha segura para o membro da equipe
                    </div>
                  </div>
                )}

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
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={editingMember ? 'Salvar alterações do membro' : 'Adicionar novo membro'}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingMember ? 'Salvar' : 'Adicionar'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </FocusLock>
        </div>
      )}
    </div>
  )
}
// Modified: 2025-10-11-v9 | Team management API integrated