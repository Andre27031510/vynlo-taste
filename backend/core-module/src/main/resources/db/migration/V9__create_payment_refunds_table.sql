-- Migration V9: Create Payment Refunds Table
-- Created: 2025-10-14
-- Production-ready table for payment refunds management
-- Modified: 2025-10-14 19:45 UTC | Production-safe migration with proper constraints

-- Create payment_refunds table with proper foreign key reference
CREATE TABLE IF NOT EXISTS payment_refunds (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    reason VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'IN_ANALYSIS', 'APPROVED', 'REJECTED', 'PROCESSED')),
    notes TEXT,
    processed_at TIMESTAMP,
    processed_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint (added after table creation for safety)
    CONSTRAINT fk_refund_payment_id FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_refund_status ON payment_refunds(status);
CREATE INDEX idx_refund_payment_id ON payment_refunds(payment_id);
CREATE INDEX idx_refund_created_at ON payment_refunds(created_at);

-- Comentários nas colunas
COMMENT ON TABLE payment_refunds IS 'Tabela para gerenciar estornos de pagamentos';
COMMENT ON COLUMN payment_refunds.payment_id IS 'ID do pagamento original';
COMMENT ON COLUMN payment_refunds.amount IS 'Valor do estorno';
COMMENT ON COLUMN payment_refunds.reason IS 'Motivo do estorno';
COMMENT ON COLUMN payment_refunds.status IS 'Status do estorno (PENDING, IN_ANALYSIS, APPROVED, REJECTED, PROCESSED)';
COMMENT ON COLUMN payment_refunds.notes IS 'Observações adicionais';
COMMENT ON COLUMN payment_refunds.processed_at IS 'Data/hora do processamento';
COMMENT ON COLUMN payment_refunds.processed_by IS 'Usuário que processou o estorno';
