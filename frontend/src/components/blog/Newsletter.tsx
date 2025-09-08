'use client'

import { Mail, Bell, CheckCircle2 } from 'lucide-react'

export default function Newsletter() {
  return (
    <section data-section="newsletter" className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <Bell className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">Newsletter</span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            Receba insights
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              semanalmente
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 font-manrope max-w-3xl mx-auto leading-relaxed mb-12">
            Cadastre-se e receba os melhores conteúdos sobre gestão empresarial, cases de sucesso e dicas exclusivas
          </p>

          <form className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 font-manrope focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
              />
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>Assinar Grátis</span>
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Conteúdo exclusivo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sem spam</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}