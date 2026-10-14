import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Governance', path: '/governance' });

export default function GovernancePage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">Governance</h1>
        <p>
          Protocol changes are managed through RFCs that capture proposals, review notes,
          and decisions for LOOP.
        </p>
      </div>

      <div className="content-panel">
        <div className="grid">
          <a className="card has-icon" href="/governance/rfcs/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-scroll"></i>
            </span>
            <h3>RFC Guide</h3>
            <p>How protocol changes are proposed and reviewed.</p>
          </a>
          <a className="card has-icon" href="/governance/template/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-file-text"></i>
            </span>
            <h3>RFC Template</h3>
            <p>Standard template for drafting new proposals.</p>
          </a>
          <a className="card has-icon" href="/governance/smart-contracts/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-atom"></i>
            </span>
            <h3>Smart Contract Integration</h3>
            <p>Draft RFC for optional settlement automation.</p>
          </a>
          <a className="card has-icon card-ref" href="/docs/federation/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-shuffle"></i>
            </span>
            <h3>Federation Handshake</h3>
            <p>Lab-only handshake spec and registry flow.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
