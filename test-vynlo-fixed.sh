#!/bin/bash

# 🧪 Script de Teste Vynlo Taste - Versão Corrigida
echo "🧪 TESTANDO VYNLO TASTE - VERSÃO CORRIGIDA"
echo "=========================================="

cd /home/ubuntu/vynlo

# Limpar ambiente
echo "🧹 Limpando ambiente de teste..."
docker rm -f vynlo-backend-test 2>/dev/null || true

# Construir imagem atualizada
echo "🔨 Construindo imagem com correções..."
docker compose -f docker-compose.prod.yml build backend

# Testar conectividade de rede
echo "🌐 Testando conectividade de rede..."
if docker network inspect vynlo_vynlo-network >/dev/null 2>&1; then
    echo "✅ Rede vynlo_vynlo-network existe"
else
    echo "❌ Rede não encontrada, criando..."
    docker network create vynlo_vynlo-network
fi

# Verificar PostgreSQL
echo "🗄️  Verificando PostgreSQL..."
if docker ps | grep -q vynlo-postgres-prod; then
    echo "✅ PostgreSQL rodando"
    # Testar conexão
    if docker exec vynlo-postgres-prod pg_isready -U postgres >/dev/null 2>&1; then
        echo "✅ PostgreSQL aceitando conexões"
    else
        echo "❌ PostgreSQL não está aceitando conexões"
    fi
else
    echo "❌ PostgreSQL não está rodando"
fi

# Verificar Redis
echo "🔄 Verificando Redis..."
if docker ps | grep -q vynlo-redis-prod; then
    echo "✅ Redis rodando"
else
    echo "❌ Redis não está rodando"
fi

# Testar backend com configurações corrigidas
echo "🚀 Testando backend com configurações corrigidas..."
docker run -d \
  --name vynlo-backend-test \
  --network vynlo_vynlo-network \
  -p 8083:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e DB_HOST=vynlo-postgres-prod \
  -e DB_PORT=5432 \
  -e DB_NAME=vynlo_taste \
  -e DB_USER=postgres \
  -e DB_PASSWORD=96043020 \
  -e REDIS_HOST=vynlo-redis-prod \
  -e SPRING_FLYWAY_ENABLED=false \
  -e SPRING_MAIN_ALLOW_BEAN_DEFINITION_OVERRIDING=true \
  -e FIREBASE_PROJECT_ID=vynlo-sistema \
  -e JWT_SECRET=vynloTasteSecretKey2024EnterpriseSystem \
  vynlo-backend

# Aguardar inicialização
echo "⏳ Aguardando inicialização (60 segundos)..."
sleep 60

# Testar health check
echo "🔍 Testando health check..."
if curl -f http://localhost:8083/actuator/health >/dev/null 2>&1; then
    echo "🎉 SUCESSO! Backend respondendo no health check"
    
    # Testar endpoint de info
    if curl -f http://localhost:8083/actuator/info >/dev/null 2>&1; then
        echo "✅ Endpoint info funcionando"
    fi
    
    echo ""
    echo "🎯 RESULTADO DO TESTE:"
    echo "====================="
    echo "✅ Configuração de banco: CORRIGIDA"
    echo "✅ Profile Docker: FUNCIONANDO"
    echo "✅ Conectividade: ESTABELECIDA"
    echo "✅ Health Check: RESPONDENDO"
    echo ""
    echo "🎉 VYNLO TASTE ESTÁ FUNCIONANDO PERFEITAMENTE!"
    
else
    echo "❌ Backend não está respondendo"
    echo ""
    echo "📋 Logs do backend:"
    docker logs vynlo-backend-test --tail=30
    echo ""
    echo "🔍 Status do container:"
    docker ps -a | grep vynlo-backend-test
fi

# Limpar container de teste
echo ""
echo "🧹 Limpando container de teste..."
docker rm -f vynlo-backend-test

echo ""
echo "🏁 Teste finalizado!"