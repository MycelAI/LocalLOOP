export default function MaterialDNAPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Material identity layer</div>
        <h2>MaterialDNA: a shared identity for circular materials.</h2>
        <p>
          MaterialDNA is the proposed identification layer for tracking materials across
          city loops. It is an early concept with no public pilots yet.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/schemas/material-dna.schema.json&title=MaterialDNA%20Schema"
          >
            Review the schema
          </a>
          <a className="button secondary" href="/cities">
            City portals
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Scope & boundaries</h3>
        <div className="table-list">
          <div><span>In scope</span><div>Stable material identifiers, provenance metadata, and basic compliance signals.</div></div>
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
          <div><span>Identity</span><div>Persistent IDs for batches and materials</div></div>
          <div><span>Metadata</span><div>Attributes, quality, and compliance signals</div></div>
          <div><span>Interoperability</span><div>Shared schema across city nodes</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Data model snapshot</h3>
        <p>
          The v0.1.1 lab schema captures the minimum fields needed to identify and route
          materials across loops.
        </p>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-fingerprint"></i>
            </span>
            <h4>Identity fields</h4>
            <p>Material ID, category, and unique batch references.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-clipboard-text"></i>
            </span>
            <h4>Provenance tags</h4>
            <p>Origin city, current city, and quality descriptors.</p>
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
            <p>Draft schema is available in the LOOP Protocol repository.</p>
            <a href="/viewer.html?path=projects/loop-protocol/schemas/material-dna.schema.json&title=MaterialDNA%20Schema">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-map-pin"></i>
            </span>
            <h4>Pilots</h4>
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
