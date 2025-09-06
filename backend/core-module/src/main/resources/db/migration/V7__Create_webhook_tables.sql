-- V7: Criação de tabelas para webhooks e notificações
-- Autor: Sistema Vynlo Taste
-- Data: 2024-01-08

-- Tabela de configurações de webhook
CREATE TABLE webhook_configs (
    id BIGSERIAL PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    secret VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT webhook_configs_url_check CHECK (url ~* '^https?://.*'),
    CONSTRAINT webhook_configs_event_type_check CHECK (event_type IN (
        'order.status.changed', 'user.registered', 'product.updated',
        'payment.completed', 'payment.failed'
    ))
);

-- Tabela de logs de webhook
CREATE TABLE webhook_logs (
    id BIGSERIAL PRIMARY KEY,
    webhook_config_id BIGINT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    attempt_count INTEGER NOT NULL DEFAULT 1,
    success BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_webhook_logs_config FOREIGN KEY (webhook_config_id) 
        REFERENCES webhook_configs(id) ON DELETE CASCADE
);

-- Tabela de templates de notificação
CREATE TABLE notification_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- EMAIL, SMS, PUSH
    subject VARCHAR(255),
    body TEXT NOT NULL,
    variables JSONB, -- Variáveis disponíveis no template
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT notification_templates_type_check CHECK (type IN ('EMAIL', 'SMS', 'PUSH'))
);

-- Tabela de tokens FCM dos usuários
CREATE TABLE user_fcm_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL,
    device_type VARCHAR(50), -- ANDROID, IOS, WEB
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign Keys
    CONSTRAINT fk_user_fcm_tokens_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    
    -- Unique constraint
    UNIQUE(user_id, token)
);

-- Índices para performance
CREATE INDEX idx_webhook_configs_event_type ON webhook_configs(event_type) WHERE active = true;
CREATE INDEX idx_webhook_logs_config_id ON webhook_logs(webhook_config_id);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at);
CREATE INDEX idx_webhook_logs_success ON webhook_logs(success, created_at);

CREATE INDEX idx_notification_templates_type ON notification_templates(type) WHERE active = true;
CREATE INDEX idx_notification_templates_name ON notification_templates(name) WHERE active = true;

CREATE INDEX idx_user_fcm_tokens_user_id ON user_fcm_tokens(user_id) WHERE active = true;
CREATE INDEX idx_user_fcm_tokens_token ON user_fcm_tokens(token) WHERE active = true;

-- Trigger para updated_at
CREATE TRIGGER update_webhook_configs_updated_at 
    BEFORE UPDATE ON webhook_configs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at 
    BEFORE UPDATE ON notification_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_fcm_tokens_updated_at 
    BEFORE UPDATE ON user_fcm_tokens 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir templates padrão
INSERT INTO notification_templates (name, type, subject, body, variables) VALUES
('welcome_email', 'EMAIL', 'Bem-vindo ao Vynlo Taste!', 
 'Olá {{firstName}}! Seja bem-vindo ao Vynlo Taste...', 
 '{"firstName": "Nome do usuário"}'),
 
('order_confirmed_email', 'EMAIL', 'Pedido Confirmado - {{orderNumber}}',
 'Seu pedido {{orderNumber}} foi confirmado...', 
 '{"orderNumber": "Número do pedido", "customerName": "Nome do cliente"}'),
 
('order_status_push', 'PUSH', 'Status do Pedido',
 'Seu pedido {{orderNumber}} está {{status}}', 
 '{"orderNumber": "Número do pedido", "status": "Status atual"}');

-- Comentários
COMMENT ON TABLE webhook_configs IS 'Configurações de webhooks para integrações externas';
COMMENT ON TABLE webhook_logs IS 'Logs de tentativas de envio de webhooks';
COMMENT ON TABLE notification_templates IS 'Templates para notificações (email, SMS, push)';
COMMENT ON TABLE user_fcm_tokens IS 'Tokens FCM dos usuários para push notifications';