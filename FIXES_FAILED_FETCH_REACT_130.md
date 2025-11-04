# Correções Aplicadas: Failed to Fetch e React Error #130
<!-- touch: redeploy note (commit 0b28909) - comentário leve sem impacto funcional - atualizado para forçar push -->

**Data:** 2025-10-30  
**Status:** ✅ Implementado seguindo padrões Big Tech

---

## 📋 Problemas Identificados

1. **Failed to fetch**: Todas as chamadas API retornando erro de rede
2. **React Error #130**: Chunks/components não carregando após falha de rede
3. **URL Builder**: Possível duplicação de `/api` nas URLs
4. **CORS**: Configuração pode não incluir todos os subdomínios necessários
5. **Variáveis de ambiente**: `NEXT_PUBLIC_API_URL` não validado no build

---

## ✅ Correções Implementadas (Padrão Big Tech)

### 1. Frontend - Service Discovery e URL Builder (`api.ts`)

**Problema:** Duplicação potencial de `/api` e falta de validação

**Solução:**
- ✅ Normalização robusta de URL (remove `/api` duplicado)
- ✅ Validação fail-fast de variáveis de ambiente (server-side)
- ✅ Detecção inteligente de ambiente (produção vs desenvolvimento)
- ✅ Validação de URL duplicada em desenvolvimento

**Arquivos modificados:**
- `frontend/src/services/api.ts` (linhas 7-42, 209-228)

---

### 2. Frontend - Tratamento de Erros Estruturado (`api.ts`)

**Problema:** Erros genéricos sem diferenciação de causa raiz

**Solução:**
- ✅ Classificação de erros: `NETWORK`, `DNS`, `CORS`, `TIMEOUT`
- ✅ Logging estruturado (padrão Datadog/Sentry)
- ✅ Erros enriquecidos para Error Boundary
- ✅ Diferenciação para observabilidade

**Arquivos modificados:**
- `frontend/src/services/api.ts` (linhas 427-477)

---

### 3. Frontend - Circuit Breaker Melhorado (`api.ts`)

**Problema:** Circuit breaker não diferenciava tipos de erro

**Solução:**
- ✅ Não conta erros CORS (requer correção de config, não retry)
- ✅ Não conta erros 4xx (validação/auth)
- ✅ Conta apenas erros recuperáveis (NETWORK, DNS, TIMEOUT, 5xx)

**Arquivos modificados:**
- `frontend/src/services/api.ts` (linhas 97-129)

---

### 4. Frontend - Error Boundary Global (`layout.tsx`)

**Problema:** React #130 não capturado no nível raiz

**Solução:**
- ✅ Error Boundary no root layout
- ✅ Classificação de erros (NETWORK, CHUNK_LOAD, REACT_130)
- ✅ Limpeza automática de cache para ChunkLoadError
- ✅ Mensagens específicas por tipo de erro
- ✅ Retry automático com limite

**Arquivos modificados:**
- `frontend/src/app/layout.tsx` (linhas 119-154)
- `frontend/src/components/ErrorBoundary.tsx` (linhas 33-89, 156-175)

---

### 5. Frontend - Validação Fail-Fast no Build (`next.config.js`)

**Problema:** Build não falhava se `NEXT_PUBLIC_API_URL` estivesse incorreto

**Solução:**
- ✅ Validação de URL obrigatória em produção
- ✅ Validação de formato (deve ser http:// ou https://)
- ✅ Warning se URL terminar com `/api` (buildApiUrl adiciona)
- ✅ Mensagens de erro claras e acionáveis

**Arquivos modificados:**
- `frontend/next.config.js` (linhas 34-73)

---

### 6. Backend - CORS Expandido (`SecurityConfig.java`)

**Problema:** CORS pode não incluir todos os subdomínios necessários

**Solução:**
- ✅ Padrão `https://*.vynlotech.com` (todos os subdomínios)
- ✅ Padrão `https://*.vynlotaste.com` (todos os subdomínios)
- ✅ Suporte a origem customizada via `CORS_ALLOWED_ORIGIN`
- ✅ Localhost para desenvolvimento

**Arquivos modificados:**
- `backend/core-module/src/main/java/com/vynlotaste/config/SecurityConfig.java` (linhas 166-187)

---

### 7. Backend - Firebase Resiliente (`FirebaseConfig.java`)

**Problema:** Backend não iniciava se Firebase não estivesse configurado

**Solução:**
- ✅ Modo degradado: aplicação inicia sem Firebase
- ✅ Health checks funcionam independentemente
- ✅ Autenticação falha graciosamente (401) até Firebase ser configurado
- ✅ Fail-fast opcional via `FIREBASE_REQUIRED=true`

**Arquivos modificados:**
- `backend/core-module/src/main/java/com/vynlotaste/config/FirebaseConfig.java`

---

### 8. CI/CD - Validação de Variáveis (`ci-cd-v2.yml`)

**Problema:** Workflow não validava variáveis críticas antes do build

**Solução:**
- ✅ Comentários sobre formato de `NEXT_PUBLIC_API_URL`
- ✅ Documentação inline sobre não incluir `/api`

**Arquivos modificados:**
- `.github/workflows/ci-cd-v2.yml` (linhas 201-204)

---

## 🔍 Próximos Passos de Investigação

### No Servidor (SSH)

```bash
# 1. Verificar status dos containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 2. Health check do backend
curl -fsS http://localhost:8080/api/actuator/health

# 3. Logs do backend (últimas 200 linhas)
docker logs vynlo-backend --tail 200 | grep -i "error\|exception\|started"

# 4. Logs do frontend
docker logs vynlo-frontend --tail 100

# 5. Verificar conectividade do backend externamente
curl -vk https://api.vynlotech.com/api/actuator/health
```

### Validação de Variáveis

**Verificar se `NEXT_PUBLIC_API_URL` está configurado no GitHub Secrets:**
- Deve ser: `https://api.vynlotech.com` (SEM `/api` no final)
- ❌ ERRADO: `https://api.vynlotech.com/api`
- ✅ CORRETO: `https://api.vynlotech.com`

### Teste de CORS

**No navegador (DevTools → Network):**
1. Filtrar requisições para `v1/ekklesia`
2. Verificar se há erros CORS (vermelho com mensagem "CORS error")
3. Verificar headers `Access-Control-Allow-Origin` na resposta

---

## 📊 Observabilidade

### Métricas Adicionadas

1. **Frontend:**
   - Classificação de erros por tipo (NETWORK, DNS, CORS, TIMEOUT)
   - Circuit breaker state por origem
   - Logging estruturado para integração com Sentry/Datadog

2. **Backend:**
   - Firebase health status
   - CORS origins permitidas (via logs)

### Dashboards Recomendados

- **Grafana:**
  - Taxa de `Failed to fetch` por tipo
  - Circuit breaker state por origem
  - Health check status do backend

- **Sentry/Datadog:**
  - Erros classificados por tipo
  - React #130 incidents
  - CORS errors (requer correção de config)

---

## 🛡️ Segurança e Padrões Big Tech

### Implementado

1. ✅ **Fail-fast validation**: Build falha se variáveis críticas ausentes
2. ✅ **Graceful degradation**: Aplicação funciona mesmo sem Firebase (health checks)
3. ✅ **Error taxonomy**: Classificação de erros para observabilidade
4. ✅ **Circuit breaker**: Isolamento por origem (Netflix pattern)
5. ✅ **Structured logging**: Pronto para integração com Sentry/Datadog
6. ✅ **Error boundaries**: Captura React #130 e erros de rede
7. ✅ **CORS flexível mas seguro**: Padrões wildcard para subdomínios

### Recomendações Futuras

1. **Credential helper Docker**: Configurar `pass` ou `aws ecr` helper
2. **Infrastructure-as-code**: Consolidar mudanças manuais no repositório
3. **Runbooks**: Documentar procedimentos de incidentes
4. **Alertas Prometheus**: Alert para health check < 5xx spike
5. **Integração Sentry/Datadog**: Enviar erros classificados do frontend

---

## 📝 Checklist Pós-Deploy

- [ ] Verificar health checks: `curl http://localhost:8080/api/actuator/health`
- [ ] Testar endpoints Ekklesia: `curl -i http://localhost:8080/api/v1/ekklesia/churches`
- [ ] Verificar CORS no DevTools (Network tab)
- [ ] Confirmar `NEXT_PUBLIC_API_URL` no GitHub Secrets (sem `/api`)
- [ ] Rebuild do frontend com variáveis corretas
- [ ] Monitorar logs para erros de rede/CORS
- [ ] Verificar React #130 não ocorre mais

---

**Última atualização:** 2025-10-30  
**Padrões aplicados:** Netflix, Uber, Spotify, Airbnb (Big Tech patterns)

