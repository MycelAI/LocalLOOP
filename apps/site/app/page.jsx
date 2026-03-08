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
            Local Optimization with Overflow Protocol
          </div>
          <h1 className="hero-title">
            Circular Economy<br />
            <span className="hero-title-accent">Infrastructure for Cities</span>
          </h1>
          <p className="hero-description">
            A federated, Digital Product Passport (DPP)-compatible protocol enabling cities to track,
            exchange, and settle material and product flows while maintaining local sovereignty.
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
      <section className="section">
        <h2 className="section-title">Key Concepts</h2>
        <div className="concepts-grid">
          <div className="concept-card">
            <div className="concept-icon">
              <i className="ph-bold ph-infinity" aria-hidden="true"></i>
            </div>
            <h3>LOOP</h3>
            <p>
              <strong>Local Optimization with Overflow Protocol</strong> — An open, federated standard
              for tracking material and product flows between cities. LOOP enables municipalities to share
              surplus resources, coordinate circular economy initiatives, and maintain sovereignty over
              local data while participating in regional exchanges — built around MaterialDNA, ProductDNA,
              LoopCoin, and LoopSignal.
            </p>
          </div>
          <div className="concept-card">
            <div className="concept-icon">
              <i className="ph-bold ph-fingerprint" aria-hidden="true"></i>
            </div>
            <h3>MaterialDNA</h3>
            <p>
              A unique digital identity for physical materials. MaterialDNA captures a material's
              composition, origin, quality metrics, and chain of custody — enabling trusted exchanges
              and full lifecycle tracking from source to reuse. Think of it as a passport for materials
              in the circular economy.
            </p>
          </div>
          <div className="concept-card">
            <div className="concept-icon">
              <i className="ph-bold ph-cube" aria-hidden="true"></i>
            </div>
            <h3>ProductDNA</h3>
            <p>
              A DPP-aligned identity for finished products. ProductDNA captures product category,
              condition, manufacturer, lifecycle stage, and references to constituent MaterialDNA
              entries — enabling product-level reuse, trading, and EU Digital Product Passport
              compliance (ESPR Art. 9-10).
            </p>
          </div>
          <div className="concept-card">
            <div className="concept-icon">
              <i className="ph-bold ph-coins" aria-hidden="true"></i>
            </div>
            <h3>LoopCoin</h3>
            <p>
              A node-issued local currency used to settle material and product transfers between
              federation peers. LoopCoin carries expiry and decay rules defined by each node,
              keeping value circulating locally while enabling inter-node clearing.
            </p>
          </div>
          <div className="concept-card">
            <div className="concept-icon">
              <i className="ph-bold ph-broadcast" aria-hidden="true"></i>
            </div>
            <h3>LoopSignal</h3>
            <p>
              A community preference signal that expresses demand or surplus intent for specific
              material categories. LoopSignals inform routing and matching across the federation,
              helping nodes prioritise the right resources for the right places.
            </p>
          </div>
          <div className="concept-card">
            <div className="concept-icon">
              <i className="ph-bold ph-calculator" aria-hidden="true"></i>
            </div>
            <h3>LoopCost</h3>
            <p>
              The total routing cost for any material or product transfer: base price plus export
              and import penalties (derived from LoopSignals) plus distance cost. LoopCost ensures
              local exchanges are always cheaper than cross-boundary ones, keeping circular value
              circulating close to its source.
            </p>
          </div>
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
