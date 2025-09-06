-- V5: Sistema de auditoria e triggers
-- Autor: Sistema Vynlo Taste
-- Data: 2024-01-05

-- Tabela de auditoria particionada por data
CREATE TABLE audit_log (
    id BIGSERIAL,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(20) NOT NULL,
    record_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    user_id BIGINT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Partições para auditoria (6 meses)
CREATE TABLE audit_log_2024_01 PARTITION OF audit_log
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE audit_log_2024_02 PARTITION OF audit_log
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
CREATE TABLE audit_log_2024_03 PARTITION OF audit_log
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
CREATE TABLE audit_log_2024_04 PARTITION OF audit_log
    FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');
CREATE TABLE audit_log_2024_05 PARTITION OF audit_log
    FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
CREATE TABLE audit_log_2024_06 PARTITION OF audit_log
    FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');

-- Função genérica de auditoria
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    audit_row audit_log%ROWTYPE;
    current_user_id BIGINT;
    current_ip INET;
    current_user_agent TEXT;
BEGIN
    -- Captura informações do contexto (se disponível)
    current_user_id := NULLIF(current_setting('app.current_user_id', true), '')::BIGINT;
    current_ip := NULLIF(current_setting('app.current_ip', true), '')::INET;
    current_user_agent := NULLIF(current_setting('app.current_user_agent', true), '');
    
    audit_row.table_name := TG_TABLE_NAME;
    audit_row.user_id := current_user_id;
    audit_row.ip_address := current_ip;
    audit_row.user_agent := current_user_agent;
    audit_row.created_at := CURRENT_TIMESTAMP;
    
    IF TG_OP = 'DELETE' THEN
        audit_row.operation := 'DELETE';
        audit_row.record_id := OLD.id;
        audit_row.old_values := row_to_json(OLD);
        INSERT INTO audit_log VALUES (audit_row.*);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        audit_row.operation := 'UPDATE';
        audit_row.record_id := NEW.id;
        audit_row.old_values := row_to_json(OLD);
        audit_row.new_values := row_to_json(NEW);
        INSERT INTO audit_log VALUES (audit_row.*);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        audit_row.operation := 'INSERT';
        audit_row.record_id := NEW.id;
        audit_row.new_values := row_to_json(NEW);
        INSERT INTO audit_log VALUES (audit_row.*);
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers de auditoria para tabelas críticas
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_products_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_orders_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Trigger para soft delete
CREATE OR REPLACE FUNCTION soft_delete_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        RETURN NULL; -- Cancela o DELETE real
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Aplicar soft delete apenas em users (exemplo)
CREATE TRIGGER soft_delete_users_trigger
    BEFORE DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION soft_delete_trigger();

-- Trigger para estoque baixo (já criado na V2, mas vamos ativar)
CREATE TRIGGER check_low_stock_trigger
    AFTER UPDATE OF stock_quantity ON products
    FOR EACH ROW
    WHEN (NEW.stock_quantity != OLD.stock_quantity)
    EXECUTE FUNCTION check_low_stock();

-- Função para limpeza automática de auditoria
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
DECLARE
    cutoff_date DATE;
    partition_name TEXT;
BEGIN
    -- Remove logs mais antigos que 6 meses
    cutoff_date := CURRENT_DATE - INTERVAL '6 months';
    
    -- Lista partições antigas para remoção
    FOR partition_name IN 
        SELECT schemaname||'.'||tablename 
        FROM pg_tables 
        WHERE tablename LIKE 'audit_log_%' 
        AND tablename < 'audit_log_' || TO_CHAR(cutoff_date, 'YYYY_MM')
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || partition_name;
        RAISE NOTICE 'Dropped old audit partition: %', partition_name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Índices para auditoria
CREATE INDEX idx_audit_log_table_operation ON audit_log(table_name, operation);
CREATE INDEX idx_audit_log_record_id ON audit_log(record_id, table_name);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- Comentários
COMMENT ON TABLE audit_log IS 'Log de auditoria particionado por data';
COMMENT ON FUNCTION audit_trigger_function() IS 'Função genérica para auditoria de mudanças';
COMMENT ON FUNCTION soft_delete_trigger() IS 'Implementa soft delete para preservar dados';
COMMENT ON FUNCTION cleanup_old_audit_logs() IS 'Remove partições antigas de auditoria';