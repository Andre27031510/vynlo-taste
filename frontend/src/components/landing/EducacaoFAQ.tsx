'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, GraduationCap } from 'lucide-react'

export default function EducacaoFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Como funciona o sistema de matrículas?',
      answer: 'Sistema completo de matrículas online com documentação digital, controle de vagas por turma, lista de espera automática e integração com sistema financeiro.'
    },
    {
      question: 'O sistema controla notas e frequência?',
      answer: 'Sim, controle total de notas por disciplina, cálculo automático de médias, registro de frequência e relatórios de desempenho para pais e alunos.'
    },
    {
      question: 'Tem portal para pais e alunos?',
      answer: 'Portal completo com acesso a notas, frequência, calendário escolar, comunicados, boletos e acompanhamento pedagógico em tempo real.'
    },
    {
      question: 'Como funciona o controle financeiro?',
      answer: 'Gestão completa de mensalidades, geração automática de boletos, controle de inadimplência, relatórios financeiros e integração bancária.'
    },
    {
      question: 'Tem relatórios pedagógicos?',
      answer: 'Dashboards completos com desempenho por turma, disciplina, professor, análise de aproveitamento e relatórios personalizados.'
    },
    {
      question: 'Os dados ficam seguros?',
      answer: 'Máxima segurança com criptografia avançada, backup automático, conformidade LGPD e controle de acesso por perfis.'
    },
    {
      question: 'Funciona para diferentes níveis de ensino?',
      answer: 'Sim, adaptável para educação infantil, fundamental, médio, técnico e superior com configurações específicas para cada modalidade.'
    },
    {
      question: 'Tem suporte técnico especializado?',
      answer: 'Suporte 24/7 com equipe especializada em gestão educacional, treinamento completo e acompanhamento pedagógico.'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-6 py-3 mb-6">
            <GraduationCap className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Dúvidas Frequentes</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Perguntas sobre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Gestão Escolar
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