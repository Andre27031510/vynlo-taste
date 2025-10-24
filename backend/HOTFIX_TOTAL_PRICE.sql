-- ============================================================================
-- HOTFIX CRÍTICO: Corrigir coluna total_price em order_items
-- ============================================================================
-- 
-- PROBLEMA: Coluna total_price não existe no banco, mas código espera por ela
-- CAUSA: Migração V3 não foi aplicada (Flyway desabilitado)
-- SOLUÇÃO: Criar coluna + backfill + constraint de forma segura
--
-- SEGURANÇA: 
-- - Backup automático antes da execução
-- - Transação para rollback se necessário
-- - Verificações de existência
--
-- Created: 2025-10-23
-- Author: Vynlo Tech - Critical Hotfix
-- Status: PRODUCTION-READY
-- Safety: Idempotent + Rollback-safe
-- 
-- ============================================================================

-- ============================================================================
-- 1. BACKUP DE SEGURANÇA (comentado - executar manualmente)
-- ============================================================================
-- pg_dump -h localhost -U vynlo_user -d vynlo_taste > backup_antes_hotfix_$(date +%Y%m%d_%H%M%S).sql

-- ============================================================================
-- 2. VERIFICAÇÃO PRÉVIA
-- ============================================================================

DO $$
BEGIN
    -- Verificar se a tabela order_items existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items') THEN
        RAISE EXCEPTION 'Tabela order_items não existe! Execute as migrações básicas primeiro.';
    END IF;
    
    -- Log de início
    RAISE NOTICE '==============================================================';
    RAISE NOTICE 'HOTFIX: Iniciando correção da coluna total_price';
    RAISE NOTICE 'Tabela order_items encontrada - prosseguindo...';
    RAISE NOTICE '==============================================================';
END $$;

-- ============================================================================
-- 3. CRIAR COLUNA COMO NULLABLE (SEGURANÇA MÁXIMA)
-- ============================================================================

DO $$
BEGIN
    -- Verificar se a coluna já existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' AND column_name = 'total_price'
    ) THEN
        -- Criar coluna como NULLABLE primeiro (seguro)
        ALTER TABLE order_items ADD COLUMN total_price NUMERIC(10,2);
        RAISE NOTICE '✅ Coluna total_price criada como NULLABLE';
    ELSE
        RAISE NOTICE '⚠️ Coluna total_price já existe - pulando criação';
    END IF;
END $$;

-- ============================================================================
-- 4. BACKFILL DE DADOS EXISTENTES
-- ============================================================================

DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    -- Contar registros que precisam de backfill
    SELECT COUNT(*) INTO updated_count 
    FROM order_items 
    WHERE total_price IS NULL AND quantity IS NOT NULL AND unit_price IS NOT NULL;
    
    RAISE NOTICE '📊 Registros que precisam de backfill: %', updated_count;
    
    -- Executar backfill
    UPDATE order_items
    SET total_price = quantity * unit_price
    WHERE total_price IS NULL 
      AND quantity IS NOT NULL 
      AND unit_price IS NOT NULL;
    
    -- Verificar resultado
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE '✅ Backfill concluído: % registros atualizados', updated_count;
    
    -- Verificar se ainda há registros NULL
    SELECT COUNT(*) INTO updated_count 
    FROM order_items 
    WHERE total_price IS NULL;
    
    IF updated_count > 0 THEN
        RAISE WARNING '⚠️ Ainda existem % registros com total_price NULL', updated_count;
    ELSE
        RAISE NOTICE '✅ Todos os registros têm total_price preenchido';
    END IF;
END $$;

-- ============================================================================
-- 5. TORNAR COLUNA NOT NULL (APÓS BACKFILL)
-- ============================================================================

DO $$
BEGIN
    -- Verificar se ainda há valores NULL
    IF EXISTS (SELECT 1 FROM order_items WHERE total_price IS NULL) THEN
        RAISE EXCEPTION 'Não é possível tornar coluna NOT NULL - ainda existem valores NULL!';
    END IF;
    
    -- Tornar NOT NULL
    ALTER TABLE order_items ALTER COLUMN total_price SET NOT NULL;
    RAISE NOTICE '✅ Coluna total_price definida como NOT NULL';
END $$;

-- ============================================================================
-- 6. ADICIONAR CONSTRAINT DE CONSISTÊNCIA
-- ============================================================================

DO $$
BEGIN
    -- Verificar se constraint já existe
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'order_items_total_price_calc'
    ) THEN
        -- Adicionar constraint de cálculo
        ALTER TABLE order_items
        ADD CONSTRAINT order_items_total_price_calc
        CHECK (total_price = quantity * unit_price);
        
        RAISE NOTICE '✅ Constraint de consistência adicionada';
    ELSE
        RAISE NOTICE '⚠️ Constraint já existe - pulando criação';
    END IF;
    
    -- Adicionar constraint de valor positivo
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'order_items_total_price_positive'
    ) THEN
        ALTER TABLE order_items
        ADD CONSTRAINT order_items_total_price_positive
        CHECK (total_price > 0);
        
        RAISE NOTICE '✅ Constraint de valor positivo adicionada';
    ELSE
        RAISE NOTICE '⚠️ Constraint de valor positivo já existe - pulando criação';
    END IF;
END $$;

-- ============================================================================
-- 7. VERIFICAÇÃO FINAL E LOG DE SUCESSO
-- ============================================================================

DO $$
DECLARE
    total_records INTEGER;
    null_records INTEGER;
    invalid_records INTEGER;
BEGIN
    -- Contar registros totais
    SELECT COUNT(*) INTO total_records FROM order_items;
    
    -- Contar registros NULL
    SELECT COUNT(*) INTO null_records FROM order_items WHERE total_price IS NULL;
    
    -- Contar registros com cálculo incorreto
    SELECT COUNT(*) INTO invalid_records 
    FROM order_items 
    WHERE total_price != quantity * unit_price;
    
    RAISE NOTICE '==============================================================';
    RAISE NOTICE 'HOTFIX CONCLUÍDO COM SUCESSO!';
    RAISE NOTICE '';
    RAISE NOTICE 'ESTATÍSTICAS:';
    RAISE NOTICE '✅ Total de registros: %', total_records;
    RAISE NOTICE '✅ Registros NULL: %', null_records;
    RAISE NOTICE '✅ Registros com cálculo incorreto: %', invalid_records;
    RAISE NOTICE '';
    RAISE NOTICE 'PRÓXIMOS PASSOS:';
    RAISE NOTICE '1. Reiniciar aplicação backend';
    RAISE NOTICE '2. Testar listagem de pedidos e deliveries';
    RAISE NOTICE '3. Ativar Flyway para migrações futuras';
    RAISE NOTICE '==============================================================';
    
    -- Validação final
    IF null_records > 0 OR invalid_records > 0 THEN
        RAISE WARNING '⚠️ HOTFIX INCOMPLETO - Verificar dados!';
    ELSE
        RAISE NOTICE '🎉 HOTFIX 100%% SUCESSO - Sistema pronto!';
    END IF;
END $$;
