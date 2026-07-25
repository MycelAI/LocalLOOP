#!/usr/bin/env bash
set -euo pipefail
# agent-cycle-087
test -f profile/README.md
grep -qi 'lab' profile/README.md || grep -qi 'localLOOP' profile/README.md
echo ok cycle 87
