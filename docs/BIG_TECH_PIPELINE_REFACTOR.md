# Big Tech Pipeline Refactor - Plano de Implementação

## Objetivo
Transformar o pipeline CI/CD de um monolito difícil de manter para uma orquestração confiável, auditável e alinhada com práticas de grandes empresas.

## Status Atual vs Alvo

### ❌ Problemas Identificados
1. Scripts inline gigantes no workflow (excedeu limite de 21k caracteres)
2. Falsa sensação de hardening: `|| echo ... continuando` permite deploy com falhas
3. Fallback silencioso para `latest` quebra imutabilidade
4. Deploy não depende de `staging-migrations` (risco real em produção)
5. `check-db-password.sh` existe mas não está sendo validado adequadamente
6. `docker-compose.prod.yml` pode ter problemas de indentação não detectados
7. Comentários "Fase 0/1/2..." confundem o YAML
8. Setup Node.js repetido 3x (ineficiência)
9. Secrets re-exportados múltiplas vezes (risco de drift)

### ✅ Soluções Implementadas

#### Fase 1 - Modularização ✅
- [x] Script `deploy-application.sh` extraído para `deploy/scripts/`
- [x] Script `check-db-password.sh` criado e versionado
- [ ] Runbook em `docs/` explicando as fases
- [ ] Remover comentários "Fase 0/1/2..." do YAML

#### Fase 2 - Fail-Fast Real 🔄
- [ ] Remover `|| echo ... continuando` de lint/test
- [ ] Remover fallback `latest` - abortar se imagem não encontrada
- [ ] Adicionar `needs: [build, staging-migrations]` ao deploy

#### Fase 3 - Gates Reais 🔄
- [x] Script `check-db-password.sh` implementado
- [ ] Validar que script existe antes de chamar
- [ ] Criar script de validação YAML para `docker-compose.prod.yml`

#### Fase 4 - Observabilidade 🔄
- [ ] Limpar logs novelados do workflow
- [ ] Usar `::notice::` e `::error::` apenas para eventos chave
- [ ] Registrar métricas principais (tempo de deploy, sucesso/falha)

#### Fase 5 - Simplificação/Paralelismo ⏳ (Opcional)
- [x] Setup Node.js deduplicado (removido setup duplicado)
- [ ] Separar build backend e frontend em jobs distintos (OPCIONAL - ver docs/FASE5_PARALELISMO_ANALISE.md)
- [ ] Executar em paralelo (OPCIONAL - apenas se builds >15min cada)

**Nota**: Separar jobs é uma otimização, não um requisito Big Tech. Recomendado apenas para projetos com alto volume ou builds muito longos.

#### Fase 6 - Segurança Secrets 🔄
- [ ] Validar `GITHUB_TOKEN` obrigatório (fail se ausente)
- [ ] Evitar re-exportar secrets no YAML
- [ ] Usar secrets apenas onde necessário

#### Fase 7 - Revisão Comentários 🔄
- [ ] Mover comentários "PADRÃO BIG TECH" para documentação
- [ ] Manter YAML conciso: objetivo, pré-condições, referência ao runbook

## Arquitetura Alvo

```
.github/workflows/ci-cd-v2.yml (orquestração leve)
├── jobs/
│   ├── build-backend (paralelo)
│   ├── build-frontend (paralelo)
│   ├── staging-migrations (gate obrigatório)
│   └── deploy (depende de todos acima)
│
deploy/scripts/ (lógica versionada)
├── deploy-application.sh
├── check-db-password.sh
├── validate-compose.sh (novo)
└── validate-secrets.sh (novo)
│
docs/ (documentação)
├── BIG_TECH_PIPELINE_REFACTOR.md (este arquivo)
├── DEPLOY_RUNBOOK.md
└── PIPELINE_GATES.md
```

## Fluxo Real do Pipeline

### 1. Build Job
```
1. Detecta mudanças (backend/frontend/infra)
2. Executa testes backend (se backend mudou)
3. Instala dependências frontend (UMA VEZ - npm ci)
4. Executa lint frontend (sem npm ci)
5. Executa testes frontend (sem npm ci)
6. Build frontend (sem npm ci - reusa dependências)
7. Build e push imagens Docker
```

### 2. Staging Migrations Job
```
1. Inicia PostgreSQL temporário
2. Executa Flyway migrations
3. Valida migrations
4. Limpa PostgreSQL temporário
```

### 3. Deploy Job
```
1. Configura AWS OIDC
2. Busca secrets do AWS Secrets Manager
3. Valida scripts de deploy
4. Executa deploy-application.sh:
   - Valida docker-compose.prod.yml
   - Verifica imagens no registry
   - Valida senha do banco (check-db-password.sh)
   - Backup do banco
   - Deploy zero-downtime
   - Health checks
```

## Scripts de Deploy

### deploy-application.sh
- Shell rigoroso: `set -euo pipefail`
- Validações fail-fast
- Deploy zero-downtime
- Health checks

### check-db-password.sh
- Shell rigoroso: `set -euo pipefail`
- Teste psql via TCP (não peer auth)
- Validação de alinhamento AWS Secrets Manager

### validate-compose.sh
- Shell rigoroso: `set -euo pipefail`
- Detecta conflitos Git
- Valida sintaxe YAML
- Valida estrutura

### validate-pipeline.sh (NOVO)
- Validação completa do pipeline (dry-run)
- Verifica scripts, dependências, configuração
- Útil para validar antes de deploy

## Gates do Pipeline

1. **Gate de Testes**: Backend e frontend devem passar testes
2. **Gate de Migrations**: Staging migrations deve passar
3. **Gate de Secrets**: GITHUB_TOKEN obrigatório
4. **Gate de Imagens**: Imagens devem existir para commit SHA
5. **Gate de Senha**: Senha do banco deve estar alinhada
6. **Gate de Health**: Health checks devem passar após deploy

## Runbooks Disponíveis

- [DEPLOY_RUNBOOK.md](./DEPLOY_RUNBOOK.md) - Processo de deploy
- [ROLLBACK_RUNBOOK.md](./ROLLBACK_RUNBOOK.md) - Processo de rollback
- [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md) - Resposta a incidentes
- [password-rotation.md](./password-rotation.md) - Rotação de senhas

## Status de Implementação

✅ **Concluído**:
- Fase 1: Scripts de deploy com shell rigoroso
- Fase 2: Revisão do docker-compose.prod.yml
- Fase 3: Otimização de build (npm ci consolidado)
- Fase 4: Documentação completa (runbooks)
- Fase 5: Script de validação (validate-pipeline.sh)

## Referências
- GitHub Actions Best Practices: https://docs.github.com/en/actions/learn-github-actions/best-practices
- Docker Compose Validation: https://docs.docker.com/compose/validate/
- AWS Secrets Manager: https://docs.aws.amazon.com/secretsmanager/

