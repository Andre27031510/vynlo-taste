-- Migration para tabela de estornos de pagamento
-- Criada em: 2025-10-14
-- Modified: 2025-10-14 19:15 UTC | Real refunds table for production system

CREATE TABLE payment_refunds (
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
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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
