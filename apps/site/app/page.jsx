import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { Card } from './components/ui/Card';
import { CardGrid } from './components/ui/CardGrid';
import { KeyConceptsShowcase } from './components/KeyConceptsShowcase';
import { MaturityStatus } from './components/MaturityStatus';
import { createMetadata } from './config/metadata';

export const metadata = createMetadata({
  title: 'Circular Economy Infrastructure for Cities',
  description: 'Explore localLOOP lab documentation, draft schemas, and evidence-qualified demonstrations.',
  path: '/',
  brandFirst: true,
});

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
      <section className="hero-section">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-gradient"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <i className="ph-bold ph-globe" aria-hidden="true"></i>
            Local Optimization with Overflow Protocol
          </div>
          <h1 className="hero-title">
            Circular Economy<br />
            <span className="hero-title-accent">Infrastructure for Cities</span>
          </h1>
          <p className="hero-description">
            An open protocol for cities to discover, exchange, and trace material and product
            flows across city boundaries.
          </p>
          <MaturityStatus className="hero-maturity">Lab demo only — draft schemas and controlled demonstrations, no public pilots or production deployments.</MaturityStatus>
          <div className="hero-actions">
            <a className="button primary" href="/protocol">
              <i className="ph-bold ph-book-open" aria-hidden="true"></i>
              Read the Spec
            </a>
            <a className="button secondary" href="/interest">
              <i className="ph-bold ph-hand-waving" aria-hidden="true"></i>
              Express Interest
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">11</span>
              <span className="hero-stat-label">Unified Schemas</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-value">v0.2</span>
              <span className="hero-stat-label">Protocol Version</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-value" data-api-status-indicator>
                <i className="ph-fill ph-circle"></i>
              </span>
              <span className="hero-stat-label">Lab Demo</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-loop-icon">
            <img
              src="/assets/local-loop-logo.png"
              alt=""
              aria-hidden="true"
              width={120}
              height={120}
            />
          </div>
          <div className="hero-orbit hero-orbit-1"></div>
          <div className="hero-orbit hero-orbit-2"></div>
          <div className="hero-orbit hero-orbit-3"></div>
        </div>
      </section>

      {/* Key Concepts */}
      <section className="kc-section">
        <div className="kc-header">
          <span className="kc-eyebrow">Core Building Blocks</span>
          <h2 className="kc-title">Key Concepts</h2>
          <p className="kc-header-note">
            Definitions follow the <a href="/protocol/spec">LOOP Specification (§2 and §2.1)</a>.
          </p>
        </div>
        <KeyConceptsShowcase />
      </section>

      {/* How LOOP Works - Visual Flow */}
      <section className="section">
        <h2 className="section-title">How LOOP Works</h2>
        <div className="flow-explainer">
          <div className="flow-step">
            <div className="flow-step-icon">
              <i className="ph-bold ph-fingerprint"></i>
            </div>
            <span className="flow-step-title">Register</span>
            <span className="flow-step-desc">Tag materials or products</span>
          </div>
          <span className="flow-arrow" aria-hidden="true">
            <i className="ph-bold ph-arrow-right"></i>
          </span>
          <div className="flow-step">
            <div className="flow-step-icon">
              <i className="ph-bold ph-tag"></i>
            </div>
            <span className="flow-step-title">Offer</span>
            <span className="flow-step-desc">List available resources</span>
          </div>
          <span className="flow-arrow" aria-hidden="true">
            <i className="ph-bold ph-arrow-right"></i>
          </span>
          <div className="flow-step">
            <div className="flow-step-icon">
              <i className="ph-bold ph-handshake"></i>
            </div>
            <span className="flow-step-title">Match</span>
            <span className="flow-step-desc">Find circular opportunities</span>
          </div>
          <span className="flow-arrow" aria-hidden="true">
            <i className="ph-bold ph-arrow-right"></i>
          </span>
          <div className="flow-step">
            <div className="flow-step-icon">
              <i className="ph-bold ph-recycle"></i>
            </div>
            <span className="flow-step-title">Transfer</span>
            <span className="flow-step-desc">Complete the loop</span>
          </div>
        </div>
      </section>

      {/* Who is this for? */}
      <section className="section">
        <h2 className="section-title">Who is this for?</h2>
        <div className="concepts-grid">
          <div className="concept-card">
            <div className="concept-icon">
              <i className="ph-bold ph-buildings" aria-hidden="true"></i>
            </div>
            <h3>Cities & Municipalities</h3>
            <p>Explore draft data fields and interoperability questions relevant to circular procurement and product-passport research.</p>
            <a href="/platform/city-portals">City portals →</a>
          </div>
          <div className="concept-card">
            <div className="concept-icon">
              <i className="ph-bold ph-factory" aria-hidden="true"></i>
            </div>
            <h3>Operators & Logistics</h3>
            <p>
              Run lab nodes, integrate LOOP flows into existing material management systems,
              and participate in federated exchanges between municipalities and circular
              economy platforms.
            </p>
            <a href="/docs/implementation">Implementation guide →</a>
          </div>
          <div className="concept-card">
            <div className="concept-icon">
              <i className="ph-bold ph-flask" aria-hidden="true"></i>
            </div>
            <h3>Researchers & Labs</h3>
            <p>
              Explore open schemas, contribute to the protocol specification, and test
              circular economy models using the lab API and validated example payloads.
            </p>
            <a href="/library">Schema library →</a>
          </div>
        </div>
      </section>

      {/* Quick Start - 3 Clear Paths */}
      <section className="section">
        <h2 className="section-title">Get Started</h2>
        <div className="quick-start">
          <a href="/protocol" className="quick-start-card">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-book-open"></i>
            </span>
            <h3>Understand</h3>
            <p>Read the protocol specification and learn how LOOP enables circular economies.</p>
          </a>
          <a href="/docs" className="quick-start-card">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-code"></i>
            </span>
            <h3>Implement</h3>
            <p>Follow implementation guides, API docs, and integrate LOOP into your systems.</p>
          </a>
          <a href="/interest" className="quick-start-card">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-users"></i>
            </span>
            <h3>Participate</h3>
            <p>Express interest, join the community, and help shape the future of circular economy.</p>
          </a>
        </div>
      </section>

      {/* Explore More */}
      <section className="section">
        <h2 className="section-title">Explore</h2>
        <CardGrid columns={2}>
          <Card
            icon="scroll"
            title="Protocol Spec"
            description="Full specification, schemas, and security requirements."
            href="/protocol/spec"
          />
          <Card
            icon="books"
            title="Schema Library"
            description="JSON-LD contexts, JSON Schemas, and example payloads."
            href="/library"
          />
          <Card
            icon="buildings"
            title="City Portals"
            description="Explore illustrative city-portal patterns for local material flows and initiatives (lab concept, no live deployments)."
            href="/platform/city-portals"
          />
          <Card
            icon="gavel"
            title="Governance"
            description="RFC process, decision-making, and community proposals."
            href="/governance"
          />
        </CardGrid>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-panel">
          <h2>Ready to shape the circular economy?</h2>
          <p>
            Whether you represent a city, a research lab, or a circular economy operator —
            register interest to be contacted about future research or lab-demonstration discussions.
          </p>
          <div className="cta-row">
            <a className="button primary" href="/interest">
              Register Interest
            </a>
            <a className="button secondary" href="/platform/demo-city">
              Explore the demo
            </a>
          </div>
        </div>
      </section>

      </main>
      <SiteFooter />
    </>
  );
}
