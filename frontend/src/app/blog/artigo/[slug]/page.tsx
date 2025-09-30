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
  return <ArtigoPageClient />
}
