import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'City portal concepts', path: '/platform/city-portals' });

export default function CityPortalsPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2>City Portals</h2>
        <div className="status-notice">
          <strong>No active deployments.</strong> City portals are in the design and concept phase.
          This page describes illustrative portal patterns for future research discussions.
        </div>
        <p>
          A future implementation could present local initiatives, partner information, and material-flow
          metrics; this site does not verify or operate those data sources.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/platform/demo-city">View DEMO City</a>
          <a className="button secondary" href="/interest">Register interest</a>
        </div>
      </div>

      <div className="content-panel">
        <h3>What to expect</h3>
        <div className="table-list">
          <div><span>Profiles</span><div>City goals and program details</div></div>
          <div><span>Partners</span><div>Illustrative operator and supplier information</div></div>
          <div><span>Metrics</span><div>Impact and material flow tracking</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Available portals</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-city"></i>
            </span>
            <h4>DEMO City</h4>
            <p>Sample portal to illustrate a future city experience.</p>
            <a href="/platform/demo-city">Open demo portal</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-compass"></i>
            </span>
            <h4>Future cities</h4>
            <p>Future city participation is exploratory; no launch or deployment is scheduled here.</p>
            <a href="/interest">Express interest</a>
          </div>
        </div>
      </div>
    </div>
  );
}
