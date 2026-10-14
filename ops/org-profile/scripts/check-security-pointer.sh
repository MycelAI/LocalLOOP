#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
# SPDX-License-Identifier: MIT

set -euo pipefail
grep -q 'security.txt' profile/README.md
echo 'security pointer ok'
