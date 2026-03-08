import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export default function RfcGuidePage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Governance through Requests for Comments.</h2>
        <p>
          RFCs document protocol proposals and decisions. Use the guide below to
          understand how changes are reviewed.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/governance">Back to governance</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>What to include</h3>
        <div className="table-list">
          <div><span>Motivation</span><div>Problem statement and context</div></div>
          <div><span>Proposal</span><div>Specification changes and impacts</div></div>
          <div><span>Review</span><div>Discussion and acceptance criteria</div></div>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/rfcs/README.md" />
      </div>
    </div>
  );
}
