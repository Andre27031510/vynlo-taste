'use client'

import React from 'react'
import { TrendingUp, Clock, Users, DollarSign, Scissors, BarChart3 } from 'lucide-react'

export default function SaloesBenefits() {
  const benefits = [
    {
      icon: TrendingUp,
      metric: '+45%',
      title: 'Agendamentos',
      description: 'Aumento nos agendamentos com sistema online',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Clock,
      metric: '-35%',
      title: 'Tempo Ocioso',
      description: 'Redução no tempo ocioso dos profissionais',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      metric: '+60%',
      title: 'Fidelização',
      description: 'Aumento na retenção de clientes',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: DollarSign,
      metric: '+38%',
      title: 'Faturamento',
      description: 'Crescimento no faturamento mensal',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Scissors,
      metric: '96%',
      title: 'Satisfação',
      description: 'Dos profissionais aprovam o sistema',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: BarChart3,
      metric: '100%',
      title: 'Controle Total',
      description: 'Visibilidade completa da agenda',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-pink-500/20 border border-pink-400/30 rounded-full px-6 py-3 mb-6">
            <BarChart3 className="w-5 h-5 text-pink-400" />
            <span className="text-pink-300 font-manrope font-semibold text-sm">Resultados Comprovados</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-6">
            Transforme seu Salão com
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
              Resultados Reais
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Mais de 3.200 salões já transformaram sua gestão e viram resultados extraordinários
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
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${benefit.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <div className="text-4xl font-manrope font-black text-white mb-2 group-hover:text-pink-400 transition-colors">
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

        <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <blockquote className="text-2xl font-manrope font-medium text-white mb-6 leading-relaxed">
              "O sistema revolucionou meu salão. Consegui aumentar os agendamentos em 45% e meus clientes ficaram muito mais satisfeitos com o atendimento."
            </blockquote>
            <div className="text-pink-300 font-semibold">Carla Beleza</div>
            <div className="text-gray-400">Salão Elegance - Rio de Janeiro</div>
          </div>
        </div>
      </div>
    </section>
  )
}