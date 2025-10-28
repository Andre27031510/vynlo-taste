-- ============================================================================
-- Migration V24: Atualizar tabela ministries para Departamentos de Igrejas
-- ============================================================================

-- Renomear a tabela
ALTER TABLE ministries RENAME TO departments;

-- Adicionar campo church_id
ALTER TABLE departments
ADD COLUMN IF NOT EXISTS church_id BIGINT;

-- Adicionar foreign key para igrejas
ALTER TABLE departments
ADD CONSTRAINT fk_departments_church
FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE;

-- Criar índice para church_id
CREATE INDEX IF NOT EXISTS idx_departments_church_id ON departments(church_id);

-- Adicionar campos de líder (substituindo leader_id)
ALTER TABLE departments
ADD COLUMN IF NOT EXISTS department_type VARCHAR(100);

ALTER TABLE departments
ADD COLUMN IF NOT EXISTS leader_name VARCHAR(255);

ALTER TABLE departments
ADD COLUMN IF NOT EXISTS leader_phone VARCHAR(20);

-- Remover campos antigos se existirem
ALTER TABLE departments
DROP COLUMN IF EXISTS leader_id;

-- Comentários
COMMENT ON TABLE departments IS 'Departamentos de igrejas cadastradas';
COMMENT ON COLUMN departments.church_id IS 'Igreja a qual o departamento pertence';
COMMENT ON COLUMN departments.department_type IS 'Tipo do departamento (JOVENS, INFANTIL, SOCIAL, etc)';
COMMENT ON COLUMN departments.leader_name IS 'Nome do líder do departamento';
COMMENT ON COLUMN departments.leader_phone IS 'Telefone do líder do departamento';

