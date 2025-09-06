@echo off
echo ========================================
echo    ATUALIZACAO RAPIDA AWS
echo ========================================

echo.
echo Conectando na AWS e atualizando...
ssh -i "vynlo-taste-key.pem" ubuntu@ec2-18-191-175-78.us-east-2.compute.amazonaws.com "
    set -e
    cd /opt/vynlo
    
    echo 'Parando servicos...'
    docker compose -f docker-compose.prod.yml down
    
    echo 'Atualizando codigo...'
    git pull origin main
    
    echo 'Reconstruindo e iniciando...'
    docker compose -f docker-compose.prod.yml up -d --build
    
    echo 'Aguardando 60s...'
    sleep 60
    
    echo 'Testando servicos...'
    curl -f http://localhost:3000/ && echo 'Frontend OK'
    curl -f http://localhost:8081/actuator/health && echo 'Backend OK'
    
    docker system prune -f
    echo 'Atualizacao concluida!'
"

echo.
echo Sistema atualizado!
echo Frontend: http://18.191.175.78:3000
echo Backend: http://18.191.175.78:8081
pause