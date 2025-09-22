'use client'

import { Shield } from 'lucide-react'

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
                    <span className="text-green-400 text-xs">Resolvido</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-500/20 rounded-lg">
                    <span className="text-blue-300 text-sm">Ticket #2024-002</span>
                    <span className="text-blue-400 text-xs">Em andamento</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-500/20 rounded-lg">
                    <span className="text-purple-300 text-sm">Ticket #2024-003</span>
                    <span className="text-purple-400 text-xs">Aguardando</span>
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