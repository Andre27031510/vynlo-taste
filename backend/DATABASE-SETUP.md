# 🚀 Configuração Rápida do Banco de Dados - Vynlo Taste

## ⚡ Início Rápido

### 1. Pré-requisitos
- ✅ Docker Desktop instalado e rodando
- ✅ 4GB RAM disponível
- ✅ 10GB espaço em disco

### 2. Iniciar Banco de Dados

```bash
# Navegar para o diretório backend
cd backend

# Iniciar serviços (Linux/Mac)
./scripts/database-setup.sh start

# Iniciar serviços (Windows PowerShell)
.\scripts\database-setup.ps1 start

# Ou manualmente
docker-compose up -d
```

### 3. Verificar Status

```bash
# Status dos serviços
./scripts/database-setup.sh status

# Logs em tempo real
./scripts/database-setup.sh logs postgres
```

### 4. Acessar Interfaces Web

- **pgAdmin**: http://localhost:5050
  - Email: `admin@vynlotaste.com`
  - Senha: `admin123`

- **Redis Commander**: http://localhost:8081

## 🗄️ Estrutura do Banco

### Tabelas Principais
- `users` - Usuários do sistema
- `restaurants` - Restaurantes cadastrados
- `financial_accounts` - Contas financeiras
- `financial_transactions` - Transações financeiras
- `orders` - Pedidos de clientes
- `menus` - Cardápios
- `suppliers` - Fornecedores

### Schemas
- `public` - Tabelas principais
- `audit` - Logs de auditoria
- `reports` - Relatórios
- `cache` - Cache temporário

## 🔧 Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `start` | Iniciar serviços |
| `stop` | Parar serviços |
| `restart` | Reiniciar serviços |
| `status` | Verificar status |
| `logs` | Ver logs |
| `backup` | Fazer backup |
| `restore` | Restaurar backup |
| `connect` | Conectar ao banco |
| `clean` | Limpar dados |

## 📊 Dados Iniciais

O sistema já vem com dados de exemplo:

### Usuários Padrão
- **Admin**: `admin@vynlotaste.com` / `password`
- **Gerente**: `gerente@vynlotaste.com` / `password`
- **Caixa**: `caixa@vynlotaste.com` / `password`

### Restaurante Padrão
- Nome: "Vynlo Taste Restaurante"
- CNPJ: 12.345.678/0001-90
- Status: Ativo

### Contas Financeiras
- Conta Principal (Banco)
- Caixa (Dinheiro)
- Cartão de Crédito

## 🔄 Migrações Flyway

As migrações são executadas automaticamente na inicialização:

1. **V1** - Schema inicial
2. **V2** - Triggers de auditoria
3. **V3** - Dados iniciais

## 💾 Backup e Restauração

```bash
# Fazer backup
./scripts/database-setup.sh backup

# Restaurar backup
./scripts/database-setup.sh restore ./database/backups/backup.sql
```

## 🚨 Troubleshooting

### Problema: Porta 5432 em uso
```bash
# Verificar processo
netstat -tulpn | grep :5432

# Parar PostgreSQL local
sudo systemctl stop postgresql
```

### Problema: Container não inicia
```bash
# Verificar logs
docker logs vynlotaste-postgres

# Reiniciar serviços
./scripts/database-setup.sh restart
```

### Problema: Erro de permissão
```bash
# Linux/Mac
chmod +x scripts/database-setup.sh

# Windows: Executar PowerShell como Administrador
```

## 📱 Conexão com Aplicação

### Configuração Spring Boot
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/vynlo_taste
    username: postgres
    password: postgres
```

### Testar Conexão
```bash
# Verificar se a aplicação está rodando
curl http://localhost:8080/actuator/health

# Verificar migrações
curl http://localhost:8080/actuator/flyway
```

## 🔒 Segurança

### Usuários e Senhas
- **PostgreSQL**: `postgres` / `postgres`
- **pgAdmin**: `admin@vynlotaste.com` / `admin123`
- **Redis**: Sem senha (apenas localhost)

### Recomendações de Produção
- Alterar senhas padrão
- Configurar firewall
- Usar SSL/TLS
- Implementar backup automático

## 📈 Monitoramento

### Métricas Disponíveis
- Health checks: `/actuator/health`
- Métricas: `/actuator/metrics`
- Prometheus: `/actuator/prometheus`

### Logs Importantes
```bash
# Logs do PostgreSQL
docker logs vynlotaste-postgres

# Logs da aplicação
tail -f logs/vynlotaste-backend.log
```

## 🚀 Próximos Passos

1. ✅ Banco de dados configurado
2. 🔄 Executar migrações
3. 🧪 Testar conexão
4. 📊 Inserir dados de teste
5. 🔗 Conectar frontend
6. 🚀 Deploy em produção

## 📞 Suporte

- 📖 [Documentação Completa](database/README.md)
- 🐛 [Issues do Projeto](https://github.com/vynlotaste/backend/issues)
- 💬 [Canal de Suporte](https://discord.gg/vynlotaste)

---

**🎉 Banco de dados configurado com sucesso!**

Agora você pode:
- Iniciar a aplicação Spring Boot
- Conectar o frontend
- Começar a usar o sistema Vynlo Taste

