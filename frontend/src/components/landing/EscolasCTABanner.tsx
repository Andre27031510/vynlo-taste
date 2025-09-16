'use client'

import React from 'react'
import { GraduationCap, Users, Shield, Clock } from 'lucide-react'

export default function EscolasCTABanner() {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-manrope font-black text-white mb-4">
              Transforme sua Escola hoje mesmo
            </h3>
            <p className="text-blue-100 text-lg mb-6 lg:mb-0">
              Junte-se a mais de 800 escolas que já revolucionaram sua gestão
            </p>
          </div>

          <div className="flex items-center space-x-8 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>800+ Escolas</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>LGPD Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Suporte 24/7</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-blue-600 font-manrope font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}