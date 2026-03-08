import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export default function SmartContractsPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Smart Contract RFC</h2>
        <p>
          Draft RFC describing how smart contracts could automate settlement flows.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/governance">Back to governance</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Draft scope</h3>
        <div className="table-list">
          <div><span>Automation</span><div>Settlement and escrow flows</div></div>
          <div><span>Interoperability</span><div>Optional integration points</div></div>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/rfcs/0004-smart-contract-integration.md" />
      </div>
    </div>
  );
}
