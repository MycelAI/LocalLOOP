export default function ExamplesPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Examples</div>
        <h2>Reference payloads for the v0.2.0 lab flow.</h2>
        <p>
          These examples demonstrate the current baseline interop sequence for both
          materials and products, plus the handshake and status-update payloads used
          by the lab backend.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/library">Back to library</a>
          <a
            className="button secondary"
            href="/library/examples"
          >
            Example README
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Current baseline</h3>
        <div className="table-list">
          <div><span>Registration</span><div>Material and product onboarding with traceability-ready fields</div></div>
          <div><span>Interop flow</span><div>Offer, match, transfer for both materials and products</div></div>
          <div><span>Federation</span><div>Handshake request and response examples</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Validated examples</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-fingerprint"></i>
            </span>
            <h4>Material Registration</h4>
            <p>MaterialDNA example with additive passport and traceability fields.</p>
            <a href="/library/examples/material-registration">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-package"></i>
            </span>
            <h4>Offer</h4>
            <p>Offer payload for a registered material batch.</p>
            <a href="/library/examples/offer">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-handshake"></i>
            </span>
            <h4>Match</h4>
            <p>Accepted match for a material and offer pairing.</p>
            <a href="/library/examples/match">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-truck"></i>
            </span>
            <h4>Transfer</h4>
            <p>Transfer payload for handoff and receipt tracking.</p>
            <a href="/library/examples/transfer">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-list-checks"></i>
            </span>
            <h4>Material Status</h4>
            <p>Status-update payload for reservation and withdrawal events.</p>
            <a href="/library/examples/material-status">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-plugs-connected"></i>
            </span>
            <h4>Handshake Request</h4>
            <p>Lab-only node handshake request payload.</p>
            <a href="/library/examples/handshake-request">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-check-circle"></i>
            </span>
            <h4>Handshake Response</h4>
            <p>Lab-only handshake acceptance payload.</p>
            <a href="/library/examples/handshake-response">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-compass-rose"></i>
            </span>
            <h4>Complete Flow</h4>
            <p>Multi-step reference bundle across older and current artifacts.</p>
            <a href="/library/examples/complete-flow">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-cube"></i>
            </span>
            <h4>Product Registration</h4>
            <p>ProductDNA registration for office furniture reuse with DPP passport.</p>
            <a href="/library/examples/product-registration">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-arrows-left-right"></i>
            </span>
            <h4>Product Offer Flow</h4>
            <p>Complete Offer → Match → Transfer flow using product_id.</p>
            <a href="/library/examples/product-offer-flow">View example</a>
          </div>
        </div>
      </div>
    </div>
  );
}
