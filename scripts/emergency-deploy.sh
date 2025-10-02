#!/bin/bash
set -e

echo "=== Deploy de Emergência - Limpeza + Deploy ==="

# Executar limpeza primeiro
./cleanup-disk.sh

# Aguardar um pouco
sleep 5

# Executar deploy normal
echo "Iniciando deploy após limpeza..."
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

echo "=== Deploy de emergência concluído ==="