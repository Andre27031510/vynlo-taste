'use client'

import { Mail, Bell, CheckCircle2 } from 'lucide-react'

export default function Newsletter() {
  return (
    <section data-section="newsletter" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-6 py-3 mb-8">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 font-manrope font-semibold text-sm">Newsletter</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Receba insights
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              semanalmente
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto leading-relaxed mb-12">
            Cadastre-se e receba os melhores conteúdos sobre gestão empresarial, cases de sucesso e dicas exclusivas
          </p>

          <form className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder-gray-500 font-manrope focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300"
              />
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>Assinar Grátis</span>
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Conteúdo exclusivo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sem spam</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}