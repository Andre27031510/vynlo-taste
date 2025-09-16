'use client'

import { CheckCircle, ArrowRight } from 'lucide-react'

export default function ServicosBenefits() {
  const benefits = [
    'Aumento de 40% na produtividade da equipe',
    'Redução de 60% no tempo de gestão administrativa',
    'Melhoria de 85% na satisfação dos clientes',
    'Crescimento de 50% na receita mensal',
    'Controle total de projetos e prazos',
    'Relatórios automáticos e insights inteligentes'
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-manrope">
              Resultados Comprovados para
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Empresas de Serviços
              </span>
            </h2>
            <p className="text-xl text-gray-300 font-manrope">
              Mais de 1.200 empresas de serviços já transformaram sua gestão e viram resultados extraordinários.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-lg font-manrope">{benefit}</span>
                </div>
              ))}
            </div>

            <button className="group inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              <span>Ver Demonstração</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-500/20 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">1.2K+</div>
                  <div className="text-blue-300 text-sm">Empresas Ativas</div>
                </div>
                <div className="bg-green-500/20 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">40%</div>
                  <div className="text-green-300 text-sm">Aumento Produtividade</div>
                </div>
                <div className="bg-purple-500/20 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">85%</div>
                  <div className="text-purple-300 text-sm">Satisfação Clientes</div>
                </div>
                <div className="bg-orange-500/20 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">50%</div>
                  <div className="text-orange-300 text-sm">Crescimento Receita</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
