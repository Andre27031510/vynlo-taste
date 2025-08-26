@echo off
echo Executando teste de stress...
mvn clean compile
mvn gatling:test -Dgatling.simulationClass=com.vynlotaste.performance.StressTestRobust
echo.
echo Relatorio em: target\gatling\
pause