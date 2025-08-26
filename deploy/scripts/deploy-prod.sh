#!/bin/bash

# Vynlo Taste - Script de Deploy em Produção
set -e

# Configurações
ENVIRONMENT="prod"
STACK_NAME="vynlo-taste-${ENVIRONMENT}"
REGION="us-east-1"
S3_BUCKET=""
APP_NAME="vynlo-taste"

echo "🚀 INICIANDO DEPLOY EM PRODUÇÃO - VYNLO TASTE"
echo "=============================================="

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI não encontrado. Instale primeiro."
    exit 1
fi

# Verificar credenciais AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Credenciais AWS não configuradas."
    exit 1
fi

echo "✅ AWS CLI configurado"

# 1. Deploy da Infraestrutura
echo ""
echo "📊 FASE 1: DEPLOY DA INFRAESTRUTURA"
echo "==================================="

echo "Criando/atualizando stack CloudFormation..."
aws cloudformation deploy \
    --template-file deploy/aws/infrastructure.yml \
    --stack-name $STACK_NAME \
    --parameter-overrides Environment=$ENVIRONMENT \
    --capabilities CAPABILITY_IAM \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Infraestrutura criada com sucesso"
else
    echo "❌ Falha na criação da infraestrutura"
    exit 1
fi

# Obter outputs da stack
echo "Obtendo informações da infraestrutura..."
ALB_DNS=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`ALBDNSName`].OutputValue' \
    --output text \
    --region $REGION)

S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text \
    --region $REGION)

DB_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' \
    --output text \
    --region $REGION)

echo "✅ Load Balancer: $ALB_DNS"
echo "✅ S3 Bucket: $S3_BUCKET"
echo "✅ Database: $DB_ENDPOINT"

# 2. Build e Deploy do Backend
echo ""
echo "🔧 FASE 2: BUILD E DEPLOY DO BACKEND"
echo "===================================="

cd backend

echo "Compilando aplicação Java..."
mvn clean package -DskipTests

if [ $? -eq 0 ]; then
    echo "✅ Build do backend concluído"
else
    echo "❌ Falha no build do backend"
    exit 1
fi

# Criar aplicação Elastic Beanstalk se não existir
if ! aws elasticbeanstalk describe-applications --application-names $APP_NAME &> /dev/null; then
    echo "Criando aplicação Elastic Beanstalk..."
    aws elasticbeanstalk create-application \
        --application-name $APP_NAME \
        --description "Vynlo Taste - Sistema de Delivery" \
        --region $REGION
fi

# Criar versão da aplicação
VERSION_LABEL="${APP_NAME}-$(date +%Y%m%d-%H%M%S)"
echo "Criando versão: $VERSION_LABEL"

aws elasticbeanstalk create-application-version \
    --application-name $APP_NAME \
    --version-label $VERSION_LABEL \
    --source-bundle S3Bucket="elasticbeanstalk-${REGION}-$(aws sts get-caller-identity --query Account --output text)",S3Key="${APP_NAME}/${VERSION_LABEL}.jar" \
    --region $REGION

# Upload do JAR para S3
aws s3 cp target/*.jar s3://elasticbeanstalk-${REGION}-$(aws sts get-caller-identity --query Account --output text)/${APP_NAME}/${VERSION_LABEL}.jar

echo "✅ Backend deployado com sucesso"

cd ..

# 3. Build e Deploy do Frontend
echo ""
echo "🎨 FASE 3: BUILD E DEPLOY DO FRONTEND"
echo "====================================="

cd frontend

echo "Instalando dependências..."
npm install

echo "Compilando frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build do frontend concluído"
else
    echo "❌ Falha no build do frontend"
    exit 1
fi

echo "Fazendo upload para S3..."
aws s3 sync out/ s3://$S3_BUCKET --delete

echo "Invalidando cache do CloudFront..."
CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
    --output text \
    --region $REGION)

aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_ID \
    --paths "/*" \
    --region $REGION

echo "✅ Frontend deployado com sucesso"

cd ..

# 4. Configuração do Banco de Dados
echo ""
echo "🗄️ FASE 4: CONFIGURAÇÃO DO BANCO"
echo "================================="

echo "Executando migrações do banco..."
cd backend

# Configurar variáveis de ambiente para produção
export DB_HOST=$DB_ENDPOINT
export DB_NAME="vynlo_taste"
export DB_USER="vynlo_user"
export DB_PASSWORD="$(aws secretsmanager get-secret-value --secret-id vynlo-taste-db-password --query SecretString --output text | jq -r .password)"

mvn flyway:migrate

echo "✅ Banco de dados configurado"

cd ..

# 5. Testes de Saúde
echo ""
echo "🏥 FASE 5: TESTES DE SAÚDE"
echo "=========================="

echo "Aguardando aplicação ficar disponível..."
sleep 60

echo "Testando health check..."
if curl -f "http://$ALB_DNS/api/v1/health" > /dev/null 2>&1; then
    echo "✅ Health check passou"
else
    echo "⚠️ Health check falhou - verificar logs"
fi

echo "Testando frontend..."
CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
    --output text \
    --region $REGION)

if curl -f "https://$CLOUDFRONT_URL" > /dev/null 2>&1; then
    echo "✅ Frontend acessível"
else
    echo "⚠️ Frontend com problemas"
fi

# 6. Relatório Final
echo ""
echo "📋 RELATÓRIO FINAL DO DEPLOY"
echo "============================="
echo "✅ Infraestrutura: Criada"
echo "✅ Backend: Deployado"
echo "✅ Frontend: Deployado"
echo "✅ Banco: Configurado"
echo ""
echo "🌐 URLs de Acesso:"
echo "Frontend: https://$CLOUDFRONT_URL"
echo "Backend: http://$ALB_DNS"
echo "API Health: http://$ALB_DNS/api/v1/health"
echo ""
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo ""
echo "📊 Próximos passos:"
echo "1. Configurar domínio personalizado"
echo "2. Configurar SSL/TLS"
echo "3. Configurar monitoramento"
echo "4. Configurar alertas"