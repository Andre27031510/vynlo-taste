'use client'

import { useState } from 'react'
import { Check, X, Zap, Crown, Rocket, Star, ArrowRight } from 'lucide-react'

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      description: "Perfeito para começar",
      monthlyPrice: 149,
      annualPrice: 129,
      color: "from-green-500 to-emerald-600",
      popular: false,
      features: [
        "Até 50 pedidos/dia",
        "1 usuário",
        "Relatórios básicos",
        "Suporte por email",
        "Integração básica delivery"
      ],
      notIncluded: [
        "Múltiplos usuários",
        "Relatórios avançados",
        "Suporte prioritário"
      ]
    },
    {
      name: "Professional",
      icon: Crown,
      description: "Mais popular entre restaurantes",
      monthlyPrice: 299,
      annualPrice: 249,
      color: "from-blue-500 to-purple-600",
      popular: true,
      features: [
        "Pedidos ilimitados",
        "Até 5 usuários",
        "Relatórios avançados",
        "Suporte prioritário 24/7",
        "Integração completa delivery",
        "Controle de estoque",
        "Gestão financeira",
        "App mobile"
      ],
      notIncluded: [
        "Múltiplas unidades",
        "API personalizada"
      ]
    },
    {
      name: "Enterprise",
      icon: Rocket,
      description: "Para redes e franquias",
      monthlyPrice: 599,
      annualPrice: 499,
      color: "from-purple-500 to-pink-600",
      popular: false,
      features: [
        "Tudo do Professional",
        "Usuários ilimitados",
        "Múltiplas unidades",
        "Dashboard consolidado",
        "API personalizada",
        "Treinamento dedicado",
        "Gerente de conta",
        "Customizações"
      ],
      notIncluded: []
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-manrope font-medium text-sm mb-6">
            <Star className="w-4 h-4" />
            <span>Planos Transparentes</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-manrope font-bold text-gray-900 mb-6">
            Escolha seu
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              plano ideal
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto mb-8">
            Sem taxas ocultas, sem surpresas. Cancele quando quiser.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-xl font-manrope font-semibold transition-all duration-300 ${
                !isAnnual 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-xl font-manrope font-semibold transition-all duration-300 relative ${
                isAnnual 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                -15%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
            const isHovered = hoveredPlan === index
            
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredPlan(index)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative bg-white rounded-3xl p-8 transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 pricing-card ${
                  plan.popular 
                    ? 'ring-2 ring-blue-500 shadow-2xl shadow-blue-500/25' 
                    : 'shadow-lg hover:shadow-2xl'
                } ${isHovered ? 'shadow-2xl' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-manrope font-semibold text-sm">
                      Mais Popular
                    </div>
                  </div>
                )}

                {/* Gradient Border Effect - Removido para evitar fundo preto */}

                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-900 font-manrope">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-manrope font-bold text-gray-900">
                      R$ {price}
                    </span>
                    <span className="text-gray-900 font-manrope ml-2">/mês</span>
                  </div>
                  
                  {isAnnual && (
                    <div className="text-sm text-green-600 font-manrope mt-2">
                      Economize R$ {(plan.monthlyPrice - plan.annualPrice) * 12}/ano
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="flex items-center space-x-3 transform translate-x-0 hover:translate-x-2 transition-transform duration-300"
                      style={{ transitionDelay: `${featureIndex * 0.05}s` }}
                    >
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-900 font-manrope">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="flex items-center space-x-3 opacity-50"
                    >
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500 font-manrope">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full py-4 px-6 rounded-xl font-manrope font-semibold transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-xl`
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  {plan.popular ? 'Começar Agora' : 'Escolher Plano'}
                </button>

                {/* Floating Elements */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${plan.color} rounded-full opacity-0 hover:opacity-100 transition-all duration-300 animate-pulse`}></div>
                <div className={`absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r ${plan.color} rounded-full opacity-0 hover:opacity-100 transition-all duration-500 animate-bounce`}></div>
              </div>
            )
          })}
        </div>

        {/* Bottom Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Teste Grátis por 14 dias",
              description: "Experimente todas as funcionalidades sem compromisso",
              icon: "🎯"
            },
            {
              title: "Suporte Especializado",
              description: "Equipe dedicada para restaurantes 24/7",
              icon: "🚀"
            },
            {
              title: "Migração Gratuita",
              description: "Transferimos todos seus dados sem custo adicional",
              icon: "⚡"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-manrope font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 font-manrope">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-manrope font-bold mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-xl font-manrope mb-8 opacity-90">
              Fale com nossos especialistas e descubra qual plano é ideal para você
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 font-manrope font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105">
                Falar com Especialista
              </button>
              <button className="border-2 border-white text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                Ver Demo Gratuita
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}