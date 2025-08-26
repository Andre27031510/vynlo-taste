'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, CheckCircle, Star } from 'lucide-react'

export default function Hero() {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-vynlo-dark via-gray-900 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-12">
          
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-blue-400 font-manrope font-medium text-sm">
                #1 Sistema para Restaurantes
              </span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-manrope font-bold text-white leading-tight">
                {slides[currentSlide].title}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  {slides[currentSlide].subtitle}
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 font-manrope leading-relaxed max-w-2xl">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Gestão Completa de Pedidos",
                "Controle de Estoque Inteligente", 
                "Relatórios em Tempo Real",
                "Integração com Delivery"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-manrope font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Começar Agora</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button className="inline-flex items-center justify-center space-x-2 border border-gray-600 hover:border-gray-500 text-white font-manrope font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:bg-gray-800/50">
                <Play className="w-5 h-5" />
                <span>Ver Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
              <div className="text-center">
                <div className="text-3xl font-manrope font-bold text-white">500+</div>
                <div className="text-gray-400 font-manrope text-sm">Restaurantes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-manrope font-bold text-white">99.9%</div>
                <div className="text-gray-400 font-manrope text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-manrope font-bold text-white">24/7</div>
                <div className="text-gray-400 font-manrope text-sm">Suporte</div>
              </div>
            </div>
          </div>

          {/* Visual/Image */}
          <div className="relative animate-fade-in">
            <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-sm border border-gray-700">
              {/* Dashboard Preview */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded w-3/4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">R$ 12.5k</div>
                        <div className="text-xs text-gray-400">Vendas Hoje</div>
                      </div>
                    </div>
                    <div className="h-20 bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">147</div>
                        <div className="text-xs text-gray-400">Pedidos</div>
                      </div>
                    </div>
                  </div>
                  <div className="h-32 bg-gray-800 rounded-lg p-4">
                    <div className="h-full bg-gradient-to-t from-blue-500/20 to-purple-500/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce-slow">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg animate-bounce-slow delay-500">
              <Star className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 pb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}