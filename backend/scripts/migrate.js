const { executeQuery } = require('../config/database');
require('dotenv').config();

const migrations = [
  // Tabela de usuários
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de clientes
  `CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    neighborhood VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    coordinates POINT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de motoboys
  `CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    cnh VARCHAR(20),
    vehicle_plate VARCHAR(10),
    vehicle_model VARCHAR(100),
    vehicle_color VARCHAR(50),
    status VARCHAR(50) DEFAULT 'available',
    is_active BOOLEAN DEFAULT true,
    current_location POINT,
    last_location_update TIMESTAMP WITH TIME ZONE,
    rating DECIMAL(3,2) DEFAULT 0,
    total_deliveries INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de produtos
  `CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    category VARCHAR(100),
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de pedidos
  `CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de itens do pedido
  `CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de entregas
  `CREATE TABLE IF NOT EXISTS deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending',
    pickup_address TEXT,
    delivery_address TEXT,
    pickup_coordinates POINT,
    delivery_coordinates POINT,
    estimated_pickup_time TIMESTAMP WITH TIME ZONE,
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    actual_pickup_time TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    customer_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de histórico de status das entregas
  `CREATE TABLE IF NOT EXISTS delivery_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    location POINT,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de pagamentos
  `CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de notificações
  `CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de logs do sistema
  `CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de configurações do sistema
  `CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`
];

// Índices para melhor performance
const indexes = [
  'CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid)',
  'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
  'CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone)',
  'CREATE INDEX IF NOT EXISTS idx_drivers_code ON drivers(code)',
  'CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status)',
  'CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id)',
  'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
  'CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)',
  'CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries(order_id)',
  'CREATE INDEX IF NOT EXISTS idx_deliveries_driver_id ON deliveries(driver_id)',
  'CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status)',
  'CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id)',
  'CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)',
  'CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level)',
  'CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at)'
];

// Função para executar migrações
async function runMigrations() {
  try {
    console.log('🚀 Iniciando migrações do banco de dados...');
    
    // Executar migrações
    for (let i = 0; i < migrations.length; i++) {
      const migration = migrations[i];
      console.log(`📋 Executando migração ${i + 1}/${migrations.length}...`);
      await executeQuery(migration);
    }
    
    console.log('✅ Migrações executadas com sucesso!');
    
    // Executar índices
    console.log('🔍 Criando índices...');
    for (let i = 0; i < indexes.length; i++) {
      const index = indexes[i];
      await executeQuery(index);
    }
    
    console.log('✅ Índices criados com sucesso!');
    
    // Inserir configurações padrão
    console.log('⚙️ Inserindo configurações padrão...');
    const defaultSettings = [
      ['delivery_fee', '5.00', 'Taxa padrão de entrega'],
      ['min_order_amount', '20.00', 'Valor mínimo para pedido'],
      ['max_delivery_distance', '15', 'Distância máxima de entrega em km'],
      ['whatsapp_notifications', 'true', 'Ativar notificações WhatsApp'],
      ['sms_notifications', 'false', 'Ativar notificações SMS'],
      ['email_notifications', 'true', 'Ativar notificações por email']
    ];
    
    for (const [key, value, description] of defaultSettings) {
      await executeQuery(
        'INSERT INTO system_settings (key, value, description) VALUES ($1, $2, $3) ON CONFLICT (key) DO NOTHING',
        [key, value, description]
      );
    }
    
    console.log('✅ Configurações padrão inseridas!');
    console.log('🎉 Migração concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
