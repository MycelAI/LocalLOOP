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
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-gear"></i>
            </span>
            <h4>Implementation Guide</h4>
            <p>Build a compliant node with minimal components.</p>
            <a href="/docs/implementation">Open guide</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-activity"></i>
            </span>
            <h4>Lab Demo</h4>
            <p>Run the minimal interop flow in a controlled environment.</p>
            <a href="/docs/lab-demo">Open lab demo</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-shuffle"></i>
            </span>
            <h4>Federation Handshake</h4>
            <p>Lab-only handshake and registry endpoints.</p>
            <a href="/docs/federation">Open federation guide</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-file-doc"></i>
            </span>
            <h4>API Docs</h4>
            <p>Redoc reference for the public lab API.</p>
            <a href="/docs/api">Open API docs</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-gauge"></i>
            </span>
            <h4>Metrics</h4>
            <p>Live counters for lab activity and event flow.</p>
            <a href="/docs/metrics">Open metrics</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-shield-check"></i>
            </span>
            <h4>Security Guide</h4>
            <p>Operational security playbook for node operators.</p>
            <a href="/docs/security">Open guide</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-lock"></i>
            </span>
            <h4>Secure Coding</h4>
            <p>Developer guardrails for building LOOP services.</p>
            <a href="/docs/secure-coding">Open guide</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-siren"></i>
            </span>
            <h4>Incident Response</h4>
            <p>Prepare for containment, recovery, and post-mortems.</p>
            <a href="/docs/incident-response">Open playbook</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-question"></i>
            </span>
            <h4>FAQ</h4>
            <p>Answer recurring questions about the protocol.</p>
            <a href="/docs/faq">Open FAQ</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-book-open-text"></i>
            </span>
            <h4>Glossary</h4>
            <p>Shared vocabulary for the LOOP ecosystem.</p>
            <a href="/docs/glossary">Open glossary</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-warning-circle"></i>
            </span>
            <h4>Threat Model</h4>
            <p>STRIDE-lite baseline for lab environments.</p>
            <a href="/viewer.html?path=projects/loop-protocol/docs/compliance/threat-model.md&title=Threat%20Model">Open threat model</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-clipboard-text"></i>
            </span>
            <h4>DPIA Lite</h4>
            <p>Baseline data protection assessment for lab demos.</p>
            <a href="/viewer.html?path=projects/loop-protocol/docs/compliance/dpia-lite.md&title=DPIA%20Lite">Open DPIA</a>
          </div>
        </div>
      </div>
    </div>
  );
}
