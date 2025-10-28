-- ============================================================================
-- Migration V22: Criar tabela churches (Igrejas)
-- ============================================================================
-- 
-- CONTEXTO: Sistema multi-tenant para gestão de igrejas
-- SEGMENTO: EKKLESIA
-- ISOLAMENTO: Row-Level Multi-Tenancy com tenant_id
-- 
-- CAMPOS:
-- - porte: Central, Estadual, Setorial
-- - cidade: Londrina, Maringá, Paiçandu
-- - nome_igreja: "Estadual Londrina"
-- - totvs: Número de matrícula
-- - pastor_nome, pastor_telefone
-- - financeira_nome, financeira_telefone
-- - endereco
-- 
-- Created: 2025-10-28
-- Author: Vynlo Tech - EKKLESIA Implementation
-- Status: PRODUCTION-READY
-- ============================================================================

CREATE TABLE IF NOT EXISTS churches (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    
    -- Identificação da Igreja
    porte VARCHAR(50) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    nome_igreja VARCHAR(200) NOT NULL,
    totvs VARCHAR(50) UNIQUE,
    
    -- Pastor
    pastor_nome VARCHAR(255) NOT NULL,
    pastor_telefone VARCHAR(20),
    
    -- Financeira
    financeira_nome VARCHAR(255) NOT NULL,
    financeira_telefone VARCHAR(20),
    
    -- Endereço
    endereco TEXT,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT churches_status_check CHECK (status IN ('ACTIVE', 'INACTIVE', 'TRANSFERRED')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_churches_tenant_id ON churches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_churches_porte ON churches(porte);
CREATE INDEX IF NOT EXISTS idx_churches_cidade ON churches(cidade);
CREATE INDEX IF NOT EXISTS idx_churches_totvs ON churches(totvs);
CREATE INDEX IF NOT EXISTS idx_churches_status ON churches(status) WHERE deleted_at IS NULL;

COMMENT ON TABLE churches IS 'Igrejas registradas no sistema';
COMMENT ON COLUMN churches.porte IS 'Porte da igreja (Central, Estadual, Setorial)';
COMMENT ON COLUMN churches.cidade IS 'Cidade da igreja';
COMMENT ON COLUMN churches.nome_igreja IS 'Nome completo: Porte + Cidade';
COMMENT ON COLUMN churches.totvs IS 'TOTVS - Número de matrícula da igreja';

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================

