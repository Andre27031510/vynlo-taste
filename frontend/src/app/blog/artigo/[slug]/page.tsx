'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { ArrowLeft, ExternalLink, Clock, User, Calendar, Tag, Eye, Heart, Share2 } from 'lucide-react'
import { articleService } from '../../../../services/articleService'
import { Article } from '../../../../services/contentService'
import Header from '../../../landingpages/Header'
import Footer from '../../../landingpages/Footer'

export default function ArtigoPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])

  useEffect(() => {
    loadArticle()
  }, [params.slug])

  const loadArticle = async () => {
    try {
      setLoading(true)
      
      // Se veio de uma categoria específica, buscar artigos dessa categoria
      const categoria = searchParams.get('categoria')
      if (categoria) {
        const result = await articleService.searchArticlesByCategory(categoria)
        if (result.articles.length > 0) {
          setArticle(result.articles[0])
          setRelatedArticles(result.articles.slice(1, 4))
        } else {
          setError('Nenhum artigo encontrado para esta categoria')
        }
      } else {
        // Buscar artigo por slug (implementação futura)
        setError('Artigo não encontrado')
      }
    } catch (err) {
      console.error('Erro ao carregar artigo:', err)
      setError('Erro ao carregar artigo')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  const handleExternalLink = () => {
    if (article?.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
            <p className="text-gray-600 mb-8">{error || 'O artigo solicitado não foi encontrado.'}</p>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Blog
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Article Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </button>

          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {article.category}
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {article.source}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {article.excerpt}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{article.views.toLocaleString()} visualizações</span>
                </div>
              </div>
            </div>

            {article.url && (
              <button
                onClick={handleExternalLink}
                className="ml-6 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ver Artigo Original
              </button>
            )}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400" />
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>

          {/* Article Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>Curtir</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Compartilhar</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                Taxa de engajamento: {article.engagement}%
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Artigos Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.location.href = `/blog/artigo/${relatedArticle.id}?categoria=${relatedArticle.category}`}
                >
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {relatedArticle.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {relatedArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{relatedArticle.readTime}</span>
                    <span>{relatedArticle.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
