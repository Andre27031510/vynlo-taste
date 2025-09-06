#!/bin/bash

echo "🔄 Iniciando rebuild completo do frontend..."

# Parar container se estiver rodando
echo "⏹️ Parando container..."
docker stop vynlo-frontend-prod 2>/dev/null || true

# Remover container
echo "🗑️ Removendo container..."
docker rm vynlo-frontend-prod 2>/dev/null || true

# Remover imagem antiga
echo "🗑️ Removendo imagem antiga..."
docker rmi vynlo-frontend-prod 2>/dev/null || true

# Limpar cache do Docker
echo "🧹 Limpando cache do Docker..."
docker system prune -f

# Rebuild da imagem
echo "🔨 Rebuilding imagem..."
cd ~/app/frontend
docker build --no-cache -t vynlo-frontend-prod .

# Iniciar novo container
echo "🚀 Iniciando novo container..."
docker run -d \
  --name vynlo-frontend-prod \
  -p 3000:3000 \
  --restart unless-stopped \
  vynlo-frontend-prod

# Aguardar inicialização
echo "⏳ Aguardando inicialização (60s)..."
sleep 60

# Verificar status
echo "✅ Verificando status..."
docker ps | grep vynlo-frontend-prod
docker logs vynlo-frontend-prod --tail 10

# Testar endpoints
echo "🧪 Testando endpoints..."
curl -I http://localhost:3000
echo ""
curl -I https://vynlotech.com
echo ""
curl -I https://taste.vynlotech.com

echo "✅ Rebuild completo!"