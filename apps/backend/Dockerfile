# SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
# SPDX-License-Identifier: MIT

FROM oven/bun:1.4.0

WORKDIR /app

RUN useradd -m -u 10001 app

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile
RUN chown -R app:app /app

COPY --chown=app:app src ./src
# Pinned Redoc bundle for /api/docs (see vendor/redoc/ and THIRD_PARTY_NOTICES.md).
COPY --chown=app:app vendor ./vendor
# Licence terms and third-party notices ship with the image (synced from the
# repository root by scripts/sync-legal.sh).
COPY LICENSE NOTICE THIRD_PARTY_NOTICES.md ./

USER app

EXPOSE 8088

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD bun -e "fetch('http://127.0.0.1:8088/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["bun", "run", "src/index.ts"]
