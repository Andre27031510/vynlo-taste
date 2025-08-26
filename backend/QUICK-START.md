# 🚀 **Início Rápido - Vynlo Taste Backend**

## ⚡ **Execução em 3 Passos**

### **1. Pré-requisitos**
- ✅ **Java 17+** instalado
- ✅ **Maven 3.8+** instalado  
- ✅ **PostgreSQL** rodando na porta 5432

### **2. Configurar Banco**
```sql
CREATE DATABASE vynlo_taste;
CREATE USER vynlo_user WITH PASSWORD 'vynlo_pass';
GRANT ALL PRIVILEGES ON DATABASE vynlo_taste TO vynlo_user;
```

### **3. Executar Projeto**

#### **Windows:**
```bash
# Duplo clique no arquivo
start-dev.bat

# Ou via linha de comando
start-dev.bat
```

#### **Linux/Mac:**
```bash
# Executar script
./start-dev.sh

# Ou via Maven diretamente
mvn spring-boot:run -Dspring.profiles.active=dev
```

## 🌐 **Endpoints Disponíveis**

Após inicialização, acesse:

- **📚 API Docs**: http://localhost:8080/api/swagger-ui.html
- **📊 Health Check**: http://localhost:8080/api/actuator/health
- **📈 Metrics**: http://localhost:8080/api/actuator/metrics
- **🔧 Environment**: http://localhost:8080/api/actuator/env

## 🗄️ **Configurações do Banco**

### **PostgreSQL:**
- **Host**: localhost
- **Porta**: 5432
- **Database**: vynlo_taste
- **Usuário**: postgres
- **Senha**: postgres

### **Redis (Opcional):**
- **Host**: localhost
- **Porta**: 6379

## 🔧 **Perfis Disponíveis**

- **dev** - Desenvolvimento (padrão)
- **test** - Testes
- **prod** - Produção

## 📝 **Logs**

- **Console**: Logs em tempo real
- **Arquivo**: `logs/vynlo-taste-dev.log`
- **Nível**: DEBUG para desenvolvimento

## 🚨 **Troubleshooting**

### **Erro: Java não encontrado**
```bash
# Instalar OpenJDK 17
# Windows: Baixar do site oficial
# Linux: sudo apt install openjdk-17-jdk
# Mac: brew install openjdk@17
```

### **Erro: Maven não encontrado**
```bash
# Instalar Maven
# Windows: Baixar do site oficial
# Linux: sudo apt install maven
# Mac: brew install maven
```

### **Erro: PostgreSQL não conecta**
```bash
# Verificar se está rodando
# Windows: services.msc -> PostgreSQL
# Linux: sudo systemctl status postgresql
# Mac: brew services list | grep postgresql
```

### **Erro: Porta 8080 em uso**
```bash
# Alterar porta no application-dev.yml
server:
  port: 8081  # ou outra porta livre
```

## 🎯 **Próximos Passos**

1. ✅ **Backend rodando** - Sistema base funcionando
2. 🔄 **Implementar entidades** - Usuários, produtos, pedidos
3. 🔐 **Implementar segurança** - JWT, OAuth2, Firebase
4. 📱 **Implementar APIs** - Controllers e serviços
5. 🧪 **Implementar testes** - Unit e integração
6. 🚀 **Deploy** - Docker e produção

---

## 💡 **Dicas de Desenvolvimento**

- **Hot Reload**: Alterações automáticas durante desenvolvimento
- **Debug**: Logs SQL habilitados em desenvolvimento
- **Swagger**: Documentação automática da API
- **Actuator**: Monitoramento e métricas em tempo real

**🚀 Sistema de Delivery Empresarial de Ponta com Java Spring Boot!** 🚀
