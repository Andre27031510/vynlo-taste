import { useState, useEffect, useCallback } from 'react'
import { searchService, SearchResult } from '../services/searchService'
import { LibraryFilters } from '../services/libraryService'
import { contentService, Article } from '../services/contentService'

interface UseIntelligentSearchReturn {
  searchResult: SearchResult | null
  isLoading: boolean
  error: string | null
  currentQuery: string
  currentFilters: Partial<LibraryFilters>
  performSearch: (query: string, filters?: Partial<LibraryFilters>) => Promise<void>
  clearSearch: () => void
  addToFavorites: (articleId: string) => void
  removeFromFavorites: (articleId: string) => void
  addToHistory: (articleId: string) => void
  getRecommendations: () => Promise<Article[]>
}

export const useIntelligentSearch = (): UseIntelligentSearchReturn => {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentQuery, setCurrentQuery] = useState('')
  const [currentFilters, setCurrentFilters] = useState<Partial<LibraryFilters>>({})
  const [allArticles, setAllArticles] = useState<Article[]>([])

  // Carregar artigos na inicialização
  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const articles = await contentService.fetchDynamicContent()
      setAllArticles(articles)
    } catch (err) {
      console.error('Erro ao carregar artigos:', err)
      setError('Erro ao carregar conteúdo')
    }
  }

  const performSearch = useCallback(async (
    query: string, 
    filters: Partial<LibraryFilters> = {}
  ) => {
    if (!query.trim() && Object.keys(filters).length === 0) {
      setSearchResult(null)
      setCurrentQuery('')
      setCurrentFilters({})
      return
    }

    setIsLoading(true)
    setError(null)
    setCurrentQuery(query)
    setCurrentFilters(filters)

    try {
      const result = await searchService.intelligentSearch(query, allArticles)
      setSearchResult(result)
      
      // Log da busca para analytics
      console.log('Search performed:', {
        query,
        filters,
        resultsCount: result.totalCount,
        searchTime: result.searchTime
      })
      
    } catch (err) {
      console.error('Erro na busca:', err)
      setError('Erro ao realizar busca. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }, [allArticles])

  const clearSearch = useCallback(() => {
    setSearchResult(null)
    setCurrentQuery('')
    setCurrentFilters({})
    setError(null)
  }, [])

  const addToFavorites = useCallback((articleId: string) => {
    searchService.addToFavorites(articleId)
  }, [])

  const removeFromFavorites = useCallback((articleId: string) => {
    searchService.removeFromFavorites(articleId)
  }, [])

  const addToHistory = useCallback((articleId: string) => {
    searchService.addToReadingHistory(articleId)
  }, [])

  const getRecommendations = useCallback(async (): Promise<Article[]> => {
    try {
      // Buscar artigos recomendados baseados no histórico do usuário
      const result = await searchService.intelligentSearch('', allArticles)
      return result.articles.slice(0, 6)
    } catch (err) {
      console.error('Erro ao buscar recomendações:', err)
      return []
    }
  }, [allArticles])

  // Busca automática quando os filtros mudam
  useEffect(() => {
    if (currentQuery || Object.keys(currentFilters).length > 0) {
      const debounceTimer = setTimeout(() => {
        performSearch(currentQuery, currentFilters)
      }, 300)
      
      return () => clearTimeout(debounceTimer)
    }
  }, [currentQuery, currentFilters, performSearch])

  return {
    searchResult,
    isLoading,
    error,
    currentQuery,
    currentFilters,
    performSearch,
    clearSearch,
    addToFavorites,
    removeFromFavorites,
    addToHistory,
    getRecommendations
  }
}