-- =============================================================================
-- V13__Add_tenant_unique_constraints.sql
-- =============================================================================
-- Objetivo: Corrigir unicidade global para unicidade por tenant
-- Data: 2025-10-18
-- Autor: Vynlo Tech
-- LGPD: Compliance com Art. 46 (Segurança de Dados)
-- Multi-Tenancy: Isolamento completo entre tenants
-- =============================================================================
-- PROBLEMA:
--   - drivers.phone e drivers.email são UNIQUE globais
--   - users.email e users.username são UNIQUE globais
--   - Tenant A não pode usar phone/email que Tenant B já usa
--   - VAZAMENTO: Erro revela que dado existe em outro tenant
-- 
-- SOLUÇÃO:
--   - Mudar unicidade de GLOBAL para POR TENANT
--   - Cada tenant pode ter drivers/users com mesmos phones/emails
--   - Zero vazamento de informação entre tenants
-- =============================================================================

-- =============================================================================
-- 1. DRIVERS: Corrigir unicidade de phone e email
-- =============================================================================

-- Remover constraints de unicidade global (se existirem)
-- DROP CONSTRAINT é seguro (não perde dados, apenas remove restrição)
ALTER TABLE drivers 
DROP CONSTRAINT IF EXISTS drivers_phone_key CASCADE;

ALTER TABLE drivers 
DROP CONSTRAINT IF EXISTS drivers_email_key CASCADE;

-- Criar índices de unicidade POR TENANT
-- CONCURRENTLY permite criação sem bloquear a tabela (produção segura)
-- WHERE clause filtra nulls e strings vazias (performance + segurança)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS ux_drivers_tenant_phone 
ON drivers(tenant_id, phone) 
WHERE phone IS NOT NULL AND phone <> '';

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS ux_drivers_tenant_email 
ON drivers(tenant_id, email) 
WHERE email IS NOT NULL AND email <> '';

-- =============================================================================
-- 2. USERS: Corrigir unicidade de email e username
-- =============================================================================

-- Remover índices de unicidade global (se existirem)
-- IF EXISTS previne erro se índice não existir
DROP INDEX CONCURRENTLY IF EXISTS idx_user_email;
DROP INDEX CONCURRENTLY IF EXISTS idx_user_username;

-- Criar índices de unicidade POR TENANT
-- Permite que tenants diferentes tenham users com mesmos emails/usernames
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS ux_users_tenant_email 
ON users(tenant_id, email) 
WHERE email IS NOT NULL AND email <> '';

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS ux_users_tenant_username 
ON users(tenant_id, username) 
WHERE username IS NOT NULL AND username <> '';

-- =============================================================================
-- 3. COMMENTS para documentação
-- =============================================================================

COMMENT ON INDEX ux_drivers_tenant_phone IS 
'Unicidade de telefone POR TENANT - LGPD Art. 46 compliance';

COMMENT ON INDEX ux_drivers_tenant_email IS 
'Unicidade de email POR TENANT - LGPD Art. 46 compliance';

COMMENT ON INDEX ux_users_tenant_email IS 
'Unicidade de email POR TENANT - LGPD Art. 46 compliance';

COMMENT ON INDEX ux_users_tenant_username IS 
'Unicidade de username POR TENANT - LGPD Art. 46 compliance';

-- =============================================================================
-- 4. VERIFICAÇÃO (apenas logs, não afeta execução)
-- =============================================================================

-- Log de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ Migration V13 concluída com sucesso!';
    RAISE NOTICE '✅ Drivers: Unicidade phone/email agora é POR TENANT';
    RAISE NOTICE '✅ Users: Unicidade email/username agora é POR TENANT';
    RAISE NOTICE '✅ LGPD Art. 46 compliance: Isolamento completo entre tenants';
END $$;

-- =============================================================================
-- FIM DA MIGRATION V13
-- =============================================================================
-- Rollback (se necessário):
--   DROP INDEX CONCURRENTLY IF EXISTS ux_drivers_tenant_phone;
--   DROP INDEX CONCURRENTLY IF EXISTS ux_drivers_tenant_email;
--   DROP INDEX CONCURRENTLY IF EXISTS ux_users_tenant_email;
--   DROP INDEX CONCURRENTLY IF EXISTS ux_users_tenant_username;
--   
--   (Re-adicionar constraints globais se desejar reverter)
-- =============================================================================

