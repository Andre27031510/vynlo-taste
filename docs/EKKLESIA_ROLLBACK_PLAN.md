# Plano de Rollback - Sistema Ekklesia
<!-- touch: redeploy note (commit 0b28909) - comentário leve sem impacto funcional - atualizado para forçar push -->

**Data de criação:** 2025-10-28  
**Última atualização:** 2025-10-28  
**Sistema:** Vynlo Ekklesia (rotas e deploy)

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Cenários de Rollback](#cenários-de-rollback)
4. [Procedimento de Rollback](#procedimento-de-rollback)
5. [Validação Pós-Rollback](#validação-pós-rollback)
6. [Prevenção](#prevenção)

---

## 🎯 Visão Geral

Este documento descreve o procedimento de rollback para o sistema Ekklesia após as correções de roteamento implementadas nas **Fases 1-7**.

### Contexto das Mudanças

- **Fase 1:** Removido `/api` dos `@RequestMapping` dos controllers Ekklesia
- **Fase 2:** Parametrizado tags no `docker-compose.prod.yml` para usar commit SHA
- **Fase 3:** Adicionados testes automatizados de roteamento
- **Fase 4:** Implementadas métricas de observabilidade (404 em rotas Ekklesia)
- **Fase 5:** Adicionada validação pós-deploy
- **Fase 6:** Hardening CI (verificação de padrão de rotas)
- **Fase 7:** Este documento de rollback

### Impacto

- **Crítico:** Endpoints Ekklesia inacessíveis (404)
- **Alto:** Frontend não consegue carregar dados
- **Médio:** Usuários não conseguem usar funcionalidades

---

## ✅ Pré-requisitos

### 1. Acesso ao Servidor

```bash
ssh ubuntu@IP_DO_SERVIDOR
cd ~/app
```

### 2. Identificar Versão Atual

```bash
# Ver commit SHA atual do backend
docker inspect vynlo-backend | grep -i image

# Ver logs para identificar commit
docker logs vynlo-backend --tail 50 | grep -i "commit\|sha\|version"
```

### 3. Identificar Versão Anterior (Rollback Target)

```bash
# Ver histórico de commits (último commit antes das mudanças)
git log --oneline -10

# Ou ver tags disponíveis no registry
docker manifest inspect ghcr.io/andre27031510/vynlotaste-backend:COMMIT_SHA_ANTERIOR
```

### 4. Backup Automático

O deploy atual cria backup automático antes de iniciar:
```bash
# Verificar backups disponíveis
ls -lh backup-pre-deploy-*.sql
```

---

## 🚨 Cenários de Rollback

### Cenário 1: Endpoints Ekklesia retornando 404

**Sintomas:**
- Frontend mostra erro 404 ao carregar `/api/v1/ekklesia/*`
- Logs do backend mostram `status=404` para rotas Ekklesia

**Causa provável:**
- Controllers não foram deployados corretamente
- Problema com mapeamento de rotas

**Ação:** Rollback completo do backend

---

### Cenário 2: Erro 401 (Unauthorized) após deploy

**Sintomas:**
- Requisições autenticadas retornam 401
- Firebase Auth não está funcionando

**Causa provável:**
- Mudanças no SecurityConfig ou JWT filter
- Problema com configuração de Firebase

**Ação:** Rollback do backend + verificar configurações

---

### Cenário 3: Frontend não carrega após deploy

**Sintomas:**
- Frontend retorna erro 500 ou não inicia
- Build falhou silenciosamente

**Causa provável:**
- Erro de build no frontend
- Variáveis de ambiente ausentes

**Ação:** Rollback do frontend apenas

---

### Cenário 4: Database Migration falhou

**Sintomas:**
- Backend não inicia
- Logs mostram erro de migration Flyway

**Causa provável:**
- Migration conflitante ou mal formada
- Índice duplicado ou constraint violado

**Ação:** Rollback do backend + rollback manual da migration

---

## 🔄 Procedimento de Rollback

### Rollback Completo (Backend + Frontend)

```bash
# 1. Fazer backup do banco (extra segurança)
docker exec vynlo-postgres pg_dump -U vynlo_user vynlotaste > backup-pre-rollback-$(date +%Y%m%d-%H%M%S).sql

# 2. Identificar commit SHA anterior (target do rollback)
PREVIOUS_COMMIT="SHA_DO_COMMIT_ANTERIOR"  # Substituir pelo SHA real

# 3. Parar serviços (Zero Downtime - apenas apps)
docker compose -f docker-compose.prod.yml stop backend frontend

# 4. Exportar tags do commit anterior
export BACKEND_TAG="$PREVIOUS_COMMIT"
export FRONTEND_TAG="$PREVIOUS_COMMIT"

# 5. Baixar imagens da versão anterior
docker pull ghcr.io/andre27031510/vynlotaste-backend:$PREVIOUS_COMMIT
docker pull ghcr.io/andre27031510/vynlotaste-frontend:$PREVIOUS_COMMIT

# 6. Iniciar containers com versão anterior
docker compose -f docker-compose.prod.yml up -d backend frontend --remove-orphans

# 7. Aguardar inicialização
sleep 30

# 8. Verificar saúde dos serviços
curl -f http://localhost:8080/api/actuator/health || echo "❌ Backend não respondeu"
curl -f http://localhost:3000 || echo "❌ Frontend não respondeu"
```

---

### Rollback Apenas Backend

```bash
# Se apenas o backend tem problema
PREVIOUS_COMMIT="SHA_DO_COMMIT_ANTERIOR"

docker compose -f docker-compose.prod.yml stop backend
export BACKEND_TAG="$PREVIOUS_COMMIT"
docker pull ghcr.io/andre27031510/vynlotaste-backend:$PREVIOUS_COMMIT
docker compose -f docker-compose.prod.yml up -d backend

# Aguardar e validar
sleep 30
curl -f http://localhost:8080/api/actuator/health
```

---

### Rollback Apenas Frontend

```bash
# Se apenas o frontend tem problema
PREVIOUS_COMMIT="SHA_DO_COMMIT_ANTERIOR"

docker compose -f docker-compose.prod.yml stop frontend
export FRONTEND_TAG="$PREVIOUS_COMMIT"
docker pull ghcr.io/andre27031510/vynlotaste-frontend:$PREVIOUS_COMMIT
docker compose -f docker-compose.prod.yml up -d frontend

# Aguardar e validar
sleep 10
curl -f http://localhost:3000
```

---

### Rollback de Migration (Database)

⚠️ **CRÍTICO:** Só executar se migration causou problema irreversível

```bash
# 1. Conectar ao banco
docker exec -it vynlo-postgres psql -U vynlo_user -d vynlotaste

# 2. Verificar migrations aplicadas
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;

# 3. Remover migration problemática (exemplo: V24)
-- CUIDADO: Isso remove a migration do histórico
DELETE FROM flyway_schema_history WHERE version = '24';

# 4. Reverter mudanças manuais (exemplo: se V24 criou tabela)
DROP TABLE IF EXISTS departments CASCADE;

# 5. Reiniciar backend (irá aplicar migrations válidas)
docker compose -f docker-compose.prod.yml restart backend
```

---

## ✅ Validação Pós-Rollback

### 1. Health Checks

```bash
# Backend
curl -f http://localhost:8080/api/actuator/health
# Esperado: {"status":"UP"}

# Frontend
curl -f http://localhost:3000
# Esperado: HTML da página inicial
```

### 2. Endpoints Ekklesia

```bash
# Testar rotas principais (deve retornar 401, não 404)
curl -i http://localhost:8080/api/v1/ekklesia/churches
curl -i http://localhost:8080/api/v1/ekklesia/members
curl -i http://localhost:8080/api/v1/ekklesia/events

# Esperado: HTTP 401 {"error":"Unauthorized"} (rota mapeada)
# ❌ NÃO esperado: HTTP 404 (rota não mapeada)
```

### 3. Logs

```bash
# Verificar logs recentes
docker logs vynlo-backend --tail 50 | grep -i "error\|exception\|started"
docker logs vynlo-frontend --tail 50
```

### 4. Métricas Prometheus

```bash
# Verificar métricas de 404 Ekklesia (deve estar zerado)
curl http://localhost:8080/api/actuator/prometheus | grep "ekklesia_routing_404"
```

---

## 🛡️ Prevenção

### Checklist Pré-Deploy

- [ ] Testes unitários passando (`mvn test`)
- [ ] Verificação de roteamento no CI passou (Fase 6)
- [ ] Backup automático configurado
- [ ] Tags do commit SHA configuradas no docker-compose

### Checklist Pós-Deploy

- [ ] Health checks passando
- [ ] Endpoints Ekklesia retornando 401 (não 404)
- [ ] Frontend carregando corretamente
- [ ] Sem erros críticos nos logs
- [ ] Métricas Prometheus sem picos anômalos

### Monitoramento Contínuo

- **Prometheus:** `rate(ekklesia_routing_404_total[5m]) > 0` → Alerta se 404 > 0
- **Grafana:** Dashboard de rotas Ekklesia
- **Logs:** Filtrar `status=404` e `uri=/api/v1/ekklesia/*`

---

## 📞 Contatos de Emergência

- **Backend:** Verificar logs em `/var/log/vynlo-backend/`
- **Frontend:** Verificar logs em `/var/log/vynlo-frontend/`
- **Database:** Acessar via `docker exec -it vynlo-postgres psql -U vynlo_user vynlotaste`

---

## 📝 Notas Adicionais

### O que NÃO fazer durante rollback:

1. ❌ **NÃO** remover volumes do Docker (perde dados)
2. ❌ **NÃO** resetar o banco sem backup
3. ❌ **NÃO** fazer rollback de múltiplas versões de uma vez
4. ❌ **NÃO** ignorar warnings dos health checks

### O que fazer durante rollback:

1. ✅ Documentar o problema encontrado
2. ✅ Criar issue no GitHub com detalhes
3. ✅ Verificar logs antes e depois do rollback
4. ✅ Testar funcionalidades críticas manualmente

---

**Última revisão:** 2025-10-28  
**Próxima revisão:** Após próximo deploy de produção

