'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  Filter, 
  BookOpen, 
  Star, 
  TrendingUp, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  Award,
  Globe,
  ArrowRight,
  User,
  Calendar,
  Tag,
  Loader2,
  X,
  ChevronDown
} from 'lucide-react'
import { libraryService, LibraryArticle, LibraryFilters, LibraryStats } from '../../services/libraryService'

// Professional SVG Icons for each segment
const SegmentIcons = {
  restaurantes: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <defs>
        <linearGradient id="restaurant-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path fill="url(#restaurant-grad)" d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L9.7 14.70l.79.79 4.49-4.49z"/>
    </svg>
  ),
  barbearias: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <defs>
        <linearGradient id="barber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <path fill="url(#barber-grad)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  petshops: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <defs>
        <linearGradient id="pet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
      </defs>
      <path fill="url(#pet-grad)" d="M4.5 9.5C3.12 9.5 2 8.38 2 7s1.12-2.5 2.5-2.5S7 5.62 7 7s-1.12 2.5-2.5 2.5zm15 0C18.12 9.5 17 8.38 17 7s1.12-2.5 2.5-2.5S22 5.62 22 7s-1.12 2.5-2.5 2.5zm-9.5 1C8.12 10.5 7 9.38 7 8s1.12-2.5 2.5-2.5S12 6.62 12 8s-1.12 2.5-2.5 2.5zm5 0C13.12 10.5 12 9.38 12 8s1.12-2.5 2.5-2.5S17 6.62 17 8s-1.12 2.5-2.5 2.5zM12 24c-4 0-8-2-8-8 0-2.8 2.2-5 5-5h6c2.8 0 5 2.2 5 5 0 6-4 8-8 8z"/>
    </svg>
  ),
  igrejas: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <defs>
        <linearGradient id="church-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path fill="url(#church-grad)" d="M18 12h4v10h-4v-3h-2v3H8v-3H6v3H2V12h4l4-8 4 8zm-6-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  ),
  educacao: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <defs>
        <linearGradient id="edu-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <path fill="url(#edu-grad)" d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
    </svg>
  ),
  servicos: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <defs>
        <linearGradient id="service-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <path fill="url(#service-grad)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  saude: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <defs>
        <linearGradient id="health-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <path fill="url(#health-grad)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  gestao: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <defs>
        <linearGradient id="management-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path fill="url(#management-grad)" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
    </svg>
  )
}

interface Category {
  id: string
  name: string
  count: number
  growth: number
  engagement: number
  color: string
  description: string
}

export default function PremiumLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [articles, setArticles] = useState<LibraryArticle[]>([])
  const [stats, setStats] = useState<LibraryStats | null>(null)
  const [filters, setFilters] = useState<Partial<LibraryFilters>>({})
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  const categories: Category[] = [
    {
      id: 'todos',
      name: 'Biblioteca Completa',
      count: 127,
      growth: 23,
      engagement: 92,
      color: 'from-slate-600 to-slate-800',
      description: 'Acesso completo a todos os artigos especializados'
    },
    {
      id: 'restaurantes',
      name: 'Restaurantes',
      count: 43,
      growth: 31,
      engagement: 94,
      color: 'from-emerald-500 to-emerald-700',
      description: 'Gestão, delivery e automação para restaurantes'
    },
    {
      id: 'barbearias',
      name: 'Barbearias',
      count: 28,
      growth: 18,
      engagement: 89,
      color: 'from-blue-500 to-blue-700',
      description: 'Agendamento, marketing e gestão para barbearias'
    },
    {
      id: 'petshops',
      name: 'Petshops',
      count: 19,
      growth: 27,
      engagement: 87,
      color: 'from-pink-500 to-pink-700',
      description: 'Automação WhatsApp e gestão para petshops'
    },
    {
      id: 'igrejas',
      name: 'Igrejas',
      count: 15,
      growth: 15,
      engagement: 91,
      color: 'from-amber-500 to-amber-700',
      description: 'Gestão financeira e administrativa para igrejas'
    },
    {
      id: 'educacao',
      name: 'Educação',
      count: 25,
      growth: 22,
      engagement: 88,
      color: 'from-indigo-500 to-indigo-700',
      description: 'Estratégias pedagógicas e gestão educacional'
    },
    {
      id: 'servicos',
      name: 'Serviços',
      count: 32,
      growth: 28,
      engagement: 90,
      color: 'from-teal-500 to-teal-700',
      description: 'Marketing e gestão para empresas de serviços'
    },
    {
      id: 'saude',
      name: 'Saúde',
      count: 21,
      growth: 33,
      engagement: 95,
      color: 'from-red-500 to-red-700',
      description: 'Marketing médico e gestão de clínicas'
    }
  ]

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  // Busca com debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    const timeout = setTimeout(() => {
      performSearch()
    }, 300)
    
    setSearchTimeout(timeout)
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [searchQuery, filters])

  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      const [searchResult, libraryStats] = await Promise.all([
        libraryService.globalSearch('', {}, 1, 12),
        libraryService.getLibraryStats()
      ])
      
      setArticles(searchResult.articles)
      setTotalCount(searchResult.totalCount)
      setHasMore(searchResult.hasMore)
      setSuggestions(searchResult.suggestions)
      setStats(libraryStats)
      
      console.log('📚 Biblioteca carregada:', {
        articles: searchResult.articles.length,
        total: searchResult.totalCount,
        stats: libraryStats
      })
    } catch (error) {
      console.error('Erro ao carregar biblioteca:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const performSearch = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const result = await libraryService.globalSearch(
        searchQuery,
        filters,
        1,
        12
      )
      
      setArticles(result.articles)
      setTotalCount(result.totalCount)
      setHasMore(result.hasMore)
      setSuggestions(result.suggestions)
      setCurrentPage(1)
      
      console.log(`🔍 Busca realizada: "${searchQuery}" - ${result.totalCount} resultados`)
    } catch (error) {
      console.error('Erro na busca:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = async () => {
    if (!hasMore || isLoading) return
    
    setIsLoading(true)
    try {
      const result = await libraryService.globalSearch(
        searchQuery,
        filters,
        currentPage + 1,
        12
      )
      
      setArticles(prev => [...prev, ...result.articles])
      setHasMore(result.hasMore)
      setCurrentPage(prev => prev + 1)
    } catch (error) {
      console.error('Erro ao carregar mais:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryClick = async (categoryId: string) => {
    if (categoryId === 'todos') {
      setFilters({})
      setSearchQuery('')
      return
    }
    
    setFilters(prev => ({
      ...prev,
      categories: [categoryId]
    }))
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleArticleClick = (article: LibraryArticle) => {
    if (article.url && article.url.startsWith('http')) {
      window.open(article.url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = article.url
    }
  }

  return (
    <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden min-h-screen">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-blue-400/30 rounded-full px-8 py-4 mb-8 shadow-2xl">
            <div className="relative">
              <BookOpen className="w-6 h-6 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
            </div>
            <span className="text-blue-300 font-manrope font-bold text-lg">Biblioteca Premium</span>
            <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" style={{animationDuration: '3s'}} />
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            <span className="inline-block animate-fadeInUp">Biblioteca</span>
            <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              Especializada
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 font-manrope max-w-4xl mx-auto leading-relaxed mb-12 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            Conteúdo técnico premium, cases reais e estratégias comprovadas por especialistas da indústria. 
            <span className="text-cyan-400 font-bold"> Mais de 127 artigos especializados</span> organizados por segmento.
          </p>

          {/* Premium Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-2 shadow-2xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0 pl-4">
                    <Search className="w-6 h-6 text-blue-400" />
                  </div>
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Buscar artigos especializados..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-blue-200 px-4 py-4 text-lg font-manrope focus:outline-none"
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg mr-2"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
            {stats ? [
              { label: 'Artigos', value: `${stats.totalArticles}+`, icon: BookOpen, color: 'text-blue-400' },
              { label: 'Visualizações', value: `${Math.floor(stats.totalViews / 1000)}K+`, icon: TrendingUp, color: 'text-green-400' },
              { label: 'Engajamento', value: `${stats.avgEngagement}%`, icon: Target, color: 'text-purple-400' },
              { label: 'Leitores Ativos', value: `${stats.activeReaders}`, icon: Award, color: 'text-yellow-400' }
            ] : [
              { label: 'Artigos', value: '127+', icon: BookOpen, color: 'text-blue-400' },
              { label: 'Visualizações', value: '50K+', icon: TrendingUp, color: 'text-green-400' },
              { label: 'Engajamento', value: '94%', icon: Target, color: 'text-purple-400' },
              { label: 'Satisfação', value: '98%', icon: Award, color: 'text-yellow-400' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all duration-300">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = SegmentIcons[category.id as keyof typeof SegmentIcons] || SegmentIcons.gestao
            const isActive = selectedCategory === category.id
            const isHovered = hoveredCard === category.id

            return (
              <div
                key={category.id}
                className="opacity-0 translate-y-8 scale-95"
                style={{
                  animation: `fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s forwards`
                }}
              >
                <div
                  onClick={() => handleCategoryClick(category.id)}
                  onMouseEnter={() => setHoveredCard(category.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative cursor-pointer transform transition-all duration-700 hover:scale-105 ${
                    isActive ? 'scale-105' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isHovered 
                      ? 'perspective(1000px) rotateX(10deg) rotateY(-10deg) translateZ(20px) scale(1.05)' 
                      : isActive 
                        ? 'perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1.02)' 
                        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
                  }}
                >
                  {/* Glassmorphism Card */}
                  <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 overflow-hidden shadow-2xl">
                    {/* Animated Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-all duration-700`}></div>
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"></div>
                    
                    {/* Premium Status Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        category.growth > 30 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                        category.growth > 20 ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' :
                        'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                      }`}>
                        {category.growth > 30 ? 'Premium' : category.growth > 20 ? 'Popular' : 'Trending'}
                      </div>
                    </div>

                    {/* Loading Overlay */}
                    {isLoading && isActive && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl z-30">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
                          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-blue-400 opacity-20"></div>
                        </div>
                        <div className="text-white font-manrope font-medium text-center mt-4">
                          <div>Carregando biblioteca...</div>
                          <div className="text-sm text-blue-200 mt-1">Preparando conteúdo especializado</div>
                        </div>
                      </div>
                    )}

                    {/* Professional Icon */}
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-700 shadow-xl overflow-hidden group-hover:scale-110 group-hover:rotate-6`}>
                      <IconComponent />
                      
                      {/* Icon Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Rotating Border */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-white/30 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-1000" style={{animationDuration: '3s'}}></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-2xl font-manrope font-black text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                        {category.name}
                      </h3>
                      
                      <p className="text-blue-200 text-sm mb-6 leading-relaxed">
                        {category.description}
                      </p>
                      
                      {/* Animated Counter */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-4xl font-manrope font-black text-cyan-400 group-hover:text-white transition-colors duration-300">
                          {category.count}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-400 font-bold">+{category.growth}%</div>
                          <div className="text-xs text-blue-200">este mês</div>
                        </div>
                      </div>
                      
                      {/* Advanced Progress Bar */}
                      <div className="w-full bg-white/10 rounded-full h-3 mb-6 overflow-hidden relative">
                        <div 
                          className={`bg-gradient-to-r ${category.color} h-full rounded-full transition-all duration-1500 ease-out relative overflow-hidden`}
                          style={{width: `${(category.count / 50) * 100}%`}}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                      
                      {/* Engagement Metrics */}
                      <div className="flex items-center justify-between text-xs text-blue-200 mb-6">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span>{category.engagement}% relevante</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-cyan-400" />
                          <span>Verificado</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-manrope font-bold py-3 px-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <div className="flex items-center justify-center gap-2">
                            <span>Explorar Biblioteca</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <>
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                          <Star className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <div className="absolute inset-0 rounded-3xl border-2 border-cyan-400 animate-pulse opacity-60"></div>
                      </>
                    )}

                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 animate-fadeInUp" style={{animationDelay: '1s'}}>
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg border border-blue-400/30 rounded-2xl px-8 py-6 shadow-2xl">
            <div className="text-white">
              <div className="text-lg font-bold">Biblioteca em constante crescimento</div>
              <div className="text-blue-200 text-sm">Novos artigos adicionados semanalmente</div>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold">+23% este mês</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  )
}