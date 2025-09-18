'use client'

import { UserPlus, GraduationCap, Rocket, Headphones, Star } from 'lucide-react'

export default function ClientJourney() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Onboarding Personalizado',
      duration: '48h',
      description: 'Análise completa do seu negócio, configuração inicial e definição de estratégia de implementação.',
      details: ['Análise de requisitos', 'Configuração inicial', 'Plano de implementação', 'Definição de cronograma']
    },
    {
      icon: GraduationCap,
      title: 'Treinamento da Equipe',
      duration: '1 semana',
      description: 'Capacitação completa da sua equipe com metodologia própria e certificação oficial.',
      details: ['Treinamento presencial/online', 'Material didático exclusivo', 'Certificação oficial', 'Suporte pós-treinamento']
    },
    {
      icon: Rocket,
      title: 'Go-Live Assistido',
      duration: '2 semanas',
      description: 'Acompanhamento total durante a entrada em produção com monitoramento 24/7.',
      details: ['Migração de dados', 'Testes de produção', 'Monitoramento 24/7', 'Ajustes em tempo real']
    },
    {
      icon: Headphones,
      title: 'Suporte Contínuo',
      duration: '24/7',
      description: 'Suporte técnico especializado, atualizações automáticas e melhorias contínuas.',
      details: ['Suporte técnico 24/7', 'Atualizações automáticas', 'Melhorias contínuas', 'Consultoria estratégica']
    }
  ]

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-6">
            <Star className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">Jornada do Cliente</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-6">
            Do primeiro contato ao
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              sucesso contínuo
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Uma jornada estruturada para garantir o máximo aproveitamento da nossa solução
          </p>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-white/10 rounded-full hidden lg:block">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={index} className="relative">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                    {index + 1}
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-3">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mb-6 shadow-lg">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-manrope font-bold text-white">{step.title}</h3>
                      <span className="text-blue-400 font-manrope font-bold text-sm">{step.duration}</span>
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-6">{step.description}</p>

                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-gray-400 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}