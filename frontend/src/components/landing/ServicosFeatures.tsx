'use client'

import React from 'react'
import { Users, Clipboard, Calendar, DollarSign, BarChart3, Shield, CheckCircle } from 'lucide-react'

export default function ServicosFeatures() {
  const features = [
    {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'Cadastro completo de clientes, histórico de projetos, contratos e comunicação centralizada.',
      color: 'from-blue-500 to-cyan-500',
      benefits: [
        'Cadastro completo de clientes',
        'Histórico de projetos',
        'Contratos digitais',
        'Comunicação centralizada'
      ]
    },
    {
      icon: Clipboard,
      title: 'Controle de Projetos',
      description: 'Gestão completa de projetos, cronogramas, entregas e acompanhamento de progresso.',
      color: 'from-green-500 to-emerald-500',
      benefits: [
        'Gestão de projetos',
        'Cronogramas detalhados',
        'Controle de entregas',
        'Acompanhamento em tempo real'
      ]
    },
    {
      icon: Calendar,
      title: 'Agendamento',
      description: 'Sistema inteligente para agendamento de visitas, reuniões e execução de serviços.',
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'Agendamento de visitas',
        'Reuniões com clientes',
        'Execução de serviços',
        'Confirmação automática'
      ]
    },
    {
      icon: DollarSign,
      title: 'Faturamento',
      description: 'Controle completo de orçamentos, faturamento, pagamentos e análise financeira.',
      color: 'from-yellow-500 to-orange-500',
      benefits: [
        'Orçamentos detalhados',
        'Faturamento automático',
        'Controle de pagamentos',
        'Análise financeira'
      ]
    },
    {
      icon: BarChart3,
      title: 'Relatórios',
      description: 'Dashboards com análise de produtividade, faturamento por projeto e métricas de performance.',
      color: 'from-emerald-500 to-teal-500',
      benefits: [
        'Análise de produtividade',
        'Faturamento por projeto',
        'Métricas de performance',
        'Relatórios personalizados'
      ]
    },
    {
      icon: Shield,
      title: 'Qualidade',
      description: 'Controle de qualidade dos serviços com avaliações, feedback e melhoria contínua.',
      color: 'from-amber-500 to-orange-500',
      benefits: [
        'Controle de qualidade',
        'Avaliações de clientes',
        'Feedback estruturado',
        'Melhoria contínua'
      ]
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-6 py-3 mb-6">
            <CheckCircle className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Funcionalidades</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Sistema Completo para
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
              Prestadores de Serviços
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Todas as ferramentas que seu negócio precisa em uma plataforma integrada e fácil de usar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <ul className="space-y-3">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}