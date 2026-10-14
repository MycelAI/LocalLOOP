import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Examples', path: '/library/examples' });

export default function ExamplesPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">Examples</h1>
        <p>
          These examples demonstrate the current baseline interop sequence for both
          materials and products, plus the handshake and status-update payloads used
          by the lab backend.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/library/">Back to library</a>
          <a
            className="button secondary"
            href="/library/examples/"
          >
            Example README
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h2>Current baseline</h2>
        <div className="table-list">
          <div><span>Registration</span><div>Material and product onboarding with draft traceability fields</div></div>
          <div><span>Interop flow</span><div>Offer, match, transfer for both materials and products</div></div>
          <div><span>Federation</span><div>Handshake request and response examples</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h2>Validated examples</h2>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-fingerprint"></i>
            </span>
            <h3>Material Registration</h3>
            <p>MaterialDNA example with additive passport and traceability fields.</p>
            <a href="/library/examples/material-registration/">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-package"></i>
            </span>
            <h3>Offer</h3>
            <p>Offer payload for a registered material batch.</p>
            <a href="/library/examples/offer/">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-handshake"></i>
            </span>
            <h3>Match</h3>
            <p>Accepted match for a material and offer pairing.</p>
            <a href="/library/examples/match/">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-truck"></i>
            </span>
            <h3>Transfer</h3>
            <p>Transfer payload for handoff and receipt tracking.</p>
            <a href="/library/examples/transfer/">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-list-checks"></i>
            </span>
            <h3>Material Status</h3>
            <p>Status-update payload for reservation and withdrawal events.</p>
            <a href="/library/examples/material-status/">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-plugs-connected"></i>
            </span>
            <h3>Handshake Request</h3>
            <p>Lab-only node handshake request payload.</p>
            <a href="/library/examples/handshake-request/">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-check-circle"></i>
            </span>
            <h3>Handshake Response</h3>
            <p>Lab-only handshake acceptance payload.</p>
            <a href="/library/examples/handshake-response/">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-compass-rose"></i>
            </span>
            <h3>Complete Flow</h3>
            <p>Multi-step reference bundle across older and current artifacts.</p>
            <a href="/library/examples/complete-flow/">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-cube"></i>
            </span>
            <h3>Product Registration</h3>
            <p>ProductDNA registration for office furniture reuse with DPP passport.</p>
            <a href="/library/examples/product-registration/">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-arrows-left-right"></i>
            </span>
            <h3>Product Offer Flow</h3>
            <p>Complete Offer → Match → Transfer flow using product_id.</p>
            <a href="/library/examples/product-offer-flow/">View example</a>
          </div>
        </div>
      </div>
    </div>
  );
}
