#!/bin/bash
# Limpeza URGENTE de disco - Servidor sem espaço
# Created: 2025-10-17 12:15 UTC
# Fix: "no space left on device"

echo "=== LIMPEZA URGENTE DE DISCO ==="
echo "Problema: Deploy falhou por falta de espaço"
echo "Solução: Remover dados desnecessários"
echo ""

# 1. Ver uso de disco ANTES
echo "📊 Uso de disco ANTES da limpeza:"
df -h / | grep -v Filesystem
echo ""

# 2. Limpar imagens Docker antigas
echo "🗑️ Removendo imagens Docker antigas..."
docker image prune -a -f --filter "until=72h"
echo ""

# 3. Limpar containers parados
echo "🗑️ Removendo containers parados..."
docker container prune -f
echo ""

# 4. Limpar volumes não usados
echo "🗑️ Removendo volumes Docker não usados..."
docker volume prune -f
echo ""

# 5. Limpar build cache Docker
echo "🗑️ Removendo cache de build Docker..."
docker builder prune -a -f
echo ""

# 6. Limpar logs do sistema
echo "🗑️ Limpando logs antigos do sistema..."
sudo journalctl --vacuum-time=3d 2>/dev/null || echo "⚠️ journalctl não disponível"
echo ""

# 7. Limpar apt cache (se Ubuntu/Debian)
echo "🗑️ Limpando apt cache..."
sudo apt-get clean 2>/dev/null || echo "⚠️ apt-get não disponível"
sudo apt-get autoclean 2>/dev/null || true
sudo apt-get autoremove -y 2>/dev/null || true
echo ""

# 8. Limpar /tmp
echo "🗑️ Limpando arquivos temporários..."
sudo rm -rf /tmp/* 2>/dev/null || echo "⚠️ Alguns arquivos em /tmp estão em uso"
echo ""

# 9. Limpar logs Docker
echo "🗑️ Truncando logs Docker (mantém últimos 100MB)..."
sudo sh -c 'truncate -s 100M /var/lib/docker/containers/*/*-json.log' 2>/dev/null || echo "⚠️ Não foi possível truncar logs"
echo ""

# 10. Ver uso de disco DEPOIS
echo "📊 Uso de disco DEPOIS da limpeza:"
df -h / | grep -v Filesystem
echo ""

# 11. Ver espaço liberado por serviço
echo "📊 Espaço usado por Docker:"
docker system df
echo ""

echo "✅ Limpeza concluída!"
echo ""
echo "🔄 Próximo passo: Executar deploy novamente"
echo "   cd ~/app && git pull && docker-compose -f docker-compose.prod.yml up -d --build"

