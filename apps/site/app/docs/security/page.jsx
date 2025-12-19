export default function SecurityGuidePage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Security guidance</div>
        <h2>Operational security playbook for operators.</h2>
        <p>
          Practical guidance on securing LocalLoop nodes and integrations.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/docs/security-guide.md&title=Security%20Guide"
          >
            Open guide
          </a>
          <a className="button secondary" href="/docs">Back to docs</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Included topics</h3>
        <div className="table-list">
          <div><span>Threat model</span><div>Key risks and mitigations</div></div>
          <div><span>Operational control</span><div>Logging, access, and response</div></div>
        </div>
      </div>
    </div>
  );
}
