@echo off
echo ========================================
echo   VYNLO TASTE - DEPLOY LIMPO FINAL
echo ========================================

set STACK_NAME=vynlo-taste-enterprise-%RANDOM%
set REGION=us-east-1

echo Stack único: %STACK_NAME%
echo Região: %REGION%
echo.

echo 🚀 Criando infraestrutura robusta...
aws cloudformation create-stack ^
    --stack-name %STACK_NAME% ^
    --template-body file://deploy/aws/infrastructure-robusto.yml ^
    --region %REGION% ^
    --capabilities CAPABILITY_IAM ^
    --parameters ParameterKey=Environment,ParameterValue=prod ParameterKey=InstanceType,ParameterValue=t3.medium ^
    --tags Key=Project,Value=VynloTaste Key=Environment,Value=Production Key=Version,Value=Enterprise

if %errorlevel% neq 0 (
    echo ❌ ERRO na criação!
    pause
    exit /b 1
)

echo ✅ Stack criado! Aguardando conclusão...
echo ⏳ Tempo estimado: 15-20 minutos...
echo.

aws cloudformation wait stack-create-complete --stack-name %STACK_NAME% --region %REGION%

if %errorlevel% neq 0 (
    echo ❌ ERRO na criação!
    echo.
    echo 🔍 Detalhes do erro:
    aws cloudformation describe-stack-events --stack-name %STACK_NAME% --region %REGION% --query "StackEvents[?ResourceStatus=='CREATE_FAILED'].[Timestamp,LogicalResourceId,ResourceStatusReason]" --output table
    pause
    exit /b 1
)

echo.
echo ========================================
echo   🎉 INFRAESTRUTURA ENTERPRISE CRIADA!
echo ========================================
echo.

echo 📋 Recursos criados:
aws cloudformation describe-stacks --stack-name %STACK_NAME% --region %REGION% --query "Stacks[0].Outputs" --output table

echo.
echo 💾 Salvando configurações...
aws cloudformation describe-stacks --stack-name %STACK_NAME% --region %REGION% --query "Stacks[0].Outputs" --output json > aws-outputs-enterprise.json

echo.
echo ✅ SUCESSO! Stack: %STACK_NAME%
echo ✅ Configurações: aws-outputs-enterprise.json
echo.
echo 🏗️ Infraestrutura Enterprise inclui:
echo   ✅ VPC Multi-AZ com NAT Gateways
echo   ✅ ECS Fargate Cluster
echo   ✅ RDS PostgreSQL Multi-AZ
echo   ✅ ElastiCache Redis Cluster
echo   ✅ Application Load Balancer
echo   ✅ CloudFront + S3
echo   ✅ CloudWatch Logs
echo   ✅ Secrets Manager
echo   ✅ IAM Roles completos
echo.
pause