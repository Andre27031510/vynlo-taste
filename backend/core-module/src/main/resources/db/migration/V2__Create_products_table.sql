-- V2: Criação da tabela de produtos (CATCH-UP - Idempotente)
-- PADRÃO BIG TECH: IF NOT EXISTS para evitar travamentos em ambientes já provisionados
-- Autor: Sistema Vynlo Taste
-- Data: 2024-01-02
-- Atualizado: 2025-11-03 - Tornado idempotente com IF NOT EXISTS
-- touch: redeploy note (commit 2ee3526) - comentário leve sem impacto funcional

-- ============================================================================
-- TABELA PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    available BOOLEAN NOT NULL DEFAULT true,
    preparation_time INTEGER, -- em minutos
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- CONSTRAINTS (Idempotentes)
-- ============================================================================
DO $$
BEGIN
    -- Adicionar constraints apenas se não existirem
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_price_positive'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT products_price_positive 
            CHECK (price > 0);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_stock_non_negative'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT products_stock_non_negative 
            CHECK (stock_quantity >= 0);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_preparation_time_positive'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT products_preparation_time_positive 
            CHECK (preparation_time IS NULL OR preparation_time > 0);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_min_stock_non_negative'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT products_min_stock_non_negative 
            CHECK (min_stock_level >= 0);
    END IF;
END $$;

-- ============================================================================
-- ÍNDICES (Idempotentes)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_category_available ON products(category, available) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_low_stock ON products(stock_quantity) 
    WHERE stock_quantity <= min_stock_level AND deleted_at IS NULL;

-- ============================================================================
-- FUNÇÕES (Idempotentes - CREATE OR REPLACE)
-- ============================================================================
-- Função update_updated_at_column() já criada em V1__Create_users_table.sql
-- Se não existir, será criada aqui

CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity <= NEW.min_stock_level THEN
        -- Log de estoque baixo (pode ser usado para alertas)
        -- Nota: audit_log pode não existir ainda - verificação condicional
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_log') THEN
            INSERT INTO audit_log (table_name, operation, record_id, old_values, new_values, created_at)
            VALUES ('products', 'LOW_STOCK_ALERT', NEW.id, 
                    json_build_object('stock_quantity', OLD.stock_quantity),
                    json_build_object('stock_quantity', NEW.stock_quantity),
                    CURRENT_TIMESTAMP);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TRIGGERS (Idempotentes - DROP IF EXISTS antes de criar)
-- ============================================================================
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMENTÁRIOS (Idempotentes)
-- ============================================================================
COMMENT ON TABLE products IS 'Tabela de produtos do cardápio';
COMMENT ON COLUMN products.preparation_time IS 'Tempo de preparo em minutos';
COMMENT ON COLUMN products.stock_quantity IS 'Quantidade em estoque';
COMMENT ON COLUMN products.min_stock_level IS 'Nível mínimo de estoque para alertas';
