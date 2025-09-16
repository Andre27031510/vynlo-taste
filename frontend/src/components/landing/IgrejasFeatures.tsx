'use client'

import React from 'react'
import { Users, Heart, Calendar, BarChart3, MessageSquare, Shield } from 'lucide-react'

export default function IgrejasFeatures() {
  const features = [
    {
      icon: Users,
      title: 'Gestão de Membros',
      description: 'Cadastro completo, histórico de participação, grupos de células e acompanhamento espiritual.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Dízimos e Ofertas',
      description: 'Controle financeiro transparente, relatórios detalhados e prestação de contas automática.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'Eventos e Cultos',
      description: 'Agendamento de cultos, eventos especiais, conferências e retiros espirituais.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Ministeriais',
      description: 'Dashboards com métricas de crescimento, frequência e engajamento dos membros.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: MessageSquare,
      title: 'Comunicação',
      description: 'Avisos, newsletters, grupos de WhatsApp e comunicação direta com os fiéis.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Shield,
      title: 'Segurança de Dados',
      description: 'Proteção total dos dados dos membros com criptografia e backup automático.',
      color: 'from-gray-600 to-gray-800'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-6 py-3 mb-6">
            <Heart className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Funcionalidades</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Tudo que sua Igreja
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              precisa em um só lugar
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sistema completo desenvolvido especificamente para as necessidades das igrejas modernas
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-manrope font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Ver Todas as Funcionalidades
          </button>
        </div>
      </div>
    </section>
  )
}