export default function ImplementationPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Implementation</div>
        <h2>Build a compliant LocalLoop node.</h2>
        <p>
          Step-by-step guidance for operators and developers. No public deployments
          yet — this guide is a living draft.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/docs/implementation-guide.md&title=Implementation%20Guide"
          >
            Open guide
          </a>
          <a className="button secondary" href="/docs">Back to docs</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Key topics</h3>
        <div className="table-list">
          <div><span>Node setup</span><div>Required services and integration</div></div>
          <div><span>Data flows</span><div>Syncing, validation, and federation</div></div>
        </div>
      </div>
    </div>
  );
}
