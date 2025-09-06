'use client';

import React from 'react';

interface SegmentsProps {
  segmentContent: string;
  showSegmentTab: (segment: string) => void;
  nextSegment: () => void;
  previousSegment: () => void;
}

const Segments: React.FC<SegmentsProps> = ({
  segmentContent,
  showSegmentTab,
  nextSegment,
  previousSegment
}) => {
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
                className="segment-tab active" 
                data-segment="taste" 
                onClick={() => showSegmentTab('taste')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                  <path d="M7 2v20"/>
                  <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                </svg>
                Restaurantes
              </button>
              
              <button 
                className="segment-tab" 
                data-segment="bot" 
                onClick={() => showSegmentTab('bot')}
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