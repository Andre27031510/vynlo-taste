'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, Users, Calendar, DollarSign, BarChart3 } from 'lucide-react'

export default function ClinicasHero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: 'Gestão de Pacientes',
      subtitle: 'Prontuário digital',
      description: 'Sistema completo para prontuários, histórico médico e acompanhamento de pacientes',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Agendamento Online',
      subtitle: 'Consultas organizadas',
      description: 'Sistema de agendamento inteligente com confirmação automática e lembretes',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Gestão Financeira',
      subtitle: 'Controle total',
      description: 'Faturamento, convênios, pagamentos e relatórios financeiros completos',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3">
              <Heart className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-manrope font-semibold text-sm">Gestão para Clínicas</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-manrope font-black text-white leading-tight">
                Sistema para
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                  Clínicas
                </span>
              </h1>

              <div className="relative h-32">
                {slides.map((slide, index) => {
                  const IconComponent = slide.icon
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ${
                        index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${slide.color}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                          <p className="text-blue-300 font-medium mb-2">{slide.subtitle}</p>
                          <p className="text-gray-300 leading-relaxed">{slide.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">1.2K+</div>
                <div className="text-gray-400 text-sm">Clínicas Ativas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">300K+</div>
                <div className="text-gray-400 text-sm">Pacientes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Começar Agora
              </button>
              <button className="border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                Ver Demo
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="bg-gray-900 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-white text-sm font-medium">Painel Clínica</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-500/20 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 text-sm">Pacientes</span>
                    </div>
                    <div className="text-2xl font-bold text-white">4,567</div>
                  </div>
                  <div className="bg-green-500/20 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm">Faturamento</span>
                    </div>
                    <div className="text-2xl font-bold text-white">R$ 280K</div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white text-sm font-medium">Consultas</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">+15% mês</span>
                    </div>
                  </div>
                  <div className="h-20 flex items-end space-x-1">
                    {[55, 62, 58, 71, 65, 77, 69, 82, 74, 88, 79, 92].map((height, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t flex-1 transition-all duration-1000"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}