export default function DocsPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Implementation guidance</div>
        <h2>Operational playbooks and developer references.</h2>
        <p>
          Documentation for node operators and implementers. Guidance will evolve as
          the protocol matures.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/docs/implementation">Implementation guide</a>
          <a className="button secondary" href="/docs/security">Security guide</a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Doc categories</h3>
        <div className="table-list">
          <div><span>Implementation</span><div>Node build and integration steps</div></div>
          <div><span>Security</span><div>Operational security playbooks</div></div>
          <div><span>Response</span><div>Incident handling guidance</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Documentation library</h3>
        <div className="grid">
          <div className="card" data-icon="IM">
            <h4>Implementation Guide</h4>
            <p>Build a compliant node with minimal components.</p>
            <a href="/docs/implementation">Open guide</a>
          </div>
          <div className="card" data-icon="SE">
            <h4>Security Guide</h4>
            <p>Operational security playbook for node operators.</p>
            <a href="/docs/security">Open guide</a>
          </div>
          <div className="card" data-icon="SC">
            <h4>Secure Coding</h4>
            <p>Developer guardrails for building LOOP services.</p>
            <a href="/docs/secure-coding">Open guide</a>
          </div>
          <div className="card" data-icon="IR">
            <h4>Incident Response</h4>
            <p>Prepare for containment, recovery, and post-mortems.</p>
            <a href="/docs/incident-response">Open playbook</a>
          </div>
          <div className="card" data-icon="FQ">
            <h4>FAQ</h4>
            <p>Answer recurring questions about the protocol.</p>
            <a href="/docs/faq">Open FAQ</a>
          </div>
          <div className="card" data-icon="GL">
            <h4>Glossary</h4>
            <p>Shared vocabulary for the LOOP ecosystem.</p>
            <a href="/docs/glossary">Open glossary</a>
          </div>
        </div>
      </div>
    </div>
  );
}
