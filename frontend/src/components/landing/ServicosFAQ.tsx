'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function ServicosFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'O sistema funciona para qualquer tipo de empresa de serviços?',
      answer: 'Sim, adaptável para consultorias, agências, prestadores de serviços, freelancers e qualquer negócio baseado em serviços.'
    },
    {
      question: 'Como funciona o controle de projetos?',
      answer: 'Sistema completo de gestão de projetos com cronogramas, tarefas, prazos, equipe e acompanhamento em tempo real.'
    },
    {
      question: 'Posso integrar com ferramentas que já uso?',
      answer: 'Sim, integração com WhatsApp Business, Google Workspace, Microsoft 365, CRM e outras ferramentas do seu ecossistema.'
    },
    {
      question: 'Como são gerados os relatórios?',
      answer: 'Relatórios automáticos e personalizáveis com métricas de performance, faturamento, produtividade e satisfação dos clientes.'
    },
    {
      question: 'O sistema funciona offline?',
      answer: 'Funcionalidades básicas funcionam offline, com sincronização automática quando a conexão for restabelecida.'
    },
    {
      question: 'Qual o suporte oferecido?',
      answer: 'Suporte técnico 24/7, treinamento completo da equipe e atualizações regulares sem custo adicional.'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-manrope mb-6">
            Gestão de Serviços
          </h2>
          <p className="text-xl text-gray-600 font-manrope">
            Esclarecemos as principais dúvidas sobre nosso sistema para empresas de serviços
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold text-gray-900 font-manrope">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed font-manrope">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
