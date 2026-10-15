# SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
# SPDX-License-Identifier: MIT

FROM oven/bun:1.4.3-alpine@sha256:629e17411f1f129dbec3af78d5af9c9f2a937435c80349437206c6b0b7422373 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build && bun scripts/generate-csp-hashes.mjs /app/csp-script-hashes.conf

# Non-root nginx (uid 101, listens on 8080; pid and temp paths under /tmp), so
# the container runs with no capabilities and a read-only root filesystem.
FROM nginxinc/nginx-unprivileged:1.30-alpine@sha256:782bb89768cc87b7f95c18b95baa1af250e5d451f26794f59363540161147c01
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/security-headers.conf
# `map` must live in the http context: conf.d/*.conf is included there, and
# 00- sorts before default.conf.
COPY --from=builder /app/csp-script-hashes.conf /etc/nginx/conf.d/00-csp-script-hashes.conf
EXPOSE 80
