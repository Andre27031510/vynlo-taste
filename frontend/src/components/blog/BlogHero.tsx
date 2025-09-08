'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen,
  TrendingUp,
  Users,
  Calendar,
  Search,
  ArrowRight
} from 'lucide-react'
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

  const stats = [
    { icon: BookOpen, value: '50+', label: 'Artigos' },
    { icon: TrendingUp, value: '200%', label: 'Crescimento Médio' },
    { icon: Users, value: '5.000+', label: 'Leitores' },
    { icon: Calendar, value: 'Semanal', label: 'Novos Posts' }
  ]

  return (
    <section 
      data-section="hero" 
      className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-black overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
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

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artigos, dicas, cases..."
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 pl-14 text-white placeholder-gray-400 font-manrope focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div 
                  key={index}
                  className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-manrope font-black text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-manrope text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}