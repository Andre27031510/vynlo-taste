'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  ChevronDown,
  Heart,
  Eye,
  Bookmark,
  Share2,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RefreshCw,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Info,
  Lightbulb,
  Rocket,
  Crown,
  Diamond,
  Flame,
  ThumbsUp,
  MessageCircle,
  Send,
  Bell,
  Settings,
  Menu,
  MoreHorizontal
} from 'lucide-react'
import { libraryService, LibraryArticle, LibraryFilters, LibraryStats } from '../../../services/libraryService'
import Header from '../../landingpages/Header'
import Footer from '../../landingpages/Footer'

// Tipos para filtros avançados
interface AdvancedFilters extends LibraryFilters {
  dateRange?: 'today' | 'week' | 'month' | 'year' | 'all'
  sortBy?: 'relevance' | 'date' | 'popularity' | 'engagement'
  readTime?: 'quick' | 'medium' | 'long' | 'all'
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all'
  format?: 'article' | 'case-study' | 'guide' | 'tutorial' | 'all'
}

// Componente de Loading Skeleton
const ArticleSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl"></div>
      <div className="w-20 h-6 bg-white/20 rounded-full"></div>
    </div>
    <div className="space-y-4">
      <div className="w-3/4 h-6 bg-white/20 rounded-lg"></div>
      <div className="w-full h-4 bg-white/10 rounded-lg"></div>
      <div className="w-2/3 h-4 bg-white/10 rounded-lg"></div>
    </div>
    <div className="flex items-center justify-between mt-8">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
        <div className="w-24 h-4 bg-white/10 rounded-lg"></div>
      </div>
      <div className="w-16 h-8 bg-white/20 rounded-lg"></div>
    </div>
  </div>
)

// Componente de Card de Artigo Premium
const PremiumArticleCard = ({ article, onFavorite, onShare, isFavorited }: {
  article: LibraryArticle
  onFavorite: (id: string) => void
  onShare: (article: LibraryArticle) => void
  isFavorited: boolean
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isReading, setIsReading] = useState(false)

  const handleClick = () => {
    if (article.url && article.url.startsWith('http')) {
      window.open(article.url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = article.url
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-400 to-emerald-500'
      case 'intermediate': return 'from-yellow-400 to-orange-500'
      case 'advanced': return 'from-red-400 to-pink-500'
      default: return 'from-blue-400 to-cyan-500'
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'case-study': return <Target className="w-4 h-4" />
      case 'guide': return <BookOpen className="w-4 h-4" />
      case 'tutorial': return <Play className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  return (
    <div
      className="group relative transform transition-all duration-700 hover:scale-105 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d',
        transform: isHovered 
          ? 'perspective(1000px) rotateX(5deg) rotateY(-5deg) translateZ(20px) scale(1.02)' 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
      }}
    >
      {/* Glassmorphism Card */}
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 overflow-hidden shadow-2xl">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-700"></div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"></div>
        
        {/* Header com badges */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getDifficultyColor(article.difficulty || 'beginner')} rounded-xl flex items-center justify-center shadow-lg`}>
              {getFormatIcon(article.format || 'article')}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${getDifficultyColor(article.difficulty || 'beginner')} text-white`}>
                  {article.difficulty || 'Iniciante'}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-blue-200">
                  {article.category}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onFavorite(article.id)
              }}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isFavorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onShare(article)
              }}
              className="p-2 bg-white/20 text-white rounded-xl hover:bg-blue-500 transition-all duration-300"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div onClick={handleClick}>
          <h3 className="text-xl font-manrope font-black text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-blue-200 text-sm mb-6 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-full border border-cyan-500/30"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-xs text-blue-200">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{article.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                <span>{article.engagement}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.readTime}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs">
                <div className="text-white font-medium">{article.author}</div>
                <div className="text-blue-200">{new Date(article.date).toLocaleDateString('pt-BR')}</div>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-manrope font-bold py-3 px-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center gap-2">
                <span>Ler Artigo</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Reading Progress Indicator */}
        {isReading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
        )}
      </div>
    </div>
  )
}

export default function BibliotecaCompletaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Estados principais
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState<LibraryArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<LibraryArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<LibraryStats | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  
  // Estados de filtros
  const [filters, setFilters] = useState<AdvancedFilters>({
    dateRange: 'all',
    sortBy: 'relevance',
    readTime: 'all',
    difficulty: 'all',
    format: 'all'
  })
  
  // Estados de UI
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  
  // Refs
  const searchRef = useRef<HTMLInputElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  // Aplicar filtros da URL
  useEffect(() => {
    const categoria = searchParams.get('categoria')
    if (categoria) {
      setFilters(prev => ({
        ...prev,
        categories: [categoria]
      }))
    }
  }, [searchParams])

  // Busca com debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      performSearch()
    }, 300)
    
    return () => clearTimeout(timeout)
  }, [searchQuery, filters])

  // Intersection Observer para paginação infinita
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading])

  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      const [searchResult, libraryStats] = await Promise.all([
        libraryService.globalSearch('', {}, 1, 12),
        libraryService.getLibraryStats()
      ])
      
      setArticles(searchResult.articles)
      setFilteredArticles(searchResult.articles)
      setTotalCount(searchResult.totalCount)
      setHasMore(searchResult.hasMore)
      setSuggestions(searchResult.suggestions)
      setStats(libraryStats)
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
      
      setFilteredArticles(result.articles)
      setTotalCount(result.totalCount)
      setHasMore(result.hasMore)
      setSuggestions(result.suggestions)
      setCurrentPage(1)
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
      
      setFilteredArticles(prev => [...prev, ...result.articles])
      setHasMore(result.hasMore)
      setCurrentPage(prev => prev + 1)
    } catch (error) {
      console.error('Erro ao carregar mais:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFavorite = (articleId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(articleId)) {
        newFavorites.delete(articleId)
      } else {
        newFavorites.add(articleId)
      }
      return newFavorites
    })
  }

  const handleShare = (article: LibraryArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: article.url
      })
    } else {
      navigator.clipboard.writeText(article.url)
    }
  }

  const clearFilters = () => {
    setFilters({
      dateRange: 'all',
      sortBy: 'relevance',
      readTime: 'all',
      difficulty: 'all',
      format: 'all'
    })
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <Header />
      
      {/* Hero Section Premium */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
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
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-blue-400/30 rounded-full px-8 py-4 mb-8 shadow-2xl">
              <div className="relative">
                <BookOpen className="w-8 h-8 text-blue-400 animate-pulse" />
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <span className="text-blue-300 font-manrope font-bold text-xl">Biblioteca Completa</span>
              <div className="flex items-center gap-1">
                <Crown className="w-6 h-6 text-yellow-400 animate-bounce" />
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-black rounded-full animate-pulse">
                  PREMIUM
                </span>
              </div>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-manrope font-black text-white mb-8 leading-tight">
              <span className="inline-block animate-fadeInUp">Centro de</span>
              <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                Conhecimento
              </span>
              <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                Especializado
              </span>
            </h1>
            
            <p className="text-2xl text-blue-100 font-manrope max-w-5xl mx-auto leading-relaxed mb-12 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              Acesso completo à maior biblioteca de conteúdo técnico especializado do Brasil. 
              <span className="text-cyan-400 font-bold"> Mais de {stats?.totalArticles || 127} artigos premium</span> com 
              cases reais, estratégias comprovadas e insights exclusivos de especialistas da indústria.
            </p>

            {/* Stats Premium */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
              {[
                { label: 'Artigos Premium', value: `${stats?.totalArticles || 127}+`, icon: BookOpen, color: 'text-blue-400' },
                { label: 'Visualizações', value: `${Math.floor((stats?.totalViews || 50000) / 1000)}K+`, icon: Eye, color: 'text-green-400' },
                { label: 'Engajamento Médio', value: `${stats?.avgEngagement || 94}%`, icon: Target, color: 'text-purple-400' },
                { label: 'Leitores Ativos', value: `${stats?.activeReaders || 2847}`, icon: Award, color: 'text-yellow-400' }
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center group hover:bg-white/10 transition-all duration-500 hover:scale-105">
                  <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`} />
                  <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Search & Filters */}
          <div className="max-w-6xl mx-auto mb-16">
            {/* Search Bar Premium */}
            <div className="relative group mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-3 shadow-2xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0 pl-6">
                    <Search className="w-7 h-7 text-blue-400" />
                  </div>
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Buscar na biblioteca completa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="flex-1 bg-transparent text-white placeholder-blue-200 px-6 py-5 text-xl font-manrope focus:outline-none"
                  />
                  <div className="flex items-center gap-3 pr-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                        showFilters 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                          : 'bg-white/20 text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600'
                      }`}
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                      <span>Filtros</span>
                    </button>
                    <button
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      className="p-3 bg-white/20 text-white rounded-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all duration-300"
                    >
                      {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8 animate-fadeInUp">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {/* Date Range */}
                  <div>
                    <label className="block text-white font-medium mb-3">Período</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                      className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400"
                    >
                      <option value="all">Todos</option>
                      <option value="today">Hoje</option>
                      <option value="week">Esta semana</option>
                      <option value="month">Este mês</option>
                      <option value="year">Este ano</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-white font-medium mb-3">Ordenar por</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400"
                    >
                      <option value="relevance">Relevância</option>
                      <option value="date">Data</option>
                      <option value="popularity">Popularidade</option>
                      <option value="engagement">Engajamento</option>
                    </select>
                  </div>

                  {/* Read Time */}
                  <div>
                    <label className="block text-white font-medium mb-3">Tempo de leitura</label>
                    <select
                      value={filters.readTime}
                      onChange={(e) => setFilters(prev => ({ ...prev, readTime: e.target.value as any }))}
                      className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400"
                    >
                      <option value="all">Todos</option>
                      <option value="quick">Rápida (1-3 min)</option>
                      <option value="medium">Média (4-8 min)</option>
                      <option value="long">Longa (9+ min)</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-white font-medium mb-3">Nível</label>
                    <select
                      value={filters.difficulty}
                      onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400"
                    >
                      <option value="all">Todos</option>
                      <option value="beginner">Iniciante</option>
                      <option value="intermediate">Intermediário</option>
                      <option value="advanced">Avançado</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium py-3 px-4 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        <span>Limpar</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-white">
                <span className="text-2xl font-bold">{totalCount.toLocaleString()}</span>
                <span className="text-blue-200 ml-2">artigos encontrados</span>
                {searchQuery && (
                  <span className="text-cyan-400 ml-2">para "{searchQuery}"</span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-blue-200 text-sm">
                  Página {currentPage} • {filteredArticles.length} carregados
                </div>
                {isLoading && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Carregando...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && filteredArticles.length === 0 ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
              {[...Array(9)].map((_, index) => (
                <ArticleSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
              {filteredArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="opacity-0 translate-y-8"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
                  }}
                >
                  <PremiumArticleCard
                    article={article}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                    isFavorited={favorites.has(article.id)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load More Trigger */}
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-16">
            {isLoading && filteredArticles.length > 0 && (
              <div className="flex items-center gap-3 text-blue-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-lg font-medium">Carregando mais artigos...</span>
              </div>
            )}
            {!hasMore && filteredArticles.length > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/30 rounded-full px-6 py-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">Todos os artigos foram carregados</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Custom Styles */}
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
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}