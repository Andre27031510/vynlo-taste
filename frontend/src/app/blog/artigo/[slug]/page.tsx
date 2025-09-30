import { Suspense } from 'react'
import ArtigoPageClient from './ArtigoPageClient'

// Generate static params for SSG
export async function generateStaticParams() {
  // Definir todas as possíveis rotas dinâmicas
  const categories = [
    'restaurantes',
    'barbearias', 
    'petshops',
    'igrejas',
    'ia-bot',
    'educacao',
    'servicos',
    'saude',
    'gestao'
  ]
  
  return categories.map((category) => ({
    slug: category,
  }))
}

export default function ArtigoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-manrope">Carregando biblioteca brasileira...</p>
        </div>
      </div>
    }>
      <ArtigoPageClient />
    </Suspense>
  )
}
