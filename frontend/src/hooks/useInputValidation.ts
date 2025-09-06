import { useState, useCallback } from 'react';
import DOMPurify from 'dompurify';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue: string;
}

export const useInputValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função para sanitizar entrada do usuário
  const sanitizeInput = useCallback((value: string): string => {
    if (typeof value !== 'string') return '';
    
    // Sanitização básica para prevenir XSS
    const sanitized = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;')
      .trim();
    
    // Usar DOMPurify se disponível no cliente
    if (typeof window !== 'undefined') {
      return DOMPurify.sanitize(sanitized, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true
      });
    }
    
    return sanitized;
  }, []);

  // Função para validar entrada
  const validateInput = useCallback((
    fieldName: string,
    value: string,
    rules: ValidationRules = {}
  ): ValidationResult => {
    const sanitizedValue = sanitizeInput(value);
    
    // Validação obrigatória
    if (rules.required && !sanitizedValue.trim()) {
      return {
        isValid: false,
        error: 'Este campo é obrigatório',
        sanitizedValue
      };
    }

    // Validação de comprimento mínimo
    if (rules.minLength && sanitizedValue.length < rules.minLength) {
      return {
        isValid: false,
        error: `Mínimo de ${rules.minLength} caracteres`,
        sanitizedValue
      };
    }

    // Validação de comprimento máximo
    if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
      return {
        isValid: false,
        error: `Máximo de ${rules.maxLength} caracteres`,
        sanitizedValue
      };
    }

    // Validação de padrão
    if (rules.pattern && !rules.pattern.test(sanitizedValue)) {
      return {
        isValid: false,
        error: 'Formato inválido',
        sanitizedValue
      };
    }

    // Validação de email
    if (rules.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(sanitizedValue)) {
        return {
          isValid: false,
          error: 'Email inválido',
          sanitizedValue
        };
      }
    }

    // Validação de telefone
    if (rules.phone) {
      const phonePattern = /^[\d\s\-\(\)\+]{10,}$/;
      if (!phonePattern.test(sanitizedValue)) {
        return {
          isValid: false,
          error: 'Telefone inválido',
          sanitizedValue
        };
      }
    }

    return {
      isValid: true,
      sanitizedValue
    };
  }, [sanitizeInput]);

  // Função para validar formulário completo
  const validateForm = useCallback((
    formData: Record<string, string>,
    validationRules: Record<string, ValidationRules>
  ): { isValid: boolean; sanitizedData: Record<string, string> } => {
    const newErrors: Record<string, string> = {};
    const sanitizedData: Record<string, string> = {};
    let isFormValid = true;

    Object.keys(formData).forEach(fieldName => {
      const rules = validationRules[fieldName] || {};
      const result = validateInput(fieldName, formData[fieldName], rules);
      
      sanitizedData[fieldName] = result.sanitizedValue;
      
      if (!result.isValid) {
        newErrors[fieldName] = result.error || 'Erro de validação';
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    
    return {
      isValid: isFormValid,
      sanitizedData
    };
  }, [validateInput]);

  // Limpar erros
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Limpar erro específico
  const clearError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    sanitizeInput,
    validateInput,
    validateForm,
    clearErrors,
    clearError
  };
};

export default useInputValidation;