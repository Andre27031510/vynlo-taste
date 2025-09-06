@echo off
echo ========================================
echo    VYNLO TASTE - BUILD FRONTEND
echo ========================================

cd frontend

echo [1/4] Instalando dependencias...
call npm install

echo [2/4] Limpando cache...
call npm run clean 2>nul || echo Cache limpo

echo [3/4] Fazendo build de producao...
call npm run build

echo [4/4] Verificando build...
if exist ".next" (
    echo ✓ Build do frontend concluido com sucesso!
    echo Build: frontend\.next\
) else (
    echo ✗ Erro no build do frontend
    exit /b 1
)

echo.
echo ========================================
echo    BUILD FRONTEND FINALIZADO
echo ========================================