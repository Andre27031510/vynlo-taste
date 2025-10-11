-- Migration V8: Create Financial Tables
-- Created for Vynlo Taste financial management system
-- Compatible with PostgreSQL 15+ and 3M+ users

-- 1. Financial Transactions Table
CREATE TABLE financial_transactions (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for financial_transactions
CREATE INDEX idx_financial_date ON financial_transactions(date);
CREATE INDEX idx_financial_status ON financial_transactions(status);
CREATE INDEX idx_financial_user ON financial_transactions(user_id);
CREATE INDEX idx_financial_type ON financial_transactions(type);
CREATE INDEX idx_financial_category ON financial_transactions(category);

-- 2. Payments Table
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    method VARCHAR(50) NOT NULL CHECK (method IN ('CREDIT_CARD', 'DEBIT', 'PIX', 'CASH')),
    provider VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'FAILED', 'REFUNDED')),
    transaction_id VARCHAR(200) UNIQUE,
    metadata TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for payments
CREATE INDEX idx_payment_status ON payments(status);
CREATE INDEX idx_payment_order ON payments(order_id);
CREATE INDEX idx_payment_transaction ON payments(transaction_id);
CREATE INDEX idx_payment_method ON payments(method);
CREATE INDEX idx_payment_provider ON payments(provider);
CREATE INDEX idx_payment_created_at ON payments(created_at);

-- 3. Cash Flow Table
CREATE TABLE cash_flow (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    category VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'PENDING', 'CANCELLED')),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for cash_flow
CREATE INDEX idx_cashflow_date ON cash_flow(date);
CREATE INDEX idx_cashflow_type ON cash_flow(type);
CREATE INDEX idx_cashflow_status ON cash_flow(status);
CREATE INDEX idx_cashflow_user ON cash_flow(user_id);
CREATE INDEX idx_cashflow_category ON cash_flow(category);

-- 4. Fiscal Documents Table
CREATE TABLE fiscal_documents (
    id BIGSERIAL PRIMARY KEY,
    number VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('NFE', 'NFCE', 'CTE')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'AUTHORIZED', 'CANCELLED', 'REJECTED')),
    customer VARCHAR(200) NOT NULL,
    value DECIMAL(10,2) NOT NULL CHECK (value > 0),
    issue_date DATE NOT NULL,
    sefaz_status VARCHAR(100),
    xml_content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for fiscal_documents
CREATE INDEX idx_fiscal_number ON fiscal_documents(number);
CREATE INDEX idx_fiscal_status ON fiscal_documents(status);
CREATE INDEX idx_fiscal_date ON fiscal_documents(issue_date);
CREATE INDEX idx_fiscal_type ON fiscal_documents(type);
CREATE INDEX idx_fiscal_sefaz_status ON fiscal_documents(sefaz_status);
CREATE INDEX idx_fiscal_customer ON fiscal_documents(customer);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_financial_transactions_updated_at 
    BEFORE UPDATE ON financial_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cash_flow_updated_at 
    BEFORE UPDATE ON cash_flow 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fiscal_documents_updated_at 
    BEFORE UPDATE ON fiscal_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE financial_transactions IS 'Financial transactions (income/expense) for accounting';
COMMENT ON TABLE payments IS 'Payment records with external provider integration';
COMMENT ON TABLE cash_flow IS 'Cash flow entries for financial reporting';
COMMENT ON TABLE fiscal_documents IS 'Fiscal documents (NFe, NFCe, CTe) for tax compliance';

COMMENT ON COLUMN financial_transactions.type IS 'Transaction type: INCOME or EXPENSE';
COMMENT ON COLUMN financial_transactions.amount IS 'Transaction amount in BRL';
COMMENT ON COLUMN payments.method IS 'Payment method: CREDIT_CARD, DEBIT, PIX, CASH';
COMMENT ON COLUMN payments.transaction_id IS 'External payment provider transaction ID';
COMMENT ON COLUMN fiscal_documents.sefaz_status IS 'SEFAZ processing status';
COMMENT ON COLUMN fiscal_documents.xml_content IS 'XML content of the fiscal document';