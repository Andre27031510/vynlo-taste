-- ============================================================================
-- V16: Add missing 'date' column to financial_transactions
-- ============================================================================
-- 
-- PROBLEMA: Servidor tem constraint NOT NULL na coluna 'date' mas ela não existe
-- CAUSA: Inconsistência entre schema local e servidor
-- SOLUÇÃO: Adicionar coluna 'date' com constraint NOT NULL
--
-- CORREÇÃO CRÍTICA: Resolve erro "null value in column date violates not-null constraint"
-- - Adiciona coluna 'date' se não existir
-- - Preenche com 'transaction_date' onde for NULL
-- - Aplica constraint NOT NULL
--
-- Created: 2025-10-25
-- Author: Vynlo Tech - Critical Schema Fix
-- Status: PRODUCTION-READY
-- Safety: Idempotent + Rollback-safe
-- 
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================================';
    RAISE NOTICE 'V16: Adicionando coluna date em financial_transactions';
    RAISE NOTICE '==============================================================';
    
    -- 1. Adicionar coluna 'date' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'date'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN date DATE;
        RAISE NOTICE 'Coluna date adicionada em financial_transactions';
    ELSE
        RAISE NOTICE 'Coluna date já existe em financial_transactions';
    END IF;
    
    -- 2. Preencher coluna 'date' com 'transaction_date' se for NULL
    UPDATE financial_transactions
    SET date = transaction_date
    WHERE date IS NULL AND transaction_date IS NOT NULL;
    
    RAISE NOTICE 'Coluna date preenchida com transaction_date onde era NULL';
    
    -- 3. Adicionar constraint NOT NULL na coluna 'date'
    -- Verificar se a constraint já existe antes de adicionar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'date' 
        AND constraint_name LIKE '%not_null%'
    ) THEN
        ALTER TABLE financial_transactions ALTER COLUMN date SET NOT NULL;
        RAISE NOTICE 'Constraint NOT NULL adicionada na coluna date';
    ELSE
        RAISE NOTICE 'Constraint NOT NULL já existe na coluna date';
    END IF;
    
    RAISE NOTICE '==============================================================';
    RAISE NOTICE 'V16: Migração concluída - coluna date corrigida!';
    RAISE NOTICE '==============================================================';
END $$;
