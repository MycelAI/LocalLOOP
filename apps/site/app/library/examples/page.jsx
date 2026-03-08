export default function ExamplesPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Validated examples</div>
        <h2>Reference payloads for the v0.2.0 lab flow.</h2>
        <p>
          These examples demonstrate the current baseline interop sequence plus the
          handshake and status-update payloads used by the lab backend.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/library">Back to library</a>
          <a
            className="button secondary"
            href="/viewer.html?path=projects/loop-protocol/examples/README.md&title=Examples"
          >
            Example README
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Current baseline</h3>
        <div className="table-list">
          <div><span>Registration</span><div>Material onboarding with traceability-ready fields</div></div>
          <div><span>Interop flow</span><div>Offer, match, transfer, and material-status payloads</div></div>
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
            <a href="/viewer.html?path=projects/loop-protocol/examples/01-material-registration.json&title=Material%20Registration">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-package"></i>
            </span>
            <h4>Offer</h4>
            <p>Offer payload for a registered material batch.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/06-offer.json&title=Offer">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-handshake"></i>
            </span>
            <h4>Match</h4>
            <p>Accepted match for a material and offer pairing.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/07-match.json&title=Match">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-truck"></i>
            </span>
            <h4>Transfer</h4>
            <p>Transfer payload for handoff and receipt tracking.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/08-transfer.json&title=Transfer">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-list-checks"></i>
            </span>
            <h4>Material Status</h4>
            <p>Status-update payload for reservation and withdrawal events.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/09-material-status.json&title=Material%20Status">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-plugs-connected"></i>
            </span>
            <h4>Handshake Request</h4>
            <p>Lab-only node handshake request payload.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/09-handshake-request.json&title=Handshake%20Request">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-check-circle"></i>
            </span>
            <h4>Handshake Response</h4>
            <p>Lab-only handshake acceptance payload.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/10-handshake-response.json&title=Handshake%20Response">View example</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-compass-rose"></i>
            </span>
            <h4>Complete Flow</h4>
            <p>Multi-step reference bundle across older and current artifacts.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/05-complete-flow.json&title=Complete%20Flow">View example</a>
          </div>
        </div>
      </div>
    </div>
  );
}
