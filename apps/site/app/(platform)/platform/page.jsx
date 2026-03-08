export const metadata = {
  alternates: {
    canonical: '/platform',
  },
};

export default function PlatformPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2 className="hub-heading">Platform</h2>
        <p>
          Two identity layers — MaterialDNA and ProductDNA — for tracking materials and
          finished products across circular economy loops, plus city portals surfacing local
          initiatives. All components are early-stage lab demos with no public pilots yet.
        </p>
      </div>

      <div className="content-panel">
        <div className="grid">
          <a className="card has-icon" href="/platform/materialdna">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-fingerprint"></i>
            </span>
            <h4>MaterialDNA</h4>
            <p>Identification layer for raw and processed materials across city loops.</p>
          </a>
          <a className="card has-icon" href="/platform/productdna">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-cube"></i>
            </span>
            <h4>ProductDNA</h4>
            <p>Digital passport layer for finished products, aligned with EU DPP requirements.</p>
          </a>
          <a className="card has-icon" href="/platform/city-portals">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-city"></i>
            </span>
            <h4>City Portals</h4>
            <p>City landing pages showcasing local initiatives, partners, and impact metrics.</p>
          </a>
          <a className="card has-icon" href="/platform/demo-city">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-compass"></i>
            </span>
            <h4>DEMO City</h4>
            <p>Sample city portal illustrating the future localLOOP city portal experience.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
