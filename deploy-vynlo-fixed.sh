#!/bin/bash

# 🚀 Script de Deploy Vynlo Taste - Versão Corrigida
# Mantém a originalidade do sistema com ajustes de conectividade

echo "🎯 INICIANDO DEPLOY VYNLO TASTE - VERSÃO CORRIGIDA"
echo "=================================================="

# Limpar containers antigos
echo "🧹 Limpando containers antigos..."
docker rm -f vynlo-backend-prod vynlo-backend-final vynlo-backend-simple 2>/dev/null || true

# Construir nova imagem do backend com as correções
echo "🔨 Construindo backend com configurações corrigidas..."
cd /home/ubuntu/vynlo
docker compose -f docker-compose.prod.yml build backend

# Verificar se PostgreSQL está funcionando
echo "🔍 Verificando PostgreSQL..."
if ! docker ps | grep -q vynlo-postgres-prod; then
    echo "⚠️  PostgreSQL não está rodando, iniciando..."
    docker compose -f docker-compose.prod.yml -f docker-compose.prod.override.yml up -d postgres
    sleep 10
fi

# Verificar se Redis está funcionando
echo "🔍 Verificando Redis..."
if ! docker ps | grep -q vynlo-redis-prod; then
    echo "⚠️  Redis não está rodando, iniciando..."
    docker compose -f docker-compose.prod.yml -f docker-compose.prod.override.yml up -d redis
    sleep 5
fi

# Criar banco de dados se não existir
echo "🗄️  Preparando banco de dados..."
docker exec vynlo-postgres-prod psql -U postgres -c "CREATE DATABASE vynlo_taste;" 2>/dev/null || echo "Banco já existe"

# Iniciar backend com configurações otimizadas
echo "🚀 Iniciando backend Vynlo Taste..."
docker run -d \
  --name vynlo-backend-prod \
  --network vynlo_vynlo-network \
  -p 8082:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e DB_HOST=vynlo-postgres-prod \
  -e DB_PORT=5432 \
  -e DB_NAME=vynlo_taste \
  -e DB_USER=postgres \
  -e DB_PASSWORD=96043020 \
  -e REDIS_HOST=vynlo-redis-prod \
  -e REDIS_PORT=6379 \
  -e SPRING_FLYWAY_ENABLED=false \
  -e SPRING_MAIN_ALLOW_BEAN_DEFINITION_OVERRIDING=true \
  -e FIREBASE_PROJECT_ID=vynlo-sistema \
  -e JWT_SECRET=vynloTasteSecretKey2024EnterpriseSystem \
  -e JWT_EXPIRATION=86400000 \
  vynlo-backend

# Aguardar inicialização
echo "⏳ Aguardando inicialização do backend..."
for i in {1..12}; do
    if curl -f http://localhost:8082/actuator/health >/dev/null 2>&1; then
        echo "🎉 BACKEND VYNLO TASTE FUNCIONANDO!"
        break
    fi
    echo "   Tentativa $i/12 - aguardando..."
    sleep 10
done

# Verificar status final
echo ""
echo "📊 STATUS FINAL DO SISTEMA:"
echo "=========================="
echo "✅ PostgreSQL: $(docker ps | grep postgres | wc -l) container(s)"
echo "✅ Redis: $(docker ps | grep redis | wc -l) container(s)"
echo "✅ Backend: $(docker ps | grep vynlo-backend-prod | wc -l) container(s)"

# Teste final
if curl -f http://localhost:8082/actuator/health >/dev/null 2>&1; then
    echo ""
    echo "🎉🎉🎉 VYNLO TASTE DEPLOY CONCLUÍDO COM SUCESSO! 🎉🎉🎉"
    echo "🌐 Backend: http://localhost:8082"
    echo "🔍 Health Check: http://localhost:8082/actuator/health"
    echo "📊 Métricas: http://localhost:8082/actuator/info"
else
    echo ""
    echo "❌ Backend ainda não está respondendo"
    echo "📋 Logs do backend:"
    docker logs vynlo-backend-prod --tail=20
fi

echo ""
echo "🏁 Deploy finalizado!"