export default function ContributePage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Contribute</div>
        <h2>Help shape the LocalLoop protocol.</h2>
        <p>
          Contributions are welcome across specs, schemas, docs, and tooling.
          This project is early-stage, so feedback is especially valuable.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/CONTRIBUTING.md&title=Contributing"
          >
            Read contribution guide
          </a>
          <a className="button secondary" href="/projects">Project hub</a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Community standards</h3>
        <div className="table-list">
          <div><span>Code of conduct</span><div>Shared expectations for collaboration</div></div>
          <div><span>License</span><div>MIT licensed, open collaboration</div></div>
        </div>
        <div className="cta-row">
          <a
            className="button secondary"
            href="/viewer.html?path=projects/loop-protocol/CODE_OF_CONDUCT.md&title=Code%20of%20Conduct"
          >
            Code of conduct
          </a>
        </div>
      </div>
    </div>
  );
}
