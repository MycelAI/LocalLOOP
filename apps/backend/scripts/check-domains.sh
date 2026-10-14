#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
# SPDX-License-Identifier: MIT

set -euo pipefail

banned=(
  "local-loop-io.github.io"
  "loop-protocol.org"
  "localloop.org"
  "local-loop.io"
  "api.local-loop.io"
  "local-loop.eu"
  "materialdna.eu"
)

pattern=$(IFS='|'; echo "${banned[*]//./\\.}")

# The trailing "." matters: with no path argument and a non-TTY stdin (any
# non-interactive caller, e.g. `bun run check:domains` in CI or a pipeline),
# ripgrep searches stdin instead of the working tree and reports a vacuous pass.
if command -v rg >/dev/null 2>&1; then
  if rg -n "(${pattern})" --hidden --glob '!node_modules/**' --glob '!.git/**' --glob '!dist/**' --glob '!scripts/check-domains.sh' --glob '!DOMAIN-POLICY.md' . ; then
    echo "Banned domains found."
    exit 1
  fi
else
  if grep -RIn -E "(${pattern})" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude=DOMAIN-POLICY.md --exclude=check-domains.sh . ; then
    echo "Banned domains found."
    exit 1
  fi
fi

# Former hostnames: since 2026-10-14 they only 308-redirect to loop.urbnia.com
# (and /api/). Changelog history and the domain policy may still name them.
former=(
  "localloop.urbnia.com"
  "loop-api.urbnia.com"
)
former_pattern=$(IFS='|'; echo "${former[*]//./\\.}")
if command -v rg >/dev/null 2>&1; then
  if rg -n "(${former_pattern})" --hidden --glob '!node_modules/**' --glob '!.git/**' --glob '!dist/**' --glob '!scripts/check-domains.sh' --glob '!DOMAIN-POLICY.md' --glob '!CHANGELOG.md' . ; then
    echo "Former hostnames found (use https://loop.urbnia.com or https://loop.urbnia.com/api/)."
    exit 1
  fi
else
  if grep -RIn -E "(${former_pattern})" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude=DOMAIN-POLICY.md --exclude=check-domains.sh --exclude=CHANGELOG.md . ; then
    echo "Former hostnames found (use https://loop.urbnia.com or https://loop.urbnia.com/api/)."
    exit 1
  fi
fi

echo "Domain check passed."
