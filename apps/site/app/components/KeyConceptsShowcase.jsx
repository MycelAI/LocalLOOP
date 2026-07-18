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

/**
 * Scroll-linked step section: a tall wrapper (N × viewport height) holds a
 * sticky-pinned tab/panel display. Scrolling through the wrapper advances the
 * active tab; scroll physics are never intercepted (no preventDefault/wheel
 * handling), only read via a passive scroll listener, so trackpad/wheel
 * momentum, keyboard paging, and screen readers all behave normally.
 *
 * The tall-wrapper/sticky mechanism is opt-out by construction rather than by
 * a JS branch: under `prefers-reduced-motion: reduce` or on narrow viewports,
 * CSS collapses the wrapper back to `height: auto` and the sticky panel back
 * to `position: static` (see site.css). With no extra scroll distance, the
 * progress calculation below naturally no-ops and `active` is then driven
 * only by clicking/keying a tab, which always works regardless of mode.
 */
export function KeyConceptsShowcase() {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Mirrors the `@media (max-width: 900px)` breakpoint in site.css that
  // collapses the sticky/tall-wrapper mechanism. Driven explicitly by a media
  // query rather than inferred from measured scroll distance: a narrow-viewport
  // wrapper can still be a few pixels taller than the viewport (content isn't
  // pixel-perfect to 100dvh), which would otherwise leave a tiny but real
  // scrollable range that made the active tab twitchy near the top of the
  // section instead of reliably resting on the first concept.
  const [scrollJackEnabled, setScrollJackEnabled] = useState(false);
  const tabRefs = useRef([]);
  const wrapperRef = useRef(null);
  const instanceId = useId();
  // While a click/key-triggered scroll is animating toward a target step, the
  // passive scroll listener must not fight it with intermediate positions.
  const programmaticScrollUntil = useRef(0);

  useEffect(() => {
    const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopMedia = window.matchMedia('(min-width: 901px)');
    const update = () => {
      setReducedMotion(reduceMotionMedia.matches);
      setScrollJackEnabled(desktopMedia.matches && !reduceMotionMedia.matches);
    };
    update();
    reduceMotionMedia.addEventListener('change', update);
    desktopMedia.addEventListener('change', update);
    return () => {
      reduceMotionMedia.removeEventListener('change', update);
      desktopMedia.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    function onScroll() {
      if (!scrollJackEnabled) return;
      if (Date.now() < programmaticScrollUntil.current) return;
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const index = Math.min(CONCEPTS.length - 1, Math.floor(progress * CONCEPTS.length));
      setActive(index);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollJackEnabled]);

  const activate = (index, focus = false) => {
    const el = wrapperRef.current;
    const rect = el?.getBoundingClientRect();
    const scrollable = rect ? rect.height - window.innerHeight : 0;
    // Set active immediately for instant feedback and a correct aria-selected
    // state; also sync scroll position (when scroll-jacking applies) so
    // subsequent scrolling continues from the right place. Scroll position
    // remains the source of truth once the user scrolls again — the lock
    // above just keeps the smooth-scroll animation from being overridden by
    // its own intermediate positions.
    setActive(index);
    if (scrollJackEnabled && rect && scrollable > 0) {
      programmaticScrollUntil.current = Date.now() + 700;
      const absoluteTop = rect.top + window.scrollY;
      const targetProgress = (index + 0.5) / CONCEPTS.length;
      window.scrollTo({ top: absoluteTop + targetProgress * scrollable, behavior: 'smooth' });
    }
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
    <div className="kc-scroll-wrapper" ref={wrapperRef} style={{ '--kc-steps': CONCEPTS.length }}>
      <div className="kc-sticky">
        <div className="kc-showcase">
          <div className="kc-tabs" role="tablist" aria-label="Key concepts" aria-orientation="vertical">
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
              </button>
            ))}
          </div>

          <div className="kc-panel">
            {CONCEPTS.map((c, i) => (
              <div
                className={`kc-panel-face${active === i ? ' is-active' : ''}`}
                key={c.slug}
                id={`${instanceId}-panel-${c.slug}`}
                role="tabpanel"
                aria-labelledby={`${instanceId}-tab-${c.slug}`}
                tabIndex={0}
                inert={active !== i ? '' : undefined}
              >
                <div className="kc-panel-media">
                  <img
                    src={c.image}
                    alt={`${c.name} — ${c.fullName}`}
                    className="kc-panel-img"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
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
          </div>

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
      </div>
    </div>
  );
}
