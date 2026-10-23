#!/bin/bash
# SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
# SPDX-License-Identifier: MIT

# localLOOP Backend Deployment Setup Script
# This script provisions the non-root user and sets up the deployment environment.
# Run as root: sudo bash deploy/setup.sh

set -euo pipefail

INSTALL_DIR="${INSTALL_DIR:-/opt/localloop-backend}"
SERVICE_USER="${SERVICE_USER:-localloop}"
SERVICE_GROUP="${SERVICE_GROUP:-localloop}"

echo "=== localLOOP Backend Deployment Setup ==="
echo "Install directory: $INSTALL_DIR"
echo "Service user: $SERVICE_USER"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "Error: This script must be run as root (sudo)"
   exit 1
fi

# Create system user if it doesn't exist
if ! id "$SERVICE_USER" &>/dev/null; then
    echo "Creating system user: $SERVICE_USER"
    useradd -r -s /usr/sbin/nologin -d "$INSTALL_DIR" -m "$SERVICE_USER"
else
    echo "User $SERVICE_USER already exists"
fi

# Create installation directory
echo "Setting up installation directory..."
mkdir -p "$INSTALL_DIR"
# data/ (Postgres/Valkey/SeaweedFS state, owned by the containers' users) and
# backups/ (written by the root backup unit) get an owner only when created
# here; re-running setup on a live checkout must not re-own their contents.
for dir in data backups; do
    [[ -d "$INSTALL_DIR/$dir" ]] || install -d -o "$SERVICE_USER" -g "$SERVICE_GROUP" "$INSTALL_DIR/$dir"
done

# Copy application files (if running from source directory)
if [[ -f "src/index.ts" && "$(cd . && pwd -P)" == "$(cd "$INSTALL_DIR" && pwd -P)" ]]; then
    echo "Running from $INSTALL_DIR itself; skipping file copy."
elif [[ -f "src/index.ts" ]]; then
    echo "Copying application files..."
    # Everything `docker compose up -d --build` needs (the Dockerfile COPYs the
    # licence files) plus the tooling configs, so the copy can build and check.
    cp -r src deploy scripts vendor package.json bun.lock tsconfig.json biome.json \
        Dockerfile docker-compose.yml LICENSE NOTICE THIRD_PARTY_NOTICES.md \
        .env.example .env.docker.example "$INSTALL_DIR/"
    chmod +x "$INSTALL_DIR"/deploy/*.sh

    # Copy .env.example if .env doesn't exist
    if [[ ! -f "$INSTALL_DIR/.env" ]]; then
        cp .env.example "$INSTALL_DIR/.env"
        echo ""
        echo "IMPORTANT: Edit $INSTALL_DIR/.env with your production configuration!"
        echo "Required: DATABASE_URL, STORAGE_SECRET_KEY, BETTER_AUTH_SECRET (if auth enabled)"
    fi

    if [[ ! -f "$INSTALL_DIR/.env.docker" ]]; then
        cp .env.docker.example "$INSTALL_DIR/.env.docker"
        echo ""
        echo "IMPORTANT: Edit $INSTALL_DIR/.env.docker before enabling Docker-based operations!"
        echo "Required: POSTGRES_PASSWORD, STORAGE_SECRET_KEY, DATABASE_URL"
    fi
fi

# Set ownership of the application files only: not data/ and backups/ (see
# above), and not the secrets, which the service user may read but not change.
echo "Setting ownership to $SERVICE_USER:$SERVICE_GROUP..."
chown "$SERVICE_USER:$SERVICE_GROUP" "$INSTALL_DIR"
find "$INSTALL_DIR" -mindepth 1 -maxdepth 1 \
    ! -name data ! -name backups ! -name .env ! -name .env.docker \
    -exec chown -R "$SERVICE_USER:$SERVICE_GROUP" {} +
for secrets in "$INSTALL_DIR/.env" "$INSTALL_DIR/.env.docker"; do
    if [[ -f "$secrets" ]]; then
        chown "root:$SERVICE_GROUP" "$secrets"
        chmod 640 "$secrets"
    fi
done

# Install systemd units. The unit files in deploy/ reference the placeholder
# path /opt/localloop-backend; rewrite it to the actual INSTALL_DIR so every
# installed unit (app, backup, health check) points at the same checkout.
if [[ -f "deploy/localloop-backend.service" ]]; then
    echo "Installing systemd units for $INSTALL_DIR..."
    for unit in localloop-backend.service localloop-backend-backup.service localloop-backend-backup.timer \
                localloop-backend-healthcheck.service localloop-backend-healthcheck.timer; do
        sed "s#/opt/localloop-backend#$INSTALL_DIR#g" "deploy/$unit" > "/etc/systemd/system/$unit"
    done
    systemctl daemon-reload
    echo "Service installed. Enable with: systemctl enable localloop-backend"
    echo "Start with: systemctl start localloop-backend"
    echo "Enable backups with: systemctl enable --now localloop-backend-backup.timer"
    echo "Enable health-check alerting with: systemctl enable --now localloop-backend-healthcheck.timer"
    echo "  (optional: set ALERT_WEBHOOK_URL in $INSTALL_DIR/.env for push notifications; journal logging works without it)"
fi

# Verify bun is installed
if ! command -v bun &>/dev/null; then
    echo ""
    echo "WARNING: bun is not installed. Install it with:"
    echo "  curl -fsSL https://bun.sh/install | bash"
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Edit $INSTALL_DIR/.env with production credentials"
echo "2. Run 'cd $INSTALL_DIR && bun install' as $SERVICE_USER"
echo "3. Run 'systemctl enable --now localloop-backend'"
echo "4. Check status with 'systemctl status localloop-backend'"
echo "5. Enable nightly backups with 'systemctl enable --now localloop-backend-backup.timer'"
echo "6. Enable health-check alerting with 'systemctl enable --now localloop-backend-healthcheck.timer'"
