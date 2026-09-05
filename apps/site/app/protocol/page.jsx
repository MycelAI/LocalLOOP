import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Protocol', path: '/protocol' });

export default function ProtocolPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">Protocol</h1>
        <p>
          Explore the specification, changelog, and security requirements that guide
          implementations. This is an early, low-TRL concept with no public pilots yet.
        </p>
      </div>

      <div className="content-panel">
        <div className="grid">
          <a className="card has-icon" href="/protocol/spec/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-scroll"></i>
            </span>
            <h3>Specification v0.2.0</h3>
            <p>Normative requirements, API endpoints, and federation flows.</p>
          </a>
          <a className="card has-icon" href="/protocol/changelog/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-archive-box"></i>
            </span>
            <h3>Changelog</h3>
            <p>Track released changes and planned updates.</p>
          </a>
          <a className="card has-icon" href="/protocol/security/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-shield-check"></i>
            </span>
            <h3>Security Policy</h3>
            <p>Disclosure process, cryptography, and operator requirements.</p>
          </a>
          <a className="card has-icon card-ref" href="/docs/regulatory-alignment/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-scales"></i>
            </span>
            <h3>Compatibility Roadmap</h3>
            <p>Long-horizon plan for DPP, waste, packaging, and battery alignment.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
