export const metadata = {
  alternates: {
    canonical: '/platform/materialdna',
  },
};

export default function MaterialDNAPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">MaterialDNA</div>
        <h2>MaterialDNA — a shared identity for materials in the circular economy.</h2>
        <p>
          MaterialDNA is the identification layer for tracking raw and processed materials
          across city loops. It provides stable, verifiable identifiers and provenance metadata
          to support traceability and matching. This is an early concept with no public pilots yet.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/schemas/material-dna.schema.json&title=MaterialDNA%20Schema"
          >
            Review the schema
          </a>
          <a className="button secondary" href="/platform/city-portals">
            City portals
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Scope & boundaries</h3>
        <div className="table-list">
          <div><span>In scope</span><div>Stable material identifiers, provenance metadata, batch references, and additive compatibility signals.</div></div>
          <div><span>Out of scope</span><div>Live asset tracking, financial settlement, or verified carbon accounting.</div></div>
          <div><span>Status</span><div>Lab-demo concept only — no public pilots or deployments yet.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>What we aim to enable</h3>
        <p>
          A common, verifiable identity for materials to support traceability, provenance,
          and matching across local loops.
        </p>
        <div className="table-list">
          <div><span>Identity</span><div>Persistent IDs for raw and processed materials</div></div>
          <div><span>Metadata</span><div>Category, quantity, quality, condition, and lifecycle stage</div></div>
          <div><span>Provenance</span><div>Origin city, batch references, and certifications</div></div>
          <div><span>Interoperability</span><div>Shared schemas across city nodes, supporting Offer/Match/Transfer flows</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Data model snapshot</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-fingerprint"></i>
            </span>
            <h4>MaterialDNA schema</h4>
            <p>Material ID, category, quantity, quality, and batch references.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-clipboard-text"></i>
            </span>
            <h4>Provenance</h4>
            <p>Origin city, certifications, and audit trail fields.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-timer"></i>
            </span>
            <h4>Availability</h4>
            <p>Time windows and status fields for matching logic.</p>
          </div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Current status</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-scroll"></i>
            </span>
            <h4>Specification</h4>
            <p>Draft schemas are available in the LOOP repository.</p>
            <a href="/library/schemas">Browse schemas</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-map-pin"></i>
            </span>
            <h4>Status</h4>
            <p>No public pilots or deployments yet.</p>
            <a href="/interest">Register interest</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-plug"></i>
            </span>
            <h4>Integration</h4>
            <p>Implementation guidance will be published as the spec matures.</p>
            <a href="/viewer.html?path=projects/loop-protocol/docs/implementation-guide.md&title=Implementation%20Guide">Read the guide</a>
          </div>
        </div>
      </div>
    </div>
  );
}
