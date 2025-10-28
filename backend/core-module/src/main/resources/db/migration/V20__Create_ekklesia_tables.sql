-- ============================================================================
-- Migration V20: Criar tabelas para Vynlo EKKLESIA (Sistema de Igrejas)
-- ============================================================================
-- 
-- CONTEXTO: Sistema multi-tenant para gestão de igrejas
-- SEGMENTO: EKKLESIA
-- ISOLAMENTO: Row-Level Multi-Tenancy com tenant_id
-- 
-- Tabelas criadas:
-- 1. members - Membros da igreja
-- 2. cell_groups - Grupos de células
-- 3. ministries - Ministérios
-- 4. events - Eventos/Cultos
-- 5. tithings - Dízimos e ofertas
-- 6. event_attendance - Presença em eventos
-- 7. ministry_members - Membros por ministério (tabela de relacionamento)
-- 
-- Created: 2025-10-28
-- Author: Vynlo Tech - EKKLESIA Implementation
-- Status: PRODUCTION-READY
-- Safety: Idempotent (CREATE IF NOT EXISTS)
-- 
-- ============================================================================

-- ============================================================================
-- 1. TABELA DE MINISTÉRIOS (base para outras tabelas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ministries (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    leader_id BIGINT, -- Referência a members.id
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT ministries_status_check CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ministries_tenant_id ON ministries(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ministries_leader_id ON ministries(leader_id);
CREATE INDEX IF NOT EXISTS idx_ministries_status ON ministries(status) WHERE deleted_at IS NULL;

-- ============================================================================
-- 2. TABELA DE GRUPOS DE CÉLULAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cell_groups (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    leader_id BIGINT, -- Referência a members.id
    location VARCHAR(255),
    day_of_week VARCHAR(20), -- 'MONDAY', 'TUESDAY', etc
    time TIME,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT cell_groups_status_check CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cell_groups_tenant_id ON cell_groups(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cell_groups_leader_id ON cell_groups(leader_id);
CREATE INDEX IF NOT EXISTS idx_cell_groups_status ON cell_groups(status) WHERE deleted_at IS NULL;

-- ============================================================================
-- 3. TABELA DE MEMBROS
-- ============================================================================
CREATE TABLE IF NOT EXISTS members (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    
    -- Dados pessoais
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    birth_date DATE,
    cpf VARCHAR(14) UNIQUE,
    address TEXT,
    
    -- Dados eclesiásticos
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    spiritual_status VARCHAR(50) NOT NULL DEFAULT 'NEW_BELIEVER', -- NEW_BELIEVER, GROWING, MATURE, LEADER
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, TRANSFERRED, VISITOR
    
    -- Relacionamentos
    cell_group_id BIGINT REFERENCES cell_groups(id) ON DELETE SET NULL,
    ministry_id BIGINT REFERENCES ministries(id) ON DELETE SET NULL,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT members_spiritual_status_check CHECK (spiritual_status IN ('NEW_BELIEVER', 'GROWING', 'MATURE', 'LEADER')),
    CONSTRAINT members_status_check CHECK (status IN ('ACTIVE', 'INACTIVE', 'TRANSFERRED', 'VISITOR')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_members_tenant_id ON members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_members_cell_group_id ON members(cell_group_id);
CREATE INDEX IF NOT EXISTS idx_members_ministry_id ON members(ministry_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_members_join_date ON members(join_date);

-- ============================================================================
-- 4. TABELA DE EVENTOS/CULTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    
    -- Dados do evento
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL, -- SERVICE, EVENT, CONFERENCE, RETREAT, CELL_GROUP
    category VARCHAR(50), -- SUNDAY_SERVICE, WEDNESDAY_SERVICE, SPECIAL_EVENT, etc
    
    -- Data e local
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    
    -- Organização
    organizer_id BIGINT REFERENCES members(id) ON DELETE SET NULL,
    
    -- Estatísticas
    expected_attendance INT,
    actual_attendance INT,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT events_type_check CHECK (event_type IN ('SERVICE', 'EVENT', 'CONFERENCE', 'RETREAT', 'CELL_GROUP', 'MEETING')),
    CONSTRAINT events_status_check CHECK (status IN ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_events_tenant_id ON events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

-- ============================================================================
-- 5. TABELA DE DÍZIMOS E OFERTAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS tithings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    
    -- Membros (opcional - pode ser anônimo)
    member_id BIGINT REFERENCES members(id) ON DELETE SET NULL,
    
    -- Dados financeiros
    amount DECIMAL(10,2) NOT NULL,
    tithe_type VARCHAR(50) NOT NULL, -- TITHE, OFFERING, DONATION, SPECIAL
    payment_method VARCHAR(50) NOT NULL, -- CASH, PIX, BANK_TRANSFER, CHECK, CREDIT_CARD
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Identificação
    reference_number VARCHAR(100),
    notes TEXT,
    
    -- Metadata
    recorded_by BIGINT REFERENCES users(id) ON DELETE SET NULL, -- Quem registrou
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT tithings_type_check CHECK (tithe_type IN ('TITHE', 'OFFERING', 'DONATION', 'SPECIAL')),
    CONSTRAINT tithings_payment_method_check CHECK (payment_method IN ('CASH', 'PIX', 'BANK_TRANSFER', 'CHECK', 'CREDIT_CARD')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tithings_tenant_id ON tithings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tithings_member_id ON tithings(member_id);
CREATE INDEX IF NOT EXISTS idx_tithings_payment_date ON tithings(payment_date);
CREATE INDEX IF NOT EXISTS idx_tithings_tithe_type ON tithings(tithe_type);

-- ============================================================================
-- 6. TABELA DE PRESENÇA EM EVENTOS (Many-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS event_attendance (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    attended BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(event_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_event_attendance_event_id ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_member_id ON event_attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_attended ON event_attendance(attended);

-- ============================================================================
-- 7. TABELA DE MEMBROS POR MINISTÉRIO (Many-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ministry_members (
    id BIGSERIAL PRIMARY KEY,
    ministry_id BIGINT NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
    member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'MEMBER', -- LEADER, COORDINATOR, MEMBER, VOLUNTEER
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT ministry_members_role_check CHECK (role IN ('LEADER', 'COORDINATOR', 'MEMBER', 'VOLUNTEER')),
    CONSTRAINT ministry_members_status_check CHECK (status IN ('ACTIVE', 'INACTIVE')),
    UNIQUE(ministry_id, member_id) WHERE deleted_at IS NULL
);

CREATE INDEX IF NOT EXISTS idx_ministry_members_ministry_id ON ministry_members(ministry_id);
CREATE INDEX IF NOT EXISTS idx_ministry_members_member_id ON ministry_members(member_id);
CREATE INDEX IF NOT EXISTS idx_ministry_members_status ON ministry_members(status) WHERE deleted_at IS NULL;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE ministries IS 'Ministérios da igreja (Louvor, Crianças, Jovens, etc)';
COMMENT ON TABLE cell_groups IS 'Grupos de células/lifegroups';
COMMENT ON TABLE members IS 'Membros cadastrados da igreja';
COMMENT ON TABLE events IS 'Eventos, cultos, conferências';
COMMENT ON TABLE tithings IS 'Dízimos e ofertas dos membros';
COMMENT ON TABLE event_attendance IS 'Presença dos membros em eventos';
COMMENT ON TABLE ministry_members IS 'Relacionamento many-to-many entre ministérios e membros';

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================

