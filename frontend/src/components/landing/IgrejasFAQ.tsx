'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Heart } from 'lucide-react'

export default function IgrejasFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Como funciona o cadastro de membros?',
      answer: 'O sistema permite cadastro completo com dados pessoais, histórico de batismo, participação em ministérios, grupos de células e acompanhamento espiritual personalizado.'
    },
    {
      question: 'O sistema controla dízimos e ofertas?',
      answer: 'Sim, com controle total de entradas, relatórios transparentes, prestação de contas automática e dashboards financeiros para liderança e membros.'
    },
    {
      question: 'Posso agendar cultos e eventos?',
      answer: 'Perfeitamente! Agenda completa para cultos regulares, eventos especiais, conferências, retiros e atividades ministeriais com notificações automáticas.'
    },
    {
      question: 'Como funciona a comunicação com os membros?',
      answer: 'Sistema integrado de avisos, newsletters, grupos de WhatsApp, e-mails personalizados e comunicação direta por ministérios e células.'
    },
    {
      question: 'Tem relatórios de crescimento da igreja?',
      answer: 'Sim, dashboards completos com métricas de crescimento, frequência, engajamento, conversões, batismos e análise de tendências.'
    },
    {
      question: 'Os dados dos membros ficam seguros?',
      answer: 'Absoluta segurança com criptografia avançada, backup automático, controle de acesso por níveis e conformidade com LGPD.'
    },
    {
      question: 'Posso controlar diferentes ministérios?',
      answer: 'Sim, gestão completa de ministérios, células, departamentos com líderes específicos e relatórios individualizados por área.'
    },
    {
      question: 'Tem suporte técnico especializado?',
      answer: 'Suporte 24/7 com equipe especializada em gestão eclesiástica, treinamento completo e acompanhamento personalizado.'
    },
    {
      question: 'Funciona para igrejas de qualquer tamanho?',
      answer: 'Perfeitamente escalável desde pequenas congregações até grandes denominações com milhares de membros e múltiplas unidades.'
    },
    {
      question: 'Qual o investimento mensal?',
      answer: 'Planos flexíveis a partir de R$ 97/mês com todas as funcionalidades. Oferecemos proposta personalizada para cada igreja.'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-6 py-3 mb-6">
            <Heart className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Dúvidas Frequentes</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Perguntas sobre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Gestão de Igrejas
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Esclarecemos as principais dúvidas sobre nosso sistema para igrejas
          </p>
        </div>

        {/* FAQ Items */}
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

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">Ainda tem dúvidas? Fale conosco!</p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Falar com Especialista
          </button>
        </div>
      </div>
    </section>
  )
}