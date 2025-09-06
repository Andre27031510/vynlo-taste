#!/bin/bash
set -e

echo "========================================"
echo "    ATUALIZAÇÃO RÁPIDA"
echo "========================================"

echo "Parando serviços..."
docker compose -f docker-compose.prod.yml down

echo "Atualizando código..."
git pull origin main

echo "Reconstruindo..."
docker compose -f docker-compose.prod.yml up -d --build

echo "Aguardando 30s..."
sleep 30

echo "Testando..."
curl -f http://localhost:3000/ && echo "✓ Frontend OK"
curl -f http://localhost:8081/actuator/health && echo "✓ Backend OK"

docker system prune -f
echo "✓ Atualização concluída!"