'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMostReadContent } from '../../hooks/useMostReadContent'
import { RankingData } from '../../services/analyticsService'

const MostReadContent: React.FC = () => {
  const {
    loading,
    error,
    selectedCategory,
    sortBy,
    searchTerm,
    filteredRankings,
    categoryOptions,
    overallStats,
    setSelectedCategory,
    setSortBy,
    setSearchTerm,
    handleArticleClick
  } = useMostReadContent()

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📚 Conteúdo Mais Lido
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra os artigos mais populares e relevantes para seu negócio, 
            baseado em métricas reais de engajamento e visualizações
          </p>
          <div className="mt-4 text-sm text-gray-500">
            📊 {overallStats.totalArticles} artigos • {formatNumber(overallStats.totalViews)} visualizações • Atualizado em tempo real
          </div>
        </motion.div>

        {/* Controles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between"
        >
          {/* Busca */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            {/* Categoria */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="score">🏆 Mais Relevantes</option>
              <option value="views">👁️ Mais Visualizados</option>
              <option value="engagement">💬 Maior Engajamento</option>
            </select>
          </div>
        </motion.div>

        {/* Grid de Artigos */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${selectedCategory}-${sortBy}-${searchTerm}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRankings.map((ranking, index) => (
              <ArticleCard
                key={ranking.article.id}
                ranking={ranking}
                index={index}
                onClick={() => handleArticleClick(ranking)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Mensagem quando não há resultados */}
        {filteredRankings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              Tente ajustar os filtros ou termo de busca
            </p>
            <div className="text-sm text-gray-400">
              Total de artigos disponíveis: {overallStats.totalArticles}
            </div>
          </motion.div>
        )}
        
        {/* Estatísticas gerais */}
        {filteredRankings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{overallStats.totalArticles}</div>
                <div className="text-sm text-gray-500">Artigos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatNumber(overallStats.totalViews)}</div>
                <div className="text-sm text-gray-500">Visualizações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{overallStats.avgEngagement}</div>
                <div className="text-sm text-gray-500">Engajamento Médio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{formatNumber(overallStats.totalClicks)}</div>
                <div className="text-sm text-gray-500">Cliques</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

// Componente do Card de Artigo
const ArticleCard: React.FC<{
  ranking: RankingData
  index: number
  onClick: () => void
}> = ({ ranking, index, onClick }) => {
  const { article, rank, trend, changePercent } = ranking

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 relative overflow-hidden">
        {/* Efeito shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-shimmer"></div>
        
        {/* Badge de Ranking */}
        <div className="flex items-center justify-between mb-4">
          <div className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-bold
            ${rank === 1 ? 'bg-yellow-100 text-yellow-800' : 
              rank === 2 ? 'bg-gray-100 text-gray-800' :
              rank === 3 ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'}
          `}>
            #{rank}
            {rank === 1 && ' 🏆'}
            {rank === 2 && ' 🥈'}
            {rank === 3 && ' 🥉'}
          </div>
          
          {/* Tendência */}
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${trend === 'up' ? 'bg-green-100 text-green-800' :
              trend === 'down' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-600'}
          `}>
            {trend === 'up' && '📈'}
            {trend === 'down' && '📉'}
            {trend === 'stable' && '➡️'}
            {changePercent !== 0 && ` ${Math.abs(changePercent)}%`}
          </div>
        </div>

        {/* Título */}
        <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatNumber(article.views)}</div>
            <div className="text-xs text-gray-500">👁️ Visualizações</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{article.engagement}</div>
            <div className="text-xs text-gray-500">💬 Engajamento</div>
          </div>
        </div>

        {/* Barra de Progresso de Popularidade */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Popularidade</span>
            <span>{Math.round((ranking.score / 1000) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min((ranking.score / 1000) * 100, 100)}%` }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
              {getCategoryLabel(article.category)}
            </span>
          </div>
          <div className="font-medium text-blue-600">
            {article.source}
          </div>
        </div>

        {/* Indicador de link externo */}
        {article.url.startsWith('http') && (
          <div className="absolute top-3 right-3 text-gray-400 group-hover:text-blue-500 transition-colors">
            🔗
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Funções auxiliares
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'restaurantes': '🍽️ Restaurantes',
    'barbearias': '✂️ Barbearias',
    'petshops': '🐕 Pet Shops',
    'igrejas': '⛪ Igrejas',
    'ia-bot': '🤖 IA & Bots',
    'educacao': '📚 Educação',
    'servicos': '🏢 Serviços',
    'saude': '🏥 Saúde'
  }
  return labels[category] || category
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

// Componente de Loading
const LoadingSkeleton: React.FC = () => (
  <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>
      </div>
      
      {/* Controles skeleton */}
      <div className="mb-8 flex justify-between items-center">
        <div className="animate-pulse h-10 bg-gray-200 rounded w-64"></div>
        <div className="flex gap-3">
          <div className="animate-pulse h-10 bg-gray-200 rounded w-32"></div>
          <div className="animate-pulse h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      
      {/* Cards skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between mb-4">
                <div className="h-6 bg-gray-300 rounded w-12"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="h-6 bg-gray-300 rounded w-12 mx-auto mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="h-6 bg-gray-300 rounded w-12 mx-auto mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// Componente de Error
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="container mx-auto px-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Erro ao Carregar Conteúdo
        </h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Tentar Novamente
        </button>
      </div>
    </div>
  </section>
)

export default React.memo(MostReadContent)