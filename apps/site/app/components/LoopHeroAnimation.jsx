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

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeOut = (t) => 1 - (1 - t) ** 3;
// 0 -> 1 -> 0, used to fade a chapter's props in and back out
const pulse = (t) => Math.sin(clamp01(t) * Math.PI);

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
      let THREE;
      try {
        THREE = await import('three');
      } catch {
        if (!disposed) setFailed(true);
        return;
      }
      if (disposed) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch {
        if (!disposed) setFailed(true);
        return;
      }

      const TEAL = 0x0d9488;
      const WARM = 0xe06c47;
      const INK = 0x334155;
      const PAPER = 0xf1f5f9;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      renderer.domElement.setAttribute('role', 'img');
      renderer.domElement.setAttribute(
        'aria-label',
        'Animated diagram of the LOOP protocol: material identity, product identity, community signals, routing cost, and settlement between three cities.',
      );

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 16 / 10, 0.1, 100);

      scene.add(new THREE.AmbientLight(0xffffff, 1.5));
      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(4, 7, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(TEAL, 1.1);
      rim.position.set(-5, 3, -4);
      scene.add(rim);

      const registry = [];
      const track = (obj) => { registry.push(obj); return obj; };
      const mat = (color, opts = {}) =>
        track(new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05, ...opts }));

      // --- ground
      const groundGeo = track(new THREE.CircleGeometry(5.2, 64));
      const ground = new THREE.Mesh(groundGeo, mat(PAPER, { transparent: true, opacity: 0.5 }));
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.02;
      scene.add(ground);

      // --- three cities
      const CITY_POS = [
        new THREE.Vector3(-2.3, 0, 0.9),
        new THREE.Vector3(2.3, 0, 0.9),
        new THREE.Vector3(0, 0, -2.2),
      ];
      const padGeo = track(new THREE.CylinderGeometry(0.78, 0.85, 0.22, 6));
      const towerGeo = track(new THREE.BoxGeometry(0.34, 0.62, 0.34));
      const cities = CITY_POS.map((pos, i) => {
        const group = new THREE.Group();
        const pad = new THREE.Mesh(padGeo, mat(i === 2 ? INK : TEAL, { transparent: true, opacity: 0.85 }));
        group.add(pad);
        const tower = new THREE.Mesh(towerGeo, mat(0xffffff));
        tower.position.y = 0.42;
        group.add(tower);
        group.position.copy(pos);
        group.rotation.y = Math.PI / 6;
        scene.add(group);
        return group;
      });

      // --- chapter 1: material batch + identity ring
      const material = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.42, 0)), mat(WARM));
      material.position.set(CITY_POS[0].x, 1.05, CITY_POS[0].z);
      scene.add(material);
      const idRing = new THREE.Mesh(
        track(new THREE.TorusGeometry(0.72, 0.035, 12, 48)),
        mat(WARM, { transparent: true, opacity: 0.9 }),
      );
      idRing.position.copy(material.position);
      idRing.rotation.x = Math.PI / 2;
      scene.add(idRing);

      // --- chapter 2: product assembled from parts
      const product = new THREE.Mesh(track(new THREE.BoxGeometry(0.62, 0.62, 0.62)), mat(TEAL));
      product.position.copy(material.position);
      scene.add(product);
      const partGeo = track(new THREE.BoxGeometry(0.2, 0.2, 0.2));
      const parts = [0, 1, 2].map(() => {
        const part = new THREE.Mesh(partGeo, mat(WARM));
        scene.add(part);
        return part;
      });

      // --- chapter 3: signal rings from two cities
      const signalGeo = track(new THREE.TorusGeometry(1, 0.02, 8, 64));
      const signals = [0, 1].map((i) => {
        const ring = new THREE.Mesh(signalGeo, mat(i === 0 ? WARM : TEAL, { transparent: true }));
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(CITY_POS[i].x, 0.16, CITY_POS[i].z);
        scene.add(ring);
        return ring;
      });

      // --- chapter 4 + 5: the route arc between city A and city B
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(CITY_POS[0].x, 0.5, CITY_POS[0].z),
        new THREE.Vector3(0, 2.6, 1.6),
        new THREE.Vector3(CITY_POS[1].x, 0.5, CITY_POS[1].z),
      );
      const routeGeo = track(new THREE.TubeGeometry(curve, 64, 0.035, 8, false));
      const route = new THREE.Mesh(routeGeo, mat(TEAL, { transparent: true }));
      scene.add(route);
      const cargo = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.24, 0)), mat(WARM));
      scene.add(cargo);
      const coin = new THREE.Mesh(track(new THREE.CylinderGeometry(0.26, 0.26, 0.07, 28)), mat(0xeab308));
      scene.add(coin);

      const engine = { time: 0, playing: false, last: performance.now(), render: () => {} };

      const frame = (time) => {
        const t = time % TOTAL;
        const idx = Math.min(Math.floor(t / CHAPTER_SECONDS), CHAPTERS.length - 1);
        const p = (t - idx * CHAPTER_SECONDS) / CHAPTER_SECONDS;

        cities.forEach((city, i) => {
          const active = (idx === 0 && i === 0) || (idx === 3 && i < 2) || (idx === 4 && i < 2) || (idx === 2 && i < 2);
          const target = active ? 1.12 : 1;
          city.scale.setScalar(city.scale.x + (target - city.scale.x) * 0.12);
          city.position.y = Math.sin(time * 0.9 + i * 2.1) * 0.03;
        });

        // 1. material identity
        const mVis = idx === 0 ? pulse(p) : 0;
        material.visible = mVis > 0.01 || idx === 1;
        material.scale.setScalar(idx === 0 ? easeOut(clamp01(p * 2)) * 0.9 + 0.1 : Math.max(0, 1 - p * 3));
        material.rotation.y = time * 0.8;
        material.rotation.x = time * 0.35;
        idRing.visible = idx === 0;
        idRing.scale.setScalar(0.6 + easeOut(clamp01(p * 1.6)) * 0.5);
        idRing.material.opacity = pulse(p) * 0.9;
        idRing.rotation.z = time * 1.2;

        // 2. product assembly
        product.visible = idx === 1;
        const assembled = easeInOut(clamp01((p - 0.12) / 0.55));
        product.scale.setScalar(0.35 + assembled * 0.7);
        product.rotation.y = time * 0.6;
        parts.forEach((part, i) => {
          part.visible = idx === 1 && assembled < 0.98;
          const angle = time * 1.4 + (i * Math.PI * 2) / 3;
          const radius = 1.35 * (1 - assembled);
          part.position.set(
            material.position.x + Math.cos(angle) * radius,
            1.05 + Math.sin(angle * 1.3) * 0.28 * (1 - assembled),
            material.position.z + Math.sin(angle) * radius,
          );
          part.rotation.set(time, time * 0.7, 0);
          part.scale.setScalar(Math.max(0, 1.25 - assembled * 1.25));
        });

        // 3. community signals
        signals.forEach((ring, i) => {
          ring.visible = idx === 2;
          const offset = i * 0.35;
          const wave = ((p * 1.6 + offset) % 1);
          const strength = i === 0 ? 1 : 0.62;
          ring.scale.setScalar(0.25 + wave * 1.9 * strength);
          ring.material.opacity = (1 - wave) * 0.85;
        });

        // 4. routing cost
        route.visible = idx === 3 || idx === 4;
        const draw = idx === 3 ? easeInOut(clamp01(p * 1.8)) : 1;
        route.material.opacity = idx === 3 ? draw * 0.9 : 0.35;
        cargo.visible = idx === 3 && p > 0.25;
        if (cargo.visible) {
          const along = easeInOut(clamp01((p - 0.25) / 0.7));
          curve.getPointAt(along, cargo.position);
          cargo.rotation.set(time * 1.2, time, 0);
          cargo.scale.setScalar(0.9);
        }

        // 5. settlement returns
        coin.visible = idx === 4;
        if (coin.visible) {
          const along = 1 - easeInOut(clamp01(p * 1.25));
          curve.getPointAt(along, coin.position);
          coin.rotation.set(Math.PI / 2, 0, time * 3);
          coin.scale.setScalar(pulse(clamp01(p * 1.3)) * 0.4 + 0.7);
        }

        const orbit = time * 0.16;
        camera.position.set(Math.sin(orbit) * 7.4, 4.3 + Math.sin(time * 0.4) * 0.25, Math.cos(orbit) * 7.4);
        camera.lookAt(0, 0.5, 0);

        renderer.render(scene, camera);
        return idx;
      };

      engine.render = () => setChapter(frame(engine.time));
      engineRef.current = engine;

      const resize = () => {
        const width = mount.clientWidth;
        if (!width) return;
        const height = width * (10 / 16);
        renderer.setSize(width, height, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        camera.aspect = 16 / 10;
        camera.updateProjectionMatrix();
        frame(engine.time);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(mount);

      let raf = 0;
      let visible = true;
      const loop = (now) => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min((now - engine.last) / 1000, 0.05);
        engine.last = now;
        if (!engine.playing || !visible) return;
        engine.time = (engine.time + dt) % TOTAL;
        const idx = frame(engine.time);
        setChapter((prev) => (prev === idx ? prev : idx));
      };
      raf = requestAnimationFrame(loop);

      const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.05 });
      io.observe(mount);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      engine.playing = !reduced;
      setPlaying(engine.playing);
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        for (const item of registry) item.dispose?.();
        renderer.dispose();
        renderer.domElement.remove();
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
