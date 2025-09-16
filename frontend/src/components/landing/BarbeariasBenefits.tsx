'use client'

import React from 'react'
import { TrendingUp, Clock, Users, DollarSign, Scissors, BarChart3 } from 'lucide-react'

export default function BarbeariasBenefits() {
  const benefits = [
    {
      icon: TrendingUp,
      metric: '+42%',
      title: 'Agendamentos',
      description: 'Aumento nos agendamentos com sistema online'
    },
    {
      icon: Clock,
      metric: '-38%',
      title: 'Tempo Ocioso',
      description: 'Redução no tempo ocioso dos barbeiros'
    },
    {
      icon: Users,
      metric: '+55%',
      title: 'Fidelização',
      description: 'Aumento na retenção de clientes'
    },
    {
      icon: DollarSign,
      metric: '+35%',
      title: 'Faturamento',
      description: 'Crescimento no faturamento mensal'
    },
    {
      icon: Scissors,
      metric: '94%',
      title: 'Satisfação',
      description: 'Dos barbeiros aprovam o sistema'
    },
    {
      icon: BarChart3,
      metric: '100%',
      title: 'Controle',
      description: 'Visibilidade completa da agenda'
    }
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
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">Resultados Comprovados</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-6">
            Transforme sua Barbearia com
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              Resultados Reais
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Mais de 2.100 barbearias já transformaram sua gestão
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <div className="text-4xl font-manrope font-black text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {benefit.metric}
                </div>
                
                <h3 className="text-xl font-manrope font-bold text-white mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}