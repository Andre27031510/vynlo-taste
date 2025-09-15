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
    console.log('Página carregada com slug:', slug, 'data:', data)
    
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data))
        console.log('Dados parseados:', parsedData)
        setLibraryData(parsedData)
      } catch (error) {
        console.error('Erro ao parsear dados:', error)
        console.log('Usando fallback devido a erro no parse')
        loadFallbackData()
      }
    } else {
      console.log('Nenhum dado fornecido, usando fallback')
      loadFallbackData()
    }
    setIsLoading(false)
  }, [data, slug])

  const loadFallbackData = () => {
    const categoria = slug.includes('-biblioteca') ? slug.replace('-biblioteca', '') : slug.split('-')[0] || 'gestao'
    
    // Usar os mesmos artigos do articleService para consistência
    const getBrazilianArticles = (category: string): Article[] => {
      const realArticles: { [key: string]: Article[] } = {
        'restaurantes': [
          {
            id: 'rest_1',
            title: 'O GUIA DEFINITIVO PARA UM RESTAURANTE DE SUCESSO',
            excerpt: 'Guia completo com todas as estratégias, técnicas e segredos para transformar seu restaurante em um negócio de sucesso. Download gratuito em PDF.',
            content: 'Este guia definitivo contém tudo que você precisa saber para ter um restaurante de sucesso. Desde planejamento até execução...',
            category: 'restaurantes',
            author: 'Vynlo Taste',
            date: new Date().toISOString().split('T')[0],
            readTime: '45 min',
            tags: ['guia', 'sucesso', 'restaurante', 'completo'],
            views: 8750,
            engagement: 98,
            source: 'Vynlo',
            image: '/blog/guia-restaurante.jpg',
            url: 'https://static1.squarespace.com/static/6273f2683f9dba7b3670dc36/t/6278712ac288c6019eed48d0/1652060465999/O-Guia-Definitivo-Para-Um-Restaurante-De-SucessoCompressed.pdf'
          },
          {
            id: 'rest_2',
            title: 'Gestão Operacional Completa para Restaurantes',
            excerpt: 'Guia prático de gestão operacional e eficiência. Controle de custos, processos e otimização para restaurantes de sucesso.',
            content: 'A gestão operacional eficiente é fundamental para o sucesso de qualquer restaurante. Este guia aborda todos os aspectos...',
            category: 'restaurantes',
            author: 'Vida de Autônomo',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            readTime: '22 min',
            tags: ['gestão', 'operacional', 'eficiência', 'controle'],
            views: 5240,
            engagement: 96,
            source: 'Vida de Autônomo',
            image: '/blog/gestao-operacional-restaurante.jpg',
            url: 'https://vidadeautonomo.com.br/2023/10/04/o-guia-definitivo-pra-gerir-seu-restaurante/'
          },
          {
            id: 'rest_3',
            title: 'Estratégias de Crescimento para Restaurantes',
            excerpt: 'Como expandir seu restaurante de forma sustentável. Planejamento, financiamento e gestão para crescimento acelerado e lucrativo.',
            content: 'O crescimento de um restaurante requer estratégia e planejamento. Veja como escalar seu negócio com segurança...',
            category: 'restaurantes',
            author: 'Endeavor Brasil',
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
            readTime: '16 min',
            tags: ['crescimento', 'expansão', 'estratégia', 'planejamento'],
            views: 4180,
            engagement: 94,
            source: 'Endeavor',
            image: '/blog/crescimento-restaurante.jpg',
            url: '#'
          }
        ]
      }
      return realArticles[category] || []
    }
    
    const fallbackArticles = getBrazilianArticles(categoria)
    
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

  const handleArticleClick = (article: Article & { urlValid?: boolean; contentRelevant?: boolean }) => {
    // Para artigos com URL externa, abrir diretamente
    if (article.url && article.url.startsWith('http')) {
      window.open(article.url, '_blank', 'noopener,noreferrer')
    } else {
      // Para artigos internos, mostrar conteúdo
      const expandedContent = `
        ${article.title}
        
        ${article.excerpt}
        
        ${article.content}
        
        Autor: ${article.author}
        Tempo de leitura: ${article.readTime}
        Fonte: ${article.source}
        
        Este é um conteúdo especializado da biblioteca Vynlo sobre ${getCategoryName(article.category).toLowerCase()}.
      `
      alert(expandedContent)
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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Banner Azul para Preto Profissional */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-black py-20 mt-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">

            
            <h1 className="text-4xl lg:text-6xl font-manrope font-black text-white mb-6 leading-tight">
              Biblioteca de
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-white">
                {getCategoryName(libraryData?.category || 'gestao')}
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 font-manrope max-w-4xl mx-auto leading-relaxed mb-8">
              Conteúdo especializado, cases reais e estratégias comprovadas por especialistas da área. 
              Artigos selecionados das melhores fontes para {getCategoryName(libraryData?.category || 'gestao').toLowerCase()}.
            </p>
            
            {libraryData && (
              <div className="flex items-center justify-center gap-8 text-blue-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">{libraryData.totalCount} artigos especializados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Fonte: {libraryData.source}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {libraryData && libraryData.articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {libraryData.articles.map((article, index) => (
              <article
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 group relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Premium Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {article.source}
                  </div>
                </div>
                
                {/* Image Header */}
                <div className="h-56 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-6 left-6 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 right-8 w-6 h-6 bg-cyan-400/30 rounded-full animate-bounce"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white font-manrope text-xl font-black leading-tight line-clamp-3 mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-blue-200 text-sm">
                      <ExternalLink className="w-4 h-4" />
                      <span className="font-medium">Artigo Externo</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-700 font-manrope leading-relaxed mb-6 line-clamp-3 text-base">
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(article.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-2xl">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{article.views.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Visualizações</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{article.engagement}%</div>
                      <div className="text-xs text-gray-500">Relevância</div>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      ✓ Validado
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold py-4 px-6 rounded-2xl text-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                    <div className="flex items-center justify-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      <span>Ler Artigo Completo</span>
                    </div>
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