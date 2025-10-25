-- Migration V18: Create system_configs table for tests
-- Created: 2025-10-25 18:30 UTC
-- Author: Cursor - Test Configuration

-- ============================================================================
-- Table: system_configs
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_configs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT, -- NULL for global configs, NOT NULL for tenant-specific
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT, -- JSON string for flexibility
    config_type VARCHAR(50),
    description VARCHAR(500),
    is_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
    is_editable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT uk_system_configs_tenant_key UNIQUE (tenant_id, config_key)
);

CREATE INDEX IF NOT EXISTS idx_system_configs_tenant_id ON system_configs (tenant_id);
CREATE INDEX IF NOT EXISTS idx_system_configs_key ON system_configs (config_key);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_system_configs_updated_at
BEFORE UPDATE ON system_configs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

RAISE NOTICE 'Table system_configs created or already exists.';
RAISE NOTICE 'Trigger update_system_configs_updated_at created or already exists.';

-- ============================================================================
-- Initial Test Data
-- ============================================================================
-- Inserir configurações de teste para tenant_id = 1 (se existir)
DO $$
DECLARE
    v_tenant_id BIGINT;
BEGIN
    SELECT id INTO v_tenant_id FROM tenants WHERE name = 'Vynlo Taste Restaurant' LIMIT 1;
    
    IF v_tenant_id IS NOT NULL THEN
        RAISE NOTICE 'Inserindo configurações de teste para tenant_id %', v_tenant_id;

        -- Configurações de aparência
        INSERT INTO system_configs (tenant_id, config_key, config_value, config_type, description, is_sensitive, is_editable, created_at, updated_at)
        VALUES 
            (v_tenant_id, 'theme', '"dark"', 'STRING', 'Tema da aplicação', FALSE, TRUE, NOW(), NOW()),
            (v_tenant_id, 'primary_color', '"#3b82f6"', 'STRING', 'Cor primária', FALSE, TRUE, NOW(), NOW()),
            (v_tenant_id, 'font_size', '"medium"', 'STRING', 'Tamanho da fonte', FALSE, TRUE, NOW(), NOW())
        ON CONFLICT (tenant_id, config_key) DO UPDATE SET
            config_value = EXCLUDED.config_value, updated_at = NOW();

        -- Configurações de sistema
        INSERT INTO system_configs (tenant_id, config_key, config_value, config_type, description, is_sensitive, is_editable, created_at, updated_at)
        VALUES 
            (v_tenant_id, 'language', '"pt-BR"', 'STRING', 'Idioma do sistema', FALSE, TRUE, NOW(), NOW()),
            (v_tenant_id, 'timezone', '"America/Sao_Paulo"', 'STRING', 'Fuso horário', FALSE, TRUE, NOW(), NOW()),
            (v_tenant_id, 'currency', '"BRL"', 'STRING', 'Moeda padrão', FALSE, TRUE, NOW(), NOW())
        ON CONFLICT (tenant_id, config_key) DO UPDATE SET
            config_value = EXCLUDED.config_value, updated_at = NOW();

    ELSE
        RAISE NOTICE 'Tenant não encontrado. Configurações de teste não inseridas.';
    END IF;
END $$;

RAISE NOTICE 'Migration V18 completed: system_configs table created and populated.';