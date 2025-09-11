'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Award, Star } from 'lucide-react'
import { logger } from '../../utils/logger'

export default function SuccessCases() {
  const [activeCase, setActiveCase] = useState<number | null>(null)

  useEffect(() => {
    logger.componentMount('SuccessCases')
  }, [])

  const cases = [
    {
      company: 'Restaurante Sabor & Arte',
      segment: 'Gastronomia',
      results: '+300% vendas online',
      description: 'Transformação digital completa com aumento significativo nas vendas através do delivery integrado.',
      metrics: { sales: '+300%', efficiency: '+150%', satisfaction: '98%' },
      color: 'from-emerald-500 to-green-600'
    },
    {
      company: 'Barbearia Premium',
      segment: 'Beleza & Estética',
      results: '+200% agendamentos',
      description: 'Sistema de agendamento online revolucionou a gestão de clientes e aumentou a receita.',
      metrics: { bookings: '+200%', retention: '85%', revenue: '+180%' },
      color: 'from-blue-500 to-cyan-600'
    },
    {
      company: 'PetCare Veterinária',
      segment: 'Saúde Animal',
      results: '90% redução tempo',
      description: 'Digitalização completa dos processos reduziu drasticamente o tempo de atendimento.',
      metrics: { time: '-90%', clients: '+250%', satisfaction: '96%' },
      color: 'from-purple-500 to-violet-600'
    }
  ]

  return (
    <section data-section="cases" className="py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">Cases de Sucesso</span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Resultados que
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              falam por si
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((case_, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveCase(index)}
              onMouseLeave={() => setActiveCase(null)}
              className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer ${
                activeCase === index ? 'shadow-2xl shadow-blue-500/25 border-blue-400/50' : 'hover:shadow-xl'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${case_.color} rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 ${
                activeCase === index ? 'scale-110 rotate-6' : ''
              } shadow-lg`}>
                <TrendingUp className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-manrope font-bold text-white mb-2">{case_.company}</h3>
              <p className="text-blue-400 font-manrope font-semibold text-sm mb-4">{case_.segment}</p>
              <p className="text-gray-300 font-manrope leading-relaxed mb-6 text-sm">{case_.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(case_.metrics).map(([key, value], metricIndex) => (
                  <div key={metricIndex} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-lg font-black text-white font-manrope mb-1">{value}</div>
                    <div className="text-gray-400 font-manrope text-xs capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}