#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
APP_DIR="${DEPLOY_APP_DIR:-$HOME/app}"

log() { printf '%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }

: "${GITHUB_TOKEN:?GITHUB_TOKEN environment variable is required}"
: "${DB_PASSWORD:?DB_PASSWORD environment variable is required}"
: "${MAIL_PASSWORD:?MAIL_PASSWORD environment variable is required}"

TAG="${COMMIT_SHA:-latest}"
REGISTRY_OWNER="$(tr '[:upper:]' '[:lower:]' <<< "${OWNER_LC:-andre27031510}")"
REGISTRY_BACKEND="ghcr.io/${REGISTRY_OWNER}/vynlotaste-backend"
REGISTRY_FRONTEND="ghcr.io/${REGISTRY_OWNER}/vynlotaste-frontend"

log "Authenticating to GitHub Container Registry (${REGISTRY_OWNER})"
echo "${GITHUB_TOKEN}" | docker login ghcr.io -u "${GITHUB_ACTOR:-github-actions}" --password-stdin >/dev/null

log "Checking availability of backend image ${REGISTRY_BACKEND}:${TAG}"
docker manifest inspect "${REGISTRY_BACKEND}:${TAG}" >/dev/null 2>&1 || { log "Backend image ${TAG} not found"; exit 1; }

log "Checking availability of frontend image ${REGISTRY_FRONTEND}:${TAG}"
docker manifest inspect "${REGISTRY_FRONTEND}:${TAG}" >/dev/null 2>&1 || { log "Frontend image ${TAG} not found"; exit 1; }

log "Pulling backend image ${REGISTRY_BACKEND}:${TAG}"
docker pull "${REGISTRY_BACKEND}:${TAG}"

log "Pulling frontend image ${REGISTRY_FRONTEND}:${TAG}"
docker pull "${REGISTRY_FRONTEND}:${TAG}"

export BACKEND_TAG="${TAG}"
export FRONTEND_TAG="${TAG}"
export DB_PASSWORD
export MAIL_PASSWORD

log "Validating docker-compose.prod.yml"
"${SCRIPT_DIR}/validate-compose.sh" "${APP_DIR}"

log "Validating database password alignment"
"${SCRIPT_DIR}/check-db-password.sh"

cd "${APP_DIR}"

log "Pre-pulling services defined in docker-compose.prod.yml"
docker compose -f docker-compose.prod.yml pull backend frontend

if docker ps --format '{{.Names}}' | grep -Fxq 'vynlo-postgres'; then
  TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
  BACKUP_FILE="backup-pre-deploy-${TIMESTAMP}.sql"
  log "Creating PostgreSQL backup (${BACKUP_FILE})"
  docker exec vynlo-postgres pg_dump -U vynlo_user vynlotaste > "${BACKUP_FILE}"
else
  log "PostgreSQL container not running; skipping backup step"
fi

log "Stopping existing backend/frontend containers"
docker compose -f docker-compose.prod.yml stop backend frontend || true
docker compose -f docker-compose.prod.yml rm -f backend frontend || true

log "Starting backend/frontend containers (zero downtime strategy)"
docker compose -f docker-compose.prod.yml up -d backend frontend --remove-orphans

log "Waiting for backend health endpoint"
for attempt in {1..12}; do
  if docker exec vynlo-backend curl -fsS http://localhost:8080/api/actuator/health >/dev/null 2>&1; then
    log "Backend healthy (attempt ${attempt})"
    break
  fi
  log "Backend not ready yet (attempt ${attempt}/12)"
  sleep 10
  if [[ ${attempt} -eq 12 ]]; then
    log "Backend failed to pass health check"
    docker logs vynlo-backend --tail 200 || true
    exit 1
  fi
done

log "Waiting for frontend health endpoint"
for attempt in {1..12}; do
  if curl -fsS http://localhost:3000 >/dev/null 2>&1 && curl -fsS http://localhost:3000/api/actuator/health >/dev/null 2>&1; then
    log "Frontend healthy (attempt ${attempt})"
    break
  fi
  log "Frontend not ready yet (attempt ${attempt}/12)"
  sleep 10
  if [[ ${attempt} -eq 12 ]]; then
    log "Frontend failed to pass health check"
    docker logs vynlo-frontend --tail 200 || true
    exit 1
  fi
done

log "Pruning Docker images older than 24h"
docker image prune -f --filter "until=24h" >/dev/null || true

log "Deployment completed successfully for tag ${TAG}"
echo "::notice::Deployment completed for ${TAG}"
