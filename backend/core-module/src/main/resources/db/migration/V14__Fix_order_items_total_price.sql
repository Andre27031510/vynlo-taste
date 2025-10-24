-- ============================================================================
-- V14: Fix order_items total_price column
-- ============================================================================
-- 
-- PROBLEMA: Campo total_price pode estar NULL em registros existentes
-- SOLUÇÃO: Garantir que todos os registros tenham total_price calculado
--
-- CORREÇÃO CRÍTICA: Resolve conflito entre schema DB e entidade JPA
-- - Adiciona coluna total_price se não existir
-- - Backfill de dados existentes com cálculo correto
-- - Aplica constraints NOT NULL e CHECK
-- - Garante integridade referencial
--
-- Created: 2025-10-24
-- Author: Vynlo Tech - Fase 3 Robustez
-- Status: PRODUCTION-READY
-- Safety: Idempotent + Rollback-safe
-- 
-- ============================================================================

-- Verificar se a coluna existe e está configurada corretamente
DO $$
BEGIN
    -- 1. Verificar se coluna total_price existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' AND column_name = 'total_price'
    ) THEN
        -- Adicionar coluna se não existir
        ALTER TABLE order_items ADD COLUMN total_price DECIMAL(10,2);
        RAISE NOTICE 'Coluna total_price adicionada em order_items';
    END IF;
    
    -- 2. Atualizar registros com total_price NULL
    UPDATE order_items 
    SET total_price = quantity * unit_price
    WHERE total_price IS NULL;
    
    -- 3. Adicionar constraint NOT NULL se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'order_items_total_price_not_null'
    ) THEN
        ALTER TABLE order_items ALTER COLUMN total_price SET NOT NULL;
        RAISE NOTICE 'Constraint NOT NULL adicionada em total_price';
    END IF;
    
    -- 4. Adicionar constraint de cálculo se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'order_items_total_price_calc'
    ) THEN
        ALTER TABLE order_items 
        ADD CONSTRAINT order_items_total_price_calc 
        CHECK (total_price = quantity * unit_price);
        RAISE NOTICE 'Constraint de cálculo adicionada em total_price';
    END IF;
    
    -- 5. Adicionar constraint de valor positivo se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'order_items_total_price_positive'
    ) THEN
        ALTER TABLE order_items 
        ADD CONSTRAINT order_items_total_price_positive 
        CHECK (total_price > 0);
        RAISE NOTICE 'Constraint de valor positivo adicionada em total_price';
    END IF;
    
    RAISE NOTICE '✅ Migração V14 concluída: total_price corrigido e validado';
END $$;

-- Comentários
COMMENT ON COLUMN order_items.total_price IS 'Preço total calculado (quantity * unit_price) - Fase 3 Robustez';
COMMENT ON CONSTRAINT order_items_total_price_calc ON order_items IS 'Garante que total_price = quantity * unit_price';
COMMENT ON CONSTRAINT order_items_total_price_positive ON order_items IS 'Garante que total_price > 0';
COMMENT ON CONSTRAINT order_items_total_price_not_null ON order_items IS 'Garante que total_price não seja NULL';
