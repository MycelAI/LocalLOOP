'use client';
import { useState, useEffect } from 'react';

const CONCEPTS = [
  {
    slug: 'loop',
    num: '01',
    name: 'LOOP',
    fullName: 'Local Optimization with Overflow Protocol',
    image: '/assets/images/localloop-01-loop-protocol-overview-16x9.png',
    desc: 'An open, federated standard for tracking material and product flows between cities. LOOP enables municipalities to share surplus resources, coordinate circular economy initiatives, and maintain data sovereignty while participating in regional exchanges — built around MaterialDNA, ProductDNA, LoopCoin, and LoopSignal.',
    href: '/protocol',
    cta: 'Read the spec',
  },
  {
    slug: 'materialdna',
    num: '02',
    name: 'MaterialDNA',
    fullName: 'Material Identity & Digital Passport',
    image: '/assets/images/localloop-02-materialdna-material-identity-16x9.png',
    desc: 'A unique digital identity for physical materials. MaterialDNA captures a material\'s composition, origin, quality metrics, and chain of custody — enabling trusted exchanges and full lifecycle tracking from source to reuse. Think of it as a passport for materials in the circular economy.',
    href: '/platform/materialdna',
    cta: 'Explore MaterialDNA',
  },
  {
    slug: 'productdna',
    num: '03',
    name: 'ProductDNA',
    fullName: 'DPP-Aligned Product Passport',
    image: '/assets/images/localloop-03-productdna-product-passport-16x9.png',
    desc: 'A DPP-aligned identity for finished products. ProductDNA captures product category, condition, manufacturer, lifecycle stage, and references to constituent MaterialDNA entries — enabling product-level reuse, trading, and EU Digital Product Passport compliance (ESPR Art. 9–10).',
    href: '/platform/productdna',
    cta: 'Explore ProductDNA',
  },
  {
    slug: 'loopcoin',
    num: '04',
    name: 'LoopCoin',
    fullName: 'Local Settlement Currency',
    image: '/assets/images/localloop-04-loopcoin-local-settlement-16x9.png',
    desc: 'A node-issued local currency used to settle material and product transfers between federation peers. LoopCoin carries expiry and decay rules defined by each node, keeping value circulating locally while enabling inter-node clearing.',
    href: '/platform/loopcoin',
    cta: 'Explore LoopCoin',
  },
  {
    slug: 'loopsignal',
    num: '05',
    name: 'LoopSignal',
    fullName: 'Community Preference Signal',
    image: '/assets/images/localloop-05-loopsignal-community-preference-16x9.png',
    desc: 'A community preference signal that expresses demand or surplus intent for specific material categories. LoopSignals inform routing and matching across the federation, helping nodes prioritise the right resources for the right places at the right time.',
    href: '/platform/loopsignal',
    cta: 'Explore LoopSignal',
  },
  {
    slug: 'loopcost',
    num: '06',
    name: 'LoopCost',
    fullName: 'Routing Cost Function',
    image: '/assets/images/localloop-06-loopcost-routing-cost-16x9.png',
    desc: 'The total routing cost for any material or product transfer: base price plus export and import penalties derived from LoopSignals, plus distance cost. LoopCost ensures local exchanges are always cheaper than cross-boundary ones, keeping circular value close to its source.',
    href: '/platform/loopcost',
    cta: 'Explore LoopCost',
  },
];

const INTERVAL_MS = 6000;

export function KeyConceptsShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % CONCEPTS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, active]);

  const c = CONCEPTS[active];

  return (
    <div
      className="kc-showcase"
      data-paused={String(paused)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <nav className="kc-tabs" aria-label="Key concepts navigation">
        {CONCEPTS.map((concept, i) => (
          <button
            key={concept.slug}
            className={`kc-tab${active === i ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            aria-current={active === i ? 'true' : undefined}
            type="button"
          >
            <span className="kc-tab-num">{concept.num}</span>
            <span className="kc-tab-name">{concept.name}</span>
            {active === i && (
              <span key={`bar-${i}`} className="kc-tab-bar" aria-hidden="true" />
            )}
          </button>
        ))}
      </nav>

      <div className="kc-panel" key={active} aria-live="polite">
        <div className="kc-panel-media">
          <img
            src={c.image}
            alt={`${c.name} — ${c.fullName}`}
            className="kc-panel-img"
          />
          <div className="kc-panel-shimmer" aria-hidden="true" />
        </div>

        <div className="kc-panel-content">
          <div className="kc-meta-row">
            <span className="kc-panel-num">{c.num}</span>
            <span className="kc-panel-tag">Core concept</span>
          </div>
          <h3 className="kc-panel-name">{c.name}</h3>
          <p className="kc-panel-subtitle">{c.fullName}</p>
          <p className="kc-panel-desc">{c.desc}</p>
          <a href={c.href} className="kc-panel-cta">
            {c.cta}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="kc-nav-dots" aria-hidden="true">
        {CONCEPTS.map((concept, i) => (
          <button
            key={concept.slug}
            className={`kc-dot${active === i ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            tabIndex={-1}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
