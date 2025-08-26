@echo off
echo ========================================
echo   LIMPEZA INDIVIDUAL DOS STACKS
echo ========================================

set REGION=us-east-1

echo 🗑️ Removendo stacks individualmente...

aws cloudformation delete-stack --stack-name vynlo-taste-prod-30460 --region %REGION%
echo ✅ Removendo vynlo-taste-prod-30460

aws cloudformation delete-stack --stack-name vynlo-taste-prod --region %REGION%
echo ✅ Removendo vynlo-taste-prod

aws cloudformation delete-stack --stack-name vynlo-taste-prod-8285 --region %REGION%
echo ✅ Removendo vynlo-taste-prod-8285

aws cloudformation delete-stack --stack-name vynlo-taste-prod-25762 --region %REGION%
echo ✅ Removendo vynlo-taste-prod-25762

aws cloudformation delete-stack --stack-name vynlo-taste-prod-v2 --region %REGION%
echo ✅ Removendo vynlo-taste-prod-v2

echo.
echo ⏳ Aguardando 60 segundos para propagação...
timeout /t 60 /nobreak

echo.
echo 📋 Verificando stacks restantes...
aws cloudformation list-stacks --region %REGION% --query "StackSummaries[?contains(StackName,'vynlo-taste') && StackStatus!='DELETE_COMPLETE'].[StackName,StackStatus]" --output table

echo.
echo ✅ Limpeza concluída!
pause