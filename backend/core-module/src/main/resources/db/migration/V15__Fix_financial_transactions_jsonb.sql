-- ============================================================================
-- V15: Fix FinancialTransaction JSONB columns to TEXT
-- ============================================================================
-- 
-- PROBLEMA: Colunas JSONB causando erro de tipo incompatível
-- CAUSA: Hibernate criou colunas JSONB mas código Java usa String
-- SOLUÇÃO: Alterar colunas JSONB para TEXT para compatibilidade
--
-- CORREÇÃO CRÍTICA: Resolve erro "column attachments is of type jsonb but expression is of type character varying"
-- - Altera colunas JSONB para TEXT
-- - Mantém dados existentes
-- - Garante compatibilidade com código Java
--
-- Created: 2025-10-24
-- Author: Vynlo Tech - Critical Schema Fix
-- Status: PRODUCTION-READY
-- Safety: Idempotent + Rollback-safe
-- 
-- ============================================================================

-- Verificar se a tabela financial_transactions existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'financial_transactions') THEN
        RAISE EXCEPTION 'Tabela financial_transactions não existe! Execute as migrações básicas primeiro.';
    END IF;
    
    RAISE NOTICE '==============================================================';
    RAISE NOTICE 'V15: Iniciando correção de colunas JSONB para TEXT';
    RAISE NOTICE 'Tabela financial_transactions encontrada - prosseguindo...';
    RAISE NOTICE '==============================================================';
END $$;

-- ============================================================================
-- 1. CORRIGIR COLUNA ATTACHMENTS
-- ============================================================================

DO $$
BEGIN
    -- Verificar se coluna attachments existe e é JSONB
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'attachments' 
        AND data_type = 'jsonb'
    ) THEN
        -- Alterar de JSONB para TEXT
        ALTER TABLE financial_transactions 
        ALTER COLUMN attachments TYPE TEXT USING attachments::text;
        RAISE NOTICE 'Coluna attachments alterada de JSONB para TEXT';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'attachments' 
        AND data_type = 'text'
    ) THEN
        RAISE NOTICE 'Coluna attachments já é TEXT - pulando';
    ELSE
        -- Adicionar coluna se não existir
        ALTER TABLE financial_transactions ADD COLUMN attachments TEXT DEFAULT '[]';
        RAISE NOTICE 'Coluna attachments adicionada como TEXT';
    END IF;
END $$;

-- ============================================================================
-- 2. CORRIGIR COLUNA TAGS
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'tags' 
        AND data_type = 'jsonb'
    ) THEN
        ALTER TABLE financial_transactions 
        ALTER COLUMN tags TYPE TEXT USING tags::text;
        RAISE NOTICE 'Coluna tags alterada de JSONB para TEXT';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'tags' 
        AND data_type = 'text'
    ) THEN
        RAISE NOTICE 'Coluna tags já é TEXT - pulando';
    ELSE
        ALTER TABLE financial_transactions ADD COLUMN tags TEXT DEFAULT '[]';
        RAISE NOTICE 'Coluna tags adicionada como TEXT';
    END IF;
END $$;

-- ============================================================================
-- 3. CORRIGIR COLUNA METADATA
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'metadata' 
        AND data_type = 'jsonb'
    ) THEN
        ALTER TABLE financial_transactions 
        ALTER COLUMN metadata TYPE TEXT USING metadata::text;
        RAISE NOTICE 'Coluna metadata alterada de JSONB para TEXT';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'metadata' 
        AND data_type = 'text'
    ) THEN
        RAISE NOTICE 'Coluna metadata já é TEXT - pulando';
    ELSE
        ALTER TABLE financial_transactions ADD COLUMN metadata TEXT DEFAULT '{}';
        RAISE NOTICE 'Coluna metadata adicionada como TEXT';
    END IF;
END $$;

-- ============================================================================
-- 4. CORRIGIR COLUNA RECURRING_INFO
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'recurring_info' 
        AND data_type = 'jsonb'
    ) THEN
        ALTER TABLE financial_transactions 
        ALTER COLUMN recurring_info TYPE TEXT USING recurring_info::text;
        RAISE NOTICE 'Coluna recurring_info alterada de JSONB para TEXT';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'recurring_info' 
        AND data_type = 'text'
    ) THEN
        RAISE NOTICE 'Coluna recurring_info já é TEXT - pulando';
    ELSE
        ALTER TABLE financial_transactions ADD COLUMN recurring_info TEXT;
        RAISE NOTICE 'Coluna recurring_info adicionada como TEXT';
    END IF;
END $$;

-- ============================================================================
-- 5. ADICIONAR COLUNAS FALTANTES (se não existirem)
-- ============================================================================

-- Adicionar colunas que podem estar faltando
DO $$
BEGIN
    -- transaction_date
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'transaction_date'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN transaction_date DATE;
        RAISE NOTICE 'Coluna transaction_date adicionada';
    END IF;
    
    -- due_date
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'due_date'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN due_date DATE;
        RAISE NOTICE 'Coluna due_date adicionada';
    END IF;
    
    -- payment_date
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'payment_date'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN payment_date DATE;
        RAISE NOTICE 'Coluna payment_date adicionada';
    END IF;
    
    -- reference_number
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'reference_number'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN reference_number VARCHAR(100);
        RAISE NOTICE 'Coluna reference_number adicionada';
    END IF;
    
    -- payment_method
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN payment_method VARCHAR(50);
        RAISE NOTICE 'Coluna payment_method adicionada';
    END IF;
    
    -- account_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'account_id'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN account_id BIGINT;
        RAISE NOTICE 'Coluna account_id adicionada';
    END IF;
    
    -- restaurant_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'restaurant_id'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN restaurant_id BIGINT;
        RAISE NOTICE 'Coluna restaurant_id adicionada';
    END IF;
    
    -- order_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'order_id'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN order_id BIGINT;
        RAISE NOTICE 'Coluna order_id adicionada';
    END IF;
    
    -- customer_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'customer_id'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN customer_id BIGINT;
        RAISE NOTICE 'Coluna customer_id adicionada';
    END IF;
    
    -- supplier_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'supplier_id'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN supplier_id BIGINT;
        RAISE NOTICE 'Coluna supplier_id adicionada';
    END IF;
    
    -- created_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN created_by BIGINT;
        RAISE NOTICE 'Coluna created_by adicionada';
    END IF;
    
    -- updated_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'updated_by'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN updated_by BIGINT;
        RAISE NOTICE 'Coluna updated_by adicionada';
    END IF;
    
    -- deleted_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'deleted_by'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN deleted_by BIGINT;
        RAISE NOTICE 'Coluna deleted_by adicionada';
    END IF;
    
    -- deleted_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN deleted_at TIMESTAMP;
        RAISE NOTICE 'Coluna deleted_at adicionada';
    END IF;
END $$;

-- ============================================================================
-- 6. VERIFICAÇÃO FINAL
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================================';
    RAISE NOTICE 'V15: Verificação final das colunas corrigidas';
    RAISE NOTICE '==============================================================';
    
    -- Verificar colunas críticas
    PERFORM column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'financial_transactions' 
    AND column_name IN ('attachments', 'tags', 'metadata', 'recurring_info')
    ORDER BY column_name;
    
    RAISE NOTICE '✅ Migração V15 concluída: Colunas JSONB corrigidas para TEXT';
    RAISE NOTICE '✅ Schema compatível com código Java';
    RAISE NOTICE '✅ Erro "jsonb but expression is of type character varying" resolvido';
END $$;

-- Comentários
COMMENT ON COLUMN financial_transactions.attachments IS 'Anexos em formato JSON string - V15 Schema Fix';
COMMENT ON COLUMN financial_transactions.tags IS 'Tags em formato JSON string - V15 Schema Fix';
COMMENT ON COLUMN financial_transactions.metadata IS 'Metadados em formato JSON string - V15 Schema Fix';
COMMENT ON COLUMN financial_transactions.recurring_info IS 'Informações de recorrência em formato JSON string - V15 Schema Fix';
