'use client'

import { useState } from 'react'
import { ChefHat, Pizza, Coffee, Utensils, Settings, Star, TrendingUp } from 'lucide-react'

export default function SpecializedSolutions() {
  const [activeSolution, setActiveSolution] = useState('gourmet')

  const solutions = {
    gourmet: {
      icon: ChefHat,
      title: 'Restaurante Gourmet',
      features: ['Controle de Ingredientes Premium', 'Análise de Margem por Prato', 'Gestão de Sommelier'],
      color: 'from-amber-500 to-orange-600'
    },
    fastfood: {
      icon: Pizza,
      title: 'Fast Food & Pizzaria',
      features: ['Pedidos Ultra-Rápidos', 'Integração Total Delivery', 'Controle de Tempo'],
      color: 'from-red-500 to-pink-600'
    },
    cafe: {
      icon: Coffee,
      title: 'Cafeteria & Bistrô',
      features: ['Programa de Fidelidade', 'Produtos Artesanais', 'Ambiente Personalizado'],
      color: 'from-emerald-500 to-teal-600'
    },
    franchise: {
      icon: Utensils,
      title: 'Rede & Franquia',
      features: ['Dashboard Multi-Unidades', 'Relatórios Consolidados', 'Gestão Centralizada'],
      color: 'from-blue-500 to-purple-600'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-manrope font-bold text-gray-900">Soluções Especializadas</h1>
        <p className="text-gray-600 font-manrope">Configure o sistema para seu tipo de estabelecimento</p>
      </div>

      {/* Solution Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(solutions).map(([key, solution]) => {
          const IconComponent = solution.icon
          const isActive = activeSolution === key
          
          return (
            <button
              key={key}
              onClick={() => setActiveSolution(key)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${solution.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-manrope font-bold text-gray-900 text-center">{solution.title}</h3>
            </button>
          )
        })}
      </div>

      {/* Active Solution Details */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className={`w-16 h-16 bg-gradient-to-r ${(solutions as any)[activeSolution].color} rounded-2xl flex items-center justify-center`}>
            {(() => {
              const IconComponent = (solutions as any)[activeSolution].icon
              return <IconComponent className="w-8 h-8 text-white" />
            })()}
          </div>
          <div>
            <h2 className="text-2xl font-manrope font-bold text-gray-900">{(solutions as any)[activeSolution].title}</h2>
            <p className="text-gray-600 font-manrope">Configuração otimizada para seu negócio</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(solutions as any)[activeSolution].features.map((feature: string, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <h4 className="font-manrope font-semibold text-gray-900">{feature}</h4>
              </div>
              <p className="text-sm text-gray-600 font-manrope">Funcionalidade especializada para seu segmento</p>
            </div>
          ))}
        </div>

        {/* Configuration Options */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-manrope font-bold text-gray-900 mb-4">Configurações Disponíveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-manrope text-gray-900">Layout Personalizado</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-manrope text-sm">
                Configurar
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-manrope text-gray-900">Integrações Específicas</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-manrope text-sm">
                Configurar
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-manrope text-gray-900">Relatórios Especializados</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-manrope text-sm">
                Configurar
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-manrope text-gray-900">Automações Inteligentes</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-manrope text-sm">
                Configurar
              </button>
            </div>
          </div>
        </div>

        {/* Apply Configuration */}
        <div className="mt-8 text-center">
          <button className={`bg-gradient-to-r ${(solutions as any)[activeSolution].color} text-white px-8 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-manrope font-semibold`}>
            Aplicar Configuração {(solutions as any)[activeSolution].title}
          </button>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-manrope font-bold text-gray-900 mb-4">Resultados com Soluções Especializadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-2xl font-manrope font-bold text-gray-900">+45%</h4>
            <p className="text-gray-600 font-manrope">Aumento na Eficiência</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-2xl font-manrope font-bold text-gray-900">4.9/5</h4>
            <p className="text-gray-600 font-manrope">Satisfação dos Clientes</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="text-2xl font-manrope font-bold text-gray-900">-60%</h4>
            <p className="text-gray-600 font-manrope">Tempo de Configuração</p>
          </div>
        </div>
      </div>
    </div>
  )
}