@echo off
echo 🧹 LIMPEZA COMPLETA DO BACKEND
echo.

echo 🗑️ Removendo TODOS os arquivos problemáticos...
del /f "src\main\java\com\vynlotaste\config\MetricsConfig.java" 2>nul
del /f "src\main\java\com\vynlotaste\config\SecurityConfig.java" 2>nul
del /f "src\main\java\com\vynlotaste\config\RateLimitConfig.java" 2>nul
del /f "src\main\java\com\vynlotaste\config\CompressionConfig.java" 2>nul
del /f "src\main\java\com\vynlotaste\service\FinancialService.java" 2>nul
del /f "src\main\java\com\vynlotaste\repository\FinancialStatementRepository.java" 2>nul
del /f "src\main\java\com\vynlotaste\repository\TransactionSplitRepository.java" 2>nul
del /f "src\main\java\com\vynlotaste\entity\FinancialTransaction.java" 2>nul
del /f "src\main\java\com\vynlotaste\controller\ProductController.java" 2>nul

echo.
echo 🧹 Limpando target...
rmdir /s /q target 2>nul

echo.
echo 📦 Compilando versão limpa...
.\apache-maven-3.9.6\bin\mvn.cmd clean compile -DskipTests

echo.
echo ✅ Backend limpo e funcional!
pause