import { createMetadata } from '@/app/config/metadata'

export const metadata = createMetadata({
  title: 'Protocol specification',
  description: 'Read the localLOOP draft protocol specification, data contracts, and implementation requirements.',
  path: '/protocol/spec',
});

export default function ProtocolSpecPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Specification v0.2.0</h2>
        <p>
          The normative requirements and API contracts that define interoperable
          localLOOP implementations. No public pilots or deployments yet.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/docs/regulatory-alignment">Compatibility roadmap</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Included in this spec</h3>
        <div className="table-list">
          <div><span>Endpoints</span><div>Core federation and data flows</div></div>
          <div><span>Compliance</span><div>Minimum operational requirements</div></div>
          <div><span>Security</span><div>Operator and developer guardrails</div></div>
        </div>
      </div>
      <div className="content-panel">
        <h3>Canonical draft artifact</h3>
        <p>
          The protocol repository owns this draft. Its normative and proposed language
          describes a model for discussion; it is not evidence of implementation,
          deployment, certification, compliance, economic backing, governance operation,
          or outcomes.
        </p>
        <p>
          Readers who choose to inspect it can open the{' '}
          <a href="/projects/loop-protocol/SPECIFICATION.md">canonical draft artifact</a>.
        </p>
      </div>
    </div>
  )
}
