# AWS Secrets Manager - Setup para GitHub Actions (OIDC)

## 📋 Resumo

Este documento descreve a configuração do AWS Secrets Manager para uso no GitHub Actions via OIDC (OpenID Connect), seguindo padrões Big Tech.

## ✅ Secrets Verificados no AWS

### Account e Região
- **AWS Account ID**: `051826695275`
- **AWS Region**: `us-east-1`
- **ARN Base**: `arn:aws:secretsmanager:us-east-1:051826695275:secret:`

### Secrets Existentes

1. **`vynlo-taste-db-password`**
   - ARN: `arn:aws:secretsmanager:us-east-1:051826695275:secret:vynlo-taste-db-password-Bq9d2w`
   - Estrutura JSON: `{"password":"..."}`
   - Campo para workflow: `.password`

2. **`vynlo-taste-email-config`**
   - ARN: `arn:aws:secretsmanager:us-east-1:051826695275:secret:vynlo-taste-email-config-...`
   - Estrutura JSON: `{"host":"smtp.gmail.com","port":"587","username":"noreply@vynlotech.com","password":"..."}`
   - Campo para MAIL_PASSWORD: `.password`

3. **`vynlo-taste-firebase-prod`**
   - ARN: `arn:aws:secretsmanager:us-east-1:051826695275:secret:vynlo-taste-firebase-prod-RdLlfi`
   - Estrutura: JSON completo com `project_id`, `private_key`, `client_email`, etc.
   - Usado pelo backend (não necessário no workflow)

4. **`vynlo-taste-jwt-prod`**
   - ARN: `arn:aws:secretsmanager:us-east-1:051826695275:secret:vynlo-taste-jwt-prod-DHUFeV`
   - Usado pelo backend (não necessário no workflow)

## 🔐 Fase 1: Configurar OIDC e IAM Role

### 1.1 Criar OIDC Provider para GitHub

Execute o seguinte comando AWS CLI (ou via Console):

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 \
  --region us-east-1
```

**Nota**: O thumbprint pode mudar. Para obter o atual:
```bash
openssl s_client -servername token.actions.githubusercontent.com -showcerts -connect token.actions.githubusercontent.com:443 < /dev/null 2>/dev/null | openssl x509 -fingerprint -sha1 -noout -in /dev/stdin | sed 's/://g' | awk -F= '{print $2}'
```

### 1.2 Criar IAM Role para GitHub Actions

Crie um arquivo `github-role-trust-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::051826695275:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:Andre27031510/vynlo-taste:*"
        }
      }
    }
  ]
}
```

**⚠️ IMPORTANTE**: O repositório correto é `Andre27031510/vynlo-taste` (com "A" maiúsculo e sem hífen).

### 1.3 Criar IAM Policy para Secrets Manager

Crie um arquivo `github-secrets-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": [
        "arn:aws:secretsmanager:us-east-1:051826695275:secret:vynlo-taste-db-password-*",
        "arn:aws:secretsmanager:us-east-1:051826695275:secret:vynlo-taste-email-config-*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:ListSecrets"
      ],
      "Resource": "*"
    }
  ]
}
```

### 1.4 Executar Criação via AWS CLI

```bash
# 1. Criar OIDC Provider (se ainda não existir)
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

# 2. Criar IAM Policy
aws iam create-policy \
  --policy-name GitHubActionsSecretsReadOnly \
  --policy-document file://github-secrets-policy.json \
  --description "Policy para GitHub Actions ler secrets do Secrets Manager"

# 3. Criar IAM Role
aws iam create-role \
  --role-name GitHubActionsDeployRole \
  --assume-role-policy-document file://github-role-trust-policy.json \
  --description "Role para GitHub Actions assumir e ler secrets"

# 4. Anexar Policy à Role
aws iam attach-role-policy \
  --role-name GitHubActionsDeployRole \
  --policy-arn arn:aws:iam::051826695275:policy/GitHubActionsSecretsReadOnly
```

### 1.5 Verificar Configuração

```bash
# Verificar OIDC Provider
aws iam list-open-id-connect-providers

# Verificar Role
aws iam get-role --role-name GitHubActionsDeployRole

# Verificar Policy anexada
aws iam list-attached-role-policies --role-name GitHubActionsDeployRole
```

## 📝 Informações para o Workflow

### Role ARN
```
arn:aws:iam::051826695275:role/GitHubActionsDeployRole
```

### Secrets e Comandos

**DB_PASSWORD (lido pelo workflow):**
```bash
aws secretsmanager get-secret-value \
  --secret-id vynlo-taste-db-password \
  --query 'SecretString' --output text | \
  jq -r '.password'
```

**MAIL_PASSWORD (lido pelo workflow):**
```bash
aws secretsmanager get-secret-value \
  --secret-id vynlo-taste-email-config \
  --query 'SecretString' --output text | \
  jq -r '.password'
```

**Firebase (lido pelo backend em runtime):**
- Secret: `vynlo-taste-firebase-prod`
- O workflow apenas **valida existência** (não lê conteúdo)
- Backend busca automaticamente via `AwsSecretsService` quando inicia

**JWT (lido pelo backend em runtime):**
- Secret: `vynlo-taste-jwt-prod`
- O workflow apenas **valida existência** (não lê conteúdo)
- Backend busca automaticamente via `AwsSecretsService` quando inicia

## 🔒 Segurança

1. **Princípio de Menor Privilégio**: A role só tem permissão de leitura (`GetSecretValue`)
2. **Condição de Subject**: Apenas o repositório específico pode assumir a role
3. **Sem Credenciais Long-Lived**: OIDC elimina necessidade de access keys
4. **Auditoria**: CloudTrail registra todas as chamadas

## 🛡️ Fase 4: Governança e Segurança

### 4.1 Rotação Automática de Secrets

Configure rotação automática no Secrets Manager:

```bash
# Criar função Lambda para rotação (exemplo para DB password)
aws secretsmanager rotate-secret \
  --secret-id vynlo-taste-db-password \
  --rotation-lambda-arn arn:aws:lambda:us-east-1:051826695275:function:RotateDBPassword \
  --rotation-rules AutomaticallyAfterDays=30
```

### 4.2 Auditoria com CloudTrail

Todos os acessos ao Secrets Manager são automaticamente registrados no CloudTrail.

**Verificar acessos recentes:**
```bash
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=GetSecretValue \
  --max-results 10
```

### 4.3 Alertas com EventBridge

Configure alertas para leituras anômalas:

1. **Criar regra EventBridge:**
```bash
aws events put-rule \
  --name secrets-manager-alerts \
  --event-pattern '{"source":["aws.secretsmanager"],"detail-type":["AWS API Call via CloudTrail"],"detail":{"eventName":["GetSecretValue"],"errorCode":["AccessDenied"]}}'
```

2. **Criar SNS Topic para alertas:**
```bash
aws sns create-topic --name secrets-manager-alerts
```

3. **Conectar EventBridge ao SNS:**
```bash
aws events put-targets \
  --rule secrets-manager-alerts \
  --targets "Id"="1","Arn"="arn:aws:sns:us-east-1:051826695275:secrets-manager-alerts"
```

### 4.4 Runbook de Operação

Documente no runbook:
- **Role assumida**: `GitHubActionsDeployRole`
- **Secrets lidos**: 
  - `vynlo-taste-db-password` (campo `password`)
  - `vynlo-taste-email-config` (campo `password`)
- **Fallback manual**: Se OIDC falhar, use AWS CLI local com credenciais temporárias (não commitar!)

## 🔄 Fase 5: Hardening Contínuo

### 5.1 Testar Migrações em Staging

O workflow já inclui job `staging-migrations` que testa migrações antes do deploy.

**Melhorias adicionais:**
- Usar secrets reais do Secrets Manager também no staging
- Validar estrutura JSON dos secrets antes de usar

### 5.2 Secrets "Shadow" para QA

Para ambientes de QA, considere criar secrets separados:
- `vynlo-taste-db-password-qa`
- `vynlo-taste-email-config-qa`

Isola produção de desenvolvimento e permite testes seguros.

### 5.3 Revisão Semestral

**Checklist de revisão:**
- [ ] Revisar IAM policies (princípio de menor privilégio)
- [ ] Verificar se há secrets não utilizados
- [ ] Atualizar actions do GitHub (ex: `aws-actions/configure-aws-credentials@v4`)
- [ ] Revisar logs do CloudTrail para acessos anômalos
- [ ] Testar rotação de secrets
- [ ] Verificar se OIDC provider ainda está ativo

### 5.4 Monitoramento Contínuo

**Métricas importantes:**
- Taxa de sucesso/falha ao ler secrets
- Tempo de resposta do Secrets Manager
- Alertas de acesso negado (possível problema de permissão)

**Configurar CloudWatch Dashboard:**
```bash
aws cloudwatch put-dashboard \
  --dashboard-name SecretsManagerMonitoring \
  --dashboard-body file://secrets-dashboard.json
```

## 📚 Status de Implementação

1. ✅ Verificação de secrets existentes no AWS (concluído)
2. ✅ Documentação da Fase 1: Preparar acesso seguro (IAM/OIDC) (concluído)
3. ✅ Implementação da Fase 2: Workflow atualizado com OIDC (concluído)
4. ✅ Implementação da Fase 3: Fail-Fast e Observabilidade (concluído)
5. ✅ Documentação da Fase 4: Governança e Segurança (concluído)
6. ✅ Documentação da Fase 5: Hardening Contínuo (concluído)

**Próximo passo**: Executar comandos da Fase 1 para criar OIDC Provider e IAM Role no AWS.

## 🔗 Referências

- [GitHub Actions - Configure OpenID Connect in Amazon Web Services](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [AWS IAM - Creating OpenID Connect (OIDC) identity providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)

