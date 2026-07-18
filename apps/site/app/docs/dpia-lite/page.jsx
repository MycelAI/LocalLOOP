import MarkdownDoc from '@/app/components/docs/MarkdownDoc'
import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'DPIA lite', path: '/docs/dpia-lite' });

export default function DpiaLitePage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2>DPIA Lite</h2>
        <p>
          Data Protection Impact Assessment (DPIA) lite screening for localLOOP lab deployments.
          Covers the personal data minimisation approach, GDPR alignment, and risk assessment
          applicable to controlled lab-scale operations. Cities and operators running a LOOP node
          should review this document alongside their own DPA requirements.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/docs/regulatory-alignment">Regulatory alignment</a>
          <a className="button secondary" href="/docs">Back to docs</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Scope</h3>
        <div className="table-list">
          <div><span>Framework</span><div>GDPR Art. 35 — Data Protection Impact Assessment screening</div></div>
          <div><span>Environment</span><div>Lab-only; no personal data in protocol payloads by design</div></div>
          <div><span>Applicability</span><div>City nodes, operators, and any party processing interest-form submissions</div></div>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/docs/compliance/dpia-lite.md" />
      </div>
    </div>
  )
}
