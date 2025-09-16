'use client'

import { ArrowRight, MessageCircle, Calendar, Star, CheckCircle2 } from 'lucide-react'
import { useAppointmentModal } from '../../hooks/useAppointmentModal'
import AppointmentModal from '../modals/AppointmentModal'

export default function BlogCTABanner() {
  const { isOpen, openModal, closeModal } = useAppointmentModal()

  const handleContactClick = () => {
    window.location.href = '/contato'
  }
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <Star className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">Pronto para Transformar?</span>
          </div>
          
          {/* Main Heading */}
          <h2 className="text-4xl lg:text-6xl font-manrope font-black text-white mb-8 leading-tight">
            Automatize sua gestão
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              hoje mesmo
            </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 font-manrope max-w-4xl mx-auto leading-relaxed mb-12">
            Junte-se a mais de 5.000 empresas que já transformaram seus negócios com a Vynlo. 
            Comece sua jornada rumo à automação completa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button 
              onClick={handleContactClick}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3"
            >
              <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>Falar com Especialista</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button 
              onClick={openModal}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-3"
            >
              <Calendar className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>Agendar Demonstração</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Implementação em 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Suporte 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Garantia de 30 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ROI comprovado</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-manrope font-black text-white mb-2">Centenas</div>
              <div className="text-gray-400 font-manrope text-sm">Empresas Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-manrope font-black text-white mb-2">98%</div>
              <div className="text-gray-400 font-manrope text-sm">Satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-manrope font-black text-white mb-2">24h</div>
              <div className="text-gray-400 font-manrope text-sm">Implementação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-manrope font-black text-white mb-2">30%</div>
              <div className="text-gray-400 font-manrope text-sm">Redução de Custos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal isOpen={isOpen} onClose={closeModal} />
    </section>
  )
}
