export default function ApiDocsPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>API Docs</h2>
        <p>
          The live backend serves Redoc with headers that block cross-origin framing, so this
          page links directly to the lab API docs. The normative protocol contract lives in the
          mirrored `loop-protocol` OpenAPI artifact.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="https://loop-api.urbnia.com/docs"
            target="_blank"
            rel="noreferrer"
          >
            Open live Redoc
          </a>
          <a
            className="button secondary"
            href="https://loop-api.urbnia.com/openapi.json"
            target="_blank"
            rel="noreferrer"
          >
            Open lab OpenAPI JSON
          </a>
          <a
            className="button secondary"
            href="https://local-loop-io.github.io/projects/loop-protocol/openapi.json"
            target="_blank"
            rel="noreferrer"
          >
            Open protocol reference
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Local development</h3>
        <p>
          When the backend is running locally, open `http://localhost:8088/docs` or
          `http://localhost:8088/openapi.json` directly in your browser.
        </p>
        <div className="table-list">
          <div><span>Protocol reference</span><div>`https://local-loop-io.github.io/projects/loop-protocol/openapi.json`</div></div>
          <div><span>Live lab API</span><div>`https://loop-api.urbnia.com`</div></div>
          <div><span>Preferred media type</span><div>`application/ld+json` for LOOP payloads</div></div>
          <div><span>Scope</span><div>Lab demo only. The live backend is not a claim of protocol-wide conformance.</div></div>
        </div>
      </div>
    </div>
  );
}
