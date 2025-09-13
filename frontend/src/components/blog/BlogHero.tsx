'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen,
  Search,
  ArrowRight
} from 'lucide-react'
import IntelligentSearch from './IntelligentSearch'
import { SearchFilters } from '../../services/searchService'
import { logger } from '../../utils/logger'

export default function BlogHero() {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    logger.componentMount('BlogHero')
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    logger.userInteraction('blog_hero_search', searchQuery)
  }

  const handleIntelligentSearch = (query: string, filters: Partial<SearchFilters>) => {
    setSearchQuery(query)
    logger.userInteraction('intelligent_search', JSON.stringify({ query, filters }))
    // Aqui você pode implementar a lógica para filtrar os resultados
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    logger.userInteraction('search_suggestion_click', suggestion)
  }

  return (
    <section 
      data-section="hero" 
      className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-black overflow-visible"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">
              Blog Vynlo
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-6xl lg:text-7xl font-manrope font-black text-white leading-tight mb-8">
            Insights que
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              transformam negócios
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-300 font-manrope leading-relaxed max-w-4xl mx-auto mb-12">
            Descubra estratégias, cases reais e dicas práticas para revolucionar a gestão do seu negócio. 
            Conteúdo especializado para restaurantes, barbearias, petshops, igrejas e muito mais.
          </p>

          {/* Intelligent Search */}
          <div className="mb-8">
            <IntelligentSearch 
              onSearch={handleIntelligentSearch}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
        </div>
      </div>
    </section>
  )
}