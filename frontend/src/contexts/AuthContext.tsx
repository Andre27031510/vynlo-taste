'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { getAuthInstance } from '@/config/firebase';
import { trackLogin, trackLogout, trackError, trackEvent } from '@/config/firebase';
import { API_CONFIG } from '@/config/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ CORRETO: useQueryClient chamado no top level do componente
  const queryClient = useQueryClient();

  useEffect(() => {
    // Inicializar Firebase apenas quando o AuthProvider for montado
    const initializeAuth = async () => {
      const auth = getAuthInstance();
      if (!auth) {
        console.warn('Firebase Auth não inicializado no AuthContext');
        setLoading(false);
        return;
      }
      
      // Configurar persistence para manter sessão no navegador
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log('✅ Firebase persistence configurada');
      } catch (error) {
        console.error('❌ Erro ao configurar persistence:', error);
      }
      
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return unsubscribe;
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const auth = getAuthInstance();
    if (!auth) throw new Error('Firebase não inicializado');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await trackLogin('email_password', result.user.uid);
      await trackEvent('auth_login_success', {
        method: 'email_password',
        user_id: result.user.uid,
        timestamp: Date.now()
      });
    } catch (error: any) {
      await trackError(`Login failed: ${error?.code || 'unknown'}`, 'AuthContext');
      await trackEvent('auth_login_failed', {
        method: 'email_password',
        error_code: error?.code || 'unknown',
        timestamp: Date.now()
      });
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    const auth = getAuthInstance();
    if (!auth) throw new Error('Firebase não inicializado');
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Sincronizar usuário com backend automaticamente
      await syncUserWithBackend(result.user);
      
      await trackEvent('auth_register_success', {
        method: 'email_password',
        user_id: result.user.uid,
        timestamp: Date.now()
      });
    } catch (error: any) {
      await trackError(`Register failed: ${error?.code || 'unknown'}`, 'AuthContext');
      await trackEvent('auth_register_failed', {
        method: 'email_password',
        error_code: error?.code || 'unknown',
        timestamp: Date.now()
      });
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const auth = getAuthInstance();
    if (!auth) throw new Error('Firebase não inicializado');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Sincronizar usuário com backend automaticamente (apenas se for novo usuário)
      await syncUserWithBackend(result.user);
      
      await trackLogin('google', result.user.uid);
      await trackEvent('auth_login_success', {
        method: 'google',
        user_id: result.user.uid,
        timestamp: Date.now()
      });
    } catch (error: any) {
      await trackError(`Google login failed: ${error?.code || 'unknown'}`, 'AuthContext');
      await trackEvent('auth_login_failed', {
        method: 'google',
        error_code: error?.code || 'unknown',
        timestamp: Date.now()
      });
      console.error('Erro no login com Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    const auth = getAuthInstance();
    if (!auth) throw new Error('Firebase não inicializado');
    try {
      const currentUser = user;
      const currentUserUid = currentUser?.uid;
      
      // ✅ MULTI-TENANT FIX: Limpar cache do React Query ANTES do logout
      try {
        // 1. Limpar TODO o cache do React Query
        queryClient.clear();
        console.log('✅ React Query cache limpo no logout');
        
        // 2. Limpar localStorage do tenant atual
        if (currentUserUid) {
          clearTenantStorageOnLogout(currentUserUid);
        }
      } catch (error) {
        console.warn('Aviso: Erro ao limpar cache no logout:', error);
        // Não bloqueia o logout se houver erro
      }
      
      // ✅ MULTI-TENANT FIX: Chamar endpoint de logout no backend
      // Backend envia header Clear-Site-Data para limpar caches do navegador
      try {
        const { apiRequest } = await import('@/services/api');
        const token = await currentUser?.getIdToken();
        
        if (token) {
          await apiRequest('core-service', 'v1/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('✅ Backend logout executado (Clear-Site-Data enviado)');
        }
      } catch (error) {
        console.warn('Aviso: Erro ao chamar backend logout:', error);
        // Não bloqueia o logout se houver erro
      }
      
      // Fazer logout do Firebase
      await signOut(auth);
      await trackLogout();
      await trackEvent('auth_logout_success', {
        user_id: currentUser?.uid || 'unknown',
        timestamp: Date.now()
      });
      
      console.log('✅ Logout completo: Firebase + Backend + Cache limpo');
    } catch (error: any) {
      await trackError(`Logout failed: ${error?.code || 'unknown'}`, 'AuthContext');
      await trackEvent('auth_logout_failed', {
        error_code: error?.code || 'unknown',
        timestamp: Date.now()
      });
      console.error('Erro no logout:', error);
      throw error;
    }
  };
  
  // ✅ MULTI-TENANT: Helper para limpar localStorage do tenant no logout
  const clearTenantStorageOnLogout = (tenantKey: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      const keysToRemove: string[] = [];
      
      // Encontrar todas as chaves relacionadas ao tenant
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('vynlo-') && key.includes(`:${tenantKey}`)) {
          keysToRemove.push(key);
        }
      }
      
      // Remover todas as chaves
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removido no logout: ${key}`);
      });
      
      if (keysToRemove.length > 0) {
        console.log(`✅ ${keysToRemove.length} entradas de localStorage limpas no logout`);
      }
    } catch (error) {
      console.warn('Erro ao limpar localStorage no logout:', error);
    }
  };

  // Função para sincronizar usuário Firebase com backend
  const syncUserWithBackend = async (firebaseUser: User) => {
    try {
      const { apiRequest } = await import('@/services/api')
      const response = await apiRequest('core-service', 'v1/users/sync-firebase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
        },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL,
          creationTime: firebaseUser.metadata.creationTime,
          lastSignInTime: firebaseUser.metadata.lastSignInTime
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Falha na sincronização com backend:', errorData);
        // Não falha o registro/login se a sincronização falhar
        return;
      }

      const userData = await response.json();
      console.log('Usuário sincronizado com backend:', userData);
      
      // Track evento de sincronização
      await trackEvent('user_sync_success', {
        user_id: firebaseUser.uid,
        backend_user_id: userData.id,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.warn('Erro na sincronização com backend:', error);
      // Track erro de sincronização
      await trackError(`User sync failed: ${error}`, 'AuthContext');
      // Não falha o registro/login se a sincronização falhar
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};