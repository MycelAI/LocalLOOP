export default function ProtocolSpecPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Specification</div>
        <h2>LOOP Protocol Specification v0.1</h2>
        <p>
          The normative requirements and API contracts that define interoperable
          LocalLoop implementations. No public pilots or deployments yet.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/SPECIFICATION.md&title=LOOP%20Protocol%20Specification"
          >
            Open spec in viewer
          </a>
          <a className="button secondary" href="/protocol">Back to overview</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Included in this spec</h3>
        <div className="table-list">
          <div><span>Endpoints</span><div>Core federation and data flows</div></div>
          <div><span>Compliance</span><div>Minimum operational requirements</div></div>
          <div><span>Security</span><div>Operator and developer guardrails</div></div>
        </div>
      </div>
    </div>
  );
}
