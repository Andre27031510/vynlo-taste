'use client';

import React, { useEffect, useRef } from 'react';

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
    ensureLink({ rel: 'stylesheet', href: '/assets/style.css?v=1756488284' });

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
      }, 300) as unknown as number;
    };

    (window as any).showDropdown = showDropdown;
    (window as any).hideDropdown = hideDropdown;

    if (dropdownContainer) {
      dropdownContainer.addEventListener('mouseenter', showDropdown);
      dropdownContainer.addEventListener('mouseleave', hideDropdown);
      (dropdownContainer as any).__mouseenter = showDropdown;
      (dropdownContainer as any).__mouseleave = hideDropdown;
    }

    // FAQ
    const toggleFaq = (index: number) => {
      const content = root.querySelector<HTMLElement>(`#faq-content-${index}`);
      const icon = root.querySelector<HTMLElement>(`#faq-icon-${index}`);
      if (!content || !icon) return;
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
      if (isOpen) {
        content.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
      } else {
        content.style.maxHeight = `${content.scrollHeight}px`;
        icon.style.transform = 'rotate(45deg)';
      }
    };
    (window as any).toggleFaq = toggleFaq;

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
    <nav style="display: flex; align-items: center; gap: 32px;">
      <div style="position: relative;" onmouseenter="showDropdown()" onmouseleave="hideDropdown()">
        <span style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; cursor: pointer;">Segmentos ▾</span>
        <div id="dropdown" style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.98); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; min-width: 280px; display: none; margin-top: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
          <a href="https://taste.vynlotech.com" data-taste-link style="display: flex; align-items: center; gap: 12px; color: #e2e8f0; text-decoration: none; padding: 12px; border-radius: 8px; transition: all 0.3s ease; hover:background: rgba(59, 130, 246, 0.1);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg><div><div style="font-weight: 600;">Restaurantes</div><div style="font-size: 12px; color: #94a3b8;">Vynlo Taste - Disponível</div></div></a>
          <div style="display: flex; align-items: center; gap: 12px; color: #6b7280; padding: 12px; border-radius: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg><div><div style="font-weight: 600;">Atendimento IA</div><div style="font-size: 12px; color: #6b7280;">Vynlo Bot (Em breve)</div></div></div>
          <div style="display: flex; align-items: center; gap: 12px; color: #6b7280; padding: 12px; border-radius: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg><div><div style="font-weight: 600;">Gestão Empresarial</div><div style="font-size: 12px; color: #6b7280;">Vynlo ERP (Em breve)</div></div></div>
        </div>
      </div>
      <a href="#stack" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">Tecnologias</a>
      <a href="#funnel" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">Como Contratar</a>
      <a href="#faq" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">FAQ</a>
      <a href="#why-vynlo" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">Por que Vynlo</a>
      <a href="/contato.html" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-family: Manrope, sans-serif; font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none; transition: all 0.3s ease;">Entre em Contato</a>
      <a href="https://taste.vynlotech.com" data-taste-link style="background: rgba(30, 41, 59, 0.8); color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 14px; font-weight: 500; padding: 8px 16px; border-radius: 8px; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.1);">Sou Cliente</a>
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
          <a href="#solutions" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 1.125rem; font-weight: 600; padding: 18px 36px; border-radius: 12px; text-decoration: none; display: inline-block;">Descobrir IA</a>
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
          <a href="#solutions" style="background: linear-gradient(135deg, #8b5cf6, #10b981); color: white; font-size: 1.125rem; font-weight: 600; padding: 18px 36px; border-radius: 12px; text-decoration: none; display: inline-block;">Explorar Cloud</a>
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
          <a href="#solutions" style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; font-size: 1.125rem; font-weight: 600; padding: 18px 36px; border-radius: 12px; text-decoration: none; display: inline-block;">Ver Analytics</a>
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


  <section class="stats-section" aria-label="Resultados"><div class="container">
    <div class="stats-grid">
      <div class="stat-card clients-card">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <path d="m17 11 2 2 4-4"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number" data-target="500">0</div>
          <div class="stat-label">Clientes Ativos</div>
          <div class="stat-sublabel">Empresas utilizando a plataforma</div>
        </div>
        <div class="stat-trend positive">+12% este mês</div>
      </div>
      
      <div class="stat-card uptime-card">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">99.9<span class="stat-unit">%</span></div>
          <div class="stat-label">Uptime Garantido</div>
          <div class="stat-sublabel">Disponibilidade do sistema</div>
        </div>
        <div class="stat-trend positive">SLA Premium</div>
      </div>
      
      <div class="stat-card latency-card">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number"><100<span class="stat-unit">ms</span></div>
          <div class="stat-label">Latência Média</div>
          <div class="stat-sublabel">Resposta ultra-rápida</div>
        </div>
        <div class="stat-trend positive">Otimizado AWS</div>
      </div>
      
      <div class="stat-card support-card">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M12 7v2"/>
            <path d="M12 13h.01"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">24<span class="stat-unit">/7</span></div>
          <div class="stat-label">Suporte Técnico</div>
          <div class="stat-sublabel">Atendimento especializado</div>
        </div>
        <div class="stat-trend positive">Equipe dedicada</div>
      </div>
    </div>
  </div></section>

<section id="solutions" class="section light"><div class="container">
    <div class="head"><h2>Soluções Vynlo</h2><p>Produtos com foco em resultados</p></div>
    <div class="grid-4">
      <a class="card enhanced-card" href="https://taste.vynlotech.com" data-taste-link>
        <div class="card-header">
          <div class="icon taste-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg></div>
          <span class="status-badge available">Disponível</span>
        </div>
        <div class="title">Vynlo Taste</div>
        <div class="desc">Sistema completo para restaurantes</div>
        <div class="features-list">
          <div class="feature">• Pedidos em tempo real</div>
          <div class="feature">• Controle de estoque</div>
          <div class="feature">• Relatórios financeiros</div>
          <div class="feature">• Integração delivery</div>
        </div>
        <div class="metrics-row">
          <span class="metric">+150% vendas</span>
          <span class="metric">-40% custos</span>
        </div>
      </a>
      <a class="card enhanced-card" href="/contato.html">
        <div class="card-header">
          <div class="icon bot-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg></div>
          <span class="status-badge development">Em Desenvolvimento</span>
        </div>
        <div class="title">Vynlo Bot</div>
        <div class="desc">Assistentes com IA avançada</div>
        <div class="features-list">
          <div class="feature">• Atendimento 24/7</div>
          <div class="feature">• WhatsApp integrado</div>
          <div class="feature">• IA conversacional</div>
          <div class="feature">• Automação completa</div>
        </div>
        <div class="metrics-row">
          <span class="metric">90% satisfação</span>
          <span class="metric">24h suporte</span>
        </div>
      </a>
      <a class="card enhanced-card" href="/contato.html">
        <div class="card-header">
          <div class="icon erp-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg></div>
          <span class="status-badge development">Em Desenvolvimento</span>
        </div>
        <div class="title">Vynlo ERP</div>
        <div class="desc">ERP modular empresarial</div>
        <div class="features-list">
          <div class="feature">• Dashboards inteligentes</div>
          <div class="feature">• Fluxo de caixa</div>
          <div class="feature">• Relatórios gerenciais</div>
          <div class="feature">• Integração bancária</div>
        </div>
        <div class="metrics-row">
          <span class="metric">+200% eficiência</span>
          <span class="metric">-60% tempo</span>
        </div>
      </a>
      <a class="card enhanced-card" href="/contato.html">
        <div class="card-header">
          <div class="icon church-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="m17 11 2 2 4-4"/></svg></div>
          <span class="status-badge planning">Planejamento</span>
        </div>
        <div class="title">Vynlo Ekklesia</div>
        <div class="desc">Gestão eclesiástica completa</div>
        <div class="features-list">
          <div class="feature">• Gestão de membros</div>
          <div class="feature">• Eventos e células</div>
          <div class="feature">• Comunicação integrada</div>
          <div class="feature">• Relatórios pastorais</div>
        </div>
        <div class="metrics-row">
          <span class="metric">300+ igrejas</span>
          <span class="metric">Interessadas</span>
        </div>
            </a>
      <a class="card enhanced-card" href="/contato.html">
        <div class="card-header">
          <div class="icon barber-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1 1-1s1 .448 1 1v6c0 .552-.448 1-1 1z"/><path d="M3 12c-.552 0-1-.448-1-1V5c0-.552.448-1 1-1s1 .448 1 1v6c0 .552-.448 1-1 1z"/><rect width="18" height="8" x="3" y="12" rx="1"/></svg></div>
          <span class="status-badge development">Em Desenvolvimento</span>
        </div>
        <div class="title">Vynlo Barber</div>
        <div class="desc">Gestão para barbearias</div>
        <div class="features-list">
          <div class="feature">• Agendamento online</div>
          <div class="feature">• Programa fidelidade</div>
          <div class="feature">• Controle comissões</div>
          <div class="feature">• Histórico clientes</div>
        </div>
        <div class="metrics-row">
          <span class="metric">+80% agendas</span>
          <span class="metric">+50% fidelidade</span>
        </div>
      </a>
      <a class="card enhanced-card" href="/contato.html">
        <div class="card-header">
          <div class="icon pet-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11.5" cy="8.5" r="2.5"/><path d="M11.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 11.5 2Z"/><path d="M18.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/><path d="M2.5 10.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z"/></svg></div>
          <span class="status-badge planning">Planejamento</span>
        </div>
        <div class="title">Vynlo Pet</div>
        <div class="desc">Gestão para petshops</div>
        <div class="features-list">
          <div class="feature">• Agendamento consultas</div>
          <div class="feature">• Controle vacinas</div>
          <div class="feature">• Histórico médico</div>
          <div class="feature">• Estoque medicamentos</div>
        </div>
        <div class="metrics-row">
          <span class="metric">Mercado pet</span>
          <span class="metric">+25% crescimento</span>
        </div>
      </a>
      <a class="card enhanced-card" href="/contato.html">
        <div class="card-header">
          <div class="icon edu-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
          <span class="status-badge development">Em Desenvolvimento</span>
        </div>
        <div class="title">Vynlo Edu</div>
        <div class="desc">Plataforma educacional</div>
        <div class="features-list">
          <div class="feature">• Cursos online</div>
          <div class="feature">• Gestão de alunos</div>
          <div class="feature">• Certificados digitais</div>
          <div class="feature">• Aulas ao vivo</div>
        </div>
        <div class="metrics-row">
          <span class="metric">EAD crescendo</span>
          <span class="metric">+40% demanda</span>
        </div>
      </a>
      <a class="card enhanced-card" href="/contato.html">
        <div class="card-header">
          <div class="icon field-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
          <span class="status-badge planning">Planejamento</span>
        </div>
        <div class="title">Vynlo Field</div>
        <div class="desc">Ordens de serviço</div>
        <div class="features-list">
          <div class="feature">• Ordens de serviço</div>
          <div class="feature">• Controle de SLA</div>
          <div class="feature">• Rastreamento GPS</div>
          <div class="feature">• Assinatura digital</div>
        </div>
        <div class="metrics-row">
          <span class="metric">Serviços campo</span>
          <span class="metric">+35% crescimento</span>
        </div>
      </a>
    </div>
  </div></section>

  <section id="stack" class="tech-stack-section" style="padding-bottom: 100px !important;" aria-label="Tecnologia de Ponta">
    <div class="container">
      <div class="tech-header">
        <h2 class="tech-title">
          A Mesma Stack que as <span class="highlight">Big Techs</span> Usam
        </h2>
        <p class="tech-subtitle">
          Construído com as tecnologias mais avançadas do mercado para garantir performance, segurança e escalabilidade infinita
        </p>
      </div>
      
      <div class="tech-grid-simple">
        <div class="tech-item">
          <div class="tech-icon react-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
          </div>
          <h3>React 18 + Next.js 15</h3>
          <p>Interface moderna e responsiva com SSR/SSG para performance máxima</p>
        </div>
        
        <div class="tech-item">
          <div class="tech-icon java-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <h3>Java 17 + Spring Boot</h3>
          <p>Backend robusto e escalável com arquitetura enterprise-grade</p>
        </div>
        
        <div class="tech-item">
          <div class="tech-icon database-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </div>
          <h3>PostgreSQL + Cache</h3>
          <p>Banco de dados confiável com cache ultra-rápido para performance</p>
        </div>
        
        <div class="tech-item">
          <div class="tech-icon cloud-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>
          </div>
          <h3>AWS + Containers</h3>
          <p>Infraestrutura cloud nativa com containers para escalabilidade infinita</p>
        </div>
        
        <div class="tech-item">
          <div class="tech-icon security-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3>Firebase Auth + JWT</h3>
          <p>Autenticação segura e autorização avançada com criptografia de ponta</p>
        </div>
        
        <div class="tech-item">
          <div class="tech-icon monitoring-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </div>
          <h3>Observabilidade 24/7</h3>
          <p>Sistema de monitoramento com logs, métricas e alertas em tempo real</p>
        </div>
      </div>
    </div>
  </section>

<section id="faq" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%); padding: 100px 0; position: relative; overflow: hidden;">
  <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%);"></div>
  
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 2;">
    <div style="text-center; margin-bottom: 60px;">
      
      <h2 style="font-size: 3.5rem; font-weight: 900; color: #ffffff; margin-bottom: 24px; line-height: 1.1; font-family: Manrope, sans-serif; text-align: center;">
        Dúvidas <span style="background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Frequentes</span>
      </h2>
      
      <p style="font-size: 1.25rem; color: #cbd5e1; max-width: 600px; margin: 0 auto; font-family: Manrope, sans-serif;">
        Respostas para as principais dúvidas sobre nossas soluções
      </p>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; max-width: 1000px; margin: 0 auto;">
      
      <!-- FAQ Item 1 -->
      <div class="faq-item" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 32px; cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaq(1)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #ffffff; font-size: 1.25rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Quanto tempo leva a implementação?</h3>
          <svg id="faq-icon-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" style="transition: transform 0.3s ease;">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
        </div>
        <div id="faq-content-1" style="color: #cbd5e1; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
          A implementação das soluções Vynlo Tech leva de 3 a 7 dias úteis, incluindo configuração, migração de dados, treinamento da equipe e testes. Nossa equipe técnica acompanha todo o processo para garantir uma transição suave.
        </div>
      </div>
      
      <!-- FAQ Item 2 -->
      <div class="faq-item" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 32px; cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaq(2)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #ffffff; font-size: 1.25rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Preciso de conhecimento técnico?</h3>
          <svg id="faq-icon-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" style="transition: transform 0.3s ease;">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
        </div>
        <div id="faq-content-2" style="color: #cbd5e1; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
          Não! As soluções Vynlo Tech foram desenvolvidas para serem intuitivas e fácil de usar. Oferecemos treinamento completo para sua equipe e suporte técnico 24/7. A interface é amigável e não requer conhecimentos técnicos avançados.
        </div>
      </div>
      
      <!-- FAQ Item 3 -->
      <div class="faq-item" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 32px; cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaq(3)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #ffffff; font-size: 1.25rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Os dados ficam seguros?</h3>
          <svg id="faq-icon-3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" style="transition: transform 0.3s ease;">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
        </div>
        <div id="faq-content-3" style="color: #cbd5e1; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
          Absolutamente! Utilizamos criptografia de ponta, infraestrutura AWS com 99.9% de uptime, backups automáticos e conformidade com LGPD. Seus dados são protegidos com os mais altos padrões de segurança do mercado.
        </div>
      </div>
      
      <!-- FAQ Item 4 -->
      <div class="faq-item" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 32px; cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaq(4)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #ffffff; font-size: 1.25rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Posso cancelar quando quiser?</h3>
          <svg id="faq-icon-4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" style="transition: transform 0.3s ease;">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
        </div>
        <div id="faq-content-4" style="color: #cbd5e1; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
          Sim! Não temos fidelidade obrigatória. Você pode cancelar a qualquer momento com 30 dias de antecedência. Garantimos a exportação completa dos seus dados e uma transição tranquila.
        </div>
      </div>
      
      <!-- FAQ Item 5 -->
      <div class="faq-item" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 32px; cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaq(5)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #ffffff; font-size: 1.25rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Funciona offline?</h3>
          <svg id="faq-icon-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" style="transition: transform 0.3s ease;">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
        </div>
        <div id="faq-content-5" style="color: #cbd5e1; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
          Sim! Nossas soluções possuem modo offline que permite continuar operando mesmo sem internet. Os dados são sincronizados automaticamente quando a conexão é restabelecida, garantindo continuidade do negócio.
        </div>
      </div>
      
      <!-- FAQ Item 6 -->
      <div class="faq-item" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 32px; cursor: pointer; transition: all 0.3s ease;" onclick="toggleFaq(6)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #ffffff; font-size: 1.25rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Qual o investimento mensal?</h3>
          <svg id="faq-icon-6" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" style="transition: transform 0.3s ease;">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
        </div>
        <div id="faq-content-6" style="color: #cbd5e1; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
          Os planos começam a partir de R$ 97/mês e variam conforme o tamanho do estabelecimento e funcionalidades necessárias. Oferecemos análise gratuita para criar uma proposta personalizada para seu negócio.
        </div>
      </div>
    </div>
    
    <!-- CTA Final -->
    <div style="text-align: center; margin-top: 60px;">
      <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px; max-width: 600px; margin: 0 auto;">
        <h3 style="color: #ffffff; font-size: 1.75rem; font-weight: 700; margin-bottom: 16px; font-family: Manrope, sans-serif;">Ainda tem dúvidas?</h3>
        <p style="color: #cbd5e1; margin-bottom: 24px; font-family: Manrope, sans-serif;">Nossa equipe está pronta para esclarecer todas as suas questões</p>
        <a href="/contato.html" style="display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 1.125rem; font-weight: 600; padding: 16px 32px; border-radius: 12px; text-decoration: none; transition: all 0.3s ease;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Falar com Especialista
        </a>
      </div>
    </div>
  </div>
</section>

  <section id="funnel" style="background: white; padding: 100px 0;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
      <div style="text-align: center; margin-bottom: 60px;">
        <h2 style="font-size: 3rem; font-weight: 800; color: #1f2937; margin-bottom: 16px;">
          Como <span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Começamos Juntos</span>
        </h2>
        <p style="font-size: 1.25rem; color: #6b7280; max-width: 600px; margin: 0 auto;">
          Um processo transparente e eficiente para transformar seu negócio
        </p>
      </div>
      
      <div style="display: flex; gap: 24px; margin-bottom: 60px;">
        <div style="flex: 1; text-align: center;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <path d="M8 9h8"/><path d="M8 13h6"/>
            </svg>
          </div>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 12px;">Análise Gratuita</h3>
            <p style="color: #6b7280; margin-bottom: 16px;">Conversamos sobre seu negócio e identificamos oportunidades.</p>
            <span style="background: rgba(34, 197, 94, 0.1); color: #22c55e; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">30 min • Gratuito</span>
          </div>
        </div>
        
        <div style="flex: 1; text-align: center;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 12px;">Demonstração</h3>
            <p style="color: #6b7280; margin-bottom: 16px;">Apresentamos o sistema configurado para seu negócio.</p>
            <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">45 min • Personalizada</span>
          </div>
        </div>
        
        <div style="flex: 1; text-align: center;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/>
            </svg>
          </div>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 12px;">Proposta</h3>
            <p style="color: #6b7280; margin-bottom: 16px;">Elaboramos proposta personalizada com preços transparentes.</p>
            <span style="background: rgba(168, 85, 247, 0.1); color: #a855f7; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">24h • Sem Compromisso</span>
          </div>
        </div>
        
        <div style="flex: 1; text-align: center;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 12px;">Implementação</h3>
            <p style="color: #6b7280; margin-bottom: 16px;">Configuração e treinamento com acompanhamento dedicado.</p>
            <span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">3-7 dias • Suporte 24/7</span>
          </div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 24px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h3 style="font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 12px;">Pronto para Transformar seu Negócio?</h3>
          <p style="font-size: 1.125rem; color: #6b7280; margin-bottom: 24px;">Resposta garantida em até 2 horas úteis</p>
          <a href="/contato.html" style="display: inline-flex; align-items: center; gap: 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 1.125rem; font-weight: 600; padding: 16px 32px; border-radius: 50px; text-decoration: none; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);">
            Começar Agora - Grátis
          </a>
        </div>
      </div>
    </div>
  </section>
`;

  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default LandingPrincipal;