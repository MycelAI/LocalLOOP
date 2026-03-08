export default function ProtocolPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2 className="hub-heading">Protocol</h2>
        <p>
          Explore the specification, changelog, and security requirements that guide
          implementations. This is an early, low-TRL concept with no public pilots yet.
        </p>
      </div>

      <div className="content-panel">
        <div className="grid">
          <a className="card has-icon" href="/protocol/spec">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-scroll"></i>
            </span>
            <h4>Specification v0.2.0</h4>
            <p>Normative requirements, API endpoints, and federation flows.</p>
          </a>
          <a className="card has-icon" href="/protocol/changelog">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-archive-box"></i>
            </span>
            <h4>Changelog</h4>
            <p>Track released changes and planned updates.</p>
          </a>
          <a className="card has-icon" href="/protocol/security">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-shield-check"></i>
            </span>
            <h4>Security Policy</h4>
            <p>Disclosure process, cryptography, and operator requirements.</p>
          </a>
          <a className="card has-icon card-ref" href="/docs/regulatory-alignment">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-scales"></i>
            </span>
            <h4>Compatibility Roadmap</h4>
            <p>Long-horizon plan for DPP, waste, packaging, and battery alignment.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
