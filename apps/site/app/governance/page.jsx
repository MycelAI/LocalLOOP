export default function GovernancePage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Governance & RFCs</div>
        <h2>How protocol changes are proposed and reviewed.</h2>
        <p>
          Governance is managed through RFCs that capture proposals, review notes, and
          decisions for the LOOP Protocol.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/governance/rfcs">Open RFC guide</a>
          <a className="button secondary" href="/governance/template">Use template</a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Governance tools</h3>
        <div className="table-list">
          <div><span>RFC guide</span><div>Process and expectations</div></div>
          <div><span>Templates</span><div>Standard structure for proposals</div></div>
          <div><span>Experiments</span><div>Optional smart contract RFCs</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Governance resources</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-scroll"></i>
            </span>
            <h4>RFC Guide</h4>
            <p>How protocol changes are proposed and reviewed.</p>
            <a href="/governance/rfcs">Open RFC guide</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-file-text"></i>
            </span>
            <h4>RFC Template</h4>
            <p>Standard template for drafting new proposals.</p>
            <a href="/governance/template">Open template</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-atom"></i>
            </span>
            <h4>Smart Contract Integration</h4>
            <p>Draft RFC for optional settlement automation.</p>
            <a href="/governance/smart-contracts">Open RFC 0004</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-shuffle"></i>
            </span>
            <h4>Federation Handshake</h4>
            <p>Lab-only handshake spec and registry flow.</p>
            <a href="/docs/federation">Open federation guide</a>
          </div>
        </div>
      </div>
    </div>
  );
}
