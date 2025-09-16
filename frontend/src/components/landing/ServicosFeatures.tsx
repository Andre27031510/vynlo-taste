'use client'

import { Users, Calendar, TrendingUp, Shield } from 'lucide-react'

export default function ServicosFeatures() {
  const features = [
    {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'Controle completo de clientes, histórico de serviços e relacionamento personalizado.'
    },
    {
      icon: Calendar,
      title: 'Agendamento Inteligente',
      description: 'Sistema de agendamento automático com lembretes e confirmações via WhatsApp.'
    },
    {
      icon: TrendingUp,
      title: 'Relatórios Avançados',
      description: 'Dashboards em tempo real com métricas de performance e análise de dados.'
    },
    {
      icon: Shield,
      title: 'Controle de Qualidade',
      description: 'Avaliações de serviços, feedback de clientes e gestão de equipe especializada.'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-manrope mb-6">
            Funcionalidades para
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Serviços
            </span>
          </h2>
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto">
            Sistema completo para gestão de empresas de serviços com controle total de clientes, projetos e equipe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-manrope mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
