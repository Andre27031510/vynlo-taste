// Serviço de busca inteligente para biblioteca
import { LibraryArticle } from './libraryService'

export interface SearchResult {
  article: LibraryArticle
  score: number
  matchedFields: string[]
  highlights: string[]
}

export interface IntelligentSearchOptions {
  fuzzyMatch?: boolean
  boostRecent?: boolean
  categoryWeight?: number
  titleWeight?: number
  contentWeight?: number
}

class SearchService {
  // Busca inteligente com scoring avançado
  async intelligentSearch(
    query: string,
    articles: LibraryArticle[],
    options: IntelligentSearchOptions = {}
  ): Promise<SearchResult[]> {
    const {
      fuzzyMatch = true,
      boostRecent = true,
      categoryWeight = 1.5,
      titleWeight = 3.0,
      contentWeight = 1.0
    } = options

    if (!query.trim()) {
      return articles.map(article => ({
        article,
        score: article.relevanceScore || 0,
        matchedFields: [],
        highlights: []
      }))
    }

    const searchTerms = this.preprocessQuery(query)
    const results: SearchResult[] = []

    for (const article of articles) {
      const searchResult = this.scoreArticle(article, searchTerms, {
        fuzzyMatch,
        boostRecent,
        categoryWeight,
        titleWeight,
        contentWeight
      })

      if (searchResult.score > 0) {
        results.push(searchResult)
      }
    }

    // Ordenar por score decrescente
    return results.sort((a, b) => b.score - a.score)
  }

  // Preprocessar query de busca
  private preprocessQuery(query: string): string[] {
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2)
      .map(term => term.trim())
  }

  // Calcular score de um artigo
  private scoreArticle(
    article: LibraryArticle,
    searchTerms: string[],
    options: Required<IntelligentSearchOptions>
  ): SearchResult {
    let totalScore = 0
    const matchedFields: string[] = []
    const highlights: string[] = []

    const titleLower = article.title.toLowerCase()
    const excerptLower = article.excerpt.toLowerCase()
    const contentLower = article.content.toLowerCase()
    const categoryLower = article.category.toLowerCase()
    const authorLower = article.author.toLowerCase()
    const tagsLower = article.tags.map(tag => tag.toLowerCase())

    for (const term of searchTerms) {
      let termScore = 0

      // Busca no título (peso maior)
      if (titleLower.includes(term)) {
        termScore += options.titleWeight
        matchedFields.push('title')
        highlights.push(this.extractHighlight(article.title, term))
      }

      // Busca no excerpt
      if (excerptLower.includes(term)) {
        termScore += 2.0
        matchedFields.push('excerpt')
        highlights.push(this.extractHighlight(article.excerpt, term))
      }

      // Busca no conteúdo
      if (contentLower.includes(term)) {
        termScore += options.contentWeight
        matchedFields.push('content')
      }

      // Busca na categoria
      if (categoryLower.includes(term)) {
        termScore += options.categoryWeight
        matchedFields.push('category')
      }

      // Busca no autor
      if (authorLower.includes(term)) {
        termScore += 1.5
        matchedFields.push('author')
      }

      // Busca nas tags
      for (const tag of tagsLower) {
        if (tag.includes(term)) {
          termScore += 2.0
          matchedFields.push('tags')
          break
        }
      }

      // Busca fuzzy (aproximada)
      if (options.fuzzyMatch && termScore === 0) {
        const fuzzyScore = this.calculateFuzzyScore(term, [
          titleLower,
          excerptLower,
          categoryLower,
          authorLower,
          ...tagsLower
        ])
        termScore += fuzzyScore
      }

      totalScore += termScore
    }

    // Boost para artigos recentes
    if (options.boostRecent) {
      const daysSincePublished = (Date.now() - new Date(article.date).getTime()) / (1000 * 60 * 60 * 24)
      const recencyBoost = Math.max(0, 1 - daysSincePublished / 365) * 0.5
      totalScore += recencyBoost
    }

    // Boost baseado em engagement e views
    const popularityBoost = (article.engagement / 100) * 0.3 + Math.min(article.views / 10000, 1) * 0.2
    totalScore += popularityBoost

    return {
      article,
      score: Math.round(totalScore * 100) / 100,
      matchedFields: [...new Set(matchedFields)],
      highlights: highlights.slice(0, 3)
    }
  }

  // Calcular score de busca fuzzy
  private calculateFuzzyScore(term: string, texts: string[]): number {
    let maxScore = 0

    for (const text of texts) {
      const words = text.split(/\s+/)
      for (const word of words) {
        const similarity = this.calculateSimilarity(term, word)
        if (similarity > 0.7) {
          maxScore = Math.max(maxScore, similarity * 0.5)
        }
      }
    }

    return maxScore
  }

  // Calcular similaridade entre duas strings
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  // Calcular distância de Levenshtein
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  // Extrair highlight do texto
  private extractHighlight(text: string, term: string, contextLength: number = 50): string {
    const lowerText = text.toLowerCase()
    const lowerTerm = term.toLowerCase()
    const index = lowerText.indexOf(lowerTerm)

    if (index === -1) return ''

    const start = Math.max(0, index - contextLength)
    const end = Math.min(text.length, index + term.length + contextLength)
    
    let highlight = text.substring(start, end)
    
    if (start > 0) highlight = '...' + highlight
    if (end < text.length) highlight = highlight + '...'

    // Destacar o termo encontrado
    const regex = new RegExp(`(${term})`, 'gi')
    highlight = highlight.replace(regex, '<mark>$1</mark>')

    return highlight
  }

  // Gerar sugestões de busca
  async generateSuggestions(query: string, articles: LibraryArticle[]): Promise<string[]> {
    if (!query.trim()) return []

    const suggestions = new Set<string>()
    const queryLower = query.toLowerCase()

    // Sugestões baseadas em títulos
    articles.forEach(article => {
      const words = article.title.toLowerCase().split(/\s+/)
      words.forEach(word => {
        if (word.length > 3 && word.startsWith(queryLower)) {
          suggestions.add(word)
        }
      })
    })

    // Sugestões baseadas em tags
    articles.forEach(article => {
      article.tags.forEach(tag => {
        if (tag.toLowerCase().startsWith(queryLower)) {
          suggestions.add(tag)
        }
      })
    })

    // Sugestões baseadas em categorias
    const categories = [...new Set(articles.map(a => a.category))]
    categories.forEach(category => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.add(category)
      }
    })

    return Array.from(suggestions).slice(0, 5)
  }

  // Busca por categoria
  searchByCategory(articles: LibraryArticle[], category: string): LibraryArticle[] {
    return articles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Busca por autor
  searchByAuthor(articles: LibraryArticle[], author: string): LibraryArticle[] {
    return articles.filter(article => 
      article.author.toLowerCase().includes(author.toLowerCase())
    )
  }

  // Busca por tags
  searchByTags(articles: LibraryArticle[], tags: string[]): LibraryArticle[] {
    return articles.filter(article => 
      tags.some(tag => 
        article.tags.some(articleTag => 
          articleTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    )
  }

  // Busca por data
  searchByDateRange(articles: LibraryArticle[], startDate: Date, endDate: Date): LibraryArticle[] {
    return articles.filter(article => {
      const articleDate = new Date(article.date)
      return articleDate >= startDate && articleDate <= endDate
    })
  }

  // Busca por tempo de leitura
  searchByReadTime(articles: LibraryArticle[], minMinutes: number, maxMinutes: number): LibraryArticle[] {
    return articles.filter(article => {
      const readTimeMinutes = parseInt(article.readTime.replace(/\D/g, ''))
      return readTimeMinutes >= minMinutes && readTimeMinutes <= maxMinutes
    })
  }
}

export const searchService = new SearchService()
export type { SearchService }