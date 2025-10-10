import { useState, useEffect } from 'react'
import { contentService, Article, CategoryMetrics } from '../services/contentService'

interface UseContentDataReturn {
  articles: Article[]
  categories: CategoryMetrics[]
  featuredArticles: Article[]
  realTimeMetrics: any
  isLoading: boolean
  error: string | null
  searchArticles: (query: string) => Promise<Article[]>
  getArticlesByCategory: (category: string) => Promise<Article[]>
  refreshContent: () => Promise<void>
}

export const useContentData = (): UseContentDataReturn => {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<CategoryMetrics[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeContent()
    
    // Iniciar atualizações automáticas
    contentService.startAutoUpdate()
    
    // Atualizar métricas em tempo real a cada 30 segundos
    const metricsInterval = setInterval(updateRealTimeMetrics, 30000)
    
    return () => {
      clearInterval(metricsInterval)
      contentService.stopAutoUpdate() // Limpar intervalo para evitar memory leak
    }
  }, [])

  const initializeContent = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [
        articlesData,
        categoriesData,
        featuredData,
        metricsData
      ] = await Promise.all([
        contentService.fetchDynamicContent(),
        contentService.getCategoryMetrics(),
        contentService.getFeaturedArticles(),
        contentService.getRealTimeMetrics()
      ])

      setArticles(articlesData)
      setCategories(categoriesData)
      setFeaturedArticles(featuredData)
      setRealTimeMetrics(metricsData)
    } catch (err) {
      setError('Erro ao carregar conteúdo. Usando dados em cache.')
      console.error('Content loading error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateRealTimeMetrics = async () => {
    try {
      const metrics = await contentService.getRealTimeMetrics()
      setRealTimeMetrics(metrics)
    } catch (err) {
      console.error('Metrics update error:', err)
    }
  }

  const searchArticles = async (query: string): Promise<Article[]> => {
    try {
      return await contentService.searchArticles(query)
    } catch (err) {
      console.error('Search error:', err)
      return []
    }
  }

  const getArticlesByCategory = async (category: string): Promise<Article[]> => {
    try {
      return await contentService.getArticlesByCategory(category)
    } catch (err) {
      console.error('Category filter error:', err)
      return []
    }
  }

  const refreshContent = async (): Promise<void> => {
    await initializeContent()
  }

  return {
    articles,
    categories,
    featuredArticles,
    realTimeMetrics,
    isLoading,
    error,
    searchArticles,
    getArticlesByCategory,
    refreshContent
  }
}