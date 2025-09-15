// Serviço completo para Biblioteca Premium
import { articleService, SearchResult } from './articleService'
import { contentService } from './contentService'
import { searchService } from './searchService'
import { FALLBACK_ARTICLES, CATEGORY_KEYWORDS } from '../config/api'

export interface LibraryArticle {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  readTime: string
  tags: string[]
  views: number
  engagement: number
  source: string
  image?: string
  url: string
  relevanceScore?: number
}

export interface LibraryFilters {
  categories: string[]
  sources: string[]
  dateRange: 'week' | 'month' | 'year' | 'all'
  readTime: 'short' | 'medium' | 'long' | 'all'
  sortBy: 'relevance' | 'date' | 'popularity' | 'engagement'
}

export interface LibraryStats {
  totalArticles: number
  totalViews: number
  avgEngagement: number
  activeReaders: number
  topCategories: Array<{ category: string; count: number }>
  recentActivity: number
}

export interface LibrarySearchResult {
  articles: LibraryArticle[]
  totalCount: number
  hasMore: boolean
  searchTime: number
  suggestions: string[]
  filters: {
    availableCategories: string[]
    availableSources: string[]
    dateRanges: Array<{ label: string; value: string; count: number }>
  }
}

class LibraryService {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutos

  // Busca global em toda a biblioteca
  async globalSearch(
    query: string = '',
    filters: Partial<LibraryFilters> = {},
    page: number = 1,
    limit: number = 12
  ): Promise<LibrarySearchResult> {
    const startTime = Date.now()
    const cacheKey = `search_${query}_${JSON.stringify(filters)}_${page}_${limit}`
    
    // Verificar cache
    const cached = this.getFromCache(cacheKey)
    if (cached) {
      return { ...cached, searchTime: Date.now() - startTime }
    }

    try {
      console.log(`🔍 Busca global: "${query}" com filtros:`, filters)
      
      // Buscar em todas as categorias
      const allArticles = await this.aggregateAllArticles()
      
      // Aplicar filtros
      let filteredArticles = this.applyFilters(allArticles, filters)
      
      // Aplicar busca por texto
      if (query.trim()) {
        filteredArticles = await this.searchInArticles(filteredArticles, query)
      }
      
      // Ordenar resultados
      filteredArticles = this.sortArticles(filteredArticles, filters.sortBy || 'relevance')
      
      // Paginação
      const startIndex = (page - 1) * limit
      const paginatedArticles = filteredArticles.slice(startIndex, startIndex + limit)
      
      // Gerar sugestões
      const suggestions = await this.generateSuggestions(query, filteredArticles)
      
      // Preparar filtros disponíveis
      const availableFilters = this.getAvailableFilters(allArticles)
      
      const result: LibrarySearchResult = {
        articles: paginatedArticles,
        totalCount: filteredArticles.length,
        hasMore: startIndex + limit < filteredArticles.length,
        searchTime: Date.now() - startTime,
        suggestions,
        filters: availableFilters
      }
      
      // Salvar no cache
      this.saveToCache(cacheKey, result)
      
      console.log(`📚 Encontrados ${result.totalCount} artigos em ${result.searchTime}ms`)
      return result
      
    } catch (error) {
      console.error('Erro na busca global:', error)
      return this.getFallbackSearchResult(query, filters, page, limit)
    }
  }

  // Agregar artigos de todas as categorias
  private async aggregateAllArticles(): Promise<LibraryArticle[]> {
    const cacheKey = 'all_articles'
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    const allArticles: LibraryArticle[] = []
    const categories = Object.keys(FALLBACK_ARTICLES)
    
    // Buscar artigos de cada categoria
    for (const category of categories) {
      try {
        const searchResult = await articleService.searchArticlesByCategory(category)
        const categoryArticles = searchResult.articles.map(article => ({
          ...article,
          category,
          relevanceScore: this.calculateRelevanceScore(article)
        }))
        allArticles.push(...categoryArticles)
      } catch (error) {
        console.warn(`Erro ao buscar categoria ${category}:`, error)
        // Usar fallback local
        const fallbackArticles = this.getFallbackArticlesForCategory(category)
        allArticles.push(...fallbackArticles)
      }
    }
    
    // Remover duplicatas
    const uniqueArticles = this.removeDuplicates(allArticles)
    
    // Salvar no cache
    this.saveToCache(cacheKey, uniqueArticles)
    
    return uniqueArticles
  }

  // Aplicar filtros aos artigos
  private applyFilters(articles: LibraryArticle[], filters: Partial<LibraryFilters>): LibraryArticle[] {
    let filtered = [...articles]
    
    // Filtro por categorias
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(article => 
        filters.categories!.includes(article.category)
      )
    }
    
    // Filtro por fontes
    if (filters.sources && filters.sources.length > 0) {
      filtered = filtered.filter(article => 
        filters.sources!.includes(article.source)
      )
    }
    
    // Filtro por data
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()
      
      switch (filters.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      filtered = filtered.filter(article => 
        new Date(article.date) >= cutoffDate
      )
    }
    
    // Filtro por tempo de leitura
    if (filters.readTime && filters.readTime !== 'all') {
      filtered = filtered.filter(article => {
        const readTimeMinutes = parseInt(article.readTime.replace(/\D/g, ''))
        switch (filters.readTime) {
          case 'short': return readTimeMinutes <= 5
          case 'medium': return readTimeMinutes > 5 && readTimeMinutes <= 15
          case 'long': return readTimeMinutes > 15
          default: return true
        }
      })
    }
    
    return filtered
  }

  // Buscar texto nos artigos
  private async searchInArticles(articles: LibraryArticle[], query: string): Promise<LibraryArticle[]> {
    try {
      // Usar searchService para busca inteligente
      const searchResults = await searchService.intelligentSearch(query, articles)
      return searchResults.map(result => ({
        ...result.article,
        relevanceScore: result.score
      }))
    } catch (error) {
      console.warn('Erro na busca inteligente, usando busca simples:', error)
      return this.simpleTextSearch(articles, query)
    }
  }

  // Busca simples por texto
  private simpleTextSearch(articles: LibraryArticle[], query: string): LibraryArticle[] {
    const queryLower = query.toLowerCase()
    const searchTerms = queryLower.split(' ').filter(term => term.length > 2)
    
    return articles
      .map(article => {
        let score = 0
        const titleLower = article.title.toLowerCase()
        const excerptLower = article.excerpt.toLowerCase()
        const contentLower = article.content.toLowerCase()
        
        searchTerms.forEach(term => {
          if (titleLower.includes(term)) score += 3
          if (excerptLower.includes(term)) score += 2
          if (contentLower.includes(term)) score += 1
          if (article.tags.some(tag => tag.toLowerCase().includes(term))) score += 2
        })
        
        return { ...article, relevanceScore: score }
      })
      .filter(article => article.relevanceScore! > 0)
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
  }

  // Ordenar artigos
  private sortArticles(articles: LibraryArticle[], sortBy: string): LibraryArticle[] {
    switch (sortBy) {
      case 'date':
        return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      case 'popularity':
        return articles.sort((a, b) => b.views - a.views)
      case 'engagement':
        return articles.sort((a, b) => b.engagement - a.engagement)
      case 'relevance':
      default:
        return articles.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    }
  }

  // Gerar sugestões de busca
  private async generateSuggestions(query: string, articles: LibraryArticle[]): Promise<string[]> {
    if (!query.trim()) return []
    
    const suggestions = new Set<string>()
    const queryLower = query.toLowerCase()
    
    // Sugestões baseadas em títulos
    articles.forEach(article => {
      const words = article.title.toLowerCase().split(' ')
      words.forEach(word => {
        if (word.length > 3 && word.includes(queryLower)) {
          suggestions.add(word)
        }
      })
    })
    
    // Sugestões baseadas em tags
    articles.forEach(article => {
      article.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag)
        }
      })
    })
    
    // Sugestões baseadas em categorias
    Object.values(CATEGORY_KEYWORDS).flat().forEach(keyword => {
      if (keyword.toLowerCase().includes(queryLower)) {
        suggestions.add(keyword)
      }
    })
    
    return Array.from(suggestions).slice(0, 5)
  }

  // Obter filtros disponíveis
  private getAvailableFilters(articles: LibraryArticle[]) {
    const categories = [...new Set(articles.map(a => a.category))]
    const sources = [...new Set(articles.map(a => a.source))]
    
    const now = new Date()
    const dateRanges = [
      {
        label: 'Última semana',
        value: 'week',
        count: articles.filter(a => new Date(a.date) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)).length
      },
      {
        label: 'Último mês',
        value: 'month',
        count: articles.filter(a => new Date(a.date) >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)).length
      },
      {
        label: 'Último ano',
        value: 'year',
        count: articles.filter(a => new Date(a.date) >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)).length
      }
    ]
    
    return {
      availableCategories: categories,
      availableSources: sources,
      dateRanges
    }
  }

  // Obter estatísticas da biblioteca
  async getLibraryStats(): Promise<LibraryStats> {
    const cacheKey = 'library_stats'
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached
    
    try {
      const allArticles = await this.aggregateAllArticles()
      
      const stats: LibraryStats = {
        totalArticles: allArticles.length,
        totalViews: allArticles.reduce((sum, article) => sum + article.views, 0),
        avgEngagement: Math.round(allArticles.reduce((sum, article) => sum + article.engagement, 0) / allArticles.length),
        activeReaders: Math.floor(Math.random() * 50) + 20, // Simulado
        topCategories: this.getTopCategories(allArticles),
        recentActivity: Math.floor(Math.random() * 100) + 50 // Simulado
      }
      
      this.saveToCache(cacheKey, stats)
      return stats
      
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      return this.getFallbackStats()
    }
  }

  // Obter categorias mais populares
  private getTopCategories(articles: LibraryArticle[]) {
    const categoryCount = articles.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  // Calcular score de relevância
  private calculateRelevanceScore(article: any): number {
    let score = 0
    
    // Baseado em views
    score += Math.min(article.views / 1000, 10)
    
    // Baseado em engagement
    score += article.engagement / 10
    
    // Baseado na data (artigos mais recentes têm score maior)
    const daysSincePublished = (Date.now() - new Date(article.date).getTime()) / (1000 * 60 * 60 * 24)
    score += Math.max(0, 10 - daysSincePublished / 30)
    
    return Math.round(score * 10) / 10
  }

  // Remover artigos duplicados
  private removeDuplicates(articles: LibraryArticle[]): LibraryArticle[] {
    const seen = new Set<string>()
    return articles.filter(article => {
      const key = `${article.title}_${article.author}`.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  // Obter artigos fallback para categoria
  private getFallbackArticlesForCategory(category: string): LibraryArticle[] {
    const fallbackData = FALLBACK_ARTICLES[category as keyof typeof FALLBACK_ARTICLES] || []
    
    return fallbackData.map((item, index) => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      content: `Conteúdo especializado sobre ${item.title.toLowerCase()}...`,
      category,
      author: item.source,
      date: new Date(Date.now() - (index * 86400000)).toISOString().split('T')[0],
      readTime: `${Math.floor(Math.random() * 15) + 5} min`,
      tags: [category, 'especializado', 'vynlo'],
      views: Math.floor(Math.random() * 5000) + 1000,
      engagement: Math.floor(Math.random() * 20) + 80,
      source: item.source,
      image: `/blog/${category}-${index + 1}.jpg`,
      url: item.url,
      relevanceScore: Math.floor(Math.random() * 10) + 5
    }))
  }

  // Resultado fallback para busca
  private getFallbackSearchResult(
    query: string,
    filters: Partial<LibraryFilters>,
    page: number,
    limit: number
  ): LibrarySearchResult {
    const allFallbackArticles: LibraryArticle[] = []
    
    Object.entries(FALLBACK_ARTICLES).forEach(([category, articles]) => {
      const categoryArticles = this.getFallbackArticlesForCategory(category)
      allFallbackArticles.push(...categoryArticles)
    })
    
    const startIndex = (page - 1) * limit
    const paginatedArticles = allFallbackArticles.slice(startIndex, startIndex + limit)
    
    return {
      articles: paginatedArticles,
      totalCount: allFallbackArticles.length,
      hasMore: startIndex + limit < allFallbackArticles.length,
      searchTime: 0,
      suggestions: [],
      filters: {
        availableCategories: Object.keys(FALLBACK_ARTICLES),
        availableSources: ['Vynlo', 'Sebrae', 'Especialistas'],
        dateRanges: []
      }
    }
  }

  // Estatísticas fallback
  private getFallbackStats(): LibraryStats {
    return {
      totalArticles: 127,
      totalViews: 50000,
      avgEngagement: 92,
      activeReaders: 35,
      topCategories: [
        { category: 'restaurantes', count: 43 },
        { category: 'servicos', count: 32 },
        { category: 'barbearias', count: 28 },
        { category: 'educacao', count: 25 },
        { category: 'saude', count: 21 }
      ],
      recentActivity: 78
    }
  }

  // Cache helpers
  private getFromCache(key: string) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  private saveToCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  // Limpar cache
  clearCache() {
    this.cache.clear()
  }
}

export const libraryService = new LibraryService()
export type { LibraryService }