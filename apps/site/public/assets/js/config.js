// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

const hostname = window.location.hostname;
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

// In production the lab API is same-origin: nginx in the site container
// proxies /api/* to the backend (https://loop.urbnia.com/api/...).
window.LOCALLOOP_CONFIG = {
  apiBase: isLocal ? 'http://127.0.0.1:8088' : window.location.origin
};
