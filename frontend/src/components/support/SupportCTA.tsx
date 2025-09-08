'use client'

import { MessageCircle, Calendar, CheckCircle2 } from 'lucide-react'

export default function SupportCTA() {
  return (
    <section data-section="cta" className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            Ainda precisa de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              ajuda?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 font-manrope max-w-4xl mx-auto leading-relaxed mb-12">
            Nossa equipe técnica especializada está pronta para resolver qualquer dúvida ou problema que você possa ter
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button className="bg-gradient-to-r from-emerald-600 to-green-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>Iniciar Chat</span>
            </button>
            
            <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Agendar Suporte</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Resposta em menos de 2 horas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Suporte técnico especializado</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Disponível 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}