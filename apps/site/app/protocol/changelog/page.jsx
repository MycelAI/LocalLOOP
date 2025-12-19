export default function ProtocolChangelogPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Release history</div>
        <h2>Track protocol changes and milestones.</h2>
        <p>
          The changelog captures updates to the protocol and planned roadmap items.
          The project is early-stage with no public pilots yet.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/CHANGELOG.md&title=Changelog"
          >
            Open changelog
          </a>
          <a className="button secondary" href="/protocol">Back to overview</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>How updates ship</h3>
        <p>Changes follow the RFC process and are communicated in releases.</p>
        <div className="table-list">
          <div><span>RFC review</span><div>Proposals are reviewed before adoption</div></div>
          <div><span>Versioning</span><div>Tracked by semantic changelog entries</div></div>
        </div>
      </div>
    </div>
  );
}
