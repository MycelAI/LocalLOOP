import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export default function MaterialDNAPage() {
  return (
    <>
      <SiteHeader subtitle="MaterialDNA" />

      <section className="hero">
        <div className="hero-card">
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
            <a className="button secondary" href="/">
              Back to hub
            </a>
          </div>
        </div>
        <div className="hero-card">
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
      </section>

      <section className="section">
        <h3>Current status</h3>
        <div className="grid">
          <div className="card">
            <h4>Specification</h4>
            <p>Draft schema is available in the LOOP Protocol repository.</p>
            <a href="/viewer.html?path=projects/loop-protocol/schemas/material-dna.schema.json&title=MaterialDNA%20Schema">Open schema</a>
          </div>
          <div className="card">
            <h4>Pilots</h4>
            <p>No public pilots or deployments yet.</p>
            <a href="/#interest">Register interest</a>
          </div>
          <div className="card">
            <h4>Integration</h4>
            <p>Implementation guidance will be published as the spec matures.</p>
            <a href="/viewer.html?path=projects/loop-protocol/docs/implementation-guide.md&title=Implementation%20Guide">Read the guide</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
