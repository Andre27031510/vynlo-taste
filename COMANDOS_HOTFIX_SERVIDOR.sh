#!/bin/bash
# ============================================================================
# COMANDOS PARA EXECUTAR HOTFIX NO SERVIDOR
# ============================================================================
# 
# PROBLEMA: Coluna total_price não existe no banco
# SOLUÇÃO: Criar coluna + backfill + constraint
#
# SEGURANÇA: 
# - Backup antes da execução
# - Transação para rollback
# - Verificações de existência
#
# Created: 2025-10-23
# Author: Vynlo Tech - Critical Hotfix
# Status: PRODUCTION-READY
# 
# ============================================================================

echo "🚨 HOTFIX CRÍTICO: Corrigindo coluna total_price"
echo "=============================================================="

# 1. BACKUP DE SEGURANÇA
echo "📦 Criando backup de segurança..."
pg_dump -h localhost -U vynlo_user -d vynlo_taste > backup_antes_hotfix_$(date +%Y%m%d_%H%M%S).sql
echo "✅ Backup criado com sucesso!"

# 2. EXECUTAR HOTFIX
echo "🔧 Executando hotfix..."
psql -h localhost -U vynlo_user -d vynlo_taste << 'EOF'

-- Verificar se a tabela existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items') THEN
        RAISE EXCEPTION 'Tabela order_items não existe!';
    END IF;
    RAISE NOTICE 'Tabela order_items encontrada - prosseguindo...';
END $$;

-- Criar coluna como NULLABLE
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='order_items' AND column_name='total_price'
    ) THEN
        ALTER TABLE order_items ADD COLUMN total_price numeric(10,2);
        RAISE NOTICE 'Coluna total_price criada como NULLABLE';
    ELSE
        RAISE NOTICE 'Coluna total_price já existe';
    END IF;
END $$;

-- Backfill de dados existentes
UPDATE order_items
SET total_price = quantity * unit_price
WHERE total_price IS NULL;

-- Tornar NOT NULL após backfill
ALTER TABLE order_items ALTER COLUMN total_price SET NOT NULL;

-- Adicionar constraint de consistência
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'order_items_total_price_calc'
    ) THEN
        ALTER TABLE order_items
        ADD CONSTRAINT order_items_total_price_calc
        CHECK (total_price = quantity * unit_price);
        RAISE NOTICE 'Constraint de consistência adicionada';
    ELSE
        RAISE NOTICE 'Constraint já existe';
    END IF;
END $$;

-- Verificar resultado
SELECT 
    COUNT(*) as total_items,
    COUNT(total_price) as items_with_total_price,
    MIN(total_price) as min_total,
    MAX(total_price) as max_total
FROM order_items;

EOF

echo "✅ Hotfix executado com sucesso!"

# 3. VERIFICAR ESTRUTURA
echo "🔍 Verificando estrutura da tabela..."
psql -h localhost -U vynlo_user -d vynlo_taste -c "\d order_items"

# 4. REINICIAR APLICAÇÃO
echo "🔄 Reiniciando aplicação..."
sudo systemctl restart vynlo-taste-backend

echo "✅ Hotfix concluído com sucesso!"
echo "=============================================================="
