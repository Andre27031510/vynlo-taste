'use client'

import React from 'react'
import { Heart, Shield, Calendar, Package, FileText, Star, CheckCircle } from 'lucide-react'

export default function PetshopsFeatures() {
  const features = [
    {
      icon: Heart,
      title: 'Cadastro de Pets',
      description: 'Ficha completa com dados do pet, histórico médico, vacinas e informações dos tutores.',
      color: 'from-blue-500 to-cyan-500',
      benefits: [
        'Ficha completa do pet',
        'Dados dos tutores',
        'Histórico médico',
        'Informações comportamentais'
      ]
    },
    {
      icon: Shield,
      title: 'Controle de Vacinas',
      description: 'Calendário de vacinas, alertas de vencimento e histórico completo de imunização.',
      color: 'from-green-500 to-emerald-500',
      benefits: [
        'Calendário de vacinas',
        'Alertas de vencimento',
        'Histórico de imunização',
        'Lembretes automáticos'
      ]
    },
    {
      icon: Calendar,
      title: 'Agendamento',
      description: 'Sistema para banho, tosa, consultas veterinárias e outros serviços especializados.',
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'Agendamento de banho/tosa',
        'Consultas veterinárias',
        'Serviços especializados',
        'Confirmação automática'
      ]
    },
    {
      icon: Package,
      title: 'Estoque',
      description: 'Gestão de produtos pet, ração, medicamentos e acessórios com alertas automáticos.',
      color: 'from-yellow-500 to-orange-500',
      benefits: [
        'Produtos pet completos',
        'Controle de ração',
        'Medicamentos',
        'Alertas de estoque'
      ]
    },
    {
      icon: FileText,
      title: 'Histórico Médico',
      description: 'Prontuário veterinário completo com exames, tratamentos e evolução do pet.',
      color: 'from-emerald-500 to-teal-500',
      benefits: [
        'Prontuário veterinário',
        'Histórico de exames',
        'Tratamentos realizados',
        'Evolução do pet'
      ]
    },
    {
      icon: Star,
      title: 'Fidelidade',
      description: 'Programa de fidelidade com pontos, descontos e campanhas para tutores.',
      color: 'from-amber-500 to-orange-500',
      benefits: [
        'Programa de pontos',
        'Descontos especiais',
        'Campanhas personalizadas',
        'Retenção de clientes'
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
              Gestão de Petshops
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Todas as ferramentas que seu petshop precisa em uma plataforma integrada e fácil de usar
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