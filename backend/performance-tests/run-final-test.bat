@echo off
echo Executando teste final...
mvn clean compile
mvn gatling:test -Dgatling.simulationClass=com.vynlotaste.performance.FinalLoadTest
echo.
echo Relatorio em: target\gatling\
pause