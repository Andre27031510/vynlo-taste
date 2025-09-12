import { Article } from './contentService'

interface SearchFilters {
  categories: string[]
  contentTypes: string[]
  sources: string[]
  sortBy: 'relevance' | 'recent' | 'popular' | 'recommended'
  dateRange: 'all' | 'week' | 'month' | 'year'
  readTime: 'all' | 'quick' | 'medium' | 'long'
  difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced'
}

interface SearchSuggestion {
  text: string
  type: 'query' | 'category' | 'tag' | 'author'
  count: number
}

interface SearchResult {
  articles: Article[]
  totalCount: number
  suggestions: SearchSuggestion[]
  searchTime: number
  correctedQuery?: string
}

interface UserPreferences {
  favoriteCategories: string[]
  readingHistory: string[]
  favorites: string[]
  searchHistory: string[]
  theme: 'light' | 'dark'
  density: 'compact' | 'comfortable' | 'spacious'
  defaultSort: string
}

class SearchService {
  private searchHistory: string[] = []
  private userPreferences: UserPreferences = {
    favoriteCategories: [],
    readingHistory: [],
    favorites: [],
    searchHistory: [],
    theme: 'light',
    density: 'comfortable',
    defaultSort: 'relevance'
  }

  async intelligentSearch(
    query: string, 
    filters: Partial<SearchFilters> = {},
    articles: Article[]
  ): Promise<SearchResult> {
    const startTime = Date.now()
    
    // Adicionar ao histórico
    this.addToSearchHistory(query)
    
    // Correção ortográfica básica
    const correctedQuery = this.spellCheck(query)
    const searchQuery = correctedQuery !== query ? correctedQuery : query
    
    // Filtrar artigos
    let filteredArticles = this.applyFilters(articles, filters)
    
    // Busca inteligente
    if (searchQuery.trim()) {
      filteredArticles = this.performSearch(filteredArticles, searchQuery)
    }
    
    // Ordenar resultados
    filteredArticles = this.sortResults(filteredArticles, filters.sortBy || 'relevance', searchQuery)
    
    // Gerar sugestões
    const suggestions = this.generateSuggestions(query, articles)
    
    const searchTime = Date.now() - startTime
    
    return {
      articles: filteredArticles,
      totalCount: filteredArticles.length,
      suggestions,
      searchTime,
      correctedQuery: correctedQuery !== query ? correctedQuery : undefined
    }
  }

  private performSearch(articles: Article[], query: string): Article[] {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)
    
    return articles.map(article => {
      let score = 0
      const searchableText = `${article.title} ${article.excerpt} ${article.content} ${article.tags.join(' ')}`.toLowerCase()
      
      // Pontuação por relevância
      searchTerms.forEach(term => {
        // Título tem peso maior
        if (article.title.toLowerCase().includes(term)) score += 10
        // Excerpt tem peso médio
        if (article.excerpt.toLowerCase().includes(term)) score += 5
        // Tags têm peso alto
        if (article.tags.some(tag => tag.toLowerCase().includes(term))) score += 8
        // Conteúdo tem peso menor
        if (article.content.toLowerCase().includes(term)) score += 2
        
        // Bonus para correspondência exata
        if (searchableText.includes(query.toLowerCase())) score += 15
      })
      
      return { ...article, searchScore: score }
    })
    .filter(article => article.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore)
  }

  private applyFilters(articles: Article[], filters: Partial<SearchFilters>): Article[] {
    let filtered = [...articles]
    
    // Filtro por categoria
    if (filters.categories?.length) {
      filtered = filtered.filter(article => 
        filters.categories!.includes(article.category) || filters.categories!.includes('todos')
      )
    }
    
    // Filtro por tipo de conteúdo
    if (filters.contentTypes?.length) {
      filtered = filtered.filter(article => 
        filters.contentTypes!.some(type => 
          article.tags.includes(type.toLowerCase()) || 
          article.title.toLowerCase().includes(type.toLowerCase())
        )
      )
    }
    
    // Filtro por fonte
    if (filters.sources?.length) {
      filtered = filtered.filter(article => 
        filters.sources!.includes(article.source)
      )
    }
    
    // Filtro por tempo de leitura
    if (filters.readTime && filters.readTime !== 'all') {
      filtered = filtered.filter(article => {
        const readTime = parseInt(article.readTime)
        switch (filters.readTime) {
          case 'quick': return readTime <= 5
          case 'medium': return readTime > 5 && readTime <= 15
          case 'long': return readTime > 15
          default: return true
        }
      })
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
    
    return filtered
  }

  private sortResults(articles: Article[], sortBy: string, query?: string): Article[] {
    switch (sortBy) {
      case 'recent':
        return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      case 'popular':
        return articles.sort((a, b) => b.views - a.views)
      case 'recommended':
        return this.getPersonalizedResults(articles)
      case 'relevance':
      default:
        return query ? articles : articles.sort((a, b) => b.engagement - a.engagement)
    }
  }

  private generateSuggestions(query: string, articles: Article[]): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = []
    
    // Sugestões de categorias
    const categories = ['restaurantes', 'barbearias', 'petshops', 'igrejas', 'gestao']
    categories.forEach(cat => {
      const count = articles.filter(a => a.category === cat).length
      if (count > 0) {
        suggestions.push({ text: cat, type: 'category', count })
      }
    })
    
    // Sugestões de tags populares
    const allTags = articles.flatMap(a => a.tags)
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([tag, count]) => {
        suggestions.push({ text: tag, type: 'tag', count })
      })
    
    // Sugestões do histórico
    this.searchHistory.slice(-3).forEach(historyQuery => {
      if (historyQuery !== query) {
        suggestions.push({ text: historyQuery, type: 'query', count: 0 })
      }
    })
    
    return suggestions.slice(0, 8)
  }

  private spellCheck(query: string): string {
    const corrections: Record<string, string> = {
      'restaurante': 'restaurantes',
      'barbearia': 'barbearias',
      'petshop': 'petshops',
      'igreja': 'igrejas',
      'gestao': 'gestão',
      'automacao': 'automação',
      'whatsap': 'whatsapp',
      'ifood': 'iFood'
    }
    
    let corrected = query
    Object.entries(corrections).forEach(([wrong, right]) => {
      corrected = corrected.replace(new RegExp(wrong, 'gi'), right)
    })
    
    return corrected
  }

  private getPersonalizedResults(articles: Article[]): Article[] {
    // Personalização baseada no histórico do usuário
    const favoriteCategories = this.userPreferences.favoriteCategories
    
    return articles.sort((a, b) => {
      let scoreA = a.engagement
      let scoreB = b.engagement
      
      // Bonus para categorias favoritas
      if (favoriteCategories.includes(a.category)) scoreA += 20
      if (favoriteCategories.includes(b.category)) scoreB += 20
      
      // Bonus para artigos não lidos
      if (!this.userPreferences.readingHistory.includes(a.id)) scoreA += 10
      if (!this.userPreferences.readingHistory.includes(b.id)) scoreB += 10
      
      return scoreB - scoreA
    })
  }

  private addToSearchHistory(query: string): void {
    if (query.trim() && !this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query)
      this.searchHistory = this.searchHistory.slice(0, 10) // Manter apenas 10
      this.userPreferences.searchHistory = this.searchHistory
    }
  }

  // Métodos públicos para gerenciar preferências
  addToFavorites(articleId: string): void {
    if (!this.userPreferences.favorites.includes(articleId)) {
      this.userPreferences.favorites.push(articleId)
    }
  }

  removeFromFavorites(articleId: string): void {
    this.userPreferences.favorites = this.userPreferences.favorites.filter(id => id !== articleId)
  }

  addToReadingHistory(articleId: string): void {
    if (!this.userPreferences.readingHistory.includes(articleId)) {
      this.userPreferences.readingHistory.unshift(articleId)
      this.userPreferences.readingHistory = this.userPreferences.readingHistory.slice(0, 50)
    }
  }

  updatePreferences(preferences: Partial<UserPreferences>): void {
    this.userPreferences = { ...this.userPreferences, ...preferences }
  }

  getPreferences(): UserPreferences {
    return this.userPreferences
  }

  getSearchHistory(): string[] {
    return this.searchHistory
  }

  clearSearchHistory(): void {
    this.searchHistory = []
    this.userPreferences.searchHistory = []
  }
}

export const searchService = new SearchService()
export type { SearchFilters, SearchResult, SearchSuggestion, UserPreferences }