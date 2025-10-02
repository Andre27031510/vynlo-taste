#!/bin/bash
set -e

echo "=== Limpeza de Disco - Sistema de Produção ==="

# Verificar espaço antes
echo "Espaço em disco ANTES da limpeza:"
df -h

# Limpar containers parados
echo "Removendo containers parados..."
docker container prune -f

# Limpar imagens não utilizadas
echo "Removendo imagens não utilizadas..."
docker image prune -a -f

# Limpar volumes não utilizados
echo "Removendo volumes não utilizados..."
docker volume prune -f

# Limpar networks não utilizadas
echo "Removendo networks não utilizadas..."
docker network prune -f

# Limpar cache do Docker
echo "Limpando cache do Docker..."
docker system prune -a -f

# Limpar logs antigos
echo "Limpando logs antigos..."
sudo find /var/log -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true
sudo find /var/log -name "*.gz" -type f -mtime +7 -delete 2>/dev/null || true

# Limpar cache do apt
echo "Limpando cache do apt..."
sudo apt-get clean
sudo apt-get autoclean
sudo apt-get autoremove -y

# Limpar arquivos temporários
echo "Limpando arquivos temporários..."
sudo rm -rf /tmp/* 2>/dev/null || true
sudo rm -rf /var/tmp/* 2>/dev/null || true

# Limpar logs do GitHub Actions
echo "Limpando logs do GitHub Actions..."
sudo find /home/ubuntu/actions-runner/_diag -name "*.log" -type f -mtime +1 -delete 2>/dev/null || true

# Verificar espaço depois
echo "Espaço em disco DEPOIS da limpeza:"
df -h

echo "=== Limpeza concluída ==="