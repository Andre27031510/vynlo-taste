'use client'

import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { logger } from '../../utils/logger'

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    logger.componentMount('Testimonials')
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: 'Carlos Eduardo Mendes',
      company: 'Grupo Gastronômico Excellence',
      role: 'CEO & Founder',
      content: 'Em 15 anos de mercado, nunca vi uma transformação tão rápida e eficaz. O Vynlo Taste revolucionou nossas 15 unidades: integração perfeita com todos os apps de delivery, gestão unificada em tempo real e analytics que nos permitiram aumentar o ROI em 450%. A equipe técnica é excepcional, suporte 24/7 realmente funciona. Investimento que se paga em meses, não anos.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      metrics: { roi: '+450%', efficiency: '+280%', time: '12 meses' },
      company_size: '15 unidades',
      industry: 'Gastronomia'
    },
    {
      name: 'Marina Fernanda Costa',
      company: 'Premium Beauty Network',
      role: 'Diretora de Operações',
      content: 'Gerencio 25 barbearias e o desafio era unificar tudo em uma plataforma só. O Vynlo superou todas as expectativas: agendamento inteligente com IA que otimiza nossa agenda, programa de fidelidade que aumentou a retenção em 92%, integração WhatsApp que automatizou 80% do atendimento. Dashboard executivo me dá visão completa em tempo real. ROI de 380% em 8 meses.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      metrics: { bookings: '+380%', retention: '92%', automation: '80%' },
      company_size: '25 unidades',
      industry: 'Beleza & Estética'
    },
    {
      name: 'Dr. Roberto Almeida Silva',
      company: 'VetCare Enterprise Group',
      role: 'Diretor Médico',
      content: 'Como veterinário há 20 anos, sei o quão complexa é a gestão de clínicas. O Vynlo transformou nossas 12 clínicas: prontuário eletrônico integrado, telemedicina funcional, gestão de estoque farmacêutico automatizada, sistema de vacinação com alertas inteligentes. Reduzimos 85% do tempo de atendimento, aumentamos 340% a base de clientes. Compliance regulatório automatizado. Tecnologia que realmente entende nossa área.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      metrics: { time: '-85%', clients: '+340%', satisfaction: '97%' },
      company_size: '12 clínicas',
      industry: 'Saúde Animal'
    }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    logger.userInteraction('testimonial_next')
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    logger.userInteraction('testimonial_prev')
  }

  return (
    <section data-section="testimonials" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Star className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">Depoimentos</span>
          </div>
          
          <h2 className="text-lg font-manrope font-black text-gray-900 mb-8 leading-tight">
            O que nossos
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              clientes dizem
            </span>
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12">
            <Quote className="w-16 h-16 text-blue-600 mx-auto mb-8" />
            
            <p className="text-xl font-manrope text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
              "{testimonials[currentTestimonial].content}"
            </p>
            
            <div className="flex justify-center mb-8">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex items-center justify-center lg:justify-end gap-4">
                <img 
                  src={testimonials[currentTestimonial].avatar} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full object-cover shadow-lg"
                />
                <div className="text-left">
                  <div className="font-manrope font-bold text-gray-900 text-xl mb-1">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-blue-600 font-manrope font-semibold text-sm mb-1">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="text-gray-600 font-manrope text-sm">
                    {testimonials[currentTestimonial].company}
                  </div>
                  <div className="text-gray-500 font-manrope text-xs mt-1">
                    {testimonials[currentTestimonial].company_size} • {testimonials[currentTestimonial].industry}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(testimonials[currentTestimonial].metrics).map(([key, value], index) => (
                  <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="text-2xl font-black text-gray-900 font-manrope mb-1">{value}</div>
                    <div className="text-gray-600 font-manrope text-xs capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-blue-600" />
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6 text-blue-600" />
          </button>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}