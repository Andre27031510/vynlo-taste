#!/usr/bin/env bash
# Script para gerar relatório completo de ESLint
# Uso: ./scripts/generate-lint-report.sh

set -euo pipefail

REPORT_DIR="tmp"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
JSON_REPORT="$REPORT_DIR/eslint-$TIMESTAMP.json"
SUMMARY_REPORT="$REPORT_DIR/eslint-summary-$TIMESTAMP.txt"

mkdir -p "$REPORT_DIR"

echo "📊 Gerando relatório ESLint completo..."
echo ""

# Gerar relatório JSON
echo "1️⃣  Gerando relatório JSON..."
npm run lint -- --format=json > "$JSON_REPORT" 2>&1 || true

# Contar problemas
if command -v jq &> /dev/null; then
  TOTAL=$(jq 'length' "$JSON_REPORT" 2>/dev/null || echo "0")
  WARNINGS=$(jq '[.[] | select(.severity == 1)] | length' "$JSON_REPORT" 2>/dev/null || echo "0")
  ERRORS=$(jq '[.[] | select(.severity == 2)] | length' "$JSON_REPORT" 2>/dev/null || echo "0")
  
  echo "   ✅ Relatório JSON gerado: $JSON_REPORT"
  echo ""
  echo "📈 Estatísticas:"
  echo "   Total de problemas: $TOTAL"
  echo "   Warnings: $WARNINGS"
  echo "   Errors: $ERRORS"
  echo ""
  
  # Top 10 arquivos com mais problemas
  echo "📋 Top 10 arquivos com mais problemas:"
  jq -r 'group_by(.filePath) | map({file: .[0].filePath, count: length}) | sort_by(.count) | reverse | .[0:10] | .[] | "\(.count)\t\(.file)"' "$JSON_REPORT" 2>/dev/null || echo "   (jq não disponível para análise detalhada)"
else
  echo "   ⚠️  jq não está instalado - relatório JSON gerado mas sem análise"
  echo "   Instalar: sudo apt-get install jq (Linux) ou brew install jq (macOS)"
fi

echo ""

# Gerar resumo legível
echo "2️⃣  Gerando resumo legível..."
npx eslint . --ext .ts,.tsx,.js,.jsx --format=table > "$SUMMARY_REPORT" 2>&1 || true
echo "   ✅ Resumo gerado: $SUMMARY_REPORT"
echo ""

echo "✅ Relatórios gerados em: $REPORT_DIR/"
echo "   - JSON: $JSON_REPORT"
echo "   - Resumo: $SUMMARY_REPORT"

