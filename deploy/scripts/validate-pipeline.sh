#!/bin/bash
# ============================================================================
# Script de Validação Completa do Pipeline (Dry-Run)
# ============================================================================
# Executa validações completas do pipeline sem fazer deploy real
# 
# Uso:
#   ./deploy/scripts/validate-pipeline.sh
#
# Pré-requisitos:
#   - Docker instalado
#   - AWS CLI configurado (opcional)
#   - Git configurado
# ============================================================================

set -euo pipefail

echo "============================================================================"
echo "🔍 Validação Completa do Pipeline (Dry-Run)"
echo "============================================================================"
echo ""

ERRORS=0
WARNINGS=0

# Função para contar erros
count_error() {
    ERRORS=$((ERRORS + 1))
    echo "❌ ERRO: $1"
}

# Função para contar avisos
count_warning() {
    WARNINGS=$((WARNINGS + 1))
    echo "⚠️ AVISO: $1"
}

# ============================================================================
# FASE 1: Validação de Scripts
# ============================================================================
echo "=== Fase 1: Validação de Scripts ==="

SCRIPTS=(
    "deploy/scripts/deploy-application.sh"
    "deploy/scripts/check-db-password.sh"
    "deploy/scripts/validate-compose.sh"
)

for script in "${SCRIPTS[@]}"; do
    if [ ! -f "${script}" ]; then
        count_error "Script não encontrado: ${script}"
    elif [ ! -x "${script}" ]; then
        count_warning "Script não é executável: ${script}"
        chmod +x "${script}"
        echo "   ✅ Permissão corrigida"
    else
        echo "✅ ${script} encontrado e executável"
    fi
    
    # Verificar shell rigoroso
    if grep -q "set -euo pipefail" "${script}"; then
        echo "   ✅ Shell rigoroso configurado (set -euo pipefail)"
    else
        count_error "${script} não tem 'set -euo pipefail'"
    fi
    
    # Verificar shebang
    if head -1 "${script}" | grep -q "^#!/bin/bash"; then
        echo "   ✅ Shebang correto"
    else
        count_warning "${script} não tem shebang #!/bin/bash"
    fi
    
    # Tentar tornar executável (ignorar erro se chmod não disponível - Windows)
    if command -v chmod &> /dev/null; then
        chmod +x "${script}" 2>/dev/null || true
    else
        echo "   ⚠️  chmod não disponível (Windows) - scripts serão executáveis no Linux"
    fi
done

echo ""

# ============================================================================
# FASE 2: Validação de docker-compose.prod.yml
# ============================================================================
echo "=== Fase 2: Validação de docker-compose.prod.yml ==="

if [ ! -f "docker-compose.prod.yml" ]; then
    count_error "docker-compose.prod.yml não encontrado"
else
    echo "✅ docker-compose.prod.yml encontrado"
    
    # Validar usando script dedicado (com placeholders)
    export DB_PASSWORD="VALIDATION_PLACEHOLDER"
    export MAIL_PASSWORD="VALIDATION_PLACEHOLDER"
    export BACKEND_TAG="latest"
    export FRONTEND_TAG="latest"
    export AWS_REGION="us-east-1"
    export GRAFANA_PASSWORD="admin"
    
    if [ -f "./deploy/scripts/validate-compose.sh" ]; then
        chmod +x ./deploy/scripts/validate-compose.sh
        if ./deploy/scripts/validate-compose.sh docker-compose.prod.yml .; then
            echo "✅ Validação de compose passou"
        else
            count_error "Validação de compose falhou"
        fi
    else
        count_warning "Script validate-compose.sh não encontrado, pulando validação detalhada"
    fi
fi

echo ""

# ============================================================================
# FASE 3: Validação de Estrutura do Projeto
# ============================================================================
echo "=== Fase 3: Validação de Estrutura do Projeto ==="

# Verificar diretórios essenciais
DIRS=(
    "backend/core-module"
    "frontend"
    "deploy/scripts"
    "docs"
)

for dir in "${DIRS[@]}"; do
    if [ -d "${dir}" ]; then
        echo "✅ Diretório encontrado: ${dir}"
    else
        count_error "Diretório não encontrado: ${dir}"
    fi
done

# Verificar arquivos essenciais
FILES=(
    "backend/core-module/pom.xml"
    "frontend/package.json"
    ".github/workflows/ci-cd-v2.yml"
)

for file in "${FILES[@]}"; do
    if [ -f "${file}" ]; then
        echo "✅ Arquivo encontrado: ${file}"
    else
        count_error "Arquivo não encontrado: ${file}"
    fi
done

echo ""

# ============================================================================
# FASE 4: Validação de Dependências
# ============================================================================
echo "=== Fase 4: Validação de Dependências ==="

# Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo "✅ Docker instalado: ${DOCKER_VERSION}"
    
    # Verificar se Docker está rodando
    if docker ps &> /dev/null; then
        echo "   ✅ Docker está rodando"
    else
        count_warning "Docker não está rodando (alguns testes podem falhar)"
    fi
else
    count_error "Docker não está instalado"
fi

# Docker Compose
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    echo "✅ Docker Compose disponível: ${COMPOSE_VERSION}"
else
    count_warning "Docker Compose não disponível"
fi

# AWS CLI (opcional)
if command -v aws &> /dev/null; then
    AWS_VERSION=$(aws --version 2>&1)
    echo "✅ AWS CLI instalado: ${AWS_VERSION}"
else
    count_warning "AWS CLI não instalado (validação de secrets pode falhar)"
fi

# Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✅ Git instalado: ${GIT_VERSION}"
else
    count_error "Git não está instalado"
fi

# jq (opcional, para parsing JSON)
if command -v jq &> /dev/null; then
    echo "✅ jq instalado (útil para parsing JSON)"
else
    count_warning "jq não instalado (scripts usarão Python como fallback)"
fi

echo ""

# ============================================================================
# FASE 5: Validação de Configuração
# ============================================================================
echo "=== Fase 5: Validação de Configuração ==="

# Verificar se variáveis de ambiente críticas estão documentadas
if [ -f "docs/DEPLOY_RUNBOOK.md" ]; then
    echo "✅ Documentação de deploy encontrada"
else
    count_warning "Documentação de deploy não encontrada"
fi

# Verificar se runbooks estão presentes
RUNBOOKS=(
    "docs/ROLLBACK_RUNBOOK.md"
    "docs/INCIDENT_RESPONSE.md"
)

for runbook in "${RUNBOOKS[@]}"; do
    if [ -f "${runbook}" ]; then
        echo "✅ Runbook encontrado: ${runbook}"
    else
        count_warning "Runbook não encontrado: ${runbook}"
    fi
done

echo ""

# ============================================================================
# FASE 6: Testes de Conexão (Opcional)
# ============================================================================
echo "=== Fase 6: Testes de Conexão (Opcional) ==="

# Testar se PostgreSQL está rodando (se container existir)
if docker ps --format '{{.Names}}' | grep -q "^vynlo-postgres$"; then
    echo "✅ Container PostgreSQL está rodando"
    
    # Testar conexão (requer DB_PASSWORD)
    if [ -n "${DB_PASSWORD:-}" ] && [ "${DB_PASSWORD}" != "VALIDATION_PLACEHOLDER" ]; then
        if docker exec vynlo-postgres pg_isready -U vynlo_user > /dev/null 2>&1; then
            echo "   ✅ PostgreSQL aceitando conexões"
        else
            count_warning "PostgreSQL não está aceitando conexões"
        fi
    else
        echo "   ⏭️  DB_PASSWORD não configurado, pulando teste de conexão"
    fi
else
    echo "⏭️  Container PostgreSQL não está rodando (normal em dry-run)"
fi

echo ""

# ============================================================================
# RESUMO FINAL
# ============================================================================
echo "============================================================================"
echo "📊 Resumo da Validação"
echo "============================================================================"
echo ""
echo "Erros encontrados: ${ERRORS}"
echo "Avisos encontrados: ${WARNINGS}"
echo ""

if [ "${ERRORS}" -eq 0 ] && [ "${WARNINGS}" -eq 0 ]; then
    echo "✅ VALIDAÇÃO PASSOU: Pipeline está pronto para produção"
    exit 0
elif [ "${ERRORS}" -eq 0 ]; then
    echo "⚠️ VALIDAÇÃO PASSOU COM AVISOS: Pipeline está funcional, mas há melhorias recomendadas"
    exit 0
else
    echo "❌ VALIDAÇÃO FALHOU: Corrija os erros antes de fazer deploy"
    exit 1
fi

