# Runbook de Resposta a Incidentes - Vynlo Taste

## Visão Geral
Este documento descreve o processo de resposta a incidentes em produção, incluindo classificação, comunicação e resolução.

## Classificação de Incidentes

### P0 - Crítico (Resposta Imediata)
- **Critérios**: Sistema completamente inacessível, vazamento de dados, perda de dados
- **Tempo de Resposta**: Imediato (< 5 minutos)
- **Tempo de Resolução**: < 1 hora
- **Exemplos**: 
  - Aplicação não responde
  - Banco de dados corrompido
  - Vazamento de dados sensíveis

### P1 - Alto (Resposta Urgente)
- **Critérios**: Funcionalidade crítica quebrada, performance degradada severamente
- **Tempo de Resposta**: < 15 minutos
- **Tempo de Resolução**: < 4 horas
- **Exemplos**:
  - Login não funciona
  - Transações não processam
  - API retorna 500 em >50% das requisições

### P2 - Médio (Resposta Prioritária)
- **Critérios**: Funcionalidade importante quebrada, performance moderadamente degradada
- **Tempo de Resposta**: < 1 hora
- **Tempo de Resolução**: < 24 horas
- **Exemplos**:
  - Relatórios não geram
  - Dashboard não carrega
  - Algumas APIs retornam erro

### P3 - Baixo (Resposta Normal)
- **Critérios**: Funcionalidade não crítica quebrada, problemas menores
- **Tempo de Resposta**: < 4 horas
- **Tempo de Resolução**: < 72 horas
- **Exemplos**:
  - Erro em feature secundária
  - Performance ligeiramente degradada
  - Problemas de UI menores

## Processo de Resposta

### Fase 1: Detecção e Classificação (0-5 min)
1. **Detectar incidente**:
   - Monitoramento automático (Prometheus/Grafana)
   - Relatos de usuários
   - Alertas de sistema

2. **Classificar severidade**:
   - Usar critérios acima
   - Se em dúvida, classificar como mais severo

3. **Abrir ticket/issue**:
   - GitHub Issue com label `incident`
   - Incluir: severidade, descrição, evidências

### Fase 2: Comunicação (0-10 min)
1. **Notificar equipe**:
   - Slack/Teams: Canal #incidents
   - Email: Lista de desenvolvedores on-call

2. **Template de notificação inicial**:
```
🚨 INCIDENTE P0/P1/P2/P3

Descrição: <descrição breve>
Impacto: <usuários afetados, funcionalidades>
Status: <investigando/resolvendo/resolvido>
Incident Commander: <nome>
Issue: <link>
```

3. **Status page** (se aplicável):
   - Atualizar status para "Degraded" ou "Outage"

### Fase 3: Investigação (5-30 min)
1. **Coletar informações**:
   ```bash
   # Logs do backend
   docker logs vynlo-backend --tail 200 --since 10m
   
   # Logs do frontend
   docker logs vynlo-frontend --tail 200 --since 10m
   
   # Status dos containers
   docker ps
   docker stats
   
   # Health checks
   curl http://localhost:8080/api/actuator/health
   curl http://localhost:3000
   
   # Métricas Prometheus
   curl http://localhost:9090/api/v1/query?query=up
   ```

2. **Verificar métricas**:
   - Taxa de erro (Prometheus)
   - Tempo de resposta (Grafana)
   - Uso de recursos (CPU, RAM, Disk)

3. **Identificar causa raiz**:
   - Revisar logs recentes
   - Verificar mudanças recentes (deploy, migrations)
   - Verificar dependências externas (APIs, banco de dados)

### Fase 4: Resolução (variável)
1. **Aplicar correção**:
   - **Rollback**: Se problema é de deploy recente (ver [ROLLBACK_RUNBOOK.md](./ROLLBACK_RUNBOOK.md))
   - **Hotfix**: Se problema é de código, aplicar correção rápida
   - **Configuração**: Se problema é de configuração, ajustar

2. **Validar correção**:
   ```bash
   # Health checks
   curl -fsS http://localhost:8080/api/actuator/health
   curl -fsS http://localhost:3000
   
   # Verificar logs
   docker logs vynlo-backend --tail 50 --follow
   ```

3. **Monitorar estabilidade**:
   - Aguardar 10-15 minutos após correção
   - Verificar métricas retornando ao normal
   - Confirmar com usuários afetados

### Fase 5: Pós-Incidente (24-48h após resolução)
1. **Post-Mortem**:
   - Documentar incidente
   - Identificar causa raiz
   - Listar ações corretivas
   - Definir ações preventivas

2. **Template de Post-Mortem**:
```markdown
# Post-Mortem: <Título do Incidente>

## Resumo
- **Data**: YYYY-MM-DD HH:MM
- **Duração**: X horas/minutos
- **Severidade**: P0/P1/P2/P3
- **Impacto**: <usuários afetados, funcionalidades>

## Timeline
- HH:MM - Incidente detectado
- HH:MM - Equipe notificada
- HH:MM - Investigação iniciada
- HH:MM - Causa raiz identificada
- HH:MM - Correção aplicada
- HH:MM - Incidente resolvido

## Causa Raiz
<Descrição detalhada>

## Ações Corretivas
- [ ] Ação 1
- [ ] Ação 2
- [ ] Ação 3

## Ações Preventivas
- [ ] Ação 1
- [ ] Ação 2
- [ ] Ação 3

## Lições Aprendidas
<O que aprendemos com este incidente>
```

## Comandos Úteis

### Diagnóstico Rápido
```bash
# Status geral
docker ps
docker stats --no-stream

# Health checks
curl -s http://localhost:8080/api/actuator/health | jq
curl -s http://localhost:3000

# Logs recentes
docker logs vynlo-backend --tail 100 --since 5m
docker logs vynlo-frontend --tail 100 --since 5m

# Métricas
curl -s http://localhost:9090/api/v1/query?query=rate\(http_requests_total\[5m\]\) | jq
```

### Rollback Rápido
```bash
# Ver commits recentes
git log --oneline -5

# Rollback para commit anterior
./deploy/scripts/rollback.sh $(git log --oneline -2 | tail -1 | awk '{print $1}')
```

### Restart de Serviços
```bash
# Restart backend
docker compose -f docker-compose.prod.yml restart backend

# Restart frontend
docker compose -f docker-compose.prod.yml restart frontend

# Restart todos
docker compose -f docker-compose.prod.yml restart
```

## Escalação

### Quando Escalar:
1. **P0/P1 não resolvido em 30 minutos**: Escalar para tech lead
2. **P0 não resolvido em 1 hora**: Escalar para CTO/Diretor
3. **Vazamento de dados**: Escalar imediatamente para segurança
4. **Problema fora de expertise**: Escalar para especialista

### Contatos de Escalação:
- **Tech Lead**: <nome> - <email> - <telefone>
- **CTO**: <nome> - <email> - <telefone>
- **Segurança**: <nome> - <email> - <telefone>

## Prevenção

### Monitoramento Proativo:
1. **Alertas configurados**:
   - Taxa de erro > 1%
   - Tempo de resposta > 2s
   - CPU > 80%
   - RAM > 90%
   - Disk > 85%

2. **Testes regulares**:
   - Health checks a cada 30s
   - Smoke tests diários
   - Load tests semanais

3. **Documentação atualizada**:
   - Runbooks revisados mensalmente
   - Playbooks atualizados após cada incidente

## Referências
- [Rollback Runbook](./ROLLBACK_RUNBOOK.md)
- [Deploy Runbook](./DEPLOY_RUNBOOK.md)
- [Password Rotation](./password-rotation.md)

