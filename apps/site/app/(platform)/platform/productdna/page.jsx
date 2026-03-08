import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export const metadata = {
  alternates: {
    canonical: '/platform/productdna',
  },
};

export default function ProductDNAPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>ProductDNA</h2>
        <p>
          ProductDNA is the product-level identity layer for the localLOOP platform. It references
          constituent MaterialDNA entries and aligns with EU Digital Product Passport requirements
          under ESPR Art. 9-10. This is an early-stage lab concept with no public pilots yet.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/platform/materialdna">
            MaterialDNA
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Scope & boundaries</h3>
        <div className="table-list">
          <div><span>In scope</span><div>Stable product identifiers, DPP passport fields, material composition links, and lifecycle stage.</div></div>
          <div><span>Out of scope</span><div>Live inventory tracking, financial settlement, or verified carbon accounting.</div></div>
          <div><span>Status</span><div>Lab-demo concept only — no public pilots or deployments yet.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>What we aim to enable</h3>
        <p>
          A DPP-aligned digital passport for finished products, linking provenance metadata
          and material composition to support traceability across circular economy loops.
        </p>
        <div className="table-list">
          <div><span>Identity</span><div>Persistent product IDs referencing constituent MaterialDNA entries via material_ids</div></div>
          <div><span>DPP fields</span><div>ESPR Art. 9-10 aligned passport fields, certifications, and regulatory metadata</div></div>
          <div><span>Lifecycle stage</span><div>Condition, repair history, and end-of-life indicators</div></div>
          <div><span>Interoperability</span><div>Compatible with Offer/Match/Transfer flows across city nodes</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Data model snapshot</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-cube"></i>
            </span>
            <h4>ProductDNA schema</h4>
            <p>Product ID, category, condition, lifecycle stage, and material composition links.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-clipboard-text"></i>
            </span>
            <h4>Provenance & DPP</h4>
            <p>Origin, passport fields, certifications, and ESPR-aligned metadata.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-recycle"></i>
            </span>
            <h4>Lifecycle stage</h4>
            <p>Condition tracking, repair records, and end-of-life routing signals.</p>
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
            <a href="/docs/implementation">Read the guide</a>
          </div>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/schemas/product-dna.schema.json" />
      </div>
    </div>
  );
}
