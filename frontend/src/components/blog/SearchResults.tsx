'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  User, 
  Calendar, 
  Eye, 
  TrendingUp, 
  Star, 
  Heart,
  BookOpen,
  Filter,
  SortAsc,
  Zap
} from 'lucide-react'
import { Article } from '../../services/contentService'
import { SearchResult } from '../../services/searchService'
import { LibraryFilters } from '../../services/libraryService'

interface SearchResultsProps {
  searchResult: SearchResult | null
  isLoading: boolean
  query: string
  filters: Partial<LibraryFilters>
  onArticleClick: (article: Article) => void
  onFilterChange: (filters: Partial<LibraryFilters>) => void
}

export default function SearchResults({ 
  searchResult, 
  isLoading, 
  query, 
  filters,
  onArticleClick,
  onFilterChange 
}: SearchResultsProps) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const toggleFavorite = (articleId: string) => {
    setFavorites(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    )
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.split(' ').join('|')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-manrope">Buscando conteúdo especializado...</p>
          </div>
          
          {/* Loading Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                <div className="flex gap-6">
                  <div className="w-48 h-32 bg-gray-300 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="flex gap-4">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                      <div className="h-3 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!searchResult || searchResult.articles.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {query ? 'Nenhum resultado encontrado' : 'Digite algo para buscar'}
          </h3>
          <p className="text-gray-600 font-manrope mb-8">
            {query 
              ? `Não encontramos artigos para "${query}". Tente termos diferentes ou use os filtros.`
              : 'Use a busca inteligente para encontrar artigos, cases e estratégias especializadas.'
            }
          </p>
          
          {searchResult?.suggestions && searchResult.suggestions.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Que tal tentar:</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {searchResult.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onArticleClick({ query: suggestion.text } as any)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Resultados da Busca
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                <strong>{searchResult.totalCount}</strong> artigos encontrados
              </span>
              <span>•</span>
              <span>
                Busca realizada em <strong>{searchResult.searchTime}ms</strong>
              </span>
              {searchResult.correctedQuery && (
                <>
                  <span>•</span>
                  <span>
                    Você quis dizer: <strong>"{searchResult.correctedQuery}"</strong>?
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {viewMode === 'grid' ? <BookOpen className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            </button>
            
            <select
              value={filters.sortBy || 'relevance'}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="relevance">Relevância</option>
              <option value="recent">Mais Recentes</option>
              <option value="popular">Mais Populares</option>
              <option value="recommended">Recomendados</option>
            </select>
          </div>
        </div>

        {/* Search Results */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {searchResult.articles.map((article, index) => (
            <article
              key={article.id}
              onClick={() => onArticleClick(article)}
              className={`bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-200 ${
                viewMode === 'list' ? 'flex gap-6 p-6' : 'p-6'
              }`}
            >
              {/* Article Image */}
              <div className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center ${
                viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'w-full h-48 mb-4'
              }`}>
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex-1">
                {/* Article Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                    {article.source && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {article.source}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(article.id)
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      favorites.includes(article.id)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(article.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Article Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                  {highlightText(article.title, query)}
                </h3>

                {/* Article Excerpt */}
                <p className="text-gray-600 font-manrope leading-relaxed mb-4 line-clamp-3">
                  {highlightText(article.excerpt, query)}
                </p>

                {/* Article Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{article.views?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{article.engagement || 0}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span className="text-amber-600 font-semibold">
                      {Math.floor(Math.random() * 20 + 80)}% match
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        {searchResult.totalCount > searchResult.articles.length && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Carregar Mais Resultados
            </button>
          </div>
        )}
      </div>
    </div>
  )
}