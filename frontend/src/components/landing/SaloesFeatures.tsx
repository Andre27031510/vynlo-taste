'use client'

import React from 'react'
import { Calendar, Users, Scissors, BarChart3, DollarSign, Shield } from 'lucide-react'

export default function SaloesFeatures() {
  const features = [
    {
      icon: Calendar,
      title: 'Agendamento Online',
      description: 'Sistema inteligente com disponibilidade em tempo real, confirmação automática e lembretes.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'Cadastro completo, histórico de serviços, preferências e programa de fidelidade.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Scissors,
      title: 'Catálogo de Serviços',
      description: 'Gestão completa de serviços, preços, duração e profissionais especializados.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: BarChart3,
      title: 'Relatórios de Performance',
      description: 'Dashboards com performance por profissional, serviços mais procurados e análise de receita.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: DollarSign,
      title: 'Gestão Financeira',
      description: 'Controle de pagamentos, comissões, produtos vendidos e relatórios financeiros completos.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Proteção completa dos dados dos clientes com backup automático e controle de acesso.',
      color: 'from-gray-600 to-gray-800'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 rounded-full px-6 py-3 mb-6">
            <Scissors className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Funcionalidades</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Tudo que seu Salão
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              precisa em um só lugar
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sistema completo desenvolvido especificamente para gestão de salões de beleza
          </p>
        </div>

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
                
                <h3 className="text-xl font-manrope font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}