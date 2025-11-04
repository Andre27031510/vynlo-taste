# 🔐 Rotação de Senha do Banco de Dados

**Data:** 2025-11-03  
**Versão:** 1.0.0  
**Autor:** Sistema Vynlo Taste

## 📋 Objetivo

Este documento descreve o processo completo de rotação de senha do banco de dados PostgreSQL, garantindo alinhamento entre:
- AWS Secrets Manager (`vynlo-taste-runtime-secrets`)
- PostgreSQL (`vynlo_user`)
- Docker Compose (`DB_PASSWORD`)

## ⚠️ Importante: Diferença entre Conexão Local e TCP

### Conexão Local (peer/trust) - NÃO VÁLIDA PARA TESTES
```bash
# ❌ NÃO USE: Esta conexão não valida senha (usa autenticação peer)
docker exec vynlo-postgres psql -U vynlo_user -d vynlotaste
```

**Por que não usar:**
- PostgreSQL usa autenticação `peer` ou `trust` para conexões locais
- **Senha não é validada** - pode conectar mesmo com senha errada
- Teste enganador: parece funcionar, mas senha está incorreta

### Conexão TCP - VÁLIDA PARA TESTES
```bash
# ✅ USE: Esta conexão valida senha via TCP
docker exec vynlo-postgres psql -h 127.0.0.1 -U vynlo_user -d vynlotaste
```

**Por que usar:**
- Força conexão TCP (não local socket)
- PostgreSQL valida senha via `md5` ou `scram-sha-256`
- Teste real: falha se senha estiver incorreta

## 🔄 Passo a Passo: Rotação de Senha

### Pré-requisitos

1. **AWS CLI configurado** (OIDC ou credenciais)
2. **Acesso ao container PostgreSQL** (via Docker)
3. **Permissões no AWS Secrets Manager** (atualizar secret)

### Fase 1: Verificar Senha Atual no AWS Secrets Manager

```bash
# Buscar senha atual do secret
aws secretsmanager get-secret-value \
  --secret-id vynlo-taste-runtime-secrets \
  --region us-east-1 \
  --query 'SecretString' --output text | \
  jq -r '.DB_PASSWORD'

# Ou sem jq:
aws secretsmanager get-secret-value \
  --secret-id vynlo-taste-runtime-secrets \
  --region us-east-1 \
  --query 'SecretString' --output text | \
  python3 -c "import sys, json; print(json.load(sys.stdin).get('DB_PASSWORD'))"
```

**Anote a senha atual** para referência.

### Fase 2: Gerar Nova Senha Segura

```bash
# Gerar senha segura (Linux/Mac)
openssl rand -base64 32

# Ou usar gerador online seguro
# Requisitos: mínimo 16 caracteres, incluir maiúsculas, minúsculas, números e símbolos
```

**Exemplo de senha segura:** `VynloTaste2024!NewPassword@123`

### Fase 3: Atualizar Senha no PostgreSQL

```bash
# 1. Conectar ao container PostgreSQL
docker exec -it vynlo-postgres psql -U vynlo_user -d vynlotaste

# 2. Alterar senha do usuário
ALTER USER vynlo_user WITH PASSWORD 'NovaSenhaSegura123!';

# 3. Verificar se alteração foi aplicada
\du vynlo_user

# 4. Sair do psql
\q
```

**⚠️ IMPORTANTE:** Substitua `NovaSenhaSegura123!` pela senha gerada na Fase 2.

### Fase 4: Testar Conexão com Nova Senha (via TCP)

```bash
# Testar conexão TCP com nova senha (validação real)
docker exec vynlo-postgres \
  psql -h 127.0.0.1 -U vynlo_user -d vynlotaste -c 'SELECT 1;' <<EOF
NovaSenhaSegura123!
EOF
```

**✅ Esperado:** Deve retornar `1` sem erros.

**❌ Se falhar:** Verifique:
- Senha foi alterada corretamente (Fase 3)
- Não há espaços extras na senha
- Container PostgreSQL está rodando

### Fase 5: Atualizar Secret no AWS Secrets Manager

```bash
# Buscar secret completo atual
FULL_SECRET=$(aws secretsmanager get-secret-value \
  --secret-id vynlo-taste-runtime-secrets \
  --region us-east-1 \
  --query 'SecretString' --output text)

# Extrair MAIL_PASSWORD (preservar)
MAIL_PASSWORD=$(echo "${FULL_SECRET}" | jq -r '.MAIL_PASSWORD')

# Atualizar secret com nova senha do banco
aws secretsmanager update-secret \
  --secret-id vynlo-taste-runtime-secrets \
  --secret-string "{\"DB_PASSWORD\":\"NovaSenhaSegura123!\",\"MAIL_PASSWORD\":\"${MAIL_PASSWORD}\"}" \
  --region us-east-1
```

**⚠️ IMPORTANTE:** 
- Substitua `NovaSenhaSegura123!` pela senha gerada na Fase 2
- Preserve `MAIL_PASSWORD` existente (não sobrescreva)

### Fase 6: Validar Alinhamento (Script Automático)

```bash
# Executar script de validação
./deploy/scripts/check-db-password.sh
```

**✅ Esperado:** 
```
✅ Senha validada com sucesso!
✅ Conexão TCP testada e funcionando
✅ Permissões do usuário: OK
🚀 Deploy pode prosseguir com segurança
```

**❌ Se falhar:** 
- Verifique Fase 3 (senha no PostgreSQL)
- Verifique Fase 5 (secret no AWS)
- Execute novamente o script

### Fase 7: Rerun do Deploy (Opcional)

Se o deploy foi interrompido pela validação de senha:

```bash
# No GitHub Actions, re-executar workflow
# Ou manualmente no servidor:
cd ~/app
docker compose -f docker-compose.prod.yml up -d backend frontend
```

## 🔍 Troubleshooting

### Erro: "Senha do banco não está alinhada com segredo AWS"

**Causa:** Senha no PostgreSQL não corresponde ao secret AWS.

**Solução:**
1. Verifique senha no PostgreSQL:
   ```bash
   docker exec vynlo-postgres psql -U vynlo_user -d vynlotaste -c "SELECT 1;"
   ```
2. Verifique senha no AWS:
   ```bash
   aws secretsmanager get-secret-value --secret-id vynlo-taste-runtime-secrets --region us-east-1 --query 'SecretString' --output text | jq -r '.DB_PASSWORD'
   ```
3. Alinhe conforme necessário (Fase 3 ou Fase 5)

### Erro: "Falha ao buscar secret"

**Causa:** Credenciais AWS inválidas ou secret não existe.

**Solução:**
1. Verificar credenciais AWS:
   ```bash
   aws sts get-caller-identity
   ```
2. Verificar se secret existe:
   ```bash
   aws secretsmanager describe-secret --secret-id vynlo-taste-runtime-secrets --region us-east-1
   ```
3. Verificar permissões IAM (role `GitHubActionsDeployRole`)

### Erro: "Container vynlo-postgres não está rodando"

**Causa:** Container PostgreSQL não está ativo.

**Solução:**
```bash
# Verificar status
docker ps -a | grep vynlo-postgres

# Iniciar se necessário
docker start vynlo-postgres

# Verificar logs
docker logs vynlo-postgres
```

## 📊 Checklist de Rotação

- [ ] Fase 1: Verificar senha atual no AWS Secrets Manager
- [ ] Fase 2: Gerar nova senha segura
- [ ] Fase 3: Atualizar senha no PostgreSQL (`ALTER USER`)
- [ ] Fase 4: Testar conexão TCP com nova senha
- [ ] Fase 5: Atualizar secret no AWS Secrets Manager
- [ ] Fase 6: Validar alinhamento (script `check-db-password.sh`)
- [ ] Fase 7: Rerun do deploy (se necessário)

## 🔒 Segurança

### Boas Práticas

1. **Nunca commitar senhas** no repositório
2. **Usar senhas complexas** (mínimo 16 caracteres, mistura de tipos)
3. **Rotacionar regularmente** (recomendado: a cada 90 dias)
4. **Validar via TCP** (não usar conexão local/peer)
5. **Testar antes de deploy** (usar script `check-db-password.sh`)

### Senha Segura

**Requisitos:**
- Mínimo 16 caracteres
- Incluir maiúsculas (A-Z)
- Incluir minúsculas (a-z)
- Incluir números (0-9)
- Incluir símbolos (!@#$%^&*)

**Exemplo:** `VynloTaste2024!Secure@Pass`

## 📚 Referências

- [AWS Secrets Manager - Rotating Secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html)
- [PostgreSQL - ALTER USER](https://www.postgresql.org/docs/current/sql-alteruser.html)
- [PostgreSQL - Authentication Methods](https://www.postgresql.org/docs/current/auth-methods.html)

## 🎯 Integração com CI/CD

O script `check-db-password.sh` é executado automaticamente no workflow CI/CD antes de parar containers, garantindo que:

1. ✅ Senha do banco está alinhada com AWS Secrets Manager
2. ✅ Deploy não prossegue com senha incorreta
3. ✅ Downtime é evitado (fail-fast)

**Localização no workflow:** `.github/workflows/ci-cd-v2.yml` (Fase 7 - Validação de Senha)

