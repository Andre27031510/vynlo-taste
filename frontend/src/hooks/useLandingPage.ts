import { useState, useEffect, useCallback, useRef } from 'react';
import DOMPurify from 'dompurify';
import { logger } from '../utils/logger';

export const useLandingPage = () => {
  const [segmentContent, setSegmentContent] = useState<string>('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Error handler
  const handleError = useCallback((error: Error, context: string) => {
    logger.error(`Error in ${context}`, error);
    setError(`Erro em ${context}: ${error.message}`);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Função para sanitizar texto
  const sanitizeText = useCallback((text: string): string => {
    if (typeof text !== 'string') return '';
    
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;')
      .trim();
  }, []);

  // Função para sanitizar HTML com DOMPurify
  const sanitizeHTML = useCallback((html: string): string => {
    if (typeof window !== 'undefined' && html) {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['div', 'span', 'p', 'strong', 'em', 'br'],
        ALLOWED_ATTR: ['style', 'class'],
        KEEP_CONTENT: true
      });
    }
    return sanitizeText(html);
  }, [sanitizeText]);

  // Controle do carrossel com tratamento de erro
  const goToSlide = useCallback((index: number) => {
    try {
      if (index < 0 || index > 2) {
        throw new Error(`Invalid slide index: ${index}`);
      }
      setCurrentSlide(index);
      logger.userInteraction('slide_change', `slide_${index}`);
    } catch (error) {
      handleError(error as Error, 'goToSlide');
    }
  }, [handleError]);

  const nextSlide = useCallback(() => {
    try {
      setCurrentSlide(prev => (prev + 1) % 3);
      logger.userInteraction('next_slide');
    } catch (error) {
      handleError(error as Error, 'nextSlide');
    }
  }, [handleError]);

  // Controle dos segmentos com tratamento de erro
  const nextSegment = useCallback(() => {
    try {
      setCurrentSegmentIndex(prev => prev + 1);
      logger.userInteraction('next_segment');
    } catch (error) {
      handleError(error as Error, 'nextSegment');
    }
  }, [handleError]);

  const previousSegment = useCallback(() => {
    try {
      setCurrentSegmentIndex(prev => Math.max(0, prev - 1));
      logger.userInteraction('previous_segment');
    } catch (error) {
      handleError(error as Error, 'previousSegment');
    }
  }, [handleError]);

  // Função para mostrar aba do segmento com tratamento de erro
  const showSegmentTab = useCallback((segment: string) => {
    try {
      setIsLoading(true);
      clearError();
    const segments = {
      taste: {
        title: 'Vynlo Taste',
        subtitle: 'Sistema Completo para Restaurantes',
        description: 'Plataforma premium para o setor gastronômico com gestão integrada de pedidos, estoque, finanças e delivery. Mais de 2.500 restaurantes já aumentaram suas vendas em 150% com nossa solução.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        status: 'Disponível',
        statusColor: '#22c55e',
        metrics: { clients: '2.500+', growth: '+150%', satisfaction: '98%', roi: '300%' },
        features: [
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 12l2 2 4-4"/></svg>', title: 'Pedidos Integrados', desc: 'Balcão, delivery e WhatsApp em uma plataforma unificada' },
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 3v18h18"/></svg>', title: 'Gestão Inteligente', desc: 'Controle de estoque com IA e alertas automáticos' }
        ],
        link: true
      }
    };

    const info = segments[segment as keyof typeof segments];
    if (!info) return;

    const cardHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;">
        <div>
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <div style="width: 80px; height: 80px; background: ${info.gradient}; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
              ${info.icon}
            </div>
            <div>
              <h3 style="color: #ffffff; font-size: 2rem; font-weight: 800; margin: 0; font-family: Manrope, sans-serif;">${sanitizeText(info.title)}</h3>
              <p style="color: #94a3b8; font-size: 1.125rem; margin: 4px 0 0 0; font-family: Manrope, sans-serif;">${sanitizeText(info.subtitle)}</p>
            </div>
          </div>
          <p style="color: #cbd5e1; font-size: 1.125rem; line-height: 1.7; margin-bottom: 24px; font-family: Manrope, sans-serif;">${sanitizeText(info.description)}</p>
        </div>
      </div>
    `;

      if (typeof window !== 'undefined') {
        const sanitizedHTML = DOMPurify.sanitize(cardHTML, {
          ALLOWED_TAGS: ['div', 'h3', 'h4', 'h5', 'p', 'svg', 'path', 'a', 'strong'],
          ALLOWED_ATTR: ['style', 'href', 'class', 'id', 'viewBox', 'fill', 'stroke', 'stroke-width', 'width', 'height', 'd'],
          KEEP_CONTENT: true,
          FORBID_ATTR: ['onclick', 'onmouseover', 'onmouseout', 'onerror', 'onload']
        });
        setSegmentContent(sanitizedHTML);
        logger.userInteraction('segment_tab_change', segment);
      }
    } catch (error) {
      handleError(error as Error, 'showSegmentTab');
    } finally {
      setIsLoading(false);
    }
  }, [sanitizeText, handleError, clearError]);

  // FAQ toggle com tratamento de erro
  const toggleFaqNew = useCallback((index: number) => {
    try {
      if (typeof window !== 'undefined') {
        const content = document.querySelector<HTMLElement>(`#faq-content-new-${index}`);
        const icon = document.querySelector<HTMLElement>(`#faq-icon-new-${index}`);
        
        if (!content || !icon) {
          logger.warn('FAQ elements not found', { index });
          return;
        }
        
        try {
          const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
          if (isOpen) {
            content.style.maxHeight = '0px';
            content.style.paddingTop = '0px';
            icon.style.transform = 'rotate(0deg)';
          } else {
            content.style.maxHeight = `${content.scrollHeight + 32}px`;
            content.style.paddingTop = '16px';
            icon.style.transform = 'rotate(45deg)';
          }
          
          logger.userInteraction('faq_toggle', `faq_${index}`);
        } catch (domError) {
          handleError(domError as Error, 'faq_dom_manipulation');
        }
      }
    } catch (error) {
      handleError(error as Error, 'toggleFaqNew');
    }
  }, [handleError]);

  // Auto-play do carrossel com cleanup
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        intervalRef.current = setInterval(nextSlide, 4000);
        logger.debug('Carousel auto-play started');
      }
      
      return () => {
        try {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            logger.debug('Carousel auto-play stopped');
          }
        } catch (error) {
          handleError(error as Error, 'carousel_cleanup');
        }
      };
    } catch (error) {
      handleError(error as Error, 'carousel_autoplay');
    }
  }, [nextSlide, handleError]);

  // Inicializar primeira aba com tratamento de erro
  useEffect(() => {
    try {
      showSegmentTab('taste');
      logger.componentMount('LandingPage');
    } catch (error) {
      handleError(error as Error, 'initialization');
    }
  }, [showSegmentTab, handleError]);

  return {
    segmentContent,
    currentSlide,
    currentSegmentIndex,
    isLoading,
    error,
    goToSlide,
    nextSlide,
    nextSegment,
    previousSegment,
    showSegmentTab,
    toggleFaqNew,
    sanitizeText,
    sanitizeHTML,
    clearError
  };
};