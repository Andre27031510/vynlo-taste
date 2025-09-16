'use client'

import React, { useState } from 'react'
import { MessageCircle, Calendar, CheckCircle2, Users, TrendingUp, Clock, Star } from 'lucide-react'
import AppointmentModal from '../modals/AppointmentModal'

export default function TasteCTABanner() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Olá! Gostaria de conhecer o Vynlo Taste para meu restaurante.')
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank')
  }

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-manrope font-black text-white mb-4 leading-tight">
              Pronto para
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                revolucionar seu restaurante?
              </span>
            </h2>
            <p className="text-lg text-gray-300 font-manrope max-w-2xl mx-auto">
              Junte-se aos restaurantes que já aumentaram suas vendas com o Vynlo Taste
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-blue-400 mr-2" />
                <span className="text-2xl font-bold text-white">500+</span>
              </div>
              <p className="text-gray-400 text-sm">Restaurantes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
                <span className="text-2xl font-bold text-white">+40%</span>
              </div>
              <p className="text-gray-400 text-sm">Receita Média</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-purple-400 mr-2" />
                <span className="text-2xl font-bold text-white">-70%</span>
              </div>
              <p className="text-gray-400 text-sm">Tempo Gestão</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-2xl font-bold text-white">4.9/5</span>
              </div>
              <p className="text-gray-400 text-sm">Satisfação</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button 
              onClick={handleWhatsAppContact}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Falar com Especialista</span>
            </button>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Agendar Demonstração</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Teste Grátis 14 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Setup Gratuito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Suporte 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Sem Fidelidade</span>
            </div>
          </div>
        </div>
      </section>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}