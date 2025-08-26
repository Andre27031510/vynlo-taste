@echo off
echo ========================================
echo   VYNLO TASTE - DEPLOY ECS COMPLETO
echo ========================================

set REGION=us-east-1
set CLUSTER_NAME=vynlo-taste-cluster-prod
set ACCOUNT_ID=051826695275

echo 🐳 ETAPA 1: Criando repositórios ECR...

REM Criar repositórios ECR
aws ecr create-repository --repository-name vynlo-taste-backend --region %REGION% 2>nul
aws ecr create-repository --repository-name vynlo-taste-frontend --region %REGION% 2>nul

echo ✅ Repositórios ECR criados

echo 🔐 ETAPA 2: Login no ECR...
aws ecr get-login-password --region %REGION% | docker login --username AWS --password-stdin %ACCOUNT_ID%.dkr.ecr.%REGION%.amazonaws.com

echo 🏗️ ETAPA 3: Build e Push das imagens...

REM Build Backend
echo Building backend...
cd backend
docker build -t vynlo-taste-backend .
docker tag vynlo-taste-backend:latest %ACCOUNT_ID%.dkr.ecr.%REGION%.amazonaws.com/vynlo-taste-backend:latest
docker push %ACCOUNT_ID%.dkr.ecr.%REGION%.amazonaws.com/vynlo-taste-backend:latest
cd ..

REM Build Frontend
echo Building frontend...
cd frontend
docker build -t vynlo-taste-frontend .
docker tag vynlo-taste-frontend:latest %ACCOUNT_ID%.dkr.ecr.%REGION%.amazonaws.com/vynlo-taste-frontend:latest
docker push %ACCOUNT_ID%.dkr.ecr.%REGION%.amazonaws.com/vynlo-taste-frontend:latest
cd ..

echo ✅ Imagens enviadas para ECR

echo 📋 ETAPA 4: Registrando Task Definitions...

REM Registrar task definitions
aws ecs register-task-definition --cli-input-json file://deploy/aws/ecs-backend-task.json --region %REGION%
aws ecs register-task-definition --cli-input-json file://deploy/aws/ecs-frontend-task.json --region %REGION%

echo ✅ Task Definitions registradas

echo 🚀 ETAPA 5: Criando Services ECS...

REM Obter subnet IDs e security group IDs do CloudFormation
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name vynlo-taste-prod-* --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='PrivateSubnet1'].OutputValue" --output text 2^>nul') do set SUBNET1=%%i
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name vynlo-taste-prod-* --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='PrivateSubnet2'].OutputValue" --output text 2^>nul') do set SUBNET2=%%i
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name vynlo-taste-prod-* --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='ECSSecurityGroup'].OutputValue" --output text 2^>nul') do set SECURITY_GROUP=%%i
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name vynlo-taste-prod-* --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='BackendTargetGroup'].OutputValue" --output text 2^>nul') do set BACKEND_TG=%%i
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name vynlo-taste-prod-* --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='FrontendTargetGroup'].OutputValue" --output text 2^>nul') do set FRONTEND_TG=%%i

REM Criar service backend
aws ecs create-service ^
    --cluster %CLUSTER_NAME% ^
    --service-name vynlo-taste-backend-service ^
    --task-definition vynlo-taste-backend-prod ^
    --desired-count 2 ^
    --launch-type FARGATE ^
    --network-configuration "awsvpcConfiguration={subnets=[%SUBNET1%,%SUBNET2%],securityGroups=[%SECURITY_GROUP%],assignPublicIp=DISABLED}" ^
    --load-balancers "targetGroupArn=%BACKEND_TG%,containerName=vynlo-taste-backend,containerPort=8080" ^
    --region %REGION%

REM Criar service frontend
aws ecs create-service ^
    --cluster %CLUSTER_NAME% ^
    --service-name vynlo-taste-frontend-service ^
    --task-definition vynlo-taste-frontend-prod ^
    --desired-count 2 ^
    --launch-type FARGATE ^
    --network-configuration "awsvpcConfiguration={subnets=[%SUBNET1%,%SUBNET2%],securityGroups=[%SECURITY_GROUP%],assignPublicIp=DISABLED}" ^
    --load-balancers "targetGroupArn=%FRONTEND_TG%,containerName=vynlo-taste-frontend,containerPort=3000" ^
    --region %REGION%

echo ✅ Services ECS criados

echo ⏳ ETAPA 6: Aguardando services ficarem estáveis...
aws ecs wait services-stable --cluster %CLUSTER_NAME% --services vynlo-taste-backend-service --region %REGION%
aws ecs wait services-stable --cluster %CLUSTER_NAME% --services vynlo-taste-frontend-service --region %REGION%

echo.
echo ========================================
echo   🎉 DEPLOY ECS CONCLUÍDO!
echo ========================================
echo.
echo 🏗️ Recursos deployados:
echo   ✅ ECR Repositories
echo   ✅ Docker Images
echo   ✅ ECS Task Definitions
echo   ✅ ECS Services (2 instâncias cada)
echo   ✅ Load Balancer configurado
echo.
echo 🌐 Acesse sua aplicação:
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name vynlo-taste-prod-* --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='ALBDNSName'].OutputValue" --output text 2^>nul') do echo   Frontend: http://%%i
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name vynlo-taste-prod-* --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='ALBDNSName'].OutputValue" --output text 2^>nul') do echo   Backend:  http://%%i/api
echo.
pause