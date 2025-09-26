const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// 🚀 ENTERPRISE: Webhook automático para sincronização
exports.syncUserToBackend = functions.auth.user().onCreate(async (user) => {
  console.log('🔥 Novo usuário Firebase criado:', user.uid);
  
  try {
    const webhookUrl = process.env.BACKEND_WEBHOOK_URL || 'http://localhost:8080/api/api/v1/webhooks/firebase-auth';
    
    const payload = {
      eventType: 'user.create',
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        creationTime: user.metadata.creationTime
      }
    };
    
    const response = await axios.post(webhookUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log('✅ Usuário sincronizado:', response.status);
    
  } catch (error) {
    console.error('❌ Erro sincronizando:', error.message);
  }
});