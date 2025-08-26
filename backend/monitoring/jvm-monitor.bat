@echo off
echo ========================================
echo 📊 MONITORAMENTO JVM - VYNLO TASTE
echo ========================================

echo.
echo Coletando métricas da JVM...
echo.

set LOG_FILE=jvm-metrics-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.log
echo Timestamp,Heap_Used_MB,Heap_Max_MB,Heap_Percent,NonHeap_Used_MB,GC_Count,GC_Time_MS > %LOG_FILE%

:LOOP
for /f "tokens=*" %%i in ('jps -l ^| findstr "VynloTasteApplication"') do (
    for /f "tokens=1" %%j in ("%%i") do set PID=%%j
)

if not defined PID (
    echo ❌ Aplicação não encontrada! Certifique-se de que está rodando.
    pause
    exit /b 1
)

echo 🔍 Monitorando PID: %PID%
echo.

for /L %%i in (1,1,60) do (
    set TIMESTAMP=%date% %time%
    
    REM Heap Memory
    for /f "tokens=3" %%a in ('jstat -gc %PID% ^| findstr /v "S0C"') do set HEAP_USED=%%a
    for /f "tokens=1" %%b in ('java -XX:+PrintFlagsFinal -version 2^>^&1 ^| findstr MaxHeapSize') do set MAX_HEAP=%%b
    
    REM GC Info
    for /f "tokens=14,15" %%c in ('jstat -gc %PID% ^| findstr /v "S0C"') do (
        set GC_COUNT=%%c
        set GC_TIME=%%d
    )
    
    echo [%TIMESTAMP%] Heap: %HEAP_USED% KB | GC: %GC_COUNT% collections
    echo %TIMESTAMP%,%HEAP_USED%,Unknown,Unknown,Unknown,%GC_COUNT%,%GC_TIME% >> %LOG_FILE%
    
    timeout /t 5 /nobreak >nul
)

echo.
echo ✅ Monitoramento concluído!
echo 📄 Log salvo em: %LOG_FILE%
echo.

pause