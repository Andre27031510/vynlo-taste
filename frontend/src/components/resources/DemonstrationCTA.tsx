'use client'

import { Play, Calendar, Download, ArrowRight } from 'lucide-react'

export default function DemonstrationCTA() {
  return (
    <section data-section="demo" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Veja na
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              prática
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-4xl mx-auto leading-relaxed mb-12">
            Agende uma demonstração personalizada e veja como nossos recursos podem transformar seu negócio
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
              <Play className="w-5 h-5" />
              <span>Ver Demonstração</span>
            </button>
            
            <button className="bg-white border-2 border-gray-200 text-gray-700 font-manrope font-bold px-8 py-4 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Agendar Reunião</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}