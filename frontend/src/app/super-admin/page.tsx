'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  UserGroupIcon, 
  PlusIcon, 
  CogIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function SuperAdminPanel() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClient, setNewClient] = useState({
    companyName: '',
    adminEmail: '',
    adminPassword: '',
    permissions: [] as string[]
  });

  const availablePermissions = [
    { id: 'manage_products', name: 'Gerenciar Produtos', icon: '📦' },
    { id: 'manage_orders', name: 'Gerenciar Pedidos', icon: '📋' },
    { id: 'manage_customers', name: 'Gerenciar Clientes', icon: '👥' },
    { id: 'view_reports', name: 'Visualizar Relatórios', icon: '📊' },
    { id: 'manage_financial', name: 'Gestão Financeira', icon: '💰' },
    { id: 'manage_delivery', name: 'Gestão de Entrega', icon: '🚚' },
    { id: 'manage_menu', name: 'Gerenciar Cardápio', icon: '🍽️' },
    { id: 'manage_team', name: 'Gerenciar Equipe', icon: '👨‍💼' }
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    user.getIdTokenResult().then((idTokenResult) => {
      if (!idTokenResult.claims.isSuperAdmin) {
        router.push('/login');
        return;
      }
      loadClients();
    }).catch(() => {
      router.push('/login');
    });
  }, [user]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/super-admin/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async () => {
    try {
      const response = await fetch('/api/v1/super-admin/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });

      if (response.ok) {
        alert('Cliente criado com sucesso!');
        setNewClient({ companyName: '', adminEmail: '', adminPassword: '', permissions: [] });
        loadClients();
      }
    } catch (error) {
      alert('Erro ao criar cliente');
    }
  };

  const togglePermission = (permission: string) => {
    setNewClient(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vynlo-light to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vynlo-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Profissional */}
      <header className="bg-white shadow-lg border-b-4 border-vynlo-primary">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-vynlo-primary to-vynlo-secondary p-3 rounded-xl">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin Panel</h1>
                <p className="text-sm text-gray-600">Vynlo Taste - Sistema de Gestão</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">Super Administrador</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-vynlo-primary">
            <div className="flex items-center">
              <div className="bg-vynlo-light p-3 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-vynlo-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CogIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Configuração</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-gray-900">98%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Criar Novo Cliente */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-vynlo-primary to-vynlo-secondary px-6 py-4">
            <div className="flex items-center space-x-3">
              <PlusIcon className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">Criar Novo Cliente</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome da empresa"
                  value={newClient.companyName}
                  onChange={(e) => setNewClient({...newClient, companyName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vynlo-primary focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                  Email do Administrador
                </label>
                <input
                  type="email"
                  placeholder="admin@empresa.com"
                  value={newClient.adminEmail}
                  onChange={(e) => setNewClient({...newClient, adminEmail: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vynlo-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <KeyIcon className="h-4 w-4 inline mr-1" />
                Senha do Administrador
              </label>
              <input
                type="password"
                placeholder="Digite uma senha segura"
                value={newClient.adminPassword}
                onChange={(e) => setNewClient({...newClient, adminPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vynlo-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <UserGroupIcon className="h-4 w-4 inline mr-1" />
                Funcionalidades Permitidas
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {availablePermissions.map(permission => (
                  <label key={permission.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={newClient.permissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="h-4 w-4 text-vynlo-primary focus:ring-vynlo-primary border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm">
                      <span className="mr-2">{permission.icon}</span>
                      {permission.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={createClient}
              className="bg-gradient-to-r from-vynlo-primary to-vynlo-secondary text-white px-8 py-3 rounded-lg hover:from-vynlo-dark hover:to-vynlo-primary transition-all duration-200 font-medium shadow-lg"
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              Criar Cliente
            </button>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">Clientes Cadastrados</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vynlo-primary"></div>
                <span className="ml-3 text-gray-600">Carregando clientes...</span>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrador</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionalidades</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <BuildingOfficeIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p>Nenhum cliente cadastrado ainda</p>
                        <p className="text-sm">Crie o primeiro cliente usando o formulário acima</p>
                      </td>
                    </tr>
                  ) : (
                    clients.map(client => (
                      <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-vynlo-light p-2 rounded-lg mr-3">
                              <BuildingOfficeIcon className="h-5 w-5 text-vynlo-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{client.companyName}</div>
                              <div className="text-sm text-gray-500">ID: {client.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.adminEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-vynlo-light text-vynlo-dark">
                            {client.permissions?.length || 0} funcionalidades
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Ativo
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-vynlo-primary hover:text-vynlo-dark mr-4 transition-colors duration-200">
                            <PencilIcon className="h-4 w-4 inline mr-1" />
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
                            <XCircleIcon className="h-4 w-4 inline mr-1" />
                            Suspender
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}