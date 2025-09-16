'use client'

import { useState } from 'react'
import { Bot, BarChart3, Brain, Palette, Zap, Shield, CheckCircle } from 'lucide-react'

export default function IABotFeatures() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    {
      icon: Bot,
      title: 'Automação Inteligente',
      description: 'Bots que executam tarefas complexas automaticamente, aprendendo com cada interação',
      color: 'from-blue-500 to-cyan-600',
      benefits: ['Automação 24/7', 'Aprendizado Contínuo', 'Decisões Inteligentes']
    },
    {
      icon: BarChart3,
      title: 'Análise Preditiva',
      description: 'Machine Learning avançado para prever tendências e comportamentos futuros',
      color: 'from-purple-500 to-pink-600',
      benefits: ['Previsões Precisas', 'Análise de Padrões', 'Insights Automáticos']
    },
    {
      icon: Brain,
      title: 'IA Adaptativa',
      description: 'Sistema que se adapta e evolui conforme suas necessidades específicas',
      color: 'from-emerald-500 to-teal-600',
      benefits: ['Aprendizado Personalizado', 'Evolução Contínua', 'Adaptação Inteligente']
    },
    {
      icon: Palette,
      title: 'Personalização Total',
      description: 'Configure a IA para atender perfeitamente aos processos do seu negócio',
      color: 'from-orange-500 to-red-600',
      benefits: ['Interface Customizada', 'Fluxos Personalizados', 'Branding Próprio']
    },
    {
      icon: Zap,
      title: 'Integração Rápida',
      description: 'Conecte com seus sistemas existentes em minutos, não em semanas',
      color: 'from-yellow-500 to-orange-600',
      benefits: ['APIs Nativas', 'Webhooks Avançados', 'Sincronização Real-time']
    },
    {
      icon: Shield,
      title: 'Segurança IA',
      description: 'Proteção avançada com criptografia e compliance para dados sensíveis',
      color: 'from-indigo-500 to-purple-600',
      benefits: ['Criptografia 256-bit', 'LGPD Compliance', 'Auditoria Completa']
    }
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Bot className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">Funcionalidades IA</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Inteligência Artificial
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              que transforma negócios
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto leading-relaxed">
            Tecnologia de IA avançada que automatiza processos, analisa dados e toma decisões inteligentes para seu negócio
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-manrope font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 font-manrope leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Benefits */}
                <div className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-manrope text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}