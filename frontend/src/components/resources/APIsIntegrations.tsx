'use client'

import { useState, useEffect } from 'react'
import { Globe, MessageCircle, CreditCard, Mail, Smartphone, Zap } from 'lucide-react'
import { logger } from '../../utils/logger'

export default function APIsIntegrations() {
  const [activeAPI, setActiveAPI] = useState<number | null>(null)

  useEffect(() => {
    logger.componentMount('APIsIntegrations')
  }, [])

  const apis = [
    {
      icon: Globe,
      title: 'REST API',
      description: 'APIs RESTful completas com documentação OpenAPI 3.0',
      endpoints: '50+ endpoints',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Business',
      description: 'Integração oficial com WhatsApp Business API',
      endpoints: 'Mensagens automáticas',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: CreditCard,
      title: 'Pagamentos',
      description: 'Integração com principais gateways de pagamento',
      endpoints: 'PIX, Cartão, Boleto',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Mail,
      title: 'Email & SMS',
      description: 'Envio de notificações por email e SMS',
      endpoints: 'Transacional',
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <section data-section="apis" className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">APIs e Integrações</span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            Conecte tudo com
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              nossas APIs
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {apis.map((api, index) => {
            const IconComponent = api.icon
            
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveAPI(index)}
                onMouseLeave={() => setActiveAPI(null)}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${api.color} rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-manrope font-bold text-white mb-4">{api.title}</h3>
                <p className="text-gray-300 font-manrope leading-relaxed mb-4">{api.description}</p>
                <div className="text-blue-400 font-manrope font-semibold">{api.endpoints}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}