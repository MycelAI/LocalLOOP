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
          The localLOOP platform comprises five protocol concepts — two identity layers,
          a local currency, a community signal mechanism, and a routing cost model — plus
          city portals that surface local circular economy initiatives.
        </p>
        <div className="status-notice">
          <strong>Early-stage research.</strong> All components are lab-demo concepts.
          There are no active city deployments or public pilots yet.
          <a href="/interest">Register interest</a> to be considered for future controlled pilots.
        </div>
      </div>

      <div className="content-panel">
        <h3>Identity layers</h3>
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
        </div>
      </div>

      <div className="content-panel">
        <h3>Exchange mechanics</h3>
        <div className="grid">
          <a className="card has-icon" href="/platform/loopcoin">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-coins"></i>
            </span>
            <h4>LoopCoin</h4>
            <p>Node-issued local currency with expiry and decay rules, used to settle material and product transfers between federation peers.</p>
          </a>
          <a className="card has-icon" href="/platform/loopsignal">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-broadcast"></i>
            </span>
            <h4>LoopSignal</h4>
            <p>Community preference signal expressing demand or surplus intent for material categories, informing routing and matching across the federation.</p>
          </a>
          <a className="card has-icon" href="/platform/loopcost">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-calculator"></i>
            </span>
            <h4>LoopCost</h4>
            <p>Total routing cost for any transfer: base price plus export and import penalties from LoopSignals plus distance cost — keeping local exchanges cheapest.</p>
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>City portals</h3>
        <div className="grid">
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
