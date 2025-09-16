'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Heart } from 'lucide-react'

export default function SaudeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Como funciona o prontuário eletrônico?',
      answer: 'Prontuário digital completo com histórico médico, exames, prescrições, evolução do paciente e integração com equipamentos médicos.'
    },
    {
      question: 'O sistema tem agendamento online?',
      answer: 'Sim, agendamento inteligente com disponibilidade em tempo real, confirmação automática, lembretes por SMS e integração com agenda médica.'
    },
    {
      question: 'Funciona com convênios médicos?',
      answer: 'Perfeitamente integrado com todos os convênios, faturamento TISS automático, autorização de procedimentos e controle de glosas.'
    },
    {
      question: 'Tem telemedicina integrada?',
      answer: 'Sim, plataforma completa de telemedicina com videochamada, prescrição digital, atestados eletrônicos e integração com prontuário.'
    },
    {
      question: 'Como funciona o controle financeiro?',
      answer: 'Gestão completa com faturamento automático, controle de recebimentos, relatórios por convênio e análise de performance financeira.'
    },
    {
      question: 'Os dados médicos ficam seguros?',
      answer: 'Máxima segurança com criptografia de ponta, conformidade LGPD, backup automático e controle de acesso por níveis.'
    },
    {
      question: 'Funciona para diferentes especialidades?',
      answer: 'Sim, adaptável para todas as especialidades médicas com templates específicos, protocolos personalizados e campos customizáveis.'
    },
    {
      question: 'Tem suporte técnico especializado?',
      answer: 'Suporte 24/7 com equipe especializada em sistemas médicos, treinamento completo e acompanhamento técnico personalizado.'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-6 py-3 mb-6">
            <Heart className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Dúvidas Frequentes</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Perguntas sobre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Gestão de Saúde
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