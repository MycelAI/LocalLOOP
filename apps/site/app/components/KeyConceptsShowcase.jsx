'use client';
import { useEffect, useId, useRef, useState } from 'react';

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
    desc: 'A draft identity model for physical materials. Lab examples can include composition, origin, quality, and chain-of-custody fields to discuss traceability; the data is not independently verified or a permanent lifecycle record.',
    href: '/platform/materialdna',
    cta: 'Explore MaterialDNA',
  },
  {
    slug: 'productdna',
    num: '03',
    name: 'ProductDNA',
    fullName: 'Draft Product Identity Model',
    image: '/assets/images/localloop-03-productdna-product-passport-16x9.png',
    desc: 'A draft product-identity model for lab exploration. It includes product category, condition, manufacturer, lifecycle stage, and references to constituent MaterialDNA entries; it does not demonstrate Digital Product Passport compliance or deployment readiness.',
    href: '/platform/productdna',
    cta: 'Explore ProductDNA',
  },
  {
    slug: 'loopcoin',
    num: '04',
    name: 'LoopCoin',
    fullName: 'Local Settlement Currency',
    image: '/assets/images/localloop-04-loopcoin-local-settlement-16x9.png',
    desc: 'A draft node-issued value model for lab scenarios. Its example transfer, expiry, decay, and clearing fields do not operate a currency or demonstrate settlement between peers.',
    href: '/platform/loopcoin',
    cta: 'Explore LoopCoin',
  },
  {
    slug: 'loopsignal',
    num: '05',
    name: 'LoopSignal',
    fullName: 'Community Preference Signal',
    image: '/assets/images/localloop-05-loopsignal-community-preference-16x9.png',
    desc: 'A draft preference-signal model for lab scenarios. It can be used as an illustrative routing input, but it does not collect community preferences or determine operational priorities.',
    href: '/platform/loopsignal',
    cta: 'Explore LoopSignal',
  },
  {
    slug: 'loopcost',
    num: '06',
    name: 'LoopCost',
    fullName: 'Routing Cost Function',
    image: '/assets/images/localloop-06-loopcost-routing-cost-16x9.png',
    desc: 'A draft routing-cost model: base price plus export and import penalties derived from LoopSignals, plus distance cost. Its parameters can be explored in lab examples; outcomes such as local pricing or savings are not guaranteed.',
    href: '/platform/loopcost',
    cta: 'Explore LoopCost',
  },
];

const DEFAULT_INTERVAL_MS = 6000;

export function KeyConceptsShowcase() {
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionPreferenceChecked, setMotionPreferenceChecked] = useState(false);
  const tabRefs = useRef([]);
  const instanceId = useId();
  const paused = userPaused || focusPaused || hoverPaused || reducedMotion || !motionPreferenceChecked;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    setMotionPreferenceChecked(true);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = Number(window.__LOCALLOOP_CONCEPT_INTERVAL_MS) || DEFAULT_INTERVAL_MS;
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % CONCEPTS.length);
    }, interval);
    return () => clearInterval(id);
  }, [paused]);

  const activate = (index, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  const onTabKeyDown = (event, index) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (Object.hasOwn(keys, event.key)) {
      event.preventDefault();
      activate((index + keys[event.key] + CONCEPTS.length) % CONCEPTS.length, true);
    } else if (event.key === 'Home') {
      event.preventDefault(); activate(0, true);
    } else if (event.key === 'End') {
      event.preventDefault(); activate(CONCEPTS.length - 1, true);
    }
  };

  return (
    <div
      className="kc-showcase"
      data-paused={String(paused)}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
      }}
    >
      <div className="kc-tabs" role="tablist" aria-label="Key concepts">
        {CONCEPTS.map((concept, i) => (
          <button
            key={concept.slug}
            ref={(node) => { tabRefs.current[i] = node; }}
            className={`kc-tab${active === i ? ' is-active' : ''}`}
            id={`${instanceId}-tab-${concept.slug}`}
            role="tab"
            aria-selected={active === i}
            aria-controls={`${instanceId}-panel-${concept.slug}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => activate(i)}
            onKeyDown={(event) => onTabKeyDown(event, i)}
            type="button"
          >
            <span className="kc-tab-num">{concept.num}</span>
            <span className="kc-tab-name">{concept.name}</span>
            {active === i && (
              <span key={`bar-${i}`} className="kc-tab-bar" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      <button
        className="kc-pause"
        type="button"
        aria-pressed={userPaused}
        onClick={() => setUserPaused((value) => !value)}
      >
        {userPaused ? 'Resume rotation' : 'Pause rotation'}
      </button>

      {CONCEPTS.map((c, i) => (
      <div
        className="kc-panel"
        key={c.slug}
        id={`${instanceId}-panel-${c.slug}`}
        role="tabpanel"
        aria-labelledby={`${instanceId}-tab-${c.slug}`}
        tabIndex={0}
        hidden={active !== i}
      >
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
      ))}

      <div className="kc-nav-dots" aria-hidden="true">
        {CONCEPTS.map((concept, i) => (
          <button
            key={concept.slug}
            className={`kc-dot${active === i ? ' is-active' : ''}`}
            onClick={() => activate(i)}
            tabIndex={-1}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
