'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  ExternalLink,
  User,
  Calendar,
  Eye,
  ThumbsUp,
  Grid,
  List,
  RefreshCw
} from 'lucide-react'
import { libraryService, LibraryArticle } from '../../../services/libraryService'
import Header from '../../landingpages/Header'
import Footer from '../../landingpages/Footer'

// Componente de Card de Artigo
const ArticleCard = ({ article }: { article: LibraryArticle }) => {
  const handleClick = () => {
    if (article.url && article.url.startsWith('http')) {
      window.open(article.url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = article.url
    }
  }

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {article.category}
          </span>
          <span className="text-gray-500 text-sm">{article.readTime}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{article.engagement}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {article.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function BibliotecaCompletaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState<LibraryArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('todos')

  const categories = [
    { id: 'todos', name: 'Todos os Artigos' },
    { id: 'restaurantes', name: 'Restaurantes' },
    { id: 'barbearias', name: 'Barbearias' },
    { id: 'petshops', name: 'Petshops' },
    { id: 'igrejas', name: 'Igrejas' },
    { id: 'educacao', name: 'Educação' },
    { id: 'servicos', name: 'Serviços' },
    { id: 'saude', name: 'Saúde' }
  ]

  useEffect(() => {
    loadArticles()
  }, [])

  useEffect(() => {
    const categoria = searchParams.get('categoria')
    if (categoria) {
      setSelectedCategory(categoria)
    }
  }, [searchParams])

  const loadArticles = async () => {
    setIsLoading(true)
    try {
      const result = await libraryService.globalSearch('', {}, 1, 100)
      setArticles(result.articles)
    } catch (error) {
      console.error('Erro ao carregar artigos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'todos' || article.category === selectedCategory
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-gray-900 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <span className="text-white font-medium">Biblioteca de Artigos</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Biblioteca Completa
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Acesse todos os artigos especializados organizados por categoria
            </p>
          </div>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            {/* Busca Principal */}
            <div className="relative max-w-4xl mx-auto w-full">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Buscar artigos por título, conteúdo ou tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 shadow-lg"
              />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">

              {/* Categorias */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Visualização:</span>
                <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artigos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Carregando artigos...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {filteredArticles.length} artigos encontrados
                    </h2>
                    {selectedCategory !== 'todos' && (
                      <p className="text-lg text-blue-600 font-medium">
                        Categoria: {categories.find(c => c.id === selectedCategory)?.name}
                      </p>
                    )}
                    {searchQuery && (
                      <p className="text-gray-600 mt-1">
                        Resultados para: "{searchQuery}"
                      </p>
                    )}
                  </div>
                  {selectedCategory !== 'todos' && (
                    <button
                      onClick={() => setSelectedCategory('todos')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Limpar filtro
                    </button>
                  )}
                </div>
              </div>

              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-20">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Nenhum artigo encontrado
                  </h3>
                  <p className="text-gray-600">
                    Tente ajustar os filtros ou termo de busca
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default function BibliotecaCompletaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <BibliotecaCompletaContent />
    </Suspense>
  )
}