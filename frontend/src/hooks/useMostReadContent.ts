import { useState, useEffect, useCallback, useMemo } from 'react'
import { analyticsService, RankingData } from '../services/analyticsService'

interface UseMostReadContentReturn {
  rankings: RankingData[]
  loading: boolean
  error: string | null
  selectedCategory: string
  sortBy: 'score' | 'views' | 'engagement'
  searchTerm: string
  filteredRankings: RankingData[]
  categoryOptions: Array<{ value: string; label: string; count: number }>
  overallStats: {
    totalArticles: number
    totalViews: number
    totalEngagement: number
    totalClicks: number
    avgEngagement: number
    topCategory: string
  }
  setSelectedCategory: (category: string) => void
  setSortBy: (sort: 'score' | 'views' | 'engagement') => void
  setSearchTerm: (term: string) => void
  handleArticleClick: (ranking: RankingData) => void
  refreshData: () => Promise<void>
}

export const useMostReadContent = (): UseMostReadContentReturn => {
  const [rankings, setRankings] = useState<RankingData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'score' | 'views' | 'engagement'>('score')
  const [searchTerm, setSearchTerm] = useState('')

  // Carregar dados iniciais
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Inicializar com artigos brasileiros se necessário
      analyticsService.initializeWithBrazilianArticles()
      
      // Carregar rankings
      const rankingData = analyticsService.calculateRanking(12)
      setRankings(rankingData)
      
      console.log('📊 MostReadContent: Dados carregados', {
        total: rankingData.length,
        categories: [...new Set(rankingData.map(r => r.article.category))].length
      })
      
    } catch (err) {
      console.error('Erro ao carregar dados do MostReadContent:', err)
      setError('Erro ao carregar conteúdo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Inicializar dados
  useEffect(() => {
    loadData()
  }, [loadData])

  // Opções de categoria com contadores
  const categoryOptions = useMemo(() => {
    const categories = rankings.reduce((acc, item) => {
      const cat = item.article.category
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const options = Object.entries(categories).map(([value, count]) => ({
      value,
      label: getCategoryLabel(value),
      count
    }))

    return [
      { value: 'all', label: 'Todas as Categorias', count: rankings.length },
      ...options.sort((a, b) => b.count - a.count)
    ]
  }, [rankings])

  // Rankings filtrados
  const filteredRankings = useMemo(() => {
    let filtered = [...rankings]

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.article.category === selectedCategory)
    }

    // Filtro por busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(item => 
        item.article.title.toLowerCase().includes(term) ||
        item.article.source.toLowerCase().includes(term) ||
        getCategoryLabel(item.article.category).toLowerCase().includes(term)
      )
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.article.views - a.article.views
        case 'engagement':
          return b.article.engagement - a.article.engagement
        case 'score':
        default:
          return b.score - a.score
      }
    })

    // Reajustar rankings após filtros
    return filtered.map((item, index) => ({
      ...item,
      rank: index + 1
    }))
  }, [rankings, selectedCategory, searchTerm, sortBy])

  // Estatísticas gerais
  const overallStats = useMemo(() => {
    return analyticsService.getOverallStats()
  }, [rankings])

  // Manipular clique em artigo
  const handleArticleClick = useCallback((ranking: RankingData) => {
    try {
      // Registrar clique no analytics
      analyticsService.trackClick(ranking.article.id)
      
      // Registrar visualização
      analyticsService.trackView(ranking.article.id, {
        title: ranking.article.title,
        category: ranking.article.category,
        url: ranking.article.url,
        source: ranking.article.source
      })
      
      console.log('🖱️ Clique registrado:', ranking.article.title)
      
      // Abrir link
      if (ranking.article.url.startsWith('http')) {
        window.open(ranking.article.url, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = ranking.article.url
      }
      
      // Atualizar dados após clique
      setTimeout(() => {
        loadData()
      }, 1000)
      
    } catch (err) {
      console.error('Erro ao processar clique:', err)
    }
  }, [loadData])

  // Função para atualizar dados
  const refreshData = useCallback(async () => {
    await loadData()
  }, [loadData])

  return {
    rankings,
    loading,
    error,
    selectedCategory,
    sortBy,
    searchTerm,
    filteredRankings,
    categoryOptions,
    overallStats,
    setSelectedCategory,
    setSortBy,
    setSearchTerm,
    handleArticleClick,
    refreshData
  }
}

// Função auxiliar para labels de categoria
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'restaurantes': '🍽️ Restaurantes',
    'barbearias': '✂️ Barbearias',
    'petshops': '🐕 Pet Shops',
    'igrejas': '⛪ Igrejas',
    'ia-bot': '🤖 IA & Bots',
    'educacao': '📚 Educação',
    'servicos': '🏢 Serviços',
    'saude': '🏥 Saúde'
  }
  return labels[category] || category
}