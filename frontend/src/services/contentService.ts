interface Article {
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
  url?: string
}

interface CategoryMetrics {
  id: string
  name: string
  count: number
  growth: number
  engagement: number
  lastUpdated: string
}

class ContentService {
  private cache = new Map<string, any>()
  private cacheExpiry = new Map<string, number>()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutos

  // Simular coleta de dados reais (em produção seria conectado a APIs reais)
  async fetchDynamicContent(): Promise<Article[]> {
    const cacheKey = 'dynamic_content'
    
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    // Simular dados dinâmicos baseados em fontes reais
    const articles: Article[] = [
      {
        id: '1',
        title: 'Como Automatizar Pedidos no iFood: Guia Completo 2024',
        excerpt: 'Estratégias comprovadas para aumentar vendas em 300% usando automação inteligente no iFood e Rappi',
        content: 'Conteúdo completo do artigo...',
        category: 'restaurantes',
        author: 'Equipe Vynlo',
        date: new Date().toISOString().split('T')[0],
        readTime: '12 min',
        tags: ['ifood', 'automação', 'delivery', 'vendas'],
        views: 2847,
        engagement: 94,
        source: 'Vynlo Research',
        image: '/blog/ifood-automation.jpg'
      },
      {
        id: '2',
        title: 'WhatsApp Business API: Revolucione seu Petshop',
        excerpt: 'Case real: Petshop aumentou faturamento em 250% com automação WhatsApp personalizada',
        content: 'Conteúdo completo do artigo...',
        category: 'petshops',
        author: 'Dr. Carlos Veterinário',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        readTime: '8 min',
        tags: ['whatsapp', 'automação', 'petshop', 'fidelização'],
        views: 1923,
        engagement: 87,
        source: 'Case Study',
        image: '/blog/whatsapp-petshop.jpg'
      },
      {
        id: '3',
        title: 'Gestão Financeira Transparente para Igrejas',
        excerpt: 'Sistema completo de controle financeiro com relatórios automáticos e transparência total',
        content: 'Conteúdo completo do artigo...',
        category: 'igrejas',
        author: 'Pastor João Silva',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        readTime: '15 min',
        tags: ['igreja', 'financeiro', 'transparência', 'gestão'],
        views: 1456,
        engagement: 91,
        source: 'Especialista',
        image: '/blog/igreja-financeiro.jpg'
      },
      {
        id: '4',
        title: 'Agendamento Inteligente: Barbearia do Futuro',
        excerpt: 'Como reduzir no-shows em 80% e aumentar receita com sistema de agendamento inteligente',
        content: 'Conteúdo completo do artigo...',
        category: 'barbearias',
        author: 'Mestre Barbeiro',
        date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
        readTime: '10 min',
        tags: ['agendamento', 'barbearia', 'no-show', 'receita'],
        views: 2156,
        engagement: 89,
        source: 'Industry Expert',
        image: '/blog/barbearia-agendamento.jpg'
      },

    ]

    this.setCache(cacheKey, articles)
    return articles
  }

  async getCategoryMetrics(): Promise<CategoryMetrics[]> {
    const cacheKey = 'category_metrics'
    
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const articles = await this.fetchDynamicContent()
    
    const metrics: CategoryMetrics[] = [
      {
        id: 'todos',
        name: 'Biblioteca Completa',
        count: articles.length + 122, // Total simulado
        growth: 23,
        engagement: 92,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'restaurantes',
        name: 'Restaurantes',
        count: articles.filter(a => a.category === 'restaurantes').length + 38,
        growth: 31,
        engagement: 94,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'barbearias',
        name: 'Barbearias',
        count: articles.filter(a => a.category === 'barbearias').length + 25,
        growth: 18,
        engagement: 89,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'petshops',
        name: 'Petshops',
        count: articles.filter(a => a.category === 'petshops').length + 16,
        growth: 27,
        engagement: 87,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'igrejas',
        name: 'Igrejas',
        count: articles.filter(a => a.category === 'igrejas').length + 12,
        growth: 15,
        engagement: 91,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ia-bot',
        name: 'IA Bot',
        count: articles.filter(a => a.category === 'ia-bot').length + 18,
        growth: 45,
        engagement: 97,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'educacao',
        name: 'Educação',
        count: articles.filter(a => a.category === 'educacao').length + 25,
        growth: 22,
        engagement: 88,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'servicos',
        name: 'Serviços',
        count: articles.filter(a => a.category === 'servicos').length + 32,
        growth: 28,
        engagement: 90,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'saude',
        name: 'Saúde',
        count: articles.filter(a => a.category === 'saude').length + 21,
        growth: 33,
        engagement: 95,
        lastUpdated: new Date().toISOString()
      }
    ]

    this.setCache(cacheKey, metrics)
    return metrics
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    const articles = await this.fetchDynamicContent()
    return category === 'todos' 
      ? articles 
      : articles.filter(article => article.category === category)
  }

  async searchArticles(query: string): Promise<Article[]> {
    const articles = await this.fetchDynamicContent()
    const searchTerm = query.toLowerCase()
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const articles = await this.fetchDynamicContent()
    return articles
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3)
  }

  // Simular métricas em tempo real
  async getRealTimeMetrics() {
    return {
      totalViews: Math.floor(Math.random() * 1000 + 15000),
      activeReaders: Math.floor(Math.random() * 50 + 120),
      avgReadTime: (Math.random() * 2 + 4).toFixed(1),
      engagementRate: (Math.random() * 10 + 85).toFixed(1),
      lastUpdate: new Date().toISOString()
    }
  }

  private isValidCache(key: string): boolean {
    const expiry = this.cacheExpiry.get(key)
    return expiry ? Date.now() < expiry : false
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, data)
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION)
  }

  // Simular atualização automática (em produção seria um cron job)
  startAutoUpdate(): void {
    setInterval(async () => {
      this.cache.clear()
      this.cacheExpiry.clear()
      await this.fetchDynamicContent()
      console.log('Content updated automatically')
    }, this.CACHE_DURATION)
  }
}

export const contentService = new ContentService()
export type { Article, CategoryMetrics }