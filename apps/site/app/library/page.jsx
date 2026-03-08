export default function LibraryPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2 className="hub-heading">Library</h2>
        <p>
          Browse the schema library and validated example payloads used by implementers
          and node operators. Early concept stage.
        </p>
      </div>

      <div className="content-panel">
        <div className="grid">
          <a className="card has-icon" href="/library/schemas">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-brackets-curly"></i>
            </span>
            <h4>Schemas</h4>
            <p>MaterialDNA, ProductDNA, Offer, Match, Transfer, and more.</p>
          </a>
          <a className="card has-icon" href="/library/examples">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-file-code"></i>
            </span>
            <h4>Examples</h4>
            <p>Validated payload flows and transactions.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
