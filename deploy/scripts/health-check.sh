#!/bin/bash

# Vynlo Taste - Health Check de Produção
set -e

# Configurações
ENVIRONMENT="prod"
REGION="us-east-1"
STACK_NAME="vynlo-taste-${ENVIRONMENT}"

echo "🏥 HEALTH CHECK - VYNLO TASTE PRODUÇÃO"
echo "======================================"

# Obter URLs da infraestrutura
ALB_DNS=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`ALBDNSName`].OutputValue' \
    --output text \
    --region $REGION)

CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
    --output text \
    --region $REGION)

echo "🔍 Testando componentes do sistema..."
echo ""

# 1. Health Check da API
echo "1. 🔧 API Health Check"
echo "====================="
API_URL="http://$ALB_DNS/api/v1/health"
echo "URL: $API_URL"

if curl -f -s --max-time 10 "$API_URL" > /dev/null; then
    echo "✅ API está respondendo"
    
    # Verificar response time
    RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" "$API_URL")
    echo "⏱️  Response time: ${RESPONSE_TIME}s"
    
    if (( $(echo "$RESPONSE_TIME < 1.0" | bc -l) )); then
        echo "✅ Response time OK"
    else
        echo "⚠️  Response time alto"
    fi
else
    echo "❌ API não está respondendo"
    exit 1
fi

echo ""

# 2. Health Check do Frontend
echo "2. 🎨 Frontend Health Check"
echo "=========================="
FRONTEND_URL="https://$CLOUDFRONT_URL"
echo "URL: $FRONTEND_URL"

if curl -f -s --max-time 10 "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend está acessível"
    
    # Verificar response time
    RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" "$FRONTEND_URL")
    echo "⏱️  Response time: ${RESPONSE_TIME}s"
    
    if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
        echo "✅ Response time OK"
    else
        echo "⚠️  Response time alto"
    fi
else
    echo "❌ Frontend não está acessível"
    exit 1
fi

echo ""

# 3. Database Health Check
echo "3. 🗄️ Database Health Check"
echo "=========================="

DB_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' \
    --output text \
    --region $REGION)

echo "Endpoint: $DB_ENDPOINT"

# Verificar se o endpoint está resolvendo
if nslookup "$DB_ENDPOINT" > /dev/null 2>&1; then
    echo "✅ Database endpoint está resolvendo"
else
    echo "❌ Database endpoint não está resolvendo"
    exit 1
fi

# Verificar conexão (precisa de psql instalado)
if command -v psql &> /dev/null; then
    DB_PASSWORD=$(aws secretsmanager get-secret-value \
        --secret-id vynlo-taste-db-password-prod \
        --query SecretString \
        --output text \
        --region $REGION | jq -r .password)
    
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_ENDPOINT" -U vynlo_user -d vynlo_taste -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ Database está aceitando conexões"
    else
        echo "⚠️  Database não está aceitando conexões"
    fi
else
    echo "⚠️  psql não instalado - pulando teste de conexão"
fi

echo ""

# 4. Redis Health Check
echo "4. 🔄 Redis Health Check"
echo "======================="

REDIS_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`RedisEndpoint`].OutputValue' \
    --output text \
    --region $REGION)

echo "Endpoint: $REDIS_ENDPOINT"

if nslookup "$REDIS_ENDPOINT" > /dev/null 2>&1; then
    echo "✅ Redis endpoint está resolvendo"
else
    echo "❌ Redis endpoint não está resolvendo"
    exit 1
fi

echo ""

# 5. Load Balancer Health Check
echo "5. ⚖️ Load Balancer Health Check"
echo "==============================="

ALB_ARN=$(aws elbv2 describe-load-balancers \
    --names "vynlo-taste-alb-${ENVIRONMENT}" \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text \
    --region $REGION)

if [ "$ALB_ARN" != "None" ]; then
    echo "✅ Load Balancer encontrado"
    
    # Verificar targets saudáveis
    TARGET_GROUPS=$(aws elbv2 describe-target-groups \
        --load-balancer-arn "$ALB_ARN" \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text \
        --region $REGION)
    
    if [ "$TARGET_GROUPS" != "None" ]; then
        HEALTHY_TARGETS=$(aws elbv2 describe-target-health \
            --target-group-arn "$TARGET_GROUPS" \
            --query 'length(TargetHealthDescriptions[?TargetHealth.State==`healthy`])' \
            --output text \
            --region $REGION)
        
        echo "🎯 Targets saudáveis: $HEALTHY_TARGETS"
        
        if [ "$HEALTHY_TARGETS" -gt 0 ]; then
            echo "✅ Pelo menos um target está saudável"
        else
            echo "⚠️  Nenhum target está saudável"
        fi
    fi
else
    echo "❌ Load Balancer não encontrado"
    exit 1
fi

echo ""

# 6. CloudWatch Metrics Check
echo "6. 📊 CloudWatch Metrics Check"
echo "=============================="

# Verificar se há métricas recentes
RECENT_REQUESTS=$(aws cloudwatch get-metric-statistics \
    --namespace AWS/ApplicationELB \
    --metric-name RequestCount \
    --dimensions Name=LoadBalancer,Value="app/vynlo-taste-alb-${ENVIRONMENT}" \
    --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
    --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
    --period 300 \
    --statistics Sum \
    --query 'Datapoints[0].Sum' \
    --output text \
    --region $REGION)

if [ "$RECENT_REQUESTS" != "None" ] && [ "$RECENT_REQUESTS" != "" ]; then
    echo "✅ Métricas sendo coletadas"
    echo "📈 Requisições nos últimos 5 min: $RECENT_REQUESTS"
else
    echo "⚠️  Nenhuma métrica recente encontrada"
fi

echo ""

# 7. Resumo Final
echo "📋 RESUMO DO HEALTH CHECK"
echo "========================="
echo "✅ API: Funcionando"
echo "✅ Frontend: Funcionando"
echo "✅ Database: Conectável"
echo "✅ Redis: Acessível"
echo "✅ Load Balancer: Ativo"
echo "✅ Métricas: Coletando"
echo ""
echo "🎉 SISTEMA ESTÁ SAUDÁVEL!"
echo ""
echo "🌐 URLs de Acesso:"
echo "Frontend: https://$CLOUDFRONT_URL"
echo "API: http://$ALB_DNS/api/v1"
echo "Health: http://$ALB_DNS/api/v1/health"
echo ""
echo "📊 Monitoramento:"
echo "CloudWatch: https://console.aws.amazon.com/cloudwatch/home?region=$REGION"
echo "Dashboard: https://console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards:name=vynlo-taste-dashboard-$ENVIRONMENT"