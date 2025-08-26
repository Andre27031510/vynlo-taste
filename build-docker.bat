@echo off
echo ========================================
echo    VYNLO TASTE - BUILD DOCKER
echo ========================================

echo [1/3] Fazendo build das aplicacoes...
call build-all.bat
if errorlevel 1 (
    echo ✗ Falha no build das aplicacoes
    exit /b 1
)

echo.
echo [2/3] Construindo imagens Docker...
docker-compose -f docker-compose.prod.yml build --no-cache

echo.
echo [3/3] Verificando imagens...
docker images | findstr vynlo

echo.
echo ========================================
echo    ✓ BUILD DOCKER FINALIZADO
echo ========================================
echo.
echo Para iniciar: docker-compose -f docker-compose.prod.yml up -d