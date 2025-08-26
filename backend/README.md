# 🚀 Vynlo Taste Backend - Sistema Empresarial de Ponta

Backend robusto e escalável para sistema de delivery empresarial desenvolvido com **Java 17 + Spring Boot 3.2**.

## ✨ **Funcionalidades Empresariais**

- 🔐 **Segurança Avançada** - Spring Security 6 + JWT + OAuth2 + Firebase
- 🗄️ **Banco PostgreSQL** - HikariCP + Flyway + Auditoria completa
- 📱 **Integração WhatsApp** - Business API + Automação inteligente
- 🚚 **Gestão de Entregas** - Rastreamento em tempo real + Geofencing
- 👥 **Gestão de Usuários** - RBAC + Auditoria + Compliance
- 📦 **Gestão de Pedidos** - Workflow completo + Validações
- 💰 **Sistema de Pagamentos** - Stripe + PIX + Múltiplas formas
- 📊 **Monitoramento** - Actuator + Prometheus + Grafana
- 🔄 **Performance** - Cache Redis + Async + Reactive
- 📈 **Escalabilidade** - Microserviços + Cloud Native
- 📧 **Notificações** - Email + SMS + Push + WhatsApp
- 📍 **Geolocalização** - Google Maps + Roteamento otimizado
- 📋 **Relatórios** - PDF + Excel + CSV + Dashboards
- 🔍 **Busca Avançada** - Elasticsearch + Filtros complexos
- 📝 **Auditoria** - Log completo + Compliance + GDPR

## 🛠️ **Stack Tecnológica Empresarial**

### **Core Framework**
- **Java 17** - LTS com recursos modernos
- **Spring Boot 3.2** - Framework empresarial líder
- **Spring Security 6** - Segurança de nível enterprise
- **Spring Data JPA** - Persistência robusta
- **Spring WebFlux** - Reatividade e performance

### **Banco de Dados**
- **PostgreSQL 15** - Banco relacional enterprise
- **HikariCP** - Pool de conexões de alta performance
- **Flyway** - Migrações versionadas
- **Redis** - Cache distribuído
- **Elasticsearch** - Busca e análise

### **Segurança**
- **JWT** - Tokens seguros
- **OAuth2** - Autenticação social
- **Firebase Admin** - Autenticação Google
- **BCrypt** - Hash de senhas
- **Rate Limiting** - Proteção contra ataques

### **Integrações**
- **WhatsApp Business API** - Comunicação oficial
- **Stripe** - Gateway de pagamentos
- **Twilio** - SMS e comunicação
- **Google Maps** - Geolocalização
- **Kafka** - Mensageria assíncrona

### **Monitoramento**
- **Spring Actuator** - Métricas e saúde
- **Prometheus** - Coleta de métricas
- **Grafana** - Dashboards visuais
- **Micrometer** - Observabilidade
- **Jaeger** - Distributed tracing

## 📋 **Pré-requisitos**

- **Java 17+** (OpenJDK ou Oracle JDK)
- **Maven 3.8+**
- **PostgreSQL 14+**
- **Redis 6+**
- **Docker** (opcional)
- **Node.js 18+** (para desenvolvimento frontend)

## 🚀 **Instalação e Configuração**

### **1. Clone o Repositório**
```bash
git clone <url-do-repositorio>
cd vynlo-taste/backend
```

### **2. Configure o Banco PostgreSQL**
```sql
CREATE DATABASE vynlo_taste;
CREATE USER vynlo_user WITH PASSWORD 'vynlo_pass';
GRANT ALL PRIVILEGES ON DATABASE vynlo_taste TO vynlo_user;
```

### **3. Configure as Variáveis de Ambiente**
```bash
# Copie o arquivo de exemplo
cp src/main/resources/application-dev.yml.example src/main/resources/application-dev.yml

# Edite com suas configurações
nano src/main/resources/application-dev.yml
```

### **4. Execute as Migrações**
```bash
# Via Maven
mvn flyway:migrate

# Ou via linha de comando
mvn spring-boot:run -Dspring.profiles.active=dev
```

### **5. Inicie a Aplicação**
```bash
# Desenvolvimento
mvn spring-boot:run -Dspring.profiles.active=dev

# Produção
mvn clean package -Pprod
java -jar target/vynlo-taste-backend-1.0.0.jar --spring.profiles.active=prod
```

## 🏗️ **Arquitetura do Sistema**

### **Camadas da Aplicação**
```
┌─────────────────────────────────────┐
│           Controllers               │ ← REST APIs
├─────────────────────────────────────┤
│            Services                 │ ← Lógica de Negócio
├─────────────────────────────────────┤
│          Repositories              │ ← Acesso a Dados
├─────────────────────────────────────┤
│            Entities                 │ ← Modelo de Dados
└─────────────────────────────────────┘
```

### **Módulos Principais**
- **Auth Module** - Autenticação e autorização
- **User Module** - Gestão de usuários
- **Product Module** - Catálogo de produtos
- **Order Module** - Gestão de pedidos
- **Delivery Module** - Rastreamento de entregas
- **Payment Module** - Processamento de pagamentos
- **Notification Module** - Sistema de notificações
- **Report Module** - Geração de relatórios
- **Audit Module** - Auditoria e compliance

## 🔐 **Segurança e Autenticação**

### **Fluxo de Autenticação**
1. **Login** - Credenciais ou OAuth2
2. **Validação** - Firebase + JWT
3. **Autorização** - RBAC + Permissões
4. **Auditoria** - Log de todas as ações

### **Roles e Permissões**
- **ADMIN** - Acesso total ao sistema
- **MANAGER** - Gestão de operações
- **OPERATOR** - Operações diárias
- **DRIVER** - Acesso mobile
- **CUSTOMER** - Cliente final

## 📊 **Monitoramento e Observabilidade**

### **Endpoints de Monitoramento**
- `/actuator/health` - Saúde da aplicação
- `/actuator/metrics` - Métricas detalhadas
- `/actuator/prometheus` - Dados para Prometheus
- `/actuator/env` - Configurações ativas
- `/actuator/beans` - Beans do Spring

### **Métricas Coletadas**
- **Performance** - Tempo de resposta, throughput
- **Recursos** - CPU, memória, conexões DB
- **Negócio** - Pedidos, entregas, receita
- **Segurança** - Tentativas de login, bloqueios

## 🔄 **Performance e Escalabilidade**

### **Otimizações Implementadas**
- **Connection Pooling** - HikariCP otimizado
- **Caching** - Redis + Cache local
- **Async Processing** - @Async + CompletableFuture
- **Batch Operations** - JPA batch processing
- **Query Optimization** - Índices + HQL otimizado

### **Configurações de Performance**
```yaml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 50
          fetch_size: 50
        cache:
          use_second_level_cache: true
          use_query_cache: true
```

## 📱 **Integração WhatsApp**

### **Funcionalidades**
- **Notificações Automáticas** - Status de pedidos
- **Chatbot Inteligente** - Respostas automáticas
- **Webhook Processing** - Processamento em tempo real
- **Template Messages** - Mensagens padronizadas
- **Media Handling** - Imagens e documentos

### **Configuração**
```yaml
integration:
  whatsapp:
    enabled: true
    business-api:
      url: ${WHATSAPP_API_URL}
      token: ${WHATSAPP_TOKEN}
      phone-number-id: ${WHATSAPP_PHONE_NUMBER_ID}
```

## 💰 **Sistema de Pagamentos**

### **Gateways Suportados**
- **Stripe** - Cartões de crédito/débito
- **PIX** - Pagamento instantâneo
- **Dinheiro** - Pagamento na entrega
- **Transferência** - PIX ou TED

### **Fluxo de Pagamento**
1. **Criação** - Pedido com forma de pagamento
2. **Processamento** - Gateway de pagamento
3. **Confirmação** - Webhook de confirmação
4. **Notificação** - Cliente e sistema

## 📈 **Relatórios e Analytics**

### **Tipos de Relatórios**
- **Vendas** - Diário, semanal, mensal
- **Entregas** - Performance, tempo médio
- **Clientes** - Fidelização, segmentação
- **Financeiro** - Receita, custos, lucro
- **Operacional** - Produtividade, eficiência

### **Formatos de Exportação**
- **PDF** - Relatórios formais
- **Excel** - Análise detalhada
- **CSV** - Importação em sistemas
- **JSON** - APIs e integrações

## 🧪 **Testes e Qualidade**

### **Estratégia de Testes**
- **Unit Tests** - JUnit 5 + Mockito
- **Integration Tests** - TestContainers
- **API Tests** - RestAssured
- **Performance Tests** - JMeter
- **Security Tests** - OWASP ZAP

### **Execução de Testes**
```bash
# Todos os testes
mvn test

# Testes de integração
mvn test -Dtest=*IntegrationTest

# Testes com coverage
mvn test jacoco:report

# Testes de performance
mvn test -Dtest=*PerformanceTest
```

## 🚀 **Deploy e Produção**

### **Perfis de Ambiente**
- **dev** - Desenvolvimento local
- **test** - Ambiente de testes
- **staging** - Pré-produção
- **prod** - Produção

### **Docker e Containerização**
```bash
# Build da imagem
docker build -t vynlo-taste-backend .

# Execução
docker run -p 8080:8080 vynlo-taste-backend

# Docker Compose
docker-compose up -d
```

### **Kubernetes**
```bash
# Deploy
kubectl apply -f k8s/

# Verificar status
kubectl get pods -n vynlo-taste

# Logs
kubectl logs -f deployment/vynlo-taste-backend
```

## 📚 **Documentação da API**

### **Swagger/OpenAPI**
- **URL**: `http://localhost:8080/api/swagger-ui.html`
- **Especificação**: `http://localhost:8080/api/v3/api-docs`
- **Postman Collection**: Disponível no projeto

### **Endpoints Principais**
```
POST   /api/v1/auth/login          # Login
POST   /api/v1/auth/register       # Registro
GET    /api/v1/users/profile       # Perfil do usuário
GET    /api/v1/products            # Lista de produtos
POST   /api/v1/orders              # Criar pedido
GET    /api/v1/deliveries          # Lista de entregas
POST   /api/v1/payments            # Processar pagamento
```

## 🔧 **Desenvolvimento**

### **Estrutura do Projeto**
```
src/
├── main/
│   ├── java/
│   │   └── com/vynlotaste/
│   │       ├── config/           # Configurações
│   │       ├── controller/       # Controllers REST
│   │       ├── service/          # Serviços de negócio
│   │       ├── repository/       # Repositórios JPA
│   │       ├── entity/           # Entidades JPA
│   │       ├── dto/              # Data Transfer Objects
│   │       ├── mapper/           # Mappers MapStruct
│   │       ├── security/         # Configurações de segurança
│   │       ├── exception/        # Tratamento de exceções
│   │       ├── util/             # Utilitários
│   │       ├── event/            # Eventos do sistema
│   │       ├── listener/         # Listeners de eventos
│   │       ├── scheduler/        # Agendadores
│   │       └── integration/      # Integrações externas
│   └── resources/
│       ├── application.yml       # Configurações
│       ├── db/migration/         # Migrações Flyway
│       └── templates/            # Templates de email
└── test/                         # Testes
```

### **Comandos Úteis**
```bash
# Compilar
mvn clean compile

# Executar testes
mvn test

# Gerar JAR
mvn clean package

# Executar com profile específico
mvn spring-boot:run -Dspring.profiles.active=prod

# Verificar dependências
mvn dependency:tree

# Limpar cache Maven
mvn dependency:purge-local-repository
```

## 📊 **Métricas e KPIs**

### **Métricas de Negócio**
- **Pedidos por hora/dia**
- **Tempo médio de entrega**
- **Taxa de conversão**
- **Receita por período**
- **Satisfação do cliente**

### **Métricas Técnicas**
- **Tempo de resposta da API**
- **Throughput (req/seg)**
- **Taxa de erro**
- **Uso de recursos**
- **Disponibilidade**

## 🚨 **Troubleshooting**

### **Problemas Comuns**
1. **Erro de conexão PostgreSQL**
   - Verificar se o banco está rodando
   - Confirmar credenciais no application.yml
   - Verificar firewall e portas

2. **Erro de autenticação Firebase**
   - Verificar arquivo de configuração
   - Confirmar permissões da conta de serviço
   - Verificar variáveis de ambiente

3. **Problemas de performance**
   - Verificar configurações do HikariCP
   - Analisar logs do Hibernate
   - Monitorar métricas do Actuator

### **Logs e Debug**
```yaml
logging:
  level:
    com.vynlotaste: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

## 📞 **Suporte e Contato**

### **Canais de Suporte**
- **Issues**: GitHub Issues
- **Documentação**: README + Swagger
- **Logs**: Arquivos de log + Actuator
- **Métricas**: Prometheus + Grafana

### **Equipe de Desenvolvimento**
- **Arquitetura**: Vynlo Taste Team
- **Backend**: Java + Spring Boot
- **Frontend**: React + Next.js
- **DevOps**: Docker + Kubernetes

## 📄 **Licença**

**MIT License** - Veja o arquivo LICENSE para detalhes.

---

## 🎯 **Resumo das Vantagens Empresariais**

✅ **Robustez** - Java + Spring Boot para sistemas críticos  
✅ **Escalabilidade** - Arquitetura preparada para crescimento  
✅ **Segurança** - Múltiplas camadas de proteção  
✅ **Performance** - Otimizações de nível enterprise  
✅ **Monitoramento** - Observabilidade completa  
✅ **Compliance** - Auditoria e rastreabilidade  
✅ **Integração** - APIs e webhooks robustos  
✅ **Documentação** - Swagger + README completo  
✅ **Testes** - Cobertura abrangente  
✅ **Deploy** - Docker + Kubernetes ready  

**🚀 Sistema de Delivery Empresarial de Ponta com Java Spring Boot!** 🚀
