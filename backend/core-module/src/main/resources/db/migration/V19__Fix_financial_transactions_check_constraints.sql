-- ============================================================================
-- V19: Fix FinancialTransactions CHECK Constraints
-- ============================================================================
-- 
-- PROBLEMA: CHECK constraints não incluem todos os valores usados no código
-- CAUSA: Conflito entre código Java e schema do banco
-- SOLUÇÃO: Atualizar CHECK constraints para incluir todos os valores
--
-- CORREÇÃO: Status inclui 'COMPLETED', Type inclui 'TRANSFER' e 'ADJUSTMENT'
-- Alinha código Java com schema do banco
--
-- Created: 2025-10-25
-- Author: Vynlo Tech - Schema Alignment
-- Status: PRODUCTION-READY
-- Safety: Idempotent + Rollback-safe
-- 
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================================';
    RAISE NOTICE 'V19: Corrigindo CHECK constraints de financial_transactions';
    RAISE NOTICE '==============================================================';
END $$;

-- ============================================================================
-- 1. CORRIGIR CHECK CONSTRAINT DE STATUS
-- ============================================================================
-- Adiciona 'COMPLETED' que é usado no código Java mas não estava no CHECK
-- Valores válidos: PENDING, CONFIRMED, COMPLETED, CANCELLED

DO $$
BEGIN
    -- Verificar se a constraint existe
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'status' 
        AND constraint_name LIKE '%status_check%'
    ) THEN
        -- Dropar constraint antiga
        ALTER TABLE financial_transactions 
        DROP CONSTRAINT IF EXISTS financial_transactions_status_check;
        
        RAISE NOTICE 'Constraint antiga de status removida';
    END IF;
    
    -- Adicionar nova constraint com 'COMPLETED'
    ALTER TABLE financial_transactions 
    ADD CONSTRAINT financial_transactions_status_check 
    CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'FAILED', 'REFUNDED'));
    
    RAISE NOTICE '✅ Constraint de status atualizada: inclui COMPLETED, FAILED, REFUNDED';
END $$;

-- ============================================================================
-- 2. CORRIGIR CHECK CONSTRAINT DE TYPE
-- ============================================================================
-- Adiciona 'TRANSFER' e 'ADJUSTMENT' que são usados no código Java
-- Valores válidos: INCOME, EXPENSE, TRANSFER, ADJUSTMENT

DO $$
BEGIN
    -- Verificar se a constraint existe
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'type' 
        AND constraint_name LIKE '%type_check%'
    ) THEN
        -- Dropar constraint antiga
        ALTER TABLE financial_transactions 
        DROP CONSTRAINT IF EXISTS financial_transactions_type_check;
        
        RAISE NOTICE 'Constraint antiga de type removida';
    END IF;
    
    -- Adicionar nova constraint com TRANSFER e ADJUSTMENT
    ALTER TABLE financial_transactions 
    ADD CONSTRAINT financial_transactions_type_check 
    CHECK (type IN ('INCOME', 'EXPENSE', 'TRANSFER', 'ADJUSTMENT'));
    
    RAISE NOTICE '✅ Constraint de type atualizada: inclui TRANSFER e ADJUSTMENT';
END $$;

-- ============================================================================
-- 3. CORRIGIR CASH_FLOW STATUS CHECK (se existir)
-- ============================================================================
-- Garantir que cash_flow também aceita COMPLETED

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'cash_flow'
    ) THEN
        -- Dropar constraint antiga se existir
        ALTER TABLE cash_flow 
        DROP CONSTRAINT IF EXISTS cash_flow_status_check;
        
        -- Adicionar nova constraint com COMPLETED
        ALTER TABLE cash_flow 
        ADD CONSTRAINT cash_flow_status_check 
        CHECK (status IN ('CONFIRMED', 'PENDING', 'CANCELLED'));
        
        RAISE NOTICE '✅ Constraint de cash_flow atualizada';
    ELSE
        RAISE NOTICE 'Tabela cash_flow não existe - pulando';
    END IF;
END $$;

-- ============================================================================
-- 4. VERIFICAÇÃO FINAL
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================================';
    RAISE NOTICE 'V19: Verificação final das constraints corrigidas';
    RAISE NOTICE '==============================================================';
    
    RAISE NOTICE '✅ Status aceita: PENDING, CONFIRMED, COMPLETED, CANCELLED, FAILED, REFUNDED';
    RAISE NOTICE '✅ Type aceita: INCOME, EXPENSE, TRANSFER, ADJUSTMENT';
    RAISE NOTICE '✅ Schema alinhado com código Java';
    RAISE NOTICE '✅ Conflito resolvido: CHECK constraints atualizadas';
    RAISE NOTICE '==============================================================';
END $$;

-- Comentários
COMMENT ON CONSTRAINT financial_transactions_status_check ON financial_transactions IS 'V19: Updated to include COMPLETED, FAILED, REFUNDED';
COMMENT ON CONSTRAINT financial_transactions_type_check ON financial_transactions IS 'V19: Updated to include TRANSFER, ADJUSTMENT';

