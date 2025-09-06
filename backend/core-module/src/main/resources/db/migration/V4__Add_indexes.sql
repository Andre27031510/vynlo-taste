-- V4: Adição de índices otimizados para performance
-- Autor: Sistema Vynlo Taste
-- Data: 2024-01-04

-- Índices adicionais para users
CREATE INDEX CONCURRENTLY idx_users_email_active ON users(email, active) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_users_role_active ON users(role, active) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_users_cpf_partial ON users(cpf) WHERE cpf IS NOT NULL AND deleted_at IS NULL;

-- Índices para busca textual em produtos
CREATE INDEX CONCURRENTLY idx_products_name_trgm ON products USING gin(name gin_trgm_ops) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_products_description_trgm ON products USING gin(description gin_trgm_ops) WHERE deleted_at IS NULL;

-- Extensão para busca textual (se não existir)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Índices para análise de vendas
CREATE INDEX CONCURRENTLY idx_orders_created_status ON orders(created_at, status) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_orders_total_amount ON orders(total_amount) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_orders_delivery_date ON orders(DATE(created_at)) WHERE deleted_at IS NULL;

-- Índices para relatórios de produtos mais vendidos
CREATE INDEX CONCURRENTLY idx_order_items_product_created ON order_items(product_id, created_at);
CREATE INDEX CONCURRENTLY idx_order_items_quantity_price ON order_items(quantity, unit_price);

-- Índice para busca de pedidos por período
CREATE INDEX CONCURRENTLY idx_orders_date_range ON orders(created_at, status, customer_id) WHERE deleted_at IS NULL;

-- Índice para auditoria (será usado na V5)
CREATE INDEX CONCURRENTLY idx_audit_log_table_operation ON audit_log(table_name, operation, created_at);
CREATE INDEX CONCURRENTLY idx_audit_log_record_id ON audit_log(record_id, table_name);

-- Índices para performance de JOINs
CREATE INDEX CONCURRENTLY idx_order_items_order_product_join ON order_items(order_id, product_id, quantity);

-- Estatísticas para otimizador
ANALYZE users;
ANALYZE products;
ANALYZE orders;
ANALYZE order_items;

-- Comentários sobre os índices
COMMENT ON INDEX idx_users_email_active IS 'Índice composto para login de usuários ativos';
COMMENT ON INDEX idx_products_name_trgm IS 'Índice trigram para busca textual em nomes de produtos';
COMMENT ON INDEX idx_orders_date_range IS 'Índice otimizado para relatórios por período';