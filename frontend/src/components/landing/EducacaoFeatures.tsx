'use client'

import React from 'react'
import { Users, DollarSign, GraduationCap, BarChart3 } from 'lucide-react'

export default function EducacaoFeatures() {
  const features = [
    {
      icon: Users,
      title: 'Gestão de Alunos',
      description: 'Matrículas, histórico escolar, notas, frequência e acompanhamento pedagógico completo para cada estudante.'
    },
    {
      icon: DollarSign,
      title: 'Controle de Mensalidades',
      description: 'Gestão financeira completa com mensalidades, boletos automáticos, controle de inadimplência e relatórios.'
    },
    {
      icon: GraduationCap,
      title: 'Portal do Aluno',
      description: 'Acesso completo para alunos e pais acompanharem notas, frequência, comunicados e calendário escolar.'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Pedagógicos',
      description: 'Dashboards com desempenho por turma, disciplina, professor e análise de aproveitamento acadêmico.'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-6 py-3 mb-6">
            <GraduationCap className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Funcionalidades</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Tudo que sua Escola
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              precisa em um só lugar
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sistema completo desenvolvido especificamente para gestão educacional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-manrope font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}