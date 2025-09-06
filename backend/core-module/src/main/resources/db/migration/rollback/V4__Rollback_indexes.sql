-- Rollback V4: Remove índices adicionais
-- Remove apenas os índices criados na V4

-- Remove índices de users
DROP INDEX IF EXISTS idx_users_email_active;
DROP INDEX IF EXISTS idx_users_role_active;
DROP INDEX IF EXISTS idx_users_cpf_partial;

-- Remove índices de busca textual
DROP INDEX IF EXISTS idx_products_name_trgm;
DROP INDEX IF EXISTS idx_products_description_trgm;

-- Remove índices de análise
DROP INDEX IF EXISTS idx_orders_created_status;
DROP INDEX IF EXISTS idx_orders_total_amount;
DROP INDEX IF EXISTS idx_orders_delivery_date;

-- Remove índices de relatórios
DROP INDEX IF EXISTS idx_order_items_product_created;
DROP INDEX IF EXISTS idx_order_items_quantity_price;

-- Remove índices de período
DROP INDEX IF EXISTS idx_orders_date_range;

-- Remove índices de auditoria
DROP INDEX IF EXISTS idx_audit_log_table_operation;
DROP INDEX IF EXISTS idx_audit_log_record_id;

-- Remove índices de JOIN
DROP INDEX IF EXISTS idx_order_items_order_product_join;

-- Log do rollback
DO $$
BEGIN
    RAISE NOTICE 'Rollback V4 executado em: %', CURRENT_TIMESTAMP;
    RAISE NOTICE 'Índices adicionais removidos';
END $$;