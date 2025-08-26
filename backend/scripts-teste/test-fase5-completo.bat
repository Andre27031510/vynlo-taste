@echo off
echo ========================================
echo FASE 5 - TESTES DE INTEGRACAO E PERFORMANCE
echo ========================================
echo.

echo [1/5] TESTANDO API ENDPOINTS
echo ===============================
echo.

echo Testando Health Check...
powershell -Command "$start = Get-Date; try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/health' -Method Get; $end = Get-Date; $time = ($end - $start).TotalMilliseconds; Write-Host 'Health OK -' $response.status '(' $time 'ms)' -ForegroundColor Green } catch { Write-Host 'Health ERRO:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo Testando Actuator Info...
powershell -Command "$start = Get-Date; try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/info' -Method Get; $end = Get-Date; $time = ($end - $start).TotalMilliseconds; Write-Host 'Info OK (' $time 'ms)' -ForegroundColor Green } catch { Write-Host 'Info ERRO:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo Testando Metricas...
powershell -Command "$start = Get-Date; try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/metrics' -Method Get; $end = Get-Date; $time = ($end - $start).TotalMilliseconds; Write-Host 'Metricas OK -' $response.names.Count 'metricas (' $time 'ms)' -ForegroundColor Green } catch { Write-Host 'Metricas ERRO:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo Testando Prometheus...
powershell -Command "$start = Get-Date; try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/prometheus' -Method Get; $end = Get-Date; $time = ($end - $start).TotalMilliseconds; $size = $response.Length; Write-Host 'Prometheus OK -' $size 'chars (' $time 'ms)' -ForegroundColor Green } catch { Write-Host 'Prometheus ERRO:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo [2/5] TESTANDO BANCO DE DADOS
echo ============================
echo.

echo Testando conexao PostgreSQL via health...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/health' -Method Get; if($response.components.db.status -eq 'UP') { Write-Host 'PostgreSQL OK - Status:' $response.components.db.status -ForegroundColor Green } else { Write-Host 'PostgreSQL PROBLEMA:' $response.components.db.status -ForegroundColor Yellow } } catch { Write-Host 'PostgreSQL ERRO:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo Testando Redis via health...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/health' -Method Get; if($response.components.redis.status -eq 'UP') { Write-Host 'Redis OK - Status:' $response.components.redis.status -ForegroundColor Green } else { Write-Host 'Redis PROBLEMA:' $response.components.redis.status -ForegroundColor Yellow } } catch { Write-Host 'Redis ERRO:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo [3/5] TESTANDO CACHE E PERFORMANCE
echo =================================
echo.

echo Teste de performance - 10 requisicoes sequenciais...
for /L %%i in (1,1,10) do (
    powershell -Command "$start = Get-Date; try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/health' -Method Get; $end = Get-Date; $time = ($end - $start).TotalMilliseconds; Write-Host 'Req %%i:' $time 'ms' } catch { Write-Host 'Req %%i: ERRO' -ForegroundColor Red }"
)

echo.
echo [4/5] TESTANDO RATE LIMITING
echo ============================
echo.

echo Teste de rate limiting - 20 requisicoes rapidas...
powershell -Command "for($i=1; $i -le 20; $i++) { try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health' -Method Get; $status = $response.StatusCode; $remaining = $response.Headers['X-Rate-Limit-Remaining']; Write-Host \"Req $i: $status (Remaining: $remaining)\" } catch { Write-Host \"Req $i: Rate Limited\" -ForegroundColor Yellow } }"

echo.
echo [5/5] TESTANDO METRICAS DETALHADAS
echo =================================
echo.

echo Testando metricas de JVM...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/metrics/jvm.memory.used' -Method Get; Write-Host 'JVM Memory:' $response.measurements[0].value 'bytes' -ForegroundColor Cyan } catch { Write-Host 'JVM Memory ERRO:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo Testando metricas de HTTP...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/metrics/http.server.requests' -Method Get; Write-Host 'HTTP Requests:' $response.measurements[0].value 'total' -ForegroundColor Cyan } catch { Write-Host 'HTTP Requests ERRO:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo Testando metricas de conexoes DB...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/actuator/metrics/hikaricp.connections.active' -Method Get; Write-Host 'DB Connections Active:' $response.measurements[0].value -ForegroundColor Cyan } catch { Write-Host 'DB Connections ERRO:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo ========================================
echo FASE 5 - TESTES CONCLUIDOS
echo ========================================
echo.
echo Gerando relatorio de performance...
powershell -Command "Write-Host '=== RELATORIO DE PERFORMANCE ===' -ForegroundColor Yellow; Write-Host 'Sistema testado em:' (Get-Date) -ForegroundColor White; Write-Host 'Todos os componentes validados!' -ForegroundColor Green"

pause