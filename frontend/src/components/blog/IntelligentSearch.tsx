'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  Star, 
  TrendingUp, 
  Calendar,
  BookOpen,
  Zap,
  Heart,
  History,
  Settings
} from 'lucide-react'
import { searchService } from '../../services/searchService'
import { LibraryFilters } from '../../services/libraryService'

interface IntelligentSearchProps {
  onSearch: (query: string, filters: Partial<LibraryFilters>) => void
  onSuggestionClick: (suggestion: string) => void
}

export default function IntelligentSearch({ onSearch, onSuggestionClick }: IntelligentSearchProps) {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [filters, setFilters] = useState<Partial<LibraryFilters>>({
    categories: [],
    contentTypes: [],
    sources: [],
    sortBy: 'relevance',
    dateRange: 'all',
    readTime: 'all',
    difficulty: 'all'
  })
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const history = searchService.getSearchHistory()
    setSearchHistory(history)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
        setShowFilters(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (value: string) => {
    setQuery(value)
    setIsExpanded(true)
    
    // Simular sugestões em tempo real
    if (value.length > 1) {
      const mockSuggestions: SearchSuggestion[] = [
        { text: 'automação whatsapp', type: 'query' as const, count: 12 },
        { text: 'gestão financeira', type: 'query' as const, count: 8 },
        { text: 'restaurantes', type: 'category' as const, count: 43 },
        { text: 'ifood', type: 'tag' as const, count: 15 },
        { text: 'delivery', type: 'tag' as const, count: 22 }
      ].filter(s => s.text.toLowerCase().includes(value.toLowerCase()))
      
      setSuggestions(mockSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, filters)
      setIsExpanded(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    onSuggestionClick(suggestion.text)
    setIsExpanded(false)
  }

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters }
    
    if (filterType === 'categories' || filterType === 'contentTypes' || filterType === 'sources') {
      const currentArray = newFilters[filterType] as string[] || []
      if (currentArray.includes(value)) {
        newFilters[filterType] = currentArray.filter(item => item !== value)
      } else {
        newFilters[filterType] = [...currentArray, value]
      }
    } else {
      newFilters[filterType] = value
    }
    
    setFilters(newFilters)
    onSearch(query, newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      categories: [],
      contentTypes: [],
      sources: [],
      sortBy: 'relevance' as const,
      dateRange: 'all' as const,
      readTime: 'all' as const,
      difficulty: 'all' as const
    }
    setFilters(clearedFilters)
    onSearch(query, clearedFilters)
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value !== 'all' && value !== 'relevance'
  ).length

  return (
    <div ref={searchRef} className="relative max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className={`relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl transition-all duration-300 ${
        isExpanded ? 'shadow-2xl shadow-blue-500/25' : 'hover:shadow-xl'
      }`}>
        <div className="flex items-center">
          <Search className="absolute left-4 w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar artigos, dicas, cases, estratégias..."
            className="w-full bg-transparent border-none outline-none px-14 py-4 text-white placeholder-gray-400 font-manrope text-lg"
          />
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative mr-2 p-2 rounded-xl transition-all duration-300 ${
              showFilters || activeFiltersCount > 0
                ? 'bg-blue-600 text-white' 
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <Filter className="w-5 h-5" />
            {activeFiltersCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{activeFiltersCount}</span>
              </div>
            )}
          </button>
          
          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="mr-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Search Panel */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl z-[9998] max-h-96 overflow-y-auto">
          
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Sugestões Inteligentes
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {suggestion.type === 'category' && <BookOpen className="w-4 h-4 text-blue-500" />}
                      {suggestion.type === 'tag' && <Star className="w-4 h-4 text-amber-500" />}
                      {suggestion.type === 'query' && <Search className="w-4 h-4 text-gray-500" />}
                      <span className="font-manrope text-gray-800">{suggestion.text}</span>
                    </div>
                    {suggestion.count > 0 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {suggestion.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && query.length === 0 && (
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-gray-500" />
                Buscas Recentes
              </h4>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((historyItem, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(historyItem)
                      onSuggestionClick(historyItem)
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                  >
                    {historyItem}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[9999] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Filtros Avançados
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Categories Filter */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Categorias</h4>
              <div className="space-y-2">
                {['restaurantes', 'barbearias', 'petshops', 'igrejas', 'gestao'].map(category => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories?.includes(category) || false}
                      onChange={() => handleFilterChange('categories', category)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Types Filter */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Tipo de Conteúdo</h4>
              <div className="space-y-2">
                {['Cases de Sucesso', 'Tutoriais', 'Dicas Práticas', 'Estratégias', 'Análises'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.contentTypes?.includes(type) || false}
                      onChange={() => handleFilterChange('contentTypes', type)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort and Time Filters */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Ordenar Por</h4>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="relevance">Relevância</option>
                  <option value="recent">Mais Recentes</option>
                  <option value="popular">Mais Populares</option>
                  <option value="recommended">Recomendados</option>
                </select>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Tempo de Leitura</h4>
                <select
                  value={filters.readTime}
                  onChange={(e) => handleFilterChange('readTime', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="quick">Rápida (≤5 min)</option>
                  <option value="medium">Média (5-15 min)</option>
                  <option value="long">Longa (&gt;15 min)</option>
                </select>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Período</h4>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="week">Última Semana</option>
                  <option value="month">Último Mês</option>
                  <option value="year">Último Ano</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}