# Ekklesia – Plano de Migração e Rollback (Fase 7)

Objetivo: habilitar defesa em profundidade no banco com RLS (Row-Level Security) sem downtime, com rollback simples. Já aplicamos FKs compostas (V25). RLS é opcional e somente será ativada após validação.

## Camadas de defesa
- Aplicação: validações nos Services (+ Hibernate Filter por tenant)
- Banco: FKs compostas por tenant (já em produção via V25)
- Opcional: RLS para blindagem adicional (ativação controlada)

## Fases da migração
### 1) Pré-validação (produção, somente leitura)
Detectar registros cross-tenant históricos (antes de RLS):
```sql
-- Tithings → Members
SELECT t.id
FROM tithings t
JOIN members m ON m.id = t.member_id
WHERE t.tenant_id <> m.tenant_id;

-- Events → Members (organizer)
SELECT e.id
FROM events e
JOIN members m ON m.id = e.organizer_id
WHERE e.tenant_id <> m.tenant_id;

-- Cell Groups → Members (leader)
SELECT c.id
FROM cell_groups c
JOIN members m ON m.id = c.leader_id
WHERE c.tenant_id <> m.tenant_id;
```
Se houver inconsistências: corrigir manualmente (atualizar tenant_id do filho ou remover referência inválida). Após V25, novas inconsistências já são bloqueadas pelo banco.

### 2) Preparação de RLS (sem ativar)
Criar função de sessão para setar tenant da aplicação (usada em políticas):
```sql
-- Executar uma única vez (não requer downtime)
CREATE OR REPLACE FUNCTION set_app_tenant(p_tenant BIGINT) RETURNS void AS $$
BEGIN
  PERFORM set_config('app.tenant_id', p_tenant::text, true); -- LOCAL à transação
END; $$ LANGUAGE plpgsql;
```
Criar políticas RLS, porém manter RLS desabilitada até validação final:
```sql
-- Members
CREATE POLICY IF NOT EXISTS members_tenant_policy
ON members USING (tenant_id = current_setting('app.tenant_id', true)::bigint);

-- Tithings
CREATE POLICY IF NOT EXISTS tithings_tenant_policy
ON tithings USING (tenant_id = current_setting('app.tenant_id', true)::bigint);

-- Events
CREATE POLICY IF NOT EXISTS events_tenant_policy
ON events USING (tenant_id = current_setting('app.tenant_id', true)::bigint);

-- Cell Groups
CREATE POLICY IF NOT EXISTS cell_groups_tenant_policy
ON cell_groups USING (tenant_id = current_setting('app.tenant_id', true)::bigint);

-- Churches / Departments
CREATE POLICY IF NOT EXISTS churches_tenant_policy
ON churches USING (tenant_id = current_setting('app.tenant_id', true)::bigint);

CREATE POLICY IF NOT EXISTS departments_tenant_policy
ON departments USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
```

### 3) Ativação controlada (janela segura)
Em uma janela curta, ativar RLS por tabela (uma a uma), testando após cada ativação:
```sql
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tithings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cell_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
```
Validar rapidamente com uma requisição real por tenant (smoke) e observar métricas/erros.

### 4) Integração com a aplicação (opcional)
Para RLS efetiva, a aplicação deve setar `app.tenant_id` por transação/conexão. Abordagens:
- Interceptor de `DataSource`/`EntityManager` executando `SELECT set_app_tenant(?)` após pegar a conexão.
- Se preferir manter apenas Hibernate Filter (atual), NÃO ative RLS.

## Rollback (simples)
Para reverter rapidamente:
```sql
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE churches   DISABLE ROW LEVEL SECURITY;
ALTER TABLE cell_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE events     DISABLE ROW LEVEL SECURITY;
ALTER TABLE tithings   DISABLE ROW LEVEL SECURITY;
ALTER TABLE members    DISABLE ROW LEVEL SECURITY;
```
Opcionalmente, remover políticas:
```sql
DROP POLICY IF EXISTS departments_tenant_policy ON departments;
DROP POLICY IF EXISTS churches_tenant_policy   ON churches;
DROP POLICY IF EXISTS cell_groups_tenant_policy ON cell_groups;
DROP POLICY IF EXISTS events_tenant_policy     ON events;
DROP POLICY IF EXISTS tithings_tenant_policy   ON tithings;
DROP POLICY IF EXISTS members_tenant_policy    ON members;
```

## Checklist de validação
- [ ] Consultas críticas por tenant retornam dados esperados
- [ ] Métrica `ekklesia.tenant.mismatch` sem picos anormais pós-ativação
- [ ] Sem aumento de 401/403/500 em `/api/v1/ekklesia/**`
- [ ] Actuator saudável: `/api/actuator/health`, `/api/actuator/metrics`
- [ ] `X-Request-ID` presente nos logs de acesso e nos erros

## Notas
- Com FKs compostas (V25) e validações na aplicação, já atingimos bom nível de segurança.
- RLS adiciona blindagem extra, mas exige integração para `current_setting('app.tenant_id')`. Mantenha desativada até implementar o interceptor de conexão.
- Este plano permite ativar e reverter RLS rapidamente, sem impactar dados.


