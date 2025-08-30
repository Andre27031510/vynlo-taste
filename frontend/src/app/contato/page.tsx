'use client';

import React, { useEffect, useRef } from 'react';

const ContatoPage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    // Mantém originalidade: fontes e CSS externo
    const l1 = ensureLink({ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' });
    const l2 = ensureLink({
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&display=swap',
      rel: 'stylesheet',
    });
    const l3 = ensureLink({ rel: 'stylesheet', href: '/assets/style.css?v=1756488284' });

    // Injeta o <style> do <head> original
    const inlineHeadStyleContent = `
.form-group { margin-bottom: 24px; }
.form-label { display: block; color: #1f2937; font-weight: 600; margin-bottom: 8px; font-family: Manrope, sans-serif; }
.form-input { width: 100%; padding: 16px; border: 1px solid #d1d5db; border-radius: 12px; background: #ffffff; color: #1f2937; font-family: Manrope, sans-serif; transition: all 0.3s ease; }
.form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
.form-input::placeholder { color: #6b7280; }
.form-select { appearance: none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-position: right 12px center; background-repeat: no-repeat; background-size: 16px; }
.form-textarea { min-height: 120px; resize: vertical; }
.btn-submit { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-weight: 600; padding: 18px 36px; border-radius: 12px; border: none; cursor: pointer; transition: all 0.3s ease; font-family: Manrope, sans-serif; font-size: 16px; }
.btn-submit:hover { transform: translateY(-2px); box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.success-message { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #22c55e; padding: 16px; border-radius: 12px; margin-top: 20px; display: none; }
.error-message { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 16px; border-radius: 12px; margin-top: 20px; display: none; }
.faq-item { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.3s ease; margin-bottom: 16px; }
.faq-item:hover { border-color: #3b82f6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1); }
    `.trim();

    const styleEl = document.createElement('style');
    styleEl.textContent = inlineHeadStyleContent;
    head.appendChild(styleEl);

    // CSS para animações (spin) do script original
    const animStyle = document.createElement('style');
    animStyle.textContent = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
    head.appendChild(animStyle);

    // Comportamentos (dropdown, FAQ, form, mask)
    let dropdownTimeout: number | undefined;

    const root = rootRef.current;
    if (!root) {
      return () => {
        styleEl.remove();
        animStyle.remove();
      };
    }

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

    // FAQ (contato)
    const toggleContactFaq = (index: number) => {
      const content = root.querySelector<HTMLElement>(`#faq-contact-content-${index}`);
      const icon = root.querySelector<HTMLElement>(`#faq-contact-icon-${index}`);
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
    (window as any).toggleContactFaq = toggleContactFaq;

    // Form submit
    const form = root.querySelector<HTMLFormElement>('#contactForm');
    const submitHandler = async (e: Event) => {
      e.preventDefault();
      const submitBtn = root.querySelector<HTMLButtonElement>('.btn-submit');
      const submitText = root.querySelector<HTMLElement>('#submitText');
      const loadingIcon = root.querySelector<HTMLElement>('#loadingIcon');
      const successMessage = root.querySelector<HTMLElement>('#successMessage');
      const errorMessage = root.querySelector<HTMLElement>('#errorMessage');

      if (submitBtn && submitText && loadingIcon) {
        submitBtn.disabled = true;
        submitText.textContent = 'Enviando...';
        loadingIcon.setAttribute('style', 'display: inline-block; margin-left: 8px; animation: spin 1s linear infinite;');
      }
      if (successMessage) successMessage.style.display = 'none';
      if (errorMessage) errorMessage.style.display = 'none';

      try {
        // Simulação de chamada
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (successMessage) successMessage.style.display = 'block';
        if (form) form.reset();
        if ((window as any).gtag) {
          (window as any).gtag('event', 'form_submit', {
            event_category: 'Contact',
            event_label: 'Demo Request',
          });
        }
      } catch {
        if (errorMessage) errorMessage.style.display = 'block';
      } finally {
        if (submitBtn && submitText && loadingIcon) {
          submitBtn.disabled = false;
          submitText.textContent = 'Solicitar Demonstração Gratuita';
          loadingIcon.setAttribute('style', 'display: none; margin-left: 8px;');
        }
      }
    };
    if (form) {
      form.addEventListener('submit', submitHandler);
    }

    // Máscara telefone
    const phone = root.querySelector<HTMLInputElement>('#phone');
    const phoneHandler = (e: Event) => {
      const input = e.target as HTMLInputElement;
      let value = (input.value || '').replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        if (value.length < 14) {
          value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
      }
      input.value = value;
    };
    if (phone) phone.addEventListener('input', phoneHandler);

    return () => {
      if (dropdownTimeout) window.clearTimeout(dropdownTimeout);
      if (dropdownContainer) {
        const me = (dropdownContainer as any).__mouseenter as EventListener | undefined;
        const ml = (dropdownContainer as any).__mouseleave as EventListener | undefined;
        if (me) dropdownContainer.removeEventListener('mouseenter', me);
        if (ml) dropdownContainer.removeEventListener('mouseleave', ml);
      }
      if (form) form.removeEventListener('submit', submitHandler);
      if (phone) phone.removeEventListener('input', phoneHandler);
      styleEl.remove();
      animStyle.remove();
      // l1?.remove(); l2?.remove(); l3?.remove(); // Caso queira remover os links injetados
    };
  }, []);

  const html = `
<header style="position: fixed; top: 0; left: 0; right: 0; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); z-index: 1000; padding: 16px 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between;">
    <a href="/" style="color: #ffffff; font-family: Manrope, sans-serif; font-size: 1.5rem; font-weight: 700; text-decoration: none;">Vynlo Tech</a>
    <nav style="display: flex; align-items: center; gap: 32px;">
      <div style="position: relative;" onmouseenter="showDropdown()" onmouseleave="hideDropdown()">
        <span style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; cursor: pointer;">Segmentos ▾</span>
        <div id="dropdown" style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.98); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; min-width: 280px; display: none; margin-top: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
          <a href="https://taste.vynlotech.com" data-taste-link style="display: flex; align-items: center; gap: 12px; color: #e2e8f0; text-decoration: none; padding: 12px; border-radius: 8px; transition: all 0.3s ease; hover:background: rgba(59, 130, 246, 0.1);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg><div><div style="font-weight: 600;">Restaurantes</div><div style="font-size: 12px; color: #94a3b8;">Vynlo Taste - Disponível</div></div></a>
          <div style="display: flex; align-items: center; gap: 12px; color: #6b7280; padding: 12px; border-radius: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg><div><div style="font-weight: 600;">Atendimento IA</div><div style="font-size: 12px; color: #6b7280;">Vynlo Bot (Em breve)</div></div></div>
          <div style="display: flex; align-items: center; gap: 12px; color: #6b7280; padding: 12px; border-radius: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg><div><div style="font-weight: 600;">Gestão Empresarial</div><div style="font-size: 12px; color: #6b7280;">Vynlo ERP (Em breve)</div></div></div>
        </div>
      </div>
      <a href="/#stack" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">Tecnologias</a>
      <a href="/#funnel" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">Como Contratar</a>
      <a href="/#faq" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">FAQ</a>
      <a href="/#why-vynlo" style="color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 16px; font-weight: 500; text-decoration: none;">Por que Vynlo</a>
      <a href="/contato.html" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-family: Manrope, sans-serif; font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none; transition: all 0.3s ease;">Entre em Contato</a>
      <a href="https://taste.vynlotech.com" data-taste-link style="background: rgba(30, 41, 59, 0.8); color: #e2e8f0; font-family: Manrope, sans-serif; font-size: 14px; font-weight: 500; padding: 8px 16px; border-radius: 8px; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.1);">Sou Cliente</a>
    </nav>
  </div>
</header>

<section style="background: linear-gradient(135deg, #1e40af 0%, #1e293b 50%, #0f172a 100%); padding: 140px 0 80px; position: relative; overflow: hidden;">
  <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%);"></div>
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; text-center; position: relative; z-index: 2;">
    <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 50px; padding: 8px 16px; color: #60a5fa; font-size: 14px; font-weight: 600; margin-bottom: 24px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>Demonstração Gratuita</span>
    </div>
    <h1 style="font-size: 4rem; font-weight: 900; color: #ffffff; margin-bottom: 24px; line-height: 1.1; font-family: Manrope, sans-serif; text-align: center;">
      Transforme seu <span style="background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">negócio hoje</span>
    </h1>
    <p style="font-size: 1.25rem; color: #cbd5e1; max-width: 600px; margin: 0 auto 40px; font-family: Manrope, sans-serif;">
      Agende uma demonstração personalizada e veja como nossas soluções podem revolucionar sua empresa em apenas 30 minutos
    </p>
    <div style="display: flex; justify-content: center; gap: 32px; margin-top: 40px;">
      <div style="text-align: center;"><div style="color: #3b82f6; font-size: 2.5rem; font-weight: 800; margin-bottom: 4px;">30min</div><div style="color: #cbd5e1; font-size: 0.875rem;">Demonstração</div></div>
      <div style="text-align: center;"><div style="color: #10b981; font-size: 2.5rem; font-weight: 800; margin-bottom: 4px;">100%</div><div style="color: #cbd5e1; font-size: 0.875rem;">Gratuito</div></div>
      <div style="text-align: center;"><div style="color: #8b5cf6; font-size: 2.5rem; font-weight: 800; margin-bottom: 4px;">2h</div><div style="color: #cbd5e1; font-size: 0.875rem;">Resposta</div></div>
    </div>
  </div>
</section>

<section style="background: #ffffff; padding: 100px 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start;">
      <div>
        <h2 style="font-size: 2.5rem; font-weight: 800; color: #1f2937; margin-bottom: 24px; font-family: Manrope, sans-serif;">Vamos conversar sobre seu <span style="color: #3b82f6;">projeto</span></h2>
        <p style="font-size: 1.125rem; color: #6b7280; margin-bottom: 40px; line-height: 1.7; font-family: Manrope, sans-serif;">Nossa equipe de especialistas está pronta para entender suas necessidades e apresentar a solução ideal para seu negócio.</p>
        <div style="space-y: 24px;">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <div style="width: 48px; height: 48px; background: rgba(59, 130, 246, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div><div style="color: #1f2937; font-weight: 600; margin-bottom: 4px;">WhatsApp</div><div style="color: #6b7280;">+55 (11) 99999-9999</div></div>
          </div>
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div><div style="color: #1f2937; font-weight: 600; margin-bottom: 4px;">Email</div><div style="color: #6b7280;">contato@vynlotech.com</div></div>
          </div>
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <div style="width: 48px; height: 48px; background: rgba(139, 92, 246, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
            </div>
            <div><div style="color: #1f2937; font-weight: 600; margin-bottom: 4px;">Horário de Atendimento</div><div style="color: #6b7280;">Segunda a Sexta: 8h às 18h</div></div>
          </div>
        </div>
        <div style="background: #f8fafc; border-radius: 16px; padding: 24px; margin-top: 40px; border: 1px solid #e2e8f0;">
          <h3 style="color: #1f2937; font-weight: 700; margin-bottom: 16px; font-family: Manrope, sans-serif;">O que você receberá:</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; color: #6b7280;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>Análise gratuita do seu negócio</li>
            <li style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; color: #6b7280;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>Demonstração personalizada</li>
            <li style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; color: #6b7280;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>Proposta comercial em 24h</li>
            <li style="display: flex; align-items: center; gap: 12px; color: #6b7280;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>Suporte especializado</li>
          </ul>
        </div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
        <form id="contactForm">
          <div class="form-group"><label class="form-label" for="name">Nome Completo *</label><input type="text" id="name" name="name" class="form-input" placeholder="Seu nome completo" required></div>
          <div class="form-group"><label class="form-label" for="email">Email Corporativo *</label><input type="email" id="email" name="email" class="form-input" placeholder="seu.email@empresa.com" required></div>
          <div class="form-group"><label class="form-label" for="phone">WhatsApp *</label><input type="tel" id="phone" name="phone" class="form-input" placeholder="(11) 99999-9999" required></div>
          <div class="form-group"><label class="form-label" for="company">Empresa *</label><input type="text" id="company" name="company" class="form-input" placeholder="Nome da sua empresa" required></div>
          <div class="form-group">
            <label class="form-label" for="role">Cargo *</label>
            <select id="role" name="role" class="form-input form-select" required>
              <option value="">Selecione seu cargo</option>
              <option value="CEO/Fundador">CEO/Fundador</option>
              <option value="Diretor">Diretor</option>
              <option value="Gerente">Gerente</option>
              <option value="Coordenador">Coordenador</option>
              <option value="Analista">Analista</option>
              <option value="Proprietário">Proprietário</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="solution">Solução de Interesse *</label>
            <select id="solution" name="solution" class="form-input form-select" required>
              <option value="">Selecione a solução</option>
              <option value="Vynlo Taste">Vynlo Taste - Restaurantes (Disponível)</option>
              <option value="Vynlo Bot">Vynlo Bot - IA Conversacional (Em breve)</option>
              <option value="Vynlo ERP">Vynlo ERP - Sistema Empresarial (Em breve)</option>
              <option value="Múltiplas Soluções">Múltiplas Soluções</option>
              <option value="Não sei ainda">Não sei ainda</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="employees">Número de Funcionários</label>
            <select id="employees" name="employees" class="form-input form-select">
              <option value="">Selecione o porte da empresa</option>
              <option value="1-10">1-10 funcionários (Micro)</option>
              <option value="11-50">11-50 funcionários (Pequena)</option>
              <option value="51-200">51-200 funcionários (Média)</option>
              <option value="201-500">201-500 funcionários (Grande)</option>
              <option value="500+">Mais de 500 funcionários (Corporação)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label" for="message">Mensagem</label><textarea id="message" name="message" class="form-input form-textarea" placeholder="Conte-nos mais sobre seu projeto e necessidades..."></textarea></div>

          <button type="submit" class="btn-submit" style="width: 100%;">
            <span id="submitText">Solicitar Demonstração Gratuita</span>
            <svg id="loadingIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none; margin-left: 8px; animation: spin 1s linear infinite;">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
          </button>

          <div id="successMessage" class="success-message"><strong>Sucesso!</strong> Sua solicitação foi enviada. Nossa equipe entrará em contato em até 2 horas úteis.</div>
          <div id="errorMessage" class="error-message"><strong>Erro!</strong> Houve um problema ao enviar sua mensagem. Tente novamente ou entre em contato via WhatsApp.</div>
          <p style="color: #6b7280; font-size: 0.875rem; margin-top: 16px; text-align: center;">Ao enviar este formulário, você concorda com nossa Política de Privacidade</p>
        </form>
      </div>
    </div>
  </div>
</section>

<section style="background: #f8fafc; padding: 100px 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    <div style="text-center; margin-bottom: 60px;">
      <h2 style="font-size: 3rem; font-weight: 800; color: #1f2937; margin-bottom: 16px; font-family: Manrope, sans-serif; text-align: center;">Dúvidas sobre <span style="color: #3b82f6;">Demonstração</span></h2>
      <p style="font-size: 1.25rem; color: #6b7280; max-width: 600px; margin: 0 auto; font-family: Manrope, sans-serif;">Respostas rápidas sobre nossa demonstração e processo de contratação</p>
    </div>
    <div style="max-width: 800px; margin: 0 auto;">
      <div class="faq-item" onclick="toggleContactFaq(1)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #1f2937; font-size: 1.125rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Como funciona a demonstração gratuita?</h3>
          <svg id="faq-contact-icon-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="transition: transform 0.3s ease;"><path d="M12 5v14m-7-7h14"/></svg>
        </div>
        <div id="faq-contact-content-1" style="color: #6b7280; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">A demonstração é uma videochamada de 30 minutos onde apresentamos o sistema configurado especificamente para seu tipo de negócio. Você verá as funcionalidades em ação e pode fazer perguntas em tempo real.</div>
      </div>

      <div class="faq-item" onclick="toggleContactFaq(2)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #1f2937; font-size: 1.125rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Preciso me preparar para a demonstração?</h3>
          <svg id="faq-contact-icon-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="transition: transform 0.3s ease;"><path d="M12 5v14m-7-7h14"/></svg>
        </div>
        <div id="faq-contact-content-2" style="color: #6b7280; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">Não é necessário preparação especial. Apenas tenha em mente os principais desafios do seu negócio e o que você gostaria de melhorar. Nossa equipe conduzirá toda a apresentação.</div>
      </div>

      <div class="faq-item" onclick="toggleContactFaq(3)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #1f2937; font-size: 1.125rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Quando recebo a proposta comercial?</h3>
          <svg id="faq-contact-icon-3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="transition: transform 0.3s ease;"><path d="M12 5v14m-7-7h14"/></svg>
        </div>
        <div id="faq-contact-content-3" style="color: #6b7280; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">Enviamos a proposta personalizada em até 24 horas após a demonstração. A proposta inclui valores, prazos de implementação e todas as funcionalidades adequadas ao seu negócio.</div>
      </div>

      <div class="faq-item" onclick="toggleContactFaq(4)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #1f2937; font-size: 1.125rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Há algum compromisso após a demonstração?</h3>
          <svg id="faq-contact-icon-4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="transition: transform 0.3s ease;"><path d="M12 5v14m-7-7h14"/></svg>
        </div>
        <div id="faq-contact-content-4" style="color: #6b7280; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">Não há nenhum compromisso. A demonstração é 100% gratuita e sem obrigações. Você decide se quer prosseguir após conhecer nossa solução e receber a proposta comercial.</div>
      </div>

      <div class="faq-item" onclick="toggleContactFaq(5)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #1f2937; font-size: 1.125rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Posso agendar para fora do horário comercial?</h3>
          <svg id="faq-contact-icon-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="transition: transform 0.3s ease;"><path d="M12 5v14m-7-7h14"/></svg>
        </div>
        <div id="faq-contact-content-5" style="color: #6b7280; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">Sim! Entendemos que empresários têm agendas apertadas. Podemos agendar demonstrações em horários alternativos, incluindo início da manhã, final da tarde ou até fins de semana.</div>
      </div>

      <div class="faq-item" onclick="toggleContactFaq(6)">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: #1f2937; font-size: 1.125rem; font-weight: 700; font-family: Manrope, sans-serif; margin: 0;">Quanto tempo leva para implementar o sistema?</h3>
          <svg id="faq-contact-icon-6" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="transition: transform 0.3s ease;"><path d="M12 5v14m-7-7h14"/></svg>
        </div>
        <div id="faq-contact-content-6" style="color: #6b7280; font-family: Manrope, sans-serif; line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">A implementação do Vynlo Taste leva de 3 a 7 dias úteis, incluindo configuração, migração de dados, treinamento da equipe e testes. Para outros produtos, o prazo pode variar conforme a complexidade.</div>
      </div>
    </div>
  </div>
</section>
`.trim();

  return (
    <div ref={rootRef} style={{ background: '#ffffff' }} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default ContatoPage;