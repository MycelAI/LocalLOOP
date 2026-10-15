// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { config } from '../src/config';

/**
 * The lab relay and federation ingest routes always require an API key
 * (requireApiKey(..., { always: true })). Tests that exercise those routes
 * configure this key and send it; the config object is shared per test file.
 */
export const TEST_API_KEY = 'test-api-key-0123456789abcdef';
export const apiKeyHeader = { 'x-api-key': TEST_API_KEY } as const;

export function useTestApiKey() {
  config.auth.apiKey = TEST_API_KEY;
}
