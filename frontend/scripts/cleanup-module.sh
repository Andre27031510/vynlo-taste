#!/usr/bin/env bash
# Script para limpar warnings ESLint de um módulo específico
# Uso: ./scripts/cleanup-module.sh src/components/dashboard

set -euo pipefail

MODULE="${1:-}"
if [ -z "$MODULE" ]; then
  echo "❌ Erro: Módulo não especificado"
  echo ""
  echo "Uso: ./scripts/cleanup-module.sh <caminho-do-módulo>"
  echo ""
  echo "Exemplos:"
  echo "  ./scripts/cleanup-module.sh src/components/dashboard"
  echo "  ./scripts/cleanup-module.sh src/app/blog"
  echo "  ./scripts/cleanup-module.sh src/hooks"
  exit 1
fi

if [ ! -d "$MODULE" ] && [ ! -f "$MODULE" ]; then
  echo "❌ Erro: Caminho não encontrado: $MODULE"
  exit 1
fi

echo "🧹 Limpando módulo: $MODULE"
echo ""

# Passo 1: Correção automática
echo "1️⃣  Executando correção automática..."
if npx eslint "$MODULE" --ext .ts,.tsx,.js,.jsx --fix; then
  echo "   ✅ Correção automática concluída"
else
  echo "   ⚠️  Alguns problemas não puderam ser corrigidos automaticamente"
fi

echo ""

# Passo 2: Contar warnings restantes
echo "2️⃣  Verificando warnings restantes..."
WARNINGS=$(npx eslint "$MODULE" --ext .ts,.tsx,.js,.jsx --format=compact 2>&1 | grep -c "warning" || echo "0")
ERRORS=$(npx eslint "$MODULE" --ext .ts,.tsx,.js,.jsx --format=compact 2>&1 | grep -c "error" || echo "0")

echo "   Warnings: $WARNINGS"
echo "   Errors: $ERRORS"
echo ""

# Passo 3: Status final
if [ "$ERRORS" -gt "0" ]; then
  echo "❌ Módulo tem $ERRORS erros críticos que precisam ser corrigidos"
  exit 1
elif [ "$WARNINGS" -eq "0" ]; then
  echo "✅ Módulo completamente limpo! (0 warnings, 0 errors)"
  exit 0
else
  echo "⚠️  Módulo tem $WARNINGS warnings restantes"
  echo "   Revisar manualmente ou continuar com outros módulos"
  exit 0
fi

