'use client'

import { Shield, MessageCircle, TrendingUp, Users } from 'lucide-react'

export default function SupportHero() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-manrope font-semibold text-sm">Suporte Premium</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-manrope font-black text-white leading-tight">
              Suporte que faz a diferença
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                no seu negócio
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              Equipe técnica especializada, resposta rápida e soluções personalizadas para garantir o sucesso da sua operação.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>Falar com Especialista</span>
              </button>
              
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Ver Cases de Sucesso</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">2h</div>
                <div className="text-gray-400 text-sm">Tempo Resposta</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Disponibilidade</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-gray-400 text-sm">Satisfação</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="bg-gray-900 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-white text-sm font-medium">Central de Suporte</div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg">
                    <span className="text-green-300 text-sm">Ticket #2024-001</span>
                    <span className="text-green-400 text-xs">Resolvido em 1h 23min</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-500/20 rounded-lg">
                    <span className="text-blue-300 text-sm">Ticket #2024-002</span>
                    <span className="text-blue-400 text-xs">Em andamento</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-500/20 rounded-lg">
                    <span className="text-purple-300 text-sm">Ticket #2024-003</span>
                    <span className="text-purple-400 text-xs">Aguardando resposta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}