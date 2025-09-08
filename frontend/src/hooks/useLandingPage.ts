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
  const segmentKeys = ['taste', 'bot', 'ekklesia', 'barber', 'pet', 'edu', 'field', 'health'];
  
  const nextSegment = useCallback(() => {
    try {
      const nextIndex = (currentSegmentIndex + 1) % segmentKeys.length;
      setCurrentSegmentIndex(nextIndex);
      logger.userInteraction('next_segment', segmentKeys[nextIndex]);
    } catch (error) {
      handleError(error as Error, 'nextSegment');
    }
  }, [currentSegmentIndex, segmentKeys, handleError]);

  const previousSegment = useCallback(() => {
    try {
      const prevIndex = currentSegmentIndex === 0 ? segmentKeys.length - 1 : currentSegmentIndex - 1;
      setCurrentSegmentIndex(prevIndex);
      logger.userInteraction('previous_segment', segmentKeys[prevIndex]);
    } catch (error) {
      handleError(error as Error, 'previousSegment');
    }
  }, [currentSegmentIndex, segmentKeys, handleError]);

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
      },
      bot: {
        title: 'Vynlo Bot',
        subtitle: 'Inteligência Artificial Avançada',
        description: 'Assistente virtual inteligente com IA generativa para automatizar atendimento, vendas e suporte. Integração com WhatsApp, chatbots e análise preditiva de comportamento do cliente.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        status: 'Em Desenvolvimento',
        statusColor: '#3b82f6',
        metrics: { accuracy: '95%', response: '< 2s', languages: '12+', integrations: '50+' },
        features: [
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', title: 'Chat Inteligente', desc: 'Conversas naturais com IA generativa avançada' },
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 19c-5 0-8-3-8-8s3-8 8-8 8 3 8 8-3 8-8 8z"/><path d="M17 17l4 4"/></svg>', title: 'Análise Preditiva', desc: 'Previsão de comportamento e preferências do cliente' }
        ],
        link: false
      },
      ekklesia: {
        title: 'Vynlo Ekklesia',
        subtitle: 'Gestão Completa para Igrejas',
        description: 'Sistema especializado para gestão de igrejas com controle de membros, dízimos, eventos, células e ministérios. Plataforma integrada para administração eclesiástica moderna.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M8 21l4-7 4 7"/><path d="M12 2v7"/><path d="M3 6l2.5 2.5L8 6"/><path d="M16 6l2.5 2.5L21 6"/></svg>',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        status: 'Planejamento',
        statusColor: '#f59e0b',
        metrics: { churches: '500+', members: '50k+', events: '1k+', donations: 'R$ 2M+' },
        features: [
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', title: 'Gestão de Membros', desc: 'Cadastro completo e acompanhamento de membros' },
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2v20m8-10H4"/></svg>', title: 'Controle Financeiro', desc: 'Dízimos, ofertas e gestão financeira transparente' }
        ],
        link: false
      },
      barber: {
        title: 'Vynlo Barber',
        subtitle: 'Sistema para Barbearias',
        description: 'Plataforma completa para barbearias com agendamento online, gestão de clientes, controle financeiro e marketing digital. Aumente sua receita e fidelize clientes.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M6 12h12"/><path d="M6 20V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-3-6 3z"/></svg>',
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
        status: 'Em Desenvolvimento',
        statusColor: '#3b82f6',
        metrics: { shops: '300+', bookings: '10k+', revenue: '+180%', retention: '85%' },
        features: [
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M8 2v4l-3 3h18l-3-3V2z"/><path d="M16 4h2a2 2 0 0 1 2 2v2H4V6a2 2 0 0 1 2-2h2"/></svg>', title: 'Agendamento Online', desc: 'Sistema de reservas integrado com WhatsApp' },
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', title: 'Fidelização', desc: 'Programa de pontos e promoções personalizadas' }
        ],
        link: false
      },
      pet: {
        title: 'Vynlo Pet',
        subtitle: 'Gestão para Petshops',
        description: 'Sistema especializado para petshops com controle de estoque, agendamento de serviços, histórico veterinário e programa de fidelidade para pets.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M8 5a3 3 0 1 0-6 0c0 1.61 1.16 2.94 2.69 3.24A6.93 6.93 0 0 0 8 12"/><path d="M16 5a3 3 0 1 1 6 0c0 1.61-1.16 2.94-2.69 3.24A6.93 6.93 0 0 1 16 12"/><path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M12 11a6 6 0 0 0-6 6v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a6 6 0 0 0-6-6Z"/></svg>',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
        status: 'Planejamento',
        statusColor: '#6b7280',
        metrics: { petshops: '200+', pets: '15k+', services: '5k+', satisfaction: '96%' },
        features: [
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>', title: 'Histórico Pet', desc: 'Prontuário completo e histórico de saúde' },
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M8 2v4l-3 3h18l-3-3V2z"/></svg>', title: 'Agendamento', desc: 'Banho, tosa e consultas veterinárias' }
        ],
        link: false
      },
      edu: {
        title: 'Vynlo Edu',
        subtitle: 'Plataforma Educacional',
        description: 'Sistema completo para instituições de ensino com gestão acadêmica, portal do aluno, biblioteca digital e ferramentas de ensino à distância.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
        status: 'Em Desenvolvimento',
        statusColor: '#3b82f6',
        metrics: { schools: '150+', students: '25k+', courses: '500+', completion: '92%' },
        features: [
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>', title: 'Gestão Acadêmica', desc: 'Notas, frequência e histórico escolar completo' },
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>', title: 'EAD Integrado', desc: 'Plataforma de ensino à distância completa' }
        ],
        link: false
      },
      field: {
        title: 'Vynlo Field',
        subtitle: 'Gestão de Serviços',
        description: 'Sistema para empresas de serviços com gestão de equipes externas, ordens de serviço, rastreamento GPS e relatórios de produtividade em tempo real.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
        color: '#84cc16',
        gradient: 'linear-gradient(135deg, #84cc16, #65a30d)',
        status: 'Planejamento',
        statusColor: '#6b7280',
        metrics: { companies: '100+', technicians: '2k+', orders: '50k+', efficiency: '+200%' },
        features: [
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>', title: 'Rastreamento GPS', desc: 'Localização em tempo real das equipes' },
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>', title: 'Ordens de Serviço', desc: 'Gestão completa de OS digitais' }
        ],
        link: false
      },
      health: {
        title: 'Vynlo Health',
        subtitle: 'Gestão em Saúde',
        description: 'Plataforma para clínicas e consultórios com prontuário eletrônico, agendamento, telemedicina e gestão financeira especializada para área da saúde.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/><path d="M12 5L8 21l4-7 4 7-4-16"/></svg>',
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
        status: 'Planejamento',
        statusColor: '#6b7280',
        metrics: { clinics: '80+', patients: '10k+', appointments: '30k+', satisfaction: '97%' },
        features: [
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>', title: 'Prontuário Eletrônico', desc: 'Histórico médico completo e seguro' },
          { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>', title: 'Telemedicina', desc: 'Consultas online integradas' }
        ],
        link: false
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
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            ${info.features.map(feature => `
              <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; backdrop-filter: blur(10px);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  ${feature.icon}
                  <h4 style="color: #ffffff; font-size: 0.875rem; font-weight: 600; margin: 0; font-family: Manrope, sans-serif;">${sanitizeText(feature.title)}</h4>
                </div>
                <p style="color: #cbd5e1; font-size: 0.75rem; margin: 0; font-family: Manrope, sans-serif;">${sanitizeText(feature.desc)}</p>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 32px; backdrop-filter: blur(10px);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <div style="width: 12px; height: 12px; background: ${info.statusColor}; border-radius: 50%; animation: pulse 2s infinite;"></div>
            <span style="color: ${info.statusColor}; font-size: 0.875rem; font-weight: 600; font-family: Manrope, sans-serif;">${sanitizeText(info.status)}</span>
          </div>
          
          <h4 style="color: #ffffff; font-size: 1.25rem; font-weight: 700; margin-bottom: 16px; font-family: Manrope, sans-serif;">Destaques</h4>
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px;">
              <div style="width: 32px; height: 32px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <div>
                <div style="color: #ffffff; font-size: 1rem; font-weight: 700; font-family: Manrope, sans-serif;">Inovação</div>
                <div style="color: #dbeafe; font-size: 0.75rem; font-family: Manrope, sans-serif;">Tecnologia de ponta</div>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px;">
              <div style="width: 32px; height: 32px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>
              </div>
              <div>
                <div style="color: #ffffff; font-size: 1rem; font-weight: 700; font-family: Manrope, sans-serif;">Performance</div>
                <div style="color: #d1fae5; font-size: 0.75rem; font-family: Manrope, sans-serif;">Velocidade máxima</div>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px;">
              <div style="width: 32px; height: 32px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <div style="color: #ffffff; font-size: 1rem; font-weight: 700; font-family: Manrope, sans-serif;">Segurança</div>
                <div style="color: #ede9fe; font-size: 0.75rem; font-family: Manrope, sans-serif;">Proteção total</div>
              </div>
            </div>
          </div>
          
          ${info.link ? `
            <div style="margin-top: 24px;">
              <a href="/taste" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.2); color: #ffffff; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-weight: 600; font-family: Manrope, sans-serif; transition: all 0.3s ease;">
                Acessar Plataforma
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
              </a>
            </div>
          ` : `
            <div style="margin-top: 24px;">
              <a href="/landingpages/contatolandprincipal" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.2); color: #ffffff; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-weight: 600; font-family: Manrope, sans-serif; transition: all 0.3s ease;">
                Solicitar Acesso
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
              </a>
            </div>
          `}
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

  // Sincronizar mudança de segmento
  useEffect(() => {
    try {
      const segmentKeys = ['taste', 'bot', 'ekklesia', 'barber', 'pet', 'edu', 'field', 'health'];
      if (segmentKeys[currentSegmentIndex]) {
        showSegmentTab(segmentKeys[currentSegmentIndex]);
      }
    } catch (error) {
      handleError(error as Error, 'segment_sync');
    }
  }, [currentSegmentIndex, showSegmentTab, handleError]);

  // Inicializar primeira aba com tratamento de erro
  useEffect(() => {
    try {
      setCurrentSegmentIndex(0);
      logger.componentMount('LandingPage');
    } catch (error) {
      handleError(error as Error, 'initialization');
    }
  }, [handleError]);

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