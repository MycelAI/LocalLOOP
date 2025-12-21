export default function FederationPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Federation (lab only)</div>
        <h2>Federation handshake for demo nodes.</h2>
        <p>
          The lab handshake introduces two nodes and registers them in the demo
          registry. This is not a production federation protocol.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/docs/federation-handshake.md&title=Federation%20Handshake"
          >
            Open handshake spec
          </a>
          <a className="button secondary" href="/docs/lab-demo">Lab demo</a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Endpoints (lab)</h3>
        <div className="table-list">
          <div><span>Handshake</span><div>`/api/federation/handshake`</div></div>
          <div><span>Registry</span><div>`/api/federation/nodes`</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Sample handshake</h3>
        <div className="code-block">
          <pre><code>{`{
  "@context": "https://local-loop-io.github.io/projects/loop-protocol/v0.1.1",
  "@type": "NodeHandshake",
  "schema_version": "0.1.1",
  "node_id": "munich.loop",
  "name": "DEMO Munich Node",
  "endpoint": "https://demo-munich.loop/api",
  "capabilities": ["material-registry", "lab-relay"],
  "timestamp": "2025-12-20T10:00:00Z"
}`}</code></pre>
        </div>
      </div>
    </div>
  );
}
