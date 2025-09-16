'use client'

import React from 'react'
import { MessageCircle, CheckCircle2, Bot, Zap, Clock } from 'lucide-react'

export default function IABotCTABanner() {
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Olá! Gostaria de conhecer a IA Bot para meu negócio.')
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank')
  }

  return (
    <section className="py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-5 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-5 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-manrope font-black text-white mb-3 leading-tight">
            Implemente IA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              no seu negócio hoje
            </span>
          </h2>
          <p className="text-gray-300 font-manrope max-w-2xl mx-auto">
            Transforme processos com inteligência artificial avançada
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Bot className="w-5 h-5 text-blue-400 mr-1" />
              <span className="text-xl font-bold text-white">1000+</span>
            </div>
            <p className="text-gray-400 text-xs">Bots IA</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-5 h-5 text-green-400 mr-1" />
              <span className="text-xl font-bold text-white">+80%</span>
            </div>
            <p className="text-gray-400 text-xs">Automação</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-5 h-5 text-purple-400 mr-1" />
              <span className="text-xl font-bold text-white">-90%</span>
            </div>
            <p className="text-gray-400 text-xs">Tempo</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mb-8">
          <button 
            onClick={handleWhatsAppContact}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Falar com Especialista IA</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>IA 24/7</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Treinamento Gratuito</span>
          </div>
        </div>
      </div>
    </section>
  )
}