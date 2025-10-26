'use client'
// v1.0.0 - Modal de Perfil do Usuário Profissional
// Created: 2025-10-25
// Professional, fully functional profile editing modal

import { useState, useRef, useEffect } from 'react'
import FocusLock from 'react-focus-lock'
import {
  X,
  Camera,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  Trash2
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useThemeContext } from '@/contexts/ThemeContext'
import { apiRequest } from '@/services/api'
import { useUserProfile } from '@/hooks/useUserProfile'
import toast from 'react-hot-toast'
import { getAuthInstance } from '@/config/firebase'
import { signOut, updatePassword } from 'firebase/auth'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user } = useAuth()
  const { profile: userProfile } = useUserProfile()
  const { currentTheme } = useThemeContext()
  const modalRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados do formulário
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: ''
  })

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Carregar dados do usuário
  useEffect(() => {
    if (userProfile && isOpen) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || user?.email || '',
        phone: userProfile.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profileImage: userProfile.profileImage || user?.photoURL || ''
      })
      setPreviewImage(userProfile.profileImage || user?.photoURL || null)
    }
  }, [userProfile, user, isOpen])

  // Fechar modal com ESC
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Fechar modal ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida')
        return
      }

      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB')
        return
      }

      // Criar preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfileImage = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validações
      if (activeTab === 'password') {
        if (!formData.currentPassword) {
          toast.error('Senha atual é obrigatória')
          setIsSubmitting(false)
          return
        }

        if (formData.newPassword && formData.newPassword.length < 6) {
          toast.error('A nova senha deve ter no mínimo 6 caracteres')
          setIsSubmitting(false)
          return
        }

        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('As senhas não coincidem')
          setIsSubmitting(false)
          return
        }
      }

      if (activeTab === 'profile') {
        if (!formData.firstName || !formData.lastName) {
          toast.error('Nome completo é obrigatório')
          setIsSubmitting(false)
          return
        }

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
          toast.error('Email inválido')
          setIsSubmitting(false)
          return
        }
      }

      // Preparar dados para envio
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      }

      // ✅ CORREÇÃO: Separar lógica de atualização de perfil e senha
      if (activeTab === 'password') {
        // Alterar senha no Firebase
        try {
          const authInstance = getAuthInstance()
          if (!authInstance || !authInstance.currentUser) {
            throw new Error('Usuário não autenticado')
          }

          await updatePassword(authInstance.currentUser, formData.newPassword)
          toast.success('✅ Senha alterada com sucesso! Faça login novamente.')
          
          // Logout após alterar senha
          await signOut(authInstance)
          
          // Limpar formulário
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }))
          
          setIsSubmitting(false)
          onClose()
          
          // Redirecionar para login
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
          
          return
        } catch (error: any) {
          console.error('Erro ao alterar senha:', error)
          toast.error(error.message || 'Erro ao alterar senha')
          setIsSubmitting(false)
          return
        }
      }

      // ✅ CORREÇÃO: Usar endpoint correto com ID do usuário
      const userId = userProfile?.id || user?.uid
      if (!userId) {
        toast.error('ID do usuário não encontrado')
        setIsSubmitting(false)
        return
      }

      // Enviar para API
      const response = await apiRequest('core-service', `v1/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro ao atualizar perfil' }))
        throw new Error(error.message || 'Erro ao atualizar perfil')
      }

      toast.success('✅ Perfil atualizado com sucesso!')

    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error(error.message || 'Erro ao atualizar perfil')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <FocusLock>
        <div
          ref={modalRef}
          className={`w-full max-w-2xl rounded-lg shadow-xl transition-all duration-300 ${
            currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 id="modal-title" className={`text-xl font-semibold ${
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Editar Perfil
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                currentTheme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className={`flex border-b ${
            currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? currentTheme === 'dark'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-blue-600 border-b-2 border-blue-600'
                  : currentTheme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'password'
                  ? currentTheme === 'dark'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-blue-600 border-b-2 border-blue-600'
                  : currentTheme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Senha
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === 'profile' ? (
              <div className="space-y-4">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`absolute bottom-0 right-0 p-2 rounded-full ${
                        currentTheme === 'dark' ? 'bg-gray-700' : 'bg-white'
                      } shadow-lg border-2 border-blue-500 hover:bg-blue-500 transition-colors`}
                    >
                      <Camera className="w-4 h-4 text-blue-500" />
                    </button>
                    {previewImage && (
                      <button
                        type="button"
                        onClick={removeProfileImage}
                        className={`absolute top-0 right-0 p-2 rounded-full ${
                          currentTheme === 'dark' ? 'bg-gray-700' : 'bg-white'
                        } shadow-lg border-2 border-red-500 hover:bg-red-500 transition-colors`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className={`text-sm ${
                    currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Clique para alterar foto de perfil
                  </p>
                </div>

                {/* First Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Nome *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        currentTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Sobrenome *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        currentTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        currentTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        currentTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Senha Atual *
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        currentTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 ${
                        currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Nova Senha
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        currentTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 ${
                        currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        currentTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Confirme a nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 ${
                        currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className={`flex items-center justify-end space-x-3 mt-6 pt-6 border-t ${
              currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentTheme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </FocusLock>
    </div>
  )
}

