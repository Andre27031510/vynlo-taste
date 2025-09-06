'use client'

import React, { memo } from 'react'
import { X } from 'lucide-react'

// Tipos para o modal genérico
export interface GenericModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  type: 'add' | 'edit' | 'delete' | 'view'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  onSubmit?: () => void
  isLoading?: boolean
  submitText?: string
  cancelText?: string
  showFooter?: boolean
}

/**
 * Modal genérico reutilizável para operações CRUD
 * Substitui modais repetitivos com transições suaves
 */
const GenericModal: React.FC<GenericModalProps> = memo(({
  isOpen,
  onClose,
  title,
  type,
  size = 'md',
  children,
  onSubmit,
  isLoading = false,
  submitText,
  cancelText = 'Cancelar',
  showFooter = true
}) => {
  if (!isOpen) return null

  // Configurações de tamanho do modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  // Configurações por tipo de modal
  const typeConfig = {
    add: {
      defaultSubmitText: 'Criar',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    edit: {
      defaultSubmitText: 'Atualizar',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    delete: {
      defaultSubmitText: 'Excluir',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    view: {
      defaultSubmitText: 'Fechar',
      buttonColor: 'bg-gray-600 hover:bg-gray-700'
    }
  }

  const config = typeConfig[type]
  const finalSubmitText = submitText || config.defaultSubmitText

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-manrope font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            {children}
          </div>

          {/* Footer */}
          {showFooter && (
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
              >
                {cancelText}
              </button>
              {onSubmit && (
                <button
                  onClick={onSubmit}
                  disabled={isLoading}
                  className={`px-6 py-2 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${config.buttonColor}`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <span>{finalSubmitText}</span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

GenericModal.displayName = 'GenericModal'

export default GenericModal