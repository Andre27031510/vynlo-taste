// Serviço de busca e redirecionamento para artigos reais da internet
import { Article } from './contentService'
import { API_CONFIG, FALLBACK_ARTICLES, CATEGORY_KEYWORDS } from '../config/api'

interface ArticleSource {
  name: string
  url: string
  apiKey?: string
  rateLimit: number
}

interface SearchResult {
  articles: Article[]
  totalCount: number
  source: string
  searchTime: number
}

class ArticleService {
  private sources: ArticleSource[] = [
    {
      name: 'NewsAPI',
      url: 'https://newsapi.org/v2/everything',
      apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY || 'demo',
      rateLimit: 1000
    },
    {
      name: 'Medium',
      url: 'https://api.rss2json.com/v1/api.json',
      rateLimit: 100
    },
    {
      name: 'GitHub',
      url: 'https://api.github.com/search/repositories',
      rateLimit: 30
    }
  ]

  private categoryKeywords = CATEGORY_KEYWORDS

  // Buscar artigos reais da internet por categoria
  async searchArticlesByCategory(category: string): Promise<SearchResult> {
    const startTime = Date.now()
    const keywords = this.categoryKeywords[category as keyof typeof this.categoryKeywords] || ['gestão', 'automação']
    
    try {
      // Tentar múltiplas fontes
      const results = await Promise.allSettled([
        this.searchNewsAPI(keywords[0], category),
        this.searchMedium(keywords[0], category),
        this.searchGitHub(keywords[0], category)
      ])

      const articles: Article[] = []
      let source = 'Multiple Sources'

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.length > 0) {
          articles.push(...result.value)
          if (index === 0) source = 'NewsAPI'
          else if (index === 1) source = 'Medium'
          else if (index === 2) source = 'GitHub'
        }
      })

      // Se não encontrou artigos externos, usar artigos locais
      if (articles.length === 0) {
        return await this.getLocalArticles(category)
      }

      // Filtrar e validar artigos
      const validatedArticles = this.validateArticles(articles, category)
      
      return {
        articles: validatedArticles.slice(0, 10), // Limitar a 10 artigos
        totalCount: validatedArticles.length,
        source,
        searchTime: Date.now() - startTime
      }

    } catch (error) {
      console.error('Erro ao buscar artigos:', error)
      return await this.getLocalArticles(category)
    }
  }

  // Buscar na NewsAPI com foco no Brasil
  private async searchNewsAPI(query: string, category: string): Promise<Article[]> {
    try {
      const apiKey = this.sources[0].apiKey
      if (apiKey === 'demo') {
        return this.getBrazilianArticles(category)
      }

      // Buscar especificamente no Brasil com palavras-chave em português
      const brazilianQuery = `${query} Brasil OR ${query} negócios OR ${query} empreendedorismo`
      const response = await fetch(
        `${this.sources[0].url}?q=${encodeURIComponent(brazilianQuery)}&language=pt&country=br&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
      )
      
      if (!response.ok) throw new Error('NewsAPI error')
      
      const data = await response.json()
      
      return data.articles?.map((article: any) => ({
        id: `newsapi_${Date.now()}_${Math.random()}`,
        title: article.title,
        excerpt: article.description || '',
        content: article.content || article.description || '',
        category,
        author: article.source?.name || 'NewsAPI',
        date: article.publishedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        readTime: this.calculateReadTime(article.content || article.description || ''),
        tags: this.extractTags(article.title + ' ' + (article.description || '')),
        views: Math.floor(Math.random() * 1000) + 100,
        engagement: Math.floor(Math.random() * 20) + 80,
        source: 'NewsAPI',
        image: article.urlToImage,
        url: article.url
      })) || []

    } catch (error) {
      console.error('Erro NewsAPI:', error)
      return this.getBrazilianArticles(category)
    }
  }

  // Buscar no Medium Brasil via RSS
  private async searchMedium(query: string, category: string): Promise<Article[]> {
    try {
      // Usar tags em português para Medium Brasil
      const brazilianTags = {
        'restaurantes': 'gestao-restaurantes',
        'barbearias': 'marketing-digital',
        'petshops': 'automacao-whatsapp',
        'igrejas': 'gestao-financeira',
        'gestao': 'empreendedorismo-brasil'
      }
      const tag = brazilianTags[category as keyof typeof brazilianTags] || query
      const rssUrl = `https://medium.com/feed/tag/${encodeURIComponent(tag)}`
      const response = await fetch(
        `${this.sources[1].url}?rss_url=${encodeURIComponent(rssUrl)}`
      )
      
      if (!response.ok) throw new Error('Medium RSS error')
      
      const data = await response.json()
      
      return data.items?.slice(0, 3).map((item: any) => ({
        id: `medium_${Date.now()}_${Math.random()}`,
        title: item.title,
        excerpt: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
        content: item.content?.replace(/<[^>]*>/g, '').substring(0, 1000) || '',
        category,
        author: item.author || 'Medium',
        date: item.pubDate?.split(' ')[0] || new Date().toISOString().split('T')[0],
        readTime: this.calculateReadTime(item.content || ''),
        tags: this.extractTags(item.title + ' ' + item.description),
        views: Math.floor(Math.random() * 500) + 50,
        engagement: Math.floor(Math.random() * 15) + 85,
        source: 'Medium',
        image: item.thumbnail,
        url: item.link
      })) || []

    } catch (error) {
      console.error('Erro Medium:', error)
      return []
    }
  }

  // Buscar no GitHub
  private async searchGitHub(query: string, category: string): Promise<Article[]> {
    try {
      const response = await fetch(
        `${this.sources[2].url}?q=${encodeURIComponent(query)}+language:markdown&sort=updated&per_page=3`
      )
      
      if (!response.ok) throw new Error('GitHub API error')
      
      const data = await response.json()
      
      return data.items?.map((repo: any) => ({
        id: `github_${Date.now()}_${Math.random()}`,
        title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
        excerpt: repo.description || '',
        content: repo.description || '',
        category,
        author: repo.owner?.login || 'GitHub',
        date: repo.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        readTime: '5 min',
        tags: this.extractTags(repo.name + ' ' + (repo.description || '')),
        views: repo.stargazers_count || 0,
        engagement: Math.floor(Math.random() * 10) + 90,
        source: 'GitHub',
        image: '',
        url: repo.html_url
      })) || []

    } catch (error) {
      console.error('Erro GitHub:', error)
      return []
    }
  }

  // Artigos locais como fallback
  private async getLocalArticles(category: string): Promise<SearchResult> {
    const fallbackData = FALLBACK_ARTICLES[category as keyof typeof FALLBACK_ARTICLES] || []
    
    const articles: Article[] = fallbackData.map((item, index) => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      content: `Conteúdo completo sobre ${item.title.toLowerCase()}...\n\nEste é um artigo especializado sobre ${category} com informações detalhadas e estratégias comprovadas para o seu negócio.`,
      category,
      author: 'Equipe Vynlo',
      date: new Date(Date.now() - (index * 86400000)).toISOString().split('T')[0],
      readTime: this.calculateReadTime(item.excerpt),
      tags: this.extractTags(item.title + ' ' + item.excerpt),
      views: Math.floor(Math.random() * 2000) + 500,
      engagement: Math.floor(Math.random() * 20) + 80,
      source: item.source,
      image: `/blog/${category}-${index + 1}.jpg`,
      url: item.url
    }))
    
    return {
      articles,
      totalCount: articles.length,
      source: 'Vynlo Knowledge Base',
      searchTime: 0
    }
  }

  // Artigos brasileiros reais como fallback
  private getBrazilianArticles(category: string): Article[] {
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
          excerpt: 'Planos e métodos para expandir seu negócio. Estratégias comprovadas de crescimento e expansão para restaurantes de sucesso.',
          content: 'O crescimento de um restaurante requer estratégia e planejamento. Veja como escalar seu negócio com segurança...',
          category: 'restaurantes',
          author: 'Donos de Restaurantes',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          readTime: '14 min',
          tags: ['crescimento', 'expansão', 'estratégia', 'planejamento'],
          views: 4180,
          engagement: 94,
          source: 'Donos de Restaurantes',
          image: '/blog/crescimento-restaurante.jpg',
          url: 'https://donosderestaurantes.com/termos/estrategias-de-crescimento/'
        }

      ],
      'barbearias': [
        {
          id: 'barber_1',
          title: 'Estratégias de Marketing para Barbearia: 5 Ideias para Começar',
          excerpt: 'Redes sociais, fidelização, referência e anúncios para crescer sua barbearia. Estratégias práticas e eficazes.',
          content: 'O marketing é essencial para o sucesso de qualquer barbearia. Veja as 5 estratégias mais eficazes...',
          category: 'barbearias',
          author: 'Belasis',
          date: new Date().toISOString().split('T')[0],
          readTime: '12 min',
          tags: ['marketing', 'estratégias', 'redes sociais', 'crescimento'],
          views: 3240,
          engagement: 95,
          source: 'Belasis',
          image: '/blog/marketing-barbearia.jpg',
          url: 'https://www.belasis.com.br/estrategias-de-marketing-para-barbearia-5-ideias-para-comecar/'
        },
        {
          id: 'barber_2',
          title: 'Como Administrar o Dinheiro da Barbearia',
          excerpt: 'Controle financeiro, fluxo de caixa e gestão de pagamentos. Guia completo para administrar as finanças da sua barbearia.',
          content: 'A gestão financeira é fundamental para o sucesso de qualquer barbearia. Veja como controlar seu dinheiro...',
          category: 'barbearias',
          author: 'Celcoin',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          readTime: '15 min',
          tags: ['financeiro', 'fluxo de caixa', 'pagamentos', 'controle'],
          views: 2890,
          engagement: 93,
          source: 'Celcoin',
          image: '/blog/financeiro-barbearia.jpg',
          url: 'https://www.celcoin.com.br/news/como-administrar-o-dinheiro-da-barbearia-confira-ja/'
        },
        {
          id: 'barber_3',
          title: 'Gestão Bem-Sucedida de Barbearias',
          excerpt: 'Dicas práticas para administrar e fazer sua barbearia prosperar. Gestão eficiente e estratégias de crescimento.',
          content: 'Uma gestão bem-sucedida é a chave para o crescimento sustentável da sua barbearia...',
          category: 'barbearias',
          author: 'Reservio',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          readTime: '18 min',
          tags: ['gestão', 'administração', 'crescimento', 'prosperidade'],
          views: 2156,
          engagement: 91,
          source: 'Reservio',
          image: '/blog/gestao-barbearia.jpg',
          url: 'https://www.reservio.com/pt-br/blog/dicas-de-negocios/gestao-bem-sucedida-de-barbearias'
        }
      ],
      'petshops': [
        {
          id: 'pet_1',
          title: 'Dicas e Ideias para seu Negócio de Pet Shop Competir com Grandes Marcas',
          excerpt: 'Plano de negócios, experiências diferenciadas e marketing para petshops. Estratégias para competir no mercado.',
          content: 'O mercado pet é altamente competitivo. Veja como seu petshop pode se destacar e competir com grandes marcas...',
          category: 'petshops',
          author: 'UOL Host',
          date: new Date().toISOString().split('T')[0],
          readTime: '14 min',
          tags: ['negócio', 'competição', 'marketing', 'estratégias'],
          views: 3450,
          engagement: 94,
          source: 'UOL Host',
          image: '/blog/negocios-petshop.jpg',
          url: 'https://uolhost.uol.com.br/blog/pet-shop-dicas/'
        },
        {
          id: 'pet_2',
          title: 'Gestão Financeira para Petshops: Melhores Práticas',
          excerpt: 'Controle financeiro, planejamento e práticas de gestão para petshops. Guia completo em PDF do Sebrae.',
          content: 'A gestão financeira eficiente é fundamental para o sucesso do seu petshop. Veja as melhores práticas...',
          category: 'petshops',
          author: 'Sebrae',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          readTime: '25 min',
          tags: ['financeiro', 'gestão', 'planejamento', 'controle'],
          views: 2890,
          engagement: 96,
          source: 'Sebrae',
          image: '/blog/financeiro-petshop.jpg',
          url: 'https://sebrae.com.br/Sebrae/Portal%20Sebrae/UFs/PE/Anexos/Gestao-financeira-para-petshops-quais-as-melhores-pr%C3%A1ticas.pdf'
        },
        {
          id: 'pet_3',
          title: '11 Melhores Estratégias de Marketing para Pet Shops',
          excerpt: 'Marketing digital, fidelização e estratégias para atrair clientes. Guia completo com 11 estratégias eficazes.',
          content: 'O marketing é essencial para o crescimento do seu petshop. Conheça as 11 melhores estratégias...',
          category: 'petshops',
          author: 'Simples Vet',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          readTime: '16 min',
          tags: ['marketing', 'estratégias', 'fidelização', 'clientes'],
          views: 2650,
          engagement: 92,
          source: 'Simples Vet',
          image: '/blog/marketing-petshop.jpg',
          url: 'https://simples.vet/blog/vendas/marketing-para-petshop/'
        }
      ],
      'igrejas': [
        {
          id: 'church_1',
          title: 'Estratégias de Marketing para Atrair Visitantes para a Igreja',
          excerpt: 'Marketing digital, redes sociais e estratégias para crescimento da igreja. Como atrair novos membros e visitantes.',
          content: 'O marketing é uma ferramenta poderosa para o crescimento da igreja. Veja estratégias eficazes...',
          category: 'igrejas',
          author: 'Marketing do Reino',
          date: new Date().toISOString().split('T')[0],
          readTime: '13 min',
          tags: ['marketing', 'visitantes', 'crescimento', 'redes sociais'],
          views: 2340,
          engagement: 94,
          source: 'Marketing do Reino',
          image: '/blog/marketing-igreja.jpg',
          url: 'https://marketingdoreino.com/estrategias-de-marketing-para-atrair-visitantes-para-a-igreja/'
        },
        {
          id: 'church_2',
          title: 'Dicas de Gestão para Igrejas: Como Administrar Melhor',
          excerpt: 'Gestão administrativa, financeira e organizacional para igrejas. Dicas práticas para uma administração eficiente.',
          content: 'A gestão eficiente é fundamental para o bom funcionamento da igreja. Veja como administrar melhor...',
          category: 'igrejas',
          author: 'InPeace App',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          readTime: '16 min',
          tags: ['gestão', 'administração', 'organização', 'eficiência'],
          views: 1890,
          engagement: 92,
          source: 'InPeace App',
          image: '/blog/gestao-igreja.jpg',
          url: 'https://inpeaceapp.com/dicas-gestao-igreja/'
        },
        {
          id: 'church_3',
          title: 'Recepção na Igreja: Como Receber Bem os Visitantes',
          excerpt: 'Atendimento, acolhimento e primeiras impressões para visitantes. Como criar uma recepção acolhedora e eficaz.',
          content: 'A primeira impressão é fundamental para reter visitantes. Veja como criar uma recepção eficaz...',
          category: 'igrejas',
          author: 'Zeke',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          readTime: '12 min',
          tags: ['recepção', 'visitantes', 'acolhimento', 'atendimento'],
          views: 1650,
          engagement: 90,
          source: 'Zeke',
          image: '/blog/recepcao-igreja.jpg',
          url: 'https://www.zeke.com.br/blog/recepcao-na-igreja/'
        }
      ],

      'ia-bot': [
        {
          id: 'ia_1',
          title: 'Os Melhores Chatbots AI: Estratégia de Marketing e Conformidade',
          excerpt: 'Guia completo sobre chatbots de IA, estratégias de marketing e conformidade legal. Como implementar com segurança.',
          content: 'Os chatbots de IA estão revolucionando o marketing digital. Veja como implementar com conformidade legal...',
          category: 'ia-bot',
          author: 'Iubenda',
          date: new Date().toISOString().split('T')[0],
          readTime: '18 min',
          tags: ['chatbot', 'ia', 'marketing', 'conformidade'],
          views: 4250,
          engagement: 96,
          source: 'Iubenda',
          image: '/blog/chatbots-ai.jpg',
          url: 'https://www.iubenda.com/pt-br/help/121116-os-melhores-chatbots-ai-estrategia-de-marketing-e-conformidade'
        },
        {
          id: 'ia_2',
          title: 'Impacto da Inteligência Artificial no Pensamento Crítico',
          excerpt: 'Como a IA está transformando o pensamento crítico e tomada de decisões. Análise profunda sobre o futuro da IA.',
          content: 'A inteligência artificial está mudando a forma como pensamos e tomamos decisões. Veja o impacto...',
          category: 'ia-bot',
          author: 'Anamid',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          readTime: '22 min',
          tags: ['ia', 'pensamento crítico', 'decisões', 'futuro'],
          views: 3680,
          engagement: 94,
          source: 'Anamid',
          image: '/blog/ia-pensamento.jpg',
          url: 'https://www.anamid.com.br/impacto-da-inteligencia-artificial-no-pensamento-critico/'
        },
        {
          id: 'ia_3',
          title: 'Guia Completo de Chatbots para Negócios',
          excerpt: 'Guia definitivo para implementar chatbots eficazes em seu negócio. Estratégias, ferramentas e melhores práticas.',
          content: 'Os chatbots são essenciais para negócios modernos. Veja como implementar corretamente...',
          category: 'ia-bot',
          author: 'Chatbot.com',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          readTime: '16 min',
          tags: ['chatbot', 'negócios', 'implementação', 'estratégias'],
          views: 3120,
          engagement: 92,
          source: 'Chatbot.com',
          image: '/blog/chatbot-negocios.jpg',
          url: 'https://www.chatbot.com/blog/chatbot-guide/'
        }
      ],
      'educacao': [
        {
          id: 'edu_1',
          title: 'Educação Inclusiva: Estratégias Pedagógicas para Promover a Equidade',
          excerpt: 'Estratégias pedagógicas para promover equidade e inclusão na educação',
          content: 'A educação inclusiva é fundamental para garantir que todos os alunos tenham acesso a uma educação de qualidade. Este artigo apresenta estratégias pedagógicas comprovadas para promover a equidade em sala de aula...',
          category: 'educacao',
          author: 'Revista Educação',
          date: new Date().toISOString().split('T')[0],
          readTime: '12 min',
          tags: ['educação inclusiva', 'estratégias', 'equidade', 'pedagogia'],
          views: 3240,
          engagement: 95,
          source: 'Revista Educação',
          image: '/blog/educacao-inclusiva.jpg',
          url: 'https://revistaeducacao.com.br/2024/03/15/educacao-inclusiva-estrategias-pedagogicas/'
        },
        {
          id: 'edu_2',
          title: 'Práticas Pedagógicas na Educação Infantil: Estratégias Eficazes',
          excerpt: 'Estratégias eficazes para o desenvolvimento integral das crianças na educação infantil',
          content: 'A educação infantil é uma fase crucial no desenvolvimento das crianças. Este artigo apresenta práticas pedagógicas eficazes que promovem o desenvolvimento integral dos pequenos...',
          category: 'educacao',
          author: 'Rhema Neuroeducação',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          readTime: '15 min',
          tags: ['educação infantil', 'práticas pedagógicas', 'desenvolvimento', 'crianças'],
          views: 2890,
          engagement: 93,
          source: 'Rhema Neuroeducação',
          image: '/blog/educacao-infantil.jpg',
          url: 'https://rhemaneuroeducacao.com.br/blog/praticas-pedagogicas-na-educacao-infantil-estrategias-eficazes-para-o-desenvolvimento-integral-das-criancas/'
        },
        {
          id: 'edu_3',
          title: '3 Dicas para sua Rede de Ensino Chegar Cada Vez Mais Longe',
          excerpt: 'Dicas práticas para melhorar o desempenho e alcance das redes de ensino',
          content: 'As redes de ensino enfrentam desafios únicos na busca por excelência educacional. Este artigo apresenta 3 dicas fundamentais para expandir o alcance e melhorar o desempenho das redes de ensino...',
          category: 'educacao',
          author: 'Fundação Lemann',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          readTime: '10 min',
          tags: ['redes de ensino', 'desempenho', 'alcance', 'gestão educacional'],
          views: 2650,
          engagement: 91,
          source: 'Fundação Lemann',
          image: '/blog/redes-ensino.jpg',
          url: 'https://fundacaolemann.org.br/noticias/3-dicas-para-a-sua-rede-de-ensino-chegar-cada-vez-mais-longe/?gad_source=1&gad_campaignid=22858382090&gbraid=0AAAAADotangsWvRQwN5OYMg33BcI4s7dU&gclid=Cj0KCQjw8p7GBhCjARIsAEhghZ2FK_Mw8HvuEENi7nVZYJqdsAuNh3DXTvXNCHkUjaLjPDGBdB3kC0caAvedEALw_wcB'
        }
      ],
      'servicos': [
        {
          id: 'serv_1',
          title: '4 Estratégias de Marketing para Alavancar seu Negócio',
          excerpt: 'Estratégias essenciais de marketing para consolidar e expandir seu negócio',
          content: 'O marketing é fundamental para o crescimento de qualquer negócio. Este artigo apresenta 4 estratégias essenciais que vão ajudar você a consolidar sua marca e expandir seu negócio de forma sustentável...',
          category: 'servicos',
          author: 'Líder Jr',
          date: new Date().toISOString().split('T')[0],
          readTime: '12 min',
          tags: ['marketing', 'estratégias', 'negócio', 'crescimento'],
          views: 3450,
          engagement: 94,
          source: 'Líder Jr',
          image: '/blog/marketing-estrategias.jpg',
          url: 'https://liderjr.com/blog/4-estrategias-de-marketing-para-alavancar-seu-negocio/?gad_source=1&gad_campaignid=22403921657&gbraid=0AAAAADK0Y1lgWO1I0uGIbRUSEZ_Ni_pO6&gclid=Cj0KCQjw8p7GBhCjARIsAEhghZ1n5N-KzRvCKva_ybkgzlFgMp2r4WzTR6oRy3EGNj50jR9Z-r1N2n8aAvlUEALw_wcB'
        },
        {
          id: 'serv_2',
          title: 'Como Fazer a Gestão Financeira do Pequeno Negócio',
          excerpt: 'Guia completo do Sebrae para gestão financeira eficiente de pequenos negócios',
          content: 'A gestão financeira é um dos pilares fundamentais para o sucesso de qualquer pequeno negócio. Este guia do Sebrae apresenta as melhores práticas e ferramentas para manter suas finanças organizadas e saudáveis...',
          category: 'servicos',
          author: 'Sebrae',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          readTime: '18 min',
          tags: ['gestão financeira', 'pequeno negócio', 'sebrae', 'finanças'],
          views: 4120,
          engagement: 96,
          source: 'Sebrae',
          image: '/blog/gestao-financeira-pequeno.jpg',
          url: 'https://sebrae.com.br/sites/PortalSebrae/artigos/como-fazer-a-gestao-financeira-do-pequeno-negocio,d999a442d2e5a410VgnVCM1000003b74010aRCRD'
        },
        {
          id: 'serv_3',
          title: 'A Importância da Gestão Financeira Empresarial',
          excerpt: 'Fundamentos essenciais da gestão financeira para empresas de todos os portes',
          content: 'A gestão financeira empresarial é crucial para a sustentabilidade e crescimento de qualquer organização. Este artigo aborda os fundamentos essenciais que toda empresa deve conhecer e aplicar...',
          category: 'servicos',
          author: 'Sebrae',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          readTime: '16 min',
          tags: ['gestão financeira', 'empresarial', 'fundamentos', 'sustentabilidade'],
          views: 3680,
          engagement: 92,
          source: 'Sebrae',
          image: '/blog/gestao-financeira-empresarial.jpg',
          url: 'https://sebrae.com.br/sites/PortalSebrae/artigos/a-importancia-da-gestao-financeira-empresarial,624d36b750c32810VgnVCM100000d701210aRCRD'
        }
      ],
      'saude': [
        {
          id: 'saude_1',
          title: 'A Importância do Marketing na Área da Saúde: Estratégias e Práticas Essenciais',
          excerpt: 'Estratégias de marketing essenciais para profissionais da saúde e clínicas',
          content: 'O marketing na área da saúde é fundamental para o crescimento e sucesso de profissionais e clínicas. Este artigo apresenta estratégias e práticas essenciais que respeitam as normas éticas da profissão...',
          category: 'saude',
          author: 'Plenitude Educação',
          date: new Date().toISOString().split('T')[0],
          readTime: '14 min',
          tags: ['marketing saúde', 'estratégias', 'práticas essenciais', 'profissionais'],
          views: 3680,
          engagement: 95,
          source: 'Plenitude Educação',
          image: '/blog/marketing-saude-estrategias.jpg',
          url: 'https://blog.plenitudeeducacao.com.br/a-importancia-do-marketing-na-area-da-saude-estrategias-e-praticas-essenciais/'
        },
        {
          id: 'saude_2',
          title: '5 Dicas para Abrir um Negócio de Saúde de Sucesso',
          excerpt: 'Guia do Sebrae com dicas práticas para empreender na área da saúde',
          content: 'Empreender na área da saúde requer planejamento e conhecimento específico. Este guia do Sebrae apresenta 5 dicas fundamentais para abrir um negócio de saúde de sucesso...',
          category: 'saude',
          author: 'Sebrae',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          readTime: '16 min',
          tags: ['negócio saúde', 'empreendedorismo', 'sebrae', 'dicas práticas'],
          views: 4250,
          engagement: 97,
          source: 'Sebrae',
          image: '/blog/negocio-saude-sucesso.jpg',
          url: 'https://sebrae.com.br/sites/PortalSebrae/sebraeaz/5-dicas-para-abrir-um-negocio-de-saude-de-sucesso,a258d1496e2db610VgnVCM1000004c00210aRCRD'
        },
        {
          id: 'saude_3',
          title: 'Como Atrair Pacientes para Clínica: Estratégias Eficazes',
          excerpt: 'Estratégias práticas para aumentar a captação de pacientes em clínicas',
          content: 'A captação de pacientes é um desafio constante para clínicas e consultórios. Este artigo apresenta estratégias eficazes e comprovadas para atrair mais pacientes de forma ética e sustentável...',
          category: 'saude',
          author: 'Telemedicina Morsch',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          readTime: '12 min',
          tags: ['atrair pacientes', 'clínica', 'estratégias', 'captação'],
          views: 3120,
          engagement: 93,
          source: 'Telemedicina Morsch',
          image: '/blog/atrair-pacientes-clinica.jpg',
          url: 'https://telemedicinamorsch.com.br/blog/como-atrair-pacientes-para-clinica?srsltid=AfmBOoqwfQFvvJmw9eFIPTdTddwseKaBOC7owKfJNZ4-y4UzoEtKn7_r'
        }
      ]
    }

    return realArticles[category] || []
  }

  // Validar artigos encontrados
  private validateArticles(articles: Article[], category: string): Article[] {
    return articles.filter(article => {
      // Verificar se tem título e conteúdo
      if (!article.title || !article.excerpt) return false
      
      // Verificar se é relevante para a categoria
      const titleLower = article.title.toLowerCase()
      const excerptLower = article.excerpt.toLowerCase()
      const keywords = this.categoryKeywords[category as keyof typeof this.categoryKeywords] || []
      
      const isRelevant = keywords.some((keyword: string) => 
        titleLower.includes(keyword.toLowerCase()) || 
        excerptLower.includes(keyword.toLowerCase())
      )
      
      return isRelevant
    })
  }

  // Calcular tempo de leitura
  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min`
  }

  // Extrair tags do conteúdo
  private extractTags(content: string): string[] {
    const commonTags = ['gestão', 'automação', 'tecnologia', 'vendas', 'marketing', 'digital']
    const contentLower = content.toLowerCase()
    
    return commonTags.filter(tag => contentLower.includes(tag))
  }

  // Validar URL e conteúdo
  private async validateUrlAndContent(url: string, category: string): Promise<{ valid: boolean; relevant: boolean }> {
    try {
      // Timeout de 5 segundos para validação
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(url, { 
        method: 'HEAD', 
        mode: 'no-cors',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      // Verificar se URL é relevante para a categoria
      const relevantDomains = {
        'restaurantes': ['ifood.com.br', 'ubereats.com', 'revistamenu.com.br', 'abrasel.com.br'],
        'barbearias': ['belezanaweb.com.br', 'salonline.com.br'],
        'petshops': ['petlove.com.br', 'petz.com.br'],
        'igrejas': ['igrejasemrede.com.br', 'cristianismo.com.br'],
        'gestao': ['sebrae.com.br', 'endeavor.org.br', 'startse.com', 'infomoney.com.br']
      }
      
      const categoryDomains = relevantDomains[category as keyof typeof relevantDomains] || []
      const isRelevant = categoryDomains.some(domain => url.includes(domain))
      
      return { valid: true, relevant: isRelevant }
    } catch (error) {
      console.warn(`URL inválida ou inacessível: ${url}`)
      return { valid: false, relevant: false }
    }
  }

  // Redirecionar para página da biblioteca ou link externo
  async redirectToArticle(category: string): Promise<void> {
    try {
      console.log(`🔍 Buscando artigos para: ${category}`)
      
      // Para educação, usar links externos diretos
      if (category === 'educacao') {
        const educationArticles = this.getBrazilianArticles(category)
        
        // Se há apenas um artigo ou queremos mostrar todos, redirecionar para biblioteca
        if (educationArticles.length > 1) {
          const fallbackData = encodeURIComponent(JSON.stringify({
            articles: educationArticles,
            category,
            source: 'Biblioteca Educação',
            totalCount: educationArticles.length,
            searchTime: 0
          }))
          window.location.href = `/blog/artigo/${category}-biblioteca?data=${fallbackData}`
          return
        }
      }
      
      const result = await this.searchArticlesByCategory(category)
      
      if (result.articles.length > 0) {
        console.log(`📚 ${result.totalCount} artigos encontrados`)
        
        // Validar URLs e conteúdo dos artigos
        const validatedArticles = await Promise.all(
          result.articles.map(async (article) => {
            if (article.url && article.url.startsWith('http')) {
              const validation = await this.validateUrlAndContent(article.url, category)
              return { 
                ...article, 
                urlValid: validation.valid,
                contentRelevant: validation.relevant
              }
            }
            return { ...article, urlValid: true, contentRelevant: true }
          })
        )
        
        // Filtrar apenas artigos com URLs válidas e conteúdo relevante
        const filteredArticles = validatedArticles.filter(article => 
          article.urlValid && article.contentRelevant
        )
        
        // SEMPRE usar fallback para garantir que os cards personalizados apareçam
        console.log('📚 Usando artigos personalizados da biblioteca')
        const fallbackArticles = this.getBrazilianArticles(category)
        const fallbackData = encodeURIComponent(JSON.stringify({
          articles: fallbackArticles,
          category,
          source: 'Biblioteca Vynlo',
          totalCount: fallbackArticles.length,
          searchTime: 0
        }))
        
        console.log('Redirecionando para:', `/blog/artigo/${category}-biblioteca?data=${fallbackData.substring(0, 100)}...`)
        window.location.href = `/blog/artigo/${category}-biblioteca?data=${fallbackData}`
        return
        
        const articleData = encodeURIComponent(JSON.stringify({
          articles: filteredArticles,
          category,
          source: result.source,
          totalCount: filteredArticles.length,
          searchTime: result.searchTime
        }))
        
        window.location.href = `/blog/artigo/${category}-biblioteca?data=${articleData}`
      } else {
        console.warn(`⚠️ Nenhum artigo encontrado para: ${category}`)
        const fallbackArticles = this.getBrazilianArticles(category)
        const fallbackData = encodeURIComponent(JSON.stringify({
          articles: fallbackArticles,
          category,
          source: 'Biblioteca Especializada',
          totalCount: fallbackArticles.length,
          searchTime: 0
        }))
        window.location.href = `/blog/artigo/${category}-biblioteca?data=${fallbackData}`
      }
    } catch (error) {
      console.error('❌ Erro ao buscar conteúdo:', error)
      window.location.href = `/blog?categoria=${category}`
    }
  }

  // Gerar slug amigável para URL
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim()
  }
}

export const articleService = new ArticleService()
export type { SearchResult, ArticleSource }
