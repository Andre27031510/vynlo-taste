'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'

export default function LojasFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Como funciona o sistema de vendas (PDV)?',
      answer: 'PDV completo com leitura de código de barras, múltiplas formas de pagamento, cupom fiscal eletrônico e integração com estoque em tempo real.'
    },
    {
      question: 'O sistema controla o estoque automaticamente?',
      answer: 'Sim, controle automático com entrada/saída, alertas de estoque baixo, gestão de fornecedores e relatórios de movimentação.'
    },
    {
      question: 'Aceita todos os tipos de pagamento?',
      answer: 'Perfeitamente integrado com cartões de crédito/débito, PIX, dinheiro, parcelamentos e principais maquininhas do mercado.'
    },
    {
      question: 'Tem programa de fidelidade para clientes?',
      answer: 'Sim, sistema completo de fidelidade com pontos, descontos, cupons personalizados e campanhas de marketing direto.'
    },
    {
      question: 'Como funcionam os relatórios de vendas?',
      answer: 'Dashboards completos com vendas por período, produtos mais vendidos, análise de lucratividade e performance de vendedores.'
    },
    {
      question: 'O sistema emite nota fiscal?',
      answer: 'Sim, emissão automática de cupom fiscal eletrônico (CF-e) e nota fiscal eletrônica (NF-e) com integração SEFAZ.'
    },
    {
      question: 'Funciona para diferentes tipos de loja?',
      answer: 'Sim, adaptável para roupas, calçados, eletrônicos, farmácias, supermercados e qualquer tipo de varejo.'
    },
    {
      question: 'Tem suporte técnico especializado?',
      answer: 'Suporte 24/7 com equipe especializada em varejo, treinamento completo e acompanhamento personalizado.'
    },
    {
      question: 'Funciona para lojas de qualquer tamanho?',
      answer: 'Perfeitamente escalável desde pequenas lojas até grandes redes de varejo com múltiplas filiais.'
    },
    {
      question: 'Qual o investimento mensal?',
      answer: 'Planos flexíveis a partir de R$ 127/mês com todas as funcionalidades. Oferecemos proposta personalizada para cada loja.'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-6 py-3 mb-6">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-manrope font-semibold text-sm">Dúvidas Frequentes</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
            Perguntas sobre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Gestão de Lojas
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Esclarecemos as principais dúvidas sobre nosso sistema para lojas
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