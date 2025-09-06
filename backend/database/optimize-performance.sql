-- Script de Otimização de Performance PostgreSQL
-- Execute este script para melhorar a performance do banco

-- Configurações de performance
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Índices para otimização de queries (ajuste conforme suas tabelas)
-- Exemplo para tabela de usuários
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Exemplo para tabela de pedidos
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id ON orders(user_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status ON orders(status);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Exemplo para tabela de produtos
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category ON products(category);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active ON products(active);

-- Atualizar estatísticas
ANALYZE;

-- Recarregar configurações
SELECT pg_reload_conf();

COMMENT ON SCHEMA public IS 'Otimizações aplicadas para melhor performance';