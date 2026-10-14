import MarkdownDoc from '@/app/components/docs/MarkdownDoc'
import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Regulatory research', path: '/docs/regulatory-alignment' });

export default function RegulatoryAlignmentPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">Regulatory Alignment</h1>
        <p>
          localLOOP is still lab-demo infrastructure, but the protocol now documents how
          it can be evaluated against DPP, battery, packaging, waste-traceability, and German
          circular-economy data expectations. The v0.2.0 draft includes product-passport-style fields
          for research discussion; it does not claim DPP or ESPR alignment.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/protocol/spec/">
            Review the spec
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h2>What changed</h2>
        <div className="table-list">
          <div><span>Data minimization</span><div>Minimal interop payloads now explicitly reject personal contact fields.</div></div>
          <div><span>Forward compatibility</span><div>Receivers can accept additive <code>0.1.x</code> payloads and preserve unknown fields.</div></div>
          <div><span>Passport research fields</span><div><code>passport</code>, <code>classification</code>, and <code>traceability</code> blocks are draft discussion fields, not readiness or an upgrade guarantee.</div></div>
          <div><span>ProductDNA</span><div>Draft product-identity fields can reference MaterialDNA composition; no ESPR alignment is claimed.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h2>What this is not</h2>
        <p>
          This roadmap does not claim legal compliance, certification, or product-group
          coverage for delegated acts that are still emerging.
        </p>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/docs/regulatory-alignment-roadmap.md" />
      </div>
    </div>
  );
}
