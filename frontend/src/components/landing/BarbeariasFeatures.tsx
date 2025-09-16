'use client'

import React from 'react'
import { Calendar, Package, DollarSign, Star, BarChart3, Shield, CheckCircle } from 'lucide-react'

export default function BarbeariasFeatures() {
  const features = [
    {
      icon: Calendar,
      title: 'Agendamento',
      description: 'Sistema inteligente de agendamento com confirmação automática e lembretes por WhatsApp.',
      color: 'from-blue-500 to-cyan-500',
      benefits: [
        'Agendamento online 24/7',
        'Confirmação automática',
        'Lembretes por WhatsApp',
        'Controle de horários'
      ]
    },
    {
      icon: Package,
      title: 'Controle de Estoque',
      description: 'Gestão completa de produtos, alertas de estoque baixo e controle de fornecedores.',
      color: 'from-green-500 to-emerald-500',
      benefits: [
        'Controle de produtos',
        'Alertas de estoque baixo',
        'Gestão de fornecedores',
        'Relatórios de consumo'
      ]
    },
    {
      icon: DollarSign,
      title: 'Gestão Financeira',
      description: 'Controle completo de receitas, despesas, comissões e relatórios financeiros.',
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'Controle de receitas',
        'Gestão de despesas',
        'Cálculo de comissões',
        'Relatórios financeiros'
      ]
    },
    {
      icon: Star,
      title: 'Fidelidade',
      description: 'Programa de fidelidade completo com pontos, descontos e campanhas personalizadas.',
      color: 'from-yellow-500 to-orange-500',
      benefits: [
        'Programa de pontos',
        'Descontos progressivos',
        'Campanhas personalizadas',
        'Retenção de clientes'
      ]
    },
    {
      icon: BarChart3,
      title: 'Relatórios',
      description: 'Dashboards com performance por barbeiro, serviços mais procurados e análise de faturamento.',
      color: 'from-emerald-500 to-teal-500',
      benefits: [
        'Performance por barbeiro',
        'Serviços mais procurados',
        'Análise de faturamento',
        'Horários de pico'
      ]
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Proteção total dos dados dos clientes com backup automático e controle de acesso.',
      color: 'from-amber-500 to-orange-500',
      benefits: [
        'Proteção de dados',
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
              Gestão de Barbearias
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Todas as ferramentas que sua barbearia precisa em uma plataforma integrada e fácil de usar
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