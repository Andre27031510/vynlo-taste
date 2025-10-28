'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDebounce } from '@/hooks/useDebounce';
import { trackLogin, trackError, trackPerformance, trackEvent } from '@/config/firebase';

// Validation schema - memoized to prevent recreation
const loginSchema = yup.object({
  email: yup
    .string()
    .required('E-mail é obrigatório')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Digite um e-mail válido'
    ),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
});

// Form options - memoized to prevent recreation
const formOptions = {
  resolver: yupResolver(loginSchema),
  mode: 'onChange' as const,
  reValidateMode: 'onChange' as const
};

type LoginFormData = {
  email: string;
  password: string;
};

const LoginForm = memo(function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasBackHistory, setHasBackHistory] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();
  
  // Verificar se existe histórico de navegação
  useEffect(() => {
    // Verificar se há histórico de navegação válido
    if (typeof window !== 'undefined' && window.history.length > 1) {
      setHasBackHistory(true);
    }
  }, []);
  
  // Função para voltar à página anterior
  const handleGoBack = useCallback(() => {
    if (hasBackHistory && typeof window !== 'undefined') {
      router.back(); // Usa a API do navegador para voltar
    } else {
      router.push('/'); // Fallback para homepage se não houver histórico
    }
  }, [hasBackHistory, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
    trigger
  } = useForm<LoginFormData>(formOptions);

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');
  const debouncedEmail = useDebounce(watchedEmail, 500);
  const debouncedPassword = useDebounce(watchedPassword, 500);

  // Real-time validation with debounce - optimized
  useEffect(() => {
    if (debouncedEmail && touchedFields.email) {
      trigger('email');
      
      // Track email validation
      if (errors.email) {
        trackEvent('form_validation_error', {
          field: 'email',
          error: errors.email.message,
          timestamp: Date.now()
        });
      }
    }
  }, [debouncedEmail, trigger, touchedFields.email, errors.email]);

  useEffect(() => {
    if (debouncedPassword && touchedFields.password) {
      trigger('password');
      
      // Track password validation
      if (errors.password) {
        trackEvent('form_validation_error', {
          field: 'password',
          error: errors.password.message,
          timestamp: Date.now()
        });
      }
    }
  }, [debouncedPassword, trigger, touchedFields.password, errors.password]);

  // Visual validation state helpers - memoized
  const getFieldState = useCallback((fieldName: keyof LoginFormData) => {
    const hasError = errors[fieldName];
    const isTouched = touchedFields[fieldName];
    const hasValue = fieldName === 'email' ? watchedEmail : watchedPassword;
    
    if (hasError && isTouched) return 'error';
    if (!hasError && isTouched && hasValue) return 'success';
    return 'default';
  }, [errors, touchedFields, watchedEmail, watchedPassword]);

  const getFieldClasses = useCallback((fieldName: keyof LoginFormData) => {
    const state = getFieldState(fieldName);
    const baseClasses = 'block w-full pl-12 pr-12 py-3.5 border rounded-xl focus:ring-2 transition-all duration-200 placeholder-blue-300 text-white bg-blue-800/30';
    
    switch (state) {
      case 'error':
        return `${baseClasses} border-red-400/60 focus:ring-red-400 focus:border-red-400 focus:bg-red-900/20`;
      case 'success':
        return `${baseClasses} border-green-400/60 focus:ring-green-400 focus:border-green-400 focus:bg-green-900/20`;
      default:
        return `${baseClasses} border-blue-400/30 focus:ring-blue-400 focus:border-blue-400 focus:bg-blue-700/40`;
    }
  }, [getFieldState]);

  // Toggle password visibility - memoized
  const togglePasswordVisibility = useCallback(async () => {
    const newState = !showPassword;
    setShowPassword(newState);
    
    // Track password visibility toggle
    await trackEvent('password_visibility_toggle', {
      action: newState ? 'show' : 'hide',
      timestamp: Date.now()
    });
  }, [showPassword]);

  // Memoized field states
  const emailState = useMemo(() => getFieldState('email'), [getFieldState]);
  const passwordState = useMemo(() => getFieldState('password'), [getFieldState]);
  const emailClasses = useMemo(() => getFieldClasses('email'), [getFieldClasses]);
  const passwordClasses = useMemo(() => getFieldClasses('password'), [getFieldClasses]);

  // Memoized aria-describedby values
  const emailAriaDescribedBy = useMemo(() => {
    return `${errors.email ? 'email-error' : ''} ${error ? 'login-error' : ''}`.trim() || undefined;
  }, [errors.email, error]);

  const passwordAriaDescribedBy = useMemo(() => {
    return `${errors.password ? 'password-error' : ''} ${error ? 'login-error' : ''}`.trim() || undefined;
  }, [errors.password, error]);

  useEffect(() => {
    if (user) {
      // Commit 4481aaf: Redirecionamento inteligente multi-tenant
      // Super Admin → /super-admin
      // Cliente por produto → /dashboard-{produto}
      user.getIdTokenResult().then(async (idTokenResult) => {
        const claims = idTokenResult.claims;
        
        // Redirecionamento inteligente por tipo de usuário
        let redirectPath = '/dashboard'; // Default
        let userRole = 'user';
        
        // PRIORIDADE 1: Super Admin (Vynlo Tech) - pode acessar qualquer produto
        if (claims.isSuperAdmin === true) {
          // Super Admin pode escolher o produto via vynloProduct claim
          const vynloProduct = (claims.vynloProduct as string)?.toUpperCase() || 'ALL';
          
          if (vynloProduct === 'EKKLESIA') {
            redirectPath = '/ekklesia/dashboard';
            userRole = 'super_admin';
          } else if (vynloProduct === 'ALL' || !vynloProduct) {
            redirectPath = '/super-admin';
            userRole = 'super_admin';
          } else {
            redirectPath = '/dashboard';
            userRole = 'super_admin';
          }
        }
        // PRIORIDADE 2: Cliente Admin - Redirecionar por produto Vynlo
        else if (claims.level === 'CLIENT_ADMIN' || claims.role === 'ADMIN') {
          const vynloProduct = (claims.vynloProduct as string)?.toUpperCase() || 'TASTE';
          
          switch (vynloProduct) {
            case 'TASTE':
              redirectPath = '/dashboard';
              break;
            case 'EKKLESIA':
              redirectPath = '/ekklesia/dashboard';
              break;
            case 'BOT':
              redirectPath = '/dashboard'; // TODO: Criar /dashboard-bot
              break;
            case 'SAUDE':
              redirectPath = '/dashboard'; // TODO: Criar /dashboard-saude
              break;
            case 'EDUCACAO':
              redirectPath = '/dashboard'; // TODO: Criar /dashboard-educacao
              break;
            default:
              redirectPath = '/dashboard'; // Fallback para Taste
          }
          
          userRole = 'client_admin';
        }
        // PRIORIDADE 3: Outros usuários (ADMIN, MANAGER, etc)
        else {
          redirectPath = '/dashboard';
          userRole = (claims.role as string)?.toLowerCase() || 'user';
        }
        
        // Track successful authentication and redirect
        await trackEvent('user_authenticated', {
          user_role: userRole,
          redirect_path: redirectPath,
          vynlo_product: (claims.vynloProduct as string) || 'taste',
          timestamp: Date.now()
        });
        
        router.push(redirectPath);
        setLoading(false);
      }).catch(async () => {
        // Track authentication error
        await trackError('Token validation failed', 'LoginForm');
        router.push('/dashboard');
        setLoading(false);
      });
    }
  }, [user, router]);

  // Track component mount
  useEffect(() => {
    trackEvent('login_form_viewed', {
      timestamp: Date.now(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      screen_resolution: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'unknown'
    });
  }, []);

  const getFirebaseErrorMessage = useCallback((errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado. Verifique o e-mail digitado.';
      case 'auth/wrong-password':
        return 'Senha incorreta. Tente novamente.';
      case 'auth/invalid-email':
        return 'E-mail inválido. Digite um e-mail válido.';
      case 'auth/user-disabled':
        return 'Esta conta foi desabilitada. Entre em contato com o suporte.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas de login. Tente novamente em alguns minutos.';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
      case 'auth/invalid-credential':
        return 'Credenciais inválidas. Verifique e-mail e senha.';
      case 'auth/operation-not-allowed':
        return 'Login com e-mail/senha não está habilitado.';
      case 'auth/weak-password':
        return 'Senha muito fraca. Use pelo menos 6 caracteres.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está em uso por outra conta.';
      case 'auth/requires-recent-login':
        return 'Por segurança, faça login novamente para continuar.';
      case 'auth/account-exists-with-different-credential':
        return 'Já existe uma conta com este e-mail usando outro método de login.';
      default:
        return 'Erro no login. Verifique suas credenciais e tente novamente.';
    }
  }, []);

  const onSubmit = useCallback(async (data: LoginFormData) => {
    const loginStartTime = performance.now();
    setLoading(true);
    setError('');

    // Track login attempt
    await trackEvent('login_attempt', {
      method: 'email_password',
      timestamp: Date.now()
    });

    try {
      await login(data.email, data.password);
      
      // Track successful login
      const loginDuration = performance.now() - loginStartTime;
      await trackLogin('email_password');
      await trackPerformance('login_duration', loginDuration, 'ms');
      await trackEvent('login_success', {
        method: 'email_password',
        duration: loginDuration,
        timestamp: Date.now()
      });
      
      // O redirecionamento será feito pelo useEffect quando o user for atualizado
    } catch (error: any) {
      const errorCode = error?.code || 'unknown';
      const errorMessage = getFirebaseErrorMessage(errorCode);
      const loginDuration = performance.now() - loginStartTime;
      
      // Track login error
      await trackError(`Login failed: ${errorCode}`, 'LoginForm');
      await trackEvent('login_failed', {
        error_code: errorCode,
        error_message: errorMessage,
        method: 'email_password',
        duration: loginDuration,
        timestamp: Date.now()
      });
      
      setError(errorMessage);
      console.error('Erro no login:', {
        code: errorCode,
        message: error?.message,
        email: data.email
      });
      setLoading(false);
    }
  }, [login, getFirebaseErrorMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-800 to-black flex">
      {/* Painel Esquerdo - Formulário de Login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Botão Voltar Mobile */}
          <div className="lg:hidden mb-4">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center text-blue-200 hover:text-white transition-colors duration-200"
              aria-label="Voltar à página anterior"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Voltar</span>
            </button>
          </div>
          
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
              <div 
                id="login-error"
                role="alert"
                aria-live="polite"
                className="mb-6 p-4 bg-red-900/50 border border-red-400 rounded-xl"
              >
                <span className="text-red-200 font-medium">{error}</span>
              </div>
            )}

            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
              noValidate
              aria-label="Formulário de login do sistema"
            >
              {/* Campo Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-blue-200 mb-2">
                  E-mail *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
                    <Mail className="h-5 w-5 text-blue-300" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className={emailClasses}
                    placeholder="seu@email.com"
                    aria-required="true"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={emailAriaDescribedBy}
                    aria-label="Digite seu endereço de e-mail"
                  />
                  {/* Validation Icon */}
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center" aria-hidden="true">
                    {emailState === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {emailState === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                </div>
                {/* Error Message */}
                {errors.email && (
                  <p 
                    id="email-error"
                    className="mt-2 text-sm text-red-400 font-medium"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Campo Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-blue-200 mb-2">
                  Senha *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
                    <Lock className="h-5 w-5 text-blue-300" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password')}
                    className={passwordClasses}
                    placeholder="••••••••••••"
                    aria-required="true"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={passwordAriaDescribedBy}
                    aria-label="Digite sua senha"
                  />
                  {/* Icons Container */}
                  <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-4">
                    {/* Validation Icon */}
                    <div aria-hidden="true">
                      {passwordState === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                      {passwordState === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    {/* Show/Hide Password */}
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-blue-300 hover:text-blue-100 focus:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-900 rounded transition-colors duration-200"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      aria-pressed={showPassword}
                      tabIndex={0}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {/* Error Message */}
                {errors.password && (
                  <p 
                    id="password-error"
                    className="mt-2 text-sm text-red-400 font-medium"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Lembrar Login */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    onChange={async (e) => {
                      await trackEvent('remember_me_toggle', {
                        checked: e.target.checked,
                        timestamp: Date.now()
                      });
                    }}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-900 border-blue-400 rounded bg-blue-800/30"
                    aria-describedby="remember-description"
                  />
                  <label htmlFor="remember" className="ml-3 block text-sm text-blue-200 font-medium">
                    Manter conectado
                  </label>
                  <span id="remember-description" className="sr-only">
                    Marque esta opção para permanecer logado no sistema
                  </span>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await trackEvent('forgot_password_clicked', {
                      timestamp: Date.now()
                    });
                  }}
                  className="text-sm text-blue-300 hover:text-blue-100 focus:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-900 rounded px-2 py-1 font-semibold transition-colors duration-200"
                  aria-label="Recuperar senha esquecida"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                aria-label={loading ? 'Processando login, aguarde' : 'Entrar no sistema'}
                aria-describedby={!isValid ? 'form-validation-message' : undefined}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" aria-hidden="true"></div>
                    <span>Entrando no Sistema...</span>
                    <span className="sr-only">Processando login, por favor aguarde</span>
                  </div>
                ) : (
                  <span>Entrar no Sistema</span>
                )}
              </button>
              
              {/* Form Validation Message for Screen Readers */}
              {!isValid && (touchedFields.email || touchedFields.password) && (
                <div id="form-validation-message" className="sr-only" aria-live="polite">
                  Corrija os erros no formulário antes de continuar
                </div>
              )}
            </form>
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
        {/* Botão Voltar Desktop */}
        <button
          onClick={handleGoBack}
          className="absolute top-4 left-4 inline-flex items-center text-blue-200 hover:text-white transition-colors duration-200 z-10"
          aria-label="Voltar à página anterior"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span className="font-medium">Voltar</span>
        </button>
        
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
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;

