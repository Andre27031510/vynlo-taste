# 🚀 Vynlo Taste - Sistema Empresarial de Delivery

## 📋 Visão Geral

O **Vynlo Taste** é um sistema empresarial completo para gestão de delivery e restaurantes, desenvolvido com tecnologia de ponta e arquitetura robusta para uso em produção.

## 🏗️ Arquitetura do Sistema

### **Frontend (Next.js 15 + React 18)**
- **Framework**: Next.js 15.2.4 com App Router
- **UI**: React 18.3.1 + TypeScript 5.6.3
- **Styling**: Tailwind CSS 3.4.3 + Framer Motion 11
- **Autenticação**: Firebase Auth
- **Estado**: Context API + Hooks personalizados

### **Backend (Spring Boot 3.2 + Java 17)**
- **Framework**: Spring Boot 3.2.0
- **Java**: JDK 17 LTS
- **Banco**: PostgreSQL 15 + Redis 7
- **Segurança**: Spring Security 6 + JWT + Firebase Admin
- **Cache**: Redis + Spring Cache
- **Métricas**: Micrometer + Prometheus
- **Monitoramento**: Spring Actuator

### **Infraestrutura**
- **Containerização**: Docker + Docker Compose
- **Cloud**: AWS (EC2, RDS, ElastiCache, S3)
- **CI/CD**: Pipeline automatizado
- **Monitoramento**: CloudWatch + X-Ray

## 🚀 Início Rápido

### **Pré-requisitos**
- Node.js 18+
- Java 17
- Docker Desktop
- PostgreSQL 15
- Redis 7

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/vynlo-taste.git
cd vynlo-taste
```

### **2. Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### **3. Frontend**
```bash
cd frontend
npm install
npm run dev
```

### **4. Banco de Dados**
```bash
# PostgreSQL
docker run -d --name postgres-vynlo \
  -e POSTGRES_DB=vynlo_taste \
  -e POSTGRES_USER=vynlo_user \
  -e POSTGRES_PASSWORD=vynlo_pass \
  -p 5432:5432 postgres:15

# Redis
docker run -d --name redis-vynlo \
  -p 6379:6379 redis:7-alpine
```

## 📁 Estrutura do Projeto

```
vynlo-taste/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router
│   │   ├── components/     # Componentes React
│   │   ├── contexts/       # Context API
│   │   ├── hooks/          # Hooks personalizados
│   │   └── styles/         # CSS e Tailwind
│   ├── public/             # Assets estáticos
│   └── package.json        # Dependências Node.js
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   ├── main/java/
│   │   │   ├── config/     # Configurações Spring
│   │   │   ├── controller/ # Controllers REST
│   │   │   ├── service/    # Lógica de negócio
│   │   │   ├── entity/     # Entidades JPA
│   │   │   └── dto/        # Data Transfer Objects
│   │   └── resources/      # Configurações
│   ├── pom.xml             # Dependências Maven
│   └── docker-compose.yml  # Docker local
├── deploy/                  # Scripts de Deploy
├── docs/                    # Documentação
└── README.md               # Este arquivo
```

## 🔧 Funcionalidades Principais

### **Gestão de Pedidos**
- Recebimento de pedidos (balcão, delivery, WhatsApp)
- Status em tempo real
- Integração com apps de delivery
- Histórico completo

### **Controle de Estoque**
- Gestão de ingredientes
- Alertas de estoque baixo
- Controle de validade
- Relatórios de consumo

### **Gestão Financeira**
- Fluxo de caixa
- Controle de custos
- Integração com pagamentos
- Relatórios financeiros

### **Gestão de Equipe**
- Controle de acesso
- Escalas de trabalho
- Métricas de produtividade
- Comunicação interna

## 🚀 Deploy em Produção

### **AWS**
```bash
# Deploy completo na AWS
./deploy-aws.bat
```

### **Docker**
```bash
# Deploy com Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoramento

- **Health Checks**: `/actuator/health`
- **Métricas**: `/actuator/metrics`
- **Prometheus**: `/actuator/prometheus`
- **Logs**: Centralizados via CloudWatch

## 🔒 Segurança

- **Autenticação**: Firebase Auth + JWT
- **Autorização**: RBAC (Role-Based Access Control)
- **Criptografia**: SSL/TLS + Criptografia de dados
- **Rate Limiting**: Proteção contra ataques
- **Auditoria**: Logs de todas as operações

## 🧪 Testes

### **Backend**
```bash
cd backend
mvn test                    # Testes unitários
mvn verify                  # Testes de integração
```

### **Frontend**
```bash
cd frontend
npm run lint               # Linting
npm run build              # Build de produção
```

## 📈 Performance

- **Cache**: Redis para sessões e dados
- **Lazy Loading**: Componentes carregados sob demanda
- **PWA**: Progressive Web App
- **SEO**: Otimizado para motores de busca

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: suporte@vynlotaste.com
- **Documentação**: [docs.vynlotaste.com](https://docs.vynlotaste.com)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/vynlo-taste/issues)

## 🎯 Roadmap

- [x] **Fase 1**: Estrutura básica e autenticação
- [x] **Fase 2**: Funcionalidades core do sistema
- [x] **Fase 3**: Integração Firebase e segurança
- [x] **Fase 4**: Configuração e testes de segurança
- [x] **Fase 5**: Testes de integração e performance
- [x] **Fase 6**: Testes de carga e otimização
- [x] **Fase 7**: Deploy e implantação em produção
- [ ] **Fase 8**: Monitoramento avançado e alertas
- [ ] **Fase 9**: Escalabilidade e auto-scaling
- [ ] **Fase 10**: Analytics e business intelligence

---

**Desenvolvido com ❤️ pela equipe Vynlo Taste**

<!-- Build trigger: 2025-01-04 19:53 --># Deploy automático funcionando!
# Test deploy
# Deploy test com IP correto
# Test SSH connection fix
# Deploy trigger
" #   D e p l o y   t r i g g e r "    
 # Trigger workflow
# Force GitHub Actions trigger
# Deploy trigger
# Deploy trigger
# Deploy trigger 10/02/2025 17:32:54

# Fix CORS bean conflict - 2025-01-04
# Fix Spring Boot profile - backend restart issue - 2025-01-04
# Force rebuild with actuator security fix - 2025-01-04