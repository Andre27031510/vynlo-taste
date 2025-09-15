'use client'

import React, { Suspense } from 'react'
import { useBlog } from '../../hooks/useBlog'
import ErrorBoundary from '../../components/ErrorBoundary'
import { logger } from '../../utils/logger'
import Header from './Header'
import Footer from './Footer'

// Lazy loading dos componentes de blog
const BlogHero = React.lazy(() => import('../../components/blog/BlogHero'))
const CategoriesFilters = React.lazy(() => import('../../components/blog/CategoriesFilters'))
const FeaturedArticles = React.lazy(() => import('../../components/blog/FeaturedArticles'))
const ArticlesList = React.lazy(() => import('../../components/blog/ArticlesList'))
const Newsletter = React.lazy(() => import('../../components/blog/Newsletter'))
const BlogCTA = React.lazy(() => import('../../components/blog/BlogCTA'))
const PremiumLibrary = React.lazy(() => import('../../components/blog/PremiumLibrary'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

const BlogPage: React.FC = () => {
  const {
    activeSection,
    scrollProgress,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    clearError
  } = useBlog()

  React.useEffect(() => {
    try {
      logger.componentMount('BlogPage')
    } catch (error) {
      logger.error('Erro ao montar BlogPage', error as Error)
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="blog-page">
        {/* Header */}
        <Header />

        {/* Hero - Fundo azul/preto com gradiente */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <BlogHero />
          </Suspense>
        </ErrorBoundary>

        {/* Categorias e Filtros - Fundo branco */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <CategoriesFilters 
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Artigos em Destaque - Fundo azul/preto com gradiente */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedArticles />
          </Suspense>
        </ErrorBoundary>

        {/* Lista de Artigos - Fundo branco */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <ArticlesList 
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Newsletter - Fundo azul/preto com gradiente */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Newsletter />
          </Suspense>
        </ErrorBoundary>

        {/* Premium Library - Biblioteca Completa */}
        <div id="premium-library">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <PremiumLibrary />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* CTA para contato - Fundo branco */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <BlogCTA />
          </Suspense>
        </ErrorBoundary>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default BlogPage