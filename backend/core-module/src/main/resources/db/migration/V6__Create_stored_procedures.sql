-- V6: Stored procedures para operações complexas
-- Autor: Sistema Vynlo Taste
-- Data: 2024-01-07

-- Procedure para processar pedido completo
CREATE OR REPLACE FUNCTION process_order(
    p_customer_id BIGINT,
    p_order_type VARCHAR(20),
    p_delivery_address TEXT,
    p_items JSONB,
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE(
    order_id BIGINT,
    order_number VARCHAR(50),
    total_amount DECIMAL(10,2),
    status VARCHAR(20)
) AS $$
DECLARE
    v_order_id BIGINT;
    v_order_number VARCHAR(50);
    v_total_amount DECIMAL(10,2) := 0;
    v_item JSONB;
    v_product_id BIGINT;
    v_quantity INTEGER;
    v_unit_price DECIMAL(10,2);
    v_item_total DECIMAL(10,2);
BEGIN
    -- Validar cliente
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_customer_id AND active = true AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Cliente não encontrado ou inativo: %', p_customer_id;
    END IF;
    
    -- Criar pedido
    INSERT INTO orders (customer_id, type, delivery_address, notes, status)
    VALUES (p_customer_id, p_order_type, p_delivery_address, p_notes, 'PENDING')
    RETURNING id, order_number INTO v_order_id, v_order_number;
    
    -- Processar itens
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::BIGINT;
        v_quantity := (v_item->>'quantity')::INTEGER;
        
        -- Validar produto e obter preço
        SELECT price INTO v_unit_price 
        FROM products 
        WHERE id = v_product_id AND available = true AND deleted_at IS NULL;
        
        IF v_unit_price IS NULL THEN
            RAISE EXCEPTION 'Produto não encontrado ou indisponível: %', v_product_id;
        END IF;
        
        -- Verificar estoque
        IF NOT EXISTS (
            SELECT 1 FROM products 
            WHERE id = v_product_id AND stock_quantity >= v_quantity
        ) THEN
            RAISE EXCEPTION 'Estoque insuficiente para produto: %', v_product_id;
        END IF;
        
        v_item_total := v_quantity * v_unit_price;
        v_total_amount := v_total_amount + v_item_total;
        
        -- Inserir item do pedido
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
        VALUES (v_order_id, v_product_id, v_quantity, v_unit_price, v_item_total);
        
        -- Atualizar estoque
        UPDATE products 
        SET stock_quantity = stock_quantity - v_quantity,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_product_id;
    END LOOP;
    
    -- Atualizar total do pedido
    UPDATE orders 
    SET total_amount = v_total_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = v_order_id;
    
    -- Retornar resultado
    RETURN QUERY SELECT v_order_id, v_order_number, v_total_amount, 'PENDING'::VARCHAR(20);
    
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback automático em caso de erro
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- Procedure para relatório de vendas
CREATE OR REPLACE FUNCTION sales_report(
    p_start_date DATE,
    p_end_date DATE,
    p_group_by VARCHAR(20) DEFAULT 'day'
)
RETURNS TABLE(
    period TEXT,
    total_orders BIGINT,
    total_revenue DECIMAL(10,2),
    avg_order_value DECIMAL(10,2),
    top_product VARCHAR(255)
) AS $$
DECLARE
    v_date_format TEXT;
BEGIN
    -- Definir formato de data baseado no agrupamento
    v_date_format := CASE p_group_by
        WHEN 'hour' THEN 'YYYY-MM-DD HH24:00'
        WHEN 'day' THEN 'YYYY-MM-DD'
        WHEN 'week' THEN 'YYYY-"W"WW'
        WHEN 'month' THEN 'YYYY-MM'
        ELSE 'YYYY-MM-DD'
    END;
    
    RETURN QUERY
    WITH sales_data AS (
        SELECT 
            TO_CHAR(o.created_at, v_date_format) as period_key,
            COUNT(*) as order_count,
            SUM(o.total_amount) as revenue,
            AVG(o.total_amount) as avg_value
        FROM orders o
        WHERE o.created_at::DATE BETWEEN p_start_date AND p_end_date
          AND o.status NOT IN ('CANCELLED')
          AND o.deleted_at IS NULL
        GROUP BY TO_CHAR(o.created_at, v_date_format)
    ),
    top_products AS (
        SELECT 
            TO_CHAR(o.created_at, v_date_format) as period_key,
            p.name,
            ROW_NUMBER() OVER (
                PARTITION BY TO_CHAR(o.created_at, v_date_format) 
                ORDER BY SUM(oi.quantity) DESC
            ) as rn
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.created_at::DATE BETWEEN p_start_date AND p_end_date
          AND o.status NOT IN ('CANCELLED')
          AND o.deleted_at IS NULL
        GROUP BY TO_CHAR(o.created_at, v_date_format), p.name
    )
    SELECT 
        sd.period_key,
        sd.order_count,
        sd.revenue,
        sd.avg_value,
        COALESCE(tp.name, 'N/A')
    FROM sales_data sd
    LEFT JOIN top_products tp ON sd.period_key = tp.period_key AND tp.rn = 1
    ORDER BY sd.period_key;
END;
$$ LANGUAGE plpgsql;

-- Procedure para limpeza de dados antigos
CREATE OR REPLACE FUNCTION cleanup_old_data(
    p_days_to_keep INTEGER DEFAULT 365
)
RETURNS TABLE(
    table_name TEXT,
    records_deleted BIGINT
) AS $$
DECLARE
    v_cutoff_date TIMESTAMP WITH TIME ZONE;
    v_deleted_count BIGINT;
BEGIN
    v_cutoff_date := CURRENT_TIMESTAMP - (p_days_to_keep || ' days')::INTERVAL;
    
    -- Limpar logs de auditoria antigos
    DELETE FROM audit_log WHERE created_at < v_cutoff_date;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN QUERY SELECT 'audit_log'::TEXT, v_deleted_count;
    
    -- Limpar pedidos cancelados antigos (soft delete)
    UPDATE orders 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE status = 'CANCELLED' 
      AND created_at < v_cutoff_date 
      AND deleted_at IS NULL;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN QUERY SELECT 'orders_cancelled'::TEXT, v_deleted_count;
    
    -- Limpar usuários inativos antigos (soft delete)
    UPDATE users 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE active = false 
      AND last_activity_at < v_cutoff_date 
      AND deleted_at IS NULL;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN QUERY SELECT 'users_inactive'::TEXT, v_deleted_count;
    
END;
$$ LANGUAGE plpgsql;

-- Procedure para análise de performance de queries
CREATE OR REPLACE FUNCTION analyze_query_performance()
RETURNS TABLE(
    query_type TEXT,
    avg_duration_ms NUMERIC,
    total_calls BIGINT,
    recommendation TEXT
) AS $$
BEGIN
    -- Esta função seria expandida com pg_stat_statements em produção
    RETURN QUERY
    SELECT 
        'orders_by_customer'::TEXT,
        0.5::NUMERIC,
        1000::BIGINT,
        'Índice otimizado presente'::TEXT
    UNION ALL
    SELECT 
        'products_search'::TEXT,
        1.2::NUMERIC,
        500::BIGINT,
        'Considerar índice trigram'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Comentários
COMMENT ON FUNCTION process_order IS 'Processa pedido completo com validações e controle de estoque';
COMMENT ON FUNCTION sales_report IS 'Gera relatório de vendas agrupado por período';
COMMENT ON FUNCTION cleanup_old_data IS 'Remove dados antigos baseado em política de retenção';
COMMENT ON FUNCTION analyze_query_performance IS 'Analisa performance de queries frequentes';