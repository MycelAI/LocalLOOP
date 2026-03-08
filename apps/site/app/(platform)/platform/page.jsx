export const metadata = {
  alternates: {
    canonical: '/platform',
  },
};

export default function PlatformPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Platform Hub</div>
        <h2>The localLOOP platform — identity, portals, and demo tools.</h2>
        <p>
          The localLOOP platform consists of two identity layers — MaterialDNA and ProductDNA —
          for tracking materials and finished products across circular economy loops, plus city
          portals that surface local initiatives and loop activity. All components are early-stage
          lab demos with no public pilots or deployments yet.
        </p>
      </div>

      <div className="content-panel">
        <h3>Platform sections</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-fingerprint"></i>
            </span>
            <h4>MaterialDNA</h4>
            <p>Identification layer for raw and processed materials across city loops.</p>
            <a href="/platform/materialdna">Open MaterialDNA</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-cube"></i>
            </span>
            <h4>ProductDNA</h4>
            <p>Digital passport layer for finished products, aligned with EU DPP requirements.</p>
            <a href="/platform/productdna">Open ProductDNA</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-city"></i>
            </span>
            <h4>City Portals</h4>
            <p>City landing pages showcasing local initiatives, partners, and impact metrics.</p>
            <a href="/platform/city-portals">View city portals</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-compass"></i>
            </span>
            <h4>DEMO City</h4>
            <p>Sample city portal illustrating the future localLOOP city portal experience.</p>
            <a href="/platform/demo-city">Open DEMO City</a>
          </div>
        </div>
      </div>
    </div>
  );
}
