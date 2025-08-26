#!/bin/bash
set -e

echo "========================================"
echo "    VYNLO TASTE - DEPLOY ROBUSTO"
echo "========================================"

echo ""
echo "[1/3] Parando serviços atuais..."
docker compose -f docker-compose.prod.yml down || true

echo ""
echo "[2/3] Atualizando código do GitHub..."
git pull origin main

echo ""
echo "[3/3] Construindo e iniciando serviços..."
docker compose -f docker-compose.prod.yml up -d --build

echo ""
echo "Aguardando serviços ficarem prontos..."
sleep 60

echo ""
echo "Verificando saúde dos serviços..."
curl -f http://localhost:3000/ && echo "✓ Frontend OK"
curl -f http://localhost:8081/actuator/health && echo "✓ Backend OK"

echo ""
echo "Limpando recursos não utilizados..."
docker system prune -f

echo ""
echo "✓ Deploy robusto concluído!"
echo "Frontend: http://$(curl -s ifconfig.me):3000"
echo "Backend: http://$(curl -s ifconfig.me):8081"