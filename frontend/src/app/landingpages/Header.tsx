'use client';
import React, { useEffect } from 'react';

const Header: React.FC = () => {
  useEffect(() => {
    let dropdownTimeout: number | undefined;

    const showDropdown = () => {
      const dropdown = document.querySelector('#dropdown') as HTMLElement;
      if (!dropdown) return;
      if (dropdownTimeout) window.clearTimeout(dropdownTimeout);
      dropdown.style.display = 'block';
    };
    
    const hideDropdown = () => {
      const dropdown = document.querySelector('#dropdown') as HTMLElement;
      if (!dropdown) return;
      dropdownTimeout = window.setTimeout(() => {
        dropdown.style.display = 'none';
      }, 200) as unknown as number;
    };

    const toggleMobileMenu = () => {
      const nav = document.querySelector('.desktop-nav') as HTMLElement;
      const menuButton = document.querySelector('.mobile-menu') as HTMLElement;
      
      if (!nav || !menuButton) return;
      
      const isOpen = nav.classList.contains('mobile-open');
      
      if (isOpen) {
        nav.classList.remove('mobile-open');
        menuButton.style.transform = 'rotate(0deg)';
      } else {
        nav.classList.add('mobile-open');
        menuButton.style.transform = 'rotate(90deg)';
      }
    };

    (window as any).showDropdown = showDropdown;
    (window as any).hideDropdown = hideDropdown;
    (window as any).toggleMobileMenu = toggleMobileMenu;

    return () => {
      if (dropdownTimeout) window.clearTimeout(dropdownTimeout);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .mobile-menu {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1002;
        }
        .mobile-menu:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu {
            display: block !important;
            position: relative;
            z-index: 1002;
          }
          .desktop-nav.mobile-open {
            display: flex !important;
            position: fixed !important;
            top: 80px !important;
            left: 0 !important;
            right: 0 !important;
            background: rgba(15, 23, 42, 0.98) !important;
            flex-direction: column !important;
            padding: 20px !important;
            border-radius: 0 0 12px 12px !important;
            z-index: 1001 !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
            backdrop-filter: blur(15px) !important;
          }
          .desktop-nav.mobile-open a {
            padding: 12px 0 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          .desktop-nav.mobile-open a:last-child {
            border-bottom: none !important;
          }
          .desktop-nav.mobile-open #dropdown {
            position: static !important;
            transform: none !important;
            display: block !important;
            background: rgba(255, 255, 255, 0.05) !important;
            margin: 10px 0 !important;
            border-radius: 8px !important;
          }
          .header-cta {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
          .desktop-nav {
            display: flex !important;
          }
        }
      `}</style>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(15px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 9999, padding: '16px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '40px' }}>
          <a href="/landingpages/landprincipal" style={{ color: '#ffffff', fontFamily: 'Manrope, sans-serif', fontSize: '1.5rem', fontWeight: 700, textDecoration: 'none' }}>Vynlo Tech</a>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="desktop-nav">
          <button 
            className="mobile-menu" 
            onClick={() => (window as any).toggleMobileMenu?.()}
            aria-label="Menu de navegação"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div style={{ position: 'relative' }} onMouseEnter={() => (window as any).showDropdown?.()} onMouseLeave={() => (window as any).hideDropdown?.()}>
            <span style={{ color: '#e2e8f0', fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>Segmentos ▾</span>
            <div id="dropdown" style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px', minWidth: '320px', display: 'none', marginTop: '8px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', zIndex: 9999 }} onMouseEnter={() => (window as any).showDropdown?.()} onMouseLeave={() => (window as any).hideDropdown?.()}>
              <a href="/taste" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#e2e8f0', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(16, 185, 129, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                  <path d="M7 2v20"/>
                  <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 600 }}>Restaurantes</div>
                  <div style={{ fontSize: '12px', color: '#10b981' }}>Vynlo Taste - Disponível</div>
                </div>
              </a>
              <a href="/iabot" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#e2e8f0', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(59, 130, 246, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8V4H8"/>
                  <rect width="16" height="12" x="4" y="8" rx="2"/>
                  <path d="M2 14h2"/>
                  <path d="M20 14h2"/>
                  <path d="M15 13v2"/>
                  <path d="M9 13v2"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 600 }}>IA Bot</div>
                  <div style={{ fontSize: '12px', color: '#3b82f6' }}>Vynlo Bot - Disponível</div>
                </div>
              </a>
              <a href="/igrejas" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#e2e8f0', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(245, 158, 11, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 21l4-7 4 7"/>
                  <path d="M12 2v7"/>
                  <path d="M3 6l2.5 2.5L8 6"/>
                  <path d="M16 6l2.5 2.5L21 6"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 600 }}>Igrejas</div>
                  <div style={{ fontSize: '12px', color: '#f59e0b' }}>Vynlo Ekklesia - Disponível</div>
                </div>
              </a>
              <a href="/barbearias" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#e2e8f0', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 12h12"/>
                  <path d="M6 20V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-3-6 3z"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 600 }}>Barbearias</div>
                  <div style={{ fontSize: '12px', color: '#3b82f6' }}>Vynlo Barber - Disponível</div>
                </div>
              </a>
              <a href="/petshops" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#e2e8f0', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(236, 72, 153, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 5a3 3 0 1 0-6 0c0 1.61 1.16 2.94 2.69 3.24A6.93 6.93 0 0 0 8 12"/>
                  <path d="M16 5a3 3 0 1 1 6 0c0 1.61-1.16 2.94-2.69 3.24A6.93 6.93 0 0 1 16 12"/>
                  <path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
                  <path d="M12 11a6 6 0 0 0-6 6v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a6 6 0 0 0-6-6Z"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 600 }}>Petshops</div>
                  <div style={{ fontSize: '12px', color: '#ec4899' }}>Vynlo Pet - Disponível</div>
                </div>
              </a>
              <a href="/educacao" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#e2e8f0', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(6, 182, 212, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 600 }}>Educação</div>
                  <div style={{ fontSize: '12px', color: '#06b6d4' }}>Vynlo Edu - Disponível</div>
                </div>
              </a>
              <a href="/servicos" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#e2e8f0', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(132, 204, 22, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 600 }}>Serviços</div>
                  <div style={{ fontSize: '12px', color: '#84cc16' }}>Vynlo Field - Disponível</div>
                </div>
              </a>
              <a href="/saude" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#e2e8f0', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
                  <path d="M12 5L8 21l4-7 4 7-4-16"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 600 }}>Saúde</div>
                  <div style={{ fontSize: '12px', color: '#ef4444' }}>Vynlo Health - Disponível</div>
                </div>
              </a>
            </div>
          </div>
            <a href="/landingpages/sobre" style={{ color: '#e2e8f0', fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontWeight: 500, textDecoration: 'none' }}>Sobre</a>
            <a href="/landingpages/recursos" style={{ color: '#e2e8f0', fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontWeight: 500, textDecoration: 'none' }}>Recursos</a>
            <a href="/landingpages/blog" style={{ color: '#e2e8f0', fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontWeight: 500, textDecoration: 'none' }}>Blog</a>
            <a href="/landingpages/suporte" style={{ color: '#e2e8f0', fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontWeight: 500, textDecoration: 'none' }}>Suporte</a>
          </nav>
        </div>
        <div className="header-cta" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '80px' }}>
          <a href="/contato" style={{ background: '#60a5fa', color: '#1e40af', fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 600, padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>LIGAMOS PARA VOCÊ</a>
          <a href="/login" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 500, padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', transition: 'all 0.3s ease', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
            SOU CLIENTE
          </a>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;