# 🔒 **CONFIGURAÇÃO DE SEGURANÇA - VYNLO TASTE**

## ⚠️ **IMPORTANTE - ANTES DO DEPLOY**

### 🚨 **NUNCA COMMITAR:**
- Arquivos `.env` e `.env.local`
- Senhas ou tokens reais
- Chaves de API privadas
- Certificados ou chaves SSL

### ✅ **CONFIGURAÇÃO SEGURA:**

#### **1. Backend (.env)**
```bash
# Copiar arquivo exemplo
cp backend/.env.example backend/.env

# Editar com suas credenciais reais
nano backend/.env
```

#### **2. Frontend (.env.local)**
```bash
# Copiar arquivo exemplo
cp frontend/.env.local.example frontend/.env.local

# Editar com suas credenciais reais
nano frontend/.env.local
```

#### **3. Gerar Senhas Seguras:**
```bash
# JWT Secret (mínimo 32 caracteres)
openssl rand -base64 32

# Database Password
openssl rand -base64 16
```

### 🔐 **CREDENCIAIS NECESSÁRIAS:**

#### **Firebase:**
1. Acesse: https://console.firebase.google.com
2. Crie projeto ou use existente
3. Vá em Project Settings > General
4. Copie as configurações do SDK

#### **Database:**
- Use senha forte (mínimo 12 caracteres)
- Combine letras, números e símbolos
- Nunca use senhas padrão

#### **JWT Secret:**
- Mínimo 32 caracteres
- Use caracteres aleatórios
- Nunca reutilize em outros projetos

### 🛡️ **CHECKLIST DE SEGURANÇA:**

- [ ] Arquivo `.gitignore` configurado
- [ ] Arquivos `.env` não commitados
- [ ] Senhas fortes configuradas
- [ ] Firebase configurado corretamente
- [ ] JWT secret único gerado
- [ ] Variáveis de ambiente configuradas

### 🚀 **DEPLOY SEGURO:**

```bash
# 1. Verificar se .env não está no git
git status

# 2. Configurar variáveis no servidor
export DB_PASSWORD="sua_senha_segura"
export JWT_SECRET="seu_jwt_secret_seguro"

# 3. Deploy
./deploy/scripts/deploy-prod.sh
```

### 📞 **SUPORTE:**
- Email: security@vynlotaste.com
- Documentação: https://docs.vynlotaste.com/security