'use client'
/**
 * Super Admin Dashboard - Vynlo Platform
 * 
 * Commit 4481aaf: Recriado do zero (antiga tinha 2.913 linhas mock)
 * Nova: ~730 linhas funcionais + APIs reais + Menu lateral
 * 
 * Sistema de gestão multi-tenant para a plataforma Vynlo
 * Permite criar e gerenciar clientes dos produtos:
 * - Vynlo Taste (Delivery)
 * - Vynlo Ekklesia (Igrejas)
 * - Vynlo Bot (IA)
 * - Vynlo Saúde, Educação, Petshops, Barbearias, Serviços
 * 
 * Identidade Visual: Azul (#0066FF) + Preto (#000000) - Gradiente
 * Layout: Menu lateral fixo + conteúdo responsivo
 * APIs: 100% conectado ao backend (zero mocks)
 * Fix 878274f: Schema Yup corrigido (campos opcionais)
 * 
 * @version 2.1.1
 * @author Vynlo Tech
 */

import { useState } from 'react'
import { 
  Users, 
  Building2, 
  Plus, 
  Search,
  Shield,
  Settings,
  Eye,
  Ban,
  CheckCircle,
  X,
  ChevronRight,
  LayoutDashboard,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  Activity,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  useClientsQuery,
  useCreateClientMutation,
  useSuspendClientMutation,
  useActivateClientMutation,
  useAvailablePermissionsQuery,
  type VynloClient,
  type CreateClientData
} from '@/hooks/useSuperAdminQuery'

// Produtos Vynlo disponíveis
const VYNLO_PRODUCTS = [
  { id: 'TASTE', name: 'Vynlo Taste', icon: '🍕', description: 'Delivery e Restaurantes' },
  { id: 'EKKLESIA', name: 'Vynlo Ekklesia', icon: '⛪', description: 'Gestão de Igrejas' },
  { id: 'BOT', name: 'Vynlo Bot', icon: '🤖', description: 'Assistente com IA' },
  { id: 'SAUDE', name: 'Vynlo Saúde', icon: '🏥', description: 'Clínicas e Hospitais' },
  { id: 'EDUCACAO', name: 'Vynlo Educação', icon: '🎓', description: 'Escolas' },
  { id: 'PETSHOPS', name: 'Vynlo Petshops', icon: '🐾', description: 'Pet Shops' },
  { id: 'BARBEARIAS', name: 'Vynlo Barbearias', icon: '💈', description: 'Barbearias' },
  { id: 'SERVICOS', name: 'Vynlo Serviços', icon: '🔧', description: 'Serviços Gerais' }
] as const

// Schema de validação
const clientSchema = yup.object().shape({
  companyName: yup.string()
    .required('Nome da empresa é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  adminEmail: yup.string()
    .required('Email é obrigatório')
    .email('Email inválido'),
  adminPassword: yup.string()
    .required('Senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .matches(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .matches(/[0-9]/, 'Deve conter pelo menos um número'),
  vynloProduct: yup.string()
    .required('Selecione um produto Vynlo'),
  clientType: yup.string().optional(),
  permissions: yup.array().of(yup.string()).optional()
})

export default function SuperAdminPage() {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'clients' | 'settings'>('dashboard')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<VynloClient | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Queries
  const { data: clients = [], isLoading, error } = useClientsQuery()
  const { data: availablePermissions } = useAvailablePermissionsQuery()
  const createClientMutation = useCreateClientMutation()
  const suspendClientMutation = useSuspendClientMutation()
  const activateClientMutation = useActivateClientMutation()

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateClientData>({
    resolver: yupResolver(clientSchema),
    defaultValues: {
      vynloProduct: 'TASTE'
    }
  })

  // Handlers
  const onCreateClient = async (data: CreateClientData) => {
    await createClientMutation.mutateAsync(data)
    setShowCreateModal(false)
    reset()
  }

  const handleSuspendClient = async (clientId: string) => {
    if (confirm('Tem certeza que deseja suspender este cliente?')) {
      await suspendClientMutation.mutateAsync(clientId)
    }
  }

  const handleActivateClient = async (clientId: string) => {
    await activateClientMutation.mutateAsync(clientId)
  }

  // Filtrar clientes
  const filteredClients = clients.filter(client =>
    client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Estatísticas
  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'ACTIVE').length,
    suspendedClients: clients.filter(c => c.status === 'SUSPENDED').length,
    byProduct: VYNLO_PRODUCTS.map(product => ({
      ...product,
      count: clients.filter(c => c.vynloProduct === product.id).length
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white">
      <div className="flex h-screen overflow-hidden">
        
        {/* ========== MENU LATERAL ========== */}
        <aside className="w-64 bg-gradient-to-b from-black via-slate-900 to-black border-r border-blue-500/20 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Vynlo</h1>
                <p className="text-xs text-blue-400">Super Admin</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2">
            <MenuItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={activeSection === 'dashboard'}
              onClick={() => setActiveSection('dashboard')}
            />
            <MenuItem
              icon={Building2}
              label="Clientes"
              active={activeSection === 'clients'}
              onClick={() => setActiveSection('clients')}
            />
            <MenuItem
              icon={Settings}
              label="Configurações"
              active={activeSection === 'settings'}
              onClick={() => setActiveSection('settings')}
            />
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-blue-500/20">
            <div className="text-xs text-gray-400 text-center">
              <p>Vynlo Platform v2.1.1</p>
              <p className="text-blue-400 mt-1">Enterprise Edition</p>
            </div>
          </div>
        </aside>

        {/* ========== CONTEÚDO PRINCIPAL ========== */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-gradient-to-r from-black to-slate-900 border-b border-blue-500/20 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  {activeSection === 'dashboard' && 'Dashboard Executivo'}
                  {activeSection === 'clients' && 'Gerenciar Clientes'}
                  {activeSection === 'settings' && 'Configurações'}
                </h2>
                <p className="text-blue-300">
                  {activeSection === 'dashboard' && 'Visão geral da plataforma Vynlo'}
                  {activeSection === 'clients' && 'Crie e gerencie clientes multi-produto'}
                  {activeSection === 'settings' && 'Configurações da plataforma'}
                </p>
              </div>
              {activeSection === 'clients' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Novo Cliente</span>
                </button>
              )}
            </div>
          </header>

          {/* Conteúdo */}
          <div className="p-8">
            
            {/* ========== DASHBOARD ========== */}
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard
                    title="Total de Clientes"
                    value={stats.totalClients}
                    icon={Building2}
                    gradient="from-blue-600 to-blue-800"
                  />
                  <StatsCard
                    title="Clientes Ativos"
                    value={stats.activeClients}
                    icon={CheckCircle}
                    gradient="from-green-600 to-green-800"
                  />
                  <StatsCard
                    title="Suspensos"
                    value={stats.suspendedClients}
                    icon={Ban}
                    gradient="from-red-600 to-red-800"
                  />
                </div>

                {/* Clientes por Produto */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-blue-400" />
                    Clientes por Produto Vynlo
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.byProduct.map(product => (
                      <div
                        key={product.id}
                        className="bg-black/40 rounded-lg p-4 border border-blue-500/10 hover:border-blue-500/30 transition-all"
                      >
                        <div className="text-3xl mb-2">{product.icon}</div>
                        <div className="text-2xl font-bold text-white mb-1">{product.count}</div>
                        <div className="text-sm text-blue-300">{product.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{product.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acesso Rápido */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-xl font-bold text-white mb-4">Acesso Rápido</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QuickActionButton
                      icon={Building2}
                      label="Ver Todos os Clientes"
                      onClick={() => setActiveSection('clients')}
                    />
                    <QuickActionButton
                      icon={Plus}
                      label="Criar Novo Cliente"
                      onClick={() => {
                        setActiveSection('clients')
                        setShowCreateModal(true)
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========== GERENCIAR CLIENTES ========== */}
            {activeSection === 'clients' && (
              <div className="space-y-6">
                {/* Busca */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-blue-500/20">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por empresa ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-black/40 text-white pl-12 pr-4 py-3 rounded-lg border border-blue-500/20 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                {/* Loading */}
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <span className="ml-3 text-gray-400">Carregando clientes...</span>
                  </div>
                )}

                {/* Erro */}
                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-300 mb-1">Erro ao carregar clientes</h4>
                      <p className="text-red-200 text-sm">{error.message}</p>
                    </div>
                  </div>
                )}

                {/* Lista de Clientes */}
                {!isLoading && !error && (
                  <>
                    {filteredClients.length === 0 ? (
                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-12 border border-blue-500/20 text-center">
                        <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                          {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                        </h3>
                        <p className="text-gray-400 mb-6">
                          {searchTerm 
                            ? 'Tente ajustar os termos da busca' 
                            : 'Comece criando seu primeiro cliente Vynlo'
                          }
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all"
                          >
                            Criar Primeiro Cliente
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {filteredClients.map(client => (
                          <ClientCard
                            key={client.id}
                            client={client}
                            onView={() => setSelectedClient(client)}
                            onSuspend={() => handleSuspendClient(client.id)}
                            onActivate={() => handleActivateClient(client.id)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ========== CONFIGURAÇÕES ========== */}
            {activeSection === 'settings' && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-blue-500/20">
                <div className="flex items-center space-x-3 mb-6">
                  <Settings className="w-8 h-8 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white">Configurações da Plataforma</h3>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>Modo: <strong className="text-white">Produção</strong></span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-green-400" />
                    <span>Segurança: <strong className="text-green-300">AWS Secrets Manager</strong></span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span>Status: <strong className="text-green-300">Operacional</strong></span>
                  </p>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ========== MODAL CRIAR CLIENTE ========== */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <form onSubmit={handleSubmit(onCreateClient)} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Criar Novo Cliente</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nome da Empresa */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Nome da Empresa *
              </label>
              <input
                {...register('companyName')}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-blue-500/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Ex: Restaurante Sabor Mineiro"
              />
              {errors.companyName && (
                <p className="text-red-400 text-sm mt-1">{errors.companyName.message}</p>
              )}
            </div>

            {/* Email do Admin */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email do Administrador *
              </label>
              <input
                {...register('adminEmail')}
                type="email"
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-blue-500/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="admin@empresa.com"
              />
              {errors.adminEmail && (
                <p className="text-red-400 text-sm mt-1">{errors.adminEmail.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Senha Inicial *
              </label>
              <input
                {...register('adminPassword')}
                type="password"
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-blue-500/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Mínimo 8 caracteres"
              />
              {errors.adminPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.adminPassword.message}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Deve conter pelo menos 8 caracteres, 1 maiúscula e 1 número
              </p>
            </div>

            {/* Produto Vynlo */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Produto Vynlo *
              </label>
              <select
                {...register('vynloProduct')}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-blue-500/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {VYNLO_PRODUCTS.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.icon} {product.name} - {product.description}
                  </option>
                ))}
              </select>
              {errors.vynloProduct && (
                <p className="text-red-400 text-sm mt-1">{errors.vynloProduct.message}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                disabled={createClientMutation.isPending}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createClientMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">Criar Cliente</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========== MODAL DETALHES DO CLIENTE ========== */}
      {selectedClient && (
        <Modal onClose={() => setSelectedClient(null)}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Detalhes do Cliente</h3>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <DetailRow label="Empresa" value={selectedClient.companyName} />
              <DetailRow label="Email" value={selectedClient.adminEmail} />
              <DetailRow 
                label="Produto" 
                value={VYNLO_PRODUCTS.find(p => p.id === selectedClient.vynloProduct)?.name || selectedClient.vynloProduct} 
              />
              <DetailRow 
                label="Status" 
                value={selectedClient.status}
                badge={selectedClient.status === 'ACTIVE' ? 'success' : 'error'}
              />
              <DetailRow 
                label="Criado em" 
                value={new Date(selectedClient.createdAt).toLocaleDateString('pt-BR')} 
              />
              {selectedClient.lastLogin && (
                <DetailRow 
                  label="Último login" 
                  value={new Date(selectedClient.lastLogin).toLocaleString('pt-BR')} 
                />
              )}
            </div>

            <div className="flex items-center space-x-4 pt-4 border-t border-blue-500/20">
              {selectedClient.status === 'ACTIVE' ? (
                <button
                  onClick={() => {
                    handleSuspendClient(selectedClient.id)
                    setSelectedClient(null)
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  <span>Suspender</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleActivateClient(selectedClient.id)
                    setSelectedClient(null)
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Ativar</span>
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ========== COMPONENTES AUXILIARES ==========

function MenuItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
          : 'text-gray-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      {active && <ChevronRight className="w-4 h-4 ml-auto" />}
    </button>
  )
}

function StatsCard({ title, value, icon: Icon, gradient }: any) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="text-4xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  )
}

function QuickActionButton({ icon: Icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-3 p-4 bg-black/40 hover:bg-black/60 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all group"
    >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-white font-medium">{label}</span>
      <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-400 transition-colors" />
    </button>
  )
}

function ClientCard({ client, onView, onSuspend, onActivate }: any) {
  const product = VYNLO_PRODUCTS.find(p => p.id === client.vynloProduct)
  
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-4xl">{product?.icon || '🏢'}</div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white mb-1">{client.companyName}</h4>
            <p className="text-blue-300 text-sm mb-3">{client.adminEmail}</p>
            
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center space-x-1 text-gray-300">
                <Building2 className="w-4 h-4" />
                <span>{product?.name || client.vynloProduct}</span>
              </span>
              
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                client.status === 'ACTIVE' 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {client.status === 'ACTIVE' ? 'Ativo' : 'Suspenso'}
              </span>

              {client.lastLogin && (
                <span className="text-gray-400 text-xs">
                  Último login: {new Date(client.lastLogin).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onView}
            className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition-colors"
            title="Ver detalhes"
          >
            <Eye className="w-5 h-5 text-blue-400" />
          </button>
          {client.status === 'ACTIVE' ? (
            <button
              onClick={onSuspend}
              className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg transition-colors"
              title="Suspender"
            >
              <Ban className="w-5 h-5 text-red-400" />
            </button>
          ) : (
            <button
              onClick={onActivate}
              className="p-2 bg-green-600/20 hover:bg-green-600/40 rounded-lg transition-colors"
              title="Ativar"
            >
              <Unlock className="w-5 h-5 text-green-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Modal({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-blue-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        {children}
      </div>
    </div>
  )
}

function DetailRow({ label, value, badge }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-blue-500/10">
      <span className="text-gray-400 font-medium">{label}</span>
      {badge ? (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          badge === 'success' 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
            : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {value}
        </span>
      ) : (
        <span className="text-white font-semibold">{value}</span>
      )}
    </div>
  )
}

