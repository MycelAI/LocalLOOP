import MarkdownDoc from '@/app/components/docs/MarkdownDoc'
import { MaturityStatus } from '@/app/components/MaturityStatus'
import { createMetadata } from '@/app/config/metadata'

export const metadata = createMetadata({ title: 'MaterialDNA', path: '/platform/materialdna' });

export default function MaterialDNAPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">MaterialDNA</h1>
        <p>
          MaterialDNA is the identification layer for tracking raw and processed materials
          across city loops. It proposes identifier and provenance fields for discussing traceability
          and matching in lab examples; those fields are not independently verified or persistent records.
        </p>
        <MaturityStatus />
        <div className="cta-row">
          <a className="button secondary" href="/platform/city-portals/">
            City portals
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h2>Scope & boundaries</h2>
        <div className="table-list">
          <div><span>In scope</span><div>Stable material identifiers, provenance metadata, batch references, and additive compatibility signals.</div></div>
          <div><span>Out of scope</span><div>Live asset tracking, financial settlement, or verified carbon accounting.</div></div>
          <div><span>Status</span><div>Lab-demo concept only — no public pilots or deployments yet.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h2>Why cities adopt MaterialDNA</h2>
        <div className="table-list">
          <div><span>Traceability research</span><div>Explore how source, collection, and by-product metadata could support traceability; records are not a permanent audit trail.</div></div>
          <div><span>Circular procurement</span><div>Assess whether shared metadata could inform local procurement workflows; it does not prove sourcing or eligibility.</div></div>
          <div><span>Reporting research</span><div>Draft fields may help teams discuss reporting needs; they do not establish EPR compliance.</div></div>
          <div><span>Inter-city matching</span><div>Discover and offer surplus materials to neighbouring regions using shared, compatible identifiers</div></div>
          <div><span>Evidence fields</span><div>Draft quality and certification references can support review workflows; they do not prevent fraud or validate claims.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h2>What we aim to enable</h2>
        <p>
          A draft material-identity model for discussing traceability, provenance, and matching
          across local loops.
        </p>
        <div className="table-list">
          <div><span>Identity</span><div>Example identifiers for raw and processed material records</div></div>
          <div><span>Metadata</span><div>Category, quantity, quality, condition, and lifecycle stage</div></div>
          <div><span>Provenance</span><div>Origin city, batch references, and certifications</div></div>
          <div><span>Interoperability</span><div>Shared schemas across city nodes, supporting Offer/Match/Transfer flows</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h2>Data model snapshot</h2>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-fingerprint"></i>
            </span>
            <h3>MaterialDNA schema</h3>
            <p>Material ID, category, quantity, quality, and batch references.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-clipboard-text"></i>
            </span>
            <h3>Provenance</h3>
            <p>Origin city, certifications, and audit trail fields.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-timer"></i>
            </span>
            <h3>Availability</h3>
            <p>Time windows and status fields for matching logic.</p>
          </div>
        </div>
      </div>

      <div className="content-panel">
        <h2>Current status</h2>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-scroll"></i>
            </span>
            <h3>Specification</h3>
            <p>Draft schemas are available in the LOOP repository.</p>
            <a href="/library/schemas/">Browse schemas</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-map-pin"></i>
            </span>
            <h3>Status</h3>
            <p>No public pilots or deployments yet.</p>
            <a href="/interest/">Register interest</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-plug"></i>
            </span>
            <h3>Integration</h3>
            <p>Implementation guidance will be published as the spec matures.</p>
            <a href="/docs/implementation/">Read the guide</a>
          </div>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/schemas/material-dna.schema.json" />
      </div>
    </div>
  );
}
