import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Schemas', path: '/library/schemas' });

export default function SchemasPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">Schemas</h1>
        <p>
          Use these schemas to validate payloads and build interoperable lab
          implementations. The current baseline covers MaterialDNA, ProductDNA, Offer, Match,
          Transfer, status updates, and handshake flows.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/library/">Back to library</a>
          <a
            className="button secondary"
            href="/library/schemas/"
          >
            Schema README
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h2>What is stable today</h2>
        <div className="table-list">
          <div><span>Minimal interop</span><div>Material and product registration, offer, match, transfer, and status updates</div></div>
          <div><span>Federation</span><div>Lab-only handshake payloads and node metadata</div></div>
          <div><span>Exploratory</span><div>LoopCoin, LoopSignal, and transaction models remain draft reference material</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h2>Schema catalog</h2>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-fingerprint"></i>
            </span>
            <h3>MaterialDNA</h3>
            <p>Material identity, provenance, and draft extension fields for research discussion.</p>
            <a href="/library/schemas/material-dna/">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-cube"></i>
            </span>
            <h3>ProductDNA</h3>
            <p>Product identity, condition, lifecycle, and draft passport-style fields for research discussion; no ESPR alignment is claimed.</p>
            <a href="/library/schemas/product-dna/">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-package"></i>
            </span>
            <h3>Offer</h3>
            <p>Availability and routing offers for materials or products.</p>
            <a href="/library/schemas/offer/">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-handshake"></i>
            </span>
            <h3>Match</h3>
            <p>Agreement state between a material or product and an offer.</p>
            <a href="/library/schemas/match/">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-truck"></i>
            </span>
            <h3>Transfer</h3>
            <p>Handoff and receipt events for the physical move.</p>
            <a href="/library/schemas/transfer/">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-list-checks"></i>
            </span>
            <h3>Material Status</h3>
            <p>Status changes that keep a material record current.</p>
            <a href="/library/schemas/material-status/">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-plugs-connected"></i>
            </span>
            <h3>Handshake</h3>
            <p>Lab-only node discovery and handshake payloads.</p>
            <a href="/library/schemas/handshake/">Open schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-flask"></i>
            </span>
            <h3>Exploratory schemas</h3>
            <p>LoopCoin, LoopSignal, transaction, and node-info drafts.</p>
            <a href="/library/schemas/">Browse all schemas</a>
          </div>
        </div>
      </div>
    </div>
  );
}
