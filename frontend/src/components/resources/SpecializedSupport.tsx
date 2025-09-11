'use client'

import { useState, useEffect } from 'react'
import { 
  Headphones,
  MessageCircle,
  Video,
  Clock,
  Users,
  BookOpen,
  Zap,
  Award
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function SpecializedSupport() {
  const [activeSupport, setActiveSupport] = useState<number | null>(null)

  useEffect(() => {
    logger.componentMount('SpecializedSupport')
  }, [])

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'Chat ao Vivo 24/7',
      description: 'Suporte instantâneo via chat com especialistas que conhecem seu negócio e podem resolver qualquer dúvida em minutos.',
      features: ['Resposta em menos de 2 minutos', 'Especialistas por segmento', 'Histórico de conversas'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Video,
      title: 'Consultoria Personalizada',
      description: 'Sessões de consultoria individual com nossos especialistas para otimizar seu negócio e extrair o máximo da plataforma.',
      features: ['Consultoria 1:1', 'Análise do seu negócio', 'Plano de otimização'],
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: BookOpen,
      title: 'Treinamento Completo',
      description: 'Capacitação completa da sua equipe com materiais exclusivos, vídeos práticos e certificação oficial.',
      features: ['Vídeos tutoriais', 'Certificação oficial', 'Material exclusivo'],
      color: 'from-purple-500 to-violet-600'
    }
  ]

  return (
    <section 
      data-section="specialized-support" 
      className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <Headphones className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">
              Suporte Especializado
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-8 leading-tight">
            Suporte que entende
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              seu negócio
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 font-manrope max-w-4xl mx-auto leading-relaxed">
            Não é apenas suporte técnico. São especialistas que conhecem seu segmento e estão prontos para ajudar você a crescer 24 horas por dia.
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {supportChannels.map((channel, index) => {
            const IconComponent = channel.icon
            const isActive = activeSupport === index
            
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveSupport(index)}
                onMouseLeave={() => setActiveSupport(null)}
                className={`bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer ${
                  isActive ? 'shadow-2xl shadow-blue-500/25 border-blue-400/50' : 'hover:shadow-xl'
                }`}
              >
                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${channel.color} rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 ${
                  isActive ? 'scale-110 rotate-6' : ''
                } shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-manrope font-bold text-white mb-4">
                  {channel.title}
                </h3>
                
                <p className="text-gray-300 font-manrope leading-relaxed mb-6">
                  {channel.description}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  {channel.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className={`w-2 h-2 bg-gradient-to-r ${channel.color} rounded-full`}></div>
                      <span className="text-gray-400 font-manrope text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Support Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {[
            { icon: Clock, value: '<2min', label: 'Tempo de Resposta', desc: 'Chat ao vivo' },
            { icon: Users, value: '50+', label: 'Especialistas', desc: 'Equipe dedicada' },
            { icon: Zap, value: '24/7', label: 'Disponibilidade', desc: 'Todos os dias' },
            { icon: Award, value: '98%', label: 'Satisfação', desc: 'Clientes satisfeitos' }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div 
                key={index}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <IconComponent className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-manrope font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/90 font-manrope font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-400 font-manrope text-xs">
                  {stat.desc}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            <Headphones className="w-16 h-16 mx-auto mb-6 text-blue-400" />
            <h3 className="text-3xl font-manrope font-bold text-white mb-4">
              Quer saber mais sobre nossos recursos?
            </h3>
            <p className="text-xl text-gray-300 font-manrope mb-8 max-w-2xl mx-auto">
              Entre em contato conosco e descubra como nossos recursos podem transformar seu negócio.
            </p>
            <div className="flex justify-center">
              <a 
                href="/contato" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Entre em Contato
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}