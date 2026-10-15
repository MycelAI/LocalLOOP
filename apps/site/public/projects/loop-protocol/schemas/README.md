# Schemas

JSON Schema definitions for LOOP payloads.

## Files
- `material-dna.schema.json` — Material identity and metadata (v0.2.0)
- `product-dna.schema.json` — Product identity and metadata, DPP-aligned (v0.2.0)
- `offer.schema.json` — Offer payload definition (v0.2.0, supports material_id or product_id)
- `match.schema.json` — Match payload definition (v0.2.0, supports material_id or product_id)
- `transfer.schema.json` — Transfer payload definition (v0.2.0, supports material_id or product_id)
- `material-status.schema.json` — Material status updates (v0.2.0)
- `handshake.schema.json` — Federation handshake protocol (v0.2.0)
- `federate-accepted.schema.json` — 202 Accepted response for federate announce/offer (v0.2.0)
- `loopcoin.schema.json` — forward-looking/reserved schema; LoopCoin settlement has no corresponding route, schema, or data model in the lab backend (`apps/backend` in the monorepo) yet (see `apps/backend/docs/SPEC-COMPLIANCE.md`'s LoopCoin settlement lab-boundary section for the current implementation-status boundary)
- `loopsignal.schema.json`
- `transaction.schema.json`
- `node-info.schema.json`

## Validation

Run the validation suite from the repository root:

<!-- agent-cycle-027: validation entrypoint anchor -->

```bash
npm run test
```

This validates all JSON files in `examples/` against the schemas.

> Use `npm run test` rather than bare `npm test`. Where `npm` is aliased to
> `bun`, bare `npm test` invokes Bun's built-in test runner — which finds no
> test files here and exits non-zero — instead of this validation script.

## How to Cite

If you reference these schemas, please cite:
Alphin C. Tom. "LOOP Schemas." localLOOP (Mycel), 2025-2026. https://loop.urbnia.com/library/schemas/

```bibtex
@misc{localloop_protocol_schemas_2025,
  author = {Alphin C. Tom},
  organization = {Mycel},
  title = {LOOP Schemas},
  year = {2026},
  howpublished = {localLOOP documentation hub},
  url = {https://loop.urbnia.com/library/schemas/},
  note = {Source: protocol/schemas in https://github.com/MycelAI/LocalLOOP; version 0.5.x. Releases up to 0.5.2 are also in the archived repository https://github.com/local-loop-io/loop-protocol}
}
```
