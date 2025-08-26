#!/bin/bash

# Vynlo Taste - Script de Rollback
set -e

# Configurações
ENVIRONMENT="prod"
REGION="us-east-1"
APP_NAME="vynlo-taste"

echo "🔄 ROLLBACK - VYNLO TASTE"
echo "========================="

# Verificar parâmetros
if [ $# -eq 0 ]; then
    echo "❌ Uso: $0 <version-label>"
    echo "Exemplo: $0 vynlo-taste-20231219-143000"
    exit 1
fi

VERSION_LABEL=$1

echo "🎯 Fazendo rollback para versão: $VERSION_LABEL"
echo ""

# 1. Verificar se a versão existe
echo "1. 🔍 Verificando versão..."
if aws elasticbeanstalk describe-application-versions \
    --application-name $APP_NAME \
    --version-labels $VERSION_LABEL \
    --region $REGION > /dev/null 2>&1; then
    echo "✅ Versão encontrada"
else
    echo "❌ Versão não encontrada"
    exit 1
fi

# 2. Obter ambiente atual
ENVIRONMENT_NAME=$(aws elasticbeanstalk describe-environments \
    --application-name $APP_NAME \
    --query 'Environments[?Status==`Ready`].EnvironmentName' \
    --output text \
    --region $REGION)

if [ -z "$ENVIRONMENT_NAME" ]; then
    echo "❌ Nenhum ambiente ativo encontrado"
    exit 1
fi

echo "🎯 Ambiente: $ENVIRONMENT_NAME"

# 3. Backup da versão atual
echo ""
echo "2. 💾 Fazendo backup da versão atual..."
CURRENT_VERSION=$(aws elasticbeanstalk describe-environments \
    --environment-names $ENVIRONMENT_NAME \
    --query 'Environments[0].VersionLabel' \
    --output text \
    --region $REGION)

echo "📦 Versão atual: $CURRENT_VERSION"

# 4. Executar rollback
echo ""
echo "3. 🔄 Executando rollback..."
aws elasticbeanstalk update-environment \
    --environment-name $ENVIRONMENT_NAME \
    --version-label $VERSION_LABEL \
    --region $REGION

echo "✅ Rollback iniciado"

# 5. Monitorar progresso
echo ""
echo "4. 📊 Monitorando progresso..."
echo "Aguardando conclusão do rollback..."

while true; do
    STATUS=$(aws elasticbeanstalk describe-environments \
        --environment-names $ENVIRONMENT_NAME \
        --query 'Environments[0].Status' \
        --output text \
        --region $REGION)
    
    HEALTH=$(aws elasticbeanstalk describe-environments \
        --environment-names $ENVIRONMENT_NAME \
        --query 'Environments[0].Health' \
        --output text \
        --region $REGION)
    
    echo "Status: $STATUS | Health: $HEALTH"
    
    if [ "$STATUS" = "Ready" ]; then
        if [ "$HEALTH" = "Ok" ] || [ "$HEALTH" = "Green" ]; then
            echo "✅ Rollback concluído com sucesso!"
            break
        elif [ "$HEALTH" = "Red" ]; then
            echo "❌ Rollback falhou - ambiente com problemas"
            exit 1
        fi
    elif [ "$STATUS" = "Terminating" ] || [ "$STATUS" = "Terminated" ]; then
        echo "❌ Rollback falhou - ambiente terminado"
        exit 1
    fi
    
    sleep 30
done

# 6. Verificar saúde do sistema
echo ""
echo "5. 🏥 Verificando saúde do sistema..."

# Obter URL do Load Balancer
ALB_DNS=$(aws cloudformation describe-stacks \
    --stack-name "vynlo-taste-${ENVIRONMENT}" \
    --query 'Stacks[0].Outputs[?OutputKey==`ALBDNSName`].OutputValue' \
    --output text \
    --region $REGION)

if [ -n "$ALB_DNS" ]; then
    echo "🔍 Testando health check..."
    sleep 60  # Aguardar aplicação inicializar
    
    if curl -f -s --max-time 30 "http://$ALB_DNS/api/v1/health" > /dev/null; then
        echo "✅ Health check passou"
    else
        echo "⚠️  Health check falhou - verificar logs"
    fi
else
    echo "⚠️  Não foi possível obter URL do Load Balancer"
fi

# 7. Relatório final
echo ""
echo "📋 RELATÓRIO DO ROLLBACK"
echo "======================="
echo "✅ Rollback executado: $VERSION_LABEL"
echo "📦 Versão anterior: $CURRENT_VERSION"
echo "🎯 Ambiente: $ENVIRONMENT_NAME"
echo "🌐 URL: http://$ALB_DNS"
echo ""

# 8. Instruções pós-rollback
echo "📝 PRÓXIMOS PASSOS:"
echo "=================="
echo "1. Verificar logs da aplicação"
echo "2. Monitorar métricas no CloudWatch"
echo "3. Testar funcionalidades críticas"
echo "4. Notificar equipe sobre o rollback"
echo ""

# 9. Comandos úteis
echo "🔧 COMANDOS ÚTEIS:"
echo "================="
echo "Ver logs:"
echo "aws logs tail /aws/elasticbeanstalk/$ENVIRONMENT_NAME/var/log/eb-engine.log --follow --region $REGION"
echo ""
echo "Ver versões disponíveis:"
echo "aws elasticbeanstalk describe-application-versions --application-name $APP_NAME --region $REGION"
echo ""
echo "Ver status do ambiente:"
echo "aws elasticbeanstalk describe-environments --environment-names $ENVIRONMENT_NAME --region $REGION"
echo ""

echo "🎉 ROLLBACK CONCLUÍDO!"