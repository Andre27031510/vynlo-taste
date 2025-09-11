'use client'

import { useState, useEffect } from 'react'
import { 
  Brain,
  BarChart3,
  Users,
  Calendar,
  Package,
  TrendingUp,
  Zap,
  Target
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function SmartManagement() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  useEffect(() => {
    logger.componentMount('SmartManagement')
  }, [])

  const features = [
    {
      icon: Brain,
      title: 'Inteligência Artificial Integrada',
      description: 'Sistema inteligente que aprende com seu negócio e sugere melhorias automáticas para aumentar vendas e reduzir custos.',
      benefits: ['Previsão de demanda', 'Otimização automática', 'Sugestões inteligentes'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Executivo em Tempo Real',
      description: 'Visualize todos os indicadores do seu negócio em uma única tela, com atualizações instantâneas e alertas personalizados.',
      benefits: ['Métricas em tempo real', 'Alertas personalizados', 'Visão 360° do negócio'],
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: Users,
      title: 'Gestão de Equipe Simplificada',
      description: 'Controle completo da sua equipe: escalas, produtividade, metas e comunicação interna em uma plataforma unificada.',
      benefits: ['Escalas automáticas', 'Controle de produtividade', 'Comunicação integrada'],
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Package,
      title: 'Controle de Estoque Inteligente',
      description: 'Nunca mais fique sem produtos. Sistema prevê demanda, sugere compras e controla validade automaticamente.',
      benefits: ['Previsão de demanda', 'Alertas de validade', 'Compras automáticas'],
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <section 
      data-section="smart-management" 
      className="py-32 bg-white relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">
              Gestão Inteligente
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Automatize sua gestão com
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              inteligência artificial
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-4xl mx-auto leading-relaxed">
            Transforme dados em decisões inteligentes. Nossa IA analisa seu negócio 24/7 e oferece insights que aumentam vendas e reduzem custos automaticamente.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            const isActive = activeFeature === index
            
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
                className={`bg-white border-2 border-gray-100 rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer ${
                  isActive ? 'shadow-2xl border-blue-200' : 'hover:shadow-xl'
                }`}
              >
                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 ${
                  isActive ? 'scale-110 rotate-6' : ''
                } shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 font-manrope leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Benefits */}
                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <div className={`w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full`}></div>
                      <span className="text-gray-700 font-manrope text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <Target className="w-16 h-16 mx-auto mb-6 text-white" />
            <h3 className="text-3xl font-manrope font-bold mb-4">
              Pronto para automatizar sua gestão?
            </h3>
            <p className="text-xl text-white/90 font-manrope mb-8 max-w-2xl mx-auto">
              Junte-se a mais de 5.000 empresários que já transformaram seus negócios com nossa inteligência artificial.
            </p>
            <button className="bg-white text-blue-600 font-manrope font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Solicitar Demonstração Gratuita
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}