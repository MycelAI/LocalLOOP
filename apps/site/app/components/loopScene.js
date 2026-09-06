import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const TEAL = 0x0d9488;
const TEAL_DEEP = 0x0f766e;
const WARM = 0xe06c47;
const GOLD = 0xd9a441;
const INK = 0x334155;
const SNOW = 0xf8fafc;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeOut = (t) => 1 - (1 - t) ** 3;
const pulse = (t) => Math.sin(clamp01(t) * Math.PI);
const lerp = (a, b, t) => a + (b - a) * t;

/** Soft radial falloff used for contact shadows and ground ripples. */
function radialTexture(inner, outer) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createLoopScene({ mount, chapterSeconds, chapterCount }) {
  const total = chapterSeconds * chapterCount;
  const disposables = [];
  const keep = (item) => {
    disposables.push(item);
    return item;
  };

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 16 / 10, 0.1, 120);

  // Image-based lighting gives the surfaces something to reflect, which is most
  // of the difference between "flat cubes" and a rendered look.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const envRT = pmrem.fromScene(roomEnv, 0.04);
  scene.environment = envRT.texture;
  roomEnv.dispose?.();
  pmrem.dispose();
  keep(envRT);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  const key = new THREE.DirectionalLight(0xfff6ec, 2.6);
  key.position.set(5.5, 9, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  key.shadow.camera.left = -9;
  key.shadow.camera.right = 9;
  key.shadow.camera.top = 9;
  key.shadow.camera.bottom = -9;
  key.shadow.bias = -0.0012;
  key.shadow.radius = 3;
  scene.add(key);

  const fill = new THREE.DirectionalLight(TEAL, 0.85);
  fill.position.set(-6, 3.5, -4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(WARM, 0.5);
  rim.position.set(0, 2, -7);
  scene.add(rim);

  // --- ground -------------------------------------------------------------
  const groundMat = keep(
    new THREE.MeshStandardMaterial({ color: SNOW, roughness: 0.92, metalness: 0, transparent: true, opacity: 0.9 }),
  );
  const ground = new THREE.Mesh(keep(new THREE.CircleGeometry(6.4, 96)), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const shadowTex = keep(radialTexture('rgba(15,23,42,0.34)', 'rgba(15,23,42,0)'));
  const contactShadow = (radius) => {
    const mesh = new THREE.Mesh(
      keep(new THREE.PlaneGeometry(radius * 2, radius * 2)),
      keep(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.012;
    scene.add(mesh);
    return mesh;
  };

  const glowTex = keep(radialTexture('rgba(255,255,255,0.95)', 'rgba(255,255,255,0)'));
  const glowSprite = (color, scale) => {
    const sprite = new THREE.Sprite(
      keep(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })),
    );
    sprite.scale.setScalar(scale);
    scene.add(sprite);
    return sprite;
  };

  // --- cities -------------------------------------------------------------
  const CITY_POS = [
    new THREE.Vector3(-2.55, 0, 1.15),
    new THREE.Vector3(2.55, 0, 1.0),
    new THREE.Vector3(0.15, 0, -2.5),
  ];

  const padGeo = keep(new THREE.CylinderGeometry(1.02, 1.08, 0.2, 6, 1));
  const padTopGeo = keep(new THREE.CylinderGeometry(0.94, 0.98, 0.06, 6, 1));
  const towerGeos = [0.34, 0.28, 0.22].map((w, i) =>
    keep(new RoundedBoxGeometry(w, 0.55 + i * 0.28, w, 3, 0.05)),
  );

  const cities = CITY_POS.map((pos, index) => {
    const group = new THREE.Group();
    const accent = index === 2 ? INK : TEAL;

    const pad = new THREE.Mesh(padGeo, keep(new THREE.MeshPhysicalMaterial({
      color: accent, roughness: 0.42, metalness: 0.1, clearcoat: 0.5, clearcoatRoughness: 0.35,
    })));
    pad.castShadow = true;
    pad.receiveShadow = true;
    group.add(pad);

    const top = new THREE.Mesh(padTopGeo, keep(new THREE.MeshPhysicalMaterial({
      color: index === 2 ? 0x475569 : TEAL_DEEP, roughness: 0.6, metalness: 0.05,
    })));
    top.position.y = 0.12;
    top.receiveShadow = true;
    group.add(top);

    // a small skyline rather than one box
    const layout = [
      { g: 0, x: -0.24, z: -0.16 },
      { g: 1, x: 0.16, z: 0.2 },
      { g: 2, x: 0.3, z: -0.28 },
    ];
    for (const item of layout) {
      const geo = towerGeos[item.g];
      const tower = new THREE.Mesh(geo, keep(new THREE.MeshPhysicalMaterial({
        color: SNOW, roughness: 0.35, metalness: 0.02, clearcoat: 0.65, clearcoatRoughness: 0.25,
      })));
      geo.computeBoundingBox();
      tower.position.set(item.x, 0.15 + geo.boundingBox.max.y, item.z);
      tower.castShadow = true;
      tower.receiveShadow = true;
      group.add(tower);
    }

    group.position.copy(pos);
    group.rotation.y = Math.PI / 6 + index * 0.5;
    scene.add(group);

    const shadow = contactShadow(1.7);
    shadow.position.set(pos.x, 0.012, pos.z);

    const halo = glowSprite(index === 2 ? 0x64748b : TEAL, 3.2);
    halo.position.set(pos.x, 0.35, pos.z);
    halo.material.opacity = 0;

    return { group, halo, base: pos.clone() };
  });

  // --- chapter props ------------------------------------------------------
  const anchor = new THREE.Vector3(CITY_POS[0].x, 1.55, CITY_POS[0].z);

  const batch = new THREE.Mesh(
    keep(new THREE.IcosahedronGeometry(0.46, 1)),
    keep(new THREE.MeshPhysicalMaterial({
      color: WARM, roughness: 0.28, metalness: 0.12, clearcoat: 0.9, clearcoatRoughness: 0.18, flatShading: true,
    })),
  );
  batch.castShadow = true;
  batch.position.copy(anchor);
  scene.add(batch);
  const batchGlow = glowSprite(WARM, 1.7);

  const idRing = new THREE.Mesh(
    keep(new THREE.TorusGeometry(0.8, 0.022, 16, 96)),
    keep(new THREE.MeshStandardMaterial({
      color: WARM, emissive: WARM, emissiveIntensity: 1.6, roughness: 0.3, transparent: true,
    })),
  );
  idRing.rotation.x = Math.PI / 2.4;
  scene.add(idRing);

  const product = new THREE.Mesh(
    keep(new RoundedBoxGeometry(0.78, 0.78, 0.78, 4, 0.12)),
    keep(new THREE.MeshPhysicalMaterial({
      color: TEAL, roughness: 0.25, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.15,
    })),
  );
  product.castShadow = true;
  scene.add(product);

  const partGeo = keep(new RoundedBoxGeometry(0.24, 0.24, 0.24, 3, 0.05));
  const parts = [0, 1, 2, 3].map(() => {
    const part = new THREE.Mesh(partGeo, keep(new THREE.MeshPhysicalMaterial({
      color: WARM, roughness: 0.32, metalness: 0.1, clearcoat: 0.7,
    })));
    part.castShadow = true;
    scene.add(part);
    return part;
  });

  const signalGeo = keep(new THREE.RingGeometry(0.86, 1, 96));
  const signals = [0, 1].map((i) => {
    const ring = new THREE.Mesh(signalGeo, keep(new THREE.MeshBasicMaterial({
      color: i === 0 ? WARM : TEAL, transparent: true, side: THREE.DoubleSide, depthWrite: false,
    })));
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(CITY_POS[i].x, 0.09, CITY_POS[i].z);
    scene.add(ring);
    return ring;
  });

  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(CITY_POS[0].x, 0.95, CITY_POS[0].z),
    new THREE.Vector3(0, 3.5, 1.9),
    new THREE.Vector3(CITY_POS[1].x, 0.95, CITY_POS[1].z),
  );
  const route = new THREE.Mesh(
    keep(new THREE.TubeGeometry(curve, 96, 0.028, 12, false)),
    keep(new THREE.MeshStandardMaterial({
      color: TEAL, emissive: TEAL, emissiveIntensity: 1.1, roughness: 0.4, transparent: true,
    })),
  );
  scene.add(route);

  const cargo = new THREE.Mesh(
    keep(new THREE.IcosahedronGeometry(0.26, 1)),
    keep(new THREE.MeshPhysicalMaterial({ color: WARM, roughness: 0.3, metalness: 0.1, clearcoat: 0.8, flatShading: true })),
  );
  cargo.castShadow = true;
  scene.add(cargo);
  const cargoGlow = glowSprite(WARM, 1.5);

  const trail = [0, 1, 2, 3, 4].map(() => glowSprite(TEAL, 0.9));

  const coin = new THREE.Mesh(
    keep(new THREE.CylinderGeometry(0.3, 0.3, 0.075, 48, 1)),
    keep(new THREE.MeshPhysicalMaterial({
      color: GOLD, roughness: 0.16, metalness: 0.95, clearcoat: 1, clearcoatRoughness: 0.08,
    })),
  );
  coin.castShadow = true;
  scene.add(coin);
  const coinGlow = glowSprite(GOLD, 1.8);

  // --- camera choreography -----------------------------------------------
  // Framed so the three cities stay inside a 16:10 crop at every chapter.
  const SHOTS = [
    { pos: new THREE.Vector3(-0.7, 4.1, 9.6), look: new THREE.Vector3(-0.9, 1.1, 0.2) },
    { pos: new THREE.Vector3(-0.5, 4.5, 9.4), look: new THREE.Vector3(-1.0, 1.3, 0.2) },
    { pos: new THREE.Vector3(0, 8.2, 8.6), look: new THREE.Vector3(0, 0.0, 0.0) },
    { pos: new THREE.Vector3(0, 5.2, 10.6), look: new THREE.Vector3(0, 1.5, 0.3) },
    { pos: new THREE.Vector3(0.9, 4.6, 10.0), look: new THREE.Vector3(0.2, 1.4, 0.4) },
  ];
  const camPos = SHOTS[0].pos.clone();
  const camLook = SHOTS[0].look.clone();
  const tmp = new THREE.Vector3();

  function frame(time, immediate = false) {
    const t = ((time % total) + total) % total;
    const index = Math.min(Math.floor(t / chapterSeconds), chapterCount - 1);
    const p = (t - index * chapterSeconds) / chapterSeconds;
    const fade = pulse(clamp01(p * 1.25));

    // cities react to the active chapter
    cities.forEach((city, i) => {
      const active =
        (index === 0 && i === 0) ||
        (index === 1 && i === 0) ||
        (index === 2 && i < 2) ||
        (index >= 3 && i < 2);
      city.group.position.y = Math.sin(time * 0.8 + i * 2.2) * 0.04;
      const targetHalo = active ? 0.2 : 0.04;
      city.halo.material.opacity = lerp(city.halo.material.opacity, targetHalo, immediate ? 1 : 0.08);
    });

    // 1 — MaterialDNA
    const showBatch = index === 0 || index === 1;
    batch.visible = showBatch;
    const rise = index === 0 ? easeOut(clamp01(p * 1.8)) : 1;
    batch.position.set(anchor.x, lerp(0.6, anchor.y, rise), anchor.z);
    batch.scale.setScalar(index === 0 ? 0.35 + rise * 0.65 : Math.max(0, 1 - easeInOut(clamp01(p * 2.4))));
    batch.rotation.set(time * 0.35, time * 0.7, 0);
    batchGlow.position.copy(batch.position);
    batchGlow.material.opacity = index === 0 ? fade * 0.28 : 0;

    idRing.visible = index === 0;
    idRing.position.copy(batch.position);
    idRing.scale.setScalar(0.7 + easeOut(clamp01(p * 1.5)) * 0.45);
    idRing.material.opacity = fade;
    idRing.material.emissiveIntensity = 1.2 + Math.sin(time * 4) * 0.4;
    idRing.rotation.z = time * 0.9;
    idRing.rotation.y = time * 0.35;

    // 2 — ProductDNA
    product.visible = index === 1;
    const assembled = easeInOut(clamp01((p - 0.1) / 0.55));
    product.position.set(anchor.x, anchor.y, anchor.z);
    product.scale.setScalar((0.3 + assembled * 0.72) * (index === 1 ? 1 : 0));
    product.rotation.set(0, time * 0.5, 0);
    parts.forEach((part, i) => {
      part.visible = index === 1 && assembled < 0.99;
      const angle = time * 1.1 + (i * Math.PI * 2) / parts.length;
      const radius = 1.5 * (1 - assembled);
      part.position.set(
        anchor.x + Math.cos(angle) * radius,
        anchor.y + Math.sin(angle * 1.4) * 0.4 * (1 - assembled),
        anchor.z + Math.sin(angle) * radius,
      );
      part.rotation.set(time * 0.9, time * 1.3, 0);
      part.scale.setScalar(Math.max(0, 1.1 - assembled * 1.1));
    });

    // 3 — LoopSignal
    signals.forEach((ring, i) => {
      ring.visible = index === 2;
      const strength = i === 0 ? 1 : 0.6;
      const wave = (p * 1.5 + i * 0.4) % 1;
      ring.scale.setScalar(0.35 + wave * 2.5 * strength);
      ring.material.opacity = (1 - wave) ** 1.5 * 0.9;
    });

    // 4 — LoopCost
    const routeActive = index === 3 || index === 4;
    route.visible = routeActive;
    const drawn = index === 3 ? easeInOut(clamp01(p * 1.7)) : 1;
    route.material.opacity = index === 3 ? drawn : 0.35;
    route.material.emissiveIntensity = index === 3 ? 1.4 : 0.5;

    const cargoOn = index === 3 && p > 0.2;
    cargo.visible = cargoOn;
    cargoGlow.material.opacity = cargoOn ? 0.4 : 0;
    if (cargoOn) {
      const along = easeInOut(clamp01((p - 0.2) / 0.72));
      curve.getPointAt(along, cargo.position);
      cargo.rotation.set(time * 1.1, time * 1.6, 0);
      cargoGlow.position.copy(cargo.position);
      trail.forEach((sprite, i) => {
        const back = clamp01(along - (i + 1) * 0.045);
        curve.getPointAt(back, tmp);
        sprite.position.copy(tmp);
        sprite.material.opacity = 0.3 * (1 - i / trail.length);
      });
    } else {
      for (const sprite of trail) sprite.material.opacity = 0;
    }

    // 5 — LoopCoin
    coin.visible = index === 4;
    coinGlow.material.opacity = index === 4 ? fade * 0.42 : 0;
    if (index === 4) {
      const along = 1 - easeInOut(clamp01(p * 1.15));
      curve.getPointAt(along, coin.position);
      coin.rotation.set(Math.PI / 2.1, 0, time * 2.6);
      coin.scale.setScalar(0.75 + fade * 0.35);
      coinGlow.position.copy(coin.position);
    }

    // camera: ease toward the shot for this chapter, with a slow drift
    const shot = SHOTS[index];
    const drift = Math.sin(time * 0.25) * 0.55;
    tmp.set(shot.pos.x + drift, shot.pos.y + Math.sin(time * 0.4) * 0.18, shot.pos.z);
    camPos.lerp(tmp, immediate ? 1 : 0.035);
    camLook.lerp(shot.look, immediate ? 1 : 0.05);
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    renderer.render(scene, camera);
    return index;
  }

  function resize() {
    const width = mount.clientWidth;
    if (!width) return;
    renderer.setSize(width, width * (10 / 16), false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    camera.aspect = 16 / 10;
    camera.updateProjectionMatrix();
  }

  function dispose() {
    for (const item of disposables) item.dispose?.();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { renderer, frame, resize, dispose, domElement: renderer.domElement };
}
