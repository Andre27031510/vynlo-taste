# Runbook de Rollback - Vynlo Taste

## Visão Geral
Este documento descreve o processo de rollback (reversão) de deploy em caso de falhas críticas em produção.

## Quando Executar Rollback

### Critérios para Rollback Imediato:
1. **Health Check Falha**: Backend ou Frontend não respondem após 5 minutos
2. **Erros Críticos**: Taxa de erro > 5% em menos de 10 minutos
3. **Funcionalidade Quebrada**: Feature crítica não funciona
4. **Performance Degradada**: Tempo de resposta > 3x o normal
5. **Vazamento de Dados**: Problema de segurança detectado

### Critérios para Rollback Coordenado:
1. **Problemas Menores**: Erros em features não críticas
2. **Performance Moderada**: Tempo de resposta 2x o normal
3. **Problemas Parciais**: Algumas funcionalidades não funcionam

## Processo de Rollback

### Pré-requisitos
- Acesso SSH ao servidor de produção
- Credenciais AWS para Secrets Manager
- Backup do banco de dados disponível (se necessário)

### Passo 1: Identificar Commit Anterior
```bash
# Listar commits recentes
git log --oneline -10

# Identificar commit anterior ao atual
PREVIOUS_COMMIT=$(git log --oneline -2 | tail -1 | awk '{print $1}')
echo "Commit anterior: ${PREVIOUS_COMMIT}"
```

### Passo 2: Verificar Imagens Disponíveis
```bash
# Verificar se imagem do commit anterior existe no registry
docker manifest inspect ghcr.io/andre27031510/vynlotaste-backend:${PREVIOUS_COMMIT} > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Imagem backend disponível"
else
  echo "❌ Imagem backend não encontrada - usar latest como fallback"
  PREVIOUS_COMMIT="latest"
fi
```

### Passo 3: Fazer Backup do Estado Atual
```bash
# Backup do banco de dados
docker exec vynlo-postgres pg_dump -U vynlo_user vynlotaste > backup-before-rollback-$(date +%Y%m%d-%H%M%S).sql

# Backup do docker-compose atual
cp docker-compose.prod.yml docker-compose.prod.yml.backup-$(date +%Y%m%d-%H%M%S)
```

### Passo 4: Executar Rollback
```bash
# Exportar variáveis do commit anterior
export BACKEND_TAG="${PREVIOUS_COMMIT}"
export FRONTEND_TAG="${PREVIOUS_COMMIT}"

# Parar apenas backend/frontend (mantém DB e cache rodando)
docker compose -f docker-compose.prod.yml stop backend frontend
docker rm vynlo-backend vynlo-frontend

# Iniciar com tags anteriores
docker compose -f docker-compose.prod.yml up -d backend frontend
```

### Passo 5: Validar Rollback
```bash
# Aguardar inicialização (60 segundos)
sleep 60

# Health check backend
if curl -fsS http://localhost:8080/api/actuator/health > /dev/null 2>&1; then
  echo "✅ Backend saudável após rollback"
else
  echo "❌ Backend não respondeu - verificar logs"
  docker logs vynlo-backend --tail 50
  exit 1
fi

# Health check frontend
if curl -fsS http://localhost:3000 > /dev/null 2>&1; then
  echo "✅ Frontend saudável após rollback"
else
  echo "❌ Frontend não respondeu - verificar logs"
  docker logs vynlo-frontend --tail 50
  exit 1
fi
```

### Passo 6: Rollback de Migrações (Se Necessário)
```bash
# Se rollback requer reverter migrations Flyway
cd backend/core-module
mvn flyway:repair -Dflyway.url=jdbc:postgresql://localhost:5432/vynlotaste \
  -Dflyway.user=vynlo_user \
  -Dflyway.password="${DB_PASSWORD}"

# Ou manualmente:
# docker exec vynlo-postgres psql -U vynlo_user -d vynlotaste -c "DELETE FROM flyway_schema_history WHERE version = 'VXX';"
```

## Rollback Automatizado (Script)

### Uso:
```bash
./deploy/scripts/rollback.sh <commit-hash>
```

### Exemplo:
```bash
# Rollback para commit anterior
./deploy/scripts/rollback.sh $(git log --oneline -2 | tail -1 | awk '{print $1}')

# Rollback para commit específico
./deploy/scripts/rollback.sh abc1234
```

## Comunicação

### Após Rollback Bem-Sucedido:
1. Notificar equipe no Slack/Teams
2. Criar issue no GitHub documentando o problema
3. Atualizar status page (se aplicável)

### Template de Notificação:
```
🚨 ROLLBACK EXECUTADO

Commit revertido: <commit-hash>
Motivo: <razão do rollback>
Tempo de downtime: <tempo>
Status: ✅ Sistema operacional após rollback

Próximos passos:
- Investigar causa raiz
- Criar hotfix se necessário
- Re-testar antes de novo deploy
```

## Troubleshooting

### Problema: Imagem do commit anterior não existe
**Solução**: Usar tag `latest` como fallback (última imagem estável)

### Problema: Rollback não resolve o problema
**Solução**: 
1. Verificar se problema é no banco de dados
2. Verificar se problema é de configuração
3. Considerar rollback de migrations

### Problema: Health check falha após rollback
**Solução**:
1. Verificar logs: `docker logs vynlo-backend --tail 100`
2. Verificar se banco está acessível
3. Verificar se secrets estão corretos
4. Considerar rollback completo (incluindo migrations)

## Prevenção

### Para Evitar Rollbacks:
1. **Testes completos antes de deploy**: Staging + testes manuais
2. **Deploy gradual**: Feature flags para ativar gradualmente
3. **Monitoramento**: Alertas configurados para detectar problemas rapidamente
4. **Rollback plan**: Sempre ter plano de rollback antes de deploy

## Referências
- [Deploy Runbook](./DEPLOY_RUNBOOK.md)
- [Incident Response](./INCIDENT_RESPONSE.md)

