'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Header from '../../../landingpages/Header'
import Footer from '../../../landingpages/Footer'
import CategoryBanner from '../../../../components/blog/CategoryBanner'
import { Calendar, Clock, User, ExternalLink, ArrowRight, Globe, TrendingUp } from 'lucide-react'

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
  url: string
}

interface LibraryData {
  articles: Article[]
  category: string
  source: string
  totalCount: number
  searchTime: number
}

export default function ArtigoPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [libraryData, setLibraryData] = useState<LibraryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const slug = params.slug as string
  const data = searchParams.get('data')

  useEffect(() => {
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data))
        setLibraryData(parsedData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        loadFallbackData()
      }
    } else {
      loadFallbackData()
    }
    setIsLoading(false)
  }, [data, slug])

  const loadFallbackData = () => {
    const categoria = slug.includes('-biblioteca') ? slug.replace('-biblioteca', '') : slug.split('-')[0] || 'gestao'
    const fallbackArticles: Article[] = [
      {
        id: 'fallback_1',
        title: `Guia Completo de ${getCategoryName(categoria)} no Brasil`,
        excerpt: `Estratégias e dicas essenciais para ${categoria} brasileiros que querem crescer no mercado nacional.`,
        content: `Conteúdo especializado sobre ${categoria} no contexto brasileiro...`,
        category: categoria,
        author: 'Equipe Vynlo Brasil',
        date: new Date().toISOString().split('T')[0],
        readTime: '8 min',
        tags: [categoria, 'brasil', 'gestão', 'crescimento'],
        views: 1500,
        engagement: 92,
        source: 'Vynlo Knowledge Base',
        url: '#'
      }
    ]

    setLibraryData({
      articles: fallbackArticles,
      category: categoria,
      source: 'Biblioteca Vynlo',
      totalCount: fallbackArticles.length,
      searchTime: 0
    })
  }

  const getCategoryName = (cat: string) => {
    const names: { [key: string]: string } = {
      'restaurantes': 'Restaurantes',
      'barbearias': 'Barbearias',
      'petshops': 'Petshops',
      'igrejas': 'Igrejas',
      'gestao': 'Gestão Empresarial'
    }
    return names[cat] || 'Negócios'
  }

  const handleArticleClick = (article: Article) => {
    if (article.url && article.url !== '#' && article.url.startsWith('http')) {
      window.open(article.url, '_blank', 'noopener,noreferrer')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-manrope">Carregando biblioteca brasileira...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryBanner
        category={libraryData?.category || 'gestao'}
        title={`Biblioteca ${getCategoryName(libraryData?.category || 'gestao')}`}
        source={libraryData?.source}
        isExternal={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-4">
            <Globe className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-manrope font-semibold text-sm">
              🇧🇷 Conteúdo 100% Brasileiro
            </span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-manrope font-black text-gray-900 mb-4">
            Biblioteca de {getCategoryName(libraryData?.category || 'gestao')}
          </h1>
          
          <p className="text-lg text-gray-600 font-manrope max-w-3xl mx-auto mb-6">
            Artigos especializados, cases reais e estratégias comprovadas por especialistas brasileiros.
          </p>

          {libraryData && (
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{libraryData.totalCount} artigos encontrados</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Fonte: {libraryData.source}</span>
              </div>
            </div>
          )}
        </div>

        {libraryData && libraryData.articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {libraryData.articles.map((article, index) => (
              <article
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-200 group"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4">
                    {article.url && article.url !== '#' && article.url.startsWith('http') ? (
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-white text-xs font-medium">Vynlo</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white font-manrope text-lg font-bold line-clamp-2">
                      {article.title}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 font-manrope leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{article.views.toLocaleString()} views</span>
                      <span>{article.engagement}% relevância</span>
                    </div>
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                      🇧🇷 Brasil
                    </div>
                  </div>

                  <div className="flex items-center text-blue-600 font-manrope font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span>
                      {article.url && article.url !== '#' && article.url.startsWith('http') 
                        ? 'Ler artigo original' 
                        : 'Ver conteúdo completo'
                      }
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Globe className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-gray-600 font-manrope">
              Não encontramos artigos brasileiros para esta categoria.
            </p>
          </div>
        )}

        <div className="text-center mt-16">
          <button
            onClick={() => window.location.href = '/blog'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Voltar ao Blog
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}