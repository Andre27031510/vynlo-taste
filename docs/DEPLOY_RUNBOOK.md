# Deploy Runbook - Vynlo Taste

## Visão Geral
Este documento descreve os processos de deploy e as fases de validação do pipeline CI/CD.

## Arquitetura do Pipeline

```
build (ubuntu-latest)
├── Backend Tests
├── Frontend Lint/Tests
└── Build Images (backend + frontend)

staging-migrations (ubuntu-latest)
└── Flyway Migrations (PostgreSQL staging)

deploy (self-hosted)
├── Validate Secrets
├── Fetch AWS Secrets
├── Validate Scripts
├── Deploy Application
└── Notify Status
```

## Fases de Deploy

### 1. Pré-requisitos e Padronização
- Validação de variáveis de ambiente obrigatórias
- Docker login no GitHub Container Registry
- Padronização de tags e registry

### 2. Validações Fail-Fast
- Validação de secrets obrigatórios (DB_PASSWORD, MAIL_PASSWORD)
- Validação de docker-compose.prod.yml (conflitos Git, sintaxe YAML)
- Validação de scripts de deploy

### 3. Verificação de Imagens
- Verificação de existência das imagens no registry
- Pull controlado das imagens
- Validação de integridade (sem fallback para `latest`)

### 4. Validação de Senha do Banco
- Verificação de alinhamento entre AWS Secrets Manager e PostgreSQL
- Teste de conexão TCP
- Validação de permissões

### 5. Backup e Deploy
- Backup automático do PostgreSQL
- Parada seletiva (apenas backend/frontend)
- Inicialização de containers
- Health checks

## Gates de Segurança

### Gate 1: Testes e Lints
- **Backend**: `mvn test` - falha bloqueia build
- **Frontend**: `npm run lint` e `npm run test` - falha bloqueia build

### Gate 2: Migrações Staging
- Flyway migrations executadas em ambiente de staging
- Falha bloqueia deploy em produção
- Deploy depende de `staging-migrations` (não opcional)

### Gate 3: Validação de Secrets
- `GITHUB_TOKEN` obrigatório
- `DB_PASSWORD` obrigatório (via AWS Secrets Manager)
- Scripts de deploy validados antes da execução

### Gate 4: Validação de Imagens
- Imagens devem existir para o commit SHA específico
- Sem fallback para `latest` (mantém imutabilidade)
- Falha aborta deploy

### Gate 5: Validação de Senha do Banco
- Senha do AWS Secrets Manager deve corresponder ao banco
- Teste de conexão TCP obrigatório
- Falha aborta deploy

## Scripts de Deploy

### `deploy/scripts/deploy-application.sh`
Script principal de deploy. Contém:
- Validações fail-fast
- Verificação de imagens
- Backup e deploy zero-downtime
- Health checks

### `deploy/scripts/check-db-password.sh`
Validação de alinhamento de senha do banco:
- Busca senha do AWS Secrets Manager
- Testa conexão TCP com PostgreSQL
- Fornece instruções claras em caso de falha

### `deploy/scripts/validate-compose.sh`
Validação de docker-compose.prod.yml:
- Detecção de conflitos de merge Git
- Validação de sintaxe YAML
- Validação de estrutura básica
- Verificação de variáveis obrigatórias

## Troubleshooting

### Deploy falha com "Backend image not found"
**Causa**: Imagem não foi buildada para o commit específico
**Solução**: Re-executar job `build` ou verificar registry

### Deploy falha com "DB password validation failed"
**Causa**: Senha do AWS Secrets Manager não corresponde ao banco
**Solução**: Ver `docs/password-rotation.md`

### Deploy falha com "docker-compose.prod.yml has YAML syntax error"
**Causa**: Erro de sintaxe ou conflito de merge
**Solução**: Executar `docker compose -f docker-compose.prod.yml config` localmente

### Migrações staging falham
**Causa**: Erro nas migrations Flyway
**Solução**: Corrigir migrations antes de fazer deploy

## Referências
- [Big Tech Pipeline Refactor](./BIG_TECH_PIPELINE_REFACTOR.md)
- [Password Rotation](./password-rotation.md)

