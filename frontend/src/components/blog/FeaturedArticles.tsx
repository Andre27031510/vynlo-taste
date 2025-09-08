'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, ArrowRight, Star } from 'lucide-react'
import { logger } from '../../utils/logger'

export default function FeaturedArticles() {
  const [activeArticle, setActiveArticle] = useState<number | null>(null)

  useEffect(() => {
    logger.componentMount('FeaturedArticles')
  }, [])

  const featuredArticles = [
    {
      id: '1',
      title: 'Como o Vynlo Taste aumentou vendas em 150%',
      excerpt: 'Case real: Restaurante Bella Vista triplicou faturamento em 6 meses',
      category: 'Case de Sucesso',
      author: 'Carlos Silva',
      date: '15 Jan 2024',
      readTime: '8 min',
      image: '/blog/restaurante-case.jpg'
    },
    {
      id: '2',
      title: '5 Dicas para Gestão de Barbearias em 2024',
      excerpt: 'Estratégias para otimizar agendamentos e aumentar receita',
      category: 'Gestão',
      author: 'Marina Santos',
      date: '12 Jan 2024',
      readTime: '6 min',
      image: '/blog/barbearia-dicas.jpg'
    },
    {
      id: '3',
      title: 'Automação WhatsApp para Petshops',
      excerpt: 'Como aumentar vendas em 200% com automação inteligente',
      category: 'Tecnologia',
      author: 'Roberto Lima',
      date: '10 Jan 2024',
      readTime: '7 min',
      image: '/blog/petshop-whatsapp.jpg'
    }
  ]

  return (
    <section data-section="featured" className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <Star className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">Artigos em Destaque</span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            Conteúdo
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              mais lido
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article, index) => (
            <article
              key={article.id}
              onMouseEnter={() => setActiveArticle(index)}
              onMouseLeave={() => setActiveArticle(null)}
              className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white font-manrope text-xs font-medium">{article.category}</span>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-manrope font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                  {article.title}
                </h3>
                
                <p className="text-gray-300 font-manrope leading-relaxed mb-6">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-blue-400 font-manrope font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <span>Ler artigo</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}