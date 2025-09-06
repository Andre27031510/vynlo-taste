-- Migration para melhorias nas entidades
-- Adiciona campos de soft delete, versionamento e índices de performance

-- Adicionar campos na tabela products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS ingredients VARCHAR(500),
ADD COLUMN IF NOT EXISTS weight DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS calories INTEGER,
ADD COLUMN IF NOT EXISTS vegan BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS vegetarian BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS gluten_free BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0;

-- Renomear colunas de timestamp em products
ALTER TABLE products 
RENAME COLUMN created_at TO created_at_old;
ALTER TABLE products 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
UPDATE products SET created_at = created_at_old WHERE created_at_old IS NOT NULL;
ALTER TABLE products DROP COLUMN created_at_old;

ALTER TABLE products 
RENAME COLUMN updated_at TO updated_at_old;
ALTER TABLE products 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
UPDATE products SET updated_at = updated_at_old WHERE updated_at_old IS NOT NULL;
ALTER TABLE products DROP COLUMN updated_at_old;

-- Adicionar campos na tabela orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS discount DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS estimated_delivery_time INTEGER,
ADD COLUMN IF NOT EXISTS is_gift BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS gift_message VARCHAR(200),
ADD COLUMN IF NOT EXISTS rating INTEGER,
ADD COLUMN IF NOT EXISTS rating_comment VARCHAR(500),
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0;

-- Renomear colunas em orders
ALTER TABLE orders 
RENAME COLUMN total_amount TO total_amount_old;
ALTER TABLE orders 
ADD COLUMN total_amount DECIMAL(10,2);
UPDATE orders SET total_amount = total_amount_old WHERE total_amount_old IS NOT NULL;
ALTER TABLE orders DROP COLUMN total_amount_old;

ALTER TABLE orders 
RENAME COLUMN delivery_address TO delivery_address_old;
ALTER TABLE orders 
ADD COLUMN delivery_address VARCHAR(200);
UPDATE orders SET delivery_address = delivery_address_old WHERE delivery_address_old IS NOT NULL;
ALTER TABLE orders DROP COLUMN delivery_address_old;

-- Criar tabela order_items se não existir
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    item_notes VARCHAR(300),
    customizations TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_product_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_product_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_product_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_product_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_product_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_product_deleted ON products(deleted);

-- Índices para orders
CREATE INDEX IF NOT EXISTS idx_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_deleted ON orders(deleted);

-- Índices para order_items
CREATE INDEX IF NOT EXISTS idx_order_item_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_item_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_item_deleted ON order_items(deleted);

-- Índices compostos para queries frequentes
CREATE INDEX IF NOT EXISTS idx_product_available_category ON products(available, category) WHERE deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_order_status_created ON orders(status, created_at) WHERE deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_order_customer_status ON orders(customer_id, status) WHERE deleted = FALSE;

-- Atualizar campos NOT NULL com valores padrão
UPDATE products SET deleted = FALSE WHERE deleted IS NULL;
UPDATE products SET version = 0 WHERE version IS NULL;
UPDATE products SET vegan = FALSE WHERE vegan IS NULL;
UPDATE products SET vegetarian = FALSE WHERE vegetarian IS NULL;
UPDATE products SET gluten_free = FALSE WHERE gluten_free IS NULL;

UPDATE orders SET deleted = FALSE WHERE deleted IS NULL;
UPDATE orders SET version = 0 WHERE version IS NULL;
UPDATE orders SET is_gift = FALSE WHERE is_gift IS NULL;
UPDATE orders SET delivery_fee = 0.00 WHERE delivery_fee IS NULL;
UPDATE orders SET discount = 0.00 WHERE discount IS NULL;

UPDATE order_items SET deleted = FALSE WHERE deleted IS NULL;
UPDATE order_items SET version = 0 WHERE version IS NULL;

-- Adicionar constraints NOT NULL após atualizar valores
ALTER TABLE products 
ALTER COLUMN deleted SET NOT NULL,
ALTER COLUMN vegan SET NOT NULL,
ALTER COLUMN vegetarian SET NOT NULL,
ALTER COLUMN gluten_free SET NOT NULL;

ALTER TABLE orders 
ALTER COLUMN deleted SET NOT NULL,
ALTER COLUMN is_gift SET NOT NULL;

ALTER TABLE order_items 
ALTER COLUMN deleted SET NOT NULL;