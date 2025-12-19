export default function RfcGuidePage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">RFC process</div>
        <h2>Governance through Requests for Comments.</h2>
        <p>
          RFCs document protocol proposals and decisions. Use the guide below to
          understand how changes are reviewed.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/rfcs/README.md&title=RFCs"
          >
            Open RFC guide
          </a>
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
    </div>
  );
}
