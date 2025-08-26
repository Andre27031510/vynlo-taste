'use client'

import { useState, useEffect } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext'
import { 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Building, 
  User, 
  QrCode, 
  Calculator,
  X,
  Edit,
  Trash2,
  Send,
  RefreshCw,
  Settings,
  Database,
  Cloud,
  Shield,
  Zap,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Info,
  AlertTriangle,
  Check,
  Save,
  Upload,
  Printer,
  Mail,
  Smartphone,
  Monitor,
  Globe,
  Wifi,
  CreditCard,
  DollarSign,
  Receipt,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Equal,
  Lightbulb,
  Users,
  Banknote,
  PieChart,
  LineChart,
  RotateCcw,
  Bell,
  MapPin,
  Play
} from 'lucide-react'

// Tipos para Nota Fiscal Eletrônica
type FiscalStatus = 'pending' | 'issued' | 'approved' | 'cancelled' | 'error' | 'processing' | 'rejected' | 'contingency'
type DocumentType = 'cpf' | 'cnpj'
type NoteType = 'nfe' | 'nfce' | 'nfse'
type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'transfer' | 'boleto'

// Interfaces para integração com vendas
interface Sale {
  id: string
  orderId: string
  customerName: string
  customerDocument: string
  documentType: DocumentType
  total: number
  items: Array<{
    id: string
    name: string
    description: string
    quantity: number
    unitPrice: number
    ncm: string
    cfop: string
  }>
  saleDate: Date
  status: 'confirmed' | 'pending' | 'cancelled'
  paymentMethod: string
  seller: string
}

// Interface para Nota Fiscal completa
interface FiscalNote {
  id: string
  noteNumber: string
  accessKey: string
  orderId: string
  customerName: string
  documentType: DocumentType
  document: string
  companyName?: string
  email?: string
  phone?: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  total: number
  subtotal: number
  taxAmount: number
  discountAmount: number
  amountReceived: number
  change: number
  status: FiscalStatus
  noteType: NoteType
  issuedAt?: Date
  createdAt: Date
  expiresAt?: Date
  qrCode: string
  barCode: string
  protocolNumber?: string
  rejectionReason?: string
  contingencyReason?: string
  items: {
    id: string
    name: string
    description?: string
    quantity: number
    unitPrice: number
    total: number
    ncm: string
    cfop: string
    icms: number
    pis: number
    cofins: number
  }[]
  paymentMethods: {
    method: PaymentMethod
    amount: number
    installments?: number
  }[]
  sefazResponse?: {
    status: string
    message: string
    timestamp: Date
    protocol: string
  }
}

// Interface para configurações da SEFAZ
interface SefazConfig {
  environment: 'production' | 'homologation'
  certificate: string
  certificatePassword: string
  company: {
    cnpj: string
    inscricaoEstadual: string
    razaoSocial: string
    nomeFantasia: string
    endereco: {
      logradouro: string
      numero: string
      complemento?: string
      bairro: string
      municipio: string
      uf: string
      cep: string
    }
  }
  webservices: {
    nfe: string
    nfce: string
    nfse: string
  }
}

export default function FiscalManagement() {
  const { currentTheme } = useThemeContext()
  // Estados para modais
  const [showNewNoteModal, setShowNewNoteModal] = useState(false)
  const [showEditNoteModal, setShowEditNoteModal] = useState(false)
  const [showNoteDetailsModal, setShowNoteDetailsModal] = useState(false)
  const [showSefazConfigModal, setShowSefazConfigModal] = useState(false)
  const [showBatchEmissionModal, setShowBatchEmissionModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showContingencyModal, setShowContingencyModal] = useState(false)
  const [showSalesIntegrationModal, setShowSalesIntegrationModal] = useState(false)
  
  // Estados para dados
  const [fiscalNotes, setFiscalNotes] = useState<FiscalNote[]>([])
  const [pendingSales, setPendingSales] = useState<Sale[]>([])
  const [selectedNote, setSelectedNote] = useState<FiscalNote | null>(null)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  
  // Estados de filtros e busca
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<FiscalStatus | 'all'>('all')
  const [documentFilter, setDocumentFilter] = useState<DocumentType | 'all'>('all')
  const [noteTypeFilter, setNoteTypeFilter] = useState<NoteType | 'all'>('all')
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' })
  
  // Estados de operação
  const [loading, setLoading] = useState(false)
  const [emitting, setEmitting] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Estados de configuração
  const [sefazConfig, setSefazConfig] = useState<SefazConfig | null>(null)
  const [sefazStatus, setSefazStatus] = useState({
    connected: false,
    lastCheck: new Date(),
    environment: 'homologation' as 'production' | 'homologation',
    certificateValid: false,
    webservicesStatus: {
      nfe: 'unknown' as 'online' | 'offline' | 'error' | 'checking' | 'unknown',
      nfce: 'unknown' as 'online' | 'offline' | 'error' | 'checking' | 'unknown',
      nfse: 'unknown' as 'online' | 'offline' | 'error' | 'checking' | 'unknown'
    }
  })
  
  // Estado para nova nota
  const [newNote, setNewNote] = useState({
    orderId: '',
    customerName: '',
    documentType: 'cpf' as DocumentType,
    document: '',
    companyName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    amountReceived: 0,
    items: [{ 
      id: '', 
      name: '', 
      description: '', 
      quantity: 1, 
      unitPrice: 0, 
      ncm: '', 
      cfop: '5102' 
    }],
    paymentMethods: [{ method: 'pix' as PaymentMethod, amount: 0 }]
  })

  // Carregar dados iniciais
  useEffect(() => {
    loadFiscalNotes()
    loadSefazConfig()
    checkSefazStatus()
    loadPendingSales() // Carregar vendas pendentes
  }, [])

  // Limpar mensagens após 5 segundos
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('')
        setErrorMessage('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, errorMessage])

  // Funções principais
  const loadFiscalNotes = async () => {
    setLoading(true)
    try {
      // Simular carregamento de notas fiscais
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dados simulados de notas fiscais reais
      const mockNotes: FiscalNote[] = [
        {
          id: 'NF001',
          noteNumber: '000001',
          accessKey: '12345678901234567890123456789012345678901234',
          orderId: '#1234',
          customerName: 'João Silva',
          documentType: 'cpf',
          document: '123.456.789-00',
          email: 'joao.silva@email.com',
          phone: '(11) 99999-9999',
          address: {
            street: 'Rua das Flores',
            number: '123',
            complement: 'Apto 45',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567'
          },
          total: 45.90,
          subtotal: 43.71,
          taxAmount: 2.19,
          discountAmount: 0,
          amountReceived: 50.00,
          change: 4.10,
          status: 'issued',
          noteType: 'nfce',
          issuedAt: new Date(Date.now() - 300000),
          createdAt: new Date(Date.now() - 600000),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          qrCode: '{"noteId":"NF001","total":45.9,"timestamp":"2024-01-15T10:30:00.000Z","hash":"bm90YTAwMQ"}',
          barCode: '12345678901234567890123456789012345678901234',
          protocolNumber: '123456789012345',
          items: [
            {
              id: '1',
              name: 'Pizza Margherita',
              description: 'Pizza tradicional com molho de tomate, mussarela e manjericão',
              quantity: 1,
              unitPrice: 35.90,
              total: 35.90,
              ncm: '2106.90.90',
              cfop: '5102',
              icms: 1.80,
              pis: 0.23,
              cofins: 1.06
            },
            {
              id: '2',
              name: 'Refrigerante Cola',
              description: 'Refrigerante cola 350ml',
              quantity: 1,
              unitPrice: 8.00,
              total: 8.00,
              ncm: '2202.10.00',
              cfop: '5102',
              icms: 0.40,
              pis: 0.00,
              cofins: 0.00
            }
          ],
          paymentMethods: [
            {
              method: 'credit_card',
              amount: 45.90,
              installments: 1
            }
          ],
          sefazResponse: {
            status: 'approved',
            message: 'Nota fiscal autorizada com sucesso',
            timestamp: new Date(Date.now() - 300000),
            protocol: '123456789012345'
          }
        },
        {
          id: 'NF002',
          noteNumber: '000002',
          accessKey: '12345678901234567890123456789012345678901235',
          orderId: '#1235',
          customerName: 'Empresa ABC Ltda',
          documentType: 'cnpj',
          document: '12.345.678/0001-90',
          companyName: 'Empresa ABC Ltda',
          email: 'contato@empresaabc.com.br',
          phone: '(11) 3333-3333',
          address: {
            street: 'Avenida Paulista',
            number: '1000',
            complement: 'Sala 200',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01310-100'
          },
          total: 125.50,
          subtotal: 119.52,
          taxAmount: 5.98,
          discountAmount: 0,
          amountReceived: 130.00,
          change: 4.50,
          status: 'pending',
          noteType: 'nfe',
          createdAt: new Date(Date.now() - 180000),
          qrCode: '{"noteId":"NF002","total":125.5,"timestamp":"2024-01-15T10:00:00.000Z","hash":"bm90YTAwMg"}',
          barCode: '12345678901234567890123456789012345678901235',
          items: [
            {
              id: '2',
              name: 'Serviço de Consultoria',
              description: 'Consultoria em gestão empresarial',
              quantity: 1,
              unitPrice: 125.50,
              total: 125.50,
              ncm: '98.20.00',
              cfop: '6101',
              icms: 0.00,
              pis: 0.82,
              cofins: 3.78
            }
          ],
          paymentMethods: [
            {
              method: 'pix',
              amount: 125.50
            }
          ]
        }
      ]
      
      setFiscalNotes(mockNotes)
    } catch (error) {
      setErrorMessage('Erro ao carregar notas fiscais')
    } finally {
      setLoading(false)
    }
  }

  const loadSefazConfig = async () => {
    try {
      // Simular carregamento de configuração da SEFAZ
      const mockConfig: SefazConfig = {
        environment: 'homologation',
        certificate: 'certificado.p12',
        certificatePassword: '******',
        company: {
          cnpj: '12.345.678/0001-90',
          inscricaoEstadual: '123456789',
          razaoSocial: 'Vynlo Taste Ltda',
          nomeFantasia: 'Vynlo Taste',
          endereco: {
            logradouro: 'Rua das Delícias',
            numero: '500',
            complemento: 'Loja 1',
            bairro: 'Centro Gastronômico',
            municipio: 'São Paulo',
            uf: 'SP',
            cep: '01234-567'
          }
        },
        webservices: {
          nfe: 'https://nfe-homologacao.sefaz.sp.gov.br/ws/nfeautorizacao4.asmx',
          nfce: 'https://nfce-homologacao.sefaz.sp.gov.br/ws/nfeautorizacao4.asmx',
          nfse: 'https://nfse-homologacao.prefeitura.sp.gov.br/ws/nfse.asmx'
        }
      }
      
      setSefazConfig(mockConfig)
    } catch (error) {
      setErrorMessage('Erro ao carregar configuração da SEFAZ')
    }
  }

  const checkSefazStatus = async () => {
    try {
      // Simular verificação real da SEFAZ
      setSefazStatus(prev => ({ ...prev, connected: false, certificateValid: false }))
      
      // Verificar certificado digital
      if (!sefazConfig?.certificate || !sefazConfig?.certificatePassword) {
        setSefazStatus(prev => ({
          ...prev,
          connected: false,
          certificateValid: false,
          webservicesStatus: {
            nfe: 'error',
            nfce: 'error',
            nfse: 'error'
          }
        }))
        setErrorMessage('Certificado digital não configurado')
        return
      }

      // Simular verificação de conectividade com webservices
              const webservicesStatus: {
          nfe: 'error' | 'offline' | 'online' | 'unknown' | 'checking';
          nfce: 'error' | 'offline' | 'online' | 'unknown' | 'checking';
          nfse: 'error' | 'offline' | 'online' | 'unknown' | 'checking';
        } = {
          nfe: 'checking',
          nfce: 'checking',
          nfse: 'checking'
        }
      
      setSefazStatus(prev => ({
        ...prev,
        webservicesStatus
      }))

      // Simular teste de conectividade com NFe
      await new Promise(resolve => setTimeout(resolve, 1000))
      webservicesStatus.nfe = 'online'
      
      // Simular teste de conectividade com NFCe
      await new Promise(resolve => setTimeout(resolve, 800))
      webservicesStatus.nfce = 'online'
      
      // Simular teste de conectividade com NFSe
      await new Promise(resolve => setTimeout(resolve, 1200))
      webservicesStatus.nfse = 'online'

      // Verificar validade do certificado
      const certificateValid = sefazConfig.certificatePassword.length > 0
      
      // Verificar se todos os webservices estão funcionando
      const allWebservicesOnline = Object.values(webservicesStatus).every(status => status === 'online')
      
      setSefazStatus({
        connected: allWebservicesOnline && certificateValid,
        lastCheck: new Date(),
        environment: sefazConfig?.environment || 'homologation',
        certificateValid,
        webservicesStatus
      })

      if (allWebservicesOnline && certificateValid) {
        setSuccessMessage('Conexão com SEFAZ estabelecida com sucesso!')
      } else {
        setErrorMessage('Problemas na conexão com SEFAZ detectados')
      }
      
    } catch (error) {
      setSefazStatus(prev => ({
        ...prev,
        connected: false,
        certificateValid: false,
        webservicesStatus: {
          nfe: 'error',
          nfce: 'error',
          nfse: 'error'
        }
      }))
      setErrorMessage('Erro ao verificar status da SEFAZ')
    }
  }

  // Funções de validação
  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '')
    if (cleanCPF.length !== 11) return false
    
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false
    
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    let remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false
    
    return true
  }

  const validateCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/\D/g, '')
    if (cleanCNPJ.length !== 14) return false
    
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false
    
    let sum = 0
    let weight = 2
    
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight
      weight = weight === 9 ? 2 : weight + 1
    }
    
    let remainder = sum % 11
    if (remainder < 2) remainder = 0
    else remainder = 11 - remainder
    
    if (remainder !== parseInt(cleanCNPJ.charAt(12))) return false
    
    sum = 0
    weight = 2
    
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight
      weight = weight === 9 ? 2 : weight + 1
    }
    
    remainder = sum % 11
    if (remainder < 2) remainder = 0
    else remainder = 11 - remainder
    
    if (remainder !== parseInt(cleanCNPJ.charAt(13))) return false
    
    return true
  }

  // Funções de emissão de nota fiscal
  const emitFiscalNote = async (note: Partial<FiscalNote>) => {
    setEmitting(true)
    try {
      // Simular emissão real para a SEFAZ
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Gerar dados da nota fiscal
      const noteNumber = (fiscalNotes.length + 1).toString().padStart(6, '0')
      const accessKey = generateAccessKey()
      const protocolNumber = generateProtocolNumber()
      
      const newFiscalNote: FiscalNote = {
        id: `NF${noteNumber}`,
        noteNumber,
        accessKey,
        orderId: note.orderId || `#${Date.now()}`,
        customerName: note.customerName || '',
        documentType: note.documentType || 'cpf',
        document: note.document || '',
        companyName: note.companyName,
        email: note.email,
        phone: note.phone,
        address: note.address || {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        },
        total: note.total || 0,
        subtotal: (note.total || 0) * 0.95,
        taxAmount: (note.total || 0) * 0.05,
        discountAmount: 0,
        amountReceived: note.amountReceived || 0,
        change: (note.amountReceived || 0) - (note.total || 0),
        status: 'issued',
        noteType: 'nfce',
        issuedAt: new Date(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        qrCode: generateQRCode(noteNumber, note.total || 0),
        barCode: accessKey,
        protocolNumber,
        items: note.items || [],
        paymentMethods: note.paymentMethods || [],
        sefazResponse: {
          status: 'AUTORIZADA',
          message: 'Nota fiscal autorizada com sucesso',
          timestamp: new Date(),
          protocol: protocolNumber
        }
      }
      
      setFiscalNotes(prev => [newFiscalNote, ...prev])
      setSuccessMessage('Nota fiscal emitida com sucesso!')
      setShowNewNoteModal(false)
      setNewNote({
        orderId: '',
        customerName: '',
        documentType: 'cpf',
        document: '',
        companyName: '',
        email: '',
        phone: '',
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        },
        amountReceived: 0,
        items: [{ 
          id: '', 
          name: '', 
          description: '', 
          quantity: 1, 
          unitPrice: 0, 
          ncm: '', 
          cfop: '5102' 
        }],
        paymentMethods: [{ method: 'pix', amount: 0 }]
      })
    } catch (error) {
      setErrorMessage('Erro ao emitir nota fiscal')
    } finally {
      setEmitting(false)
    }
  }

  const generateAccessKey = (): string => {
    return Array.from({ length: 44 }, () => Math.floor(Math.random() * 10)).join('')
  }

  const generateProtocolNumber = (): string => {
    return Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('')
  }

  const generateQRCode = (noteNumber: string, total: number): string => {
    return JSON.stringify({
      noteId: noteNumber,
      total: total,
      timestamp: new Date().toISOString(),
      hash: btoa(noteNumber)
    })
  }

  // Funções de cancelamento
  const cancelFiscalNote = async (noteId: string, reason: string) => {
    setCancelling(true)
    try {
      // Simular cancelamento na SEFAZ
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setFiscalNotes(prev => prev.map(note => 
        note.id === noteId 
          ? { ...note, status: 'cancelled' as FiscalStatus }
          : note
      ))
      
      setSuccessMessage('Nota fiscal cancelada com sucesso!')
      setShowCancelModal(false)
      setSelectedNote(null)
    } catch (error) {
      setErrorMessage('Erro ao cancelar nota fiscal')
    } finally {
      setCancelling(false)
    }
  }

  // Funções de contingência
  const enableContingency = async (noteId: string, reason: string) => {
    try {
      // Simular ativação de contingência
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setFiscalNotes(prev => prev.map(note => 
        note.id === noteId 
          ? { 
              ...note, 
              status: 'contingency' as FiscalStatus,
              contingencyReason: reason
            }
          : note
      ))
      
      setSuccessMessage('Modo de contingência ativado com sucesso!')
      setShowContingencyModal(false)
      setSelectedNote(null)
    } catch (error) {
      setErrorMessage('Erro ao ativar modo de contingência')
    }
  }

  // Funções de relatórios
  const generateReport = async (type: 'daily' | 'weekly' | 'monthly' | 'custom') => {
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const reportData = {
        type,
        generatedAt: new Date(),
        totalNotes: fiscalNotes.length,
        totalAmount: fiscalNotes.reduce((sum, note) => sum + note.total, 0),
        notesByStatus: {
          issued: fiscalNotes.filter(note => note.status === 'issued' || note.status === 'approved').length,
          pending: fiscalNotes.filter(note => note.status === 'pending').length,
          cancelled: fiscalNotes.filter(note => note.status === 'cancelled').length,
          error: fiscalNotes.filter(note => note.status === 'error').length
        }
      }
      
      setSuccessMessage('Relatório gerado com sucesso!')
      console.log('Relatório gerado:', reportData)
    } catch (error) {
      setErrorMessage('Erro ao gerar relatório')
    }
  }

  // Funções de exportação
  const exportToPDF = async (note: FiscalNote) => {
    try {
      // Simular exportação para PDF
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccessMessage('Nota fiscal exportada para PDF com sucesso!')
    } catch (error) {
      setErrorMessage('Erro ao exportar para PDF')
    }
  }

  const exportToXML = async (note: FiscalNote) => {
    try {
      // Simular exportação para XML
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Nota fiscal exportada para XML com sucesso!')
    } catch (error) {
      setErrorMessage('Erro ao exportar para XML')
    }
  }

  // Funções de envio
  const sendByEmail = async (note: FiscalNote, email: string) => {
    try {
      // Simular envio por email
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccessMessage('Nota fiscal enviada por email com sucesso!')
    } catch (error) {
      setErrorMessage('Erro ao enviar por email')
    }
  }

  const sendByWhatsApp = async (note: FiscalNote, phone: string) => {
    try {
      // Simular envio por WhatsApp
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccessMessage('Nota fiscal enviada por WhatsApp com sucesso!')
    } catch (error) {
      setErrorMessage('Erro ao enviar por WhatsApp')
    }
  }

  // Funções de impressão
  const printFiscalNote = async (note: FiscalNote) => {
    try {
      // Simular impressão
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Nota fiscal enviada para impressão!')
    } catch (error) {
      setErrorMessage('Erro ao imprimir nota fiscal')
    }
  }

  // Funções de filtros
  const filteredNotes = fiscalNotes.filter(note => {
    const matchesSearch = note.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.noteNumber.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || note.status === statusFilter
    const matchesDocument = documentFilter === 'all' || note.documentType === documentFilter
    const matchesType = noteTypeFilter === 'all' || note.noteType === noteTypeFilter
    
    return matchesSearch && matchesStatus && matchesDocument && matchesType
  })

  // Funções de adição de itens
  const addItem = () => {
    setNewNote(prev => ({
      ...prev,
      items: [...prev.items, { 
        id: '', 
        name: '', 
        description: '', 
        quantity: 1, 
        unitPrice: 0, 
        ncm: '', 
        cfop: '5102' 
      }]
    }))
  }

  const removeItem = (index: number) => {
    setNewNote(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateItem = (index: number, field: string, value: any) => {
    setNewNote(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  // Funções de validação de formulário
  const validateForm = (): boolean => {
    if (!newNote.customerName.trim()) return false
    if (!newNote.document.trim()) return false
    if (newNote.documentType === 'cpf' && !validateCPF(newNote.document)) return false
    if (newNote.documentType === 'cnpj' && !validateCNPJ(newNote.document)) return false
    if (newNote.items.length === 0) return false
    if (newNote.items.some(item => !item.name.trim() || item.unitPrice <= 0)) return false
    
    return true
  }

  // Funções de cálculo
  const calculateTotal = () => {
    const subtotal = newNote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const taxAmount = subtotal * 0.05
    return subtotal + taxAmount
  }

  const calculateChange = () => {
    return newNote.amountReceived - calculateTotal()
  }

  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    issued: { label: 'Emitida', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    approved: { label: 'Aprovada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: AlertCircle },
    error: { label: 'Erro', color: 'bg-red-100 text-red-800', icon: AlertCircle },
    processing: { label: 'Processando', color: 'bg-blue-100 text-blue-800', icon: Zap },
    rejected: { label: 'Rejeitada', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
    contingency: { label: 'Contingência', color: 'bg-purple-100 text-purple-800', icon: Shield }
  }

  const documentTypeConfig = {
    cpf: { label: 'CPF', color: 'bg-blue-100 text-blue-800', icon: User },
    cnpj: { label: 'CNPJ', color: 'bg-purple-100 text-purple-800', icon: Building }
  }

  const noteTypeConfig = {
    nfe: { label: 'NFe', color: 'bg-green-100 text-green-800', icon: FileText },
    nfce: { label: 'NFCe', color: 'bg-yellow-100 text-yellow-800', icon: QrCode },
    nfse: { label: 'NFSe', color: 'bg-blue-100 text-blue-800', icon: Receipt }
  }

  const paymentMethodConfig = {
    credit_card: { label: 'Cartão de Crédito', icon: CreditCard },
    debit_card: { label: 'Cartão de Débito', icon: DollarSign },
    pix: { label: 'Pix', icon: Zap },
    cash: { label: 'Dinheiro', icon: Wallet },
    transfer: { label: 'Transferência', icon: Banknote },
    boleto: { label: 'Boleto', icon: PiggyBank }
  }

  const handleCreateNote = () => {
    // Validação dos dados
    if (!newNote.orderId.trim()) {
      alert('Pedido é obrigatório');
      return;
    }
    if (!newNote.customerName.trim()) {
      alert('Nome/Razão Social é obrigatório');
      return;
    }
    if (!newNote.document.trim()) {
      alert('Documento é obrigatório');
      return;
    }

    // Validar CPF/CNPJ
    let isValid = false;
    if (newNote.documentType === 'cpf') {
      isValid = validateCPF(newNote.document);
      if (!isValid) {
        alert('CPF inválido');
        return;
      }
    } else {
      isValid = validateCNPJ(newNote.document);
      if (!isValid) {
        alert('CNPJ inválido');
        return;
      }
    }

    const total = newNote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const change = calculateChange();
    const qrCode = generateQRCode(`NF${String(fiscalNotes.length + 1).padStart(3, '0')}`, total);

    const note: FiscalNote = {
      id: `NF${String(fiscalNotes.length + 1).padStart(3, '0')}`,
      noteNumber: `NF${String(fiscalNotes.length + 1).padStart(3, '0')}`,
      accessKey: generateAccessKey(),
      orderId: newNote.orderId,
      customerName: newNote.customerName,
      documentType: newNote.documentType,
      document: newNote.document,
      companyName: newNote.companyName,
      email: newNote.email,
      phone: newNote.phone,
      address: newNote.address,
      total,
      subtotal: total * 0.95,
      taxAmount: total * 0.05,
      discountAmount: 0,
      amountReceived: newNote.amountReceived,
      change,
      status: 'issued',
      noteType: 'nfce',
      createdAt: new Date(),
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      qrCode,
      barCode: generateAccessKey(),
      items: newNote.items.map(item => ({
        ...item,
        total: item.quantity * item.unitPrice,
        icms: 0,
        pis: 0,
        cofins: 0
      })),
      paymentMethods: newNote.paymentMethods.map(pm => ({
        ...pm,
        amount: pm.amount
      }))
    }
    
    emitFiscalNote(note)
  }

  const openSefazConfigWindow = () => {
    const width = 1400
    const height = 900
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2
    
    const configWindow = window.open(
      '/sefaz-config',
      'sefazConfig',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no`
    )
    
    if (configWindow) {
      // Focar na nova janela
      configWindow.focus()
      
      // Se a janela for fechada, atualizar o status
      configWindow.onbeforeunload = () => {
        // Aqui você pode adicionar lógica para verificar se as configurações foram salvas
        console.log('Janela de configuração fechada')
      }
    } else {
      // Fallback se popup for bloqueado
      setErrorMessage('Popup bloqueado pelo navegador. Permita popups para este site.')
    }
  }

  // Carregar vendas pendentes para emissão de notas
  const loadPendingSales = async () => {
    try {
      // Simular carregamento de vendas confirmadas que ainda não têm nota fiscal
      const sales: Sale[] = [
        {
          id: 'sale-001',
          orderId: '#1234',
          customerName: 'João Silva',
          customerDocument: '123.456.789-00',
          documentType: 'cpf',
          total: 45.90,
          items: [
            {
              id: 'item-001',
              name: 'Hambúrguer Artesanal',
              description: 'Hambúrguer de carne bovina com queijo e salada',
              quantity: 1,
              unitPrice: 25.90,
              ncm: '1602.32.00',
              cfop: '5102'
            },
            {
              id: 'item-002',
              name: 'Batata Frita',
              description: 'Porção de batatas fritas crocantes',
              quantity: 1,
              unitPrice: 20.00,
              ncm: '2004.10.00',
              cfop: '5102'
            }
          ],
          saleDate: new Date(Date.now() - 3600000), // 1 hora atrás
          status: 'confirmed',
          paymentMethod: 'PIX',
          seller: 'Maria Santos'
        },
        {
          id: 'sale-002',
          orderId: '#1235',
          customerName: 'Empresa ABC Ltda',
          customerDocument: '12.345.678/0001-90',
          documentType: 'cnpj',
          total: 125.50,
          items: [
            {
              id: 'item-003',
              name: 'Combo Executivo',
              description: 'Hambúrguer + Batata + Refrigerante',
              quantity: 2,
              unitPrice: 62.75,
              ncm: '1602.32.00',
              cfop: '5102'
            }
          ],
          saleDate: new Date(Date.now() - 7200000), // 2 horas atrás
          status: 'confirmed',
          paymentMethod: 'Cartão de Crédito',
          seller: 'Carlos Oliveira'
        }
      ]
      
      setPendingSales(sales)
    } catch (error) {
      console.error('Erro ao carregar vendas:', error)
    }
  }

  // Criar nota fiscal a partir de uma venda
  const createNoteFromSale = async (sale: Sale) => {
    try {
      // Simular criação da nota
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newNote: FiscalNote = {
        id: `nf-${Date.now()}`,
        noteNumber: `00000${fiscalNotes.length + 1}`,
        accessKey: generateAccessKey(),
        orderId: sale.orderId,
        customerName: sale.customerName,
        documentType: sale.documentType,
        total: sale.total,
        items: sale.items.map(item => ({
          ...item,
          total: item.quantity * item.unitPrice,
          icms: 0,
          pis: 0,
          cofins: 0
        })),
        amountReceived: sale.total,
        change: 0,
        status: 'pending',
        noteType: sale.documentType === 'cnpj' ? 'nfe' : 'nfce',
        issuedAt: new Date(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        qrCode: generateQRCode(`NF${String(fiscalNotes.length + 1).padStart(3, '0')}`, sale.total),
        barCode: generateAccessKey(),
        document: sale.customerDocument,
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        },
        subtotal: sale.total * 0.95,
        taxAmount: sale.total * 0.05,
        discountAmount: 0,
        paymentMethods: [{
          method: 'pix' as PaymentMethod,
          amount: sale.total
        }]
      }
      
      // Adicionar à lista de notas fiscais
      setFiscalNotes(prev => [newNote, ...prev])
      
      // Remover da lista de vendas pendentes
      setPendingSales(prev => prev.filter(s => s.id !== sale.id))
      
      setSuccessMessage('Nota fiscal criada com sucesso a partir da venda!')
      setShowSalesIntegrationModal(false)
    } catch (error) {
      setErrorMessage('Erro ao criar nota fiscal da venda')
    }
  }

  // Integração automática: venda confirmada → nota fiscal pendente
  const integrateSaleToFiscal = async (sale: Sale) => {
    try {
      // Verificar se já existe nota para esta venda
      const existingNote = fiscalNotes.find(note => note.orderId === sale.orderId)
      if (existingNote) {
        setErrorMessage('Já existe nota fiscal para esta venda')
        return
      }
      
      // Criar nota automaticamente
      await createNoteFromSale(sale)
    } catch (error) {
      setErrorMessage('Erro na integração automática')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com Status da SEFAZ */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-manrope font-bold text-gray-900">Gestão Fiscal</h1>
              <p className="text-gray-600 font-manrope">Emissão e gestão de notas fiscais eletrônicas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Status da SEFAZ */}
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className={`w-3 h-3 rounded-full ${
                sefazStatus.connected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                SEFAZ {sefazStatus.connected ? 'Conectado' : 'Desconectado'}
              </span>
              <span className="text-xs text-gray-500">
                {sefazStatus.environment === 'homologation' ? 'Homologação' : 'Produção'}
              </span>
            </div>
            
            {/* Status dos WebServices */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                sefazStatus.webservicesStatus.nfe === 'online' ? 'bg-green-500' : 
                sefazStatus.webservicesStatus.nfe === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
              }`} title="NFe"></div>
              <div className={`w-2 h-2 rounded-full ${
                sefazStatus.webservicesStatus.nfce === 'online' ? 'bg-green-500' : 
                sefazStatus.webservicesStatus.nfce === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
              }`} title="NFCe"></div>
              <div className={`w-2 h-2 rounded-full ${
                sefazStatus.webservicesStatus.nfse === 'online' ? 'bg-green-500' : 
                sefazStatus.webservicesStatus.nfse === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
              }`} title="NFSe"></div>
            </div>
            
            <button
              onClick={openSefazConfigWindow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Configurar</span>
            </button>
          </div>
        </div>
        
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-manrope font-medium">+15.3%</span>
            </div>
            <h3 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>{fiscalNotes.length}</h3>
            <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope text-sm`}>Notas Emitidas</p>
          </div>

          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 text-sm font-manrope font-medium">+8.2%</span>
            </div>
            <h3 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>
              {fiscalNotes.filter(note => note.status === 'issued').length}
            </h3>
            <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope text-sm`}>Aprovadas</p>
          </div>

          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-yellow-600 text-sm font-manrope font-medium">+12.5%</span>
            </div>
            <h3 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>
              {fiscalNotes.filter(note => note.status === 'pending').length}
            </h3>
            <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope text-sm`}>Pendentes</p>
          </div>

          <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-red-600 text-sm font-manrope font-medium">-2.1%</span>
            </div>
            <h3 className={`text-2xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>
              {fiscalNotes.filter(note => note.status === 'error' || note.status === 'rejected').length}
            </h3>
            <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-manrope text-sm`}>Com Erro</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Status das Notas Fiscais</h3>
            <button className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
              <Download className="w-5 h-5" />
            </button>
          </div>
          
          <div className={`h-64 rounded-xl p-4 flex items-end justify-between ${
            currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-t from-blue-50 to-transparent'
          }`}>
            {[65, 45, 78, 52, 89, 67, 94].map((height, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="flex flex-col space-y-1">
                  <div 
                    className="w-8 bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                    style={{ height: `${height}px` }}
                  ></div>
                  <div 
                    className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                    style={{ height: `${height * 0.6}px` }}
                  ></div>
                </div>
                <span className={`text-xs font-manrope ${
                  currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index]}
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className={`text-sm font-manrope ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Emitidas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className={`text-sm font-manrope ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Pendentes</span>
            </div>
          </div>
        </div>

        {/* Type Distribution */}
        <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-manrope font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Distribuição por Tipo</h3>
            <button className={`${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
              <Filter className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { type: 'NFe', count: 45, percentage: 60, color: 'bg-green-500' },
              { type: 'NFCe', count: 25, percentage: 33, color: 'bg-blue-500' },
              { type: 'NFSe', count: 5, percentage: 7, color: 'bg-purple-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
                  <span className={`font-manrope ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{item.type}</span>
                </div>
                <div className="text-right">
                  <p className={`font-manrope font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.count}</p>
                  <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-manrope`}>{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barra de Ações */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSalesIntegrationModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Nova Nota Fiscal</span>
            </button>
            
            <button
              onClick={() => setShowBatchEmissionModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-manrope font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-3"
            >
              <Upload className="w-5 h-5" />
              <span>Emissão em Lote</span>
            </button>
            
            <button
              onClick={() => setShowReportModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-manrope font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center space-x-3"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Relatórios</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={checkSefazStatus}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Verificar SEFAZ</span>
            </button>
          </div>
        </div>
        
        {/* Filtros e Busca */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, pedido ou número da nota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-manrope"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FiscalStatus | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-manrope"
          >
            <option value="all">Todos os Status</option>
            {Object.entries(statusConfig).map(([status, config]) => (
              <option key={status} value={status}>{config.label}</option>
            ))}
          </select>
          
          <select
            value={documentFilter}
            onChange={(e) => setDocumentFilter(e.target.value as DocumentType | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-manrope"
          >
            <option value="all">Todos os Documentos</option>
            {Object.entries(documentTypeConfig).map(([type, config]) => (
              <option key={type} value={type}>{config.label}</option>
            ))}
          </select>
          
          <select
            value={noteTypeFilter}
            onChange={(e) => setNoteTypeFilter(e.target.value as NoteType | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-manrope"
          >
            <option value="all">Todos os Tipos</option>
            {Object.entries(noteTypeConfig).map(([type, config]) => (
              <option key={type} value={type}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Notas Fiscais */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">Notas Fiscais</h3>
            <span className="text-sm text-gray-500">
              Total: {filteredNotes.length}
            </span>
            <span>•</span>
            <span>Emissão: {fiscalNotes.filter(note => note.status === 'issued' || note.status === 'approved').length}</span>
            <span>•</span>
            <span>Pendentes: {fiscalNotes.filter(note => note.status === 'pending').length}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSalesIntegrationModal(true)}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
              title="Integrar vendas pendentes"
            >
              <Zap className="w-4 h-4" />
              <span>Integrar Vendas</span>
            </button>
            <button
              onClick={() => setShowNewNoteModal(true)}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              title="Criar nota manualmente"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Nota</span>
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Carregando notas fiscais...</span>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma nota fiscal encontrada</h3>
            <p className="text-gray-500">Crie sua primeira nota fiscal ou ajuste os filtros de busca.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{note.noteNumber}</div>
                        <div className="text-sm text-gray-500">{note.orderId}</div>

                        {note.accessKey && (
                          <div className="text-xs text-gray-400 font-mono">
                            {note.accessKey.substring(0, 8)}...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{note.customerName}</div>
                        <div className="text-sm text-gray-500">
                          {note.documentType === 'cpf' ? 'CPF' : 'CNPJ'}: {note.document}
                        </div>
                        {note.companyName && (
                          <div className="text-xs text-gray-400">{note.companyName}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R$ {note.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {note.items.length} item(ns)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        statusConfig[note.status].color
                      }`}>
                        {statusConfig[note.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        noteTypeConfig[note.noteType].color
                      }`}>
                        {noteTypeConfig[note.noteType].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {note.issuedAt 
                        ? new Date(note.issuedAt).toLocaleDateString('pt-BR')
                        : new Date(note.createdAt).toLocaleDateString('pt-BR')
                      }
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        {/* Ver detalhes - sempre visível */}
                        <button
                          onClick={() => {
                            setSelectedNote(note)
                            setShowNoteDetailsModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Emitir nota - apenas para pendentes */}
                        {note.status === 'pending' && (
                          <button
                            onClick={() => emitFiscalNote(note)}
                            className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                            title="Emitir nota"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        
                        {/* Ações para notas emitidas/aprovadas */}
                        {(note.status === 'approved' || note.status === 'issued') && (
                          <>
                            {/* Imprimir */}
                            <button
                              onClick={() => printFiscalNote(note)}
                              className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                              title="Imprimir"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            
                            {/* Baixar PDF */}
                            <button
                              onClick={() => exportToPDF(note)}
                              className="text-purple-600 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                              title="Baixar PDF"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            
                            {/* Baixar XML */}
                            <button
                              onClick={() => exportToXML(note)}
                              className="text-orange-600 hover:text-orange-700 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                              title="Baixar XML"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            
                            {/* Enviar Email */}
                            <button
                              onClick={() => sendByEmail(note, note.email || '')}
                              className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                              title="Enviar Email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            
                            {/* Cancelar nota */}
                            <button
                              onClick={() => {
                                setSelectedNote(note)
                                setShowCancelModal(true)
                              }}
                              className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                              title="Cancelar nota"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mensagens de Sucesso e Erro */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 animate-in slide-in-from-top-2 duration-300">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage('')}
            className="ml-auto text-green-400 hover:text-green-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 animate-in slide-in-from-top-2 duration-300">
          <X className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage('')}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* New Note Modal */}
      {showNewNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-primary rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-manrope font-bold text-primary">Nova Nota Fiscal</h2>
              <button
                onClick={() => setShowNewNoteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Pedido</label>
                  <input
                    type="text"
                    value={newNote.orderId}
                    onChange={(e) => setNewNote({...newNote, orderId: e.target.value})}
                    className="input-primary w-full px-3 py-2 rounded-lg font-manrope"
                    placeholder="#1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Tipo de Documento</label>
                  <select
                    value={newNote.documentType}
                    onChange={(e) => setNewNote({...newNote, documentType: e.target.value as DocumentType})}
                    className="input-primary w-full px-3 py-2 rounded-lg font-manrope"
                  >
                    <option value="cpf">CPF</option>
                    <option value="cnpj">CNPJ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-primary mb-2">
                  {newNote.documentType === 'cpf' ? 'Nome do Cliente' : 'Razão Social'}
                </label>
                <input
                  type="text"
                  value={newNote.customerName}
                  onChange={(e) => setNewNote({...newNote, customerName: e.target.value})}
                  className="input-primary w-full px-3 py-2 rounded-lg font-manrope"
                />
              </div>

              <div>
                <label className="block text-sm font-manrope font-medium text-primary mb-2">
                  {newNote.documentType === 'cpf' ? 'CPF' : 'CNPJ'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newNote.document}
                    onChange={(e) => setNewNote({...newNote, document: e.target.value})}
                    className={`input-primary w-full px-3 py-2 rounded-lg font-manrope ${
                      newNote.document.length > 0 
                        ? (newNote.documentType === 'cpf' ? validateCPF(newNote.document) : validateCNPJ(newNote.document))
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    placeholder={newNote.documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                  />
                  {newNote.document.length > 0 && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {(newNote.documentType === 'cpf' ? validateCPF(newNote.document) : validateCNPJ(newNote.document)) ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {newNote.document.length > 0 && !(newNote.documentType === 'cpf' ? validateCPF(newNote.document) : validateCNPJ(newNote.document)) && (
                  <p className="text-red-500 text-sm mt-1 font-manrope">
                    {newNote.documentType === 'cpf' ? 'CPF' : 'CNPJ'} inválido
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-manrope font-medium text-primary mb-2">Valor Recebido</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newNote.amountReceived}
                    onChange={(e) => setNewNote({...newNote, amountReceived: parseFloat(e.target.value) || 0})}
                    className="input-primary w-full px-3 py-2 rounded-lg font-manrope"
                    placeholder="0.00"
                  />
                </div>
                <div className="p-3 bg-adaptive rounded-lg">
                  <label className="block text-sm font-manrope font-medium text-gray-700 mb-1">Troco</label>
                  <p className="text-lg font-manrope font-bold text-green-600">
                    R$ {calculateChange().toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewNoteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-manrope text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-manrope hover:bg-blue-700 transition-colors duration-200"
                >
                  Criar Nota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-manrope font-bold text-gray-900">Nota Fiscal {selectedNote.id}</h2>
              <button
                onClick={() => setSelectedNote(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 font-manrope mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-manrope font-medium ${statusConfig[selectedNote.status].color}`}>
                    {statusConfig[selectedNote.status].label}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 font-manrope mb-1">Tipo</p>
                  <p className="font-manrope font-medium">{selectedNote.noteType.toUpperCase()}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-manrope font-bold text-gray-900 mb-3">Dados do Cliente</h3>
                <div className="space-y-2">
                  <p className="font-manrope">
                    <span className="text-gray-500">{selectedNote.documentType === 'cpf' ? 'Nome:' : 'Razão Social:'}</span> {selectedNote.customerName}
                  </p>
                  <p className="font-manrope">
                    <span className="text-gray-500">{selectedNote.documentType.toUpperCase()}:</span> {selectedNote.document}
                  </p>
                  {selectedNote.email && (
                    <p className="font-manrope"><span className="text-gray-500">Email:</span> {selectedNote.email}</p>
                  )}
                  {selectedNote.phone && (
                    <p className="font-manrope"><span className="text-gray-500">Telefone:</span> {selectedNote.phone}</p>
                  )}
                  <p className="font-manrope">
                    <span className="text-gray-500">Endereço:</span> {selectedNote.address.street}, {selectedNote.address.number}
                    {selectedNote.address.complement && `, ${selectedNote.address.complement}`}
                    <br />
                    {selectedNote.address.neighborhood}, {selectedNote.address.city} - {selectedNote.address.state}, CEP {selectedNote.address.zipCode}
                  </p>
                </div>
              </div>

              {selectedNote.amountReceived > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-manrope font-bold text-gray-900 mb-3">Informações de Pagamento</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-manrope">Total</p>
                      <p className="text-lg font-manrope font-bold text-gray-900">R$ {selectedNote.total.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-manrope">Recebido</p>
                      <p className="text-lg font-manrope font-bold text-blue-600">R$ {selectedNote.amountReceived.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-manrope">Troco</p>
                      <p className="text-lg font-manrope font-bold text-green-600">R$ {selectedNote.change.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-manrope font-bold text-gray-900 mb-3">QR Code</h3>
                <div className="text-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 font-manrope">Código de Verificação Interna</p>
                  <p className="text-xs text-gray-400 font-manrope mt-1">Hash: {JSON.parse(selectedNote.qrCode).hash}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-manrope font-bold text-gray-900 mb-3">Itens</h3>
                <div className="space-y-3">
                  {selectedNote.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-manrope font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500 font-manrope">
                          {item.quantity}x R$ {item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-manrope font-bold">R$ {item.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">
                          {item.quantity} × R$ {item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-manrope font-medium text-gray-600">Subtotal:</span>
                    <span className="font-manrope font-medium text-gray-900">R$ {selectedNote.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-manrope font-medium text-gray-600">Impostos:</span>
                    <span className="font-manrope font-medium text-gray-900">R$ {selectedNote.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-manrope font-bold text-lg">Total:</span>
                    <span className="font-manrope font-bold text-xl text-gray-900">R$ {selectedNote.total.toFixed(2)}</span>
                  </div>
                  {selectedNote.amountReceived > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-manrope font-medium text-gray-600">Valor Recebido:</span>
                        <span className="font-manrope font-medium text-blue-600">R$ {selectedNote.amountReceived.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-manrope font-bold text-lg">Troco:</span>
                        <span className="font-manrope font-bold text-xl text-green-600">R$ {selectedNote.change.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configuração da SEFAZ */}
      {showSefazConfigModal && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* Conteúdo Principal */}
          <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Header do Modal */}
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-manrope font-bold text-gray-900">Configuração da SEFAZ</h1>
                    <p className="text-gray-600 font-manrope text-xl mt-2">Configure a integração com a Secretaria da Fazenda</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={checkSefazStatus}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Testar Conexão</span>
                  </button>
                  <button 
                    onClick={() => setShowSefazConfigModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>
              </div>

              {/* Grid Principal */}
              <div className="grid grid-cols-3 gap-16">
                
                {/* Coluna 1 - Informações da Empresa */}
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                      <Building className="w-7 h-7 text-blue-600" />
                      <span>Informações da Empresa</span>
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">CNPJ</label>
                        <input
                          type="text"
                          value={sefazConfig?.company.cnpj || ''}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            company: { ...prev.company, cnpj: e.target.value }
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-lg"
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Inscrição Estadual</label>
                        <input
                          type="text"
                          value={sefazConfig?.company.inscricaoEstadual || ''}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            company: { ...prev.company, inscricaoEstadual: e.target.value }
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-lg"
                          placeholder="123456789"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Razão Social</label>
                        <input
                          type="text"
                          value={sefazConfig?.company.razaoSocial || ''}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            company: { ...prev.company, razaoSocial: e.target.value }
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-lg"
                          placeholder="Nome da Empresa Ltda"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Nome Fantasia</label>
                        <input
                          type="text"
                          value={sefazConfig?.company.nomeFantasia || ''}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            company: { ...prev.company, nomeFantasia: e.target.value }
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-lg"
                          placeholder="Nome Fantasia"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                      <MapPin className="w-7 h-7 text-green-600" />
                      <span>Endereço da Empresa</span>
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Logradouro</label>
                        <input
                          type="text"
                          value={sefazConfig?.company.endereco.logradouro || ''}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            company: { 
                              ...prev.company, 
                              endereco: { ...prev.company.endereco, logradouro: e.target.value }
                            }
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope text-lg"
                          placeholder="Rua, Avenida, etc."
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Número</label>
                          <input
                            type="text"
                            value={sefazConfig?.company.endereco.numero || ''}
                            onChange={(e) => setSefazConfig(prev => prev ? {
                              ...prev,
                              company: { 
                                ...prev.company, 
                                endereco: { ...prev.company.endereco, numero: e.target.value }
                              }
                            } : null)}
                            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope text-lg"
                            placeholder="123"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Complemento</label>
                          <input
                            type="text"
                            value={sefazConfig?.company.endereco.complemento || ''}
                            onChange={(e) => setSefazConfig(prev => prev ? {
                              ...prev,
                              company: { 
                                ...prev.company, 
                                endereco: { ...prev.company.endereco, complemento: e.target.value }
                              }
                            } : null)}
                            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope text-lg"
                            placeholder="Sala, Loja, etc."
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Bairro</label>
                        <input
                          type="text"
                          value={sefazConfig?.company.endereco.bairro || ''}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            company: { 
                              ...prev.company, 
                              endereco: { ...prev.company.endereco, bairro: e.target.value }
                            }
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope text-lg"
                          placeholder="Centro, Vila, etc."
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Município</label>
                          <input
                            type="text"
                            value={sefazConfig?.company.endereco.municipio || ''}
                            onChange={(e) => setSefazConfig(prev => prev ? {
                              ...prev,
                              company: { 
                                ...prev.company, 
                                endereco: { ...prev.company.endereco, municipio: e.target.value }
                              }
                            } : null)}
                            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope text-lg"
                            placeholder="São Paulo"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">UF</label>
                          <select
                            value={sefazConfig?.company.endereco.uf || ''}
                            onChange={(e) => setSefazConfig(prev => prev ? {
                              ...prev,
                              company: { 
                                ...prev.company, 
                                endereco: { ...prev.company.endereco, uf: e.target.value }
                              }
                            } : null)}
                            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope text-lg"
                          >
                            <option value="">Selecione o Estado</option>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceará</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MT">Mato Grosso</option>
                            <option value="MS">Mato Grosso do Sul</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="PA">Pará</option>
                            <option value="PB">Paraíba</option>
                            <option value="PR">Paraná</option>
                            <option value="PE">Pernambuco</option>
                            <option value="PI">Piauí</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="RN">Rio Grande do Norte</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="RO">Rondônia</option>
                            <option value="RR">Roraima</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="SP">São Paulo</option>
                            <option value="SE">Sergipe</option>
                            <option value="TO">Tocantins</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">CEP</label>
                        <input
                          type="text"
                          value={sefazConfig?.company.endereco.cep || ''}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            company: { 
                              ...prev.company, 
                              endereco: { ...prev.company.endereco, cep: e.target.value }
                            }
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope text-lg"
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 2 - Configurações Técnicas */}
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                      <Shield className="w-7 h-7 text-purple-600" />
                      <span>Configurações Técnicas</span>
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Ambiente</label>
                        <select
                          value={sefazConfig?.environment || 'homologation'}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            environment: e.target.value as 'production' | 'homologation'
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope text-lg"
                        >
                          <option value="homologation">Homologação (Testes)</option>
                          <option value="production">Produção (Real)</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-2">
                          {sefazConfig?.environment === 'homologation' 
                            ? 'Ambiente de testes para validação das configurações'
                            : 'Ambiente de produção para emissão real de notas fiscais'
                          }
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Certificado Digital</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors duration-200">
                          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-xl font-medium text-gray-900 mb-2">Clique para selecionar o certificado</p>
                          <p className="text-sm text-gray-500 mb-6">Formatos aceitos: .p12, .pfx</p>
                          <input
                            type="file"
                            accept=".p12,.pfx"
                            className="hidden"
                            id="certificate-upload"
                          />
                          <label 
                            htmlFor="certificate-upload"
                            className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 cursor-pointer inline-block font-medium"
                          >
                            Selecionar Arquivo
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Senha do Certificado</label>
                        <input
                          type="password"
                          value={sefazConfig?.certificatePassword || ''}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            certificatePassword: e.target.value
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope text-lg"
                          placeholder="Senha do certificado"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Senha necessária para acessar o certificado digital
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                      <Wifi className="w-7 h-7 text-orange-600" />
                      <span>WebServices da SEFAZ</span>
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">NFe - Autorização</label>
                        <input
                          type="url"
                          value={sefazConfig?.webservices.nfe || ''}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            webservices: { ...prev.webservices, nfe: e.target.value }
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-lg"
                          placeholder="https://nfe.sefaz.gov.br/ws/nfeautorizacao4.asmx"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          WebService para autorização de Notas Fiscais Eletrônicas
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">NFCe - Autorização</label>
                        <input
                          type="url"
                          value={sefazConfig?.webservices.nfce || ''}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            webservices: { ...prev.webservices, nfce: e.target.value }
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-lg"
                          placeholder="https://nfce.sefaz.gov.br/ws/nfeautorizacao4.asmx"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          WebService para autorização de Notas Fiscais do Consumidor
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">NFSe - Autorização</label>
                        <input
                          type="url"
                          value={sefazConfig?.webservices.nfse || ''}
                          onChange={(e) => setSefazConfig(prev => prev ? {
                            ...prev,
                            webservices: { ...prev.webservices, nfse: e.target.value }
                          } : null)}
                          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-lg"
                          placeholder="https://nfse.prefeitura.gov.br/ws/nfse.asmx"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          WebService para autorização de Notas Fiscais de Serviço
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 3 - Status e Monitoramento */}
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                      <Activity className="w-7 h-7 text-gray-600" />
                      <span>Status da Conexão</span>
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Status Geral:</span>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                              sefazStatus.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {sefazStatus.connected ? 'Conectado' : 'Desconectado'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Certificado:</span>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                              sefazStatus.certificateValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {sefazStatus.certificateValid ? 'Válido' : 'Inválido'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Ambiente:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {sefazStatus.environment === 'homologation' ? 'Homologação' : 'Produção'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Última Verificação:</span>
                            <span className="text-sm text-gray-900">
                              {sefazStatus.lastCheck.toLocaleTimeString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos WebServices</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                sefazStatus.webservicesStatus.nfe === 'online' ? 'bg-green-500' : 
                                sefazStatus.webservicesStatus.nfe === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className="font-medium text-gray-900">NFe</span>
                            </div>
                            <span className={`text-sm font-medium ${
                              sefazStatus.webservicesStatus.nfe === 'online' ? 'text-green-600' : 
                              sefazStatus.webservicesStatus.nfe === 'checking' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {sefazStatus.webservicesStatus.nfe === 'online' ? 'Online' : 
                               sefazStatus.webservicesStatus.nfe === 'checking' ? 'Verificando...' : 'Offline'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                sefazStatus.webservicesStatus.nfce === 'online' ? 'bg-green-500' : 
                                sefazStatus.webservicesStatus.nfce === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className="font-medium text-gray-900">NFCe</span>
                            </div>
                            <span className={`text-sm font-medium ${
                              sefazStatus.webservicesStatus.nfce === 'online' ? 'text-green-600' : 
                              sefazStatus.webservicesStatus.nfce === 'checking' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {sefazStatus.webservicesStatus.nfce === 'online' ? 'Online' : 
                               sefazStatus.webservicesStatus.nfce === 'checking' ? 'Verificando...' : 'Offline'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                sefazStatus.webservicesStatus.nfse === 'online' ? 'bg-green-500' : 
                                sefazStatus.webservicesStatus.nfse === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className="font-medium text-gray-900">NFSe</span>
                            </div>
                            <span className={`text-sm font-medium ${
                              sefazStatus.webservicesStatus.nfse === 'online' ? 'text-green-600' : 
                              sefazStatus.webservicesStatus.nfse === 'checking' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {sefazStatus.webservicesStatus.nfse === 'online' ? 'Online' : 
                               sefazStatus.webservicesStatus.nfse === 'checking' ? 'Verificando...' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                      <Info className="w-7 h-7 text-blue-600" />
                      <span>Informações Importantes</span>
                    </h2>
                    
                    <div className="space-y-4 text-sm text-gray-600">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p>Certifique-se de que o certificado digital esteja válido e não expirado</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p>Em ambiente de homologação, as notas fiscais não são válidas para fins fiscais</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p>Teste a conexão antes de emitir notas fiscais em produção</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p>Mantenha as URLs dos webservices atualizadas conforme orientações da SEFAZ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botões de Ação */}
              <div className="flex justify-end space-x-4 mt-16 pt-8 border-t border-gray-200">
                <button
                  onClick={() => setShowSefazConfigModal(false)}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg font-manrope font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setSuccessMessage('Configurações da SEFAZ salvas com sucesso!')
                    setShowSefazConfigModal(false)
                  }}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-manrope font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-3"
                >
                  <Save className="w-5 h-5" />
                  <span>Salvar Configurações</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Emissão em Lote */}
      {showBatchEmissionModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-[1400px] shadow-2xl rounded-2xl bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Printer className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-manrope font-bold text-gray-900">Emissão em Lote</h3>
                    <p className="text-gray-600 font-manrope">Emita múltiplas notas fiscais de uma vez</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowBatchEmissionModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {/* Coluna 1 - Filtros de Seleção */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span>Filtros de Seleção</span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-sm"
                        />
                        <input
                          type="date"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-sm">
                        <option value="">Todos os Status</option>
                        <option value="pending">Pendentes</option>
                        <option value="approved">Aprovadas</option>
                        <option value="rejected">Rejeitadas</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Nota</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-sm">
                        <option value="">Todos os Tipos</option>
                        <option value="nfe">NFe</option>
                        <option value="nfce">NFCe</option>
                        <option value="nfse">NFSe</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                      <input
                        type="text"
                        placeholder="Filtrar por cliente"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-manrope text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Coluna 2 - Configurações de Emissão */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-green-600" />
                    <span>Configurações</span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ambiente</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope text-sm">
                        <option value="homologation">Homologação</option>
                        <option value="production">Produção</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Modo de Emissão</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope text-sm">
                        <option value="sequential">Sequencial</option>
                        <option value="parallel">Paralelo</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delay (ms)</label>
                      <input
                        type="number"
                        placeholder="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-manrope text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="auto-retry"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <label htmlFor="auto-retry" className="text-sm text-gray-700">
                        Auto-retry
                      </label>
                    </div>
                  </div>
                </div>

                {/* Coluna 3 - Preview e Controle */}
                <div className="space-y-4">
                  {/* Preview da Seleção */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span>Preview</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Total:</span>
                          <span className="text-lg font-bold text-purple-600">24</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>NFe:</span>
                            <span>18</span>
                          </div>
                          <div className="flex justify-between">
                            <span>NFCe:</span>
                            <span>4</span>
                          </div>
                          <div className="flex justify-between">
                            <span>NFSe:</span>
                            <span>2</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Valor:</span>
                          <span className="text-lg font-bold text-green-600">R$ 45.892,00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controles de Emissão */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
                      <Play className="w-4 h-4 text-orange-600" />
                      <span>Controles</span>
                    </h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setEmitting(true)
                          setTimeout(() => {
                            setEmitting(false)
                            setSuccessMessage('Emissão em lote concluída! 24 notas emitidas.')
                          }, 3000)
                        }}
                        disabled={emitting}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        {emitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Emitindo...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>Iniciar</span>
                          </>
                        )}
                      </button>
                      
                      {emitting && (
                        <div className="bg-white rounded-lg p-3 border border-orange-200">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{width: '65%'}}></div>
                          </div>
                          <div className="text-xs text-gray-500 text-center">
                            Processando nota 15 de 24...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Relatórios */}
      {showReportModal && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-8 border w-[1200px] shadow-2xl rounded-2xl bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-manrope font-bold text-gray-900">Relatórios Fiscais</h3>
                    <p className="text-gray-600 font-manrope text-lg">Gere relatórios detalhados e análises fiscais</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-12">
                {/* Coluna Esquerda - Tipos de Relatório */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <span>Relatórios de Emissão</span>
                    </h4>
                    <div className="space-y-4">
                      <button
                        onClick={() => generateReport('daily')}
                        className="w-full p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700">Resumo de Emissão</h5>
                            <p className="text-gray-600">Total de notas emitidas por período</p>
                          </div>
                          <Download className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                        </div>
                      </button>
                      
                      <button
                        onClick={() => generateReport('weekly')}
                        className="w-full p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700">Emissão por Tipo</h5>
                            <p className="text-gray-600">NFe, NFCe e NFSe separados</p>
                          </div>
                          <Download className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                        </div>
                      </button>
                      
                      <button
                        onClick={() => generateReport('monthly')}
                        className="w-full p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700">Status de Emissão</h5>
                            <p className="text-gray-600">Aprovadas, rejeitadas e pendentes</p>
                          </div>
                          <Download className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                      <DollarSign className="w-6 h-6 text-green-600" />
                      <span>Relatórios Financeiros</span>
                    </h4>
                    <div className="space-y-4">
                      <button
                        onClick={() => generateReport('daily')}
                        className="w-full p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-lg group-hover:text-green-700">Resumo Financeiro</h5>
                            <p className="text-gray-600">Valores totais e impostos</p>
                          </div>
                          <Download className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                        </div>
                      </button>
                      
                      <button
                        onClick={() => generateReport('weekly')}
                        className="w-full p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-lg group-hover:text-green-700">Análise de Impostos</h5>
                            <p className="text-gray-600">ICMS, PIS, COFINS e outros</p>
                          </div>
                          <Download className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                        </div>
                      </button>
                      
                      <button
                        onClick={() => generateReport('monthly')}
                        className="w-full p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-lg group-hover:text-green-700">Análise por Cliente</h5>
                            <p className="text-gray-600">Faturamento por cliente</p>
                          </div>
                          <Download className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-orange-600" />
                      <span>Relatórios de Auditoria</span>
                    </h4>
                    <div className="space-y-4">
                      <button
                        onClick={() => generateReport('custom')}
                        className="w-full p-5 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-lg group-hover:text-orange-700">Rastro de Auditoria</h5>
                            <p className="text-gray-600">Todas as operações realizadas</p>
                          </div>
                          <Download className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform duration-200" />
                        </div>
                      </button>
                      
                      <button
                        onClick={() => generateReport('custom')}
                        className="w-full p-5 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-lg group-hover:text-orange-700">Log de Erros</h5>
                            <p className="text-gray-600">Falhas e rejeições da SEFAZ</p>
                          </div>
                          <Download className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform duration-200" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coluna Direita - Configurações e Ações */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                      <Settings className="w-6 h-6 text-purple-600" />
                      <span>Configurações</span>
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-base font-semibold text-gray-700 mb-3">Período do Relatório</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Data Início</label>
                            <input
                              type="date"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Data Fim</label>
                            <input
                              type="date"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-base font-semibold text-gray-700 mb-3">Formato de Saída</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope">
                          <option value="pdf">PDF - Documento Portátil</option>
                          <option value="excel">Excel - Planilha Eletrônica</option>
                          <option value="csv">CSV - Valores Separados por Vírgula</option>
                          <option value="xml">XML - Linguagem de Marcação</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-base font-semibold text-gray-700 mb-3">Agrupamento de Dados</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope">
                          <option value="daily">Diário - Agrupamento por dia</option>
                          <option value="weekly">Semanal - Agrupamento por semana</option>
                          <option value="monthly">Mensal - Agrupamento por mês</option>
                          <option value="quarterly">Trimestral - Agrupamento por trimestre</option>
                          <option value="yearly">Anual - Agrupamento por ano</option>
                        </select>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="include-charts"
                            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label htmlFor="include-charts" className="text-base font-medium text-gray-700">
                            Incluir gráficos e visualizações interativas
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="include-details"
                            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label htmlFor="include-details" className="text-base font-medium text-gray-700">
                            Incluir detalhes completos e análises profundas
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                      <Zap className="w-6 h-6 text-blue-600" />
                      <span>Ações</span>
                    </h4>
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          setSuccessMessage('Relatório gerado com sucesso! Iniciando download...')
                          setTimeout(() => setSuccessMessage(''), 3000)
                        }}
                        className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-3 text-lg font-semibold"
                      >
                        <Download className="w-6 h-6" />
                        <span>Gerar e Baixar Relatório</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSuccessMessage('Relatório enviado por email com sucesso!')
                          setTimeout(() => setSuccessMessage(''), 3000)
                        }}
                        className="w-full px-8 py-5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-3 text-lg font-semibold"
                      >
                        <Mail className="w-6 h-6" />
                        <span>Enviar por Email</span>
                      </button>
                      
                      <button
                        onClick={() => setShowReportModal(false)}
                        className="w-full px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-lg font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Integração com Vendas */}
      {showSalesIntegrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[1200px] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Integração com Vendas</h2>
                  <p className="text-gray-600 mt-1">Selecione vendas confirmadas para criar notas fiscais</p>
                </div>
                <button
                  onClick={() => setShowSalesIntegrationModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              {pendingSales.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Todas as vendas já têm notas fiscais!</h3>
                  <p className="text-gray-600">Não há vendas pendentes para emissão de notas fiscais.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Vendas Confirmadas ({pendingSales.length})
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Integração automática:</span>
                      <button
                        onClick={() => {
                          pendingSales.forEach(sale => integrateSaleToFiscal(sale))
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Integrar Todas</span>
                      </button>
                    </div>
                  </div>

                  {/* Lista de vendas */}
                  <div className="grid gap-4">
                    {pendingSales.map((sale) => (
                      <div key={sale.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Receipt className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-3">
                                  <h4 className="font-semibold text-gray-900">{sale.orderId}</h4>
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    {sale.status === 'confirmed' ? 'Confirmada' : sale.status}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                  {sale.customerName} • {sale.customerDocument}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {sale.saleDate.toLocaleDateString('pt-BR')} • {sale.paymentMethod} • Vendedor: {sale.seller}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              R$ {sale.total.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {sale.items.length} item(ns)
                            </div>
                          </div>
                          
                          <div className="ml-6">
                            <button
                              onClick={() => createNoteFromSale(sale)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Criar Nota</span>
                            </button>
                          </div>
                        </div>

                        {/* Detalhes dos itens */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Itens da venda:</h5>
                          <div className="grid gap-2">
                            {sale.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3">
                                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-gray-500">({item.quantity}x)</span>
                                </div>
                                <span className="text-gray-600">R$ {item.unitPrice.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}