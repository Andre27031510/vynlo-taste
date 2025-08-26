@echo off
echo =============================================================================
echo                    🚀 VYNLOTASTE BACKEND - DESENVOLVIMENTO
echo =============================================================================
echo.

echo 🔍 Verificando Java...
java -version
if %errorlevel% neq 0 (
    echo ❌ Java não encontrado! Instale Java 17+ e tente novamente.
    pause
    exit /b 1
)

echo.
echo 🔍 Verificando Maven...
mvn -version
if %errorlevel% neq 0 (
    echo ❌ Maven não encontrado! Instale Maven 3.8+ e tente novamente.
    pause
    exit /b 1
)

echo.
echo 🗄️ Verificando PostgreSQL...
echo Tente conectar ao banco: psql -h localhost -U postgres -d vynlo_taste
echo Se não conseguir, crie o banco: CREATE DATABASE vynlo_taste;

echo.
echo 🚀 Iniciando aplicação Spring Boot...
echo Profile: dev
echo Porta: 8080
echo Context: /api
echo.

echo 📚 Endpoints disponíveis após inicialização:
echo - API Docs: http://localhost:8080/api/swagger-ui.html
echo - Health Check: http://localhost:8080/api/actuator/health
echo - Metrics: http://localhost:8080/api/actuator/metrics
echo.

echo ⏳ Aguarde a inicialização...
echo.

mvn spring-boot:run -Dspring.profiles.active=dev

pause
