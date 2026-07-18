import MarkdownDoc from '@/app/components/docs/MarkdownDoc'
import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Threat model', path: '/docs/threat-model' });

export default function ThreatModelPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2>Threat Model</h2>
        <p>
          STRIDE-lite threat assessment for the localLOOP lab infrastructure. Covers the key
          threat categories relevant to federated node communication, material data handling,
          and API exposure in a controlled lab environment.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/docs/security">Security overview</a>
          <a className="button secondary" href="/docs">Back to docs</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Scope</h3>
        <div className="table-list">
          <div><span>Environment</span><div>Lab-only infrastructure — not a production deployment assessment</div></div>
          <div><span>Method</span><div>STRIDE-lite: Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege</div></div>
          <div><span>Status</span><div>Living document — reviewed alongside spec changes</div></div>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/docs/compliance/threat-model.md" />
      </div>
    </div>
  )
}
