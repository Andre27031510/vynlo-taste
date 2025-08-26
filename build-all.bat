@echo off
echo ========================================
echo    VYNLO TASTE - BUILD COMPLETO
echo ========================================

echo Iniciando build completo do sistema...
echo.

echo [ETAPA 1] Build do Backend...
call build-backend.bat
if errorlevel 1 (
    echo ✗ Falha no build do backend
    exit /b 1
)

echo.
echo [ETAPA 2] Build do Frontend...
call build-frontend.bat
if errorlevel 1 (
    echo ✗ Falha no build do frontend
    exit /b 1
)

echo.
echo ========================================
echo    ✓ BUILD COMPLETO FINALIZADO
echo ========================================
echo.
echo Arquivos gerados:
echo - Backend: backend\target\vynlo-taste-backend-1.0.0.jar
echo - Frontend: frontend\.next\
echo.
echo Pronto para deploy!