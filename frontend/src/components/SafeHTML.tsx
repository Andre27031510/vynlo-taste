import React from 'react';
import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Componente para renderização segura de HTML com sanitização DOMPurify
 * Previne ataques XSS sanitizando o conteúdo HTML antes da renderização
 */
const SafeHTML: React.FC<SafeHTMLProps> = ({
  html,
  allowedTags = [
    'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'em', 'br', 'a', 'ul', 'ol', 'li', 'img'
  ],
  allowedAttributes = [
    'style', 'class', 'href', 'src', 'alt', 'title', 'target'
  ],
  className,
  style
}) => {
  // Função para sanitizar HTML
  const getSanitizedHTML = (): { __html: string } => {
    if (typeof window === 'undefined') {
      // Server-side: sanitização básica
      const basicSanitized = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      return { __html: basicSanitized };
    }

    // Client-side: usar DOMPurify
    const sanitizedHTML = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      KEEP_CONTENT: true,
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
    });

    return { __html: sanitizedHTML };
  };

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={getSanitizedHTML()}
    />
  );
};

export default SafeHTML;