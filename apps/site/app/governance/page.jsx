export default function GovernancePage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2 className="hub-heading">Governance</h2>
        <p>
          Protocol changes are managed through RFCs that capture proposals, review notes,
          and decisions for LOOP.
        </p>
      </div>

      <div className="content-panel">
        <div className="grid">
          <a className="card has-icon" href="/governance/rfcs">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-scroll"></i>
            </span>
            <h4>RFC Guide</h4>
            <p>How protocol changes are proposed and reviewed.</p>
          </a>
          <a className="card has-icon" href="/governance/template">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-file-text"></i>
            </span>
            <h4>RFC Template</h4>
            <p>Standard template for drafting new proposals.</p>
          </a>
          <a className="card has-icon" href="/governance/smart-contracts">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-atom"></i>
            </span>
            <h4>Smart Contract Integration</h4>
            <p>Draft RFC for optional settlement automation.</p>
          </a>
          <a className="card has-icon card-ref" href="/docs/federation">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-shuffle"></i>
            </span>
            <h4>Federation Handshake</h4>
            <p>Lab-only handshake spec and registry flow.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
