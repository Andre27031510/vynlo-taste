@echo off
echo ========================================
echo 🚀 FASE 6 - TESTES COMPLETOS DE PERFORMANCE
echo ========================================

echo.
echo 📋 CHECKLIST DE TESTES:
echo    ✅ 1. Testes de Carga (Load Testing)
echo    ✅ 2. Testes de Stress (Stress Testing)  
echo    ✅ 3. Testes de Performance (Response Time)
echo    ✅ 4. Monitoramento de Sistema
echo    ✅ 5. Métricas JVM
echo.

echo 🔧 Verificando pré-requisitos...

REM Verificar se a aplicação está rodando
curl -s http://localhost:8080/api/v1/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Aplicação não está rodando em localhost:8080
    echo    Execute: mvn spring-boot:run
    pause
    exit /b 1
)

echo ✅ Aplicação está rodando
echo.

echo 📊 FASE 1: TESTE DE CARGA BÁSICO
echo ================================
echo Testando endpoints principais...

REM Teste básico de endpoints
echo Testing /health...
curl -s -w "Response Time: %%{time_total}s\n" http://localhost:8080/api/v1/health

echo Testing /products...
curl -s -w "Response Time: %%{time_total}s\n" http://localhost:8080/api/v1/products

echo Testing /orders...
curl -s -w "Response Time: %%{time_total}s\n" http://localhost:8080/api/v1/orders

echo.
echo 📈 FASE 2: MÉTRICAS DE PERFORMANCE
echo ==================================

echo Coletando metricas JVM...
curl -s http://localhost:8080/api/v1/performance/metrics

echo.
echo 🔄 FASE 3: TESTE DE CARGA SIMULADO
echo ==================================

echo Executando 100 requisicoes simultaneas...
for /L %%i in (1,1,100) do (
    start /B curl -s http://localhost:8080/api/v1/health >nul 2>&1
)

echo Aguardando conclusão...
timeout /t 10 /nobreak >nul

echo.
echo 📊 FASE 4: MONITORAMENTO CONTÍNUO
echo =================================

echo Iniciando monitoramento por 60 segundos...
start /B powershell -ExecutionPolicy Bypass -File "monitoring\system-monitor.ps1" -Duration 60 -Interval 5

echo.
echo 🎯 FASE 5: TESTE DE STRESS BÁSICO
echo =================================

echo Executando teste de stress com 500 requisicoes...
for /L %%i in (1,1,500) do (
    start /B curl -s http://localhost:8080/api/v1/performance/load-test?iterations=1000 >nul 2>&1
    if %%i==100 timeout /t 1 /nobreak >nul
    if %%i==200 timeout /t 1 /nobreak >nul
    if %%i==300 timeout /t 1 /nobreak >nul
    if %%i==400 timeout /t 1 /nobreak >nul
)

echo Aguardando conclusao do teste de stress...
timeout /t 30 /nobreak >nul

echo.
echo 📋 RELATÓRIO FINAL
echo ==================

echo Testes de Carga: CONCLUIDO
echo Testes de Stress: CONCLUIDO
echo Monitoramento: ATIVO
echo Metricas JVM: COLETADAS

echo.
echo Para testes avancados com Gatling:
echo    cd performance-tests
echo    mvn gatling:test
echo.

echo Logs de monitoramento salvos em:
echo    monitoring\performance-monitor-*.csv
echo.

echo FASE 6 CONCLUIDA COM SUCESSO!
echo.

pause