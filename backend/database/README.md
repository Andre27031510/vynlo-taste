# Banco de Dados - Vynlo Taste

Este diretório contém toda a configuração e scripts necessários para o banco de dados PostgreSQL do sistema Vynlo Taste.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura do Banco](#estrutura-do-banco)
- [Configuração](#configuração)
- [Migrações](#migrações)
- [Scripts de Gerenciamento](#scripts-de-gerenciamento)
- [Backup e Restauração](#backup-e-restauração)
- [Monitoramento](#monitoramento)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O sistema Vynlo Taste utiliza **PostgreSQL 15** como banco de dados principal e **Redis 7** para cache. A configuração é gerenciada através de **Docker Compose** para facilitar o desenvolvimento e implantação.

### Características Principais

- **PostgreSQL 15**: Banco de dados relacional robusto e escalável
- **Redis 7**: Cache em memória para melhor performance
- **Flyway**: Gerenciamento de migrações de banco de dados
- **Auditoria**: Sistema completo de logs para todas as operações
- **Backup Automático**: Scripts para backup e restauração
- **Docker**: Containerização para facilitar o desenvolvimento

## 🗄️ Estrutura do Banco

### Schemas

- **`public`**: Tabelas principais do sistema
- **`audit`**: Logs de auditoria e histórico de mudanças
- **`reports`**: Relatórios e análises
- **`cache`**: Dados de cache temporários

### Tabelas Principais

| Tabela | Descrição | Registros Estimados |
|--------|-----------|-------------------|
| `users` | Usuários do sistema | 1K - 10K |
| `restaurants` | Restaurantes cadastrados | 100 - 1K |
| `financial_accounts` | Contas financeiras | 500 - 5K |
| `financial_transactions` | Transações financeiras | 10K - 100K |
| `orders` | Pedidos de clientes | 50K - 500K |
| `menus` | Cardápios dos restaurantes | 1K - 10K |
| `suppliers` | Fornecedores | 100 - 1K |

### Relacionamentos

```
users (1) ←→ (N) restaurants
restaurants (1) ←→ (N) financial_accounts
financial_accounts (1) ←→ (N) financial_transactions
restaurants (1) ←→ (N) orders
restaurants (1) ←→ (N) menus
restaurants (1) ←→ (N) suppliers
```

## ⚙️ Configuração

### Pré-requisitos

- Docker Desktop
- Docker Compose
- 4GB RAM disponível
- 10GB espaço em disco

### Variáveis de Ambiente

```bash
# PostgreSQL
POSTGRES_DB=vynlo_taste
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Iniciar Serviços

```bash
# Linux/Mac
./scripts/database-setup.sh start

# Windows (PowerShell)
.\scripts\database-setup.ps1 start

# Ou manualmente com Docker Compose
docker-compose up -d
```

### Verificar Status

```bash
# Status dos serviços
./scripts/database-setup.sh status

# Logs do PostgreSQL
./scripts/database-setup.sh logs postgres

# Logs do Redis
./scripts/database-setup.sh logs redis
```

## 🔄 Migrações

### Estrutura das Migrações

```
src/main/resources/db/migration/
├── V1__Create_Initial_Schema.sql      # Schema inicial
├── V2__Add_Audit_Triggers.sql         # Triggers de auditoria
└── V3__Seed_Initial_Data.sql          # Dados iniciais
```

### Executar Migrações

As migrações são executadas automaticamente quando a aplicação Spring Boot inicia. Para executar manualmente:

```bash
# Verificar status das migrações
curl http://localhost:8080/actuator/flyway

# Executar migrações (se necessário)
./scripts/database-setup.sh migrate
```

### Criar Nova Migração

```sql
-- Nome do arquivo: V4__Descricao_da_migracao.sql
-- Exemplo: V4__Add_New_Table.sql

-- Sua migração aqui
CREATE TABLE nova_tabela (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🛠️ Scripts de Gerenciamento

### Comandos Disponíveis

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `start` | Iniciar serviços | `./scripts/database-setup.sh start` |
| `stop` | Parar serviços | `./scripts/database-setup.sh stop` |
| `restart` | Reiniciar serviços | `./scripts/database-setup.sh restart` |
| `status` | Verificar status | `./scripts/database-setup.sh status` |
| `logs` | Ver logs | `./scripts/database-setup.sh logs postgres` |
| `backup` | Fazer backup | `./scripts/database-setup.sh backup` |
| `restore` | Restaurar backup | `./scripts/database-setup.sh restore backup.sql` |
| `connect` | Conectar ao banco | `./scripts/database-setup.sh connect` |
| `clean` | Limpar dados | `./scripts/database-setup.sh clean` |

### Scripts por Sistema Operacional

- **Linux/Mac**: `database-setup.sh` (Bash)
- **Windows**: `database-setup.ps1` (PowerShell)

## 💾 Backup e Restauração

### Backup Automático

```bash
# Fazer backup
./scripts/database-setup.sh backup

# Backup será salvo em: ./database/backups/
# Nome: vynlo_taste_backup_YYYYMMDD_HHMMSS.sql
```

### Restaurar Backup

```bash
# Restaurar backup específico
./scripts/database-setup.sh restore ./database/backups/backup.sql
```

### Backup Manual com pg_dump

```bash
# Backup completo
docker exec vynlotaste-postgres pg_dump -U postgres -d vynlo_taste > backup.sql

# Backup apenas estrutura
docker exec vynlotaste-postgres pg_dump -U postgres -d vynlo_taste --schema-only > schema.sql

# Backup apenas dados
docker exec vynlotaste-postgres pg_dump -U postgres -d vynlo_taste --data-only > data.sql
```

## 📊 Monitoramento

### Interfaces Web

- **pgAdmin**: http://localhost:5050
  - Email: `admin@vynlotaste.com`
  - Senha: `admin123`

- **Redis Commander**: http://localhost:8081

### Métricas do Banco

```bash
# Conectar ao banco
./scripts/database-setup.sh connect

# Verificar estatísticas
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del 
FROM pg_stat_user_tables;

# Verificar conexões ativas
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

# Verificar tamanho das tabelas
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Logs do Sistema

```bash
# Logs do PostgreSQL
docker logs vynlotaste-postgres

# Logs do Redis
docker logs vynlotaste-redis

# Logs do pgAdmin
docker logs vynlotaste-pgadmin
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Porta 5432 já está em uso

```bash
# Verificar processo usando a porta
netstat -tulpn | grep :5432

# Parar processo PostgreSQL local (se houver)
sudo systemctl stop postgresql
```

#### 2. Erro de conexão com banco

```bash
# Verificar se o container está rodando
docker ps | grep postgres

# Verificar logs do container
docker logs vynlotaste-postgres

# Reiniciar serviços
./scripts/database-setup.sh restart
```

#### 3. Erro de permissão

```bash
# Dar permissão de execução aos scripts
chmod +x scripts/database-setup.sh

# Windows: Executar PowerShell como Administrador
```

#### 4. Problemas de memória

```bash
# Verificar uso de memória
docker stats

# Ajustar limites no docker-compose.yml
services:
  postgres:
    deploy:
      resources:
        limits:
          memory: 2G
```

### Comandos de Diagnóstico

```bash
# Verificar saúde dos containers
docker-compose ps

# Verificar uso de recursos
docker stats

# Verificar logs em tempo real
docker-compose logs -f

# Verificar volumes
docker volume ls

# Verificar redes
docker network ls
```

## 📚 Recursos Adicionais

### Documentação Oficial

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Docker Documentation](https://docs.docker.com/)

### Ferramentas Úteis

- **pgAdmin**: Interface web para PostgreSQL
- **Redis Commander**: Interface web para Redis
- **DBeaver**: Cliente universal de banco de dados
- **TablePlus**: Cliente moderno para múltiplos bancos

### Performance

- **Índices**: Todos os campos de busca possuem índices otimizados
- **Partitioning**: Tabelas grandes podem ser particionadas por data
- **Connection Pooling**: HikariCP configurado para conexões eficientes
- **Query Optimization**: Consultas otimizadas com EXPLAIN ANALYZE

## 🤝 Contribuição

Para contribuir com melhorias no banco de dados:

1. Crie uma nova migração seguindo o padrão de nomenclatura
2. Teste a migração em ambiente de desenvolvimento
3. Documente as mudanças neste README
4. Atualize os scripts de backup se necessário

## 📞 Suporte

Em caso de problemas ou dúvidas:

1. Verifique os logs dos containers
2. Consulte esta documentação
3. Execute os comandos de diagnóstico
4. Abra uma issue no repositório

---

**Desenvolvido com ❤️ pela equipe Vynlo Taste**

