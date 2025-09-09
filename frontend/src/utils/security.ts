import DOMPurify from 'dompurify';

// Security utilities using DOMPurify (already installed)
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Use DOMPurify for professional sanitization
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

export const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'span'],
    ALLOWED_ATTR: ['class'],
    FORBID_SCRIPTS: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input']
  });
};

export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  
  // Allow only safe protocols
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  
  try {
    const urlObj = new URL(url, window.location.origin);
    if (allowedProtocols.includes(urlObj.protocol)) {
      return DOMPurify.sanitize(urlObj.href);
    }
  } catch {
    // If URL parsing fails, treat as relative path
    if (url.startsWith('/') || url.startsWith('#')) {
      return sanitizeInput(url);
    }
  }
  
  return '';
};

export const validateProps = (props: any): boolean => {
  if (!props || typeof props !== 'object') return false;
  
  // Check for potentially dangerous properties
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  for (const key of Object.keys(props)) {
    if (dangerousKeys.includes(key)) return false;
    if (typeof props[key] === 'string' && props[key].includes('<script')) return false;
  }
  
  return true;
};

export const createSafeHTML = (html: string): { __html: string } => {
  return { __html: sanitizeHTML(html) };
};