-- Índices para otimização de queries dinâmicas
-- Executar gradualmente em produção durante janelas de manutenção

-- Índices para tabela users
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role_active 
ON users(role, active) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_verified_active 
ON users(email_verified, active) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at_role 
ON users(created_at, role) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_login_at 
ON users(last_login_at) WHERE deleted_at IS NULL AND last_login_at IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_name_search 
ON users(lower(first_name), lower(last_name)) WHERE deleted_at IS NULL;

-- Índices para tabela products
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_available 
ON products(category, available) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_price_available 
ON products(price, available) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_stock_available 
ON products(stock_quantity, available) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_dietary_preferences 
ON products(vegan, vegetarian, gluten_free, available) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_name_search 
ON products(lower(name)) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_ingredients_search 
ON products USING gin(to_tsvector('portuguese', ingredients)) WHERE deleted_at IS NULL;

-- Índices para tabela orders
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status_type 
ON orders(status, type) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_customer_status 
ON orders(customer_id, status) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at_status 
ON orders(created_at, status) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_total_amount 
ON orders(total_amount) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_updated_at 
ON orders(updated_at) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_order_number_search 
ON orders(upper(order_number)) WHERE deleted_at IS NULL;

-- Índices compostos para queries frequentes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_delivery_status_created 
ON orders(type, status, created_at) WHERE deleted_at IS NULL AND type = 'DELIVERY';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_price_available 
ON products(category, price, available) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role_created_active 
ON users(role, created_at, active) WHERE deleted_at IS NULL;

-- Índices para otimizar JOINs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_id 
ON order_items(order_id) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_product_id 
ON order_items(product_id) WHERE deleted_at IS NULL;

-- Índices para queries de relatório
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at_total_amount 
ON orders(created_at, total_amount) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_customer_created_at 
ON orders(customer_id, created_at) WHERE deleted_at IS NULL;

-- Estatísticas para otimizador (executar manualmente após deploy)
-- ANALYZE users;
-- ANALYZE products;
-- ANALYZE orders;
-- ANALYZE order_items;