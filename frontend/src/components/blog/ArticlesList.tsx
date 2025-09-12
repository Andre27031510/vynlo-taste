'use client'

import { Calendar, Clock, User, Tag } from 'lucide-react'

interface ArticlesListProps {
  selectedCategory: string
  searchQuery: string
}

export default function ArticlesList({ selectedCategory, searchQuery }: ArticlesListProps) {
  const articles = [
    {
      id: '4',
      title: 'Gestão Financeira Digital para Igrejas',
      excerpt: 'Como modernizar a gestão financeira mantendo transparência',
      category: 'igrejas',
      author: 'Pastor João Oliveira',
      date: '08 Jan 2024',
      readTime: '10 min',
      tags: ['igreja', 'financeiro', 'transparência']
    },
    {
      id: '5',
      title: 'Por que Investir em Sistema de Gestão?',
      excerpt: 'ROI comprovado em sistemas de gestão para PMEs',
      category: 'gestao',
      author: 'Ana Costa',
      date: '05 Jan 2024',
      readTime: '12 min',
      tags: ['roi', 'investimento', 'sistema']
    },
    {
      id: '6',
      title: 'Case: Restaurante XYZ Economiza 30%',
      excerpt: 'Como reduzir custos operacionais e aumentar margem',
      category: 'restaurantes',
      author: 'Equipe Vynlo',
      date: '03 Jan 2024',
      readTime: '9 min',
      tags: ['case', 'economia', 'restaurante']
    }
  ]

  return (
    <section data-section="articles" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Todos os
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              artigos
            </span>
          </h2>
        </div>

        <div className="space-y-8">
          {articles.map((article, index) => (
            <article key={article.id} className="bg-white border-2 border-gray-100 rounded-3xl p-8 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-blue-200">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl"></div>
                </div>
                
                <div className="lg:w-3/4">
                  <h3 className="text-3xl font-manrope font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-300">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 font-manrope leading-relaxed mb-6 text-lg">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {article.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-manrope font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}