'use client'

import React from 'react'
import { Bot, Zap, BarChart3, Users } from 'lucide-react'

export default function IABotHero() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-slate-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3">
              <Bot className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-manrope font-semibold text-sm">Inteligência Artificial</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-manrope font-black text-white leading-tight">
              IA Bot para
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                Empresas
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              Inteligência artificial avançada para automatizar processos, analisar dados e otimizar resultados empresariais com precisão total.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">1000+</div>
                <div className="text-gray-400 text-sm">Bots Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-gray-400 text-sm">Precisão</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Disponível</div>
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
                  <div className="text-white text-sm font-medium">IA Dashboard</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-500/20 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 text-sm">Automação</span>
                    </div>
                    <div className="text-2xl font-bold text-white">847</div>
                  </div>
                  <div className="bg-green-500/20 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm">Análises</span>
                    </div>
                    <div className="text-2xl font-bold text-white">12.5K</div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white text-sm font-medium">Performance IA</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">Ativo</span>
                    </div>
                  </div>
                  <div className="h-20 flex items-end space-x-1">
                    {[85, 92, 88, 95, 89, 97, 91, 98, 94, 99, 96, 100].map((height, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t flex-1 transition-all duration-1000"
                        style={{ height: `${height}%` }}
                      />
                    ))}
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