import DOMPurify from 'dompurify';

/**
 * Utilitários de segurança para sanitização e validação
 */

// Configurações padrão do DOMPurify
const DEFAULT_PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'em', 'br', 'a', 'ul', 'ol', 'li'
  ],
  ALLOWED_ATTR: ['style', 'class', 'href', 'target'],
  KEEP_CONTENT: true,
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe'],
  FORBID_ATTR: [
    'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 
    'onblur', 'onchange', 'onsubmit', 'javascript:'
  ]
};

/**
 * Sanitiza texto simples removendo caracteres perigosos
 */
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Sanitiza HTML usando DOMPurify (client-side) ou sanitização básica (server-side)
 */
export const sanitizeHTML = (
  html: string, 
  config: Partial<typeof DEFAULT_PURIFY_CONFIG> = {}
): string => {
  if (typeof html !== 'string') return '';
  
  // Server-side: sanitização básica
  if (typeof window === 'undefined') {
    return sanitizeText(html);
  }
  
  // Client-side: usar DOMPurify
  const purifyConfig = { ...DEFAULT_PURIFY_CONFIG, ...config };
  return DOMPurify.sanitize(html, purifyConfig);
};

/**
 * Valida e sanitiza URL para prevenir javascript: e data: URLs maliciosos
 */
export const sanitizeURL = (url: string): string => {
  if (typeof url !== 'string') return '';
  
  const trimmedUrl = url.trim();
  
  // Bloquear URLs perigosos
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = trimmedUrl.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '#';
    }
  }
  
  // Permitir URLs relativos e absolutos seguros
  if (trimmedUrl.startsWith('/') || 
      trimmedUrl.startsWith('http://') || 
      trimmedUrl.startsWith('https://') ||
      trimmedUrl.startsWith('mailto:') ||
      trimmedUrl.startsWith('tel:')) {
    return trimmedUrl;
  }
  
  // Para outros casos, adicionar protocolo seguro se necessário
  if (trimmedUrl.includes('.') && !trimmedUrl.includes(' ')) {
    return `https://${trimmedUrl}`;
  }
  
  return '#';
};

/**
 * Valida email usando regex seguro
 */
export const validateEmail = (email: string): boolean => {
  if (typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Sanitiza dados de formulário
 */
export const sanitizeFormData = (data: Record<string, any>): Record<string, string> => {
  const sanitized: Record<string, string> = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (value !== null && value !== undefined) {
      sanitized[key] = sanitizeText(String(value));
    } else {
      sanitized[key] = '';
    }
  });
  
  return sanitized;
};

export default {
  sanitizeText,
  sanitizeHTML,
  sanitizeURL,
  validateEmail,
  sanitizeFormData
};