export default function ProtocolSecurityPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Security guidance</div>
        <h2>Security policy and disclosure process.</h2>
        <p>
          Follow the security policy for responsible disclosure and operator guidance.
          Implementation guidance will evolve as the protocol matures.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/SECURITY.md&title=Security%20Policy"
          >
            Open security policy
          </a>
          <a className="button secondary" href="/docs/security">Security guide</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Security playbooks</h3>
        <div className="table-list">
          <div><span>Secure coding</span><div>Developer guardrails and best practices</div></div>
          <div><span>Incident response</span><div>Containment and recovery playbooks</div></div>
        </div>
      </div>
    </div>
  );
}
