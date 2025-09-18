'use client'

import { Quote, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default function SuccessCases() {
  const testimonials = [
    {
      quote: "Reduzimos 80% dos problemas técnicos após implementar o suporte premium. A equipe é excepcional!",
      author: "Carlos Silva",
      position: "CEO",
      company: "TechCorp",
      logo: "TC",
      metrics: { improvement: "80%", category: "Redução de Problemas" }
    },
    {
      quote: "Implementação em apenas 2 semanas com zero downtime. Suporte que realmente entende de negócio.",
      author: "Ana Costa",
      position: "CTO",
      company: "StartupXYZ",
      logo: "SX",
      metrics: { improvement: "2 sem", category: "Tempo de Implementação" }
    },
    {
      quote: "Suporte que realmente funciona. Resposta rápida, solução eficaz e equipe sempre disponível.",
      author: "Roberto Lima",
      position: "Diretor de Inovação",
      company: "InnovaTech",
      logo: "IT",
      metrics: { improvement: "24/7", category: "Disponibilidade" }
    }
  ]

  const stats = [
    { value: "500+", label: "Clientes Enterprise" },
    { value: "98%", label: "Satisfação" },
    { value: "2h", label: "Tempo Médio Resposta" },
    { value: "99.9%", label: "SLA Cumprido" }
  ]

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 rounded-full px-6 py-3 mb-6">
            <TrendingUp className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Cases de Sucesso</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Resultados que
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
              falam por si
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empresas que transformaram seus resultados com nosso suporte premium
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className="flex items-center justify-between mb-6">
                <Quote className="w-8 h-8 text-blue-500" />
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg w-12 h-12 rounded-xl flex items-center justify-center">
                  {testimonial.logo}
                </div>
              </div>

              <blockquote className="text-gray-700 font-manrope leading-relaxed mb-6 text-lg">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-manrope font-bold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600 text-sm">{testimonial.position}</div>
                  <div className="text-blue-600 text-sm font-medium">{testimonial.company}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{testimonial.metrics.improvement}</div>
                  <div className="text-gray-500 text-xs">{testimonial.metrics.category}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-manrope font-black text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}