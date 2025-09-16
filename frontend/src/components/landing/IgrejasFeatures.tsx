'use client'

import React from 'react'
import { Users, Calendar, CreditCard, MessageCircle, BarChart3, Shield, CheckCircle } from 'lucide-react'

export default function IgrejasFeatures() {
  const features = [
    {
      icon: Users,
      title: 'Gestão de Membros',
      description: 'Sistema completo para cadastro, acompanhamento e crescimento espiritual dos membros da congregação.',
      color: 'from-blue-500 to-cyan-500',
      benefits: [
        'Cadastro completo de membros',
        'Histórico de participação',
        'Grupos de células organizados',
        'Acompanhamento espiritual'
      ]
    },
    {
      icon: Calendar,
      title: 'Eventos e Cultos',
      description: 'Organize cultos, eventos especiais, conferências e atividades ministeriais com facilidade total.',
      color: 'from-green-500 to-emerald-500',
      benefits: [
        'Agendamento de cultos',
        'Eventos especiais',
        'Conferências e retiros',
        'Notificações automáticas'
      ]
    },
    {
      icon: CreditCard,
      title: 'Dízimos e Ofertas',
      description: 'Controle financeiro transparente com relatórios detalhados e prestação de contas automática.',
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'Controle de entradas',
        'Relatórios transparentes',
        'Prestação de contas',
        'Dashboards financeiros'
      ]
    },
    {
      icon: MessageCircle,
      title: 'Comunicação',
      description: 'Sistema integrado para avisos, newsletters e comunicação direta com os fiéis.',
      color: 'from-yellow-500 to-orange-500',
      benefits: [
        'Avisos e newsletters',
        'Grupos de WhatsApp',
        'E-mails personalizados',
        'Comunicação por ministérios'
      ]
    },
    {
      icon: BarChart3,
      title: 'Relatórios',
      description: 'Dashboards completos com métricas de crescimento, frequência e engajamento dos membros.',
      color: 'from-emerald-500 to-teal-500',
      benefits: [
        'Métricas de crescimento',
        'Análise de frequência',
        'Engajamento dos membros',
        'Tendências espirituais'
      ]
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Proteção total dos dados dos membros com criptografia avançada e backup automático.',
      color: 'from-amber-500 to-orange-500',
      benefits: [
        'Criptografia avançada',
        'Backup automático',
        'Controle de acesso',
        'Conformidade LGPD'
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
              Gestão de Igrejas
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Todas as ferramentas que sua igreja precisa em uma plataforma integrada e fácil de usar
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