import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { Card } from './components/ui/Card';
import { CardGrid } from './components/ui/CardGrid';

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      {/* Hero Section - Centered, Modern */}
      <section className="hero-section">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-gradient"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <i className="ph-bold ph-globe" aria-hidden="true"></i>
            Open Protocol
          </div>
          <h1 className="hero-title">
            Circular Economy<br />
            <span className="hero-title-accent">Infrastructure for Cities</span>
          </h1>
          <p className="hero-description">
            A federated protocol enabling cities to track, exchange, and settle
            material flows while maintaining local sovereignty.
          </p>
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
              <span className="hero-stat-value">4</span>
              <span className="hero-stat-label">Core Schemas</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-value">v0.1</span>
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
            <i className="ph-duotone ph-recycle"></i>
          </div>
          <div className="hero-orbit hero-orbit-1"></div>
          <div className="hero-orbit hero-orbit-2"></div>
          <div className="hero-orbit hero-orbit-3"></div>
        </div>
      </section>

      {/* How LOOP Works - Visual Flow */}
      <section className="section">
        <h2 className="section-title">How LOOP Works</h2>
        <div className="flow-explainer">
          <div className="flow-step">
            <div className="flow-step-icon">
              <i className="ph-bold ph-fingerprint"></i>
            </div>
            <span className="flow-step-title">MaterialDNA</span>
            <span className="flow-step-desc">Tag materials with identity</span>
          </div>
          <span className="flow-arrow" aria-hidden="true">
            <i className="ph-bold ph-arrow-right"></i>
          </span>
          <div className="flow-step">
            <div className="flow-step-icon">
              <i className="ph-bold ph-tag"></i>
            </div>
            <span className="flow-step-title">Offer</span>
            <span className="flow-step-desc">List available materials</span>
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
            description="See LOOP in action with city-specific implementations."
            href="/cities"
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
      <section className="section">
        <div className="cta-panel">
          <h2>Ready to join the circular economy?</h2>
          <p>
            Whether you're a city, operator, or developer, there's a place for you in the LOOP ecosystem.
          </p>
          <div className="cta-row">
            <a className="button primary" href="/interest">
              Express Interest
            </a>
            <a className="button secondary" href="/contribute">
              Contribute
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
