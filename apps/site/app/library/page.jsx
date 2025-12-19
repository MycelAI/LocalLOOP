export default function LibraryPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Schemas & examples</div>
        <h2>Everything needed to implement the protocol.</h2>
        <p>
          Browse the schema library and validated example payloads used by implementers
          and node operators. This project is in early concept stage.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/library/schemas">Browse schemas</a>
          <a className="button secondary" href="/library/examples">View examples</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Library coverage</h3>
        <div className="table-list">
          <div><span>Schemas</span><div>MaterialDNA, LoopCoin, LoopSignal, Node Info</div></div>
          <div><span>Examples</span><div>Validated payload flows and transactions</div></div>
        </div>
      </div>
    </div>
  );
}
