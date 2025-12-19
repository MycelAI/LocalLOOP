import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <section className="hero hero-wide">
        <div className="hero-wide-bg" aria-hidden="true">
          <span className="loop-orbit loop-orbit-one"></span>
          <span className="loop-orbit loop-orbit-two"></span>
          <span className="loop-orbit loop-orbit-three"></span>
        </div>
        <div className="hero-top">
          <div className="hero-wide-content">
            <div className="hero-kicker">LOOP Protocol</div>
            <h2>Local Optimization with Overflow Protocol (LOOP)</h2>
            <p>
              A proposed federated protocol for material identity, exchange, and settlement
              across city loops. Designed to keep sovereignty local while enabling a shared
              circular economy network.
            </p>
            <div className="cta-row">
              <a className="button primary" href="/protocol/spec">Read the specification</a>
              <a className="button secondary" href="/interest">Register interest</a>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="loop-sculpture">
              <span className="loop-core"></span>
            </div>
            <span className="loop-glow"></span>
          </div>
        </div>
        <div className="hero-wide-panels">
          <div className="hero-panel">
            <h3>MaterialDNA</h3>
            <p>Unified material identity for traceability, provenance, and compliance.</p>
          </div>
          <div className="hero-panel">
            <h3>Federated nodes</h3>
            <p>Autonomous city loops that interoperate through shared schemas.</p>
          </div>
          <div className="hero-panel">
            <h3>Operator playbooks</h3>
            <p>Security, governance, and implementation guidance in one hub.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Navigate the platform</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-scroll"></i>
            </span>
            <h4>Protocol Overview</h4>
            <p>Specifications, changelog, and security requirements.</p>
            <a href="/protocol">Open protocol overview</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-books"></i>
            </span>
            <h4>Library</h4>
            <p>Schema definitions and example payloads for integrators.</p>
            <a href="/library">Open the library</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-notebook"></i>
            </span>
            <h4>Docs</h4>
            <p>Implementation, operations, and incident response guides.</p>
            <a href="/docs">Read operator docs</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-gavel"></i>
            </span>
            <h4>Governance</h4>
            <p>RFC process, templates, and proposal references.</p>
            <a href="/governance">Review governance</a>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Core components</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-fingerprint"></i>
            </span>
            <h4>MaterialDNA</h4>
            <p>Material identity layer for traceability across city loops.</p>
            <a href="/materialDNA">Explore MaterialDNA</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-coins"></i>
            </span>
            <h4>LoopCoin</h4>
            <p>Settlement primitives for circular economy transactions.</p>
            <a href="/library/schemas">View schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-broadcast"></i>
            </span>
            <h4>LoopSignal</h4>
            <p>Community signal and preference mechanisms.</p>
            <a href="/library/schemas">View schema</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-buildings"></i>
            </span>
            <h4>City portals</h4>
            <p>Localized experiences for cities and operators.</p>
            <a href="/cities">See city portals</a>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Get involved</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-handshake"></i>
            </span>
            <h4>Express interest</h4>
            <p>Public registry for organizations exploring LocalLoop.</p>
            <a href="/interest">Submit interest</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-git-pull-request"></i>
            </span>
            <h4>Contribute</h4>
            <p>Contribution paths, code of conduct, and governance.</p>
            <a href="/contribute">Contribution guide</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-folder-open"></i>
            </span>
            <h4>Project hub</h4>
            <p>Repository links, spec viewer, and supporting docs.</p>
            <a href="/projects">Open project hub</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
