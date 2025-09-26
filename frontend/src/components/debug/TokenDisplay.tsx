'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const TokenDisplay: React.FC = () => {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const firebaseToken = await user.getIdToken();
      setToken(firebaseToken);
      console.log('🎫 TOKEN FIREBASE:', firebaseToken);
      console.log(' UID:', user.uid);
      console.log('📧 Email:', user.email);
    } catch (error) {
      console.error('Erro ao obter token:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      alert('Token copiado para a área de transferência!');
    }
  };

  if (!user) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#ff6b6b',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 9999,
        fontSize: '14px'
      }}>
        ❌ Não logado
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#28a745',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '300px',
      fontSize: '14px'
    }}>
      <div>✅ Logado: {user.email}</div>
      <button 
        onClick={getToken}
        disabled={loading}
        style={{
          background: loading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginTop: '5px'
        }}
      >
        {loading ? '⏳ Carregando...' : '🔑 Obter Token'}
      </button>
      {token && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '12px', marginBottom: '5px' }}>
            Token: {token.substring(0, 20)}...
          </div>
          <button 
            onClick={copyToken}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '2px 5px',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            📋 Copiar Token
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenDisplay;
