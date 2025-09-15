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
  educacao: [
    {
      id: 'fallback_edu_1',
      title: 'Educação Inclusiva: Estratégias Pedagógicas para Promover a Equidade',
      excerpt: 'Estratégias pedagógicas para promover equidade e inclusão na educação',
      url: 'https://revistaeducacao.com.br/2024/03/15/educacao-inclusiva-estrategias-pedagogicas/',
      source: 'Revista Educação'
    },
    {
      id: 'fallback_edu_2',
      title: 'Práticas Pedagógicas na Educação Infantil: Estratégias Eficazes',
      excerpt: 'Estratégias eficazes para o desenvolvimento integral das crianças na educação infantil',
      url: 'https://rhemaneuroeducacao.com.br/blog/praticas-pedagogicas-na-educacao-infantil-estrategias-eficazes-para-o-desenvolvimento-integral-das-criancas/',
      source: 'Rhema Neuroeducação'
    },
    {
      id: 'fallback_edu_3',
      title: '3 Dicas para sua Rede de Ensino Chegar Cada Vez Mais Longe',
      excerpt: 'Dicas práticas para melhorar o desempenho e alcance das redes de ensino',
      url: 'https://fundacaolemann.org.br/noticias/3-dicas-para-a-sua-rede-de-ensino-chegar-cada-vez-mais-longe/?gad_source=1&gad_campaignid=22858382090&gbraid=0AAAAADotangsWvRQwN5OYMg33BcI4s7dU&gclid=Cj0KCQjw8p7GBhCjARIsAEhghZ2FK_Mw8HvuEENi7nVZYJqdsAuNh3DXTvXNCHkUjaLjPDGBdB3kC0caAvedEALw_wcB',
      source: 'Fundação Lemann'
    }
  ],
  servicos: [
    {
      id: 'fallback_serv_1',
      title: '4 Estratégias de Marketing para Alavancar seu Negócio',
      excerpt: 'Estratégias essenciais de marketing para consolidar e expandir seu negócio',
      url: 'https://liderjr.com/blog/4-estrategias-de-marketing-para-alavancar-seu-negocio/?gad_source=1&gad_campaignid=22403921657&gbraid=0AAAAADK0Y1lgWO1I0uGIbRUSEZ_Ni_pO6&gclid=Cj0KCQjw8p7GBhCjARIsAEhghZ1n5N-KzRvCKva_ybkgzlFgMp2r4WzTR6oRy3EGNj50jR9Z-r1N2n8aAvlUEALw_wcB',
      source: 'Líder Jr'
    },
    {
      id: 'fallback_serv_2',
      title: 'Como Fazer a Gestão Financeira do Pequeno Negócio',
      excerpt: 'Guia completo do Sebrae para gestão financeira eficiente de pequenos negócios',
      url: 'https://sebrae.com.br/sites/PortalSebrae/artigos/como-fazer-a-gestao-financeira-do-pequeno-negocio,d999a442d2e5a410VgnVCM1000003b74010aRCRD',
      source: 'Sebrae'
    },
    {
      id: 'fallback_serv_3',
      title: 'A Importância da Gestão Financeira Empresarial',
      excerpt: 'Fundamentos essenciais da gestão financeira para empresas de todos os portes',
      url: 'https://sebrae.com.br/sites/PortalSebrae/artigos/a-importancia-da-gestao-financeira-empresarial,624d36b750c32810VgnVCM100000d701210aRCRD',
      source: 'Sebrae'
    }
  ],
  saude: [
    {
      id: 'fallback_saude_1',
      title: 'A Importância do Marketing na Área da Saúde: Estratégias e Práticas Essenciais',
      excerpt: 'Estratégias de marketing essenciais para profissionais da saúde e clínicas',
      url: 'https://blog.plenitudeeducacao.com.br/a-importancia-do-marketing-na-area-da-saude-estrategias-e-praticas-essenciais/',
      source: 'Plenitude Educação'
    },
    {
      id: 'fallback_saude_2',
      title: '5 Dicas para Abrir um Negócio de Saúde de Sucesso',
      excerpt: 'Guia do Sebrae com dicas práticas para empreender na área da saúde',
      url: 'https://sebrae.com.br/sites/PortalSebrae/sebraeaz/5-dicas-para-abrir-um-negocio-de-saude-de-sucesso,a258d1496e2db610VgnVCM1000004c00210aRCRD',
      source: 'Sebrae'
    },
    {
      id: 'fallback_saude_3',
      title: 'Como Atrair Pacientes para Clínica: Estratégias Eficazes',
      excerpt: 'Estratégias práticas para aumentar a captação de pacientes em clínicas',
      url: 'https://telemedicinamorsch.com.br/blog/como-atrair-pacientes-para-clinica?srsltid=AfmBOoqwfQFvvJmw9eFIPTdTddwseKaBOC7owKfJNZ4-y4UzoEtKn7_r',
      source: 'Telemedicina Morsch'
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
  educacao: [
    'educação inclusiva', 'práticas pedagógicas', 'educação infantil',
    'estratégias pedagógicas', 'desenvolvimento infantil', 'redes de ensino',
    'gestão educacional', 'equidade educação', 'metodologias ensino'
  ],
  servicos: [
    'estratégias marketing', 'gestão financeira', 'pequeno negócio',
    'marketing empresarial', 'gestão empresarial', 'negócios serviços',
    'consultoria empresarial', 'prestação serviços', 'empreendedorismo'
  ],
  saude: [
    'marketing saúde', 'gestão clínica', 'negócio saúde',
    'atrair pacientes', 'marketing médico', 'clínica consulta',
    'telemedicina', 'gestão hospitalar', 'saúde digital'
  ],
  gestao: [
    'gestão empresarial', 'automação processos', 'sistema gestão',
    'produtividade', 'eficiência', 'otimização', 'processos',
    'gestão financeira', 'controle estoque', 'relatórios'
  ]
}
