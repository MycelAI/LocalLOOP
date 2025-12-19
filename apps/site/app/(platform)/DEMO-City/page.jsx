export default function DemoCityPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Sample city portal</div>
        <h2>DEMO City: how a LocalLoop city portal could look.</h2>
        <p>
          This is a mock landing page to illustrate the future city portal experience.
          There are no active deployments yet.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/interest">Register interest</a>
          <a className="button secondary" href="/cities">Back to city portals</a>
        </div>
      </div>

      <div className="content-panel">
        <h3>What a city portal will include</h3>
        <p>
          As the platform evolves, each city portal will surface loop metrics, initiatives,
          and partner listings.
        </p>
        <div className="table-list">
          <div><span>Initiatives</span><div>Local pilots and priority material streams</div></div>
          <div><span>Partners</span><div>Verified contributors and operators</div></div>
          <div><span>Metrics</span><div>Impact tracking and reporting</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Prototype modules</h3>
        <div className="grid">
          <div className="card">
            <h4>City profile</h4>
            <p>Population, circular economy goals, and governance model.</p>
            <a href="/interest">Express interest</a>
          </div>
          <div className="card">
            <h4>Material streams</h4>
            <p>Catalog of priority material categories and current bottlenecks.</p>
            <a href="/viewer.html?path=projects/loop-protocol/README.md&title=LOOP%20Protocol%20README">Review the protocol</a>
          </div>
          <div className="card">
            <h4>Data integrations</h4>
            <p>Planned data sources, schemas, and interoperability guidance.</p>
            <a href="/viewer.html?path=projects/loop-protocol/docs/implementation-guide.md&title=Implementation%20Guide">Implementation guide</a>
          </div>
        </div>
      </div>
    </div>
  );
}
