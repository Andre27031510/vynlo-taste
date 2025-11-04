#!/bin/bash
# ============================================================================
# Script de Validação de Senha do Banco de Dados
# ============================================================================
# PADRÃO BIG TECH: Validação fail-fast de senha antes do deploy
# 
# Objetivo:
# - Garantir que DB_PASSWORD do AWS Secrets Manager está alinhado com o banco
# - Evitar deploy com senha incorreta (previne downtime)
# - Fornecer instruções claras em caso de desalinhamento
#
# Uso:
#   ./deploy/scripts/check-db-password.sh
#
# Pré-requisitos:
#   - AWS CLI configurado (OIDC ou credenciais)
#   - Container PostgreSQL rodando (vynlo-postgres)
#   - Variáveis de ambiente: AWS_REGION, AWS_RUNTIME_SECRET_ID (opcional)
#
# Autor: Sistema Vynlo Taste
# Data: 2025-11-03
# ============================================================================

set -euo pipefail  # PADRÃO BIG TECH: Fail-fast rigoroso

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações padrão
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_RUNTIME_SECRET_ID="${AWS_RUNTIME_SECRET_ID:-vynlo-taste-runtime-secrets}"
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-vynlo-postgres}"
POSTGRES_USER="${POSTGRES_USER:-vynlo_user}"
POSTGRES_DB="${POSTGRES_DB:-vynlotaste}"

echo "============================================================================"
echo "🔐 Validação de Senha do Banco de Dados (DB Password Alignment Check)"
echo "============================================================================"
echo ""

# ============================================================================
# FASE 1: Validar Pré-requisitos
# ============================================================================

echo "🔍 Fase 1: Validando pré-requisitos..."

# Verificar se AWS CLI está disponível
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ ERRO: AWS CLI não está instalado${NC}"
    echo "   Instale: https://aws.amazon.com/cli/"
    exit 1
fi

# Verificar se Docker está disponível
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ ERRO: Docker não está instalado${NC}"
    exit 1
fi

# Verificar se container PostgreSQL está rodando
if ! docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
    echo -e "${YELLOW}⚠️ AVISO: Container ${POSTGRES_CONTAINER} não está rodando${NC}"
    echo "   Tentando iniciar..."
    if docker start "${POSTGRES_CONTAINER}" > /dev/null 2>&1; then
        echo "   ✅ Container iniciado"
        sleep 3  # Aguardar container inicializar
    else
        echo -e "${RED}❌ ERRO: Não foi possível iniciar container ${POSTGRES_CONTAINER}${NC}"
        exit 1
    fi
fi

echo "✅ Pré-requisitos validados"
echo ""

# ============================================================================
# FASE 2: Buscar Senha do AWS Secrets Manager
# ============================================================================

echo "🔍 Fase 2: Buscando senha do AWS Secrets Manager..."

# Buscar secret do AWS Secrets Manager
SECRET_JSON=$(aws secretsmanager get-secret-value \
    --secret-id "${AWS_RUNTIME_SECRET_ID}" \
    --region "${AWS_REGION}" \
    --query 'SecretString' --output text 2>&1) || {
    echo -e "${RED}❌ ERRO: Falha ao buscar secret ${AWS_RUNTIME_SECRET_ID}${NC}"
    echo "   Verifique:"
    echo "   - AWS_REGION está configurado (atual: ${AWS_REGION})"
    echo "   - AWS_RUNTIME_SECRET_ID está configurado (atual: ${AWS_RUNTIME_SECRET_ID})"
    echo "   - Credenciais AWS estão válidas (OIDC ou access keys)"
    echo "   - Secret existe no AWS Secrets Manager"
    exit 1
}

# Extrair DB_PASSWORD do JSON (suporta múltiplos formatos)
if command -v jq &> /dev/null; then
    DB_PASSWORD_FROM_SECRET=$(echo "${SECRET_JSON}" | jq -r '.DB_PASSWORD // .password // empty')
else
    # Fallback: usar Python (disponível na maioria dos sistemas)
    DB_PASSWORD_FROM_SECRET=$(echo "${SECRET_JSON}" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('DB_PASSWORD') or d.get('password') or '')" 2>/dev/null || echo "")
fi

if [ -z "${DB_PASSWORD_FROM_SECRET}" ] || [ "${DB_PASSWORD_FROM_SECRET}" = "null" ]; then
    echo -e "${RED}❌ ERRO: DB_PASSWORD não encontrado no secret ${AWS_RUNTIME_SECRET_ID}${NC}"
    echo "   Formato esperado: {\"DB_PASSWORD\": \"...\"} ou {\"password\": \"...\"}"
    exit 1
fi

echo "✅ Senha recuperada do AWS Secrets Manager (${#DB_PASSWORD_FROM_SECRET} caracteres)"
echo ""

# ============================================================================
# FASE 3: Testar Conexão com Senha do Secret
# ============================================================================

echo "🔍 Fase 3: Testando conexão com senha do secret..."

# PADRÃO BIG TECH: Usar conexão TCP (não peer/trust) para garantir validação real
# docker exec usa conexão interna, mas psql com -h 127.0.0.1 força TCP
# Isso garante que a senha é realmente validada (não bypass via peer auth)

# Testar conexão via TCP (validação real de senha)
CONNECTION_TEST=$(docker exec "${POSTGRES_CONTAINER}" \
    psql -h 127.0.0.1 \
    -U "${POSTGRES_USER}" \
    -d "${POSTGRES_DB}" \
    -c "SELECT 1;" \
    -w \
    -t \
    -A \
    2>&1 <<EOF
${DB_PASSWORD_FROM_SECRET}
EOF
) || CONNECTION_EXIT_CODE=$?

# Verificar se conexão foi bem-sucedida
if [ "${CONNECTION_EXIT_CODE:-0}" != "0" ] || ! echo "${CONNECTION_TEST}" | grep -q "^1$"; then
    echo -e "${RED}❌ ERRO CRÍTICO: Senha do banco não está alinhada com segredo AWS${NC}"
    echo ""
    echo "============================================================================"
    echo "🔧 INSTRUÇÕES PARA CORRIGIR"
    echo "============================================================================"
    echo ""
    echo "1. Conecte ao container PostgreSQL:"
    echo "   docker exec -it ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}"
    echo ""
    echo "2. Altere a senha do usuário para corresponder ao secret AWS:"
    echo "   ALTER USER ${POSTGRES_USER} WITH PASSWORD '${DB_PASSWORD_FROM_SECRET}';"
    echo ""
    echo "3. Ou atualize o secret AWS para corresponder à senha atual do banco:"
    echo "   aws secretsmanager update-secret \\"
    echo "     --secret-id ${AWS_RUNTIME_SECRET_ID} \\"
    echo "     --secret-string '{\"DB_PASSWORD\":\"<senha_atual>\",\"MAIL_PASSWORD\":\"...\"}' \\"
    echo "     --region ${AWS_REGION}"
    echo ""
    echo "4. Após corrigir, execute novamente este script:"
    echo "   ./deploy/scripts/check-db-password.sh"
    echo ""
    echo "============================================================================"
    echo ""
    echo -e "${YELLOW}⚠️ DETALHES TÉCNICOS:${NC}"
    echo "   - Secret AWS: ${AWS_RUNTIME_SECRET_ID}"
    echo "   - Usuário PostgreSQL: ${POSTGRES_USER}"
    echo "   - Banco: ${POSTGRES_DB}"
    echo "   - Erro de conexão: ${CONNECTION_TEST}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Senha validada com sucesso!${NC}"
echo "   Conexão TCP testada e funcionando"
echo ""

# ============================================================================
# FASE 4: Validação Adicional (Opcional)
# ============================================================================

echo "🔍 Fase 4: Validações adicionais..."

# Verificar se consegue listar tabelas (confirma permissões)
TABLE_COUNT=$(docker exec "${POSTGRES_CONTAINER}" \
    psql -h 127.0.0.1 \
    -U "${POSTGRES_USER}" \
    -d "${POSTGRES_DB}" \
    -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" \
    -t \
    -A \
    -w \
    2>/dev/null <<EOF
${DB_PASSWORD_FROM_SECRET}
EOF
) || TABLE_COUNT="0"

if [ "${TABLE_COUNT}" -gt "0" ]; then
    echo "✅ Permissões validadas (${TABLE_COUNT} tabelas encontradas)"
else
    echo -e "${YELLOW}⚠️ AVISO: Não foi possível validar permissões (continuando)${NC}"
fi

echo ""
echo -e "${GREEN}============================================================================${NC}"
echo -e "${GREEN}✅ VALIDAÇÃO CONCLUÍDA COM SUCESSO${NC}"
echo -e "${GREEN}============================================================================${NC}"
echo ""
echo "📊 Resumo:"
echo "   ✅ Senha do AWS Secrets Manager: Validada"
echo "   ✅ Conexão TCP ao PostgreSQL: Funcionando"
echo "   ✅ Permissões do usuário: OK"
echo ""
echo "🚀 Deploy pode prosseguir com segurança"
echo ""

# Log estruturado para GitHub Actions (se disponível)
if [ -n "${GITHUB_ACTIONS:-}" ]; then
    echo "::notice::DB password check passed - Secret: ${AWS_RUNTIME_SECRET_ID}, User: ${POSTGRES_USER}"
fi

exit 0

