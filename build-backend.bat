@echo off
echo ========================================
echo    VYNLO TASTE - BUILD BACKEND
echo ========================================

cd backend

echo [1/3] Limpando projeto...
call mvn clean

echo [2/3] Compilando com perfil de producao...
call mvn package -DskipTests -Pprod -Dspring.profiles.active=prod

echo [3/3] Verificando build...
if exist "target\vynlo-taste-backend-1.0.0.jar" (
    echo ✓ Build do backend concluido com sucesso!
    echo JAR: backend\target\vynlo-taste-backend-1.0.0.jar
) else (
    echo ✗ Erro no build do backend
    exit /b 1
)

echo.
echo ========================================
echo    BUILD BACKEND FINALIZADO
echo ========================================