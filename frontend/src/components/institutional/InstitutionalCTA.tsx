'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, MessageCircle, Calendar, CheckCircle2 } from 'lucide-react'
import { logger } from '../../utils/logger'

export default function InstitutionalCTA() {
  useEffect(() => {
    logger.componentMount('InstitutionalCTA')
  }, [])

  const handleCTAClick = (type: string) => {
    logger.userInteraction('institutional_cta_click', type)
  }

  return (
    <section data-section="cta" className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            Pronto para transformar
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              seu negócio?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 font-manrope max-w-4xl mx-auto leading-relaxed mb-12">
            Junte-se a mais de 5.000 empresas que já escolheram a Vynlo para revolucionar sua gestão empresarial
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button 
              onClick={() => handleCTAClick('whatsapp')}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Falar no WhatsApp</span>
            </button>
            
            <button 
              onClick={() => handleCTAClick('meeting')}
              className="bg-transparent border-2 border-white text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Agendar Reunião</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sem compromisso</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Resposta em 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Consultoria gratuita</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}