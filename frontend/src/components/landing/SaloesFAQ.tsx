'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Scissors } from 'lucide-react'

export default function SaloesFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Como funciona o agendamento online?',
      answer: 'Sistema completo com disponibilidade em tempo real, escolha de profissional, confirmação automática e lembretes por SMS/WhatsApp.'
    },
    {
      question: 'O sistema controla a agenda dos profissionais?',
      answer: 'Sim, controle individual por profissional com horários disponíveis, bloqueios, folgas e gestão de capacidade por serviço.'
    },
    {
      question: 'Tem programa de fidelidade para clientes?',
      answer: 'Sistema completo de fidelidade com pontos, descontos progressivos, cupons personalizados e campanhas de marketing.'
    },
    {
      question: 'Como funciona o controle de comissões?',
      answer: 'Cálculo automático de comissões por profissional, serviço realizado, produtos vendidos e relatórios detalhados de pagamento.'
    },
    {
      question: 'Tem relatórios de performance?',
      answer: 'Dashboards completos com performance por profissional, serviços mais procurados, horários de pico e análise de receita.'
    },
    {
      question: 'O sistema controla produtos e estoque?',
      answer: 'Sim, controle de produtos para venda e uso profissional, alertas de estoque baixo e integração com fornecedores.'
    },
    {
      question: 'Funciona para diferentes tipos de salão?',
      answer: 'Sim, adaptável para salões de beleza, barbearias, clínicas de estética, spas e centros de bem-estar.'
    },
    {
      question: 'Tem suporte técnico especializado?',
      answer: 'Suporte 24/7 com equipe especializada em gestão de salões, treinamento completo e acompanhamento personalizado.'
    },
    {
      question: 'Funciona para salões de qualquer tamanho?',
      answer: 'Perfeitamente escalável desde pequenos salões até grandes redes de beleza com múltiplas unidades.'
    },
    {
      question: 'Qual o investimento mensal?',
      answer: 'Planos flexíveis a partir de R$ 97/mês com todas as funcionalidades. Oferecemos proposta personalizada para cada salão.'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 rounded-full px-6 py-3 mb-6">
            <Scissors className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Dúvidas Frequentes</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Perguntas sobre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              Gestão de Salões
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Esclarecemos as principais dúvidas sobre nosso sistema para salões
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-pink-200 transition-colors"
            >
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-manrope font-bold text-gray-900 text-lg pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-pink-600 flex-shrink-0" />
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

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">Ainda tem dúvidas? Fale conosco!</p>
          <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Falar com Especialista
          </button>
        </div>
      </div>
    </section>
  )
}