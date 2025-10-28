'use client'

import React from 'react'
import { TrendingUp, Clock, DollarSign, Users, Shield, Zap, Star } from 'lucide-react'

export default function SaudeBenefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Aumente sua Receita',
      metric: 'em até 35%',
      description: 'Aumente o número de pacientes e consultas com gestão inteligente e atendimento otimizado.',
      features: ['100% Fidelidade', '99% Satisfação', '24/7 Suporte']
    },
    {
      icon: Clock,
      title: 'Reduza Tempo',
      metric: 'de 65%',
      description: 'Automatize processos administrativos e foque no que realmente importa: o cuidado médico.',
      features: ['100% Automação', '99% Precisão', '24/7 Disponível']
    },
    {
      icon: DollarSign,
      title: 'Economize Custos',
      metric: 'até 30%',
      description: 'Controle inteligente de gastos e otimização de recursos para sua clínica crescer.',
      features: ['100% Controle', '99% Economia', '24/7 Monitoramento']
    },
    {
      icon: Users,
      title: 'Equipe Produtiva',
      metric: '100%',
      description: 'Funcionários e médicos mais produtivos com ferramentas especializadas em saúde.',
      features: ['100% Satisfação', '99% Eficiência', '24/7 Treinamento']
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      metric: '24/7',
      description: 'Configuração completa com segurança de nível militar para proteger dados médicos.',
      features: ['100% Segurança', '99% Uptime', '24/7 Proteção']
    },
    {
      icon: Zap,
      title: 'Implementação Rápida',
      metric: '48h',
      description: 'Configuração completa em até 48 horas com suporte especializado e treinamento completo.',
      features: ['100% Suporte', '99% Rapidez', '24/7 Assistência']
    }
  ]

  const stats = [
    { number: '1.2K+', label: 'Clínicas Ativas' },
    { number: '300K+', label: 'Pacientes Cadastrados' },
    { number: '99.9%', label: 'Uptime Garantido' },
    { number: '24/7', label: 'Suporte Técnico' }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-slate-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-6">
            <Star className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">Resultados Comprovados</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-6">
            Transforme sua Clínica
            <span className="block text-white">
              em 30 dias
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Veja os resultados reais que nossos clientes alcançaram com o Vynlo Health
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-3 hover:border-blue-400/30"
              >
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-manrope font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                
                <div className="text-4xl font-manrope font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                  {benefit.metric}
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  {benefit.description}
                </p>

                <div className="space-y-2">
                  {benefit.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-manrope font-black text-white mb-2">{stat.number}</div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}