import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { Card } from './components/ui/Card';
import { CardGrid } from './components/ui/CardGrid';

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      {/* Hero Section - Simplified */}
      <section className="hero hero-wide">
        <div className="hero-wide-bg" aria-hidden="true">
          <span className="loop-orbit loop-orbit-one"></span>
          <span className="loop-orbit loop-orbit-two"></span>
          <span className="loop-orbit loop-orbit-three"></span>
        </div>
        <div className="hero-top">
          <div className="hero-wide-content">
            <div className="hero-kicker">LOOP Protocol</div>
            <h2>Circular Economy Infrastructure for Cities</h2>
            <p>
              A federated protocol enabling cities to track, exchange, and settle
              material flows while maintaining local sovereignty.
            </p>
            <div className="cta-row">
              <a className="button primary" href="/protocol">
                Explore the Protocol
              </a>
            </div>
            <div className="status-banner" data-api-status>
              Checking backend status…
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="loop-sculpture">
              <span className="loop-core"></span>
            </div>
            <span className="loop-glow"></span>
          </div>
        </div>
      </section>

      {/* How LOOP Works - Visual Flow */}
      <section className="section">
        <h3>How LOOP Works</h3>
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
        <h3>Get Started</h3>
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
        <h3>Explore</h3>
        <CardGrid columns="auto">
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
        <div className="content-panel" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <h3 style={{ marginBottom: '12px' }}>Ready to join the circular economy?</h3>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
            Whether you're a city, operator, or developer, there's a place for you in the LOOP ecosystem.
          </p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
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
