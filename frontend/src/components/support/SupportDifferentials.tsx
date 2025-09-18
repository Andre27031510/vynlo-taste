'use client'

import { Clock, Award, Clock24, Settings, GraduationCap, Radar, CheckCircle } from 'lucide-react'

export default function SupportDifferentials() {
  const differentials = [
    {
      icon: Clock,
      title: 'Resposta em até 2 horas',
      description: 'Garantimos resposta rápida para todos os tickets, priorizando urgências e impactos no negócio.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Especialistas certificados',
      description: 'Equipe técnica com certificações internacionais e expertise comprovada em sistemas empresariais.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock24,
      title: 'Suporte 24/7',
      description: 'Disponibilidade total para emergências, garantindo que seu negócio nunca pare.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Settings,
      title: 'Implementação assistida',
      description: 'Acompanhamento completo desde a configuração inicial até o go-live do sistema.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: GraduationCap,
      title: 'Treinamento personalizado',
      description: 'Capacitação da sua equipe com metodologia própria e material didático exclusivo.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Radar,
      title: 'Monitoramento proativo',
      description: 'Identificamos e resolvemos problemas antes que afetem sua operação.',
      color: 'from-amber-500 to-orange-500'
    }
  ]

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-6 py-3 mb-6">
            <CheckCircle className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Diferenciais</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Por que nosso suporte é
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
              diferente
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mais que resolver problemas, somos parceiros estratégicos do seu sucesso
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentials.map((differential, index) => {
            const IconComponent = differential.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${differential.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {differential.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {differential.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}