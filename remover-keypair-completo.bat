@echo off
echo ========================================
echo   REMOVENDO KEYPAIR COMPLETAMENTE
echo ========================================

set REGION=us-east-1

echo 🔍 Listando todos os key pairs...
aws ec2 describe-key-pairs --region %REGION% --query "KeyPairs[?contains(KeyName,'vynlo')].[KeyName,KeyPairId]" --output table

echo.
echo 🗑️ Removendo key pairs vynlo...
aws ec2 delete-key-pair --key-name vynlo-taste-key --region %REGION% 2>nul
echo ✅ Tentativa de remoção concluída

echo.
echo 🔍 Verificando key pairs restantes...
aws ec2 describe-key-pairs --region %REGION% --query "KeyPairs[?contains(KeyName,'vynlo')].[KeyName,KeyPairId]" --output table

echo.
echo ✅ Agora você pode criar um novo key pair pelo painel!
pause