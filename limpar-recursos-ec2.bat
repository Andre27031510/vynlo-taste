@echo off
echo ========================================
echo   LIMPANDO RECURSOS EC2 CRIADOS
echo ========================================

set REGION=us-east-1
set KEY_NAME=vynlo-taste-key
set SG_ID=sg-015846ebd9f427379

echo 🗑️ Removendo key pair...
aws ec2 delete-key-pair --key-name %KEY_NAME% --region %REGION%
echo ✅ Key pair removido

echo 🗑️ Removendo security group...
aws ec2 delete-security-group --group-id %SG_ID% --region %REGION%
echo ✅ Security group removido

echo 🧹 Limpeza concluída!
echo.
echo ✅ Agora você pode criar pelo painel da AWS sem conflitos
echo.
pause