@echo off
echo ========================================
echo    VYNLO TASTE - DEPLOY ROBUSTO
echo ========================================

echo.
echo [1/4] Fazendo commit das mudancas...
git add .
git commit -m "feat: sistema robusto com multi-stage build e CI/CD otimizado"
git push origin main

echo.
echo [2/4] Conectando na AWS e atualizando codigo...
ssh -i "vynlo-taste-key.pem" ubuntu@ec2-18-191-175-78.us-east-2.compute.amazonaws.com "
    set -e
    echo 'Parando servicos...'
    cd /opt/vynlo
    docker compose -f docker-compose.prod.yml down || true
    
    echo 'Atualizando codigo do GitHub...'
    git pull origin main
    
    echo 'Fazendo backup do banco...'
    docker run --rm -v postgres_data:/data -v /opt/vynlo/backup:/backup postgres:15-alpine tar czf /backup/postgres-backup-$(date +%%Y%%m%%d-%%H%%M%%S).tar.gz -C /data .
    
    echo 'Construindo e iniciando servicos...'
    docker compose -f docker-compose.prod.yml up -d --build
    
    echo 'Aguardando servicos ficarem prontos...'
    sleep 60
    
    echo 'Verificando saude dos servicos...'
    curl -f http://localhost:3000/ || exit 1
    curl -f http://localhost:8081/actuator/health || exit 1
    
    echo 'Limpando recursos nao utilizados...'
    docker system prune -f
    
    echo 'Deploy concluido com sucesso!'
"

echo.
echo [3/4] Verificando status dos servicos...
ssh -i "vynlo-taste-key.pem" ubuntu@ec2-18-191-175-78.us-east-2.compute.amazonaws.com "
    cd /opt/vynlo
    docker compose -f docker-compose.prod.yml ps
    echo ''
    echo 'URLs de acesso:'
    echo 'Frontend: http://18.191.175.78:3000'
    echo 'Backend: http://18.191.175.78:8081'
    echo 'Grafana: http://18.191.175.78:3001'
    echo 'Prometheus: http://18.191.175.78:9090'
"

echo.
echo [4/4] Deploy robusto concluido!
echo Frontend: http://18.191.175.78:3000
echo Backend: http://18.191.175.78:8081
echo.
pause