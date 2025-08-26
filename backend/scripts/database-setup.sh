#!/bin/bash

# =============================================================================
# SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS - VYNLOTASTE
# Sistema de Delivery Empresarial com PostgreSQL
# =============================================================================

set -e

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
DB_NAME="vynlo_taste"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_HOST="localhost"
DB_PORT="5432"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Função para verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error "Docker não está rodando. Por favor, inicie o Docker e tente novamente."
        exit 1
    fi
    log "Docker está rodando"
}

# Função para verificar se Docker Compose está disponível
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose não está disponível. Por favor, instale o Docker Compose."
        exit 1
    fi
    log "Docker Compose está disponível"
}

# Função para iniciar serviços
start_services() {
    log "Iniciando serviços do banco de dados..."
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    else
        docker compose -f "$DOCKER_COMPOSE_FILE" up -d
    fi
    
    log "Serviços iniciados com sucesso!"
}

# Função para parar serviços
stop_services() {
    log "Parando serviços do banco de dados..."
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$DOCKER_COMPOSE_FILE" down
    else
        docker compose -f "$DOCKER_COMPOSE_FILE" down
    fi
    
    log "Serviços parados com sucesso!"
}

# Função para verificar status dos serviços
check_status() {
    log "Verificando status dos serviços..."
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$DOCKER_COMPOSE_FILE" ps
    else
        docker compose -f "$DOCKER_COMPOSE_FILE" ps
    fi
}

# Função para verificar logs
show_logs() {
    local service=${1:-"postgres"}
    log "Mostrando logs do serviço: $service"
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f "$service"
    else
        docker compose -f "$DOCKER_COMPOSE_FILE" logs -f "$service"
    fi
}

# Função para fazer backup
backup_database() {
    local backup_dir="./database/backups"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="${backup_dir}/vynlo_taste_backup_${timestamp}.sql"
    
    log "Fazendo backup do banco de dados..."
    
    # Criar diretório de backup se não existir
    mkdir -p "$backup_dir"
    
    # Fazer backup
    docker exec vynlotaste-postgres pg_dump -U "$DB_USER" -d "$DB_NAME" > "$backup_file"
    
    if [ $? -eq 0 ]; then
        log "Backup criado com sucesso: $backup_file"
    else
        error "Erro ao criar backup"
        exit 1
    fi
}

# Função para restaurar backup
restore_database() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        error "Por favor, especifique o arquivo de backup para restaurar"
        echo "Uso: $0 restore <arquivo_backup>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        error "Arquivo de backup não encontrado: $backup_file"
        exit 1
    fi
    
    log "Restaurando banco de dados do backup: $backup_file"
    
    # Restaurar backup
    docker exec -i vynlotaste-postgres psql -U "$DB_USER" -d "$DB_NAME" < "$backup_file"
    
    if [ $? -eq 0 ]; then
        log "Backup restaurado com sucesso!"
    else
        error "Erro ao restaurar backup"
        exit 1
    fi
}

# Função para conectar ao banco
connect_database() {
    log "Conectando ao banco de dados..."
    docker exec -it vynlotaste-postgres psql -U "$DB_USER" -d "$DB_NAME"
}

# Função para executar migrações Flyway
run_migrations() {
    log "Executando migrações Flyway..."
    
    # Verificar se o Spring Boot está rodando
    if ! curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        warn "Spring Boot não está rodando. Iniciando aplicação..."
        # Aqui você pode adicionar comando para iniciar a aplicação Spring Boot
    fi
    
    log "Migrações Flyway serão executadas automaticamente quando a aplicação iniciar"
}

# Função para limpar dados
clean_database() {
    warn "ATENÇÃO: Esta operação irá remover todos os dados do banco!"
    read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Limpando banco de dados..."
        
        # Parar serviços
        stop_services
        
        # Remover volumes
        if command -v docker-compose &> /dev/null; then
            docker-compose -f "$DOCKER_COMPOSE_FILE" down -v
        else
            docker compose -f "$DOCKER_COMPOSE_FILE" down -v
        fi
        
        # Iniciar serviços novamente
        start_services
        
        log "Banco de dados limpo com sucesso!"
    else
        log "Operação cancelada"
    fi
}

# Função para mostrar ajuda
show_help() {
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start       - Iniciar serviços do banco de dados"
    echo "  stop        - Parar serviços do banco de dados"
    echo "  restart     - Reiniciar serviços do banco de dados"
    echo "  status      - Verificar status dos serviços"
    echo "  logs        - Mostrar logs dos serviços"
    echo "  backup      - Fazer backup do banco de dados"
    echo "  restore     - Restaurar backup do banco de dados"
    echo "  connect     - Conectar ao banco de dados"
    echo "  migrate     - Executar migrações Flyway"
    echo "  clean       - Limpar banco de dados (ATENÇÃO: remove todos os dados)"
    echo "  help        - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 start                    # Iniciar serviços"
    echo "  $0 backup                   # Fazer backup"
    echo "  $0 restore backup.sql       # Restaurar backup"
    echo "  $0 logs postgres            # Ver logs do PostgreSQL"
}

# Função principal
main() {
    case "${1:-help}" in
        start)
            check_docker
            check_docker_compose
            start_services
            ;;
        stop)
            check_docker
            check_docker_compose
            stop_services
            ;;
        restart)
            check_docker
            check_docker_compose
            stop_services
            sleep 2
            start_services
            ;;
        status)
            check_docker
            check_docker_compose
            check_status
            ;;
        logs)
            show_logs "$2"
            ;;
        backup)
            check_docker
            backup_database
            ;;
        restore)
            check_docker
            restore_database "$2"
            ;;
        connect)
            check_docker
            connect_database
            ;;
        migrate)
            run_migrations
            ;;
        clean)
            check_docker
            check_docker_compose
            clean_database
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            error "Comando inválido: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"

