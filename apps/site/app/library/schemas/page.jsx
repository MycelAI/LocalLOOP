export default function SchemasPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Schemas</h2>
        <p>
          Use these schemas to validate payloads and build interoperable lab
          implementations. The current baseline covers MaterialDNA, ProductDNA, Offer, Match,
          Transfer, status updates, and handshake flows.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/library">Back to library</a>
          <a
            className="button secondary"
            href="/library/schemas"
          >
            Schema README
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>What is stable today</h3>
        <div className="table-list">
          <div><span>Minimal interop</span><div>Material and product registration, offer, match, transfer, and status updates</div></div>
          <div><span>Federation</span><div>Lab-only handshake payloads and node metadata</div></div>
          <div><span>Exploratory</span><div>LoopCoin, LoopSignal, and transaction models remain draft reference material</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Schema catalog</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-fingerprint"></i>
            </span>
            <h4>MaterialDNA</h4>
            <p>Material identity, provenance, and DPP-ready extension hooks.</p>
            <a href="/library/schemas/material-dna">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-cube"></i>
            </span>
            <h4>ProductDNA</h4>
            <p>Product identity, condition, lifecycle, and DPP-aligned passport fields (ESPR Art. 9-10).</p>
            <a href="/library/schemas/product-dna">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-package"></i>
            </span>
            <h4>Offer</h4>
            <p>Availability and routing offers for materials or products.</p>
            <a href="/library/schemas/offer">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-handshake"></i>
            </span>
            <h4>Match</h4>
            <p>Agreement state between a material or product and an offer.</p>
            <a href="/library/schemas/match">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-truck"></i>
            </span>
            <h4>Transfer</h4>
            <p>Handoff and receipt events for the physical move.</p>
            <a href="/library/schemas/transfer">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-list-checks"></i>
            </span>
            <h4>Material Status</h4>
            <p>Status changes that keep a material record current.</p>
            <a href="/library/schemas/material-status">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-plugs-connected"></i>
            </span>
            <h4>Handshake</h4>
            <p>Lab-only node discovery and handshake payloads.</p>
            <a href="/library/schemas/handshake">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-flask"></i>
            </span>
            <h4>Exploratory schemas</h4>
            <p>LoopCoin, LoopSignal, transaction, and node-info drafts.</p>
            <a href="/library/schemas">Browse all schemas</a>
          </div>
        </div>
      </div>
    </div>
  );
}
