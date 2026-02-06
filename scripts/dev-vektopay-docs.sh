#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_DIR="$ROOT_DIR/projects/vektopay-api"
COMPOSE_FILE="$ROOT_DIR/docker-compose.vektopay.yml"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required to run the local database"
  exit 1
fi

if ! command -v bun >/dev/null 2>&1; then
  echo "bun is required to run the backend"
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required to run the frontend"
  exit 1
fi

if [ ! -f "$API_DIR/.env" ]; then
  cp "$API_DIR/.env.example" "$API_DIR/.env"
fi

# Start database
( cd "$ROOT_DIR" && docker compose -f "$COMPOSE_FILE" up -d db )

# Wait for database readiness
for i in {1..20}; do
  if docker compose -f "$COMPOSE_FILE" exec -T db pg_isready -U vektopay -d vektopay >/dev/null 2>&1; then
    break
  fi
  sleep 1
  if [ "$i" -eq 20 ]; then
    echo "Database did not become ready in time"
    exit 1
  fi
done

# Init DB schema
( cd "$API_DIR" && bun run db:init )

# Start backend + frontend
VITE_VEKTOPAY_API_BASE_URL="http://localhost:3333" \
VITE_VEKTOPAY_REGISTRY_URL="http://localhost:3333" \
VITE_VEKTOPAY_AUTH_REQUIRED="true" \
VITE_VEKTOPAY_AUTH_REFRESH_MS="15000" \
pnpm -C "$ROOT_DIR" concurrently -n api,docs -c cyan,magenta \
  "cd $API_DIR && bun run dev" \
  "cd $ROOT_DIR && pnpm -C packages/api-reference dev"
