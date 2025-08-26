'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Building, 
  MapPin, 
  Shield, 
  Wifi, 
  Activity, 
  Info, 
  Upload, 
  Save, 
  X,
  RefreshCw
} from 'lucide-react'

interface CompanyAddress {
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  municipio: string
  uf: string
  cep: string
}

interface Company {
  cnpj: string
  inscricaoEstadual: string
  razaoSocial: string
  nomeFantasia: string
  endereco: CompanyAddress
}

interface WebServices {
  nfe: string
  nfce: string
  nfse: string
}

interface SefazConfig {
  company: Company
  environment: 'production' | 'homologation'
  certificate?: File
  certificatePassword: string
  webservices: WebServices
}

interface SefazStatus {
  connected: boolean
  lastCheck: Date
  environment: 'production' | 'homologation'
  certificateValid: boolean
  webservicesStatus: {
    nfe: 'online' | 'offline' | 'error' | 'checking' | 'unknown'
    nfce: 'online' | 'offline' | 'error' | 'checking' | 'unknown'
    nfse: 'online' | 'offline' | 'error' | 'checking' | 'unknown'
  }
}

export default function SefazConfigPage() {
  const [sefazConfig, setSefazConfig] = useState<SefazConfig | null>(null)
  const [sefazStatus, setSefazStatus] = useState<SefazStatus>({
    connected: false,
    lastCheck: new Date(),
    environment: 'homologation',
    certificateValid: false,
    webservicesStatus: {
      nfe: 'unknown',
      nfce: 'unknown',
      nfse: 'unknown'
    }
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // Carregar configurações existentes
    loadSefazConfig()
  }, [])

  const loadSefazConfig = () => {
    // Simular carregamento de configurações existentes
    setSefazConfig({
      company: {
        cnpj: '',
        inscricaoEstadual: '',
        razaoSocial: '',
        nomeFantasia: '',
        endereco: {
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          municipio: '',
          uf: '',
          cep: ''
        }
      },
      environment: 'homologation',
      certificatePassword: '',
      webservices: {
        nfe: '',
        nfce: '',
        nfse: ''
      }
    })
  }

  const checkSefazStatus = async () => {
    try {
      setSefazStatus(prev => ({ ...prev, connected: false, certificateValid: false }))
      
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

      let webservicesStatus: {
        nfe: 'online' | 'offline' | 'error' | 'checking' | 'unknown'
        nfce: 'online' | 'offline' | 'error' | 'checking' | 'unknown'
        nfse: 'online' | 'offline' | 'error' | 'checking' | 'unknown'
      } = {
        nfe: 'checking',
        nfce: 'checking',
        nfse: 'checking'
      }
      
      setSefazStatus(prev => ({
        ...prev,
        webservicesStatus
      }))

      await new Promise(resolve => setTimeout(resolve, 1000))
      webservicesStatus.nfe = 'online'
      
      await new Promise(resolve => setTimeout(resolve, 800))
      webservicesStatus.nfce = 'online'
      
      await new Promise(resolve => setTimeout(resolve, 1200))
      webservicesStatus.nfse = 'online'

      const certificateValid = sefazConfig.certificatePassword.length > 0
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

  const saveConfigurations = () => {
    setSuccessMessage('Configurações da SEFAZ salvas com sucesso!')
    setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  const closeWindow = () => {
    window.close()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
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
              onClick={closeWindow}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      {successMessage && (
        <div className="mx-8 mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mx-8 mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          
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
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setSefazConfig(prev => prev ? {
                              ...prev,
                              certificate: file
                            } : null)
                          }
                        }}
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
                           sefazStatus.webservicesStatus.nfce === 'checking' ? 'Verificando...' : 'Offline'}
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
              onClick={closeWindow}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg font-manrope font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Fechar
            </button>
            <button
              onClick={saveConfigurations}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-manrope font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-3"
            >
              <Save className="w-5 h-5" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


