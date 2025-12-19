import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';

export default function SchemasPage() {
  return (
    <>
      <SiteHeader subtitle="Schema Library" />

      <section className="hero">
        <div className="hero-card">
          <div className="badge">Schema library</div>
          <h2>JSON schemas for every payload type.</h2>
          <p>
            Use these schemas to validate payloads and build compliant implementations.
          </p>
          <div className="cta-row">
            <a className="button primary" href="/library">Back to library</a>
            <a
              className="button secondary"
              href="/viewer.html?path=projects/loop-protocol/schemas/README.md&title=Schema%20Library"
            >
              Schema README
            </a>
          </div>
        </div>
        <div className="hero-card">
          <h3>Available schemas</h3>
          <div className="table-list">
            <div><span>MaterialDNA</span><div>Identity and metadata schema</div></div>
            <div><span>LoopCoin</span><div>Payment and settlement schema</div></div>
            <div><span>LoopSignal</span><div>Community preference schema</div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Schema catalog</h3>
        <div className="grid">
          <div className="card">
            <h4>MaterialDNA</h4>
            <p>Material registry identifiers and metadata.</p>
            <a href="/viewer.html?path=projects/loop-protocol/schemas/material-dna.schema.json&title=MaterialDNA%20Schema">Open schema</a>
          </div>
          <div className="card">
            <h4>LoopCoin</h4>
            <p>Currency configuration, transfers, and settlement.</p>
            <a href="/viewer.html?path=projects/loop-protocol/schemas/loopcoin.schema.json&title=LoopCoin%20Schema">Open schema</a>
          </div>
          <div className="card">
            <h4>LoopSignal</h4>
            <p>Community preference configuration and voting.</p>
            <a href="/viewer.html?path=projects/loop-protocol/schemas/loopsignal.schema.json&title=LoopSignal%20Schema">Open schema</a>
          </div>
          <div className="card">
            <h4>Transactions</h4>
            <p>Material transactions, settlements, and status.</p>
            <a href="/viewer.html?path=projects/loop-protocol/schemas/transaction.schema.json&title=Transaction%20Schema">Open schema</a>
          </div>
          <div className="card">
            <h4>Node Info</h4>
            <p>Node metadata, registry, and status.</p>
            <a href="/viewer.html?path=projects/loop-protocol/schemas/node-info.schema.json&title=Node%20Info%20Schema">Open schema</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
