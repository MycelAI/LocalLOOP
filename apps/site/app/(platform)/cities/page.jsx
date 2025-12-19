export default function CitiesPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">City portals</div>
        <h2>LocalLoop city landing pages and demos.</h2>
        <p>
          City portals will showcase local initiatives, partners, and impact metrics.
          There are no active deployments yet.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/DEMO-City">View DEMO City</a>
          <a className="button secondary" href="/interest">Register interest</a>
        </div>
      </div>

      <div className="content-panel">
        <h3>What to expect</h3>
        <div className="table-list">
          <div><span>Profiles</span><div>City goals and program details</div></div>
          <div><span>Partners</span><div>Verified operators and suppliers</div></div>
          <div><span>Metrics</span><div>Impact and material flow tracking</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Available portals</h3>
        <div className="grid">
          <div className="card" data-icon="DC">
            <h4>DEMO City</h4>
            <p>Sample portal to illustrate a future city experience.</p>
            <a href="/DEMO-City">Open demo portal</a>
          </div>
          <div className="card" data-icon="FT">
            <h4>Future cities</h4>
            <p>City subdomains will launch as pilots begin.</p>
            <a href="/interest">Express interest</a>
          </div>
        </div>
      </div>
    </div>
  );
}
