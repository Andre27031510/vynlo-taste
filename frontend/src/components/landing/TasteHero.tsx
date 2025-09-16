'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, CheckCircle, Star, Smartphone, BarChart3, Users, CreditCard } from 'lucide-react'

export default function TasteHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
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
  ]

  const features = [
    "Gestão Completa de Pedidos",
    "Controle de Estoque Inteligente", 
    "Relatórios em Tempo Real",
    "Integração com Delivery"
  ]

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-black to-blue-800 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
        {/* Hero Content */}
        <div className="text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <Star className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">#1 Sistema para Restaurantes</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl lg:text-6xl font-manrope font-black text-white mb-6 leading-tight">
            {slides[currentSlide].title}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              {slides[currentSlide].subtitle}
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-300 font-manrope leading-relaxed max-w-2xl mb-8">
            {slides[currentSlide].description}
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={feature} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 font-manrope text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link 
              href="/login" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <span>Começar Agora</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              <span>Ver Demo</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-manrope font-black text-white mb-2">500+</div>
              <div className="text-gray-400 font-manrope text-sm">Restaurantes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-manrope font-black text-white mb-2">99.9%</div>
              <div className="text-gray-400 font-manrope text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-manrope font-black text-white mb-2">24/7</div>
              <div className="text-gray-400 font-manrope text-sm">Suporte</div>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative">
          <div className="bg-gray-900/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-700 shadow-2xl">
            {/* Dashboard Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-500 ml-4 font-mono text-sm">Vynlo Taste Dashboard</span>
            </div>

            {/* Dashboard Content */}
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300 text-sm font-medium">Pedidos Hoje</span>
                  </div>
                  <div className="text-2xl font-bold text-white">47</div>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 text-sm font-medium">Receita</span>
                  </div>
                  <div className="text-2xl font-bold text-white">R$ 2.5k</div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 text-sm font-medium">Vendas por Hora</span>
                </div>
                <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-end justify-between p-4">
                  {[40, 60, 80, 100, 70, 90, 85].map((height, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t w-8"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Team Status */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span className="text-cyan-300 text-sm font-medium">Equipe Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">B</span>
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                  <div className="text-gray-400 text-sm ml-2">+5 mais</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <Star className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
