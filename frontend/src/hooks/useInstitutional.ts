import { useState, useEffect, useCallback, useRef } from 'react'
import { logger } from '../utils/logger'

export const useInstitutional = () => {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeTimeline, setActiveTimeline] = useState<number | null>(null)
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
        logger.userInteraction('card_hover', `card_${index}`)
      }
    } catch (error) {
      handleError(error as Error, 'handleCardHover')
    }
  }, [handleError])

  // Timeline hover handlers
  const handleTimelineHover = useCallback((index: number | null) => {
    try {
      setActiveTimeline(index)
      if (index !== null) {
        logger.userInteraction('timeline_hover', `timeline_${index}`)
      }
    } catch (error) {
      handleError(error as Error, 'handleTimelineHover')
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
      logger.componentMount('useInstitutional')
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
    activeTimeline,
    
    // Actions
    setIsLoading,
    clearError,
    handleCardHover,
    handleTimelineHover,
    scrollToSection,
    
    // Utilities
    updateScrollProgress,
    animateOnScroll
  }
}