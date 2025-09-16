'use client'

import React, { useState } from 'react'
import { MessageCircle, Calendar, ArrowRight } from 'lucide-react'
import AppointmentModal from '../modals/AppointmentModal'

export default function BlogCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Olá! Gostaria de falar com um especialista sobre as soluções Vynlo para meu negócio.')
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank')
  }

  return (
    <>
      <section data-section="cta" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
              Transforme seu negócio
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
                como nossos clientes
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 font-manrope max-w-4xl mx-auto leading-relaxed mb-12">
              Viu como nossos clientes alcançaram resultados extraordinários? Chegou a sua vez de transformar seu negócio com a Vynlo
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={handleWhatsAppContact}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Falar com Especialista</span>
              </button>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white border-2 border-gray-200 text-gray-700 font-manrope font-bold px-8 py-4 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Agendar Demonstração</span>
              </button>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-500 font-manrope">
                Centenas de empresas já transformaram seus negócios com a Vynlo
              </p>
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