import axios from 'axios'

// Tipos para Amazon Q
export interface AmazonQRequest {
  prompt: string
  context?: Record<string, any>
  maxTokens?: number
  temperature?: number
}

export interface AmazonQResponse {
  response: string
  confidence: number
  processingTime: number
  metadata?: Record<string, any>
}

export interface PredictiveAnalysisRequest {
  type: 'sales_prediction' | 'customer_behavior' | 'inventory_optimization'
  timeframe: string
  data: Record<string, any>
}

export interface FiscalSyncRequest {
  operation: 'sync_nfe' | 'validate_xml' | 'check_status'
  documents?: string[]
  period?: string
}

// Configuração do axios para Amazon Q
const amazonQClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Interceptor para adicionar token de autenticação
amazonQClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Serviço para análise preditiva usando Amazon Q
 */
export const runPredictiveAnalysis = async (request: PredictiveAnalysisRequest): Promise<AmazonQResponse> => {
  try {
    const prompt = generatePredictivePrompt(request)
    
    const response = await amazonQClient.post('/amazon-q/predictive-analysis', {
      prompt,
      context: request.data,
      maxTokens: 1000,
      temperature: 0.3
    })
    
    return response.data
  } catch (error) {
    throw new Error(`Erro na análise preditiva: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

/**
 * Serviço para sincronização fiscal usando Amazon Q
 */
export const syncWithSEFAZ = async (request: FiscalSyncRequest): Promise<AmazonQResponse> => {
  try {
    const prompt = generateFiscalPrompt(request)
    
    const response = await amazonQClient.post('/amazon-q/fiscal-sync', {
      prompt,
      context: request,
      maxTokens: 800,
      temperature: 0.1
    })
    
    return response.data
  } catch (error) {
    throw new Error(`Erro na sincronização fiscal: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

/**
 * Serviço genérico para consultas ao Amazon Q
 */
export const queryAmazonQ = async (request: AmazonQRequest): Promise<AmazonQResponse> => {
  try {
    const response = await amazonQClient.post('/amazon-q/query', request)
    return response.data
  } catch (error) {
    throw new Error(`Erro na consulta Amazon Q: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

/**
 * Análise de dados de vendas para insights de negócio
 */
export const analyzeSalesData = async (salesData: any[]): Promise<AmazonQResponse> => {
  try {
    const prompt = `
      Analise os seguintes dados de vendas do restaurante Vynlo Taste e forneça insights acionáveis:
      
      Dados: ${JSON.stringify(salesData, null, 2)}
      
      Por favor, forneça:
      1. Tendências identificadas
      2. Oportunidades de crescimento
      3. Recomendações específicas
      4. Previsões para os próximos 30 dias
      
      Responda em português brasileiro com foco em ações práticas.
    `
    
    return await queryAmazonQ({
      prompt,
      context: { salesData },
      maxTokens: 1200,
      temperature: 0.4
    })
  } catch (error) {
    throw new Error(`Erro na análise de vendas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

// Funções auxiliares para gerar prompts específicos
function generatePredictivePrompt(request: PredictiveAnalysisRequest): string {
  const basePrompt = `
    Como especialista em análise preditiva para restaurantes, analise os dados históricos do Vynlo Taste e forneça previsões precisas.
    
    Tipo de análise: ${request.type}
    Período: ${request.timeframe}
    Dados históricos: ${JSON.stringify(request.data, null, 2)}
  `
  
  switch (request.type) {
    case 'sales_prediction':
      return `${basePrompt}
        
        Forneça uma previsão detalhada de vendas incluindo:
        1. Valor total estimado para o período
        2. Número de pedidos esperados
        3. Ticket médio projetado
        4. Fatores que podem influenciar os resultados
        5. Recomendações para maximizar as vendas
        
        Responda em português brasileiro com dados numéricos específicos.`
        
    case 'customer_behavior':
      return `${basePrompt}
        
        Analise o comportamento dos clientes e forneça:
        1. Padrões de pedidos identificados
        2. Horários de maior demanda
        3. Preferências de produtos
        4. Taxa de retenção estimada
        5. Estratégias para aumentar o engajamento
        
        Responda em português brasileiro com insights acionáveis.`
        
    case 'inventory_optimization':
      return `${basePrompt}
        
        Otimize o estoque baseado nos padrões de vendas:
        1. Produtos com maior giro
        2. Itens com risco de desperdício
        3. Quantidades ideais para compra
        4. Cronograma de reposição sugerido
        5. Economia potencial com otimização
        
        Responda em português brasileiro com recomendações específicas.`
        
    default:
      return basePrompt
  }
}

function generateFiscalPrompt(request: FiscalSyncRequest): string {
  const basePrompt = `
    Como especialista em compliance fiscal brasileiro, processe a seguinte operação para o restaurante Vynlo Taste:
    
    Operação: ${request.operation}
  `
  
  switch (request.operation) {
    case 'sync_nfe':
      return `${basePrompt}
        Documentos: ${request.documents?.join(', ') || 'Todos os pendentes'}
        Período: ${request.period || 'Atual'}
        
        Execute a sincronização com SEFAZ e forneça:
        1. Status da sincronização
        2. Documentos processados com sucesso
        3. Erros encontrados e como corrigi-los
        4. Próximos passos necessários
        
        Responda em português brasileiro com detalhes técnicos precisos.`
        
    case 'validate_xml':
      return `${basePrompt}
        
        Valide os XMLs das notas fiscais e forneça:
        1. Estrutura dos documentos
        2. Campos obrigatórios verificados
        3. Inconsistências encontradas
        4. Recomendações para correção
        
        Responda em português brasileiro com foco na conformidade fiscal.`
        
    case 'check_status':
      return `${basePrompt}
        
        Verifique o status dos documentos fiscais e forneça:
        1. Situação atual no SEFAZ
        2. Documentos pendentes de processamento
        3. Alertas de vencimento
        4. Ações recomendadas
        
        Responda em português brasileiro com informações atualizadas.`
        
    default:
      return basePrompt
  }
}