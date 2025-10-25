-- Migration V17: Create integrations and external_orders tables
-- Created: 2025-10-25 18:00 UTC
-- Author: Cursor - Integration System Implementation
-- Safety: Idempotent + Multi-Tenancy Support

-- ============================================================================
-- TABELA INTEGRATIONS
-- ============================================================================

-- Verificar se a tabela já existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'integrations') THEN
        CREATE TABLE integrations (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            type VARCHAR(20) NOT NULL CHECK (type IN ('IFOOD', 'UBER_EATS', 'WHATSAPP', 'WEBSITE', 'APP', 'TELEGRAM', 'INSTAGRAM', 'FACEBOOK')),
            status VARCHAR(20) NOT NULL CHECK (status IN ('CONNECTED', 'PENDING', 'DISCONNECTED', 'ERROR', 'MAINTENANCE')),
            api_key VARCHAR(500),
            webhook_url VARCHAR(500),
            api_secret VARCHAR(500),
            configuration TEXT,
            auto_reply BOOLEAN NOT NULL DEFAULT true,
            notifications BOOLEAN NOT NULL DEFAULT true,
            active BOOLEAN NOT NULL DEFAULT true,
            orders_count BIGINT DEFAULT 0,
            last_sync_at TIMESTAMP,
            last_error_at TIMESTAMP,
            last_error_message VARCHAR(1000),
            health_score INTEGER DEFAULT 100,
            health_status VARCHAR(20) DEFAULT 'EXCELLENT' CHECK (health_status IN ('EXCELLENT', 'GOOD', 'WARNING', 'CRITICAL', 'DISCONNECTED')),
            tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        -- Índices para performance
        CREATE INDEX idx_integrations_tenant_id ON integrations(tenant_id);
        CREATE INDEX idx_integrations_type ON integrations(type);
        CREATE INDEX idx_integrations_status ON integrations(status);
        CREATE INDEX idx_integrations_active ON integrations(active);
        CREATE INDEX idx_integrations_api_key ON integrations(api_key);
        
        RAISE NOTICE 'Tabela integrations criada com sucesso';
    ELSE
        RAISE NOTICE 'Tabela integrations já existe';
    END IF;
END $$;

-- ============================================================================
-- TABELA EXTERNAL_ORDERS
-- ============================================================================

-- Verificar se a tabela já existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'external_orders') THEN
        CREATE TABLE external_orders (
            id BIGSERIAL PRIMARY KEY,
            external_id VARCHAR(100) NOT NULL,
            integration_id BIGINT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
            status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED')),
            customer_name VARCHAR(200),
            customer_phone VARCHAR(20),
            customer_email VARCHAR(200),
            delivery_address VARCHAR(500),
            total_amount DECIMAL(10,2),
            delivery_fee DECIMAL(10,2),
            service_fee DECIMAL(10,2),
            payment_method VARCHAR(50),
            payment_status VARCHAR(20),
            estimated_delivery_time TIMESTAMP,
            external_created_at TIMESTAMP,
            external_updated_at TIMESTAMP,
            notes TEXT,
            items TEXT, -- JSON com itens do pedido
            metadata TEXT, -- JSON com metadados específicos da plataforma
            sync_status VARCHAR(20) DEFAULT 'PENDING' CHECK (sync_status IN ('PENDING', 'SUCCESS', 'FAILED')),
            sync_attempts INTEGER DEFAULT 0,
            last_sync_at TIMESTAMP,
            last_sync_error VARCHAR(1000),
            internal_order_id BIGINT, -- ID do pedido criado internamente
            tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        -- Índices para performance
        CREATE INDEX idx_external_orders_tenant_id ON external_orders(tenant_id);
        CREATE INDEX idx_external_orders_integration_id ON external_orders(integration_id);
        CREATE INDEX idx_external_orders_external_id ON external_orders(external_id);
        CREATE INDEX idx_external_orders_status ON external_orders(status);
        CREATE INDEX idx_external_orders_sync_status ON external_orders(sync_status);
        CREATE INDEX idx_external_orders_internal_order_id ON external_orders(internal_order_id);
        
        -- Índice único para evitar duplicatas
        CREATE UNIQUE INDEX idx_external_orders_tenant_external_id ON external_orders(tenant_id, external_id);
        
        RAISE NOTICE 'Tabela external_orders criada com sucesso';
    ELSE
        RAISE NOTICE 'Tabela external_orders já existe';
    END IF;
END $$;

-- ============================================================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================================================

-- Trigger para integrations
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_integrations_updated_at') THEN
        CREATE OR REPLACE FUNCTION update_integrations_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER trigger_integrations_updated_at
            BEFORE UPDATE ON integrations
            FOR EACH ROW
            EXECUTE FUNCTION update_integrations_updated_at();
        
        RAISE NOTICE 'Trigger para updated_at em integrations criado';
    END IF;
END $$;

-- Trigger para external_orders
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_external_orders_updated_at') THEN
        CREATE OR REPLACE FUNCTION update_external_orders_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER trigger_external_orders_updated_at
            BEFORE UPDATE ON external_orders
            FOR EACH ROW
            EXECUTE FUNCTION update_external_orders_updated_at();
        
        RAISE NOTICE 'Trigger para updated_at em external_orders criado';
    END IF;
END $$;

-- ============================================================================
-- DADOS INICIAIS (OPCIONAL)
-- ============================================================================

-- Inserir integrações padrão para cada tenant existente
DO $$
DECLARE
    tenant_record RECORD;
BEGIN
    -- Para cada tenant existente, criar integrações padrão
    FOR tenant_record IN SELECT id FROM tenants LOOP
        -- iFood
        IF NOT EXISTS (SELECT 1 FROM integrations WHERE tenant_id = tenant_record.id AND type = 'IFOOD') THEN
            INSERT INTO integrations (name, type, status, tenant_id, created_at, updated_at)
            VALUES ('iFood', 'IFOOD', 'PENDING', tenant_record.id, NOW(), NOW());
        END IF;
        
        -- Uber Eats
        IF NOT EXISTS (SELECT 1 FROM integrations WHERE tenant_id = tenant_record.id AND type = 'UBER_EATS') THEN
            INSERT INTO integrations (name, type, status, tenant_id, created_at, updated_at)
            VALUES ('Uber Eats', 'UBER_EATS', 'PENDING', tenant_record.id, NOW(), NOW());
        END IF;
        
        -- WhatsApp Business
        IF NOT EXISTS (SELECT 1 FROM integrations WHERE tenant_id = tenant_record.id AND type = 'WHATSAPP') THEN
            INSERT INTO integrations (name, type, status, tenant_id, created_at, updated_at)
            VALUES ('WhatsApp Business', 'WHATSAPP', 'PENDING', tenant_record.id, NOW(), NOW());
        END IF;
        
        -- Site Próprio
        IF NOT EXISTS (SELECT 1 FROM integrations WHERE tenant_id = tenant_record.id AND type = 'WEBSITE') THEN
            INSERT INTO integrations (name, type, status, tenant_id, created_at, updated_at)
            VALUES ('Site Próprio', 'WEBSITE', 'CONNECTED', tenant_record.id, NOW(), NOW());
        END IF;
        
        -- App Mobile
        IF NOT EXISTS (SELECT 1 FROM integrations WHERE tenant_id = tenant_record.id AND type = 'APP') THEN
            INSERT INTO integrations (name, type, status, tenant_id, created_at, updated_at)
            VALUES ('App Mobile', 'APP', 'CONNECTED', tenant_record.id, NOW(), NOW());
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Integrações padrão criadas para todos os tenants';
END $$;

-- ============================================================================
-- COMENTÁRIOS DAS TABELAS
-- ============================================================================

COMMENT ON TABLE integrations IS 'Integrações com plataformas externas (iFood, Uber Eats, WhatsApp, etc.)';
COMMENT ON TABLE external_orders IS 'Pedidos vindos de plataformas externas';

COMMENT ON COLUMN integrations.tenant_id IS 'ID do tenant (restaurante/empresa) - Multi-tenancy';
COMMENT ON COLUMN integrations.api_key IS 'Chave de API da plataforma externa';
COMMENT ON COLUMN integrations.webhook_url IS 'URL do webhook para receber notificações';
COMMENT ON COLUMN integrations.configuration IS 'Configurações específicas da plataforma (JSON)';
COMMENT ON COLUMN integrations.health_score IS 'Score de saúde da integração (0-100)';

COMMENT ON COLUMN external_orders.tenant_id IS 'ID do tenant (restaurante/empresa) - Multi-tenancy';
COMMENT ON COLUMN external_orders.external_id IS 'ID do pedido na plataforma externa';
COMMENT ON COLUMN external_orders.integration_id IS 'Referência para a integração';
COMMENT ON COLUMN external_orders.items IS 'Itens do pedido em formato JSON';
COMMENT ON COLUMN external_orders.metadata IS 'Metadados específicos da plataforma (JSON)';
COMMENT ON COLUMN external_orders.internal_order_id IS 'ID do pedido criado no sistema interno';
COMMENT ON COLUMN external_orders.sync_status IS 'Status da sincronização com sistema interno';

RAISE NOTICE '==============================================================';
RAISE NOTICE 'Migration V17: Tabelas de integração criadas com sucesso!';
RAISE NOTICE '==============================================================';
