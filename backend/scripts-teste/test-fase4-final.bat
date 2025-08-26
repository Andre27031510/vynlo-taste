@echo off
echo ========================================
echo FASE 4 - TESTE FINAL COMPLETO
echo ========================================
echo.

echo [1] TESTANDO ACTUATOR CORRIGIDO...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/actuator' -Method Get; Write-Host 'Actuator OK - Endpoints:' $response._links.Count -ForegroundColor Green } catch { Write-Host 'Actuator ainda bloqueado' -ForegroundColor Yellow }"

echo.
echo [2] TESTANDO CORS RESTRITIVO...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health' -Method Options -Headers @{'Origin'='http://malicious-site.com'; 'Access-Control-Request-Method'='GET'}; Write-Host 'CORS malicioso permitido (PROBLEMA)' -ForegroundColor Red } catch { Write-Host 'CORS malicioso BLOQUEADO (CORRETO)' -ForegroundColor Green }"

echo.
echo [3] TESTANDO CORS LEGITIMO...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health' -Method Options -Headers @{'Origin'='http://localhost:3000'; 'Access-Control-Request-Method'='GET'}; Write-Host 'CORS localhost:3000 PERMITIDO (CORRETO)' -ForegroundColor Green } catch { Write-Host 'CORS localhost:3000 bloqueado' -ForegroundColor Yellow }"

echo.
echo [4] VALIDACAO FINAL DE SEGURANCA...
powershell -Command "$response = Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health' -Method Get; Write-Host 'Headers de Seguranca:'; Write-Host 'X-Frame-Options:' $response.Headers['X-Frame-Options'] -ForegroundColor Cyan; Write-Host 'X-Content-Type-Options:' $response.Headers['X-Content-Type-Options'] -ForegroundColor Cyan"

echo.
echo ========================================
echo FASE 4 - RESULTADO FINAL
echo ========================================
pause