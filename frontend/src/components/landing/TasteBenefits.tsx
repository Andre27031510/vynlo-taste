'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react'

export default function TasteBenefits() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Aumente sua Receita',
      subtitle: 'em até 40%',
      description: 'Análises inteligentes e sugestões automáticas para otimizar seu cardápio e maximizar vendas',
      color: 'from-green-500 to-emerald-600',
      metrics: ['+40% Receita', '+25% Pedidos', '+60% Eficiência']
    },
    {
      icon: Clock,
      title: 'Reduza Tempo',
      subtitle: 'de 70%',
      description: 'Automação completa de processos manuais, liberando sua equipe para focar no atendimento',
      color: 'from-blue-500 to-cyan-600',
      metrics: ['-70% Tempo', '+50% Produtividade', '-80% Erros']
    },
    {
      icon: DollarSign,
      title: 'Economize Custos',
      subtitle: 'até 30%',
      description: 'Controle inteligente de estoque e desperdício, reduzindo custos operacionais significativamente',
      color: 'from-purple-500 to-pink-600',
      metrics: ['-30% Custos', '-50% Desperdício', '+35% Margem']
    },
    {
      icon: Users,
      title: 'Equipe Produtiva',
      subtitle: '100%',
      description: 'Ferramentas intuitivas e treinamento completo para maximizar a produtividade da sua equipe',
      color: 'from-orange-500 to-red-600',
      metrics: ['+100% Produtividade', '+90% Satisfação', '-60% Rotatividade']
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      subtitle: '24/7',
      description: 'Proteção bancária completa com criptografia de nível militar e backup automático',
      color: 'from-indigo-500 to-purple-600',
      metrics: ['256-bit SSL', 'PCI DSS', 'Backup Automático']
    },
    {
      icon: Zap,
      title: 'Implementação',
      subtitle: 'Rápida',
      description: 'Configuração completa em 24 horas com suporte especializado e treinamento da equipe',
      color: 'from-yellow-500 to-orange-600',
      metrics: ['24h Setup', 'Suporte 24/7', 'Treinamento Incluído']
    }
  ]

  const stats = [
    { value: '500+', label: 'Restaurantes Ativos', icon: Users },
    { value: 'R$ 2.5M', label: 'Processado Mensalmente', icon: DollarSign },
    { value: '99.9%', label: 'Uptime Garantido', icon: Shield },
    { value: '4.9/5', label: 'Satisfação do Cliente', icon: Star }
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
            <Star className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">Resultados Comprovados</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-8 leading-tight">
            Transforme seu restaurante
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              em 30 dias
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 font-manrope max-w-3xl mx-auto leading-relaxed">
            Veja os resultados reais que nossos clientes alcançaram com o Vynlo Taste
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
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

        {/* CTA Section */}
        <div className="text-center bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
          <h3 className="text-3xl font-manrope font-bold text-white mb-4">
            Junte-se a centenas de restaurantes que já transformaram seus negócios
          </h3>
          <p className="text-lg text-gray-300 font-manrope mb-8 max-w-2xl mx-auto">
            Comece seu teste gratuito hoje e veja os resultados em 30 dias
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <span>Começar Teste Grátis</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <span>Ver Cases de Sucesso</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
