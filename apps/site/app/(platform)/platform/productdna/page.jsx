import MarkdownDoc from '@/app/components/docs/MarkdownDoc'
import { MaturityStatus } from '@/app/components/MaturityStatus'
import { createMetadata } from '@/app/config/metadata'

export const metadata = createMetadata({ title: 'ProductDNA', path: '/platform/productdna' });

export default function ProductDNAPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>ProductDNA</h2>
        <p>
          ProductDNA is the product-level identity layer for the localLOOP platform. It references
          constituent MaterialDNA entries and explores fields that may be relevant to EU Digital
          Product Passport discussions. This is an early-stage lab concept, not a DPP-ready system.
        </p>
        <MaturityStatus />
        <div className="cta-row">
          <a className="button secondary" href="/platform/materialdna">
            MaterialDNA
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Scope & boundaries</h3>
        <div className="table-list">
          <div><span>In scope</span><div>Draft product identifiers, passport-style fields, material-composition links, and lifecycle stage.</div></div>
          <div><span>Out of scope</span><div>Live inventory tracking, financial settlement, or verified carbon accounting.</div></div>
          <div><span>Status</span><div>Lab-demo concept only — no public pilots or deployments yet.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Why cities adopt ProductDNA</h3>
        <div className="table-list">
          <div><span>DPP research</span><div>Explore data fields that may be relevant to ESPR Art. 9-10; no readiness, mandate coverage, or compliance outcome is claimed.</div></div>
          <div><span>Circular procurement</span><div>Use lab examples to discuss product condition, composition, and lifecycle fields; they do not verify procurement requirements.</div></div>
          <div><span>Reuse scenarios</span><div>Model potential exchange scenarios for research; provenance data is illustrative and not independently verified.</div></div>
          <div><span>Evidence fields</span><div>References to certifications can support review; they do not prevent false claims or establish conformity.</div></div>
          <div><span>Data control</span><div>Data-control patterns are under exploration; deployments must define their own access, retention, and governance controls.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>What we aim to enable</h3>
        <p>
          A draft product-identity model with example passport-style fields, provenance metadata,
          material composition references, and lifecycle information.
        </p>
        <div className="table-list">
          <div><span>Identity</span><div>Example product identifiers referencing constituent MaterialDNA entries via material_ids</div></div>
          <div><span>Passport fields</span><div>Draft fields for discussing product, certification, and regulatory metadata; no ESPR alignment is claimed.</div></div>
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
            <p>Example origin, passport-style, certification, and regulatory metadata fields.</p>
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
