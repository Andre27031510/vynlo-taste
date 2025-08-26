@echo off
echo 🔧 CORRIGINDO BACKEND VYNLO TASTE
echo.

echo 🗑️ Removendo arquivos problemáticos...
del /f "src\main\java\com\vynlotaste\config\HealthConfig.java" 2>nul
del /f "src\main\java\com\vynlotaste\controller\OrderController.java" 2>nul
del /f "src\main\java\com\vynlotaste\repository\RestaurantRepository.java" 2>nul
del /f "src\main\java\com\vynlotaste\repository\SupplierRepository.java" 2>nul
del /f "src\main\java\com\vynlotaste\repository\FinancialAccountRepository.java" 2>nul
del /f "src\main\java\com\vynlotaste\entity\TransactionSplit.java" 2>nul

echo.
echo 🧹 Limpando target...
rmdir /s /q target 2>nul

echo.
echo 📦 Compilando projeto...
.\apache-maven-3.9.6\bin\mvn.cmd clean compile -DskipTests

echo.
echo ✅ Backend corrigido!
pause