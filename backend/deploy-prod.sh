#!/bin/bash

# ========================================
# VYNLO TASTE - SCRIPT DE DEPLOY PRODUÇÃO
# ========================================
# Este script automatiza o deploy em produção

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Configurações
APP_NAME="vynlo-taste"
JAR_FILE="target/vynlo-taste-0.0.1-SNAPSHOT.jar"
SERVICE_NAME="vynlo-taste"
BACKUP_DIR="backups"
LOG_DIR="logs"

# Verificar se está rodando como root
if [[ $EUID -eq 0 ]]; then
   error "Este script não deve ser executado como root"
   exit 1
fi

# Verificar dependências
check_dependencies() {
    log "Verificando dependências..."
    
    if ! command -v java &> /dev/null; then
        error "Java não está instalado"
        exit 1
    fi
    
    if ! command -v mvn &> /dev/null; then
        error "Maven não está instalado"
        exit 1
    fi
    
    if ! command -v systemctl &> /dev/null; then
        error "Systemd não está disponível"
        exit 1
    fi
    
    log "Dependências verificadas com sucesso"
}

# Backup do banco de dados
backup_database() {
    log "Realizando backup do banco de dados..."
    
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
    fi
    
    BACKUP_FILE="$BACKUP_DIR/vynlotaste_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    # Verificar se as variáveis de ambiente estão configuradas
    if [ -z "$DATABASE_URL" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
        warn "Variáveis de banco de dados não configuradas, pulando backup"
        return
    fi
    
    # Extrair informações do banco
    DB_HOST=$(echo $DATABASE_URL | sed 's/.*:\/\/\([^:]*\).*/\1/')
    DB_PORT=$(echo $DATABASE_URL | sed 's/.*:\/\/[^:]*:\([0-9]*\).*/\1/')
    DB_NAME=$(echo $DATABASE_URL | sed 's/.*\///')
    
    if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE" 2>/dev/null; then
        log "Backup realizado com sucesso: $BACKUP_FILE"
    else
        warn "Falha no backup do banco de dados"
    fi
}

# Compilar o projeto
build_project() {
    log "Compilando o projeto..."
    
    # Limpar e compilar
    mvn clean package -DskipTests -Pprod
    
    if [ ! -f "$JAR_FILE" ]; then
        error "Falha na compilação do projeto"
        exit 1
    fi
    
    log "Projeto compilado com sucesso"
}

# Parar o serviço atual
stop_service() {
    log "Parando o serviço atual..."
    
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        systemctl stop "$SERVICE_NAME"
        sleep 5
        log "Serviço parado com sucesso"
    else
        log "Serviço não estava rodando"
    fi
}

# Fazer backup do JAR atual
backup_current_jar() {
    if [ -f "/opt/$SERVICE_NAME/$SERVICE_NAME.jar" ]; then
        log "Fazendo backup do JAR atual..."
        cp "/opt/$SERVICE_NAME/$SERVICE_NAME.jar" "/opt/$SERVICE_NAME/$SERVICE_NAME.jar.backup.$(date +%Y%m%d_%H%M%S)"
    fi
}

# Deploy do novo JAR
deploy_jar() {
    log "Fazendo deploy do novo JAR..."
    
    # Criar diretório se não existir
    sudo mkdir -p "/opt/$SERVICE_NAME"
    
    # Copiar novo JAR
    sudo cp "$JAR_FILE" "/opt/$SERVICE_NAME/$SERVICE_NAME.jar"
    
    # Definir permissões
    sudo chown $USER:$USER "/opt/$SERVICE_NAME/$SERVICE_NAME.jar"
    sudo chmod 755 "/opt/$SERVICE_NAME/$SERVICE_NAME.jar"
    
    log "JAR deployado com sucesso"
}

# Configurar systemd service
setup_systemd_service() {
    log "Configurando serviço systemd..."
    
    SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME.service"
    
    # Criar arquivo de serviço
    sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Vynlo Taste Backend
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=$USER
Group=$USER
WorkingDirectory=/opt/$SERVICE_NAME
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod $SERVICE_NAME.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME

# Configurações de segurança
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/$SERVICE_NAME/logs /opt/$SERVICE_NAME/backups

# Configurações de recursos
MemoryMax=2G
CPUQuota=200%

# Configurações de ambiente
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="JAVA_OPTS=-Xms512m -Xmx2g -XX:+UseG1GC -XX:+UseStringDeduplication"

[Install]
WantedBy=multi-user.target
EOF

    # Recarregar systemd
    sudo systemctl daemon-reload
    sudo systemctl enable "$SERVICE_NAME"
    
    log "Serviço systemd configurado"
}

# Iniciar o serviço
start_service() {
    log "Iniciando o serviço..."
    
    sudo systemctl start "$SERVICE_NAME"
    sleep 10
    
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        log "Serviço iniciado com sucesso"
    else
        error "Falha ao iniciar o serviço"
        sudo systemctl status "$SERVICE_NAME"
        exit 1
    fi
}

# Verificar saúde do serviço
check_health() {
    log "Verificando saúde do serviço..."
    
    # Aguardar o serviço estar pronto
    for i in {1..30}; do
        if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
            log "Serviço está saudável e respondendo"
            return 0
        fi
        sleep 2
    done
    
    error "Serviço não está respondendo após 60 segundos"
    sudo systemctl status "$SERVICE_NAME"
    exit 1
}

# Limpeza de arquivos temporários
cleanup() {
    log "Limpando arquivos temporários..."
    
    # Remover JARs antigos (manter apenas os últimos 3)
    if [ -d "/opt/$SERVICE_NAME" ]; then
        cd "/opt/$SERVICE_NAME"
        ls -t *.jar.backup.* | tail -n +4 | xargs -r rm
    fi
    
    log "Limpeza concluída"
}

# Função principal
main() {
    log "Iniciando deploy de produção do $APP_NAME"
    
    check_dependencies
    backup_database
    build_project
    stop_service
    backup_current_jar
    deploy_jar
    setup_systemd_service
    start_service
    check_health
    cleanup
    
    log "Deploy concluído com sucesso!"
    log "Serviço disponível em: http://localhost:8080"
    log "Health check: http://localhost:8080/actuator/health"
    log "Métricas: http://localhost:8080/actuator/metrics"
}

# Executar função principal
main "$@"


