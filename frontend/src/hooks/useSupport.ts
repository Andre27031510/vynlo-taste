import { useState, useEffect, useCallback, useRef } from 'react'
import { logger } from '../utils/logger'

export interface SupportArticle {
  id: string
  title: string
  content: string
  category: string
  difficulty: 'Básico' | 'Intermediário' | 'Avançado'
  readTime: string
  lastUpdated: string
  helpful: number
  views: number
}

export interface SystemService {
  name: string
  status: 'Operacional' | 'Degradado' | 'Indisponível'
  uptime: string
  lastIncident?: string
}

export const useSupport = () => {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [articles, setArticles] = useState<SupportArticle[]>([])
  const [systemServices, setSystemServices] = useState<SystemService[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Mock support articles
  const mockArticles: SupportArticle[] = [
    {
      id: '1',
      title: 'Como configurar seu primeiro restaurante no Vynlo Taste',
      content: 'Guia completo para configuração inicial...',
      category: 'primeiros-passos',
      difficulty: 'Básico',
      readTime: '5 min',
      lastUpdated: '2024-01-15',
      helpful: 245,
      views: 1250
    },
    {
      id: '2',
      title: 'Integração com WhatsApp Business API',
      content: 'Como conectar sua conta do WhatsApp...',
      category: 'integracoes',
      difficulty: 'Intermediário',
      readTime: '8 min',
      lastUpdated: '2024-01-12',
      helpful: 189,
      views: 890
    },
    {
      id: '3',
      title: 'Configuração de backup automático',
      content: 'Proteja seus dados com backup automático...',
      category: 'backup-seguranca',
      difficulty: 'Avançado',
      readTime: '12 min',
      lastUpdated: '2024-01-10',
      helpful: 156,
      views: 567
    },
    {
      id: '4',
      title: 'Otimização de performance do sistema',
      content: 'Dicas para melhorar a velocidade...',
      category: 'performance',
      difficulty: 'Avançado',
      readTime: '15 min',
      lastUpdated: '2024-01-08',
      helpful: 134,
      views: 445
    },
    {
      id: '5',
      title: 'Resolução de problemas de conexão',
      content: 'Soluções para problemas comuns...',
      category: 'problemas-tecnicos',
      difficulty: 'Intermediário',
      readTime: '10 min',
      lastUpdated: '2024-01-05',
      helpful: 298,
      views: 1567
    }
  ]

  // Mock system services
  const mockServices: SystemService[] = [
    {
      name: 'API Principal',
      status: 'Operacional',
      uptime: '99.98%'
    },
    {
      name: 'Banco de Dados',
      status: 'Operacional',
      uptime: '99.95%'
    },
    {
      name: 'WhatsApp Integration',
      status: 'Operacional',
      uptime: '99.92%'
    },
    {
      name: 'Sistema de Pagamentos',
      status: 'Operacional',
      uptime: '99.99%'
    },
    {
      name: 'CDN Global',
      status: 'Operacional',
      uptime: '99.97%'
    },
    {
      name: 'Backup Services',
      status: 'Operacional',
      uptime: '100%'
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
                  logger.userInteraction('support_section_view', sectionId)
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

  // Card hover handlers
  const handleCardHover = useCallback((index: number | null) => {
    try {
      setHoveredCard(index)
      if (index !== null) {
        logger.userInteraction('support_card_hover', `card_${index}`)
      }
    } catch (error) {
      handleError(error as Error, 'handleCardHover')
    }
  }, [handleError])

  // Category selection
  const selectCategory = useCallback((category: string) => {
    try {
      setSelectedCategory(category)
      logger.userInteraction('support_category_select', category)
    } catch (error) {
      handleError(error as Error, 'selectCategory')
    }
  }, [handleError])

  // Search functionality
  const updateSearchQuery = useCallback((query: string) => {
    try {
      setSearchQuery(query)
      logger.userInteraction('support_search', query)
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
          article.content.toLowerCase().includes(query)
        )
      }

      return filtered
    } catch (error) {
      handleError(error as Error, 'getFilteredArticles')
      return []
    }
  }, [articles, selectedCategory, searchQuery, handleError])

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

  // Initialize data
  useEffect(() => {
    try {
      setArticles(mockArticles)
      setSystemServices(mockServices)
      logger.componentMount('useSupport')
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
    hoveredCard,
    articles,
    systemServices,
    
    // Actions
    setIsLoading,
    clearError,
    handleCardHover,
    selectCategory,
    updateSearchQuery,
    
    // Computed
    filteredArticles: getFilteredArticles(),
    
    // Utilities
    updateScrollProgress,
    animateOnScroll
  }
}