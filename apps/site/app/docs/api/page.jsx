export default function ApiDocsPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">API reference</div>
        <h2>Open the lab API docs directly.</h2>
        <p>
          The live backend serves Redoc with headers that block cross-origin framing, so
          this page links to the canonical docs instead of embedding a blank iframe.
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
            Open OpenAPI JSON
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
          <div><span>Preferred media type</span><div>`application/ld+json` for LOOP payloads</div></div>
          <div><span>Live API</span><div>`https://loop-api.urbnia.com`</div></div>
          <div><span>Scope</span><div>Lab demo only, not a public production API</div></div>
        </div>
      </div>
    </div>
  );
}
