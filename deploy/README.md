# 🚀 **FASE 7 - DEPLOY E IMPLANTAÇÃO EM PRODUÇÃO**
## **Sistema Vynlo Taste - Guia Completo de Deploy**

---

## 📋 **ESTRUTURA DE DEPLOY**

```
deploy/
├── aws/
│   └── infrastructure.yml          # CloudFormation - Infraestrutura
├── scripts/
│   ├── deploy-prod.sh              # Script de deploy automatizado
│   ├── health-check.sh             # Verificação de saúde
│   └── rollback.sh                 # Script de rollback
├── monitoring/
│   ├── cloudwatch-dashboard.json   # Dashboard de monitoramento
│   └── alerts.yml                  # Alertas CloudWatch
├── security/
│   └── security-config.yml         # Configurações de segurança
└── README.md                       # Este arquivo
```

---

## 🛠️ **PRÉ-REQUISITOS**

### **1. Ferramentas Necessárias**
```bash
# AWS CLI
aws --version

# Node.js e npm
node --version
npm --version

# Java e Maven
java -version
mvn -version

# Git
git --version
```

### **2. Configuração AWS**
```bash
# Configurar credenciais
aws configure

# Verificar acesso
aws sts get-caller-identity
```

### **3. Permissões IAM Necessárias**
- CloudFormation: Criar/atualizar stacks
- EC2: Gerenciar instâncias, VPC, Security Groups
- RDS: Criar/gerenciar bancos PostgreSQL
- ElastiCache: Criar clusters Redis
- S3: Criar/gerenciar buckets
- CloudFront: Criar distribuições
- Elastic Beanstalk: Deploy de aplicações
- IAM: Criar roles e policies

---

## 🚀 **DEPLOY EM PRODUÇÃO**

### **1. Deploy Completo (Primeira Vez)**
```bash
# Tornar script executável
chmod +x deploy/scripts/deploy-prod.sh

# Executar deploy
./deploy/scripts/deploy-prod.sh
```

### **2. Deploy Apenas da Aplicação**
```bash
# Backend
cd backend
mvn clean package
eb deploy

# Frontend
cd frontend
npm run build
aws s3 sync out/ s3://vynlo-taste-frontend-prod-ACCOUNT-ID --delete
```

### **3. Deploy com Blue-Green**
```bash
# Criar novo ambiente
eb create vynlo-taste-prod-v2

# Testar novo ambiente
./deploy/scripts/health-check.sh

# Trocar URLs (swap)
eb swap vynlo-taste-prod vynlo-taste-prod-v2
```

---

## 🔒 **CONFIGURAÇÃO DE SEGURANÇA**

### **1. Deploy das Configurações de Segurança**
```bash
aws cloudformation deploy \
    --template-file deploy/security/security-config.yml \
    --stack-name vynlo-taste-security-prod \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides Environment=prod DomainName=vynlotaste.com
```

### **2. Configurar SSL/TLS**
```bash
# Verificar certificado
aws acm list-certificates --region us-east-1

# Associar ao Load Balancer
aws elbv2 modify-listener \
    --listener-arn LISTENER_ARN \
    --certificates CertificateArn=CERTIFICATE_ARN
```

### **3. Configurar WAF**
```bash
# Associar WAF ao Load Balancer
aws wafv2 associate-web-acl \
    --web-acl-arn WAF_ARN \
    --resource-arn ALB_ARN
```

---

## 📊 **MONITORAMENTO E ALERTAS**

### **1. Deploy do Monitoramento**
```bash
aws cloudformation deploy \
    --template-file deploy/monitoring/alerts.yml \
    --stack-name vynlo-taste-monitoring-prod \
    --parameter-overrides Environment=prod NotificationEmail=admin@vynlotaste.com
```

### **2. Configurar Dashboard**
```bash
aws cloudwatch put-dashboard \
    --dashboard-name vynlo-taste-prod \
    --dashboard-body file://deploy/monitoring/cloudwatch-dashboard.json
```

### **3. Health Check Automatizado**
```bash
# Executar health check
./deploy/scripts/health-check.sh

# Agendar health check (cron)
# */5 * * * * /path/to/health-check.sh >> /var/log/health-check.log 2>&1
```

---

## 🔄 **ROLLBACK E RECUPERAÇÃO**

### **1. Rollback para Versão Anterior**
```bash
# Listar versões disponíveis
aws elasticbeanstalk describe-application-versions \
    --application-name vynlo-taste

# Executar rollback
./deploy/scripts/rollback.sh vynlo-taste-20231219-143000
```

### **2. Rollback do Frontend**
```bash
# Restaurar versão anterior do S3
aws s3 sync s3://vynlo-taste-frontend-backup/ s3://vynlo-taste-frontend-prod/ --delete

# Invalidar CloudFront
aws cloudfront create-invalidation \
    --distribution-id DISTRIBUTION_ID \
    --paths "/*"
```

### **3. Recuperação de Desastre**
```bash
# Restaurar banco de dados
aws rds restore-db-instance-from-db-snapshot \
    --db-instance-identifier vynlo-taste-db-prod-restored \
    --db-snapshot-identifier vynlo-taste-db-prod-snapshot-20231219

# Recriar infraestrutura
aws cloudformation create-stack \
    --stack-name vynlo-taste-prod-recovery \
    --template-body file://deploy/aws/infrastructure.yml
```

---

## 📈 **MÉTRICAS E KPIs**

### **Disponibilidade**
- **Uptime**: > 99.9%
- **MTTR**: < 15 minutos
- **MTBF**: > 720 horas

### **Performance**
- **Response Time**: < 200ms (95%)
- **Throughput**: > 1000 RPS
- **Error Rate**: < 0.1%

### **Segurança**
- **SSL Score**: A+
- **WAF Blocks**: Monitorado
- **Vulnerabilities**: 0 críticas

---

## 🔧 **COMANDOS ÚTEIS**

### **Logs e Debugging**
```bash
# Logs da aplicação
aws logs tail /aws/elasticbeanstalk/vynlo-taste-prod/var/log/eb-engine.log --follow

# Logs do Load Balancer
aws logs tail /aws/applicationelb/vynlo-taste-alb-prod --follow

# Métricas em tempo real
aws cloudwatch get-metric-statistics \
    --namespace AWS/ApplicationELB \
    --metric-name RequestCount \
    --dimensions Name=LoadBalancer,Value=app/vynlo-taste-alb-prod \
    --start-time 2023-12-19T10:00:00Z \
    --end-time 2023-12-19T11:00:00Z \
    --period 300 \
    --statistics Sum
```

### **Manutenção**
```bash
# Atualizar certificado SSL
aws acm request-certificate \
    --domain-name vynlotaste.com \
    --subject-alternative-names www.vynlotaste.com \
    --validation-method DNS

# Backup manual do banco
aws rds create-db-snapshot \
    --db-instance-identifier vynlo-taste-db-prod \
    --db-snapshot-identifier manual-backup-$(date +%Y%m%d-%H%M%S)

# Limpar versões antigas
aws elasticbeanstalk delete-application-version \
    --application-name vynlo-taste \
    --version-label OLD_VERSION \
    --delete-source-bundle
```

---

## 🚨 **TROUBLESHOOTING**

### **Problemas Comuns**

#### **1. Deploy Falha**
```bash
# Verificar logs
eb logs

# Verificar saúde do ambiente
eb health

# Verificar configuração
eb config
```

#### **2. Database Connection Issues**
```bash
# Testar conectividade
telnet DB_ENDPOINT 5432

# Verificar security groups
aws ec2 describe-security-groups --group-ids sg-xxxxx

# Verificar secrets
aws secretsmanager get-secret-value --secret-id vynlo-taste-db-password-prod
```

#### **3. High Response Time**
```bash
# Verificar métricas
aws cloudwatch get-metric-statistics \
    --namespace AWS/ApplicationELB \
    --metric-name TargetResponseTime

# Verificar targets
aws elbv2 describe-target-health --target-group-arn TARGET_GROUP_ARN

# Escalar horizontalmente
eb scale 3
```

---

## 📞 **SUPORTE E CONTATOS**

### **Equipe de DevOps**
- **Email**: devops@vynlotaste.com
- **Slack**: #vynlo-devops
- **On-call**: +55 11 99999-9999

### **Monitoramento**
- **CloudWatch**: [Dashboard](https://console.aws.amazon.com/cloudwatch/)
- **Grafana**: https://grafana.vynlotaste.com
- **PagerDuty**: https://vynlotaste.pagerduty.com

### **Documentação**
- **Wiki**: https://wiki.vynlotaste.com
- **Runbooks**: https://runbooks.vynlotaste.com
- **API Docs**: https://api.vynlotaste.com/docs

---

## ✅ **CHECKLIST DE DEPLOY**

### **Pré-Deploy**
- [ ] Código testado e aprovado
- [ ] Backup do banco de dados
- [ ] Notificação da equipe
- [ ] Janela de manutenção agendada

### **Durante o Deploy**
- [ ] Monitorar métricas
- [ ] Verificar logs
- [ ] Testar funcionalidades críticas
- [ ] Confirmar health checks

### **Pós-Deploy**
- [ ] Verificar todas as funcionalidades
- [ ] Monitorar por 30 minutos
- [ ] Atualizar documentação
- [ ] Notificar conclusão

---

**🎉 SISTEMA VYNLO TASTE - PRONTO PARA PRODUÇÃO!** 🎉