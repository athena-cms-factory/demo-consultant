#!/bin/bash
# Athena Dashboard Launcher (v8.7 - Decoupled Architecture)
# Dit script start de Backend (API) op 5000 en de Frontend (Vite) op 5001.

# Bepaal de project root (we zitten in factory/athena.sh)
FACTORY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$FACTORY_ROOT/.."
cd "$PROJECT_ROOT"

# Maak log directory aan indien nodig
mkdir -p output/logs
TIMESTAMP=$(date +%Y-%m-%d)
LOG_FILE_API="output/logs/${TIMESTAMP}_athena_api.log"
LOG_FILE_UI="output/logs/${TIMESTAMP}_athena_ui.log"

# Helper: Check and Install dependencies
check_deps() {
    if [ ! -d "$1/node_modules" ]; then
        echo "📦 Installing dependencies in $(basename "$1")..."
        cd "$1" && pnpm install
    fi
}

echo "🔍 Checking dependencies..."
check_deps "$FACTORY_ROOT/factory/athena-api"
check_deps "$FACTORY_ROOT/factory/athena-dashboard-ui"

# Ports
API_PORT=5000
UI_PORT=5001

# Clean up existing processes via pm-cli
NODE_BIN=$(command -v node)
if [ -f "$FACTORY_ROOT/factory/cli/pm-cli.js" ]; then
    echo "🧹 Cleaning up ports $API_PORT and $UI_PORT..."
    $NODE_BIN "$FACTORY_ROOT/factory/cli/pm-cli.js" stop $API_PORT > /dev/null 2>&1
    $NODE_BIN "$FACTORY_ROOT/factory/cli/pm-cli.js" stop $UI_PORT > /dev/null 2>&1
    sleep 1
fi

echo "🔱 Starting Unified Athena API on port $API_PORT..."
cd "$FACTORY_ROOT/factory/athena-api"
pnpm start > "../../$LOG_FILE_API" 2>&1 &
cd "$PROJECT_ROOT"

echo "🌐 Starting Unified Dashboard UI on port $UI_PORT..."
cd "$FACTORY_ROOT/factory/athena-dashboard-ui"
pnpm dev --port $UI_PORT > "../../$LOG_FILE_UI" 2>&1 &
cd "$PROJECT_ROOT"

echo "⏳ Wachten op initialisatie..."
sleep 3

# Open de browser (Absolute Linux Binary)
echo "🌐 Dashboard openen op http://localhost:$UI_PORT..."
USER_DATA_DIR="/home/kareltestspecial/.chrome-linux-profile"
mkdir -p "$USER_DATA_DIR"

if [ -f "/opt/google/chrome/google-chrome" ]; then
    /opt/google/chrome/google-chrome --user-data-dir="$USER_DATA_DIR" --new-window "http://localhost:$UI_PORT" --no-first-run --no-default-browser-check &
else
    xdg-open "http://localhost:$UI_PORT"
fi
