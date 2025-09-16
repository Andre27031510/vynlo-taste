'use client'

import { useState } from 'react'
import { 
  Smartphone, 
  BarChart3, 
  Users, 
  CreditCard, 
  Clock, 
  TrendingUp,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function TasteFeatures() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    {
      icon: Smartphone,
      title: 'Pedidos Multi-Canal',
      description: 'Receba pedidos do balcão, delivery, WhatsApp e apps em uma única tela unificada',
      color: 'from-blue-500 to-cyan-600',
      benefits: ['Integração WhatsApp', 'Apps de Delivery', 'Balcão Digital']
    },
    {
      icon: Clock,
      title: 'Tempo Real',
      description: 'Acompanhe o status de cada pedido em tempo real com notificações automáticas',
      color: 'from-green-500 to-emerald-600',
      benefits: ['Status em Tempo Real', 'Notificações Push', 'Sincronização Instantânea']
    },
    {
      icon: Zap,
      title: 'Processamento Rápido',
      description: 'Interface otimizada para agilizar o atendimento e reduzir filas',
      color: 'from-yellow-500 to-orange-600',
      benefits: ['Interface Touch', 'Atalhos Rápidos', 'Automação Inteligente']
    },
    {
      icon: BarChart3,
      title: 'Dashboard Inteligente',
      description: 'Visualize métricas importantes com gráficos interativos e insights automáticos',
      color: 'from-purple-500 to-pink-600',
      benefits: ['Gráficos Interativos', 'Insights Automáticos', 'Métricas em Tempo Real']
    },
    {
      icon: CreditCard,
      title: 'Gestão de Pagamentos',
      description: 'Controle todas as formas de pagamento com conciliação automática',
      color: 'from-emerald-500 to-teal-600',
      benefits: ['Múltiplas Formas', 'Conciliação Automática', 'Segurança PCI DSS']
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Criptografia bancária e auditoria completa de todas as transações',
      color: 'from-amber-500 to-orange-600',
      benefits: ['Criptografia 256-bit', 'Auditoria Completa', 'Compliance Bancário']
    }
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">Funcionalidades Principais</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Tudo que seu restaurante
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              precisa em um só lugar
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto leading-relaxed">
            Sistema completo com todas as ferramentas necessárias para gerenciar seu restaurante de forma eficiente e profissional
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-3xl p-12">
          <h3 className="text-3xl font-manrope font-bold text-gray-900 mb-4">
            Pronto para transformar seu restaurante?
          </h3>
          <p className="text-lg text-gray-600 font-manrope mb-8 max-w-2xl mx-auto">
            Comece hoje mesmo e veja como o Vynlo Taste pode revolucionar a gestão do seu negócio
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <span>Começar Teste Grátis</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="bg-white border-2 border-gray-300 text-gray-700 font-manrope font-bold px-8 py-4 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <span>Falar com Especialista</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
