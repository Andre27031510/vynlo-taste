'use client'

import React, { useState } from 'react'
import { Scissors } from 'lucide-react'
import AppointmentModal from '@/components/modals/AppointmentModal'

export default function BarbeariasCTABanner() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-blue-900 via-slate-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-6">
              <Scissors className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-manrope font-semibold text-sm">Comece Hoje</span>
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-manrope font-black text-white mb-6">
              Transforme sua Barbearia
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                em poucos minutos
              </span>
            </h3>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Junte-se a mais de 2.100 barbearias que já revolucionaram sua gestão
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleOpenModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Agendar Demonstração
              </button>
            </div>
          </div>
        </div>
      </section>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        serviceType="Demonstração - Sistema para Barbearias"
      />
    </>
  )
}