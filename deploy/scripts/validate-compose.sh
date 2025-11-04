#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${1:-$HOME/app}"
COMPOSE_FILE="${APP_DIR}/docker-compose.prod.yml"

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "::error::docker-compose.prod.yml not found at ${COMPOSE_FILE}" >&2
  exit 1
fi

if grep -nE '^[[:space:]]*(<<<<<<<|=======|>>>>>>>)' "${COMPOSE_FILE}" >/dev/null; then
  echo "::error::Git conflict markers detected in ${COMPOSE_FILE}" >&2
  grep -nE '^[[:space:]]*(<<<<<<<|=======|>>>>>>>)' "${COMPOSE_FILE}"
  exit 1
fi

(
  export DB_PASSWORD="${DB_PASSWORD:-placeholder}"
  export MAIL_PASSWORD="${MAIL_PASSWORD:-placeholder}"
  export BACKEND_TAG="${BACKEND_TAG:-latest}"
  export FRONTEND_TAG="${FRONTEND_TAG:-latest}"

  docker compose -f "${COMPOSE_FILE}" config -q >/dev/null
)

echo "✅ docker-compose.prod.yml validation succeeded."
