'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, CheckCircle, Star } from 'lucide-react'
import { logger } from '../../utils/logger'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = useMemo(() => [
    {
      title: "Revolucione seu Restaurante",
      subtitle: "com Tecnologia de Ponta",
      description: "Sistema completo para gestão de restaurantes com IA integrada, controle de estoque em tempo real e análises avançadas.",
      image: "/hero-1.jpg"
    },
    {
      title: "Controle Total",
      subtitle: "do seu Negócio",
      description: "Gerencie pedidos, estoque, funcionários e finanças em uma única plataforma moderna e intuitiva.",
      image: "/hero-2.jpg"
    },
    {
      title: "Aumente seus Lucros",
      subtitle: "com Inteligência Artificial",
      description: "Análises preditivas, sugestões automáticas e otimização de cardápio para maximizar sua receita.",
      image: "/hero-3.jpg"
    }
  ], [])

  const features = useMemo(() => [
    "Gestão Completa de Pedidos",
    "Controle de Estoque Inteligente", 
    "Relatórios em Tempo Real",
    "Integração com Delivery"
  ], [])

  const handleSlideChange = useCallback((index: number) => {
    try {
      setCurrentSlide(index)
      logger.userInteraction('hero_slide_change', `slide_${index}`)
    } catch (error) {
      logger.error('Erro ao mudar slide do Hero', error as Error)
    }
  }, [])

  useEffect(() => {
    try {
      logger.componentMount('Hero')
      const timer = setInterval(() => {
        try {
          setCurrentSlide((prev) => (prev + 1) % slides.length)
          logger.debug('Hero auto-slide executado')
        } catch (error) {
          logger.error('Erro no auto-slide do Hero', error as Error)
        }
      }, 5000)
      
      return () => {
        try {
          clearInterval(timer)
          logger.debug('Hero timer limpo')
        } catch (error) {
          logger.error('Erro ao limpar timer do Hero', error as Error)
        }
      }
    } catch (error) {
      logger.error('Erro ao inicializar Hero', error as Error)
    }
  }, [slides.length])

  return (
    <section className="hero-section">
      <div className="hero-bg-pattern"></div>
      <div className="hero-bg-floating-1"></div>
      <div className="hero-bg-floating-2"></div>
      
      <div className="hero-container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="hero-badge-text">
                #1 Sistema para Restaurantes
              </span>
            </div>

            <div className="hero-title-section">
              <h1 className="hero-title">
                {slides[currentSlide].title}
                <span className="hero-title-gradient">
                  {slides[currentSlide].subtitle}
                </span>
              </h1>
              
              <p className="hero-description">
                {slides[currentSlide].description}
              </p>
            </div>

            <div className="hero-features">
              {features.map((feature, index) => (
                <div key={feature} className="hero-feature">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="hero-feature-text">{feature}</span>
                </div>
              ))}
            </div>

            <div className="hero-cta">
              <Link href="/login" className="hero-btn-primary">
                <span>Começar Agora</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button className="hero-btn-secondary">
                <Play className="w-5 h-5" />
                <span>Ver Demo</span>
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-number">2.500+</div>
                <div className="hero-stat-label">Restaurantes</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">99.9%</div>
                <div className="hero-stat-label">Uptime</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">24/7</div>
                <div className="hero-stat-label">Suporte</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-dashboard-wrapper">
              <div className="hero-dashboard">
                <div className="hero-dashboard-controls">
                  <div className="hero-dashboard-dot hero-dashboard-dot-red"></div>
                  <div className="hero-dashboard-dot hero-dashboard-dot-yellow"></div>
                  <div className="hero-dashboard-dot hero-dashboard-dot-green"></div>
                </div>
                
                <div className="hero-dashboard-content">
                  <div className="hero-dashboard-bar"></div>
                  <div className="hero-dashboard-grid">
                    <div className="hero-dashboard-card">
                      <div className="hero-dashboard-card-content">
                        <div className="hero-dashboard-card-value">R$ 2.5k</div>
                        <div className="hero-dashboard-card-label">Vendas Hoje</div>
                      </div>
                    </div>
                    <div className="hero-dashboard-card">
                      <div className="hero-dashboard-card-content">
                        <div className="hero-dashboard-card-value">47</div>
                        <div className="hero-dashboard-card-label">Pedidos</div>
                      </div>
                    </div>
                  </div>
                  <div className="hero-dashboard-chart">
                    <div className="hero-dashboard-chart-inner"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-floating-badge hero-floating-badge-green">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="hero-floating-badge hero-floating-badge-blue">
              <Star className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="hero-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}