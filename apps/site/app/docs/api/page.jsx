import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Lab API documentation', path: '/docs/api' });

export default function ApiDocsPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">API Docs</h1>
        <p>
          The live backend serves Redoc with headers that block cross-origin framing, so this
          page links directly to the lab API docs. The normative protocol contract lives in the
          mirrored <code>loop-protocol</code> OpenAPI artifact.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="https://loop-api.urbnia.com/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open live Redoc
          </a>
          <a
            className="button secondary"
            href="https://loop-api.urbnia.com/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open lab OpenAPI JSON
          </a>
          <a
            className="button secondary"
            href="https://localloop.urbnia.com/projects/loop-protocol/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open protocol reference
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h2>Local development</h2>
        <p>
          When the backend is running locally, open <code>http://localhost:8088/docs</code> or
          <code>http://localhost:8088/openapi.json</code> directly in your browser.
        </p>
        <div className="table-list">
          <div><span>Protocol reference</span><div><code>https://localloop.urbnia.com/projects/loop-protocol/openapi.json</code></div></div>
          <div><span>Live lab API</span><div><code>https://loop-api.urbnia.com</code></div></div>
          <div><span>Preferred media type</span><div><code>application/ld+json</code> for LOOP payloads</div></div>
          <div><span>Scope</span><div>Lab demo only. The live backend is not a claim of protocol-wide conformance.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h2>Current lab protocol surface</h2>
        <p>
          The live lab backend exposes every endpoint required by the specification's §8
          (MaterialDNA and ProductDNA registration, retrieval and search, Offer, Match,
          Transfer, node info, signals, transactions, and the federated announce/offer
          routes) plus lab-only extensions (material status, event stream, relay, and the
          federation registry). The backend's compliance matrix records the status of each.
        </p>
        <div className="table-list">
          <div><span>Compliance matrix</span><div><a href="https://github.com/local-loop-io/localloop-backend/blob/main/docs/SPEC-COMPLIANCE.md" target="_blank" rel="noopener noreferrer">docs/SPEC-COMPLIANCE.md</a></div></div>
          <div><span>Node metadata</span><div><code>GET /api/v1/node/info</code></div></div>
          <div><span>Material status</span><div><code>POST /api/v1/material-status</code></div></div>
          <div><span>Lab relay</span><div><code>POST /api/v1/relay</code> for supported lab event families</div></div>
          <div><span>Federation registry</span><div><code>GET /api/v1/federation/nodes</code> and <code>POST /api/v1/federation/handshake</code></div></div>
        </div>
      </div>
    </div>
  );
}
