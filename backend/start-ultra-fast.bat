@echo off
echo ========================================
echo  VYNLO TASTE - STARTUP ULTRA RAPIDO
echo ========================================

echo [1/3] Limpando target...
if exist target rmdir /s /q target

echo [2/3] Build rapido sem testes...
call mvn clean package -DskipTests -q

echo [3/3] Iniciando com JVM ultra-otimizada...
java -server ^
     -Xms256m ^
     -Xmx1g ^
     -XX:+UseG1GC ^
     -XX:+UseStringDeduplication ^
     -XX:+DisableExplicitGC ^
     -Dspring.profiles.active=dev ^
     -Dspring.jpa.show-sql=false ^
     -Dlogging.level.root=ERROR ^
     -Dspring.cloud.config.enabled=false ^
     -Dspring.cloud.discovery.enabled=false ^
     -jar target/vynlo-taste-backend-1.0.0.jar

pause