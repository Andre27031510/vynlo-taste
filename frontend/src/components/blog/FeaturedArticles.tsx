'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, ArrowRight, Star, TrendingUp, Trophy, Medal, Award, Flame } from 'lucide-react'
import { logger } from '../../utils/logger'


export default function FeaturedArticles() {
  const [activeArticle, setActiveArticle] = useState<number | null>(null)
  const [mostReadArticles, setMostReadArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    logger.componentMount('FeaturedArticles')
    loadMostReadContent()
  }, [])

  const loadMostReadContent = async () => {
    try {
      // Carregar diretamente os 3 artigos mais lidos
      loadFallbackArticles()
    } catch (error) {
      console.error('Erro ao carregar conteúdo mais lido:', error)
      loadFallbackArticles()
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryName = (category: string) => {
    const names: {[key: string]: string} = {
      'restaurantes': 'Restaurantes',
      'barbearias': 'Barbearias', 
      'petshops': 'Petshops',
      'igrejas': 'Igrejas',
      'gestao': 'Gestão Avançada'
    }
    return names[category] || 'Geral'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const loadFallbackArticles = () => {
    setMostReadArticles([
      {
        id: 'rest_1',
        title: 'O GUIA DEFINITIVO PARA UM RESTAURANTE DE SUCESSO',
        excerpt: 'Guia completo com estratégias para transformar seu restaurante em um negócio de sucesso',
        category: 'Restaurantes',
        author: 'Vynlo',
        date: '04 Jan 2025',
        readTime: '45 min',
        views: 8750,
        engagement: 98,
        rank: 1,
        trend: 'up',
        url: 'https://static1.squarespace.com/static/6273f2683f9dba7b3670dc36/t/6278712ac288c6019eed48d0/1652060465999/O-Guia-Definitivo-Para-Um-Restaurante-De-SucessoCompressed.pdf'
      },
      {
        id: 'ia_1',
        title: 'Os Melhores Chatbots AI: Estratégia de Marketing e Conformidade',
        excerpt: 'Como implementar chatbots de IA com estratégias de marketing e conformidade legal',
        category: 'IA & Bots',
        author: 'Iubenda',
        date: '03 Jan 2025',
        readTime: '18 min',
        views: 4250,
        engagement: 96,
        rank: 2,
        trend: 'up',
        url: 'https://www.iubenda.com/pt-br/help/121116-os-melhores-chatbots-ai-estrategia-de-marketing-e-conformidade'
      },
      {
        id: 'pet_1',
        title: 'Dicas para seu Negócio de Pet Shop Competir com Grandes Marcas',
        excerpt: 'Estratégias para petshops competirem no mercado e aumentarem vendas',
        category: 'Pet Shops',
        author: 'UOL Host',
        date: '02 Jan 2025',
        readTime: '14 min',
        views: 3450,
        engagement: 94,
        rank: 3,
        trend: 'stable',
        url: 'https://uolhost.uol.com.br/blog/pet-shop-dicas/'
      }
    ])
  }

  const handleArticleClick = (article: any) => {
    // Abrir link externo
    if (article.url && article.url.startsWith('http')) {
      window.open(article.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section data-section="featured" className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <Star className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">Artigos em Destaque</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-8 leading-tight">
            Conteúdo
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              mais lido
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-600"></div>
                <div className="p-8">
                  <div className="h-6 bg-gray-600 rounded mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mostReadArticles.map((article, index) => (
              <article
                key={article.id}
                onMouseEnter={() => setActiveArticle(index)}
                onMouseLeave={() => setActiveArticle(null)}
                onClick={() => handleArticleClick(article)}
                className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white font-manrope text-xs font-medium">{article.category}</span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <div className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-bold
                      ${article.rank === 1 ? 'bg-yellow-500/20 text-yellow-300' : 
                        article.rank === 2 ? 'bg-gray-500/20 text-gray-300' :
                        'bg-orange-500/20 text-orange-300'}
                    `}>
                      #{article.rank}
                      {article.rank === 1 && <Trophy className="w-3 h-3 ml-1" />}
                      {article.rank === 2 && <Medal className="w-3 h-3 ml-1" />}
                      {article.rank === 3 && <Award className="w-3 h-3 ml-1" />}
                    </div>
                    {article.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-manrope font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-300 font-manrope leading-relaxed mb-6">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-3">
                      <span>{article.views?.toLocaleString() || '0'} views</span>
                      <span>{article.engagement || 0}% engajamento</span>
                    </div>
                    <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full flex items-center space-x-1">
                      <Flame className="w-3 h-3" />
                      <span>Mais Lido</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-blue-400 font-manrope font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <span>Ler artigo</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}