@echo off
echo ========================================
echo   CRIANDO INSTANCIA EC2 VYNLO TASTE
echo ========================================

set REGION=us-east-1
set KEY_NAME=vynlo-taste-key
set INSTANCE_NAME=vynlo-prod

echo 🔑 Criando key pair...
aws ec2 create-key-pair --key-name %KEY_NAME% --region %REGION% --query 'KeyMaterial' --output text > %KEY_NAME%.pem

if %errorlevel% neq 0 (
    echo ⚠️ Key pair já existe ou erro na criação
)

echo 🛡️ Criando security group...
for /f "tokens=*" %%i in ('aws ec2 create-security-group --group-name vynlo-sg --description "Vynlo Taste Security Group" --region %REGION% --query "GroupId" --output text 2^>nul') do set SG_ID=%%i

if "%SG_ID%"=="" (
    echo ⚠️ Security group já existe, obtendo ID...
    for /f "tokens=*" %%i in ('aws ec2 describe-security-groups --group-names vynlo-sg --region %REGION% --query "SecurityGroups[0].GroupId" --output text 2^>nul') do set SG_ID=%%i
)

echo Security Group ID: %SG_ID%

echo 🔓 Configurando regras de segurança...
aws ec2 authorize-security-group-ingress --group-id %SG_ID% --protocol tcp --port 22 --cidr 0.0.0.0/0 --region %REGION% 2>nul
aws ec2 authorize-security-group-ingress --group-id %SG_ID% --protocol tcp --port 80 --cidr 0.0.0.0/0 --region %REGION% 2>nul
aws ec2 authorize-security-group-ingress --group-id %SG_ID% --protocol tcp --port 443 --cidr 0.0.0.0/0 --region %REGION% 2>nul
aws ec2 authorize-security-group-ingress --group-id %SG_ID% --protocol tcp --port 3000 --cidr 0.0.0.0/0 --region %REGION% 2>nul
aws ec2 authorize-security-group-ingress --group-id %SG_ID% --protocol tcp --port 8080 --cidr 0.0.0.0/0 --region %REGION% 2>nul

echo 🚀 Criando instância EC2...
for /f "tokens=*" %%i in ('aws ec2 run-instances --image-id ami-0c02fb55956c7d316 --count 1 --instance-type t3.medium --key-name %KEY_NAME% --security-group-ids %SG_ID% --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=%INSTANCE_NAME%}]" --region %REGION% --query "Instances[0].InstanceId" --output text') do set INSTANCE_ID=%%i

echo Instance ID: %INSTANCE_ID%

echo ⏳ Aguardando instância ficar pronta...
aws ec2 wait instance-running --instance-ids %INSTANCE_ID% --region %REGION%

echo 🌐 Obtendo IP público...
for /f "tokens=*" %%i in ('aws ec2 describe-instances --instance-ids %INSTANCE_ID% --region %REGION% --query "Reservations[0].Instances[0].PublicIpAddress" --output text') do set PUBLIC_IP=%%i

echo.
echo ========================================
echo   ✅ INSTÂNCIA EC2 CRIADA!
echo ========================================
echo.
echo 📋 Informações da instância:
echo   Instance ID: %INSTANCE_ID%
echo   Public IP: %PUBLIC_IP%
echo   Key File: %KEY_NAME%.pem
echo   Security Group: %SG_ID%
echo.
echo 🔐 Para conectar via SSH:
echo   ssh -i %KEY_NAME%.pem ubuntu@%PUBLIC_IP%
echo.
echo 📝 Configurações para GitHub Secrets:
echo   SSH_HOST: %PUBLIC_IP%
echo   SSH_USER: ubuntu
echo   SSH_KEY: (conteúdo do arquivo %KEY_NAME%.pem)
echo.
pause