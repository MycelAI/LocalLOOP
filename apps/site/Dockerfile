FROM oven/bun:1.4.0-alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build && bun scripts/generate-csp-hashes.mjs /app/csp-script-hashes.conf

FROM nginx:1.28-alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/security-headers.conf
# `map` must live in the http context: conf.d/*.conf is included there, and
# 00- sorts before default.conf.
COPY --from=builder /app/csp-script-hashes.conf /etc/nginx/conf.d/00-csp-script-hashes.conf
EXPOSE 80
