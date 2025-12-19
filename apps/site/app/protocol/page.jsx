import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export default function ProtocolPage() {
  return (
    <>
      <SiteHeader subtitle="Protocol Overview" />

      <section className="hero">
        <div className="hero-card">
          <div className="badge">Protocol essentials</div>
          <h2>The LOOP Protocol defines how city loops federate.</h2>
          <p>
            Explore the specification, changelog, and security requirements that guide
            implementations. This is an early, low-TRL concept with no public pilots yet.
          </p>
          <div className="cta-row">
            <a className="button primary" href="/protocol/spec">Read specification</a>
            <a className="button secondary" href="/protocol/changelog">View changelog</a>
          </div>
        </div>
        <div className="hero-card">
          <h3>Protocol scope</h3>
          <p>Normative requirements and flows for interoperability across cities.</p>
          <div className="table-list">
            <div><span>Federation</span><div>Cross-city interoperability and syncing</div></div>
            <div><span>Security</span><div>Disclosure, cryptography, and operator guidance</div></div>
            <div><span>Governance</span><div>RFC process and change control</div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Protocol references</h3>
        <div className="grid">
          <div className="card">
            <h4>Specification v0.1</h4>
            <p>Normative requirements, API endpoints, and federation flows.</p>
            <a href="/protocol/spec">Open specification</a>
          </div>
          <div className="card">
            <h4>Changelog</h4>
            <p>Track released changes and planned updates.</p>
            <a href="/protocol/changelog">Open changelog</a>
          </div>
          <div className="card">
            <h4>Security policy</h4>
            <p>Disclosure process, cryptography, and operator requirements.</p>
            <a href="/protocol/security">Open security policy</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
