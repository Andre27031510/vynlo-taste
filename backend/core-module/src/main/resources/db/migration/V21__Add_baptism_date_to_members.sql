-- Adiciona coluna baptism_date na tabela members
ALTER TABLE members
ADD COLUMN IF NOT EXISTS baptism_date DATE;


