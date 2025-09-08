'use client';

import React, { useState, useEffect } from 'react';

interface SegmentsProps {
  segmentContent: string;
  showSegmentTab: (segment: string) => void;
  nextSegment: () => void;
  previousSegment: () => void;
  currentSegmentIndex: number;
}

const Segments: React.FC<SegmentsProps> = ({
  segmentContent,
  showSegmentTab,
  nextSegment,
  previousSegment,
  currentSegmentIndex
}) => {
  const segmentKeys = ['taste', 'bot', 'ekklesia', 'barber', 'pet', 'edu', 'field', 'health'];
  const [activeSegment, setActiveSegment] = useState('taste');

  useEffect(() => {
    setActiveSegment(segmentKeys[currentSegmentIndex] || 'taste');
    
    // Mover carrossel automaticamente
    const carousel = document.getElementById('segments-carousel');
    if (carousel) {
      const tabWidth = 180 + 8; // largura da aba + gap
      const visibleTabs = 4; // número de abas visíveis
      
      let translateX = 0;
      if (currentSegmentIndex >= visibleTabs) {
        translateX = -(currentSegmentIndex - visibleTabs + 1) * tabWidth;
      }
      
      carousel.style.transform = `translateX(${translateX}px)`;
    }
  }, [currentSegmentIndex]);

  const handleSegmentClick = (segment: string) => {
    setActiveSegment(segment);
    showSegmentTab(segment);
  };
  return (
    <section id="segments" className="segments-section">
      <div className="segments-bg-overlay"></div>
      
      <div className="segments-container">
        <div className="segments-header">
          <h2 className="segments-title">
            Nossos <span className="segments-title-gradient">Segmentos</span>
          </h2>
          <p className="segments-subtitle">
            Soluções especializadas para cada tipo de negócio
          </p>
        </div>
        
        {/* Carrossel de Abas dos Segmentos */}
        <div className="segments-carousel-wrapper">
          {/* Botões de Navegação */}
          <button 
            onClick={previousSegment}
            className="segments-nav-btn segments-nav-prev"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <button 
            onClick={nextSegment}
            className="segments-nav-btn segments-nav-next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          
          {/* Container do Carrossel */}
          <div className="segments-carousel-container">
            <div id="segments-carousel" className="segments-carousel">
              <button 
                className={`segment-tab ${activeSegment === 'taste' ? 'active' : ''}`}
                data-segment="taste" 
                onClick={() => handleSegmentClick('taste')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                  <path d="M7 2v20"/>
                  <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                </svg>
                Restaurantes
              </button>
              
              <button 
                className={`segment-tab ${activeSegment === 'bot' ? 'active' : ''}`}
                data-segment="bot" 
                onClick={() => handleSegmentClick('bot')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8V4H8"/>
                  <rect width="16" height="12" x="4" y="8" rx="2"/>
                  <path d="M2 14h2"/>
                  <path d="M20 14h2"/>
                  <path d="M15 13v2"/>
                  <path d="M9 13v2"/>
                </svg>
                IA Bot
              </button>
              
              <button 
                className={`segment-tab ${activeSegment === 'ekklesia' ? 'active' : ''}`}
                data-segment="ekklesia" 
                onClick={() => handleSegmentClick('ekklesia')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 21l4-7 4 7"/>
                  <path d="M12 2v7"/>
                  <path d="M3 6l2.5 2.5L8 6"/>
                  <path d="M16 6l2.5 2.5L21 6"/>
                </svg>
                Igrejas
              </button>
              
              <button 
                className={`segment-tab ${activeSegment === 'barber' ? 'active' : ''}`}
                data-segment="barber" 
                onClick={() => handleSegmentClick('barber')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 12h12"/>
                  <path d="M6 20V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-3-6 3z"/>
                </svg>
                Barbearias
              </button>
              
              <button 
                className={`segment-tab ${activeSegment === 'pet' ? 'active' : ''}`}
                data-segment="pet" 
                onClick={() => handleSegmentClick('pet')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 5a3 3 0 1 0-6 0c0 1.61 1.16 2.94 2.69 3.24A6.93 6.93 0 0 0 8 12"/>
                  <path d="M16 5a3 3 0 1 1 6 0c0 1.61-1.16 2.94-2.69 3.24A6.93 6.93 0 0 1 16 12"/>
                  <path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
                  <path d="M12 11a6 6 0 0 0-6 6v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a6 6 0 0 0-6-6Z"/>
                </svg>
                Petshops
              </button>
              
              <button 
                className={`segment-tab ${activeSegment === 'edu' ? 'active' : ''}`}
                data-segment="edu" 
                onClick={() => handleSegmentClick('edu')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                Educação
              </button>
              
              <button 
                className={`segment-tab ${activeSegment === 'field' ? 'active' : ''}`}
                data-segment="field" 
                onClick={() => handleSegmentClick('field')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                Serviços
              </button>
              
              <button 
                className={`segment-tab ${activeSegment === 'health' ? 'active' : ''}`}
                data-segment="health" 
                onClick={() => handleSegmentClick('health')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
                  <path d="M12 5L8 21l4-7 4 7-4-16"/>
                </svg>
                Saúde
              </button>
            </div>
          </div>
        </div>
        
        {/* Card Expansível com Informações */}
        <div id="segment-details" className="segment-details">
          <div id="segment-content-new" className="segment-content" dangerouslySetInnerHTML={{ __html: segmentContent }}></div>
        </div>
      </div>
    </section>
  );
};

export default Segments;