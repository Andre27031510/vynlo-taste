-- =============================================================================
-- SCRIPT DE INICIALIZAÇÃO DO BANCO DE DADOS - VYNLOTASTE
-- Sistema de Delivery Empresarial com PostgreSQL
-- =============================================================================

-- Criar banco de dados se não existir
SELECT 'CREATE DATABASE vynlo_taste'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'vynlo_taste')\gexec

-- Conectar ao banco de dados
\c vynlo_taste;

-- =============================================================================
-- EXTENSÕES NECESSÁRIAS
-- =============================================================================

-- Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extensão para busca de texto
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Extensão para operações JSON
CREATE EXTENSION IF NOT EXISTS "jsonb_ops";

-- =============================================================================
-- SCHEMAS
-- =============================================================================

-- Schema para auditoria
CREATE SCHEMA IF NOT EXISTS audit;

-- Schema para relatórios
CREATE SCHEMA IF NOT EXISTS reports;

-- Schema para cache
CREATE SCHEMA IF NOT EXISTS cache;

-- =============================================================================
-- FUNÇÕES DE AUDITORIA
-- =============================================================================

-- Função para registrar mudanças nas tabelas
CREATE OR REPLACE FUNCTION audit.audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSON;
    new_data JSON;
    audit_row audit.audit_log;
BEGIN
    -- Obter dados antigos
    IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        old_data = row_to_json(OLD);
    END IF;
    
    -- Obter dados novos
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        new_data = row_to_json(NEW);
    END IF;
    
    -- Criar registro de auditoria
    INSERT INTO audit.audit_log (
        table_name,
        operation,
        old_data,
        new_data,
        user_id,
        timestamp,
        ip_address,
        user_agent
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        old_data,
        new_data,
        COALESCE(current_setting('app.current_user_id', true)::BIGINT, 0),
        NOW(),
        COALESCE(current_setting('app.ip_address', true), 'unknown'),
        COALESCE(current_setting('app.user_agent', true), 'unknown')
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TABELAS PRINCIPAIS
-- =============================================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED')),
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'MANAGER', 'CASHIER', 'USER')),
    last_login TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP,
    password_changed_at TIMESTAMP DEFAULT NOW(),
    must_change_password BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}',
    notes TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    deleted_by BIGINT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- Tabela de restaurantes
CREATE TABLE IF NOT EXISTS restaurants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cnpj VARCHAR(18) UNIQUE,
    phone VARCHAR(20),
    email VARCHAR(255),
    address JSONB,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED')),
    type VARCHAR(50) DEFAULT 'RESTAURANT' CHECK (type IN ('RESTAURANT', 'CAFE', 'BAKERY', 'FOOD_TRUCK', 'GHOST_KITCHEN')),
    category VARCHAR(50) DEFAULT 'GENERAL',
    delivery_enabled BOOLEAN DEFAULT TRUE,
    delivery_radius DECIMAL(10,2) DEFAULT 5.0,
    delivery_fee DECIMAL(10,2) DEFAULT 0.0,
    free_delivery_threshold DECIMAL(10,2) DEFAULT 0.0,
    opening_time TIME DEFAULT '08:00:00',
    closing_time TIME DEFAULT '22:00:00',
    rating DECIMAL(3,2) DEFAULT 0.0,
    commission_rate DECIMAL(5,2) DEFAULT 0.0,
    tax_rate DECIMAL(5,2) DEFAULT 0.0,
    currency VARCHAR(3) DEFAULT 'BRL',
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    language VARCHAR(10) DEFAULT 'pt-BR',
    settings JSONB DEFAULT '{}',
    features JSONB DEFAULT '[]',
    notes TEXT,
    owner_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    deleted_by BIGINT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- Tabela de contas financeiras
CREATE TABLE IF NOT EXISTS financial_accounts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    account_code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('BANK', 'CREDIT_CARD', 'CASH', 'DIGITAL_WALLET', 'INVESTMENT')),
    category VARCHAR(50) DEFAULT 'GENERAL',
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED')),
    initial_balance DECIMAL(15,2) DEFAULT 0.0,
    current_balance DECIMAL(15,2) DEFAULT 0.0,
    credit_limit DECIMAL(15,2) DEFAULT 0.0,
    bank_details JSONB,
    pix_details JSONB,
    card_details JSONB,
    due_date INTEGER DEFAULT 10,
    closing_date INTEGER DEFAULT 25,
    payment_methods JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    notes TEXT,
    restaurant_id BIGINT REFERENCES restaurants(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    deleted_by BIGINT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- Tabela de transações financeiras
CREATE TABLE IF NOT EXISTS financial_transactions (
    id BIGSERIAL PRIMARY KEY,
    description VARCHAR(500) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE', 'TRANSFER', 'ADJUSTMENT')),
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'FAILED', 'REFUNDED')),
    transaction_date DATE NOT NULL,
    due_date DATE,
    payment_date DATE,
    reference_number VARCHAR(100),
    payment_method VARCHAR(50),
    recurring_info JSONB,
    attachments JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    account_id BIGINT REFERENCES financial_accounts(id),
    restaurant_id BIGINT REFERENCES restaurants(id),
    order_id BIGINT,
    customer_id BIGINT REFERENCES users(id),
    supplier_id BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    deleted_by BIGINT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED')),
    type VARCHAR(20) DEFAULT 'DINE_IN' CHECK (type IN ('DINE_IN', 'TAKEOUT', 'DELIVERY', 'CATERING')),
    total_amount DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.0,
    delivery_fee DECIMAL(10,2) DEFAULT 0.0,
    discount_amount DECIMAL(10,2) DEFAULT 0.0,
    notes TEXT,
    customer_id BIGINT REFERENCES users(id),
    restaurant_id BIGINT REFERENCES restaurants(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    deleted_by BIGINT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- Tabela de menus
CREATE TABLE IF NOT EXISTS menus (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'DRAFT')),
    is_default BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    restaurant_id BIGINT REFERENCES restaurants(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    deleted_by BIGINT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cnpj VARCHAR(18),
    phone VARCHAR(20),
    email VARCHAR(255),
    address JSONB,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED')),
    payment_terms VARCHAR(100),
    credit_limit DECIMAL(15,2) DEFAULT 0.0,
    notes TEXT,
    restaurant_id BIGINT REFERENCES restaurants(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    deleted_by BIGINT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- Tabela de sessões de usuário
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGSERIAL PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    login_at TIMESTAMP DEFAULT NOW(),
    last_activity_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    logout_reason VARCHAR(100),
    logout_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de permissões de usuário
CREATE TABLE IF NOT EXISTS user_permissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    granted BOOLEAN DEFAULT TRUE,
    conditions JSONB,
    expires_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id)
);

-- Tabela de horários de funcionamento
CREATE TABLE IF NOT EXISTS restaurant_schedules (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT REFERENCES restaurants(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    break_start_time TIME,
    break_end_time TIME,
    special_hours JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    deleted_by BIGINT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- Tabela de extratos financeiros
CREATE TABLE IF NOT EXISTS financial_statements (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    opening_balance DECIMAL(15,2) NOT NULL,
    closing_balance DECIMAL(15,2) NOT NULL,
    total_income DECIMAL(15,2) DEFAULT 0.0,
    total_expenses DECIMAL(15,2) DEFAULT 0.0,
    net_income DECIMAL(15,2) DEFAULT 0.0,
    transaction_count INTEGER DEFAULT 0,
    statement_data JSONB,
    generated_at TIMESTAMP DEFAULT NOW(),
    generated_by BIGINT REFERENCES users(id),
    notes TEXT,
    account_id BIGINT REFERENCES financial_accounts(id),
    restaurant_id BIGINT REFERENCES restaurants(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de divisão de transações
CREATE TABLE IF NOT EXISTS transaction_splits (
    id BIGSERIAL PRIMARY KEY,
    transaction_id BIGINT REFERENCES financial_transactions(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    notes TEXT,
    percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id)
);

-- =============================================================================
-- TABELAS DE AUDITORIA
-- =============================================================================

-- Tabela de log de auditoria
CREATE TABLE IF NOT EXISTS audit.audit_log (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    user_id BIGINT REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- =============================================================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================================================

-- Índices para usuários
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Índices para restaurantes
CREATE INDEX IF NOT EXISTS idx_restaurants_cnpj ON restaurants(cnpj);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);
CREATE INDEX IF NOT EXISTS idx_restaurants_type ON restaurants(type);
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_created_at ON restaurants(created_at);

-- Índices para contas financeiras
CREATE INDEX IF NOT EXISTS idx_financial_accounts_code ON financial_accounts(account_code);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_type ON financial_accounts(type);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_status ON financial_accounts(status);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_restaurant_id ON financial_accounts(restaurant_id);

-- Índices para transações financeiras
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_category ON financial_transactions(category);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_status ON financial_transactions(status);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_account_id ON financial_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_restaurant_id ON financial_transactions(restaurant_id);

-- Índices para pedidos
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Índices para sessões de usuário
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);

-- Índices para permissões de usuário
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_resource ON user_permissions(resource);
CREATE INDEX IF NOT EXISTS idx_user_permissions_action ON user_permissions(action);

-- Índices para horários de funcionamento
CREATE INDEX IF NOT EXISTS idx_restaurant_schedules_restaurant_id ON restaurant_schedules(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_schedules_day ON restaurant_schedules(day_of_week);

-- Índices para extratos financeiros
CREATE INDEX IF NOT EXISTS idx_financial_statements_type ON financial_statements(type);
CREATE INDEX IF NOT EXISTS idx_financial_statements_period ON financial_statements(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_financial_statements_account_id ON financial_statements(account_id);

-- Índices para divisão de transações
CREATE INDEX IF NOT EXISTS idx_transaction_splits_transaction_id ON transaction_splits(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_splits_category ON transaction_splits(category);

-- Índices para auditoria
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_operation ON audit.audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit.audit_log(timestamp);

-- =============================================================================
-- TRIGGERS DE AUDITORIA
-- =============================================================================

-- Trigger para auditoria de usuários
CREATE TRIGGER users_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit.audit_trigger_function();

-- Trigger para auditoria de restaurantes
CREATE TRIGGER restaurants_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION audit.audit_trigger_function();

-- Trigger para auditoria de contas financeiras
CREATE TRIGGER financial_accounts_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON financial_accounts
    FOR EACH ROW EXECUTE FUNCTION audit.audit_trigger_function();

-- Trigger para auditoria de transações financeiras
CREATE TRIGGER financial_transactions_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON financial_transactions
    FOR EACH ROW EXECUTE FUNCTION audit.audit_trigger_function();

-- Trigger para auditoria de pedidos
CREATE TRIGGER orders_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit.audit_trigger_function();

-- =============================================================================
-- CONSTRAINTS ADICIONAIS
-- =============================================================================

-- Constraint para garantir que apenas um menu padrão por restaurante
ALTER TABLE menus ADD CONSTRAINT unique_default_menu_per_restaurant 
    UNIQUE (restaurant_id, is_default) 
    WHERE is_default = TRUE;

-- Constraint para garantir que horários não se sobreponham
ALTER TABLE restaurant_schedules ADD CONSTRAINT check_time_consistency 
    CHECK (opening_time < closing_time);

-- Constraint para garantir que break time está dentro do horário de funcionamento
ALTER TABLE restaurant_schedules ADD CONSTRAINT check_break_time_consistency 
    CHECK (
        (break_start_time IS NULL AND break_end_time IS NULL) OR
        (break_start_time IS NOT NULL AND break_end_time IS NOT NULL AND 
         break_start_time < break_end_time AND
         break_start_time >= opening_time AND break_end_time <= closing_time)
    );

-- =============================================================================
-- FUNÇÕES ÚTEIS
-- =============================================================================

-- Função para calcular saldo atual de uma conta
CREATE OR REPLACE FUNCTION calculate_account_balance(account_id BIGINT)
RETURNS DECIMAL AS $$
DECLARE
    total_income DECIMAL(15,2) := 0;
    total_expenses DECIMAL(15,2) := 0;
    initial_balance DECIMAL(15,2) := 0;
BEGIN
    -- Obter saldo inicial
    SELECT initial_balance INTO initial_balance 
    FROM financial_accounts 
    WHERE id = account_id;
    
    -- Calcular total de receitas
    SELECT COALESCE(SUM(amount), 0) INTO total_income
    FROM financial_transactions 
    WHERE account_id = account_id 
    AND type = 'INCOME' 
    AND status = 'COMPLETED';
    
    -- Calcular total de despesas
    SELECT COALESCE(SUM(amount), 0) INTO total_expenses
    FROM financial_transactions 
    WHERE account_id = account_id 
    AND type = 'EXPENSE' 
    AND status = 'COMPLETED';
    
    RETURN initial_balance + total_income - total_expenses;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se restaurante está aberto
CREATE OR REPLACE FUNCTION is_restaurant_open(restaurant_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    current_day INTEGER;
    current_time TIME;
    is_open BOOLEAN := FALSE;
BEGIN
    current_day := EXTRACT(DOW FROM NOW());
    current_time := NOW()::TIME;
    
    SELECT rs.is_open INTO is_open
    FROM restaurant_schedules rs
    WHERE rs.restaurant_id = is_restaurant_open.restaurant_id
    AND rs.day_of_week = current_day
    AND rs.opening_time <= current_time
    AND rs.closing_time >= current_time;
    
    RETURN COALESCE(is_open, FALSE);
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- VIEWS ÚTEIS
-- =============================================================================

-- View para resumo financeiro por restaurante
CREATE OR REPLACE VIEW financial_summary AS
SELECT 
    r.id as restaurant_id,
    r.name as restaurant_name,
    COUNT(DISTINCT fa.id) as total_accounts,
    COUNT(DISTINCT ft.id) as total_transactions,
    COALESCE(SUM(CASE WHEN ft.type = 'INCOME' THEN ft.amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN ft.type = 'EXPENSE' THEN ft.amount ELSE 0 END), 0) as total_expenses,
    COALESCE(SUM(CASE WHEN ft.type = 'INCOME' THEN ft.amount ELSE 0 END), 0) - 
    COALESCE(SUM(CASE WHEN ft.type = 'EXPENSE' THEN ft.amount ELSE 0 END), 0) as net_income
FROM restaurants r
LEFT JOIN financial_accounts fa ON r.id = fa.restaurant_id
LEFT JOIN financial_transactions ft ON fa.id = ft.account_id
WHERE r.status = 'ACTIVE'
GROUP BY r.id, r.name;

-- View para transações recentes
CREATE OR REPLACE VIEW recent_transactions AS
SELECT 
    ft.id,
    ft.description,
    ft.amount,
    ft.type,
    ft.category,
    ft.status,
    ft.transaction_date,
    fa.name as account_name,
    r.name as restaurant_name,
    u.first_name || ' ' || u.last_name as created_by_name
FROM financial_transactions ft
JOIN financial_accounts fa ON ft.account_id = fa.id
JOIN restaurants r ON ft.restaurant_id = r.id
JOIN users u ON ft.created_by = u.id
WHERE ft.deleted_at IS NULL
ORDER BY ft.transaction_date DESC, ft.created_at DESC;

-- =============================================================================
-- MENSAGEM DE CONCLUSÃO
-- =============================================================================

SELECT 'Banco de dados Vynlo Taste inicializado com sucesso!' as status;

