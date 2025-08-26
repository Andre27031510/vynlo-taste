'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, TrendingUp, Users, Shield, Zap } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      // Fazer redirecionamento quando usuário estiver autenticado
      user.getIdTokenResult().then((idTokenResult) => {
        const claims = idTokenResult.claims;
        if (claims.isSuperAdmin) {
          router.push('/super-admin');
        } else {
          router.push('/dashboard');
        }
        setLoading(false);
      }).catch(() => {
        router.push('/dashboard');
        setLoading(false);
      });
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // O redirecionamento será feito pelo useEffect quando o user for atualizado
    } catch (error: any) {
      setError('Email ou senha incorretos');
      console.error('Erro no login:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-800 to-black flex">
      {/* Painel Esquerdo - Formulário de Login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Vynlo Taste
              </h1>
              <p className="text-blue-300 text-sm">Sistema de Delivery</p>
            </div>
          </div>
          
          {/* Caixa de Login */}
          <div className="bg-gradient-to-br from-blue-900/60 via-slate-900/80 to-black/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-400/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Acesso ao Sistema
              </h2>
              <p className="text-blue-200">
                Entre com suas credenciais para continuar
              </p>
            </div>

            {/* Erro de Login */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-400 rounded-xl">
                <span className="text-red-200 font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-blue-200 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-blue-300 text-white bg-blue-800/30 focus:bg-blue-700/40"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-blue-200 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-3.5 border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-blue-300 text-white bg-blue-800/30 focus:bg-blue-700/40"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-blue-100 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Lembrar Login */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-blue-400 rounded bg-blue-800/30"
                  />
                  <label htmlFor="remember" className="ml-3 block text-sm text-blue-200 font-medium">
                    Manter conectado
                  </label>
                </div>

                <button
                  type="button"
                  className="text-sm text-blue-300 hover:text-blue-100 font-semibold transition-colors duration-200"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Entrando no Sistema...
                  </div>
                ) : (
                  <span>Entrar no Sistema</span>
                )}
              </button>
            </form>

            {/* Usuários de Demonstração */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-center text-sm text-blue-200 mb-4 font-semibold">
                Contas de Teste:
              </p>
              <div className="space-y-2">
                <div className="bg-purple-800/40 rounded-lg p-3 text-center border border-purple-500/30">
                  <p className="text-xs text-purple-100">
                    <strong>👑 Super Admin:</strong> superadmin@vynlotaste.com | <strong>Senha:</strong> SuperVynlo2024!@#
                  </p>
                </div>
                <div className="bg-blue-800/40 rounded-lg p-3 text-center border border-blue-500/30">
                  <p className="text-xs text-blue-100">
                    <strong>Admin:</strong> admin@vynlotaste.com | <strong>Senha:</strong> AdminVynlo2024!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-blue-300">
              © 2024 Vynlo Taste - Sistema Empresarial
            </p>
          </div>
        </div>
      </div>

      {/* Painel Direito - Conteúdo Informativo */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center relative">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl border border-blue-300/30">
              <span className="text-white font-bold text-3xl">V</span>
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold text-white mb-2">
                Vynlo Taste
              </h1>
              <p className="text-blue-200 text-xl font-medium">
                Sistema Empresarial de Delivery
              </p>
            </div>
          </div>
          
          <div className="space-y-6 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-white leading-tight">
              Gerencie seu negócio com tecnologia avançada
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed">
              Plataforma completa para restaurantes e empresas de delivery com gestão integrada de pedidos, produtos, clientes e relatórios financeiros em tempo real.
            </p>
            
            <div className="pt-8">
              <div className="flex items-center justify-center space-x-8 text-blue-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm">Suporte</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1000+</div>
                  <div className="text-sm">Empresas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

