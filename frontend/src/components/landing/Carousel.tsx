'use client';

import React from 'react';

interface CarouselProps {
  currentSlide: number;
  goToSlide: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({ currentSlide, goToSlide }) => {
  return (
    <section id="vynlo-carousel" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1e293b 50%, #0f172a 100%)', padding: '120px 0', position: 'relative', overflow: 'hidden', minHeight: '700px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <div id="carousel-container" style={{ position: 'relative', width: '100%', height: '600px' }}>
          
          <div className="carousel-slide active" data-slide="0" style={{ position: 'absolute', width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center', opacity: currentSlide === 0 ? 1 : 0, transform: currentSlide === 0 ? 'translateX(0)' : 'translateX(100%)', transition: 'all 1s ease' }}>
            <div style={{ paddingRight: '40px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '50px', padding: '12px 20px', color: '#60a5fa', fontSize: '14px', fontWeight: 600, marginBottom: '32px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20m8-10H4"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Inteligência Artificial</span>
              </div>
              <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: '#ffffff', marginBottom: '32px', lineHeight: 1.1, fontFamily: 'Manrope, sans-serif' }}>
                Automação que <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>revoluciona</span> negócios
              </h1>
              <p style={{ fontSize: '1.375rem', color: '#cbd5e1', marginBottom: '40px', lineHeight: 1.7, fontFamily: 'Manrope, sans-serif' }}>Inteligência artificial de última geração que automatiza processos complexos, otimiza operações em tempo real e gera insights preditivos para decisões estratégicas.</p>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <a href="/contato" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontSize: '1.25rem', fontWeight: 700, padding: '20px 40px', borderRadius: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)', transition: 'all 0.3s ease' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Começar Agora - GRÁTIS
                </a>
                <a href="#solutions" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '1.125rem', fontWeight: 600, padding: '18px 32px', borderRadius: '12px', textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.2)' }}>Ver Soluções</a>
              </div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '48px' }}>
              <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '16px', padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '1.25rem', marginBottom: '8px' }}>Sistema IA Ativo</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>Processando 1.2M+ operações/dia</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                  <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: 800, marginBottom: '4px' }}>+85%</div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>Eficiência</div>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                  <div style={{ color: '#3b82f6', fontSize: '2rem', fontWeight: 800, marginBottom: '4px' }}>-60%</div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>Tempo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '16px' }}>
          <button onClick={() => goToSlide(0)} className="nav-dot active" data-slide="0" style={{ width: '14px', height: '14px', borderRadius: '50%', background: currentSlide === 0 ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: currentSlide === 0 ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : 'none' }}></button>
          <button onClick={() => goToSlide(1)} className="nav-dot" data-slide="1" style={{ width: '14px', height: '14px', borderRadius: '50%', background: currentSlide === 1 ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: currentSlide === 1 ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : 'none' }}></button>
          <button onClick={() => goToSlide(2)} className="nav-dot" data-slide="2" style={{ width: '14px', height: '14px', borderRadius: '50%', background: currentSlide === 2 ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: currentSlide === 2 ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : 'none' }}></button>
        </div>
      </div>
    </section>
  );
};

export default Carousel;