'use client'

import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { logger } from '../../utils/logger'

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    logger.componentMount('Testimonials')
  }, [])

  const testimonials = [
    {
      name: 'Carlos Silva',
      company: 'Restaurante Bella Vista',
      role: 'Proprietário',
      content: 'A Vynlo transformou completamente nosso restaurante. Aumentamos as vendas em 250% e nossa operação ficou muito mais eficiente.',
      rating: 5,
      avatar: 'CS'
    },
    {
      name: 'Marina Santos',
      company: 'Barbearia Premium',
      role: 'Gerente',
      content: 'Sistema incrível! Nossos clientes adoram o agendamento online e conseguimos otimizar nossa agenda. Recomendo para todos.',
      rating: 5,
      avatar: 'MS'
    },
    {
      name: 'Roberto Lima',
      company: 'PetCare Clínica',
      role: 'Veterinário',
      content: 'A digitalização dos prontuários e o sistema de agendamento revolucionaram nossa clínica. Atendimento muito mais ágil.',
      rating: 5,
      avatar: 'RL'
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
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            O que nossos
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              clientes dizem
            </span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 text-center">
            <Quote className="w-16 h-16 text-blue-600 mx-auto mb-8" />
            
            <p className="text-2xl font-manrope text-gray-700 leading-relaxed mb-8">
              "{testimonials[currentTestimonial].content}"
            </p>
            
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonials[currentTestimonial].avatar}
              </div>
              <div className="text-left">
                <div className="font-manrope font-bold text-gray-900 text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-600 font-manrope">
                  {testimonials[currentTestimonial].role} - {testimonials[currentTestimonial].company}
                </div>
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