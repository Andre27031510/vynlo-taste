'use client'

import React from 'react'
import { FileText, Calendar, Pill, BarChart3, TestTube, Shield, CheckCircle } from 'lucide-react'

export default function SaudeFeatures() {
  const features = [
    {
      icon: FileText,
      title: 'Prontuários Eletrônicos',
      description: 'Prontuários digitais completos com histórico médico, exames e prescrições integradas.',
      color: 'from-blue-500 to-cyan-500',
      benefits: [
        'Prontuários digitais completos',
        'Histórico médico detalhado',
        'Integração com exames',
        'Prescrições eletrônicas'
      ]
    },
    {
      icon: Calendar,
      title: 'Agendamento',
      description: 'Sistema inteligente para agendamento de consultas, exames e procedimentos médicos.',
      color: 'from-green-500 to-emerald-500',
      benefits: [
        'Agendamento de consultas',
        'Marcação de exames',
        'Procedimentos médicos',
        'Confirmação automática'
      ]
    },
    {
      icon: Pill,
      title: 'Controle de Medicamentos',
      description: 'Gestão completa de medicamentos, prescrições digitais e controle de estoque farmacêutico.',
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'Prescrições digitais',
        'Controle de medicamentos',
        'Gestão de estoque',
        'Alertas de interação'
      ]
    },
    {
      icon: BarChart3,
      title: 'Relatórios Médicos',
      description: 'Dashboards com métricas de atendimento, análise de diagnósticos e relatórios clínicos.',
      color: 'from-yellow-500 to-orange-500',
      benefits: [
        'Métricas de atendimento',
        'Análise de diagnósticos',
        'Relatórios clínicos',
        'Estatísticas médicas'
      ]
    },
    {
      icon: TestTube,
      title: 'Integração Lab',
      description: 'Integração completa com laboratórios para resultados de exames em tempo real.',
      color: 'from-emerald-500 to-teal-500',
      benefits: [
        'Integração com laboratórios',
        'Resultados em tempo real',
        'Histórico de exames',
        'Laudos digitais'
      ]
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Máxima proteção dos dados médicos com conformidade LGPD e criptografia avançada.',
      color: 'from-amber-500 to-orange-500',
      benefits: [
        'Proteção de dados médicos',
        'Conformidade LGPD',
        'Criptografia avançada',
        'Backup automático'
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
              Gestão de Saúde
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Todas as ferramentas que sua clínica precisa em uma plataforma integrada e fácil de usar
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