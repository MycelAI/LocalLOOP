import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Platform concepts', path: '/platform' });

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
          <a href="/interest">Express interest</a> for possible future research updates.
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
            <p>Draft product-identity fields for discussing product-passport interoperability; not an EU DPP compliance claim.</p>
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
            <p>Draft node-issued value and settlement data fields for controlled lab scenarios.</p>
          </a>
          <a className="card has-icon" href="/platform/loopsignal">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-broadcast"></i>
            </span>
            <h4>LoopSignal</h4>
            <p>Draft preference-signal data for exploring routing and matching scenarios.</p>
          </a>
          <a className="card has-icon" href="/platform/loopcost">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-calculator"></i>
            </span>
            <h4>LoopCost</h4>
            <p>Draft routing-cost formula combining a stated price, illustrative penalties, and distance inputs; it does not guarantee local cost outcomes.</p>
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
            <p>Concept sketches for how a city could present local initiatives and example metrics.</p>
          </a>
          <a className="card has-icon" href="/platform/demo-city">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-compass"></i>
            </span>
            <h4>DEMO City</h4>
            <p>Read-only sample portal showing illustrative lab data and interface patterns.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
