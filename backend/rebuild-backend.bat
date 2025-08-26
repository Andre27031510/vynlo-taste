@echo off
echo 🔧 RECONSTRUINDO BACKEND COMPLETO
echo.

echo 🗑️ Removendo TODOS os arquivos problemáticos...
del /f /q "src\main\java\com\vynlotaste\repository\UserPermissionRepository.java" 2>nul
del /f /q "src\main\java\com\vynlotaste\entity\FinancialTransaction.java" 2>nul
del /f /q "src\main\java\com\vynlotaste\entity\FinancialAccount.java" 2>nul
del /f /q "src\main\java\com\vynlotaste\entity\Supplier.java" 2>nul
del /f /q "src\main\java\com\vynlotaste\repository\FinancialTransactionRepository.java" 2>nul
del /f /q "src\main\java\com\vynlotaste\repository\MenuRepository.java" 2>nul
del /f /q "src\main\java\com\vynlotaste\controller\FinancialController.java" 2>nul
del /f /q "src\main\java\com\vynlotaste\controller\PaymentWebhookController.java" 2>nul
del /f /q "src\main\java\com\vynlotaste\service\ProductService.java" 2>nul
del /f /q "src\main\java\com\vynlotaste\entity\Category.java" 2>nul

echo.
echo 🧹 Limpando target...
rmdir /s /q target 2>nul

echo.
echo 📦 Compilando backend limpo...
.\apache-maven-3.9.6\bin\mvn.cmd clean compile -DskipTests

echo.
echo ✅ Backend reconstruído!
pause