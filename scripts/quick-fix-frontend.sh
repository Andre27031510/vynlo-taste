#!/bin/bash

echo "🚀 Quick fix para frontend..."

# Parar e remover container atual
docker stop vynlo-frontend-prod && docker rm vynlo-frontend-prod

# Rebuild apenas se necessário
if ! docker images | grep -q vynlo-frontend-prod; then
    echo "🔨 Rebuilding imagem..."
    cd ~/app/frontend
    docker build -t vynlo-frontend-prod .
fi

# Iniciar com configuração otimizada
docker run -d \
  --name vynlo-frontend-prod \
  -p 3000:3000 \
  --restart unless-stopped \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  vynlo-frontend-prod

echo "✅ Frontend reiniciado!"