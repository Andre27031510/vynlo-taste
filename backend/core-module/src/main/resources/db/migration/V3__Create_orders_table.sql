-- V3: Criação das tabelas de pedidos
-- Autor: Sistema Vynlo Taste
-- Data: 2024-01-03

-- Tabela principal de pedidos
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    type VARCHAR(20) NOT NULL DEFAULT 'DELIVERY',
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address TEXT,
    notes TEXT,
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign Keys
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT orders_status_check CHECK (status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED')),
    CONSTRAINT orders_type_check CHECK (type IN ('DELIVERY', 'PICKUP', 'DINE_IN')),
    CONSTRAINT orders_total_positive CHECK (total_amount > 0),
    CONSTRAINT orders_delivery_address_required CHECK (
        (type != 'DELIVERY') OR (type = 'DELIVERY' AND delivery_address IS NOT NULL)
    )
);

-- Tabela de itens do pedido
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id),
    
    -- Constraints
    CONSTRAINT order_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT order_items_unit_price_positive CHECK (unit_price > 0),
    CONSTRAINT order_items_total_price_positive CHECK (total_price > 0),
    CONSTRAINT order_items_total_price_calc CHECK (total_price = quantity * unit_price)
);

-- Índices para orders
CREATE INDEX idx_orders_customer_id ON orders(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_status ON orders(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_type ON orders(type) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number) WHERE deleted_at IS NULL;

-- Índices compostos para queries frequentes
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_status_created ON orders(status, created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_delivery_time ON orders(estimated_delivery_time) WHERE deleted_at IS NULL;

-- Índices para order_items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id);

-- Triggers
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar número do pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'ORD-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- Função para validar total do pedido
CREATE OR REPLACE FUNCTION validate_order_total()
RETURNS TRIGGER AS $$
DECLARE
    calculated_total DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(total_price), 0) INTO calculated_total
    FROM order_items 
    WHERE order_id = NEW.order_id;
    
    -- Atualiza o total do pedido
    UPDATE orders 
    SET total_amount = calculated_total,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.order_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_order_total_trigger
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION validate_order_total();

-- Comentários
COMMENT ON TABLE orders IS 'Tabela principal de pedidos';
COMMENT ON TABLE order_items IS 'Itens dos pedidos';
COMMENT ON COLUMN orders.order_number IS 'Número único do pedido gerado automaticamente';
COMMENT ON COLUMN orders.type IS 'Tipo do pedido: DELIVERY, PICKUP, DINE_IN';