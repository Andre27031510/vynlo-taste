'use client'

import { useState } from 'react'
import { Bot, Clock, Zap, Brain, Shield, BarChart3, CheckCircle, Star, Users } from 'lucide-react'

export default function IABotBenefits() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const benefits = [
    {
      icon: Bot,
      title: 'Automação Total',
      subtitle: '+80%',
      description: 'Automatize processos complexos com IA que aprende e se adapta continuamente',
      color: 'from-blue-500 to-cyan-600',
      metrics: ['+80% Automação', '+95% Precisão', '-85% Erros']
    },
    {
      icon: Clock,
      title: 'Tempo Reduzido',
      subtitle: '-90%',
      description: 'Reduza drasticamente o tempo de execução de tarefas com IA otimizada',
      color: 'from-emerald-500 to-teal-600',
      metrics: ['-90% Tempo', '+300% Velocidade', '+150% Produtividade']
    },
    {
      icon: Zap,
      title: 'Precisão Máxima',
      subtitle: '+60%',
      description: 'Aumente a precisão das decisões com análise inteligente de dados',
      color: 'from-purple-500 to-pink-600',
      metrics: ['+60% Precisão', '+40% Acurácia', '+25% Eficiência']
    },
    {
      icon: Brain,
      title: 'Aprendizado Contínuo',
      subtitle: '24/7',
      description: 'IA que evolui constantemente, melhorando performance automaticamente',
      color: 'from-orange-500 to-red-600',
      metrics: ['Aprendizado 24/7', '+50% Evolução', 'Melhoria Contínua']
    },
    {
      icon: Shield,
      title: 'Segurança IA',
      subtitle: '100%',
      description: 'Proteção total com IA que detecta e previne ameaças automaticamente',
      color: 'from-indigo-500 to-purple-600',
      metrics: ['100% Seguro', 'Detecção IA', 'Prevenção Automática']
    },
    {
      icon: BarChart3,
      title: 'ROI Garantido',
      subtitle: '+200%',
      description: 'Retorno sobre investimento comprovado com métricas de IA em tempo real',
      color: 'from-yellow-500 to-orange-600',
      metrics: ['+200% ROI', '+150% Receita', '-70% Custos']
    }
  ]

  const stats = [
    { value: '1000+', label: 'Bots IA Ativos', icon: Bot },
    { value: '99.9%', label: 'Precisão IA', icon: Brain },
    { value: '24/7', label: 'Aprendizado Contínuo', icon: Clock },
    { value: '4.9/5', label: 'Satisfação Cliente', icon: Star }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-black to-blue-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">Resultados IA</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-8 leading-tight">
            Transforme com IA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              em 30 dias
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 font-manrope max-w-3xl mx-auto leading-relaxed">
            Veja os resultados reais que empresas alcançaram com nossa IA Bot
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-2xl font-manrope font-bold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <div className="text-3xl font-manrope font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                    {benefit.subtitle}
                  </div>
                  <p className="text-gray-300 font-manrope leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  {benefit.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 font-manrope text-sm font-medium">{metric}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div 
                key={index}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <IconComponent className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-manrope font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-manrope text-sm">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}