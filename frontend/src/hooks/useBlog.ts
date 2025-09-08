import { useState, useEffect, useCallback, useRef } from 'react'
import { logger } from '../utils/logger'

export interface BlogArticle {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
  featured: boolean
  tags: string[]
}

export const useBlog = () => {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null)
  const [articles, setArticles] = useState<BlogArticle[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Mock articles data - Conteúdo realista alinhado com Vynlo
  const mockArticles: BlogArticle[] = [
    {
      id: '1',
      title: 'Como o Vynlo Taste aumentou vendas em 150% no Restaurante Bella Vista',
      excerpt: 'Descubra como a implementação do sistema Vynlo transformou completamente a operação e triplicou o faturamento em apenas 6 meses.',
      content: 'Conteúdo completo do artigo...',
      category: 'restaurantes',
      author: 'Carlos Silva',
      date: '2024-01-15',
      readTime: '8 min',
      image: '/blog/restaurante-case.jpg',
      featured: true,
      tags: ['case', 'restaurante', 'vendas', 'delivery']
    },
    {
      id: '2',
      title: '5 Dicas Essenciais para Gestão de Barbearias em 2024',
      excerpt: 'Estratégias comprovadas para otimizar agendamentos, aumentar a retenção de clientes e maximizar a receita da sua barbearia.',
      content: 'Conteúdo completo do artigo...',
      category: 'barbearias',
      author: 'Marina Santos',
      date: '2024-01-12',
      readTime: '6 min',
      image: '/blog/barbearia-dicas.jpg',
      featured: true,
      tags: ['dicas', 'barbearia', 'gestão', 'agendamento']
    },
    {
      id: '3',
      title: 'Automação WhatsApp: Como Petshops Aumentam Vendas em 200%',
      excerpt: 'Aprenda a configurar automações inteligentes no WhatsApp para petshops e transforme atendimento em vendas recorrentes.',
      content: 'Conteúdo completo do artigo...',
      category: 'petshops',
      author: 'Roberto Lima',
      date: '2024-01-10',
      readTime: '7 min',
      image: '/blog/petshop-whatsapp.jpg',
      featured: false,
      tags: ['whatsapp', 'automação', 'petshop', 'vendas']
    },
    {
      id: '4',
      title: 'Gestão Financeira Digital para Igrejas: Transparência e Eficiência',
      excerpt: 'Como modernizar a gestão financeira da sua igreja com ferramentas digitais, mantendo transparência e conformidade.',
      content: 'Conteúdo completo do artigo...',
      category: 'igrejas',
      author: 'Pastor João Oliveira',
      date: '2024-01-08',
      readTime: '10 min',
      image: '/blog/igreja-financeiro.jpg',
      featured: false,
      tags: ['igreja', 'financeiro', 'transparência', 'gestão']
    },
    {
      id: '5',
      title: 'Por que Investir em Sistema de Gestão? ROI Comprovado',
      excerpt: 'Análise detalhada do retorno sobre investimento em sistemas de gestão para pequenos e médios negócios.',
      content: 'Conteúdo completo do artigo...',
      category: 'gestao',
      author: 'Ana Costa',
      date: '2024-01-05',
      readTime: '12 min',
      image: '/blog/roi-sistema.jpg',
      featured: true,
      tags: ['roi', 'investimento', 'sistema', 'gestão']
    },
    {
      id: '6',
      title: 'Case Real: Restaurante XYZ Economiza 30% com Vynlo Taste',
      excerpt: 'Estudo de caso completo mostrando como o Restaurante XYZ reduziu custos operacionais e aumentou a margem de lucro.',
      content: 'Conteúdo completo do artigo...',
      category: 'restaurantes',
      author: 'Equipe Vynlo',
      date: '2024-01-03',
      readTime: '9 min',
      image: '/blog/case-xyz.jpg',
      featured: false,
      tags: ['case', 'economia', 'restaurante', 'lucro']
    }
  ]

  // Error handler
  const handleError = useCallback((error: Error, context: string) => {
    logger.error(`Error in ${context}`, error)
    setError(`Erro em ${context}: ${error.message}`)
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Scroll progress tracking
  const updateScrollProgress = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const scrollTop = window.pageYOffset
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = (scrollTop / docHeight) * 100
        setScrollProgress(Math.min(100, Math.max(0, progress)))
      }
    } catch (error) {
      handleError(error as Error, 'updateScrollProgress')
    }
  }, [handleError])

  // Section tracking with Intersection Observer
  const setupSectionObserver = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const sections = document.querySelectorAll('[data-section]')
        
        if (observerRef.current) {
          observerRef.current.disconnect()
        }

        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('data-section')
                if (sectionId) {
                  setActiveSection(sectionId)
                  logger.userInteraction('blog_section_view', sectionId)
                }
              }
            })
          },
          {
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
          }
        )

        sections.forEach((section) => {
          if (observerRef.current) {
            observerRef.current.observe(section)
          }
        })
      }
    } catch (error) {
      handleError(error as Error, 'setupSectionObserver')
    }
  }, [handleError])

  // Article hover handlers
  const handleArticleHover = useCallback((index: number | null) => {
    try {
      setHoveredArticle(index)
      if (index !== null) {
        logger.userInteraction('blog_article_hover', `article_${index}`)
      }
    } catch (error) {
      handleError(error as Error, 'handleArticleHover')
    }
  }, [handleError])

  // Category selection
  const selectCategory = useCallback((category: string) => {
    try {
      setSelectedCategory(category)
      logger.userInteraction('blog_category_select', category)
    } catch (error) {
      handleError(error as Error, 'selectCategory')
    }
  }, [handleError])

  // Search functionality
  const updateSearchQuery = useCallback((query: string) => {
    try {
      setSearchQuery(query)
      logger.userInteraction('blog_search', query)
    } catch (error) {
      handleError(error as Error, 'updateSearchQuery')
    }
  }, [handleError])

  // Filter articles based on category and search
  const getFilteredArticles = useCallback(() => {
    try {
      let filtered = articles

      if (selectedCategory !== 'todos') {
        filtered = filtered.filter(article => article.category === selectedCategory)
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }

      return filtered
    } catch (error) {
      handleError(error as Error, 'getFilteredArticles')
      return []
    }
  }, [articles, selectedCategory, searchQuery, handleError])

  // Get featured articles
  const getFeaturedArticles = useCallback(() => {
    try {
      return articles.filter(article => article.featured).slice(0, 3)
    } catch (error) {
      handleError(error as Error, 'getFeaturedArticles')
      return []
    }
  }, [articles, handleError])

  // Animation on scroll
  const animateOnScroll = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const elements = document.querySelectorAll('[data-animate]')
        
        elements.forEach((element) => {
          const rect = element.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0
          
          if (isVisible) {
            element.classList.add('animate-in')
          }
        })
      }
    } catch (error) {
      handleError(error as Error, 'animateOnScroll')
    }
  }, [handleError])

  // Setup scroll listeners
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const handleScroll = () => {
          updateScrollProgress()
          animateOnScroll()
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        setupSectionObserver()

        // Initial calls
        handleScroll()
        
        return () => {
          window.removeEventListener('scroll', handleScroll)
          if (observerRef.current) {
            observerRef.current.disconnect()
          }
        }
      }
    } catch (error) {
      handleError(error as Error, 'scroll_setup')
    }
  }, [updateScrollProgress, animateOnScroll, setupSectionObserver, handleError])

  // Initialize articles
  useEffect(() => {
    try {
      setArticles(mockArticles)
      logger.componentMount('useBlog')
    } catch (error) {
      handleError(error as Error, 'initialization')
    }
  }, [handleError])

  return {
    // State
    activeSection,
    scrollProgress,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    hoveredArticle,
    articles,
    
    // Actions
    setIsLoading,
    clearError,
    handleArticleHover,
    selectCategory,
    updateSearchQuery,
    
    // Computed
    filteredArticles: getFilteredArticles(),
    featuredArticles: getFeaturedArticles(),
    
    // Utilities
    updateScrollProgress,
    animateOnScroll
  }
}