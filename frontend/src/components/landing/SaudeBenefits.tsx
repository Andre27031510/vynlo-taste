'use client'

import React from 'react'
import { TrendingUp, Clock, DollarSign, Users, Shield, Zap, Star } from 'lucide-react'

export default function SaudeBenefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Aumento de Pacientes',
      metric: '+35%',
      description: 'Crescimento médio na base de pacientes com melhor gestão'
    },
    {
      icon: Clock,
      title: 'Redução de Tempo',
      metric: '-65%',
      description: 'Menos tempo gasto com processos administrativos'
    },
    {
      icon: DollarSign,
      title: 'Economia de Custos',
      metric: '-30%',
      description: 'Redução nos custos operacionais da clínica'
    },
    {
      icon: Users,
      title: 'Equipe Produtiva',
      metric: '+85%',
      description: 'Aumento na produtividade da equipe médica'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      metric: '24/7',
      description: 'Proteção completa dos dados médicos'
    },
    {
      icon: Zap,
      title: 'Implementação Rápida',
      metric: '48h',
      description: 'Sistema funcionando em até 48 horas'
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
            Transforme sua Clínica com
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              Resultados Reais
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Mais de 1.200 clínicas já transformaram sua gestão e viram resultados extraordinários
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-3"
              >
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-5xl font-manrope font-black text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {benefit.metric}
                </div>
                
                <h3 className="text-2xl font-manrope font-bold text-white mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
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