'use client'

import { ArrowLeft, ExternalLink } from 'lucide-react'

interface CategoryBannerProps {
  category: string
  title: string
  source?: string
  isExternal?: boolean
}

export default function CategoryBanner({ category, title, source, isExternal }: CategoryBannerProps) {
  const getCategoryInfo = (cat: string) => {
    const categories: { [key: string]: { name: string; color: string; icon: string } } = {
      'restaurantes': { name: 'Restaurantes', color: 'from-emerald-600 to-green-800', icon: '🍽️' },
      'barbearias': { name: 'Barbearias', color: 'from-blue-600 to-indigo-800', icon: '✂️' },
      'petshops': { name: 'Petshops', color: 'from-pink-600 to-rose-800', icon: '🐾' },
      'igrejas': { name: 'Igrejas', color: 'from-amber-600 to-orange-800', icon: '⛪' },
      'gestao': { name: 'Gestão Avançada', color: 'from-purple-600 to-violet-800', icon: '📊' }
    }
    return categories[cat] || { name: 'Artigo', color: 'from-gray-600 to-gray-800', icon: '📄' }
  }

  const categoryInfo = getCategoryInfo(category)

  return (
    <div className={`w-full bg-gradient-to-r ${categoryInfo.color} relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
        <div className="flex items-center justify-between">
          {/* Left Side - Category Info */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-2xl">{categoryInfo.icon}</div>
              <div>
                <div className="text-white/80 text-sm font-medium">
                  {categoryInfo.name}
                </div>
                <div className="text-white font-bold text-lg leading-tight">
                  {title.length > 60 ? `${title.substring(0, 60)}...` : title}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Source Info */}
          <div className="flex items-center gap-3">
            {source && (
              <div className="text-right">
                <div className="text-white/70 text-xs">Fonte</div>
                <div className="text-white text-sm font-semibold flex items-center gap-1">
                  {source}
                  {isExternal && <ExternalLink className="w-3 h-3" />}
                </div>
              </div>
            )}
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="text-white text-xs font-medium">
                {new Date().toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  )
}