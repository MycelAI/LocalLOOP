'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

const CHAPTERS = [
  { name: 'MaterialDNA', line: 'A batch of material is registered and given a unique, readable identity.' },
  { name: 'ProductDNA', line: 'A product is described, referencing the material records it is made from.' },
  { name: 'LoopSignal', line: 'Each city publishes how strongly it wants to keep or attract a category.' },
  { name: 'LoopCost', line: 'Those signals and the distance price the route between two cities.' },
  { name: 'LoopCoin', line: 'Settlement closes the loop in a local unit of account.' },
];

const CHAPTER_SECONDS = 5;
const TOTAL = CHAPTERS.length * CHAPTER_SECONDS;


export function LoopHeroAnimation() {
  const mountRef = useRef(null);
  const engineRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);

  // Land partway into the chapter: at p=0 every prop is still scaled to zero,
  // so jumping to the exact start shows an empty stage.
  const seek = useCallback((index) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.time = (index + 0.45) * CHAPTER_SECONDS;
    engine.render();
    setChapter(index);
  }, []);

  const toggle = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.playing = !engine.playing;
    engine.last = performance.now();
    setPlaying(engine.playing);
  }, []);

  const restart = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.time = 0;
    engine.playing = true;
    engine.last = performance.now();
    setPlaying(true);
    setChapter(0);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      let createLoopScene;
      try {
        ({ createLoopScene } = await import('./loopScene.js'));
      } catch {
        if (!disposed) setFailed(true);
        return;
      }
      if (disposed) return;

      let stage;
      try {
        stage = createLoopScene({ mount, chapterSeconds: CHAPTER_SECONDS, chapterCount: CHAPTERS.length });
      } catch {
        if (!disposed) setFailed(true);
        return;
      }
      if (disposed) {
        stage.dispose();
        return;
      }

      stage.domElement.setAttribute('role', 'img');
      stage.domElement.setAttribute(
        'aria-label',
        'Animated diagram of the LOOP protocol: material identity, product identity, community signals, routing cost, and settlement between three cities.',
      );

      const engine = { time: 0, playing: false, last: performance.now(), render: () => {} };
      engine.render = () => setChapter(stage.frame(engine.time, true));
      engineRef.current = engine;

      const resize = () => {
        stage.resize();
        stage.frame(engine.time, true);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(mount);

      let raf = 0;
      let onScreen = true;
      const loop = (now) => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min((now - engine.last) / 1000, 0.05);
        engine.last = now;
        if (!engine.playing || !onScreen) return;
        engine.time = (engine.time + dt) % TOTAL;
        const idx = stage.frame(engine.time);
        setChapter((prev) => (prev === idx ? prev : idx));
      };
      raf = requestAnimationFrame(loop);

      const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }, { threshold: 0.05 });
      io.observe(mount);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      engine.playing = !reduced;
      setPlaying(engine.playing);
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        stage.dispose();
        engineRef.current = null;
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  const active = CHAPTERS[chapter] ?? CHAPTERS[0];

  if (failed) {
    return (
      <figure className="loop-anim">
        <div className="loop-anim-stage">
          <img
            alt=""
            aria-hidden="true"
            className="loop-anim-placeholder"
            height={120}
            src="/assets/local-loop-logo.png"
            width={120}
          />
        </div>
        <figcaption className="loop-anim-caption">
          <span className="loop-anim-copy">
            LOOP registers material and product identity, publishes community signals, prices a
            route between cities, and settles the exchange.{' '}
            <a href="/protocol/what-is-loop/">Read how it works</a>.
          </span>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="loop-anim">
      <div className="loop-anim-stage" ref={mountRef}>
        {!ready ? (
          <img
            alt=""
            aria-hidden="true"
            className="loop-anim-placeholder"
            height={120}
            src="/assets/local-loop-logo.png"
            width={120}
          />
        ) : null}
      </div>

      <figcaption className="loop-anim-caption">
        <span className="loop-anim-step">
          {chapter + 1} / {CHAPTERS.length}
        </span>
        <span aria-live="polite" className="loop-anim-copy">
          <strong>{active.name}</strong> {active.line}
        </span>
      </figcaption>

      <div className="loop-anim-controls">
        <button
          aria-label={playing ? 'Pause the animation' : 'Play the animation'}
          className="loop-anim-btn"
          onClick={toggle}
          type="button"
        >
          <i aria-hidden="true" className={`ph-bold ${playing ? 'ph-pause' : 'ph-play'}`} />
        </button>
        <button
          aria-label="Restart the animation"
          className="loop-anim-btn"
          onClick={restart}
          type="button"
        >
          <i aria-hidden="true" className="ph-bold ph-arrow-counter-clockwise" />
        </button>
        <span className="loop-anim-dots">
          {CHAPTERS.map((item, index) => (
            <button
              aria-current={index === chapter}
              aria-label={`Jump to ${item.name}`}
              className={`loop-anim-dot${index === chapter ? ' is-active' : ''}`}
              key={item.name}
              onClick={() => seek(index)}
              type="button"
            />
          ))}
        </span>
      </div>
    </figure>
  );
}
