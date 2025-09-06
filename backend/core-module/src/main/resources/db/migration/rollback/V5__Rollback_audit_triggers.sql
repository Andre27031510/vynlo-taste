-- Rollback V5: Remove sistema de auditoria
-- ATENÇÃO: Este script remove TODOS os dados de auditoria
-- Use apenas em caso de emergência

-- Remove triggers
DROP TRIGGER IF EXISTS audit_users_trigger ON users;
DROP TRIGGER IF EXISTS audit_products_trigger ON products;
DROP TRIGGER IF EXISTS audit_orders_trigger ON orders;
DROP TRIGGER IF EXISTS soft_delete_users_trigger ON users;
DROP TRIGGER IF EXISTS check_low_stock_trigger ON products;

-- Remove funções
DROP FUNCTION IF EXISTS audit_trigger_function();
DROP FUNCTION IF EXISTS soft_delete_trigger();
DROP FUNCTION IF EXISTS cleanup_old_audit_logs();

-- Remove partições de auditoria
DROP TABLE IF EXISTS audit_log_2024_01;
DROP TABLE IF EXISTS audit_log_2024_02;
DROP TABLE IF EXISTS audit_log_2024_03;
DROP TABLE IF EXISTS audit_log_2024_04;
DROP TABLE IF EXISTS audit_log_2024_05;
DROP TABLE IF EXISTS audit_log_2024_06;

-- Remove tabela principal de auditoria
DROP TABLE IF EXISTS audit_log;

-- Log do rollback
DO $$
BEGIN
    RAISE NOTICE 'Rollback V5 executado em: %', CURRENT_TIMESTAMP;
    RAISE WARNING 'TODOS os dados de auditoria foram removidos!';
END $$;