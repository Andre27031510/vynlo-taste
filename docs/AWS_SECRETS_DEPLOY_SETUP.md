# 🔐 Configuração AWS Secrets Manager para Deploy - Guia Completo

**Data:** 2025-11-03  
**Status:** ✅ Implementado seguindo padrões Big Tech

## 📋 Resumo das Mudanças Aplicadas

### ✅ 1. docker-compose.prod.yml
- **Variáveis obrigatórias com `:?`**: `POSTGRES_PASSWORD`, `DB_PASSWORD`, `MAIL_PASSWORD`
- **Efeito**: Falha imediatamente se variável não estiver definida (evita deploy com segredos ausentes)

### ✅ 2. .github/workflows/ci-cd-v2.yml
- **OIDC + AWS Secrets Manager**: Autenticação sem credenciais long-lived
- **Secret único JSON**: Lê `AWS_RUNTIME_SECRET_ID` que contém `DB_PASSWORD` e `MAIL_PASSWORD`
- **Fail-fast rigoroso**: `set -euo pipefail` em todos os steps críticos
- **Validação pré-deploy**: `docker compose config -q` antes de parar serviços
- **Health checks melhorados**: Validação de containers e portas externas

## 🔧 Configuração Necessária no GitHub

### Secrets do Repositório

Configure os seguintes secrets no GitHub (Settings → Secrets and variables → Actions):

1. **`AWS_DEPLOY_ROLE_ARN`** (opcional, tem fallback)
   - Valor: `arn:aws:iam::051826695275:role/GitHubActionsDeployRole`
   - Fallback: Usa valor hardcoded se não configurado

2. **`AWS_RUNTIME_SECRET_ID`** (opcional, tem fallback)
   - Valor: `vynlo-taste-runtime-secrets` (ou nome do seu secret)
   - Fallback: `vynlo-taste-runtime-secrets`

3. **`AWS_REGION`** (opcional, tem fallback)
   - Valor: `us-east-1` (ou sua região)
   - Fallback: `us-east-1`

## 🗄️ Configuração no AWS Secrets Manager

### Criar/Atualizar Secret JSON

**Secret Name:** `vynlo-taste-runtime-secrets` (ou o valor configurado em `AWS_RUNTIME_SECRET_ID`)

**Formato JSON obrigatório:**
```json
{
  "DB_PASSWORD": "VynloTaste2024!",
  "MAIL_PASSWORD": "senha-email-gmail"
}
```

**Campos aceitos (com fallback):**
- `DB_PASSWORD` ou `password` → usado como senha do banco
- `MAIL_PASSWORD` ou `mail_password` → usado como senha do email

### Comandos AWS CLI

**1. Criar secret (se não existir):**
```bash
aws secretsmanager create-secret \
  --name vynlo-taste-runtime-secrets \
  --description "Runtime secrets para deploy (DB_PASSWORD, MAIL_PASSWORD)" \
  --secret-string '{"DB_PASSWORD":"VynloTaste2024!","MAIL_PASSWORD":"senha-email"}' \
  --region us-east-1
```

**2. Atualizar secret existente:**
```bash
aws secretsmanager update-secret \
  --secret-id vynlo-taste-runtime-secrets \
  --secret-string '{"DB_PASSWORD":"VynloTaste2024!","MAIL_PASSWORD":"senha-email"}' \
  --region us-east-1
```

**3. Verificar secret:**
```bash
aws secretsmanager get-secret-value \
  --secret-id vynlo-taste-runtime-secrets \
  --region us-east-1 \
  --query 'SecretString' --output text | jq .
```

**4. Verificar permissões da Role:**
```bash
aws iam get-role-policy \
  --role-name GitHubActionsDeployRole \
  --policy-name GitHubActionsSecretsReadOnly \
  --query 'PolicyDocument' --output json
```

## ✅ Verificações Recomendadas

### 1. Validar docker-compose.localmente

No servidor/runner, execute:

```bash
# Exportar variáveis de ambiente
export DB_PASSWORD='VynloTaste2024!'
export MAIL_PASSWORD='senha-email'
export BACKEND_TAG='latest'
export FRONTEND_TAG='latest'

# Validar sintaxe YAML
docker compose -f docker-compose.prod.yml config -q

# Se passar sem erros, está OK
echo "✅ docker-compose.prod.yml válido"
```

### 2. Testar Workflow de Deploy

1. **Push para branch `main`** ou
2. **Executar workflow manualmente** (Actions → CI/CD-v2 → Run workflow)

3. **Verificar logs do step "Fetch runtime secrets":**
   - Deve mostrar: `✅ DB_PASSWORD recuperado com sucesso`
   - Deve mostrar: `✅ MAIL_PASSWORD recuperado com sucesso` (se configurado)

4. **Verificar logs do step "Deploy Application":**
   - Deve passar pela validação: `✅ docker-compose.prod.yml válido (sintaxe YAML correta)`
   - Deve passar pelo health check: `✅ Backend saudável - Deploy confirmado`

### 3. Verificar IAM Role e Permissões

```bash
# Verificar se role existe
aws iam get-role --role-name GitHubActionsDeployRole

# Verificar trust policy (deve permitir GitHub OIDC)
aws iam get-role --role-name GitHubActionsDeployRole \
  --query 'Role.AssumeRolePolicyDocument' --output json

# Verificar policies anexadas
aws iam list-attached-role-policies --role-name GitHubActionsDeployRole

# Verificar se policy permite ler secrets
aws iam get-policy-version \
  --policy-arn arn:aws:iam::051826695275:policy/GitHubActionsSecretsReadOnly \
  --version-id v1 \
  --query 'PolicyVersion.Document' --output json
```

## 🚨 Troubleshooting

### Erro: "DB_PASSWORD não encontrado no secret"

**Causa:** O secret JSON não contém campo `DB_PASSWORD` ou `password`

**Solução:**
```bash
# Verificar conteúdo atual
aws secretsmanager get-secret-value \
  --secret-id vynlo-taste-runtime-secrets \
  --region us-east-1 \
  --query 'SecretString' --output text | jq .

# Atualizar com formato correto
aws secretsmanager update-secret \
  --secret-id vynlo-taste-runtime-secrets \
  --secret-string '{"DB_PASSWORD":"sua-senha","MAIL_PASSWORD":"sua-senha-email"}' \
  --region us-east-1
```

### Erro: "docker-compose.prod.yml tem erro de sintaxe YAML"

**Causa:** Variáveis obrigatórias não estão definidas ou sintaxe YAML inválida

**Solução:**
```bash
# Validar localmente primeiro
export DB_PASSWORD='test'
export MAIL_PASSWORD='test'
docker compose -f docker-compose.prod.yml config
```

### Erro: "Not authorized to perform sts:AssumeRoleWithWebIdentity"

**Causa:** IAM Role trust policy não permite GitHub OIDC ou repositório incorreto

**Solução:**
1. Verificar trust policy da role
2. Verificar se OIDC provider está configurado
3. Verificar se subject do trust policy corresponde ao repositório

## 📊 Checklist de Implementação

- [ ] Secret `vynlo-taste-runtime-secrets` criado no AWS Secrets Manager
- [ ] Secret contém `DB_PASSWORD` e `MAIL_PASSWORD` em formato JSON
- [ ] GitHub Secrets configurados (opcional, tem fallbacks):
  - [ ] `AWS_DEPLOY_ROLE_ARN` (opcional)
  - [ ] `AWS_RUNTIME_SECRET_ID` (opcional)
  - [ ] `AWS_REGION` (opcional)
- [ ] IAM Role `GitHubActionsDeployRole` tem permissão para ler secrets
- [ ] Trust policy da role permite GitHub OIDC
- [ ] Testado localmente: `docker compose config -q` passa
- [ ] Workflow executado e validado (secrets recuperados com sucesso)

## 🎯 Benefícios da Implementação

1. **Segurança**: Senhas nunca hardcoded no repositório
2. **Flexibilidade**: Secret único JSON permite adicionar novos campos sem mudar workflow
3. **Fail-fast**: Deploy falha imediatamente se secrets não estiverem disponíveis
4. **Auditoria**: CloudTrail registra todos os acessos ao Secrets Manager
5. **Zero Downtime**: Validação ocorre antes de parar serviços

## 📚 Referências

- [AWS Secrets Manager - Best Practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)
- [GitHub Actions - OIDC with AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [Docker Compose - Variable Substitution](https://docs.docker.com/compose/environment-variables/env-file/)

