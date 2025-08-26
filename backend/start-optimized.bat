@echo off
echo ========================================
echo  VYNLO TASTE - STARTUP OTIMIZADO
echo ========================================

echo [1/4] Verificando Java...
java -version
if %errorlevel% neq 0 (
    echo ERRO: Java nao encontrado!
    pause
    exit /b 1
)

echo [2/4] Limpando cache Maven...
call mvn clean -q

echo [3/4] Compilando com otimizacoes...
call mvn compile -q -Dmaven.test.skip=true

echo [4/4] Iniciando aplicacao com JVM otimizada...
java -server ^
     -Xms512m ^
     -Xmx2g ^
     -XX:+UseG1GC ^
     -XX:+UseStringDeduplication ^
     -XX:+OptimizeStringConcat ^
     -Dspring.profiles.active=dev ^
     -Dspring.jpa.show-sql=false ^
     -Dlogging.level.org.springframework.security=WARN ^
     -jar target/vynlo-taste-backend-1.0.0.jar

pause