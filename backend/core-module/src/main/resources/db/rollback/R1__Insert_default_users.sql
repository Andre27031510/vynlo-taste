-- R1: Dados iniciais - Usuários padrão do sistema
-- Autor: Sistema Vynlo Taste
-- Data: 2024-01-06
-- Tipo: Repeatable Migration (dados iniciais)

-- Inserir usuário administrador padrão (se não existir)
INSERT INTO users (
    email, 
    username, 
    first_name, 
    last_name, 
    role, 
    active, 
    email_verified,
    created_at,
    updated_at
) 
SELECT 
    'admin@vynlotaste.com',
    'admin',
    'Sistema',
    'Administrador',
    'ADMIN',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@vynlotaste.com'
);

-- Inserir usuário gerente padrão (se não existir)
INSERT INTO users (
    email, 
    username, 
    first_name, 
    last_name, 
    role, 
    active, 
    email_verified,
    created_at,
    updated_at
) 
SELECT 
    'gerente@vynlotaste.com',
    'gerente',
    'Gerente',
    'Sistema',
    'MANAGER',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'gerente@vynlotaste.com'
);

-- Inserir funcionário de teste (se não existir)
INSERT INTO users (
    email, 
    username, 
    first_name, 
    last_name, 
    role, 
    active, 
    email_verified,
    created_at,
    updated_at
) 
SELECT 
    'funcionario@vynlotaste.com',
    'funcionario',
    'Funcionário',
    'Teste',
    'EMPLOYEE',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'funcionario@vynlotaste.com'
);

-- Inserir cliente de teste (se não existir)
INSERT INTO users (
    email, 
    username, 
    first_name, 
    last_name, 
    phone,
    address,
    role, 
    active, 
    email_verified,
    created_at,
    updated_at
) 
SELECT 
    'cliente@teste.com',
    'cliente_teste',
    'Cliente',
    'Teste',
    '(11) 99999-9999',
    'Rua Teste, 123 - São Paulo, SP',
    'CUSTOMER',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'cliente@teste.com'
);

-- Log da inserção
DO $$
BEGIN
    RAISE NOTICE 'Usuários padrão inseridos/verificados em: %', CURRENT_TIMESTAMP;
END $$;