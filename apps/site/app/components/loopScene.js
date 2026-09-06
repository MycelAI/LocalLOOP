import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const TEAL = 0x0d9488;
const TEAL_DEEP = 0x0f766e;
const WARM = 0xe06c47;
const GOLD = 0xd9a441;
const INK = 0x334155;
const SNOW = 0xf8fafc;

// Web Mercator pixel offsets from Munich at zoom 6, matching
// public/assets/loop-basemap.webp (a 1024px window centred on Munich).
// Map data (c) OpenStreetMap contributors, ODbL.
const MAP_PX = 1024;
const WORLD_PER_PX = 0.011;
const CITY_PX = {
  Munich: [0, 0],
  Berlin: [82.97, -312.9],
  Vienna: [218.08, -4.99],
  Milan: [-108.9, 177.6],
  Zurich: [-138.4, 51.3],
  Prague: [129.97, -134.92],
  Lyon: [-307.03, 158.12],
  Krakow: [380.61, -134.15],
  Utrecht: [-294.03, -280.94],
  Graz: [175.56, 71.85],
};
const at = (name) => {
  const [dx, dy] = CITY_PX[name];
  return [dx * WORLD_PER_PX, dy * WORLD_PER_PX];
};

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

/** Vertical gradient used for the backdrop so the stage has a designed sky. */
function gradientTexture(stops) {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  for (const [offset, color] of stops) grad.addColorStop(offset, color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 4, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Ground alpha: a low base wash with soft openings over the cities that the
 *  animation actually visits, so the map reads clearly where the action is
 *  and fades to nothing elsewhere. */
function mapAlphaTexture(focus) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // global falloff so the sheet never ends on a hard edge
  const base = ctx.createRadialGradient(size / 2, size / 2, size * 0.06, size / 2, size / 2, size / 2);
  base.addColorStop(0, 'rgba(255,255,255,0.4)');
  base.addColorStop(0.62, 'rgba(255,255,255,0.16)');
  base.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  ctx.globalCompositeOperation = 'lighter';
  for (const [dx, dy, strength, radius] of focus) {
    const cx = size * (0.5 + dx / MAP_PX);
    const cy = size * (0.5 + dy / MAP_PX);
    const spot = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * radius);
    spot.addColorStop(0, `rgba(255,255,255,${strength})`);
    spot.addColorStop(0.55, `rgba(255,255,255,${strength * 0.42})`);
    spot.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/** City name plate, drawn to a canvas and shown as a camera-facing sprite. */
function labelTexture(text, accent) {
  const w = 512;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.font = '600 54px "Space Grotesk", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
  ctx.shadowBlur = 12;
  ctx.lineWidth = 8;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.strokeText(text, w / 2, h / 2);
  ctx.fillStyle = accent;
  ctx.fillText(text, w / 2, h / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Vertical window strips so a tower reads as a building, not a box. */
function windowTexture() {
  const w = 64;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);
  for (let row = 0; row < 14; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      if (Math.random() > 0.55) continue;
      ctx.fillStyle = Math.random() > 0.35 ? '#bff3ea' : '#f0d9a8';
      ctx.fillRect(9 + col * 13, 10 + row * 8, 6, 4);
    }
  }
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

  // Bloom cost scales with pixel count, so cap the ratio well below the
  // display's, and skip the pass entirely on low-core / low-memory devices.
  const lowPower =
    (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !lowPower,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  // No background or fog: the canvas stays transparent so the page's own
  // gradient shows through. Distance falloff comes from the ground alpha map.

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

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));

  const key = new THREE.DirectionalLight(0xfff6ec, 2.2);
  key.position.set(5.5, 9, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.set(lowPower ? 512 : 1024, lowPower ? 512 : 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  key.shadow.camera.left = -9;
  key.shadow.camera.right = 9;
  key.shadow.camera.top = 9;
  key.shadow.camera.bottom = -9;
  key.shadow.bias = -0.0012;
  key.shadow.radius = 3;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x9ad9ea, 0.5);
  fill.position.set(-6, 3.5, -4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(WARM, 0.45);
  rim.position.set(1.5, 2.4, -7.5);
  scene.add(rim);

  // Alpha falloff so the basemap dissolves into the backdrop instead of
  // ending on a hard rectangular edge.
  const groundAlpha = keep(mapAlphaTexture([
    [CITY_PX.Munich[0], CITY_PX.Munich[1], 0.62, 0.16],
    [CITY_PX.Berlin[0], CITY_PX.Berlin[1], 0.55, 0.15],
    [CITY_PX.Vienna[0], CITY_PX.Vienna[1], 0.55, 0.15],
    // the corridor the transfer actually travels
    [(CITY_PX.Munich[0] + CITY_PX.Berlin[0]) / 2, (CITY_PX.Munich[1] + CITY_PX.Berlin[1]) / 2, 0.3, 0.16],
  ]));
  const mapTex = keep(new THREE.TextureLoader().load('/assets/loop-basemap.webp'));
  mapTex.colorSpace = THREE.SRGBColorSpace;
  mapTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const groundMat = keep(new THREE.MeshStandardMaterial({
    map: mapTex,
    color: 0xffffff,
    roughness: 0.95,
    metalness: 0,
    alphaMap: groundAlpha,
    transparent: true,
    envMapIntensity: 0.2,
  }));
  const mapSize = MAP_PX * WORLD_PER_PX;
  const ground = new THREE.Mesh(keep(new THREE.PlaneGeometry(mapSize, mapSize)), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const shadowTex = keep(radialTexture('rgba(15,23,42,0.3)', 'rgba(15,23,42,0)'));
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

  const nameSprite = (text, accent, scale) => {
    const sprite = new THREE.Sprite(
      keep(new THREE.SpriteMaterial({
        map: keep(labelTexture(text, accent)),
        transparent: true,
        depthWrite: false,
        depthTest: false,
        // Names must stay crisp; fogging them at distance makes the far
        // nodes unreadable.
        fog: false,
      })),
    );
    sprite.scale.set(scale * 4, scale, 1);
    // The basemap is a transparent mesh; without an explicit order the far
    // labels sort behind it and get painted over.
    sprite.renderOrder = 10;
    scene.add(sprite);
    return sprite;
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
  const CITY_NAMES = ['Munich', 'Berlin', 'Vienna'];
  const CITY_POS = CITY_NAMES.map((name) => {
    const [x, z] = at(name);
    return new THREE.Vector3(x, 0, z);
  });

  const padGeo = keep(new THREE.CylinderGeometry(0.52, 0.56, 0.13, 6, 1));
  const padTopGeo = keep(new THREE.CylinderGeometry(0.47, 0.5, 0.04, 6, 1));
  const towerGeos = [0.18, 0.15, 0.12].map((w, i) =>
    keep(new RoundedBoxGeometry(w, 0.34 + i * 0.16, w, 3, 0.03)),
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
    top.position.y = 0.08;
    top.receiveShadow = true;
    group.add(top);

    // a small skyline rather than one box
    const layout = [
      { g: 0, x: -0.13, z: -0.09 },
      { g: 1, x: 0.09, z: 0.11 },
      { g: 2, x: 0.16, z: -0.15 },
    ];
    for (const item of layout) {
      const geo = towerGeos[item.g];
      const tower = new THREE.Mesh(geo, keep(new THREE.MeshPhysicalMaterial({
        color: 0xf2f6f8,
        roughness: 0.42,
        metalness: 0.04,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
        emissive: 0xffffff,
        emissiveMap: keep(windowTexture()),
        emissiveIntensity: 0.35,
      })));
      geo.computeBoundingBox();
      tower.position.set(item.x, 0.09 + geo.boundingBox.max.y, item.z);
      tower.castShadow = true;
      tower.receiveShadow = true;
      group.add(tower);
    }

    group.position.copy(pos);
    group.rotation.y = Math.PI / 6 + index * 0.5;
    scene.add(group);

    const shadow = contactShadow(1.0);
    shadow.position.set(pos.x, 0.012, pos.z);

    const halo = glowSprite(index === 2 ? 0x94a3b8 : TEAL, 1.7);
    halo.position.set(pos.x, 0.2, pos.z);
    halo.material.opacity = 0;

    const label = nameSprite(CITY_NAMES[index], '#0f172a', 0.26);
    label.position.set(pos.x, 0.1, pos.z + 0.55);

    return { group, halo, label, base: pos.clone() };
  });

  // A scatter of dim distant nodes so the three subjects sit in a network
  // rather than on an empty plane.
  const farGeo = keep(new THREE.CylinderGeometry(0.17, 0.2, 0.06, 6));
  const farMat = keep(new THREE.MeshStandardMaterial({
    color: 0x1f5560, roughness: 0.55, metalness: 0.15, emissive: 0x2dd4bf, emissiveIntensity: 0.85,
  }));
  const FAR = ['Milan', 'Zurich', 'Prague', 'Lyon', 'Krakow', 'Utrecht', 'Graz'];
  for (const name of FAR) {
    const [x, z] = at(name);
    const node = new THREE.Mesh(farGeo, farMat);
    node.position.set(x, 0.03, z);
    node.rotation.y = Math.random() * Math.PI;
    scene.add(node);
    const tag = nameSprite(name, '#47657a', 0.14);
    tag.position.set(x, 0.05, z + 0.3);
    tag.material.opacity = 0.6;
  }

  // --- chapter props ------------------------------------------------------
  const anchor = new THREE.Vector3(CITY_POS[0].x, 0.92, CITY_POS[0].z);

  const batch = new THREE.Mesh(
    keep(new THREE.IcosahedronGeometry(0.24, 1)),
    keep(new THREE.MeshPhysicalMaterial({
      color: WARM, roughness: 0.28, metalness: 0.12, clearcoat: 0.9, clearcoatRoughness: 0.18, flatShading: true,
    })),
  );
  batch.castShadow = true;
  batch.position.copy(anchor);
  scene.add(batch);

  const core = new THREE.Mesh(
    keep(new THREE.IcosahedronGeometry(0.16, 1)),
    keep(new THREE.MeshBasicMaterial({ color: 0xffd9c2, transparent: true })),
  );
  scene.add(core);

  // A second, counter-rotating ring reads as an identifier being bound to the
  // batch rather than a single decorative orbit.
  const idRing2 = new THREE.Mesh(
    keep(new THREE.TorusGeometry(0.33, 0.008, 12, 72)),
    keep(new THREE.MeshStandardMaterial({
      color: 0xfbbf9a, emissive: 0xfbbf9a, emissiveIntensity: 1.3, roughness: 0.35, transparent: true,
    })),
  );
  scene.add(idRing2);
  const batchGlow = glowSprite(WARM, 0.95);

  const idRing = new THREE.Mesh(
    keep(new THREE.TorusGeometry(0.42, 0.012, 16, 96)),
    keep(new THREE.MeshStandardMaterial({
      color: WARM, emissive: WARM, emissiveIntensity: 1.6, roughness: 0.3, transparent: true,
    })),
  );
  idRing.rotation.x = Math.PI / 2.4;
  scene.add(idRing);

  const product = new THREE.Mesh(
    keep(new RoundedBoxGeometry(0.4, 0.4, 0.4, 4, 0.06)),
    keep(new THREE.MeshPhysicalMaterial({
      color: TEAL, roughness: 0.25, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.15,
    })),
  );
  product.castShadow = true;
  scene.add(product);

  const partGeo = keep(new RoundedBoxGeometry(0.13, 0.13, 0.13, 3, 0.03));
  const parts = [0, 1, 2, 3].map(() => {
    const part = new THREE.Mesh(partGeo, keep(new THREE.MeshPhysicalMaterial({
      color: WARM, roughness: 0.32, metalness: 0.1, clearcoat: 0.7,
    })));
    part.castShadow = true;
    scene.add(part);
    return part;
  });

  // Three staggered rings per city read as a repeating pulse; a single ring
  // just looked like a painted circle on the floor.
  const RINGS_PER_CITY = 3;
  const signalGeo = keep(new THREE.RingGeometry(0.88, 1, 128));
  const signals = [];
  for (let city = 0; city < 2; city += 1) {
    for (let n = 0; n < RINGS_PER_CITY; n += 1) {
      const ring = new THREE.Mesh(signalGeo, keep(new THREE.MeshBasicMaterial({
        color: city === 0 ? 0xffc8a6 : 0x7ff3e2,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })));
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(CITY_POS[city].x, 0.11 + n * 0.002, CITY_POS[city].z);
      scene.add(ring);
      signals.push({ ring, city, offset: n / RINGS_PER_CITY });
    }
  }

  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(CITY_POS[0].x, 0.42, CITY_POS[0].z),
    new THREE.Vector3(
      (CITY_POS[0].x + CITY_POS[1].x) / 2 + 0.35,
      2.1,
      (CITY_POS[0].z + CITY_POS[1].z) / 2 + 1.15,
    ),
    new THREE.Vector3(CITY_POS[1].x, 0.42, CITY_POS[1].z),
  );
  const route = new THREE.Mesh(
    keep(new THREE.TubeGeometry(curve, 96, 0.016, 12, false)),
    keep(new THREE.MeshStandardMaterial({
      color: TEAL, emissive: TEAL, emissiveIntensity: 1.1, roughness: 0.4, transparent: true,
    })),
  );
  scene.add(route);

  const cargo = new THREE.Mesh(
    keep(new THREE.IcosahedronGeometry(0.14, 1)),
    keep(new THREE.MeshPhysicalMaterial({ color: WARM, roughness: 0.3, metalness: 0.1, clearcoat: 0.8, flatShading: true })),
  );
  cargo.castShadow = true;
  scene.add(cargo);
  const cargoGlow = glowSprite(WARM, 0.6);

  const trail = [0, 1, 2, 3, 4].map(() => glowSprite(WARM, 0.42));
  const packets = [0, 1, 2].map(() => glowSprite(0x5eead4, 0.26));

  const coin = new THREE.Mesh(
    keep(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 48, 1)),
    keep(new THREE.MeshPhysicalMaterial({
      color: GOLD,
      roughness: 0.45,
      metalness: 0.55,
      clearcoat: 0.2,
      clearcoatRoughness: 0.45,
      // A mirror-finish disc reflects the environment's light panel straight
      // down the lens and blooms into a sun when it turns face-on.
      envMapIntensity: 0.3,
    })),
  );
  coin.castShadow = true;
  scene.add(coin);
  const coinGlow = glowSprite(GOLD, 0.68);

  // --- camera choreography -----------------------------------------------
  // Framed so the three cities stay inside a 16:10 crop at every chapter.
  const SHOTS = [
    // Framed wide, and offset so the network sits to the right of the hero
    // copy rather than under it.
    { pos: new THREE.Vector3(-1.5, 5.6, 11.4), look: new THREE.Vector3(-1.9, 0.4, -0.9) },
    { pos: new THREE.Vector3(-1.35, 5.7, 11.2), look: new THREE.Vector3(-2.0, 0.5, -0.9) },
    { pos: new THREE.Vector3(-1.2, 9.4, 9.2), look: new THREE.Vector3(-1.8, 0.0, -1.6) },
    { pos: new THREE.Vector3(-1.1, 6.1, 11.8), look: new THREE.Vector3(-1.8, 0.7, -1.6) },
    { pos: new THREE.Vector3(-0.5, 5.9, 11.6), look: new THREE.Vector3(-1.7, 0.7, -1.5) },
  ];
  const camPos = SHOTS[0].pos.clone();
  const camLook = SHOTS[0].look.clone();
  const tmp = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();

  function frame(time, immediate = false) {
    const t = ((time % total) + total) % total;
    const index = Math.min(Math.floor(t / chapterSeconds), chapterCount - 1);
    const p = (t - index * chapterSeconds) / chapterSeconds;
    const fade = pulse(clamp01(p * 1.25));
    // Ease props in and out across chapter boundaries instead of popping.
    const edge = clamp01(Math.min(p / 0.1, (1 - p) / 0.12));

    // cities react to the active chapter
    cities.forEach((city, i) => {
      const active =
        (index === 0 && i === 0) ||
        (index === 1 && i === 0) ||
        (index === 2 && i < 2) ||
        (index >= 3 && i < 2);
      city.group.position.y = Math.sin(time * 0.8 + i * 2.2) * 0.02;
      city.label.position.y = 0.1 + city.group.position.y;
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

    core.visible = index === 0;
    core.position.copy(batch.position);
    core.scale.setScalar(batch.scale.x * (0.85 + Math.sin(time * 3.1) * 0.06));
    core.material.opacity = fade * 0.5;

    idRing2.visible = index === 0;
    idRing2.position.copy(batch.position);
    idRing2.scale.setScalar(0.85 + easeOut(clamp01(p * 1.9)) * 0.4);
    idRing2.material.opacity = fade * 0.85;
    idRing2.rotation.set(Math.PI / 2.6, time * -0.7, time * -1.1);

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
    product.scale.setScalar((0.3 + assembled * 0.72) * (index === 1 ? edge : 0));
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
    for (const item of signals) {
      item.ring.visible = index === 2;
      if (index !== 2) continue;
      // City A holds the stronger preference: wider, brighter, faster pulses.
      const strength = item.city === 0 ? 1 : 0.52;
      const wave = (p * 2.1 + item.offset) % 1;
      item.ring.scale.setScalar(0.35 + wave * 1.9 * strength);
      item.ring.material.opacity =
        (1 - wave) ** 1.15 * (item.city === 0 ? 0.95 : 0.6) * edge;
    }

    // 4 — LoopCost
    const routeActive = index === 3 || index === 4;
    route.visible = routeActive;
    const drawn = index === 3 ? easeInOut(clamp01(p * 1.7)) : 1;
    route.material.opacity = (index === 3 ? drawn : 0.4) * (index === 4 ? edge : 1);
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
        const back = clamp01(along - (i + 1) * 0.055);
        curve.getPointAt(back, tmp);
        sprite.position.copy(tmp);
        sprite.scale.setScalar(0.8 * (1 - (i / trail.length) * 0.6));
        sprite.material.opacity = 0.42 * (1 - i / trail.length) ** 1.4;
      });
    } else {
      for (const sprite of trail) sprite.material.opacity = 0;
    }

    packets.forEach((sprite, i) => {
      if (!routeActive) {
        sprite.material.opacity = 0;
        return;
      }
      const along = ((time * 0.33 + i / packets.length) % 1) * drawn;
      curve.getPointAt(clamp01(along), tmp);
      sprite.position.copy(tmp);
      const head = Math.sin(along * Math.PI);
      sprite.material.opacity = 0.5 * head * edge;
      sprite.scale.setScalar(0.32 + head * 0.22);
    });

    // 5 — LoopCoin
    coin.visible = index === 4;
    coinGlow.material.opacity = index === 4 ? fade * 0.28 : 0;
    if (index === 4) {
      const along = 1 - easeInOut(clamp01(p * 1.15));
      curve.getPointAt(along, coin.position);
      coin.rotation.set(Math.PI / 2.9, time * 1.7, 0.38);
      coin.scale.setScalar((0.75 + fade * 0.35) * edge);
      coinGlow.position.copy(coin.position);
    }

    // camera: ease toward the shot for this chapter, with a slow drift
    const shot = SHOTS[index];
    const drift = Math.sin(time * 0.25) * 0.55;
    // Shots are authored for a wide hero, with the network offset right of the
    // copy. On a portrait hero that offset pushes it off-screen, so re-centre
    // and pull back instead.
    const wide = camera.aspect > 1.15;
    const offX = wide ? 0 : 1.75;
    const pull = wide ? 1 : 1.32;
    tmp.set(
      (shot.pos.x + drift + offX) * (wide ? 1 : 1.05),
      shot.pos.y * pull + Math.sin(time * 0.4) * 0.18,
      shot.pos.z * pull,
    );
    camPos.lerp(tmp, immediate ? 1 : 0.035);
    // Raising the look point renders the network lower in frame, clear of the
    // stacked hero copy on portrait.
    lookTarget.set(shot.look.x + offX, shot.look.y + (wide ? 0 : 1.5), shot.look.z);
    camLook.lerp(lookTarget, immediate ? 1 : 0.05);
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    renderer.render(scene, camera);
    return index;
  }

  function resize() {
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function dispose() {
    for (const item of disposables) item.dispose?.();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { renderer, frame, resize, dispose, domElement: renderer.domElement };
}
