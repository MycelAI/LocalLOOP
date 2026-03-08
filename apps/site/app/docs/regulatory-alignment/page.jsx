export default function RegulatoryAlignmentPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Regulatory alignment</div>
        <h2>Compatibility roadmap for EU and German circular-data rules.</h2>
        <p>
          localLOOP is still lab-demo infrastructure, but the protocol now documents how
          it can evolve toward DPP, battery, packaging, waste-traceability, and German
          circular-economy data expectations building on the v0.2.0 DPP-compatible baseline.
          The new ProductDNA schema provides product-level DPP alignment (ESPR Art. 9-10).
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/docs/regulatory-alignment-roadmap.md&title=Regulatory%20Alignment%20Roadmap"
          >
            Open roadmap
          </a>
          <a className="button secondary" href="/protocol/spec">
            Review the spec
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>What changed</h3>
        <div className="table-list">
          <div><span>Data minimization</span><div>Minimal interop payloads now explicitly reject personal contact fields.</div></div>
          <div><span>Forward compatibility</span><div>Receivers can accept additive `0.1.x` payloads and preserve unknown fields.</div></div>
          <div><span>DPP-ready hooks</span><div>`passport`, `classification`, and `traceability` blocks create a non-breaking upgrade path.</div></div>
          <div><span>ProductDNA</span><div>Product-level DPP entity with ESPR-aligned passport fields, referencing MaterialDNA composition.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>What this is not</h3>
        <p>
          This roadmap does not claim legal compliance, certification, or product-group
          coverage for delegated acts that are still emerging.
        </p>
      </div>
    </div>
  );
}
