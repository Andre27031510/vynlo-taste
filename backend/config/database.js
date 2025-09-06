const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo limite para conexões ociosas
  connectionTimeoutMillis: 2000, // Tempo limite para estabelecer conexão
  maxUses: 7500, // Número máximo de vezes que uma conexão pode ser reutilizada
});

// Eventos do pool
pool.on('connect', (client) => {
  console.log('🔌 Nova conexão PostgreSQL estabelecida');
});

pool.on('error', (err, client) => {
  console.error('❌ Erro inesperado no cliente PostgreSQL:', err);
});

pool.on('remove', (client) => {
  console.log('🔌 Cliente PostgreSQL removido do pool');
});

// Função para executar queries com retry automático
const executeQuery = async (query, params = [], retries = 3) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(query, params);
        return result;
      } finally {
        client.release();
      }
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Tentativa ${i + 1} falhou:`, error.message);
      
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

// Função para executar transações
const executeTransaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  executeQuery,
  executeTransaction
};
