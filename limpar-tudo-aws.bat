@echo off
echo ========================================
echo   LIMPEZA COMPLETA AWS
echo ========================================

set REGION=us-east-1

echo 🧹 Listando todos os stacks Vynlo Taste...
aws cloudformation list-stacks --region %REGION% --query "StackSummaries[?contains(StackName,'vynlo-taste')].[StackName,StackStatus]" --output table

echo.
echo 🗑️ Removendo TODOS os stacks Vynlo Taste...

REM Remover todos os stacks vynlo-taste
for /f "tokens=*" %%i in ('aws cloudformation list-stacks --region %REGION% --query "StackSummaries[?contains(StackName,'vynlo-taste') && StackStatus!='DELETE_COMPLETE'].StackName" --output text') do (
    echo Removendo stack: %%i
    aws cloudformation delete-stack --stack-name %%i --region %REGION%
)

echo ⏳ Aguardando remoção completa...
timeout /t 60 /nobreak >nul

echo ✅ Limpeza concluída!
echo.
echo 📋 Stacks restantes:
aws cloudformation list-stacks --region %REGION% --query "StackSummaries[?contains(StackName,'vynlo-taste')].[StackName,StackStatus]" --output table

pause