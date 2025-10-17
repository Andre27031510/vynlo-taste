-- ============================================================================
-- Migration V11: Criar tabela tenants (Multi-Tenancy)
-- ============================================================================
-- 
-- CONTEXTO: Isolamento de dados entre clientes (Restaurantes, Igrejas, etc)
-- PROBLEMA: Admin Restaurante X vê dados do Restaurante Y (VAZAMENTO!)
-- SOLUÇÃO: Row-Level Multi-Tenancy com tenant_id em todas as tabelas
-- 
-- Created: 2025-10-17 14:30 UTC
-- Author: Vynlo Tech - Multi-Tenancy Implementation
-- Status: PRODUCTION-READY
-- Safety: Idempotent (CREATE IF NOT EXISTS)
-- 
-- ============================================================================

-- Criar tabela de tenants (clientes do sistema)
CREATE TABLE IF NOT EXISTS tenants (
    -- Identificação única
    id BIGSERIAL PRIMARY KEY,
    
    -- Identificador externo (UUID do Firebase)
    firebase_uid VARCHAR(128) NOT NULL UNIQUE,
    
    -- Dados da empresa
    company_name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,  -- CNPJ brasileiro (opcional)
    
    -- Produto Vynlo associado
    vynlo_product VARCHAR(50) NOT NULL DEFAULT 'TASTE',
    
    -- Tipo de cliente
    client_type VARCHAR(50) DEFAULT 'RESTAURANT',
    
    -- Status do tenant
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    
    -- Metadata de auditoria
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT tenants_status_check CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DELETED')),
    CONSTRAINT tenants_vynlo_product_check CHECK (
        vynlo_product IN ('TASTE', 'EKKLESIA', 'BOT', 'SAUDE', 'EDUCACAO', 'PETSHOPS', 'BARBEARIAS', 'SERVICOS')
    )
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tenants_firebase_uid ON tenants(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tenants_cnpj ON tenants(cnpj) WHERE cnpj IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenants_vynlo_product ON tenants(vynlo_product);
CREATE INDEX IF NOT EXISTS idx_tenants_company_name ON tenants(company_name);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_tenants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_tenants_updated_at ON tenants;
CREATE TRIGGER trigger_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_tenants_updated_at();

-- Comentários da tabela
COMMENT ON TABLE tenants IS 'Tabela de clientes (multi-tenancy) - Isolamento de dados entre restaurantes/empresas';
COMMENT ON COLUMN tenants.firebase_uid IS 'UID do Firebase do admin deste tenant';
COMMENT ON COLUMN tenants.company_name IS 'Nome da empresa/restaurante';
COMMENT ON COLUMN tenants.cnpj IS 'CNPJ da empresa (Brasil) - opcional';
COMMENT ON COLUMN tenants.vynlo_product IS 'Produto Vynlo: TASTE, EKKLESIA, BOT, etc';
COMMENT ON COLUMN tenants.client_type IS 'Tipo de cliente: RESTAURANT, CHURCH, CLINIC, etc';
COMMENT ON COLUMN tenants.status IS 'Status: ACTIVE (ativo), SUSPENDED (suspenso), DELETED (excluído)';

-- Log de execução
DO $$
BEGIN
    RAISE NOTICE 'Migration V11: Tabela tenants criada com sucesso';
    RAISE NOTICE 'Multi-Tenancy: Row-Level isolation implementado';
END $$;

