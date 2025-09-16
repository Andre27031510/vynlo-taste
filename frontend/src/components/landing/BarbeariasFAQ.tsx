'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Scissors } from 'lucide-react'

export default function BarbeariasFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Como funciona o agendamento online?',
      answer: 'Sistema completo com disponibilidade em tempo real, escolha de barbeiro, confirmação automática e lembretes por WhatsApp.'
    },
    {
      question: 'O sistema controla a agenda dos barbeiros?',
      answer: 'Sim, controle individual por barbeiro com horários disponíveis, bloqueios, folgas e gestão de capacidade por serviço.'
    },
    {
      question: 'Tem programa de fidelidade?',
      answer: 'Sistema completo de fidelidade com pontos, descontos progressivos e campanhas personalizadas para cada cliente.'
    },
    {
      question: 'Como funciona o controle financeiro?',
      answer: 'Gestão completa com faturamento automático, controle de comissões, relatórios por barbeiro e análise de performance.'
    },
    {
      question: 'Tem relatórios de performance?',
      answer: 'Dashboards completos com performance por barbeiro, serviços mais procurados, horários de pico e análise de receita.'
    },
    {
      question: 'O sistema funciona offline?',
      answer: 'Sim, funciona offline com sincronização automática quando a internet retorna, garantindo continuidade do atendimento.'
    },
    {
      question: 'Posso personalizar os serviços?',
      answer: 'Totalmente personalizável com catálogo de serviços, preços dinâmicos, tempo de execução e especialidades por barbeiro.'
    },
    {
      question: 'Tem suporte técnico?',
      answer: 'Suporte 24/7 especializado em barbearias, treinamento completo e acompanhamento personalizado.'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-6 py-3 mb-6">
            <Scissors className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Dúvidas Frequentes</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Perguntas sobre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Gestão de Barbearias
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Esclarecemos as principais dúvidas sobre nosso sistema
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-200 transition-colors"
            >
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-manrope font-bold text-gray-900 text-lg pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}