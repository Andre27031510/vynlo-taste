@echo off
echo ========================================
echo   VYNLO TASTE - DEPLOY AWS CORRIGIDO
echo ========================================

set FAILED_STACK=vynlo-taste-prod-7684
set NEW_STACK=vynlo-taste-prod-%RANDOM%
set REGION=us-east-1

echo Removendo stack com falha: %FAILED_STACK%
aws cloudformation delete-stack --stack-name %FAILED_STACK% --region %REGION%

echo Aguardando remoção...
timeout /t 30 /nobreak >nul

echo Criando novo stack: %NEW_STACK%
aws cloudformation create-stack ^
    --stack-name %NEW_STACK% ^
    --template-body file://deploy/aws/infrastructure-robusto.yml ^
    --region %REGION% ^
    --capabilities CAPABILITY_IAM ^
    --parameters ParameterKey=Environment,ParameterValue=prod ParameterKey=InstanceType,ParameterValue=t3.medium

if %errorlevel% neq 0 (
    echo ❌ ERRO na criação!
    pause
    exit /b 1
)

echo ✅ Stack criado! Aguardando conclusão...
aws cloudformation wait stack-create-complete --stack-name %NEW_STACK% --region %REGION%

if %errorlevel% neq 0 (
    echo ❌ ERRO na criação!
    aws cloudformation describe-stack-events --stack-name %NEW_STACK% --region %REGION% --query "StackEvents[?ResourceStatus=='CREATE_FAILED'].[LogicalResourceId,ResourceStatusReason]" --output table
    pause
    exit /b 1
)

echo ✅ INFRAESTRUTURA ROBUSTA CRIADA!
aws cloudformation describe-stacks --stack-name %NEW_STACK% --region %REGION% --query "Stacks[0].Outputs" --output table
aws cloudformation describe-stacks --stack-name %NEW_STACK% --region %REGION% --query "Stacks[0].Outputs" --output json > aws-outputs.json
echo Stack: %NEW_STACK%
pause