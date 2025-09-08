'use client'

import { Headphones, MessageCircle, Mail, Clock } from 'lucide-react'

export default function TechnicalSupport() {
  return (
    <section data-section="support" className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            Suporte
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              especializado
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Headphones, title: '24/7', description: 'Suporte contínuo' },
            { icon: MessageCircle, title: 'Chat', description: 'Resposta imediata' },
            { icon: Mail, title: 'Email', description: 'Suporte técnico' },
            { icon: Clock, title: '<2h', description: 'Tempo resposta' }
          ].map((support, index) => {
            const IconComponent = support.icon
            return (
              <div key={index} className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <IconComponent className="w-10 h-10 text-blue-400" />
                </div>
                <div className="text-3xl font-manrope font-black text-white mb-2">{support.title}</div>
                <div className="text-gray-400 font-manrope font-medium">{support.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}