'use client';

// Force rebuild - 2025-01-09 - Updated sections
import React, { useEffect, useRef } from 'react';
import Footer from './Footer';

const LandingPrincipal: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Injetar fontes e CSS no <head> (mantendo originalidade)
    const head = document.head;

    const ensureLink = (attrs: Record<string, string>) => {
      const exists = Array.from(head.querySelectorAll('link')).some(l =>
        Object.entries(attrs).every(([k, v]) => l.getAttribute(k) === v)
      );
      if (!exists) {
        const link = document.createElement('link');
        Object.entries(attrs).forEach(([k, v]) => {
          if (v === '') link.setAttribute(k, '');
          else link.setAttribute(k, v);
        });
        head.appendChild(link);
        return link;
      }
      return null;
    };

    ensureLink({ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' });
    ensureLink({
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&display=swap',
      rel: 'stylesheet',
    });
    // Adicionar estilos CSS inline
    const style = document.createElement('style');
    style.textContent = `
      .stats-section { background: #f8fafc; padding: 80px 0; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px; }
      .stat-card { background: white; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease; }
      .stat-card:hover { transform: translateY(-5px); }
      .stat-icon { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
      .clients-card .stat-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; }
      .uptime-card .stat-icon { background: linear-gradient(135deg, #10b981, #059669); color: white; }
      .latency-card .stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
      .support-card .stat-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
      .stat-number { font-size: 2.5rem; font-weight: 800; color: #1f2937; margin-bottom: 8px; }
      .stat-unit { font-size: 1.5rem; }
      .stat-label { font-size: 1.125rem; font-weight: 600; color: #374151; margin-bottom: 4px; }
      .stat-sublabel { font-size: 0.875rem; color: #6b7280; margin-bottom: 16px; }
      .stat-trend { font-size: 0.875rem; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
      .stat-trend.positive { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
      
      .section { padding: 100px 0; }
      .section.light { background: #f8fafc; }
      .head { text-align: center; margin-bottom: 60px; }
      .head h2 { font-size: 3rem; font-weight: 800; color: #1f2937; margin-bottom: 16px; }
      .head p { font-size: 1.25rem; color: #6b7280; }
      .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
      
      .card.enhanced-card { background: white; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: all 0.3s ease; text-decoration: none; color: inherit; display: block; }
      .card.enhanced-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
      .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
      .icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
      .taste-icon { background: linear-gradient(135deg, #10b981, #059669); color: white; }
      .bot-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; }
      .erp-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
      .church-icon { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
      .barber-icon { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
      .pet-icon { background: linear-gradient(135deg, #ec4899, #db2777); color: white; }
      .edu-icon { background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; }
      .field-icon { background: linear-gradient(135deg, #84cc16, #65a30d); color: white; }
      
      .status-badge { font-size: 0.75rem; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
      .status-badge.available { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
      .status-badge.development { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
      .status-badge.planning { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
      
      .title { font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 12px; }
      .desc { font-size: 1rem; color: #6b7280; margin-bottom: 20px; }
      .features-list { margin-bottom: 20px; }
      .feature { font-size: 0.875rem; color: #374151; margin-bottom: 8px; }
      .metrics-row { display: flex; gap: 16px; }
      .metric { font-size: 0.75rem; font-weight: 600; padding: 4px 12px; border-radius: 20px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
      
      .tech-stack-section { background: #f8fafc; padding: 100px 0; }
      .tech-header { text-align: center; margin-bottom: 60px; }
      .tech-title { font-size: 3rem; font-weight: 800; color: #1f2937; margin-bottom: 16px; }
      .highlight { background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .tech-subtitle { font-size: 1.25rem; color: #6b7280; max-width: 800px; margin: 0 auto; }
      .tech-grid-simple { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
      .tech-item { text-align: center; }
      .tech-icon { width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
      .react-icon { background: linear-gradient(135deg, #61dafb, #21d4fd); color: white; }
      .java-icon { background: linear-gradient(135deg, #f89820, #ed8936); color: white; }
      .database-icon { background: linear-gradient(135deg, #336791, #2d5aa0); color: white; }
      .cloud-icon { background: linear-gradient(135deg, #ff9900, #ff6600); color: white; }
      .security-icon { background: linear-gradient(135deg, #10b981, #059669); color: white; }
      .monitoring-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
      .tech-item h3 { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 12px; }
      .tech-item p { font-size: 1rem; color: #6b7280; }
      
      /* Seção Quem é a Vynlo */
      .about-vynlo-section { background: #f8fafc; padding: 80px 0; }
      .about-content { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
      .about-banner { background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 20px; padding: 40px; text-align: center; position: relative; overflow: hidden; }
      .about-banner::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: rotate 20s linear infinite; }
      .about-text h2 { font-size: 2.5rem; font-weight: 800; color: #1f2937; margin-bottom: 24px; font-family: Manrope, sans-serif; }
      .about-text p { font-size: 1.125rem; color: #6b7280; line-height: 1.7; margin-bottom: 20px; font-family: Manrope, sans-serif; }
      .about-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 32px; }
      .about-stat { background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
      .about-stat-number { font-size: 1.75rem; font-weight: 800; color: #3b82f6; margin-bottom: 4px; }
      .about-stat-label { font-size: 0.875rem; color: #6b7280; font-weight: 500; }
      
      /* Animações */
      @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-50px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-100px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      /* MOBILE RESPONSIVO */
      @media (max-width: 768px) {
        .section { padding: 60px 0; }
        .container { padding: 0 16px; }
        
        /* Header Mobile */
        .desktop-nav { display: none !important; }
        .mobile-menu { display: block !important; }
        
        /* Hero Mobile */
        .carousel-slide { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; }
        .carousel-slide h1 { font-size: 2.5rem !important; }
        .carousel-slide p { font-size: 1.125rem !important; }
        .carousel-slide > div:first-child { padding-right: 0 !important; }
        .carousel-slide > div:last-child { order: -1; }
        
        /* Botões Hero Mobile */
        .carousel-slide div[style*="display: flex"] { flex-direction: column !important; gap: 12px !important; }
        .carousel-slide a { width: 100% !important; justify-content: center !important; }
        
        /* Cards Grid Mobile */
        .grid-4 { grid-template-columns: 1fr !important; gap: 20px !important; }
        .stats-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        .tech-grid-simple { grid-template-columns: 1fr !important; gap: 24px !important; }
        
        /* About Vynlo Mobile */
        .about-content { grid-template-columns: 1fr !important; gap: 40px !important; }
        .about-stats { grid-template-columns: 1fr !important; gap: 16px !important; }
        .about-text h2 { font-size: 2rem !important; }
        
        /* Títulos Mobile */
        .head h2 { font-size: 2rem !important; }
        .tech-title { font-size: 2rem !important; }
        h1 { font-size: 2.5rem !important; }
        h2 { font-size: 2rem !important; }
        h3 { font-size: 1.5rem !important; }
        
        /* Segmentos Carrossel Mobile */
        #segments-carousel { overflow-x: auto !important; scroll-snap-type: x mandatory; }
        .segment-tab { scroll-snap-align: start; flex-shrink: 0 !important; }
        
        /* FAQ Mobile */
        section[id="faq-new"] > div > div > div:last-child { grid-template-columns: 1fr !important; }
        
        /* Funil Mobile */
        section[id="funnel"] .tech-grid-simple { grid-template-columns: 1fr !important; }
        section[id="funnel"] div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        
        /* Why Vynlo Mobile */
        section[id="why-vynlo"] div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 40px !important; }
        
        /* Métricas Mobile */
        .metrics-row { flex-wrap: wrap !important; }
        
        /* Padding Geral Mobile */
        .card.enhanced-card { padding: 24px !important; }
        .stat-card { padding: 24px !important; }
        
        /* Navegação Segmentos Mobile */
        button[onclick*="previousSegment"], button[onclick*="nextSegment"] { display: none !important; }
      }
    `;
    head.appendChild(style);

    // Comportamentos equivalentes ao <script> original
    let intervalId: number | undefined;
    let dropdownTimeout: number | undefined;

    const root = rootRef.current;
    if (!root) return;

    // Carrossel
    const slides = Array.from(root.querySelectorAll<HTMLElement>('.carousel-slide'));
    const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('.nav-dot'));
    let currentSlide = 0;

    const goToSlide = (index: number) => {
      if (!slides.length) return;
      currentSlide = index % slides.length;
      slides.forEach((slide, i) => {
        if (i === currentSlide) {
          slide.style.opacity = '1';
          slide.style.transform = 'translateX(0)';
          slide.style.zIndex = '10';
        } else {
          slide.style.opacity = '0';
          slide.style.transform = 'translateX(100%)';
          slide.style.zIndex = '1';
        }
      });
      dots.forEach((dot, i) => {
        if (i === currentSlide) {
          dot.style.background = '#3b82f6';
          dot.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
        } else {
          dot.style.background = 'rgba(255, 255, 255, 0.3)';
          dot.style.boxShadow = 'none';
        }
      });
    };

    const nextSlide = () => {
      goToSlide((currentSlide + 1) % (slides.length || 1));
    };

    // Tornar disponíveis para atributos inline
    (window as any).goToSlide = goToSlide;
    (window as any).nextSlide = nextSlide;

    // Eventos dos dots
    dots.forEach((dot) => {
      const handler = () => {
        const s = Number(dot.getAttribute('data-slide') || '0');
        goToSlide(s);
      };
      dot.addEventListener('click', handler);
      (dot as any).__handler = handler;
    });

    // Auto-play e inicialização
    intervalId = window.setInterval(nextSlide, 4000);
    goToSlide(0);

    // Dropdown
    const dropdown = root.querySelector<HTMLElement>('#dropdown');
    const dropdownContainer = dropdown?.parentElement as HTMLElement | undefined;

    const showDropdown = () => {
      if (!dropdown) return;
      if (dropdownTimeout) window.clearTimeout(dropdownTimeout);
      dropdown.style.display = 'block';
    };
    const hideDropdown = () => {
      if (!dropdown) return;
      dropdownTimeout = window.setTimeout(() => {
        dropdown.style.display = 'none';
      }, 2000) as unknown as number;
    };

    (window as any).showDropdown = showDropdown;
    (window as any).hideDropdown = hideDropdown;

    if (dropdownContainer) {
      dropdownContainer.addEventListener('mouseenter', showDropdown);
      dropdownContainer.addEventListener('mouseleave', hideDropdown);
      (dropdownContainer as any).__mouseenter = showDropdown;
      (dropdownContainer as any).__mouseleave = hideDropdown;
    }



    // Nova FAQ
    const toggleFaqNew = (index: number) => {
      const content = root.querySelector<HTMLElement>(`#faq-content-new-${index}`);
      const icon = root.querySelector<HTMLElement>(`#faq-icon-new-${index}`);
      if (!content || !icon) return;
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
    };
    (window as any).toggleFaqNew = toggleFaqNew;

    // Menu Mobile
    const toggleMobileMenu = () => {
      const nav = root.querySelector('.desktop-nav') as HTMLElement;
      if (!nav) return;
      const isVisible = nav.style.display !== 'none';
      nav.style.display = isVisible ? 'none' : 'flex';
      nav.style.position = isVisible ? 'static' : 'absolute';
      nav.style.top = isVisible ? 'auto' : '100%';
      nav.style.left = isVisible ? 'auto' : '0';
      nav.style.right = isVisible ? 'auto' : '0';
      nav.style.background = isVisible ? 'transparent' : 'rgba(15, 23, 42, 0.98)';
      nav.style.flexDirection = isVisible ? 'row' : 'column';
      nav.style.padding = isVisible ? '0' : '20px';
      nav.style.borderRadius = isVisible ? '0' : '0 0 12px 12px';
      nav.style.zIndex = isVisible ? 'auto' : '1001';
    };
    (window as any).toggleMobileMenu = toggleMobileMenu;

    // Função para sanitizar texto
    const sanitizeText = (text: string) => {
      return text.replace(/[<>"'&]/g, (match) => {
        const map: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '&': '&amp;'
        };
        return map[match] || match;
      });
    };

    // Carrossel de segmentos
    let currentSegmentIndex = 0;
    const segmentTabs = Array.from(root.querySelectorAll('.segment-tab'));
    const segmentsCarousel = root.querySelector('#segments-carousel') as HTMLElement;
    
    const updateCarouselPosition = () => {
      if (!segmentsCarousel) return;
      const tabWidth = 188; // 180px + 8px gap
      const containerWidth = segmentsCarousel.parentElement?.offsetWidth || 1000;
      const visibleTabs = Math.floor(containerWidth / tabWidth);
      
      if (segmentTabs.length <= visibleTabs) {
        segmentsCarousel.style.transform = 'translateX(0)';
        return;
      }
      
      const maxIndex = segmentTabs.length - visibleTabs;
      currentSegmentIndex = Math.max(0, Math.min(currentSegmentIndex, maxIndex));
      const translateX = -currentSegmentIndex * tabWidth;
      segmentsCarousel.style.transform = `translateX(${translateX}px)`;
    };
    
    const nextSegment = () => {
      const containerWidth = segmentsCarousel?.parentElement?.offsetWidth || 1000;
      const tabWidth = 188;
      const visibleTabs = Math.floor(containerWidth / tabWidth);
      const maxIndex = segmentTabs.length - visibleTabs;
      
      if (currentSegmentIndex < maxIndex) {
        currentSegmentIndex++;
        updateCarouselPosition();
      }
    };
    
    const previousSegment = () => {
      if (currentSegmentIndex > 0) {
        currentSegmentIndex--;
        updateCarouselPosition();
      }
    };
    
    (window as any).nextSegment = nextSegment;
    (window as any).previousSegment = previousSegment;
    
    // Atualizar posição no resize
    const handleResize = () => updateCarouselPosition();
    window.addEventListener('resize', handleResize);
    
    // Segmentos com abas profissionais
    const showSegmentTab = (segment: string) => {
      try {
        const segmentDetails = root.querySelector<HTMLElement>('#segment-details');
        const segmentContent = root.querySelector<HTMLElement>('#segment-content-new');
        if (!segmentDetails || !segmentContent) return;

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
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 12l2 2 4-4"/><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5 0 0l7.5 7.5L0 0"/></svg>', title: 'Pedidos Integrados', desc: 'Balcão, delivery e WhatsApp em uma plataforma unificada' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>', title: 'Gestão Inteligente', desc: 'Controle de estoque com IA e alertas automáticos' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2v20m8-10H4"/><circle cx="12" cy="12" r="3"/></svg>', title: 'Analytics Avançado', desc: 'Relatórios em tempo real com insights preditivos' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2c-1.1 0-2 .9-2 2v12"/><path d="M15 18H9"/><path d="M19 18h2a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/></svg>', title: 'Delivery Nativo', desc: 'Integração com iFood, Uber Eats e 15+ plataformas' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', title: 'Marketing Automatizado', desc: 'CRM integrado com campanhas inteligentes' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', title: 'Dashboard Executivo', desc: 'Métricas KPI para tomada de decisão estratégica' }
            ],
            link: true
          },
          bot: {
            title: 'Vynlo Bot',
            subtitle: 'Atendimento Inteligente com IA',
            description: 'Assistente virtual com IA avançada para atendimento 24/7 e automação de processos de vendas. Reduz custos operacionais em 60% e aumenta conversão em 85%.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            status: 'Em Desenvolvimento',
            statusColor: '#3b82f6',
            metrics: { efficiency: '+85%', cost_reduction: '-60%', response_time: '<2s', satisfaction: '94%' },
            features: [
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>', title: 'Atendimento 24/7', desc: 'Suporte automatizado sem interrupções' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', title: 'WhatsApp Business', desc: 'Integração completa com API oficial' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/></svg>', title: 'IA Conversacional', desc: 'Processamento de linguagem natural GPT-4' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', title: 'Automação de Vendas', desc: 'Funil de vendas completamente automatizado' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', title: 'Análise de Sentimento', desc: 'Detecção de emoções em tempo real' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>', title: 'Multicanal', desc: 'Integração com 20+ plataformas de comunicação' }
            ],
            link: false
          },
          ekklesia: {
            title: 'Vynlo Ekklesia',
            subtitle: 'Gestão Eclesiástica Moderna',
            description: 'Plataforma completa para igrejas com gestão de membros, eventos, finanças e comunicação integrada. Mais de 500 igrejas já otimizaram sua gestão pastoral.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M8 21l4-7 4 7"/><path d="M12 2v7"/><path d="M3 6l2.5 2.5L8 6"/><path d="M16 6l2.5 2.5L21 6"/></svg>',
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
            status: 'Planejamento',
            statusColor: '#6b7280',
            metrics: { churches: '500+', members: '50k+', engagement: '+70%', donations: '+45%' },
            features: [
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="m17 11 2 2 4-4"/></svg>', title: 'Gestão de Membros', desc: 'Cadastro completo com histórico espiritual' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', title: 'Eventos e Células', desc: 'Organização de cultos e grupos pequenos' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>', title: 'Comunicação Integrada', desc: 'Sistema unificado multi-canal' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>', title: 'Relatórios Pastorais', desc: 'Analytics espiritual e crescimento' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', title: 'Gestão Financeira', desc: 'Controle de dízimos, ofertas e projetos' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', title: 'Plataforma EAD', desc: 'Sistema de discipulado e educação cristã' }
            ],
            link: false
          },
          barber: {
            title: 'Vynlo Barber',
            subtitle: 'Gestão Profissional para Barbearias',
            description: 'Sistema especializado para barbearias com agendamento inteligente, controle de comissões e programa de fidelidade. Aumento médio de 80% na ocupação das agendas.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M6 12h12"/><path d="M6 20V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-3-6 3z"/></svg>',
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
            status: 'Em Desenvolvimento',
            statusColor: '#3b82f6',
            metrics: { schedule_increase: '+80%', loyalty: '+65%', revenue: '+120%', efficiency: '+90%' },
            features: [
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', title: 'Agendamento Inteligente', desc: 'Sistema com IA para otimização de horários' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>', title: 'Programa de Fidelidade', desc: 'Sistema gamificado de pontos e recompensas' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', title: 'Controle de Comissões', desc: 'Gestão automática de pagamentos por profissional' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>', title: 'Histórico de Clientes', desc: 'CRM completo com preferências e histórico' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>', title: 'Gestão de Produtos', desc: 'Controle de estoque e catálogo de serviços' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>', title: 'Analytics Profissional', desc: 'Relatórios de performance individual e geral' }
            ],
            link: false
          },
          pet: {
            title: 'Vynlo Pet',
            subtitle: 'Gestão Completa para Petshops',
            description: 'Solução completa para petshops e clínicas veterinárias com controle médico e gestão de serviços. Mercado pet cresce 25% ao ano, seja parte dessa expansão.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M8 5a3 3 0 1 0-6 0c0 1.61 1.16 2.94 2.69 3.24A6.93 6.93 0 0 0 8 12"/><path d="M16 5a3 3 0 1 1 6 0c0 1.61-1.16 2.94-2.69 3.24A6.93 6.93 0 0 1 16 12"/><path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M12 11a6 6 0 0 0-6 6v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a6 6 0 0 0-6-6Z"/></svg>',
            color: '#ec4899',
            gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
            status: 'Planejamento',
            statusColor: '#6b7280',
            metrics: { market_growth: '+25%', clinics: '1.200+', pets: '15k+', satisfaction: '96%' },
            features: [
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/><path d="M12 5L8 21l4-7 4 7-4-16"/></svg>', title: 'Agendamento Veterinário', desc: 'Sistema especializado para consultas médicas' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', title: 'Carteira de Vacinação', desc: 'Controle digital completo com lembretes' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>', title: 'Prontuário Eletrônico', desc: 'Histórico médico completo e detalhado' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>', title: 'Estoque Veterinário', desc: 'Gestão especializada de medicamentos' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>', title: 'Lembretes Automáticos', desc: 'Notificações inteligentes para tutores' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>', title: 'Relatórios Clínicos', desc: 'Analytics especializados para veterinários' }
            ],
            link: false
          },
          edu: {
            title: 'Vynlo Edu',
            subtitle: 'Plataforma Educacional Completa',
            description: 'Sistema completo para instituições de ensino com gestão de cursos, alunos, certificações e aulas ao vivo. EAD cresce 40% ao ano no Brasil.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
            color: '#06b6d4',
            gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            status: 'Em Desenvolvimento',
            statusColor: '#3b82f6',
            metrics: { market_growth: '+40%', students: '10k+', courses: '500+', completion: '85%' },
            features: [
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', title: 'Cursos Online', desc: 'Plataforma completa de ensino à distância' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>', title: 'Gestão de Alunos', desc: 'CRM educacional com acompanhamento' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>', title: 'Certificados Digitais', desc: 'Emissão automática com blockchain' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/><path d="m21 12-6-3-6 3-6-3"/></svg>', title: 'Aulas ao Vivo', desc: 'Streaming integrado com interação' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>', title: 'Analytics Educacional', desc: 'Métricas de engajamento e performance' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2v20m8-10H4"/><circle cx="12" cy="12" r="3"/></svg>', title: 'Gamificação', desc: 'Sistema de pontos e conquistas' }
            ],
            link: false
          },
          field: {
            title: 'Vynlo Field',
            subtitle: 'Gestão de Serviços em Campo',
            description: 'Sistema completo para empresas de serviços com ordens de serviço, rastreamento GPS e assinatura digital. Setor de serviços cresce 35% ao ano.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
            color: '#84cc16',
            gradient: 'linear-gradient(135deg, #84cc16, #65a30d)',
            status: 'Planejamento',
            statusColor: '#6b7280',
            metrics: { market_growth: '+35%', companies: '800+', orders: '50k+', efficiency: '+75%' },
            features: [
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>', title: 'Ordens de Serviço', desc: 'Gestão completa do ciclo de atendimento' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>', title: 'Controle de SLA', desc: 'Monitoramento de prazos em tempo real' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>', title: 'Rastreamento GPS', desc: 'Localização em tempo real das equipes' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>', title: 'Assinatura Digital', desc: 'Confirmação eletrônica de serviços' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>', title: 'Gestão de Estoque', desc: 'Controle de materiais e equipamentos' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>', title: 'Relatórios Operacionais', desc: 'Analytics de produtividade e custos' }
            ],
            link: false
          },
          health: {
            title: 'Vynlo Health',
            subtitle: 'Gestão para Clínicas e Consultórios',
            description: 'Sistema completo para clínicas médicas com prontuário eletrônico, agendamento e telemedicina. Setor de saúde digital cresce 30% ao ano.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/><path d="M12 5L8 21l4-7 4 7-4-16"/></svg>',
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
            status: 'Planejamento',
            statusColor: '#6b7280',
            metrics: { market_growth: '+30%', clinics: '2.000+', patients: '100k+', satisfaction: '97%' },
            features: [
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>', title: 'Prontuário Eletrônico', desc: 'Registro médico completo e seguro' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>', title: 'Agendamento Médico', desc: 'Sistema inteligente de consultas' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', title: 'Telemedicina', desc: 'Consultas online integradas' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', title: 'Prescrição Digital', desc: 'Receitas eletrônicas com validade' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', title: 'Faturamento Médico', desc: 'Integração com convênios e ANS' },
              { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>', title: 'Analytics Clínico', desc: 'Relatórios de performance médica' }
            ],
            link: false
          }
        };

        const info = segments[segment as keyof typeof segments];
        if (!info) return;

        // Atualizar abas
        root.querySelectorAll('.segment-tab').forEach(tab => {
          const tabElement = tab as HTMLElement;
          tabElement.style.background = 'transparent';
          tabElement.style.color = '#cbd5e1';
          tabElement.classList.remove('active');
        });

        const activeTab = root.querySelector(`[data-segment="${segment}"]`) as HTMLElement;
        if (activeTab) {
          activeTab.style.background = info.gradient;
          activeTab.style.color = 'white';
          activeTab.classList.add('active');
        }

        // Conteúdo do card
        segmentContent.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;">
            <!-- Lado Esquerdo: Informações Principais -->
            <div>
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                <div style="width: 80px; height: 80px; background: ${info.gradient}; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                  ${info.icon}
                </div>
                <div>
                  <h3 style="color: #ffffff; font-size: 2rem; font-weight: 800; margin: 0; font-family: Manrope, sans-serif;">${sanitizeText(info.title)}</h3>
                  <p style="color: #94a3b8; font-size: 1.125rem; margin: 4px 0 0 0; font-family: Manrope, sans-serif;">${sanitizeText(info.subtitle)}</p>
                  <div style="background: rgba(${info.statusColor === '#22c55e' ? '34, 197, 94' : info.statusColor === '#3b82f6' ? '59, 130, 246' : '107, 114, 128'}, 0.1); color: ${info.statusColor}; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; margin-top: 8px; display: inline-block;">${sanitizeText(info.status)}</div>
                </div>
              </div>
              
              <p style="color: #cbd5e1; font-size: 1.125rem; line-height: 1.7; margin-bottom: 24px; font-family: Manrope, sans-serif;">${sanitizeText(info.description)}</p>
              
              <!-- Métricas -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
                ${Object.entries(info.metrics).map(([key, value]) => {
                  const metricLabels: { [key: string]: string } = {
                    clients: 'Clientes',
                    growth: 'Crescimento',
                    satisfaction: 'Satisfação',
                    roi: 'ROI',
                    efficiency: 'Eficiência',
                    cost_reduction: 'Redução Custos',
                    response_time: 'Tempo Resposta',
                    churches: 'Igrejas',
                    members: 'Membros',
                    engagement: 'Engajamento',
                    donations: 'Doações',
                    schedule_increase: 'Agendas',
                    loyalty: 'Fidelidade',
                    revenue: 'Receita',
                    market_growth: 'Mercado',
                    clinics: 'Clínicas',
                    pets: 'Pets',
                    students: 'Alunos',
                    courses: 'Cursos',
                    completion: 'Conclusão',
                    companies: 'Empresas',
                    orders: 'Ordens',
                    patients: 'Pacientes'
                  };
                  return `
                    <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 16px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.1);">
                      <div style="color: ${info.color}; font-size: 1.5rem; font-weight: 800; margin-bottom: 4px; font-family: Manrope, sans-serif;">${sanitizeText(value)}</div>
                      <div style="color: #94a3b8; font-size: 0.75rem; font-weight: 500; font-family: Manrope, sans-serif;">${metricLabels[key] || key}</div>
                    </div>
                  `;
                }).join('')}
              </div>
              
              ${info.link ? `
                <div style="text-align: left;">
                  <a href="/taste" style="display: inline-flex; align-items: center; gap: 12px; background: ${info.gradient}; color: white; font-size: 1.125rem; font-weight: 600; padding: 16px 32px; border-radius: 12px; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                      <path d="M7 2v20"/>
                      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                    </svg>
                    Acessar ${sanitizeText(info.title)}
                  </a>
                </div>
              ` : `
                <div style="text-align: left;">
                  <a href="/landingpages/contatolandprincipal" style="display: inline-flex; align-items: center; gap: 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 1.125rem; font-weight: 600; padding: 16px 32px; border-radius: 12px; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Solicitar Informações
                  </a>
                </div>
              `}
            </div>
            
            <!-- Lado Direito: Features com Ícones -->
            <div>
              <h4 style="color: #ffffff; font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; font-family: Manrope, sans-serif;">Principais Funcionalidades</h4>
              <div style="display: grid; gap: 16px;">
                ${info.features.map(feature => `
                  <div style="display: flex; align-items: start; gap: 16px; background: rgba(255, 255, 255, 0.03); border-radius: 16px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.05); transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255, 255, 255, 0.08)'; this.style.transform='translateX(4px)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.03)'; this.style.transform='translateX(0)'">
                    <div style="width: 48px; height: 48px; background: ${info.gradient}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
                      ${feature.icon}
                    </div>
                    <div>
                      <h5 style="color: #ffffff; font-size: 1rem; font-weight: 600; margin: 0 0 4px 0; font-family: Manrope, sans-serif;">${sanitizeText(feature.title)}</h5>
                      <p style="color: #94a3b8; font-size: 0.875rem; margin: 0; line-height: 1.5; font-family: Manrope, sans-serif;">${sanitizeText(feature.desc)}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;

        // Expandir o card
        segmentDetails.style.maxHeight = '800px';
        segmentDetails.style.opacity = '1';
        
      } catch (error) {
        console.error('Erro ao mostrar aba do segmento:', error);
      }
    };
    (window as any).showSegmentTab = showSegmentTab;

    // Segmentos interativos (função antiga mantida para compatibilidade)
    const showSegmentInfo = (segment: string) => {
      const segmentInfo = root.querySelector<HTMLElement>('#segment-info');
      const segmentContent = root.querySelector<HTMLElement>('#segment-content');
      if (!segmentInfo || !segmentContent) return;

      const segments = {
        taste: {
          title: 'Vynlo Taste - Sistema Completo para Restaurantes',
          description: 'O Vynlo Taste é nossa solução premium para o setor gastronômico, desenvolvida especificamente para restaurantes, lanchonetes, pizzarias e estabelecimentos de delivery. Nossa plataforma integra todas as operações do seu negócio em um sistema único e inteligente.',
          features: [
            'Gestão completa de pedidos (balcão, delivery, WhatsApp)',
            'Controle inteligente de estoque com alertas automáticos',
            'Relatórios financeiros em tempo real',
            'Integração nativa com apps de delivery (iFood, Uber Eats)',
            'Sistema de fidelidade e marketing automatizado',
            'Dashboard analítico com insights de vendas'
          ],
          link: true
        },
        bot: {
          title: 'Vynlo Bot - Atendimento Inteligente com IA',
          description: 'Nossa solução de atendimento automatizado utiliza inteligência artificial avançada para revolucionar a experiência do cliente. O Vynlo Bot oferece suporte 24/7 com capacidade de processamento de linguagem natural.',
          features: [
            'Atendimento automatizado 24 horas por dia',
            'Integração completa com WhatsApp Business',
            'IA conversacional com aprendizado contínuo',
            'Automação de processos de vendas',
            'Análise de sentimento em tempo real',
            'Escalabilidade para múltiplos canais'
          ],
          link: false
        },
        ekklesia: {
          title: 'Vynlo Ekklesia - Gestão Eclesiástica Moderna',
          description: 'Desenvolvido especialmente para igrejas e organizações religiosas, o Vynlo Ekklesia oferece ferramentas completas para gestão de membros, eventos, finanças e comunicação, fortalecendo a comunidade e otimizando a administração.',
          features: [
            'Cadastro e gestão completa de membros',
            'Organização de eventos e células',
            'Sistema de comunicação integrada',
            'Relatórios pastorais e estatísticos',
            'Controle financeiro de dízimos e ofertas',
            'Plataforma de ensino e discipulado'
          ],
          link: false
        },
        barber: {
          title: 'Vynlo Barber - Gestão Profissional para Barbearias',
          description: 'Solução especializada para barbearias e salões masculinos, o Vynlo Barber oferece agendamento inteligente, controle de comissões, programa de fidelidade e gestão completa do negócio.',
          features: [
            'Agendamento online com confirmação automática',
            'Programa de fidelidade personalizado',
            'Controle detalhado de comissões',
            'Histórico completo de clientes',
            'Gestão de produtos e serviços',
            'Relatórios de performance por profissional'
          ],
          link: false
        },
        pet: {
          title: 'Vynlo Pet - Gestão Completa para Petshops',
          description: 'Desenvolvido para petshops, clínicas veterinárias e pet services, o Vynlo Pet oferece gestão completa desde agendamentos até controle médico, garantindo o melhor cuidado para os pets.',
          features: [
            'Agendamento de consultas e serviços',
            'Controle de carteira de vacinação',
            'Histórico médico completo dos pets',
            'Gestão de estoque de medicamentos',
            'Sistema de lembretes automáticos',
            'Relatórios veterinários especializados'
          ],
          link: false
        }
      };

      const info = segments[segment as keyof typeof segments];
      if (!info) return;

      segmentContent.innerHTML = `
        <h3 style="color: #ffffff; font-size: 1.75rem; font-weight: 700; margin-bottom: 16px; font-family: Manrope, sans-serif;">${info.title}</h3>
        <p style="color: #cbd5e1; font-size: 1.125rem; margin-bottom: 24px; line-height: 1.6; font-family: Manrope, sans-serif;">${info.description}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 32px;">
          ${info.features.map(feature => `
            <div style="display: flex; align-items: center; gap: 12px; color: #e2e8f0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span style="font-size: 0.875rem;">${feature}</span>
            </div>
          `).join('')}
        </div>
        ${info.link ? `
          <div style="text-align: center;">
            <a href="#" data-taste-link onclick="window.location.href='/taste'" style="display: inline-flex; align-items: center; gap: 12px; background: linear-gradient(135deg, #10b981, #059669); color: white; font-size: 1.125rem; font-weight: 600; padding: 16px 32px; border-radius: 12px; text-decoration: none; transition: all 0.3s ease;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                <path d="M7 2v20"/>
                <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
              </svg>
              Acessar Vynlo Taste
            </a>
          </div>
        ` : `
          <div style="text-align: center;">
            <a href="#" onclick="window.location.href='/landingpages/contatolandprincipal'" style="display: inline-flex; align-items: center; gap: 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 1.125rem; font-weight: 600; padding: 16px 32px; border-radius: 12px; text-decoration: none; transition: all 0.3s ease;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Solicitar Informações
            </a>
          </div>
        `}
      `;

      // Remover classe ativa de todos os cards
      root.querySelectorAll('.segment-card').forEach(card => {
        (card as HTMLElement).style.border = '1px solid rgba(255, 255, 255, 0.1)';
        (card as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
      });

      // Adicionar classe ativa ao card selecionado
      const activeCard = root.querySelector(`[data-segment="${segment}"]`) as HTMLElement;
      if (activeCard) {
        activeCard.style.border = '1px solid rgba(59, 130, 246, 0.5)';
        activeCard.style.background = 'rgba(59, 130, 246, 0.1)';
      }

      segmentInfo.style.display = 'block';
      
      // Scroll suave para a área de informações
      setTimeout(() => {
        segmentInfo.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    };
    (window as any).showSegmentInfo = showSegmentInfo;

    // Inicializar carrossel e primeira aba
    updateCarouselPosition();
    showSegmentTab('taste');

    // Cleanup
    return () => {
      if (intervalId) window.clearInterval(intervalId);
      if (dropdownTimeout) window.clearTimeout(dropdownTimeout);
      dots.forEach((dot) => {
        const h = (dot as any).__handler as EventListener | undefined;
        if (h) dot.removeEventListener('click', h);
      });
      if (dropdownContainer) {
        const me = (dropdownContainer as any).__mouseenter as EventListener | undefined;
        const ml = (dropdownContainer as any).__mouseleave as EventListener | undefined;
        if (me) dropdownContainer.removeEventListener('mouseenter', me);
        if (ml) dropdownContainer.removeEventListener('mouseleave', ml);
      }
    };
  }, []);

  const html = `  <a class="skip-link" href="#solutions">Pular para o conteúdo</a>

<header style="position: fixed; top: 0; left: 0; right: 0; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); z-index: 1000; padding: 16px 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between;">
    <a href="#home" style="color: #ffffff; font-family: Manrope, sans-serif; font-size: 1.5rem; font-weight: 700; text-decoration: none;">Vynlo Tech</a>
    <nav style="display: flex; align-items: center; gap: 32px;" class="desktop-nav">
      <button class="mobile-menu" style="display: none; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;" onclick="toggleMobileMenu()">
        ☰
      </button>
      <div style="position: relative;" onmouseenter="showDropdown()" onmouseleave="hideDropdown()">
        <span style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; cursor: pointer;">Segmentos ▾</span>
        <div id="dropdown" style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.98); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; min-width: 320px; display: none; margin-top: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); z-index: 9999;">
          <a href="/taste" style="display: flex; align-items: center; gap: 12px; color: #e2e8f0; text-decoration: none; padding: 12px; border-radius: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(16, 185, 129, 0.1)'" onmouseout="this.style.background='transparent'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg><div><div style="font-weight: 600;">Restaurantes</div><div style="font-size: 12px; color: #10b981;">Vynlo Taste - Disponível</div></div></a>
          <a href="/contato" style="display: flex; align-items: center; gap: 12px; color: #e2e8f0; text-decoration: none; padding: 12px; border-radius: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(59, 130, 246, 0.1)'" onmouseout="this.style.background='transparent'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg><div><div style="font-weight: 600;">IA Bot</div><div style="font-size: 12px; color: #3b82f6;">Vynlo Bot - Em Desenvolvimento</div></div></a>
          <a href="/landingpages/contatolandprincipal" style="display: flex; align-items: center; gap: 12px; color: #e2e8f0; text-decoration: none; padding: 12px; border-radius: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(245, 158, 11, 0.1)'" onmouseout="this.style.background='transparent'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21l4-7 4 7"/><path d="M12 2v7"/><path d="M3 6l2.5 2.5L8 6"/><path d="M16 6l2.5 2.5L21 6"/></svg><div><div style="font-weight: 600;">Igrejas</div><div style="font-size: 12px; color: #f59e0b;">Vynlo Ekklesia - Planejamento</div></div></a>
          <a href="/landingpages/contatolandprincipal" style="display: flex; align-items: center; gap: 12px; color: #e2e8f0; text-decoration: none; padding: 12px; border-radius: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(239, 68, 68, 0.1)'" onmouseout="this.style.background='transparent'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 12h12"/><path d="M6 20V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-3-6 3z"/></svg><div><div style="font-weight: 600;">Barbearias</div><div style="font-size: 12px; color: #3b82f6;">Vynlo Barber - Em Desenvolvimento</div></div></a>
          <a href="/landingpages/contatolandprincipal" style="display: flex; align-items: center; gap: 12px; color: #e2e8f0; text-decoration: none; padding: 12px; border-radius: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(236, 72, 153, 0.1)'" onmouseout="this.style.background='transparent'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 5a3 3 0 1 0-6 0c0 1.61 1.16 2.94 2.69 3.24A6.93 6.93 0 0 0 8 12"/><path d="M16 5a3 3 0 1 1 6 0c0 1.61-1.16 2.94-2.69 3.24A6.93 6.93 0 0 1 16 12"/><path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M12 11a6 6 0 0 0-6 6v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a6 6 0 0 0-6-6Z"/></svg><div><div style="font-weight: 600;">Petshops</div><div style="font-size: 12px; color: #6b7280;">Vynlo Pet - Planejamento</div></div></a>
          <a href="/landingpages/contatolandprincipal" style="display: flex; align-items: center; gap: 12px; color: #e2e8f0; text-decoration: none; padding: 12px; border-radius: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(6, 182, 212, 0.1)'" onmouseout="this.style.background='transparent'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg><div><div style="font-weight: 600;">Educação</div><div style="font-size: 12px; color: #3b82f6;">Vynlo Edu - Em Desenvolvimento</div></div></a>
          <a href="/landingpages/contatolandprincipal" style="display: flex; align-items: center; gap: 12px; color: #e2e8f0; text-decoration: none; padding: 12px; border-radius: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(132, 204, 22, 0.1)'" onmouseout="this.style.background='transparent'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg><div><div style="font-weight: 600;">Serviços</div><div style="font-size: 12px; color: #6b7280;">Vynlo Field - Planejamento</div></div></a>
          <a href="/landingpages/contatolandprincipal" style="display: flex; align-items: center; gap: 12px; color: #e2e8f0; text-decoration: none; padding: 12px; border-radius: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(239, 68, 68, 0.1)'" onmouseout="this.style.background='transparent'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/><path d="M12 5L8 21l4-7 4 7-4-16"/></svg><div><div style="font-weight: 600;">Saúde</div><div style="font-size: 12px; color: #6b7280;">Vynlo Health - Planejamento</div></div></a>
        </div>
      </div>
      <a href="#stack" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">Tecnologias</a>
      <a href="#funnel" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">Como Contratar</a>
      <a href="#faq" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">FAQ</a>
      <a href="#why-vynlo" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">Por que Vynlo?</a>
      <a href="/contato" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-family: Manrope, sans-serif; font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none; transition: all 0.3s ease;">Entre em Contato</a>
      <a href="/login" style="background: rgba(30, 41, 59, 0.8); color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 14px; font-weight: 500; padding: 8px 16px; border-radius: 8px; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.1);">Sou Cliente</a>
    </nav>
  </div>
</header>

<section id="vynlo-carousel" style="background: linear-gradient(135deg, #1e40af 0%, #1e293b 50%, #0f172a 100%); padding: 120px 0; position: relative; overflow: hidden; min-height: 700px;">
  <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 2;">
    <div id="carousel-container" style="position: relative; width: 100%; height: 600px;">
      
      <div class="carousel-slide active" data-slide="0" style="position: absolute; width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; opacity: 1; transform: translateX(0); transition: all 1s ease;">
        <div style="padding-right: 40px;">
          <div style="display: inline-flex; align-items: center; gap: 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 50px; padding: 12px 20px; color: #60a5fa; font-size: 14px; font-weight: 600; margin-bottom: 32px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20m8-10H4"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Inteligência Artificial</span>
          </div>
          <h1 style="font-size: 4.5rem; font-weight: 900; color: #ffffff; margin-bottom: 32px; line-height: 1.1; font-family: Manrope, sans-serif;">
            Automação que <span style="background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">revoluciona</span> negócios
          </h1>
          <p style="font-size: 1.375rem; color: #cbd5e1; margin-bottom: 40px; line-height: 1.7; font-family: Manrope, sans-serif;">Inteligência artificial de última geração que automatiza processos complexos, otimiza operações em tempo real e gera insights preditivos para decisões estratégicas.</p>
          <div style="display: flex; gap: 16px; align-items: center;">
            <a href="/contato" style="background: linear-gradient(135deg, #10b981, #059669); color: white; font-size: 1.25rem; font-weight: 700; padding: 20px 40px; border-radius: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4); transition: all 0.3s ease;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Começar Agora - GRÁTIS
            </a>
            <a href="#solutions" style="background: rgba(255, 255, 255, 0.1); color: white; font-size: 1.125rem; font-weight: 600; padding: 18px 32px; border-radius: 12px; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.2);">Ver Soluções</a>
          </div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 48px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 16px; padding: 32px; margin-bottom: 32px; text-align: center;">
            <div style="color: white; font-weight: 700; font-size: 1.25rem; margin-bottom: 8px;">Sistema IA Ativo</div>
            <div style="color: rgba(255, 255, 255, 0.9); font-size: 0.875rem;">Processando 1.2M+ operações/dia</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px; padding: 24px; text-align: center;">
              <div style="color: #10b981; font-size: 2rem; font-weight: 800; margin-bottom: 4px;">+85%</div>
              <div style="color: #cbd5e1; font-size: 0.875rem; font-weight: 500;">Eficiência</div>
            </div>
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 16px; padding: 24px; text-align: center;">
              <div style="color: #3b82f6; font-size: 2rem; font-weight: 800; margin-bottom: 4px;">-60%</div>
              <div style="color: #cbd5e1; font-size: 0.875rem; font-weight: 500;">Tempo</div>
            </div>
          </div>
        </div>
      </div>

      <div class="carousel-slide" data-slide="1" style="position: absolute; width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; opacity: 0; transform: translateX(100%); transition: all 1s ease;">
        <div style="padding-right: 40px;">
          <div style="display: inline-flex; align-items: center; gap: 12px; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 50px; padding: 12px 20px; color: #a78bfa; font-size: 14px; font-weight: 600; margin-bottom: 32px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>
            <span>Cloud & Escalabilidade</span>
          </div>
          <h1 style="font-size: 4.5rem; font-weight: 900; color: #ffffff; margin-bottom: 32px; line-height: 1.1; font-family: Manrope, sans-serif;">
            Infraestrutura que <span style="background: linear-gradient(135deg, #a78bfa, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">escala</span> infinitamente
          </h1>
          <p style="font-size: 1.375rem; color: #cbd5e1; margin-bottom: 40px; line-height: 1.7; font-family: Manrope, sans-serif;">Arquitetura cloud-native com microserviços que se adapta automaticamente ao crescimento do seu negócio, garantindo performance máxima e disponibilidade 24/7.</p>
        </div>
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 48px;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 16px; padding: 32px; margin-bottom: 32px; text-align: center;">
            <div style="color: white; font-weight: 700; font-size: 1.25rem; margin-bottom: 8px;">Cloud Infrastructure</div>
            <div style="color: rgba(255, 255, 255, 0.9); font-size: 0.875rem;">99.9% uptime garantido</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 16px; padding: 24px; text-align: center;">
              <div style="color: #8b5cf6; font-size: 2rem; font-weight: 800; margin-bottom: 4px;">10x</div>
              <div style="color: #cbd5e1; font-size: 0.875rem; font-weight: 500;">Escalabilidade</div>
            </div>
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px; padding: 24px; text-align: center;">
              <div style="color: #10b981; font-size: 2rem; font-weight: 800; margin-bottom: 4px;">99.9%</div>
              <div style="color: #cbd5e1; font-size: 0.875rem; font-weight: 500;">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <div class="carousel-slide" data-slide="2" style="position: absolute; width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; opacity: 0; transform: translateX(100%); transition: all 1s ease;">
        <div style="padding-right: 40px;">
          <div style="display: inline-flex; align-items: center; gap: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 50px; padding: 12px 20px; color: #34d399; font-size: 14px; font-weight: 600; margin-bottom: 32px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
            <span>Analytics & Insights</span>
          </div>
          <h1 style="font-size: 4.5rem; font-weight: 900; color: #ffffff; margin-bottom: 32px; line-height: 1.1; font-family: Manrope, sans-serif;">
            Dados que geram <span style="background: linear-gradient(135deg, #34d399, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">resultados</span> reais
          </h1>
          <p style="font-size: 1.375rem; color: #cbd5e1; margin-bottom: 40px; line-height: 1.7; font-family: Manrope, sans-serif;">Dashboards inteligentes com IA preditiva que transformam big data em insights acionáveis, identificando oportunidades de crescimento e otimização em tempo real.</p>
        </div>
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 48px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 16px; padding: 32px; margin-bottom: 32px; text-align: center;">
            <div style="color: white; font-weight: 700; font-size: 1.25rem; margin-bottom: 8px;">Analytics Dashboard</div>
            <div style="color: rgba(255, 255, 255, 0.9); font-size: 0.875rem;">Processando 50TB+ dados/mês</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px; padding: 24px; text-align: center;">
              <div style="color: #10b981; font-size: 2rem; font-weight: 800; margin-bottom: 4px;">50TB</div>
              <div style="color: #cbd5e1; font-size: 0.875rem; font-weight: 500;">Dados/mês</div>
            </div>
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 16px; padding: 24px; text-align: center;">
              <div style="color: #3b82f6; font-size: 2rem; font-weight: 800; margin-bottom: 4px;">Real-time</div>
              <div style="color: #cbd5e1; font-size: 0.875rem; font-weight: 500;">Insights</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 16px;">
      <button onclick="goToSlide(0)" class="nav-dot active" data-slide="0" style="width: 14px; height: 14px; border-radius: 50%; background: #3b82f6; border: none; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);"></button>
      <button onclick="goToSlide(1)" class="nav-dot" data-slide="1" style="width: 14px; height: 14px; border-radius: 50%; background: rgba(255, 255, 255, 0.3); border: none; cursor: pointer; transition: all 0.3s ease;"></button>
      <button onclick="goToSlide(2)" class="nav-dot" data-slide="2" style="width: 14px; height: 14px; border-radius: 50%; background: rgba(255, 255, 255, 0.3); border: none; cursor: pointer; transition: all 0.3s ease;"></button>
    </div>
  </div>
</section>

<!-- Seção Quem é a Vynlo Tech -->
<section class="about-vynlo-section">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    <div class="about-content">
      <!-- Banner Lateral -->
      <div class="about-banner">
        <div style="position: relative; z-index: 2;">
          <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; backdrop-filter: blur(10px);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M12 2v20m8-10H4"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h3 style="color: white; font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; font-family: Manrope, sans-serif;">Tecnologia de Ponta</h3>
          <p style="color: rgba(255,255,255,0.9); font-size: 1rem; margin-bottom: 24px; font-family: Manrope, sans-serif;">Desenvolvemos soluções que transformam negócios</p>
          <div style="background: rgba(255,255,255,0.2); border-radius: 12px; padding: 20px; backdrop-filter: blur(10px);">
            <div style="color: white; font-size: 2rem; font-weight: 800; margin-bottom: 4px;">2.500+</div>
            <div style="color: rgba(255,255,255,0.8); font-size: 0.875rem;">Empresas Atendidas</div>
          </div>
        </div>
      </div>
      
      <!-- Texto Explicativo -->
      <div class="about-text">
        <h2>Quem é a Vynlo Tech?</h2>
        <p>
          Somos uma <strong style="color: #3b82f6;">empresa de tecnologia especializada</strong> em soluções empresariais que revolucionam a gestão de negócios. Com mais de 5 anos de experiência, desenvolvemos sistemas robustos e intuitivos.
        </p>
        <p>
          Nossa missão é <strong style="color: #3b82f6;">democratizar a tecnologia enterprise</strong>, oferecendo ferramentas de nível corporativo para empresas de todos os tamanhos. Utilizamos as mesmas tecnologias de gigantes como Netflix e Google.
        </p>
        <p>
          Com infraestrutura AWS, segurança bancária e suporte 24/7, garantimos que nossos clientes tenham acesso à <strong style="color: #3b82f6;">melhor tecnologia do mercado</strong> com o melhor custo-benefício.
        </p>
        
        <!-- Estatísticas -->
        <div class="about-stats">
          <div class="about-stat">
            <div class="about-stat-number">99.9%</div>
            <div class="about-stat-label">Uptime</div>
          </div>
          <div class="about-stat">
            <div class="about-stat-number">24/7</div>
            <div class="about-stat-label">Suporte</div>
          </div>
          <div class="about-stat">
            <div class="about-stat-number">5+</div>
            <div class="about-stat-label">Anos</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="security" style="background: white; padding: 120px 0; position: relative;">
    <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px;">
      <div style="text-align: center; margin-bottom: 80px;">
        <div style="display: inline-flex; align-items: center; gap: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 50px; padding: 12px 24px; color: #10b981; font-size: 14px; font-weight: 600; margin-bottom: 32px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Segurança Enterprise</span>
        </div>
        <h2 style="font-size: 4rem; font-weight: 900; color: #1f2937; margin-bottom: 32px; line-height: 1.1; font-family: Manrope, sans-serif;">
          Proteção de <span style="background: linear-gradient(135deg, #10b981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Nível Bancário</span>
        </h2>
        <p style="font-size: 1.375rem; color: #6b7280; max-width: 900px; margin: 0 auto; font-family: Manrope, sans-serif; line-height: 1.6;">
          Seus dados protegidos com os mais altos padrões de segurança do mercado
        </p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 40px;">
        <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); border: 1px solid rgba(16, 185, 129, 0.1); transition: all 0.4s ease; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 30px 60px rgba(16, 185, 129, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.08)'">
          <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05)); border-radius: 0 0 0 100px;"></div>
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
            <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1s-1 .448-1 1v6c0 .552.448 1 1 1z"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">Criptografia AES-256</h3>
              <p style="color: #10b981; font-size: 0.875rem; font-weight: 600; margin: 0;">Padrão Militar</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif; margin-bottom: 20px;">Todos os dados são criptografados com AES-256, o mesmo padrão usado por bancos e governos para proteger informações ultra-secretas.</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">256-bit</span>
            <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">End-to-End</span>
          </div>
        </div>
        
        <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); border: 1px solid rgba(59, 130, 246, 0.1); transition: all 0.4s ease; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 30px 60px rgba(59, 130, 246, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.08)'">
          <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05)); border-radius: 0 0 0 100px;"></div>
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
            <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">AWS Infrastructure</h3>
              <p style="color: #3b82f6; font-size: 0.875rem; font-weight: 600; margin: 0;">99.9% Uptime</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif; margin-bottom: 20px;">Hospedado na infraestrutura AWS com redundância global, backups automáticos e recuperação de desastres em múltiplas regiões.</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">Multi-Region</span>
            <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">Auto-Backup</span>
          </div>
        </div>
        
        <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); border: 1px solid rgba(139, 92, 246, 0.1); transition: all 0.4s ease; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 30px 60px rgba(139, 92, 246, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.08)'">
          <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05)); border-radius: 0 0 0 100px;"></div>
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
            <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">Conformidade LGPD</h3>
              <p style="color: #8b5cf6; font-size: 0.875rem; font-weight: 600; margin: 0;">100% Compliance</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif; margin-bottom: 20px;">Total conformidade com LGPD, ISO 27001 e SOC 2. Auditoria contínua e relatórios de compliance para garantir proteção legal.</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <span style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">LGPD</span>
            <span style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">ISO 27001</span>
          </div>
        </div>
        
        <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); border: 1px solid rgba(245, 158, 11, 0.1); transition: all 0.4s ease; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 30px 60px rgba(245, 158, 11, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.08)'">
          <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05)); border-radius: 0 0 0 100px;"></div>
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
            <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">Auditoria Completa</h3>
              <p style="color: #f59e0b; font-size: 0.875rem; font-weight: 600; margin: 0;">Logs Detalhados</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif; margin-bottom: 20px;">Registro completo de todas as ações com timestamp, IP e usuário. Relatórios de auditoria em tempo real para compliance total.</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">Real-time</span>
            <span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">Immutable</span>
          </div>
        </div>
        
        <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); border: 1px solid rgba(239, 68, 68, 0.1); transition: all 0.4s ease; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 30px 60px rgba(239, 68, 68, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.08)'">
          <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05)); border-radius: 0 0 0 100px;"></div>
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
            <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">Firewall Avançado</h3>
              <p style="color: #ef4444; font-size: 0.875rem; font-weight: 600; margin: 0;">Proteção 24/7</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif; margin-bottom: 20px;">WAF (Web Application Firewall) com IA para detectar e bloquear ataques em tempo real. Proteção contra DDoS, SQL injection e XSS.</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">Anti-DDoS</span>
            <span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">AI-Powered</span>
          </div>
        </div>
        
        <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); border: 1px solid rgba(6, 182, 212, 0.1); transition: all 0.4s ease; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 30px 60px rgba(6, 182, 212, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.08)'">
          <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05)); border-radius: 0 0 0 100px;"></div>
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
            <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #06b6d4, #0891b2); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(6, 182, 212, 0.3);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <path d="m17 11 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">Controle de Acesso</h3>
              <p style="color: #06b6d4; font-size: 0.875rem; font-weight: 600; margin: 0;">Multi-Factor Auth</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif; margin-bottom: 20px;">Autenticação multifator (MFA), controle de acesso baseado em funções (RBAC) e sessões seguras com timeout automático.</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <span style="background: rgba(6, 182, 212, 0.1); color: #06b6d4; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">MFA</span>
            <span style="background: rgba(6, 182, 212, 0.1); color: #06b6d4; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">RBAC</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="segments" style="background: linear-gradient(135deg, #1e40af 0%, #1e293b 50%, #0f172a 100%); padding: 100px 0; position: relative; overflow: hidden;">
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%);"></div>
    
    <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 2;">
      <div style="text-align: center; margin-bottom: 60px;">
        <h2 style="font-size: 3.5rem; font-weight: 900; color: #ffffff; margin-bottom: 24px; line-height: 1.1; font-family: Manrope, sans-serif;">
          Nossos <span style="background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Segmentos</span>
        </h2>
        <p style="font-size: 1.25rem; color: #cbd5e1; max-width: 600px; margin: 0 auto; font-family: Manrope, sans-serif;">
          Soluções especializadas para cada tipo de negócio
        </p>
      </div>
      
      <!-- Carrossel de Abas dos Segmentos -->
      <div style="position: relative; max-width: 1000px; margin: 0 auto 40px;">
        <!-- Botões de Navegação -->
        <button onclick="previousSegment()" style="position: absolute; left: -60px; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50%; color: white; cursor: pointer; transition: all 0.3s ease; z-index: 10; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.background='rgba(59, 130, 246, 0.3)'; this.style.transform='translateY(-50%) scale(1.1)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(-50%) scale(1)'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        <button onclick="nextSegment()" style="position: absolute; right: -60px; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50%; color: white; cursor: pointer; transition: all 0.3s ease; z-index: 10; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.background='rgba(59, 130, 246, 0.3)'; this.style.transform='translateY(-50%) scale(1.1)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(-50%) scale(1)'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
        
        <!-- Container do Carrossel -->
        <div style="overflow: hidden; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border-radius: 16px; padding: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
          <div id="segments-carousel" style="display: flex; transition: transform 0.5s ease; gap: 8px;">
            <button class="segment-tab active" data-segment="taste" onclick="showSegmentTab('taste')" style="min-width: 180px; padding: 16px 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 12px; font-family: Manrope, sans-serif; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                <path d="M7 2v20"/>
                <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
              </svg>
              Restaurantes
            </button>
            
            <button class="segment-tab" data-segment="bot" onclick="showSegmentTab('bot')" style="min-width: 180px; padding: 16px 20px; background: transparent; color: #cbd5e1; border: none; border-radius: 12px; font-family: Manrope, sans-serif; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 8V4H8"/>
                <rect width="16" height="12" x="4" y="8" rx="2"/>
                <path d="M2 14h2"/>
                <path d="M20 14h2"/>
                <path d="M15 13v2"/>
                <path d="M9 13v2"/>
              </svg>
              IA Bot
            </button>
            
            <button class="segment-tab" data-segment="ekklesia" onclick="showSegmentTab('ekklesia')" style="min-width: 180px; padding: 16px 20px; background: transparent; color: #cbd5e1; border: none; border-radius: 12px; font-family: Manrope, sans-serif; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 21l4-7 4 7"/>
                <path d="M12 2v7"/>
                <path d="M3 6l2.5 2.5L8 6"/>
                <path d="M16 6l2.5 2.5L21 6"/>
              </svg>
              Igrejas
            </button>
            
            <button class="segment-tab" data-segment="barber" onclick="showSegmentTab('barber')" style="min-width: 180px; padding: 16px 20px; background: transparent; color: #cbd5e1; border: none; border-radius: 12px; font-family: Manrope, sans-serif; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 12h12"/>
                <path d="M6 20V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-3-6 3z"/>
              </svg>
              Barbearias
            </button>
            
            <button class="segment-tab" data-segment="pet" onclick="showSegmentTab('pet')" style="min-width: 180px; padding: 16px 20px; background: transparent; color: #cbd5e1; border: none; border-radius: 12px; font-family: Manrope, sans-serif; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 5a3 3 0 1 0-6 0c0 1.61 1.16 2.94 2.69 3.24A6.93 6.93 0 0 0 8 12"/>
                <path d="M16 5a3 3 0 1 1 6 0c0 1.61-1.16 2.94-2.69 3.24A6.93 6.93 0 0 1 16 12"/>
                <path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
                <path d="M12 11a6 6 0 0 0-6 6v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a6 6 0 0 0-6-6Z"/>
              </svg>
              Petshops
            </button>
            
            <button class="segment-tab" data-segment="edu" onclick="showSegmentTab('edu')" style="min-width: 180px; padding: 16px 20px; background: transparent; color: #cbd5e1; border: none; border-radius: 12px; font-family: Manrope, sans-serif; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              Educação
            </button>
            
            <button class="segment-tab" data-segment="field" onclick="showSegmentTab('field')" style="min-width: 180px; padding: 16px 20px; background: transparent; color: #cbd5e1; border: none; border-radius: 12px; font-family: Manrope, sans-serif; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              Serviços
            </button>
            
            <button class="segment-tab" data-segment="health" onclick="showSegmentTab('health')" style="min-width: 180px; padding: 16px 20px; background: transparent; color: #cbd5e1; border: none; border-radius: 12px; font-family: Manrope, sans-serif; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
                <path d="M12 5L8 21l4-7 4 7-4-16"/>
              </svg>
              Saúde
            </button>
          </div>
        </div>
      </div>
      
      <!-- Card Expansível com Informações -->
      <div id="segment-details" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 0; overflow: hidden; max-height: 0; transition: all 0.5s ease;">
        <div id="segment-content-new" style="padding: 48px;"></div>
      </div>
    </div>
  </section>

  <section id="stack" style="background: #f8fafc; padding: 120px 0; position: relative; overflow: hidden;">

    
    <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 2;">
      <div style="text-align: center; margin-bottom: 80px;">
        <div style="display: inline-flex; align-items: center; gap: 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 50px; padding: 12px 24px; color: #60a5fa; font-size: 14px; font-weight: 600; margin-bottom: 32px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20m8-10H4"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>Tecnologia Enterprise</span>
        </div>
        <h2 style="font-size: 4rem; font-weight: 900; color: #1f2937; margin-bottom: 32px; line-height: 1.1; font-family: Manrope, sans-serif;">
          Stack de <span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Nível Mundial</span>
        </h2>
        <p style="font-size: 1.375rem; color: #6b7280; max-width: 900px; margin: 0 auto; font-family: Manrope, sans-serif; line-height: 1.6;">
          Tecnologias modernas para máxima performance e escalabilidade
        </p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 40px;">
        <div style="background: white; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #61dafb, #21d4fd); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">React + Next.js</h3>
              <p style="color: #6b7280; font-size: 0.875rem; margin: 0; font-family: Manrope, sans-serif;">Frontend Moderno</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif;">Interface responsiva e performática</p>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #f89820, #ed8936); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">Java + Spring Boot</h3>
              <p style="color: #6b7280; font-size: 0.875rem; margin: 0; font-family: Manrope, sans-serif;">Backend Enterprise</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif;">Arquitetura robusta e escalável</p>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #336791, #2d5aa0); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">PostgreSQL + Redis</h3>
              <p style="color: #6b7280; font-size: 0.875rem; margin: 0; font-family: Manrope, sans-serif;">Dados Seguros</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif;">Banco de dados confiável com cache rápido</p>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ff9900, #ff6600); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">AWS + Docker</h3>
              <p style="color: #6b7280; font-size: 0.875rem; margin: 0; font-family: Manrope, sans-serif;">Cloud Native</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif;">Infraestrutura escalável na nuvem</p>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">Segurança Avançada</h3>
              <p style="color: #6b7280; font-size: 0.875rem; margin: 0; font-family: Manrope, sans-serif;">Máxima Proteção</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif;">Criptografia e proteção de dados</p>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; font-family: Manrope, sans-serif;">Monitoramento</h3>
              <p style="color: #6b7280; font-size: 0.875rem; margin: 0; font-family: Manrope, sans-serif;">Observabilidade 24/7</p>
            </div>
          </div>
          <p style="color: #6b7280; line-height: 1.6; font-family: Manrope, sans-serif;">Logs e métricas em tempo real</p>
        </div>
      </div>
      

    </div>
  </section>

  <section id="why-vynlo" style="background: linear-gradient(135deg, #1e40af 0%, #1e293b 50%, #0f172a 100%); padding: 120px 0; position: relative; overflow: hidden;">
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%);"></div>
    
    <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 2;">
      <div style="text-align: center; margin-bottom: 80px;">
        <div style="display: inline-flex; align-items: center; gap: 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 50px; padding: 12px 24px; color: #60a5fa; font-size: 14px; font-weight: 600; margin-bottom: 32px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Vantagem Competitiva</span>
        </div>
        <h2 style="font-size: 4rem; font-weight: 900; color: #ffffff; margin-bottom: 32px; line-height: 1.1; font-family: Manrope, sans-serif;">
          Por que Escolher a <span style="background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Vynlo Tech?</span>
        </h2>
        <p style="font-size: 1.375rem; color: #cbd5e1; max-width: 900px; margin: 0 auto; font-family: Manrope, sans-serif; line-height: 1.6;">
          Mais que um fornecedor de software, somos seu parceiro estratégico para o crescimento sustentável
        </p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 80px;">
        <!-- Lado Esquerdo: Imagem/Gráfico -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 48px; text-align: center;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 20px; padding: 40px; margin-bottom: 32px;">
            <div style="color: white; font-size: 3rem; font-weight: 900; margin-bottom: 8px; font-family: Manrope, sans-serif;">+300%</div>
            <div style="color: rgba(255, 255, 255, 0.9); font-size: 1.125rem; font-weight: 600;">ROI Médio dos Clientes</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px; padding: 20px; text-align: center;">
              <div style="color: #10b981; font-size: 1.75rem; font-weight: 800; margin-bottom: 4px;">98%</div>
              <div style="color: #cbd5e1; font-size: 0.875rem;">Satisfação</div>
            </div>
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 16px; padding: 20px; text-align: center;">
              <div style="color: #3b82f6; font-size: 1.75rem; font-weight: 800; margin-bottom: 4px;">24/7</div>
              <div style="color: #cbd5e1; font-size: 0.875rem;">Suporte</div>
            </div>
          </div>
        </div>
        
        <!-- Lado Direito: Explicação -->
        <div>
          <h3 style="color: #ffffff; font-size: 2.5rem; font-weight: 800; margin-bottom: 24px; font-family: Manrope, sans-serif;">Resultados Comprovados</h3>
          <p style="color: #cbd5e1; font-size: 1.25rem; line-height: 1.7; margin-bottom: 32px; font-family: Manrope, sans-serif;">
            Nossos clientes não apenas adotam tecnologia, eles <strong style="color: #60a5fa;">transformam seus negócios</strong>. Com mais de 2.500 empresas atendidas, temos dados concretos que comprovam o impacto das nossas soluções.
          </p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Aumento médio de 150% nas vendas no primeiro ano</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Redução de 60% no tempo gasto em tarefas administrativas</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #8b5cf6; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">ROI positivo em menos de 3 meses de implementação</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 80px;">
        <!-- Lado Esquerdo: Explicação -->
        <div>
          <h3 style="color: #ffffff; font-size: 2.5rem; font-weight: 800; margin-bottom: 24px; font-family: Manrope, sans-serif;">Tecnologia de Ponta</h3>
          <p style="color: #cbd5e1; font-size: 1.25rem; line-height: 1.7; margin-bottom: 32px; font-family: Manrope, sans-serif;">
            Não desenvolvemos apenas software, criamos <strong style="color: #60a5fa;">experiências digitais excepcionais</strong>. Nossa stack tecnológica é a mesma utilizada por gigantes como Netflix, Spotify e Google.
          </p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Arquitetura cloud-native com 99.9% de disponibilidade</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Inteligência artificial integrada para automação inteligente</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #8b5cf6; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Segurança bancária com criptografia de ponta</span>
            </div>
          </div>
        </div>
        
        <!-- Lado Direito: Tecnologias -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 48px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 32px;">
            <div style="text-align: center;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #61dafb, #21d4fd); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                </svg>
              </div>
              <div style="color: #61dafb; font-size: 0.875rem; font-weight: 600;">React</div>
            </div>
            <div style="text-align: center;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #f89820, #ed8936); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <div style="color: #f89820; font-size: 0.875rem; font-weight: 600;">Java</div>
            </div>
            <div style="text-align: center;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ff9900, #ff6600); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                </svg>
              </div>
              <div style="color: #ff9900; font-size: 0.875rem; font-weight: 600;">AWS</div>
            </div>
          </div>
          <div style="text-align: center;">
            <div style="color: #ffffff; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">Stack Enterprise</div>
            <div style="color: #cbd5e1; font-size: 0.875rem;">Tecnologias utilizadas por Fortune 500</div>
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 80px;">
        <!-- Lado Esquerdo: Suporte -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 48px; text-align: center;">
          <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <path d="m17 11 2 2 4-4"/>
            </svg>
          </div>
          <div style="color: #ffffff; font-size: 1.5rem; font-weight: 700; margin-bottom: 12px;">Suporte Especializado</div>
          <div style="color: #cbd5e1; font-size: 1rem; margin-bottom: 24px;">Equipe técnica dedicada 24/7</div>
          <div style="display: flex; justify-content: center; gap: 20px;">
            <div style="text-align: center;">
              <div style="color: #8b5cf6; font-size: 1.5rem; font-weight: 800;"><2h</div>
              <div style="color: #cbd5e1; font-size: 0.75rem;">Tempo Resposta</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #10b981; font-size: 1.5rem; font-weight: 800;">100%</div>
              <div style="color: #cbd5e1; font-size: 0.75rem;">Resolução</div>
            </div>
          </div>
        </div>
        
        <!-- Lado Direito: Explicação -->
        <div>
          <h3 style="color: #ffffff; font-size: 2.5rem; font-weight: 800; margin-bottom: 24px; font-family: Manrope, sans-serif;">Parceria Verdadeira</h3>
          <p style="color: #cbd5e1; font-size: 1.25rem; line-height: 1.7; margin-bottom: 32px; font-family: Manrope, sans-serif;">
            Não vendemos apenas software, construímos <strong style="color: #60a5fa;">relacionamentos duradouros</strong>. Nossa equipe de especialistas está sempre disponível para garantir seu sucesso.
          </p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Implementação guiada com especialista dedicado</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Treinamento completo para toda sua equipe</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #8b5cf6; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Atualizações e melhorias contínuas sem custo adicional</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 80px;">
        <!-- Lado Esquerdo: Explicação -->
        <div>
          <h3 style="color: #ffffff; font-size: 2.5rem; font-weight: 800; margin-bottom: 24px; font-family: Manrope, sans-serif;">Implementação Gratuita</h3>
          <p style="color: #cbd5e1; font-size: 1.25rem; line-height: 1.7; margin-bottom: 32px; font-family: Manrope, sans-serif;">
            Nossa equipe cuida de <strong style="color: #60a5fa;">toda a implementação sem custo adicional</strong>. Configuração, migração de dados, treinamento e suporte completo incluídos no plano.
          </p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Economia de R$ 2.500 em implementação</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Migração completa dos dados existentes</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #8b5cf6; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Treinamento personalizado para sua equipe</span>
            </div>
          </div>
        </div>
        
        <!-- Lado Direito: Implementação -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 48px; text-align: center;">
          <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1s-1 .448-1 1v6c0 .552.448 1 1 1z"/>
            </svg>
          </div>
          <div style="color: #ffffff; font-size: 1.5rem; font-weight: 700; margin-bottom: 12px;">Setup Completo</div>
          <div style="color: #cbd5e1; font-size: 1rem; margin-bottom: 24px;">Implementação profissional</div>
          <div style="display: flex; justify-content: center; gap: 20px;">
            <div style="text-align: center;">
              <div style="color: #10b981; font-size: 1.5rem; font-weight: 800;">R$ 0</div>
              <div style="color: #cbd5e1; font-size: 0.75rem;">Custo Setup</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #10b981; font-size: 1.5rem; font-weight: 800;">3-7</div>
              <div style="color: #cbd5e1; font-size: 0.75rem;">Dias</div>
            </div>
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 80px;">
        <!-- Lado Esquerdo: 30 Dias Teste -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 48px; text-align: center;">
          <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <div style="color: #ffffff; font-size: 1.5rem; font-weight: 700; margin-bottom: 12px;">Período de Avaliação</div>
          <div style="color: #cbd5e1; font-size: 1rem; margin-bottom: 24px;">Teste sem compromisso</div>
          <div style="display: flex; justify-content: center; gap: 20px;">
            <div style="text-align: center;">
              <div style="color: #3b82f6; font-size: 1.5rem; font-weight: 800;">30</div>
              <div style="color: #cbd5e1; font-size: 0.75rem;">Dias</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #3b82f6; font-size: 1.5rem; font-weight: 800;">0%</div>
              <div style="color: #cbd5e1; font-size: 0.75rem;">Risco</div>
            </div>
          </div>
        </div>
        
        <!-- Lado Direito: Explicação -->
        <div>
          <h3 style="color: #ffffff; font-size: 2.5rem; font-weight: 800; margin-bottom: 24px; font-family: Manrope, sans-serif;">30 Dias de Teste</h3>
          <p style="color: #cbd5e1; font-size: 1.25rem; line-height: 1.7; margin-bottom: 32px; font-family: Manrope, sans-serif;">
            Teste todas as funcionalidades por <strong style="color: #60a5fa;">30 dias completos</strong> sem compromisso. Avalie o impacto real no seu negócio antes de decidir.
          </p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Acesso completo a todas as funcionalidades</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Suporte prioritário durante o período de teste</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Cancele a qualquer momento sem penalidades</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
        <!-- Lado Esquerdo: Explicação -->
        <div>
          <h3 style="color: #ffffff; font-size: 2.5rem; font-weight: 800; margin-bottom: 24px; font-family: Manrope, sans-serif;">Garantia de Satisfação</h3>
          <p style="color: #cbd5e1; font-size: 1.25rem; line-height: 1.7; margin-bottom: 32px; font-family: Manrope, sans-serif;">
            Temos tanta confiança na nossa solução que oferecemos <strong style="color: #60a5fa;">garantia de 60 dias</strong>. Se não ficar 100% satisfeito, devolvemos todo o investimento.
          </p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Devolução de 100% do valor investido</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Processo simples e sem burocracias</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%;"></div>
              <span style="color: #e2e8f0; font-size: 1.125rem; font-family: Manrope, sans-serif;">Seus dados permanecem seguros</span>
            </div>
          </div>
        </div>
        
        <!-- Lado Direito: Garantia -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 48px; text-align: center;">
          <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div style="color: #ffffff; font-size: 1.5rem; font-weight: 700; margin-bottom: 12px;">Garantia Total</div>
          <div style="color: #cbd5e1; font-size: 1rem; margin-bottom: 24px;">Satisfação garantida</div>
          <div style="display: flex; justify-content: center; gap: 20px;">
            <div style="text-align: center;">
              <div style="color: #22c55e; font-size: 1.5rem; font-weight: 800;">100%</div>
              <div style="color: #cbd5e1; font-size: 0.75rem;">Garantia</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #22c55e; font-size: 1.5rem; font-weight: 800;">60</div>
              <div style="color: #cbd5e1; font-size: 0.75rem;">Dias</div>
            </div>
          </div>
        </div>
      </div>
      

    </div>
  </section>

  <section id="faq-new" style="background: white; padding: 120px 0; position: relative;">
    <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px;">
      <div style="text-align: center; margin-bottom: 80px;">
        <div style="display: inline-flex; align-items: center; gap: 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 50px; padding: 12px 24px; color: #3b82f6; font-size: 14px; font-weight: 600; margin-bottom: 32px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
          <span>Dúvidas Frequentes</span>
        </div>
        <h2 style="font-size: 4rem; font-weight: 900; color: #1f2937; margin-bottom: 32px; line-height: 1.1; font-family: Manrope, sans-serif;">
          Tudo que Você Precisa <span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Saber</span>
        </h2>
        <p style="font-size: 1.375rem; color: #6b7280; max-width: 800px; margin: 0 auto; font-family: Manrope, sans-serif; line-height: 1.6;">
          Respostas claras e diretas para as principais dúvidas sobre a Vynlo Tech
        </p>
      </div>
      
      <!-- FAQ Grid -->
      <div style="max-width: 1200px; margin: 0 auto;">
        <!-- Linha 1 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 24px;">
          <div class="faq-item-new" style="background: #f8fafc; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(59, 130, 246, 0.2); cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaqNew(1)" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(59, 130, 246, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.1)'">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <h3 style="color: #1f2937; font-size: 1.25rem; font-weight: 700; margin: 0; font-family: Manrope, sans-serif;">Quanto tempo leva a implementação?</h3>
              </div>
              <svg id="faq-icon-new-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="transition: transform 0.3s ease; flex-shrink: 0;">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
            </div>
            <div id="faq-content-new-1" style="color: #374151; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease; padding-top: 0;">
              <div style="padding-top: 16px; border-top: 1px solid #d1d5db;">
                A implementação das soluções Vynlo Tech leva de <strong style="color: #1f2937;">3 a 7 dias úteis</strong>, incluindo configuração completa, migração de dados, treinamento da equipe e testes. Nossa equipe técnica acompanha todo o processo para garantir uma transição suave e sem interrupções no seu negócio.
              </div>
            </div>
          </div>
          
          <div class="faq-item-new" style="background: #f8fafc; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(16, 185, 129, 0.2); cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaqNew(2)" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(16, 185, 129, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.1)'">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1s-1 .448-1 1v6c0 .552.448 1 1 1z"/>
                  </svg>
                </div>
                <h3 style="color: #1f2937; font-size: 1.25rem; font-weight: 700; margin: 0; font-family: Manrope, sans-serif;">Preciso de conhecimento técnico?</h3>
              </div>
              <svg id="faq-icon-new-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="transition: transform 0.3s ease; flex-shrink: 0;">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
            </div>
            <div id="faq-content-new-2" style="color: #374151; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease; padding-top: 0;">
              <div style="padding-top: 16px; border-top: 1px solid #d1d5db;">
                <strong style="color: #1f2937;">Não!</strong> As soluções Vynlo Tech foram desenvolvidas para serem intuitivas e fáceis de usar. Oferecemos treinamento completo para sua equipe e suporte técnico 24/7. A interface é amigável e não requer conhecimentos técnicos avançados. Mesmo quem nunca usou um sistema consegue operar facilmente.
              </div>
            </div>
          </div>
        </div>
        
        <!-- Linha 2 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 24px;">
          <div class="faq-item-new" style="background: #f8fafc; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(139, 92, 246, 0.2); cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaqNew(3)" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(139, 92, 246, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.1)'">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h3 style="color: #1f2937; font-size: 1.25rem; font-weight: 700; margin: 0; font-family: Manrope, sans-serif;">Os dados ficam seguros?</h3>
              </div>
              <svg id="faq-icon-new-3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" style="transition: transform 0.3s ease; flex-shrink: 0;">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
            </div>
            <div id="faq-content-new-3" style="color: #374151; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease; padding-top: 0;">
              <div style="padding-top: 16px; border-top: 1px solid #d1d5db;">
                <strong style="color: #1f2937;">Absolutamente!</strong> Utilizamos criptografia de ponta, infraestrutura AWS com 99.9% de uptime, backups automáticos diários e conformidade total com LGPD. Seus dados são protegidos com os mais altos padrões de segurança do mercado, os mesmos utilizados por bancos digitais.
              </div>
            </div>
          </div>
          
          <div class="faq-item-new" style="background: #f8fafc; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(245, 158, 11, 0.2); cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaqNew(4)" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(245, 158, 11, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.1)'">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <h3 style="color: #1f2937; font-size: 1.25rem; font-weight: 700; margin: 0; font-family: Manrope, sans-serif;">Qual o investimento mensal?</h3>
              </div>
              <svg id="faq-icon-new-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" style="transition: transform 0.3s ease; flex-shrink: 0;">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
            </div>
            <div id="faq-content-new-4" style="color: #374151; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease; padding-top: 0;">
              <div style="padding-top: 16px; border-top: 1px solid #d1d5db;">
                Os planos começam a partir de <strong style="color: #1f2937;">R$ 97/mês</strong> e variam conforme o tamanho do estabelecimento e funcionalidades necessárias. Oferecemos análise gratuita para criar uma proposta personalizada para seu negócio. Sem taxas ocultas ou surpresas.
              </div>
            </div>
          </div>
        </div>
        
        <!-- Linha 3 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 24px;">
          <div class="faq-item-new" style="background: #f8fafc; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(236, 72, 153, 0.2); cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaqNew(5)" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(236, 72, 153, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.1)'">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #ec4899, #db2777); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                  </svg>
                </div>
                <h3 style="color: #1f2937; font-size: 1.25rem; font-weight: 700; margin: 0; font-family: Manrope, sans-serif;">Funciona offline?</h3>
              </div>
              <svg id="faq-icon-new-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" style="transition: transform 0.3s ease; flex-shrink: 0;">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
            </div>
            <div id="faq-content-new-5" style="color: #374151; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease; padding-top: 0;">
              <div style="padding-top: 16px; border-top: 1px solid #d1d5db;">
                <strong style="color: #1f2937;">Sim!</strong> Nossas soluções possuem modo offline que permite continuar operando mesmo sem internet. Os dados são sincronizados automaticamente quando a conexão é restabelecida, garantindo continuidade total do negócio sem perdas.
              </div>
            </div>
          </div>
          
          <div class="faq-item-new" style="background: #f8fafc; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(6, 182, 212, 0.2); cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaqNew(6)" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(6, 182, 212, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.1)'">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #06b6d4, #0891b2); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M12 2a10 10 0 1 0 10 10"/>
                  </svg>
                </div>
                <h3 style="color: #1f2937; font-size: 1.25rem; font-weight: 700; margin: 0; font-family: Manrope, sans-serif;">Posso cancelar quando quiser?</h3>
              </div>
              <svg id="faq-icon-new-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" style="transition: transform 0.3s ease; flex-shrink: 0;">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
            </div>
            <div id="faq-content-new-6" style="color: #374151; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease; padding-top: 0;">
              <div style="padding-top: 16px; border-top: 1px solid #d1d5db;">
                <strong style="color: #1f2937;">Sim!</strong> Não temos fidelidade obrigatória. Você pode cancelar a qualquer momento com 30 dias de antecedência. Garantimos a exportação completa dos seus dados e uma transição tranquila. Liberdade total para decidir.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- CTA Final -->
      <div style="text-align: center; margin-top: 80px;">
        <div style="background: #f8fafc; border-radius: 24px; padding: 48px; max-width: 800px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(59, 130, 246, 0.2);">
          <h3 style="color: #1f2937; font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; font-family: Manrope, sans-serif;">Ainda tem Dúvidas?</h3>
          <p style="color: #374151; margin-bottom: 32px; font-size: 1.25rem; font-family: Manrope, sans-serif;">Nossa equipe está pronta para esclarecer todas as suas questões</p>
          <a href="/landingpages/contatolandprincipal" style="display: inline-flex; align-items: center; gap: 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 1.25rem; font-weight: 600; padding: 18px 36px; border-radius: 12px; text-decoration: none; box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Falar com Especialista
          </a>
        </div>
      </div>
    </div>
  </section>



  <section id="funnel" style="background: white; padding: 120px 0; position: relative;">
    <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px;">
      <div style="text-align: center; margin-bottom: 80px;">
        <div style="display: inline-flex; align-items: center; gap: 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 50px; padding: 12px 24px; color: #3b82f6; font-size: 14px; font-weight: 600; margin-bottom: 32px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1s-1 .448-1 1v6c0 .552.448 1 1 1z"/>
          </svg>
          <span>Processo Simplificado</span>
        </div>
        <h2 style="font-size: 4rem; font-weight: 900; color: #1f2937; margin-bottom: 32px; line-height: 1.1; font-family: Manrope, sans-serif;">
          Do Primeiro Contato ao <span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Sucesso Total</span>
        </h2>
        <p style="font-size: 1.375rem; color: #6b7280; max-width: 900px; margin: 0 auto; font-family: Manrope, sans-serif; line-height: 1.6;">
          Mesmo sem experiência em sistemas, você terá uma transição suave e resultados desde o primeiro dia
        </p>
      </div>
      
      <!-- Linha do Tempo Interativa -->
      <div style="position: relative; max-width: 1200px; margin: 0 auto;">
        <!-- Linha Central -->
        <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #f59e0b); transform: translateY(-50%); z-index: 1;"></div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 80px;">
          <!-- Etapa 1: Análise Estratégica -->
          <div style="display: flex; align-items: center; gap: 40px; position: relative; animation: slideInLeft 0.8s ease-out;">
            <div style="background: white; border: 2px solid #10b981; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(16, 185, 129, 0.1); flex: 1; position: relative; z-index: 2; transition: all 0.4s ease;" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 30px 60px rgba(16, 185, 129, 0.2)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 20px 40px rgba(16, 185, 129, 0.1)'">
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 16px; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6"/>
                    <path d="m21 12-6-3-6 3-6-3"/>
                  </svg>
                </div>
                <div>
                  <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-block; margin-bottom: 8px;">Etapa 1</div>
                  <h3 style="color: #1f2937; font-size: 1.5rem; font-weight: 700; margin: 0; font-family: Manrope, sans-serif;">Análise Estratégica</h3>
                </div>
              </div>
              <p style="color: #6b7280; font-size: 1.125rem; margin-bottom: 20px; font-family: Manrope, sans-serif;">Mapeamos seu negócio atual, identificamos gargalos e oportunidades de crescimento. Totalmente gratuito.</p>
              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">30 min</span>
                <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">100% Gratuito</span>
                <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">Sem Compromisso</span>
              </div>
            </div>
            <div style="width: 20px; height: 20px; background: #10b981; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 0 2px #10b981; position: absolute; right: -10px; z-index: 3; animation: bounce 2s infinite;"></div>
          </div>
          
          <!-- Etapa 2: Demonstração Personalizada -->
          <div style="display: flex; align-items: center; gap: 40px; position: relative; flex-direction: row-reverse; animation: slideInRight 0.8s ease-out 0.2s both;">
            <div style="background: white; border: 2px solid #3b82f6; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1); flex: 1; position: relative; z-index: 2; transition: all 0.4s ease;" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 30px 60px rgba(59, 130, 246, 0.2)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 20px 40px rgba(59, 130, 246, 0.1)'">
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 16px; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite 0.5s;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    <path d="M6 8h2"/>
                    <path d="M6 12h2"/>
                    <path d="M16 8h2"/>
                    <path d="M16 12h2"/>
                  </svg>
                </div>
                <div>
                  <div style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-block; margin-bottom: 8px;">Etapa 2</div>
                  <h3 style="color: #1f2937; font-size: 1.5rem; font-weight: 700; margin: 0; font-family: Manrope, sans-serif;">Demonstração Personalizada</h3>
                </div>
              </div>
              <p style="color: #6b7280; font-size: 1.125rem; margin-bottom: 20px; font-family: Manrope, sans-serif;">Mostramos o sistema funcionando com dados do seu negócio. Você vê exatamente como será na prática.</p>
              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">45 min</span>
                <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">Dados Reais</span>
                <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">Interativa</span>
              </div>
            </div>
            <div style="width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 0 2px #3b82f6; position: absolute; left: -10px; z-index: 3; animation: bounce 2s infinite 0.5s;"></div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 80px;">
          <!-- Etapa 3: Proposta Transparente -->
          <div style="display: flex; align-items: center; gap: 40px; position: relative; animation: slideInLeft 0.8s ease-out 0.4s both;">
            <div style="background: white; border: 2px solid #8b5cf6; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(139, 92, 246, 0.1); flex: 1; position: relative; z-index: 2; transition: all 0.4s ease;" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 30px 60px rgba(139, 92, 246, 0.2)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 20px 40px rgba(139, 92, 246, 0.1)'">
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 16px; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite 1s;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M12 2v20m8-10H4"/>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                    <path d="M12 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                  </svg>
                </div>
                <div>
                  <div style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-block; margin-bottom: 8px;">Etapa 3</div>
                  <h3 style="color: #1f2937; font-size: 1.5rem; font-weight: 700; margin: 0; font-family: Manrope, sans-serif;">Proposta Transparente</h3>
                </div>
              </div>
              <p style="color: #6b7280; font-size: 1.125rem; margin-bottom: 20px; font-family: Manrope, sans-serif;">Receba uma proposta detalhada com preços claros, cronograma e ROI projetado. Sem surpresas ou custos ocultos.</p>
              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <span style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">24h</span>
                <span style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">Preços Fixos</span>
                <span style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">ROI Calculado</span>
              </div>
            </div>
            <div style="width: 20px; height: 20px; background: #8b5cf6; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 0 2px #8b5cf6; position: absolute; right: -10px; z-index: 3; animation: bounce 2s infinite 1s;"></div>
          </div>
          
          <!-- Etapa 4: Implementação Guiada -->
          <div style="display: flex; align-items: center; gap: 40px; position: relative; flex-direction: row-reverse; animation: slideInRight 0.8s ease-out 0.6s both;">
            <div style="background: white; border: 2px solid #f59e0b; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(245, 158, 11, 0.1); flex: 1; position: relative; z-index: 2; transition: all 0.4s ease;" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 30px 60px rgba(245, 158, 11, 0.2)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 20px 40px rgba(245, 158, 11, 0.1)'">
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 16px; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite 1.5s;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <path d="m17 11 2 2 4-4"/>
                    <path d="M14 14l2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <div style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-block; margin-bottom: 8px;">Etapa 4</div>
                  <h3 style="color: #1f2937; font-size: 1.5rem; font-weight: 700; margin: 0; font-family: Manrope, sans-serif;">Implementação Guiada</h3>
                </div>
              </div>
              <p style="color: #6b7280; font-size: 1.125rem; margin-bottom: 20px; font-family: Manrope, sans-serif;">Nossa equipe cuida de tudo: instalação, configuração, migração de dados e treinamento completo da sua equipe.</p>
              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">3-7 dias</span>
                <span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">Especialista Dedicado</span>
                <span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;">Treinamento Incluso</span>
              </div>
            </div>
            <div style="width: 20px; height: 20px; background: #f59e0b; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 0 2px #f59e0b; position: absolute; left: -10px; z-index: 3; animation: bounce 2s infinite 1.5s;"></div>
          </div>
        </div>
      </div>
      
      <!-- CTA Final -->
      <div style="text-align: center; margin-top: 80px;">
        <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 24px; padding: 48px; max-width: 800px; margin: 0 auto; border: 1px solid rgba(59, 130, 246, 0.1);">
          <h3 style="color: #1f2937; font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; font-family: Manrope, sans-serif;">Comece Sua Transformação Hoje</h3>
          <p style="color: #6b7280; margin-bottom: 32px; font-size: 1.25rem; font-family: Manrope, sans-serif;">Resposta em até 2 horas • Análise gratuita • Sem compromisso</p>
          <a href="/landingpages/contatolandprincipal" style="display: inline-flex; align-items: center; gap: 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 1.25rem; font-weight: 600; padding: 18px 36px; border-radius: 12px; text-decoration: none; box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Iniciar Análise Gratuita
          </a>
        </div>
      </div>
    </div>
  </section>
`;

  return (
    <div>
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} />
      
      {/* Banner de Transição */}
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #0f172a 100%)', padding: '40px 0', width: '100%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', fontFamily: 'Manrope, sans-serif' }}>
              Tecnologia Enterprise para seu Negócio
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
              Infraestrutura AWS • Segurança Bancária • Suporte 24/7
            </p>
          </div>
          <a href="/landingpages/contatolandprincipal" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontSize: '1rem', fontWeight: 600, padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.3s ease' }}>
            Solicitar Demonstração
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LandingPrincipal;