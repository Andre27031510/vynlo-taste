@echo off
echo ========================================
echo   VYNLO TASTE - DEPLOY AWS ROBUSTO
echo ========================================

REM Verificar AWS CLI
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERRO: AWS CLI não encontrado!
    echo Instale: https://aws.amazon.com/cli/
    pause
    exit /b 1
)

REM Verificar credenciais
echo Verificando credenciais AWS...
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERRO: Credenciais AWS não configuradas!
    echo Execute: aws configure
    pause
    exit /b 1
)

set STACK_NAME=vynlo-taste-prod
set REGION=us-east-1

echo ✅ Credenciais AWS verificadas
echo.
echo Configurações do Deploy:
echo - Stack: %STACK_NAME%
echo - Região: %REGION%
echo - Template: infrastructure-robusto.yml
echo.
echo Recursos que serão criados:
echo - VPC com Multi-AZ e NAT Gateways
echo - ECS Fargate Cluster
echo - Application Load Balancer
echo - RDS PostgreSQL Multi-AZ
echo - ElastiCache Redis Cluster
echo - S3 + CloudFront
echo - CloudWatch Logs
echo - Secrets Manager
echo - IAM Roles e Policies
echo.

set /p CONFIRM="Confirma o deploy? (S/N): "
if /i not "%CONFIRM%"=="S" (
    echo Deploy cancelado.
    pause
    exit /b 0
)

echo.
echo 🚀 Iniciando deploy da infraestrutura robusta...
echo.

REM Criar role de monitoramento RDS se não existir
echo Criando role de monitoramento RDS...
aws iam create-role ^
    --role-name rds-monitoring-role ^
    --assume-role-policy-document "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"monitoring.rds.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}" ^
    --region %REGION% 2>nul

aws iam attach-role-policy ^
    --role-name rds-monitoring-role ^
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole ^
    --region %REGION% 2>nul

echo ✅ Role de monitoramento configurado

REM Deploy da infraestrutura
echo.
echo 📦 Executando deploy do CloudFormation...
aws cloudformation deploy ^
    --template-file "deploy\aws\infrastructure-robusto.yml" ^
    --stack-name %STACK_NAME% ^
    --region %REGION% ^
    --capabilities CAPABILITY_IAM ^
    --parameter-overrides Environment=prod InstanceType=t3.medium ^
    --no-fail-on-empty-changeset

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERRO no deploy da infraestrutura!
    echo.
    echo Verificando eventos de erro...
    aws cloudformation describe-stack-events ^
        --stack-name %STACK_NAME% ^
        --region %REGION% ^
        --query "StackEvents[?ResourceStatus=='CREATE_FAILED' || ResourceStatus=='UPDATE_FAILED'].[Timestamp,LogicalResourceId,ResourceStatusReason]" ^
        --output table
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ DEPLOY DA INFRAESTRUTURA CONCLUÍDO COM SUCESSO!
echo.

REM Obter outputs
echo 📋 Informações da infraestrutura criada:
echo.
aws cloudformation describe-stacks ^
    --stack-name %STACK_NAME% ^
    --region %REGION% ^
    --query "Stacks[0].Outputs" ^
    --output table

REM Salvar outputs em arquivo JSON
echo.
echo 💾 Salvando configurações...
aws cloudformation describe-stacks ^
    --stack-name %STACK_NAME% ^
    --region %REGION% ^
    --query "Stacks[0].Outputs" ^
    --output json > aws-outputs.json

echo ✅ Configurações salvas em: aws-outputs.json

echo.
echo ========================================
echo   🎉 DEPLOY ROBUSTO CONCLUÍDO!
echo ========================================
echo.
echo 🏗️  Infraestrutura criada:
echo   ✅ VPC Multi-AZ com NAT Gateways
echo   ✅ ECS Fargate Cluster
echo   ✅ Application Load Balancer
echo   ✅ RDS PostgreSQL Multi-AZ
echo   ✅ ElastiCache Redis Cluster
echo   ✅ S3 Bucket + CloudFront
echo   ✅ CloudWatch Logs
echo   ✅ Secrets Manager
echo   ✅ IAM Roles e Security Groups
echo.
echo 🚀 Próximos passos:
echo   1. Deploy das aplicações no ECS
echo   2. Configurar CI/CD Pipeline
echo   3. Configurar domínio personalizado
echo   4. Configurar SSL/TLS
echo   5. Configurar monitoramento avançado
echo.
echo 📊 Custos estimados: $50-80/mês
echo.
pause