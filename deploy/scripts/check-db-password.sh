#!/usr/bin/env bash

set -euo pipefail

DB_CONTAINER="${DB_CONTAINER:-vynlo-postgres}"
DB_USER="${DB_USER:-vynlo_user}"
DB_NAME="${DB_NAME:-vynlotaste}"
DB_HOST="${DB_HOST:-127.0.0.1}"

if [[ -z "${DB_PASSWORD:-}" ]]; then
  echo "::error::DB_PASSWORD is not set in the environment" >&2
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -Fxq "${DB_CONTAINER}"; then
  echo "::error::Container ${DB_CONTAINER} not running; cannot validate password" >&2
  exit 1
fi

if PGPASSWORD="${DB_PASSWORD}" docker exec "${DB_CONTAINER}" \
  psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" -c 'SELECT 1;' >/dev/null 2>&1; then
  echo "✅ Database password validated via TCP."
else
  cat <<'INSTRUCTIONS' >&2
❌ Falha ao autenticar no PostgreSQL com o DB_PASSWORD fornecido.

Como corrigir:

  1. Confirme o valor do segredo no AWS Secrets Manager.

  2. Ajuste manualmente no servidor:

       PGPASSWORD='<senha-atual>' docker exec vynlo-postgres \
         psql -h 127.0.0.1 -U vynlo_user -d vynlotaste \
         -c "ALTER USER vynlo_user WITH PASSWORD '<senha-do-secret>';"

  3. Reexecute o pipeline após alinhar o segredo.
INSTRUCTIONS
  exit 1
fi
