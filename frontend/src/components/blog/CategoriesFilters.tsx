'use client'

import { useState, useEffect } from 'react'
import { 
  UtensilsCrossed,
  Scissors,
  Heart,
  Church,
  Building2,
  Filter,
  Search
} from 'lucide-react'
import { logger } from '../../utils/logger'

interface CategoriesFiltersProps {
  selectedCategory: string
  searchQuery: string
}

export default function CategoriesFilters({ selectedCategory, searchQuery }: CategoriesFiltersProps) {
  const [activeFilter, setActiveFilter] = useState(selectedCategory)

  useEffect(() => {
    logger.componentMount('CategoriesFilters')
  }, [])

  const categories = [
    { id: 'todos', name: 'Todos os Artigos', icon: Building2, count: 50 },
    { id: 'restaurantes', name: 'Restaurantes', icon: UtensilsCrossed, count: 18 },
    { id: 'barbearias', name: 'Barbearias', icon: Scissors, count: 12 },
    { id: 'petshops', name: 'Petshops', icon: Heart, count: 8 },
    { id: 'igrejas', name: 'Igrejas', icon: Church, count: 6 },
    { id: 'gestao', name: 'Gestão', icon: Building2, count: 15 }
  ]

  const handleCategoryClick = (categoryId: string) => {
    setActiveFilter(categoryId)
    logger.userInteraction('blog_category_click', categoryId)
  }

  return (
    <section data-section="filters" className="py-20 bg-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Filter className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">
              Categorias
            </span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-manrope font-black text-gray-900 mb-6 leading-tight">
            Encontre conteúdo
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              para o seu segmento
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto leading-relaxed">
            Navegue por categorias específicas ou use a busca para encontrar exatamente o que precisa
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            const isActive = activeFilter === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`group relative bg-white border-2 rounded-3xl p-6 text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                  isActive 
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/25 bg-blue-50' 
                    : 'border-gray-100 hover:border-blue-200 hover:shadow-xl'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto transform transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-500 shadow-lg' 
                    : 'bg-gray-100 group-hover:bg-blue-100'
                } ${isActive ? '' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                  <IconComponent className={`w-8 h-8 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                </div>

                {/* Content */}
                <h3 className={`text-lg font-manrope font-bold mb-2 ${
                  isActive ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
                }`}>
                  {category.name}
                </h3>
                
                <div className={`text-sm font-manrope font-medium ${
                  isActive ? 'text-blue-500' : 'text-gray-500'
                }`}>
                  {category.count} artigos
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : ''
                }`}></div>
              </button>
            )
          })}
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-6 py-3">
              <Search className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 font-manrope font-medium">
                Resultados para: "{searchQuery}"
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}