const { executeQuery } = require('../config/database');
require('dotenv').config();

const seedData = {
  // Produtos de exemplo
  products: [
    {
      name: 'X-Burger Clássico',
      description: 'Hambúrguer com queijo, alface, tomate e molho especial',
      price: 18.90,
      cost_price: 12.50,
      category: 'Hambúrgueres',
      stock_quantity: 50,
      min_stock: 10
    },
    {
      name: 'X-Burger Duplo',
      description: 'Dois hambúrgueres com queijo, alface, tomate e molho especial',
      price: 24.90,
      cost_price: 16.80,
      category: 'Hambúrgueres',
      stock_quantity: 30,
      min_stock: 8
    },
    {
      name: 'Batata Frita Grande',
      description: 'Porção generosa de batatas fritas crocantes',
      price: 12.90,
      cost_price: 6.50,
      category: 'Acompanhamentos',
      stock_quantity: 100,
      min_stock: 20
    },
    {
      name: 'Refrigerante Coca-Cola 350ml',
      description: 'Refrigerante Coca-Cola em lata 350ml',
      price: 6.90,
      cost_price: 3.20,
      category: 'Bebidas',
      stock_quantity: 200,
      min_stock: 40
    },
    {
      name: 'Milk Shake Chocolate',
      description: 'Milk shake cremoso de chocolate com chantilly',
      price: 15.90,
      cost_price: 8.50,
      category: 'Sobremesas',
      stock_quantity: 25,
      min_stock: 5
    }
  ],

  // Motoboys de exemplo
  drivers: [
    {
      name: 'João Silva',
      phone: '(11) 99999-1111',
      cpf: '123.456.789-01',
      cnh: '12345678901',
      vehicle_plate: 'ABC-1234',
      vehicle_model: 'Honda CG 160',
      vehicle_color: 'Vermelho'
    },
    {
      name: 'Pedro Santos',
      phone: '(11) 99999-2222',
      cpf: '234.567.890-12',
      cnh: '23456789012',
      vehicle_plate: 'DEF-5678',
      vehicle_model: 'Yamaha YBR 125',
      vehicle_color: 'Azul'
    },
    {
      name: 'Carlos Oliveira',
      phone: '(11) 99999-3333',
      cpf: '345.678.901-23',
      cnh: '34567890123',
      vehicle_plate: 'GHI-9012',
      vehicle_model: 'Honda Biz 125',
      vehicle_color: 'Preto'
    }
  ]
};

async function insertSeedData() {
  try {
    console.log('🌱 Iniciando inserção de dados de teste...');
    
    // Inserir produtos
    console.log('📦 Inserindo produtos...');
    for (const product of seedData.products) {
      await executeQuery(
        `INSERT INTO products (name, description, price, cost_price, category, stock_quantity, min_stock)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (name) DO NOTHING`,
        [product.name, product.description, product.price, product.cost_price, product.category, product.stock_quantity, product.min_stock]
      );
    }
    console.log('✅ Produtos inseridos com sucesso!');
    
    // Inserir motoboys
    console.log('🛵 Inserindo motoboys...');
    for (const driver of seedData.drivers) {
      // Gerar código único para cada motoboy
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      await executeQuery(
        `INSERT INTO drivers (code, name, phone, cpf, cnh, vehicle_plate, vehicle_model, vehicle_color)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (cpf) DO NOTHING`,
        [code, driver.name, driver.phone, driver.cpf, driver.cnh, driver.vehicle_plate, driver.vehicle_model, driver.vehicle_color]
      );
    }
    console.log('✅ Motoboys inseridos com sucesso!');
    
    // Inserir configurações adicionais
    console.log('⚙️ Inserindo configurações adicionais...');
    const additionalSettings = [
      ['company_name', 'Vynlo Taste', 'Nome da empresa'],
      ['company_phone', '(11) 3333-4444', 'Telefone da empresa'],
      ['company_address', 'Rua das Flores, 123 - Centro', 'Endereço da empresa'],
      ['delivery_time_estimate', '45', 'Tempo estimado de entrega em minutos'],
      ['min_order_for_free_delivery', '50.00', 'Valor mínimo para entrega grátis'],
      ['payment_methods', 'dinheiro,pix,cartao', 'Métodos de pagamento aceitos'],
      ['business_hours', '10:00-22:00', 'Horário de funcionamento'],
      ['support_whatsapp', '1199999-0000', 'WhatsApp de suporte']
    ];
    
    for (const [key, value, description] of additionalSettings) {
      await executeQuery(
        'INSERT INTO system_settings (key, value, description) VALUES ($1, $2, $3) ON CONFLICT (key) DO NOTHING',
        [key, value, description]
      );
    }
    console.log('✅ Configurações adicionais inseridas!');
    
    console.log('🎉 Dados de teste inseridos com sucesso!');
    console.log('\n📋 Resumo dos dados inseridos:');
    console.log(`   - ${seedData.products.length} produtos`);
    console.log(`   - ${seedData.drivers.length} motoboys`);
    console.log(`   - ${additionalSettings.length} configurações adicionais`);
    
    // Mostrar códigos dos motoboys para teste
    console.log('\n🔑 Códigos dos motoboys para teste:');
    const driversResult = await executeQuery('SELECT code, name FROM drivers ORDER BY name');
    driversResult.rows.forEach(driver => {
      console.log(`   - ${driver.name}: ${driver.code}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao inserir dados de teste:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  insertSeedData();
}

module.exports = { insertSeedData };
