import { useState, useEffect, useCallback, useRef } from 'react'
import { logger } from '../utils/logger'

export const useResources = () => {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeAPI, setActiveAPI] = useState<number | null>(null)
  const [activeMetric, setActiveMetric] = useState<number | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

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
                  logger.userInteraction('section_view', sectionId)
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
        logger.userInteraction('resource_card_hover', `card_${index}`)
      }
    } catch (error) {
      handleError(error as Error, 'handleCardHover')
    }
  }, [handleError])

  // API hover handlers
  const handleAPIHover = useCallback((index: number | null) => {
    try {
      setActiveAPI(index)
      if (index !== null) {
        logger.userInteraction('api_hover', `api_${index}`)
      }
    } catch (error) {
      handleError(error as Error, 'handleAPIHover')
    }
  }, [handleError])

  // Metric hover handlers
  const handleMetricHover = useCallback((index: number | null) => {
    try {
      setActiveMetric(index)
      if (index !== null) {
        logger.userInteraction('metric_hover', `metric_${index}`)
      }
    } catch (error) {
      handleError(error as Error, 'handleMetricHover')
    }
  }, [handleError])

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    try {
      if (typeof window !== 'undefined') {
        const element = document.querySelector(`[data-section="${sectionId}"]`)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
          logger.userInteraction('scroll_to_section', sectionId)
        }
      }
    } catch (error) {
      handleError(error as Error, 'scrollToSection')
    }
  }, [handleError])

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

  // Code syntax highlighting
  const highlightCode = useCallback((code: string, language: string) => {
    try {
      // Simple syntax highlighting for demo purposes
      return code
        .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
        .replace(/(\b\d+\b)/g, '<span class="text-blue-400">$1</span>')
        .replace(/(function|const|let|var|return|if|else|for|while)/g, '<span class="text-purple-400">$1</span>')
    } catch (error) {
      handleError(error as Error, 'highlightCode')
      return code
    }
  }, [handleError])

  // Performance metrics animation
  const animateMetrics = useCallback(() => {
    try {
      const metrics = document.querySelectorAll('[data-metric]')
      metrics.forEach((metric, index) => {
        setTimeout(() => {
          metric.classList.add('animate-bounce')
          setTimeout(() => {
            metric.classList.remove('animate-bounce')
          }, 1000)
        }, index * 200)
      })
    } catch (error) {
      handleError(error as Error, 'animateMetrics')
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

  // Component mount logging
  useEffect(() => {
    try {
      logger.componentMount('useResources')
    } catch (error) {
      handleError(error as Error, 'initialization')
    }
  }, [handleError])

  return {
    // State
    activeSection,
    scrollProgress,
    isLoading,
    error,
    hoveredCard,
    activeAPI,
    activeMetric,
    
    // Actions
    setIsLoading,
    clearError,
    handleCardHover,
    handleAPIHover,
    handleMetricHover,
    scrollToSection,
    
    // Utilities
    updateScrollProgress,
    animateOnScroll,
    highlightCode,
    animateMetrics
  }
}