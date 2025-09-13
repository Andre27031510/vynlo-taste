// Configurações de API para busca de artigos
export const API_CONFIG = {
  NEWS_API: {
    url: 'https://newsapi.org/v2/everything',
    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY || 'demo',
    rateLimit: 1000
  },
  MEDIUM: {
    url: 'https://api.rss2json.com/v1/api.json',
    rateLimit: 100
  },
  GITHUB: {
    url: 'https://api.github.com/search/repositories',
    token: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    rateLimit: 30
  }
}

// URLs de fallback para artigos locais
export const FALLBACK_ARTICLES = {
  restaurantes: [
    {
      id: 'fallback_rest_1',
      title: 'Como Automatizar Pedidos no iFood: Guia Completo 2024',
      excerpt: 'Estratégias comprovadas para aumentar vendas em 300% usando automação inteligente no iFood e Rappi',
      url: '/blog/artigo/automatizar-pedidos-ifood',
      source: 'Vynlo Research'
    },
    {
      id: 'fallback_rest_2',
      title: 'Sistema de Delivery: Como Reduzir Custos em 40%',
      excerpt: 'Case real: Restaurante economizou R$ 15.000/mês otimizando operações de delivery',
      url: '/blog/artigo/sistema-delivery-reduzir-custos',
      source: 'Case Study'
    }
  ],
  barbearias: [
    {
      id: 'fallback_barber_1',
      title: 'Agendamento Inteligente: Barbearia do Futuro',
      excerpt: 'Como reduzir no-shows em 80% e aumentar receita com sistema de agendamento inteligente',
      url: '/blog/artigo/agendamento-inteligente-barbearia',
      source: 'Industry Expert'
    }
  ],
  petshops: [
    {
      id: 'fallback_pet_1',
      title: 'WhatsApp Business API: Revolucione seu Petshop',
      excerpt: 'Case real: Petshop aumentou faturamento em 250% com automação WhatsApp personalizada',
      url: '/blog/artigo/whatsapp-business-petshop',
      source: 'Case Study'
    }
  ],
  igrejas: [
    {
      id: 'fallback_church_1',
      title: 'Gestão Financeira Transparente para Igrejas',
      excerpt: 'Sistema completo de controle financeiro com relatórios automáticos e transparência total',
      url: '/blog/artigo/gestao-financeira-igrejas',
      source: 'Especialista'
    }
  ],
  gestao: [
    {
      id: 'fallback_gestao_1',
      title: 'IA na Gestão: Previsão de Demanda Precisa',
      excerpt: 'Algoritmos de machine learning para prever demanda e otimizar estoque automaticamente',
      url: '/blog/artigo/ia-gestao-previsao-demanda',
      source: 'Tech Research'
    }
  ]
}

// Categorias e suas palavras-chave de busca
export const CATEGORY_KEYWORDS = {
  restaurantes: [
    'gestão restaurante', 'delivery restaurante', 'cardápio digital', 
    'automação restaurante', 'iFood', 'Rappi', 'Uber Eats',
    'sistema restaurante', 'PDV restaurante', 'gestão delivery'
  ],
  barbearias: [
    'gestão barbearia', 'agendamento barbearia', 'sistema barbearia',
    'fidelização clientes', 'vendas barbearia', 'agenda online',
    'gestão barbearia', 'software barbearia', 'app barbearia'
  ],
  petshops: [
    'gestão petshop', 'automação petshop', 'WhatsApp petshop',
    'agendamento petshop', 'fidelização pets', 'vendas petshop',
    'sistema petshop', 'gestão veterinária', 'e-commerce pets'
  ],
  igrejas: [
    'gestão igreja', 'controle financeiro igreja', 'transparência igreja',
    'dízimo digital', 'gestão membros', 'eventos igreja',
    'sistema igreja', 'administração igreja', 'relatórios igreja'
  ],
  gestao: [
    'gestão empresarial', 'automação processos', 'sistema gestão',
    'produtividade', 'eficiência', 'otimização', 'processos',
    'gestão financeira', 'controle estoque', 'relatórios'
  ]
}
