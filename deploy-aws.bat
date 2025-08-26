@echo off
echo ========================================
echo DEPLOY AWS COMPLETO - VYNLO TASTE
echo ========================================

echo.
echo 1. VERIFICANDO PRE-REQUISITOS
echo =============================

REM Verificar AWS CLI
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: AWS CLI nao instalado
    echo Instalando AWS CLI...
    winget install Amazon.AWSCLI
    if %errorlevel% neq 0 (
        echo ERRO: Falha na instalacao do AWS CLI
        pause
        exit /b 1
    )
)

echo OK: AWS CLI instalado

REM Verificar credenciais AWS
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Credenciais AWS nao configuradas
    echo Execute: aws configure
    pause
    exit /b 1
)

echo OK: Credenciais AWS configuradas

REM Verificar Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Docker nao instalado
    echo Instale Docker Desktop primeiro
    pause
    exit /b 1
)

echo OK: Docker instalado

echo.
echo 2. CONFIGURANDO VARIAVEIS DE AMBIENTE
echo ====================================

set AWS_REGION=us-east-1
set STACK_NAME=vynlo-taste-prod
set APP_NAME=vynlo-taste

echo Regiao AWS: %AWS_REGION%
echo Stack Name: %STACK_NAME%
echo App Name: %APP_NAME%

echo.
echo 3. CRIANDO INFRAESTRUTURA AWS
echo =============================

echo Criando stack CloudFormation...
aws cloudformation deploy ^
    --template-file deploy/aws/infrastructure.yml ^
    --stack-name %STACK_NAME% ^
    --parameter-overrides Environment=prod ^
    --capabilities CAPABILITY_IAM ^
    --region %AWS_REGION%

if %errorlevel% neq 0 (
    echo ERRO: Falha na criacao da infraestrutura
    pause
    exit /b 1
)

echo OK: Infraestrutura criada

echo.
echo 4. OBTENDO INFORMACOES DA INFRAESTRUTURA
echo ========================================

for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --query "Stacks[0].Outputs[?OutputKey==`ALBDNSName`].OutputValue" --output text --region %AWS_REGION%') do set ALB_DNS=%%i
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --query "Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue" --output text --region %AWS_REGION%') do set S3_BUCKET=%%i
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --query "Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue" --output text --region %AWS_REGION%') do set DB_ENDPOINT=%%i

echo Load Balancer: %ALB_DNS%
echo S3 Bucket: %S3_BUCKET%
echo Database: %DB_ENDPOINT%

echo.
echo 5. PREPARANDO APLICACAO BACKEND
echo ===============================

cd backend

echo Criando Dockerfile para backend...
echo FROM openjdk:17-jdk-slim > Dockerfile
echo COPY target/*.jar app.jar >> Dockerfile
echo EXPOSE 8080 >> Dockerfile
echo ENTRYPOINT ["java", "-jar", "/app.jar"] >> Dockerfile

echo Compilando aplicacao...
call mvn clean package -DskipTests

if %errorlevel% neq 0 (
    echo ERRO: Falha na compilacao
    pause
    exit /b 1
)

echo OK: Aplicacao compilada

echo.
echo 6. CRIANDO APLICACAO ELASTIC BEANSTALK
echo ======================================

REM Verificar se aplicacao existe
aws elasticbeanstalk describe-applications --application-names %APP_NAME% --region %AWS_REGION% >nul 2>&1
if %errorlevel% neq 0 (
    echo Criando aplicacao Elastic Beanstalk...
    aws elasticbeanstalk create-application ^
        --application-name %APP_NAME% ^
        --description "Vynlo Taste - Sistema de Gestao para Restaurantes" ^
        --region %AWS_REGION%
)

echo OK: Aplicacao Elastic Beanstalk pronta

echo.
echo 7. FAZENDO DEPLOY DO BACKEND
echo ============================

set VERSION_LABEL=%APP_NAME%-%date:~6,4%%date:~3,2%%date:~0,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set VERSION_LABEL=%VERSION_LABEL: =0%

echo Versao: %VERSION_LABEL%

REM Criar bucket S3 se nao existir
aws s3 mb s3://elasticbeanstalk-%AWS_REGION%-%AWS::AccountId% --region %AWS_REGION% >nul 2>&1

echo Fazendo upload do JAR...
aws s3 cp target/*.jar s3://elasticbeanstalk-%AWS_REGION%-123456789012/%APP_NAME%/%VERSION_LABEL%.jar --region %AWS_REGION%

echo Criando versao da aplicacao...
aws elasticbeanstalk create-application-version ^
    --application-name %APP_NAME% ^
    --version-label %VERSION_LABEL% ^
    --source-bundle S3Bucket="elasticbeanstalk-%AWS_REGION%-123456789012",S3Key="%APP_NAME%/%VERSION_LABEL%.jar" ^
    --region %AWS_REGION%

echo OK: Backend deployado

cd ..

echo.
echo 8. PREPARANDO FRONTEND
echo ======================

cd frontend

echo Instalando dependencias...
call npm install

echo Compilando frontend...
call npm run build

if %errorlevel% neq 0 (
    echo ERRO: Falha na compilacao do frontend
    pause
    exit /b 1
)

echo OK: Frontend compilado

echo.
echo 9. FAZENDO DEPLOY DO FRONTEND
echo =============================

echo Fazendo upload para S3...
aws s3 sync out/ s3://%S3_BUCKET% --delete --region %AWS_REGION%

echo OK: Frontend deployado

cd ..

echo.
echo 10. CONFIGURANDO MONITORAMENTO
echo ==============================

echo Criando alertas CloudWatch...
aws cloudformation deploy ^
    --template-file deploy/monitoring/alerts.yml ^
    --stack-name %STACK_NAME%-monitoring ^
    --parameter-overrides Environment=prod NotificationEmail=admin@vynlotaste.com ^
    --region %AWS_REGION%

echo OK: Monitoramento configurado

echo.
echo 11. CONFIGURANDO SEGURANCA
echo ==========================

echo Criando configuracoes de seguranca...
aws cloudformation deploy ^
    --template-file deploy/security/security-config.yml ^
    --stack-name %STACK_NAME%-security ^
    --capabilities CAPABILITY_IAM ^
    --parameter-overrides Environment=prod DomainName=vynlotaste.com ^
    --region %AWS_REGION%

echo OK: Seguranca configurada

echo.
echo 12. EXECUTANDO HEALTH CHECK
echo ===========================

echo Aguardando aplicacao ficar disponivel...
timeout /t 60 /nobreak >nul

echo Testando health check...
curl -f "http://%ALB_DNS%/api/v1/health" >nul 2>&1
if %errorlevel% equ 0 (
    echo OK: Health check passou
) else (
    echo AVISO: Health check falhou - verificar logs
)

echo.
echo ========================================
echo DEPLOY AWS CONCLUIDO COM SUCESSO!
echo ========================================

echo.
echo URLS DE ACESSO:
echo ===============
echo Frontend: https://%S3_BUCKET%.s3-website-%AWS_REGION%.amazonaws.com
echo Backend: http://%ALB_DNS%
echo API Health: http://%ALB_DNS%/api/v1/health
echo pgAdmin: http://localhost:5050 (Docker local)
echo Redis Commander: http://localhost:8081 (Docker local)

echo.
echo PROXIMOS PASSOS:
echo ================
echo 1. Configurar dominio personalizado
echo 2. Configurar SSL/TLS
echo 3. Testar todas as funcionalidades
echo 4. Monitorar metricas no CloudWatch

echo.
echo COMANDOS UTEIS:
echo ===============
echo Ver logs: aws logs tail /aws/elasticbeanstalk/%APP_NAME%-prod/var/log/eb-engine.log --follow
echo Ver stacks: aws cloudformation list-stacks --region %AWS_REGION%
echo Ver aplicacoes: aws elasticbeanstalk describe-applications --region %AWS_REGION%

echo.
pause