#!/bin/bash
echo "========================================="
echo "  CONFIGURANDO SERVIDOR VYNLO TASTE"
echo "========================================="

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Docker
echo "🐳 Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker

# Instalar Docker Compose
echo "🔧 Instalando Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar Node.js
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Java
echo "☕ Instalando Java..."
sudo apt install -y openjdk-17-jdk

# Instalar Maven
echo "🔨 Instalando Maven..."
sudo apt install -y maven

# Criar diretório do projeto
echo "📁 Criando estrutura de diretórios..."
sudo mkdir -p /opt/vynlo
sudo chown ubuntu:ubuntu /opt/vynlo
cd /opt/vynlo

# Instalar utilitários
echo "🛠️ Instalando utilitários..."
sudo apt install -y git curl wget htop

# Configurar firewall (ALB gerencia 80/443)
echo "🛡️ Configurando firewall..."
sudo ufw allow ssh
sudo ufw allow 3000
sudo ufw allow 8080
sudo ufw --force enable

echo "✅ Servidor configurado com sucesso!"
echo ""
echo "🔧 Softwares instalados:"
echo "  ✅ Docker & Docker Compose"
echo "  ✅ Node.js 18"
echo "  ✅ Java 17"
echo "  ✅ Maven"
echo "  ✅ Git"
echo ""
echo "🌐 Arquitetura: ALB → Containers (sem NGINX)"
echo ""
echo "📁 Diretório do projeto: /opt/vynlo"
echo "🌐 IP público: $(curl -s http://checkip.amazonaws.com)"
echo ""
echo "🚀 Próximos passos:"
echo "  1. Clone o repositório em /opt/vynlo"
echo "  2. Configure as variáveis de ambiente"
echo "  3. Execute docker-compose up -d"