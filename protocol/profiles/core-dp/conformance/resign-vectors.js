#!/usr/bin/env node
// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

/**
 * Re-signs the Core-DP conformance vectors after an intentional change to
 * envelope content (for example an identifier move), so that every vector
 * keeps failing -- or passing -- for its declared reason only.
 *
 * Keys: trust/lab-test-private-keys.json holds TEST-ONLY Ed25519 private keys
 * for every entry in trust/accepted-peer-keys.json. They exist so fixtures can
 * be regenerated; they authenticate nothing and must never be used by a node.
 * With --rotate-keys, fresh key pairs are generated and the public halves are
 * written to the trust store.
 *
 * Per signed envelope (payload.signature):
 *   - signing_input_sha256 is recomputed from the current payload;
 *   - vectors that expect "signature verification failed" get a valid
 *     signature with its first byte flipped, so only the Ed25519 check fails;
 *   - otherwise, if a private key exists for signature.key_id, the envelope is
 *     signed with it; keys absent from the store (unknown / mismatched key-id
 *     vectors) keep their placeholder value.
 *
 * Usage (from protocol/): node profiles/core-dp/conformance/resign-vectors.js [--rotate-keys]
 * Then run `npm run conformance:core-dp`.
 */

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { canonicalJson, sha256Hex, coreDpEnvelopeSigningInput } = require('../../../scripts/validate-schemas.js');

const DIR = __dirname;
const TRUST_PATH = path.join(DIR, 'trust', 'accepted-peer-keys.json');
const PRIVATE_PATH = path.join(DIR, 'trust', 'lab-test-private-keys.json');
const VECTORS_PATH = path.join(DIR, 'vectors', 'core-dp-vectors.json');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

function rotateKeys(trust) {
  const keys = {};
  for (const entry of trust.keys) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
    entry.public_key_jwk = publicKey.export({ format: 'jwk' });
    keys[entry.key_id] = { node_id: entry.node_id, private_key_jwk: privateKey.export({ format: 'jwk' }) };
  }
  trust.updated_at = `${new Date().toISOString().slice(0, 10)}T00:00:00Z`;
  writeJson(TRUST_PATH, trust);
  writeJson(PRIVATE_PATH, {
    _comment:
      'TEST-ONLY Ed25519 keys for regenerating the Core-DP conformance vectors (resign-vectors.js). They authenticate nothing; never use them in a node.',
    keys,
  });
}

function main() {
  const trust = readJson(TRUST_PATH);
  if (process.argv.includes('--rotate-keys') || !fs.existsSync(PRIVATE_PATH)) rotateKeys(trust);
  const privateKeys = readJson(PRIVATE_PATH).keys;

  const suite = readJson(VECTORS_PATH);
  let signed = 0;
  let corrupted = 0;
  let kept = 0;
  for (const vector of suite.vectors) {
    const payload = vector.payload;
    if (!payload?.signature) continue;
    const signingInput = canonicalJson(coreDpEnvelopeSigningInput(payload));
    payload.signature.signing_input_sha256 = sha256Hex(signingInput);

    const keyEntry = privateKeys[payload.signature.key_id];
    if (!keyEntry) {
      kept += 1;
      continue;
    }
    const privateKey = crypto.createPrivateKey({ key: keyEntry.private_key_jwk, format: 'jwk' });
    const value = crypto.sign(null, Buffer.from(signingInput, 'utf8'), privateKey);
    if ((vector.expected_failure_contains || '').includes('signature verification failed')) {
      value[0] ^= 0xff;
      corrupted += 1;
    } else {
      signed += 1;
    }
    payload.signature.value = value.toString('base64url');
  }
  writeJson(VECTORS_PATH, suite);
  console.log(`re-signed ${signed}, deliberately corrupted ${corrupted}, kept placeholder ${kept}`);
}

main();
