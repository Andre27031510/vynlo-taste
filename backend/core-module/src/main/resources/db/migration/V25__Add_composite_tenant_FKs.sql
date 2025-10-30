-- Fase 2 — Defesa no Banco (integridade referencial por tenant)
-- Objetivo: impedir relacionamentos cross-tenant por design usando FKs compostas

-- Observações:
-- 1) Garantimos uma UNIQUE constraint em (id, tenant_id) na tabela members para permitir FK composta
-- 2) Adicionamos FKs compostas em tithings, events e cell_groups
-- 3) Todos os comandos são idempotentes com checagens de existência

DO $$
BEGIN
    -- 1) UNIQUE (id, tenant_id) em members
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'uq_members_id_tenant'
    ) THEN
        ALTER TABLE members
            ADD CONSTRAINT uq_members_id_tenant UNIQUE (id, tenant_id);
    END IF;

    -- 2) Índices auxiliares para colunas compostas (melhora validação/joins)
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'idx_tithings_member_tenant' AND n.nspname = 'public'
    ) THEN
        CREATE INDEX idx_tithings_member_tenant ON tithings (member_id, tenant_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'idx_events_organizer_tenant' AND n.nspname = 'public'
    ) THEN
        CREATE INDEX idx_events_organizer_tenant ON events (organizer_id, tenant_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'idx_cell_groups_leader_tenant' AND n.nspname = 'public'
    ) THEN
        CREATE INDEX idx_cell_groups_leader_tenant ON cell_groups (leader_id, tenant_id);
    END IF;

    -- 3) FKs compostas
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_tithings_member_same_tenant'
    ) THEN
        ALTER TABLE tithings
            ADD CONSTRAINT fk_tithings_member_same_tenant
                FOREIGN KEY (member_id, tenant_id)
                REFERENCES members (id, tenant_id)
                ON UPDATE RESTRICT ON DELETE RESTRICT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_events_organizer_same_tenant'
    ) THEN
        ALTER TABLE events
            ADD CONSTRAINT fk_events_organizer_same_tenant
                FOREIGN KEY (organizer_id, tenant_id)
                REFERENCES members (id, tenant_id)
                ON UPDATE RESTRICT ON DELETE RESTRICT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_cell_groups_leader_same_tenant'
    ) THEN
        ALTER TABLE cell_groups
            ADD CONSTRAINT fk_cell_groups_leader_same_tenant
                FOREIGN KEY (leader_id, tenant_id)
                REFERENCES members (id, tenant_id)
                ON UPDATE RESTRICT ON DELETE RESTRICT;
    END IF;
END $$;



