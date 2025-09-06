'use client'

import React, { memo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Tipos para campos dinâmicos
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'date' | 'password'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: yup.Schema
  gridCols?: 1 | 2
  rows?: number
}

export interface GenericFormProps {
  fields: FormField[]
  onSubmit: (data: any) => void
  defaultValues?: Record<string, any>
  isLoading?: boolean
  className?: string
}

/**
 * Formulário genérico com React Hook Form e Yup
 * Suporta campos dinâmicos e validação automática
 */
const GenericForm: React.FC<GenericFormProps> = memo(({
  fields,
  onSubmit,
  defaultValues = {},
  isLoading = false,
  className = ''
}) => {
  // Criar schema de validação dinâmico
  const createValidationSchema = () => {
    const schemaFields: Record<string, yup.Schema> = {}
    
    fields.forEach(field => {
      let fieldSchema: yup.Schema

      switch (field.type) {
        case 'email':
          fieldSchema = yup.string().email('Email inválido')
          break
        case 'number':
          fieldSchema = yup.number().typeError('Deve ser um número')
          break
        case 'tel':
          fieldSchema = yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido')
          break
        default:
          fieldSchema = yup.string()
      }

      if (field.required) {
        fieldSchema = fieldSchema.required(`${field.label} é obrigatório`)
      }

      // Aplicar validação customizada se fornecida
      if (field.validation) {
        fieldSchema = field.validation
      }

      schemaFields[field.name] = fieldSchema
    })

    return yup.object().shape(schemaFields)
  }

  const validationSchema = createValidationSchema()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues
  })

  // Máscara para telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        .replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const renderField = (field: FormField) => {
    const fieldError = errors[field.name]
    const errorMessage = fieldError?.message as string

    const baseInputClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
      errorMessage 
        ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
    } text-gray-900 dark:text-white`

    switch (field.type) {
      case 'select':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <select
                value={value || ''}
                onChange={onChange}
                className={baseInputClasses}
              >
                <option value="">Selecione uma opção</option>
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
        )

      case 'textarea':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <textarea
                value={value || ''}
                onChange={onChange}
                placeholder={field.placeholder}
                rows={field.rows || 4}
                className={baseInputClasses}
              />
            )}
          />
        )

      case 'tel':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                type="tel"
                value={value || ''}
                onChange={(e) => onChange(formatPhone(e.target.value))}
                placeholder={field.placeholder}
                className={baseInputClasses}
              />
            )}
          />
        )

      default:
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                type={field.type}
                value={value || ''}
                onChange={onChange}
                placeholder={field.placeholder}
                step={field.type === 'number' ? '0.01' : undefined}
                className={baseInputClasses}
              />
            )}
          />
        )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="space-y-4">
        {fields.map((field) => (
          <div 
            key={field.name} 
            className={field.gridCols === 1 ? 'col-span-full' : ''}
          >
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {renderField(field)}
            
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        ))}
      </div>
    </form>
  )
})

GenericForm.displayName = 'GenericForm'

export default GenericForm