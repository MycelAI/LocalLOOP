import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';

export default function HomePage() {
  return (
    <>
      <SiteHeader subtitle="Protocol Platform" />

      <section className="hero">
        <div className="hero-card">
          <div className="badge">Federated circular economy infrastructure</div>
          <h2>Host the entire LOOP Protocol stack in one place.</h2>
          <p>
            This hub curates the specification, schemas, examples, and governance docs for
            the LOOP Protocol. Use it as the canonical reference for implementers and city
            operators. The project is an early, low-TRL concept with no public pilots yet.
          </p>
          <div className="cta-row">
            <a className="button primary" href="/protocol/spec">Read the Spec</a>
            <a className="button secondary" href="/interest">Register interest</a>
          </div>
        </div>
        <div className="hero-card">
          <h3>What lives in this hub</h3>
          <p>
            A single place for protocol artifacts, implementation guidance, and sample
            city portal experiences.
          </p>
          <div className="table-list">
            <div><span>Protocol</span><div>Specification, changelog, security notes</div></div>
            <div><span>Library</span><div>Schemas and validated example payloads</div></div>
            <div><span>Docs</span><div>Operator and developer guides</div></div>
            <div><span>Portals</span><div>MaterialDNA and demo city landing pages</div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Navigate the platform</h3>
        <div className="grid">
          <div className="card">
            <h4>Protocol Overview</h4>
            <p>Specifications, changelog, and security requirements.</p>
            <a href="/protocol">Open protocol overview</a>
          </div>
          <div className="card">
            <h4>Library</h4>
            <p>Schema definitions and example payloads for integrators.</p>
            <a href="/library">Open the library</a>
          </div>
          <div className="card">
            <h4>Docs</h4>
            <p>Implementation, operations, and incident response guides.</p>
            <a href="/docs">Read operator docs</a>
          </div>
          <div className="card">
            <h4>Governance</h4>
            <p>RFC process, templates, and proposal references.</p>
            <a href="/governance">Review governance</a>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Core components</h3>
        <div className="grid">
          <div className="card">
            <h4>MaterialDNA</h4>
            <p>Material identity layer for traceability across city loops.</p>
            <a href="/materialDNA">Explore MaterialDNA</a>
          </div>
          <div className="card">
            <h4>LoopCoin</h4>
            <p>Settlement primitives for circular economy transactions.</p>
            <a href="/library/schemas">View schema</a>
          </div>
          <div className="card">
            <h4>LoopSignal</h4>
            <p>Community signal and preference mechanisms.</p>
            <a href="/library/schemas">View schema</a>
          </div>
          <div className="card">
            <h4>City portals</h4>
            <p>Localized experiences for cities and operators.</p>
            <a href="/cities">See city portals</a>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Get involved</h3>
        <div className="grid">
          <div className="card">
            <h4>Express interest</h4>
            <p>Public registry for organizations exploring LocalLoop.</p>
            <a href="/interest">Submit interest</a>
          </div>
          <div className="card">
            <h4>Contribute</h4>
            <p>Contribution paths, code of conduct, and governance.</p>
            <a href="/contribute">Contribution guide</a>
          </div>
          <div className="card">
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
