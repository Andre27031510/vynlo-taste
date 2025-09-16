// Serviço de Analytics para Conteúdo Mais Lido
interface ArticleMetrics {
  id: string
  views: number
  engagement: number
  readTime: number
  clicks: number
  shares: number
  lastViewed: string
  category: string
  title: string
  url: string
  source: string
}

interface RankingData {
  rank: number
  article: ArticleMetrics
  score: number
  trend: 'up' | 'down' | 'stable'
  changePercent: number
}

class AnalyticsService {
  private storageKey = 'vynlo_article_metrics'
  private sessionKey = 'vynlo_session_data'

  // Obter métricas de um artigo
  getArticleMetrics(articleId: string): ArticleMetrics | null {
    const metrics = this.getAllMetrics()
    return metrics[articleId] || null
  }

  // Registrar visualização de artigo
  trackView(articleId: string, articleData: Partial<ArticleMetrics>) {
    const metrics = this.getAllMetrics()
    const existing = metrics[articleId] || {
      id: articleId,
      views: 0,
      engagement: 0,
      readTime: 0,
      clicks: 0,
      shares: 0,
      lastViewed: new Date().toISOString(),
      category: articleData.category || '',
      title: articleData.title || '',
      url: articleData.url || '',
      source: articleData.source || ''
    }

    existing.views += 1
    existing.lastViewed = new Date().toISOString()
    
    // Atualizar dados se fornecidos
    Object.assign(existing, articleData)
    
    metrics[articleId] = existing
    this.saveMetrics(metrics)
    
    console.log(`📊 View registrada: ${existing.title} (${existing.views} views)`)
  }

  // Registrar clique em artigo
  trackClick(articleId: string) {
    const metrics = this.getAllMetrics()
    if (metrics[articleId]) {
      metrics[articleId].clicks += 1
      metrics[articleId].engagement += 2 // Clique vale 2 pontos
      this.saveMetrics(metrics)
      console.log(`🖱️ Clique registrado: ${metrics[articleId].title}`)
    }
  }

  // Registrar tempo de leitura
  trackReadTime(articleId: string, timeSpent: number) {
    const metrics = this.getAllMetrics()
    if (metrics[articleId]) {
      metrics[articleId].readTime += timeSpent
      metrics[articleId].engagement += Math.floor(timeSpent / 10) // 1 ponto a cada 10s
      this.saveMetrics(metrics)
    }
  }

  // Calcular ranking inteligente
  calculateRanking(limit: number = 10): RankingData[] {
    const metrics = this.getAllMetrics()
    const articles = Object.values(metrics)
    
    // Algoritmo de ranking inteligente
    const rankedArticles = articles
      .map(article => ({
        article,
        score: this.calculateScore(article),
        rank: 0,
        trend: this.calculateTrend(article),
        changePercent: this.calculateChangePercent(article)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }))

    console.log(`🏆 Ranking calculado: ${rankedArticles.length} artigos`)
    return rankedArticles
  }

  // Algoritmo de score inteligente
  private calculateScore(article: ArticleMetrics): number {
    const now = Date.now()
    const lastViewed = new Date(article.lastViewed).getTime()
    const daysSinceViewed = (now - lastViewed) / (1000 * 60 * 60 * 24)
    
    // Fatores do score
    const viewsScore = article.views * 10
    const engagementScore = article.engagement * 5
    const clicksScore = article.clicks * 15
    const recencyBonus = Math.max(0, 100 - daysSinceViewed * 10)
    const readTimeScore = Math.min(article.readTime / 60, 20) // Max 20 pontos
    
    return viewsScore + engagementScore + clicksScore + recencyBonus + readTimeScore
  }

  // Calcular tendência
  private calculateTrend(article: ArticleMetrics): 'up' | 'down' | 'stable' {
    const historical = this.getHistoricalData(article.id)
    if (!historical || historical.length < 2) return 'stable'
    
    const recent = historical.slice(-3).reduce((sum, h) => sum + h.views, 0)
    const previous = historical.slice(-6, -3).reduce((sum, h) => sum + h.views, 0)
    
    if (recent > previous * 1.1) return 'up'
    if (recent < previous * 0.9) return 'down'
    return 'stable'
  }

  // Calcular percentual de mudança
  private calculateChangePercent(article: ArticleMetrics): number {
    const historical = this.getHistoricalData(article.id)
    if (!historical || historical.length < 2) return 0
    
    const current = historical[historical.length - 1]?.views || 0
    const previous = historical[historical.length - 2]?.views || 0
    
    if (previous === 0) return 0
    return Math.round(((current - previous) / previous) * 100)
  }

  // Obter artigos mais lidos por categoria
  getTopByCategory(category: string, limit: number = 5): RankingData[] {
    const allRanking = this.calculateRanking(50)
    return allRanking
      .filter(item => item.article.category === category)
      .slice(0, limit)
  }

  // Obter estatísticas gerais
  getOverallStats() {
    const metrics = this.getAllMetrics()
    const articles = Object.values(metrics)
    
    const totalViews = articles.reduce((sum, a) => sum + a.views, 0)
    const totalEngagement = articles.reduce((sum, a) => sum + a.engagement, 0)
    const totalClicks = articles.reduce((sum, a) => sum + a.clicks, 0)
    const avgEngagement = articles.length > 0 ? totalEngagement / articles.length : 0
    
    return {
      totalArticles: articles.length,
      totalViews,
      totalEngagement,
      totalClicks,
      avgEngagement: Math.round(avgEngagement),
      topCategory: this.getTopCategory(articles)
    }
  }

  // Inicializar métricas com dados dos artigos brasileiros
  initializeWithBrazilianArticles() {
    const existingMetrics = this.getAllMetrics()
    
    // Dados base dos artigos brasileiros reais
    const brazilianArticles = [
      {
        id: 'rest_1',
        title: 'O GUIA DEFINITIVO PARA UM RESTAURANTE DE SUCESSO',
        category: 'restaurantes',
        url: 'https://static1.squarespace.com/static/6273f2683f9dba7b3670dc36/t/6278712ac288c6019eed48d0/1652060465999/O-Guia-Definitivo-Para-Um-Restaurante-De-SucessoCompressed.pdf',
        source: 'Vynlo',
        baseViews: 8750,
        baseEngagement: 98
      },
      {
        id: 'barber_1',
        title: 'Estratégias de Marketing para Barbearia: 5 Ideias para Começar',
        category: 'barbearias',
        url: 'https://www.belasis.com.br/estrategias-de-marketing-para-barbearia-5-ideias-para-comecar/',
        source: 'Belasis',
        baseViews: 3240,
        baseEngagement: 95
      },
      {
        id: 'pet_1',
        title: 'Dicas e Ideias para seu Negócio de Pet Shop Competir com Grandes Marcas',
        category: 'petshops',
        url: 'https://uolhost.uol.com.br/blog/pet-shop-dicas/',
        source: 'UOL Host',
        baseViews: 3450,
        baseEngagement: 94
      },
      {
        id: 'ia_1',
        title: 'Os Melhores Chatbots AI: Estratégia de Marketing e Conformidade',
        category: 'ia-bot',
        url: 'https://www.iubenda.com/pt-br/help/121116-os-melhores-chatbots-ai-estrategia-de-marketing-e-conformidade',
        source: 'Iubenda',
        baseViews: 4250,
        baseEngagement: 96
      },
      {
        id: 'church_1',
        title: 'Estratégias de Marketing para Atrair Visitantes para a Igreja',
        category: 'igrejas',
        url: 'https://marketingdoreino.com/estrategias-de-marketing-para-atrair-visitantes-para-a-igreja/',
        source: 'Marketing do Reino',
        baseViews: 2340,
        baseEngagement: 94
      }
    ]

    let updated = false
    brazilianArticles.forEach(article => {
      if (!existingMetrics[article.id]) {
        existingMetrics[article.id] = {
          id: article.id,
          title: article.title,
          category: article.category,
          url: article.url,
          source: article.source,
          views: article.baseViews + Math.floor(Math.random() * 500),
          engagement: article.baseEngagement + Math.floor(Math.random() * 10),
          readTime: Math.floor(Math.random() * 1200) + 300, // 5-25 min
          clicks: Math.floor(Math.random() * 200) + 50,
          shares: Math.floor(Math.random() * 50) + 10,
          lastViewed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }
        updated = true
      }
    })

    if (updated) {
      this.saveMetrics(existingMetrics)
      console.log('📊 Métricas inicializadas com artigos brasileiros')
    }
  }

  // Métodos auxiliares privados
  private getAllMetrics(): Record<string, ArticleMetrics> {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  private saveMetrics(metrics: Record<string, ArticleMetrics>) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(metrics))
    } catch (error) {
      console.error('Erro ao salvar métricas:', error)
    }
  }

  private getHistoricalData(articleId: string): Array<{views: number, date: string}> {
    // Simular dados históricos para demonstração
    const days = 7
    const baseViews = this.getArticleMetrics(articleId)?.views || 0
    
    return Array.from({length: days}, (_, i) => ({
      views: Math.max(0, baseViews - Math.floor(Math.random() * 100) * (days - i)),
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    })).reverse()
  }

  private getTopCategory(articles: ArticleMetrics[]): string {
    const categoryCount = articles.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + article.views
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'restaurantes'
  }
}

export const analyticsService = new AnalyticsService()
export type { ArticleMetrics, RankingData }