#!/usr/bin/env bash
set -euo pipefail
grep -q 'security.txt' profile/README.md
echo 'security pointer ok'
