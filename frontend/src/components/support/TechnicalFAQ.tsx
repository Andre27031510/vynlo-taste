'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export default function TechnicalFAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs = [
    {
      question: 'Como integrar o Vynlo com meu sistema atual?',
      answer: 'A integração é feita através da nossa API REST. Fornecemos SDKs para as principais linguagens e documentação completa para facilitar o processo.'
    },
    {
      question: 'Qual o tempo de resposta da API?',
      answer: 'Nossa API tem tempo de resposta médio inferior a 50ms, com 99.9% de disponibilidade garantida por SLA.'
    },
    {
      question: 'Como configurar backup automático?',
      answer: 'O backup automático pode ser configurado no painel administrativo. Oferecemos backup diário, semanal e mensal com retenção configurável.'
    },
    {
      question: 'Posso personalizar as notificações do WhatsApp?',
      answer: 'Sim, todas as mensagens são totalmente personalizáveis através do nosso editor de templates ou via API.'
    },
    {
      question: 'Como resolver problemas de sincronização?',
      answer: 'Problemas de sincronização geralmente são resolvidos verificando a conexão de internet e reiniciando o serviço. Consulte nosso guia de troubleshooting.'
    }
  ]

  return (
    <section data-section="faq" className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">FAQ Técnico</span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Perguntas
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              Frequentes
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 transition-all duration-300">
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-300"
              >
                <span className="text-lg font-manrope font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`} />
              </button>
              
              {openFAQ === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600 font-manrope leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}