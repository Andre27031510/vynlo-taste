@echo off
echo Executando teste de carga robusto...
mvn clean compile
mvn gatling:test -Dgatling.simulationClass=com.vynlotaste.performance.RobustLoadTest
echo.
echo Relatorio em: target\gatling\
pause