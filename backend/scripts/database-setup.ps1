# =============================================================================
# SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS - VYNLOTASTE
# Sistema de Delivery Empresarial com PostgreSQL
# Versão PowerShell para Windows
# =============================================================================

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [string]$Parameter = ""
)

# Configurações
$DB_NAME = "vynlo_taste"
$DB_USER = "postgres"
$DOCKER_COMPOSE_FILE = "docker-compose.yml"

# Função para log colorido
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    switch ($Level) {
        "ERROR" { 
            Write-Host "[$timestamp] ERROR: $Message" -ForegroundColor Red
        }
        "WARN" { 
            Write-Host "[$timestamp] WARNING: $Message" -ForegroundColor Yellow
        }
        "SUCCESS" { 
            Write-Host "[$timestamp] $Message" -ForegroundColor Green
        }
        "INFO" { 
            Write-Host "[$timestamp] INFO: $Message" -ForegroundColor Blue
        }
        default { 
            Write-Host "[$timestamp] $Message" -ForegroundColor White
        }
    }
}

# Função para verificar se Docker está rodando
function Test-Docker {
    try {
        docker info | Out-Null
        Write-Log "Docker está rodando" "SUCCESS"
        return $true
    }
    catch {
        Write-Log "Docker não está rodando. Por favor, inicie o Docker e tente novamente." "ERROR"
        return $false
    }
}

# Função para verificar se Docker Compose está disponível
function Test-DockerCompose {
    try {
        # Tentar docker-compose primeiro
        docker-compose --version | Out-Null
        $script:COMPOSE_CMD = "docker-compose"
        Write-Log "Docker Compose está disponível (docker-compose)" "SUCCESS"
        return $true
    }
    catch {
        try {
            # Tentar docker compose (versão mais recente)
            docker compose version | Out-Null
            $script:COMPOSE_CMD = "docker compose"
            Write-Log "Docker Compose está disponível (docker compose)" "SUCCESS"
            return $true
        }
        catch {
            Write-Log "Docker Compose não está disponível. Por favor, instale o Docker Compose." "ERROR"
            return $false
        }
    }
}

# Função para iniciar serviços
function Start-Services {
    Write-Log "Iniciando serviços do banco de dados..."
    
    & $COMPOSE_CMD -f $DOCKER_COMPOSE_FILE up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Serviços iniciados com sucesso!" "SUCCESS"
    } else {
        Write-Log "Erro ao iniciar serviços" "ERROR"
        exit 1
    }
}

# Função para parar serviços
function Stop-Services {
    Write-Log "Parando serviços do banco de dados..."
    
    & $COMPOSE_CMD -f $DOCKER_COMPOSE_FILE down
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Serviços parados com sucesso!" "SUCCESS"
    } else {
        Write-Log "Erro ao parar serviços" "ERROR"
        exit 1
    }
}

# Função para verificar status dos serviços
function Get-ServiceStatus {
    Write-Log "Verificando status dos serviços..."
    & $COMPOSE_CMD -f $DOCKER_COMPOSE_FILE ps
}

# Função para verificar logs
function Show-Logs {
    param([string]$Service = "postgres")
    
    Write-Log "Mostrando logs do serviço: $Service"
    & $COMPOSE_CMD -f $DOCKER_COMPOSE_FILE logs -f $Service
}

# Função para fazer backup
function Backup-Database {
    Write-Log "Fazendo backup do banco de dados..."
    
    $backupDir = "./database/backups"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "$backupDir/vynlo_taste_backup_$timestamp.sql"
    
    # Criar diretório de backup se não existir
    if (!(Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    }
    
    # Fazer backup
    docker exec vynlotaste-postgres pg_dump -U $DB_USER -d $DB_NAME > $backupFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Backup criado com sucesso: $backupFile" "SUCCESS"
    } else {
        Write-Log "Erro ao criar backup" "ERROR"
        exit 1
    }
}

# Função para restaurar backup
function Restore-Database {
    param([string]$BackupFile)
    
    if ([string]::IsNullOrEmpty($BackupFile)) {
        Write-Log "Por favor, especifique o arquivo de backup para restaurar" "ERROR"
        Write-Host "Uso: .\database-setup.ps1 restore <arquivo_backup>"
        exit 1
    }
    
    if (!(Test-Path $BackupFile)) {
        Write-Log "Arquivo de backup não encontrado: $BackupFile" "ERROR"
        exit 1
    }
    
    Write-Log "Restaurando banco de dados do backup: $BackupFile"
    
    # Restaurar backup
    Get-Content $BackupFile | docker exec -i vynlotaste-postgres psql -U $DB_USER -d $DB_NAME
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Backup restaurado com sucesso!" "SUCCESS"
    } else {
        Write-Log "Erro ao restaurar backup" "ERROR"
        exit 1
    }
}

# Função para conectar ao banco
function Connect-Database {
    Write-Log "Conectando ao banco de dados..."
    docker exec -it vynlotaste-postgres psql -U $DB_USER -d $DB_NAME
}

# Função para executar migrações Flyway
function Invoke-Migrations {
    Write-Log "Executando migrações Flyway..."
    
    # Verificar se o Spring Boot está rodando
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Log "Spring Boot está rodando" "SUCCESS"
        }
    }
    catch {
        Write-Log "Spring Boot não está rodando. Iniciando aplicação..." "WARN"
        # Aqui você pode adicionar comando para iniciar a aplicação Spring Boot
    }
    
    Write-Log "Migrações Flyway serão executadas automaticamente quando a aplicação iniciar" "INFO"
}

# Função para limpar dados
function Clear-Database {
    Write-Log "ATENÇÃO: Esta operação irá remover todos os dados do banco!" "WARN"
    $confirmation = Read-Host "Tem certeza que deseja continuar? (y/N)"
    
    if ($confirmation -eq "y" -or $confirmation -eq "Y") {
        Write-Log "Limpando banco de dados..."
        
        # Parar serviços
        Stop-Services
        
        # Remover volumes
        & $COMPOSE_CMD -f $DOCKER_COMPOSE_FILE down -v
        
        # Iniciar serviços novamente
        Start-Services
        
        Write-Log "Banco de dados limpo com sucesso!" "SUCCESS"
    } else {
        Write-Log "Operação cancelada" "INFO"
    }
}

# Função para mostrar ajuda
function Show-Help {
    Write-Host "Uso: .\database-setup.ps1 [COMANDO]"
    Write-Host ""
    Write-Host "Comandos disponíveis:"
    Write-Host "  start       - Iniciar serviços do banco de dados"
    Write-Host "  stop        - Parar serviços do banco de dados"
    Write-Host "  restart     - Reiniciar serviços do banco de dados"
    Write-Host "  status      - Verificar status dos serviços"
    Write-Host "  logs        - Mostrar logs dos serviços"
    Write-Host "  backup      - Fazer backup do banco de dados"
    Write-Host "  restore     - Restaurar backup do banco de dados"
    Write-Host "  connect     - Conectar ao banco de dados"
    Write-Host "  migrate     - Executar migrações Flyway"
    Write-Host "  clean       - Limpar banco de dados (ATENÇÃO: remove todos os dados)"
    Write-Host "  help        - Mostrar esta ajuda"
    Write-Host ""
    Write-Host "Exemplos:"
    Write-Host "  .\database-setup.ps1 start                    # Iniciar serviços"
    Write-Host "  .\database-setup.ps1 backup                   # Fazer backup"
    Write-Host "  .\database-setup.ps1 restore backup.sql       # Restaurar backup"
    Write-Host "  .\database-setup.ps1 logs postgres            # Ver logs do PostgreSQL"
}

# Função principal
function Main {
    switch ($Command.ToLower()) {
        "start" {
            if (Test-Docker -and Test-DockerCompose) {
                Start-Services
            }
        }
        "stop" {
            if (Test-Docker -and Test-DockerCompose) {
                Stop-Services
            }
        }
        "restart" {
            if (Test-Docker -and Test-DockerCompose) {
                Stop-Services
                Start-Sleep -Seconds 2
                Start-Services
            }
        }
        "status" {
            if (Test-Docker -and Test-DockerCompose) {
                Get-ServiceStatus
            }
        }
        "logs" {
            if (Test-Docker -and Test-DockerCompose) {
                Show-Logs $Parameter
            }
        }
        "backup" {
            if (Test-Docker) {
                Backup-Database
            }
        }
        "restore" {
            if (Test-Docker) {
                Restore-Database $Parameter
            }
        }
        "connect" {
            if (Test-Docker) {
                Connect-Database
            }
        }
        "migrate" {
            Invoke-Migrations
        }
        "clean" {
            if (Test-Docker -and Test-DockerCompose) {
                Clear-Database
            }
        }
        "help" {
            Show-Help
        }
        default {
            Write-Log "Comando inválido: $Command" "ERROR"
            Write-Host ""
            Show-Help
            exit 1
        }
    }
}

# Executar função principal
Main

