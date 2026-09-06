import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';

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

/** Faint concentric + radial grid, drawn once, used as the floor detail. */
function gridTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = size / 2;
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(94, 234, 212, 0.5)';
  ctx.lineWidth = 1.4;
  for (let r = 120; r < c; r += 52) {
    ctx.globalAlpha = 0.5 * (1 - r / c);
    ctx.beginPath();
    ctx.arc(c, c, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.28;
  for (let i = 0; i < 18; i += 1) {
    const a = (i / 18) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(a) * 126, c + Math.sin(a) * 126);
    ctx.lineTo(c + Math.cos(a) * c, c + Math.sin(a) * c);
    ctx.stroke();
  }
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

  const renderer = new THREE.WebGLRenderer({ antialias: !lowPower, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5));
  renderer.setClearColor(0x0b1b2b, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = keep(gradientTexture([
    [0, '#0a1622'],
    [0.48, '#0f2733'],
    [0.78, '#123a41'],
    [1, '#0d2530'],
  ]));
  scene.fog = new THREE.Fog(0x0e2a33, 7.5, 17);
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

  scene.add(new THREE.AmbientLight(0x8fc6d6, 0.22));

  const key = new THREE.DirectionalLight(0xfff4e6, 1.75);
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

  const fill = new THREE.DirectionalLight(0x38bdf8, 0.6);
  fill.position.set(-6, 3.5, -4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(WARM, 0.75);
  rim.position.set(1.5, 2.4, -7.5);
  scene.add(rim);

  // Gentle bloom lifts the emissive ring, route, and coin without blowing out
  // the matte surfaces.
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.3, 0.45, 0.85);
  if (!lowPower) composer.addPass(bloom);
  const vignette = new ShaderPass(VignetteShader);
  // VignetteShader mixes toward (1 - darkness); darkness must approach 1 to
  // darken rather than wash the corners out.
  vignette.uniforms.offset.value = 0.38;
  vignette.uniforms.darkness.value = 1.0;
  composer.addPass(vignette);
  composer.addPass(new OutputPass());
  keep(composer);

  // --- ground -------------------------------------------------------------
  // Alpha falloff so the floor dissolves into the backdrop instead of ending
  // on a hard disc edge.
  const groundAlpha = keep(radialTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)'));
  const groundMat = keep(new THREE.MeshPhysicalMaterial({
    color: 0x081720,
    roughness: 0.74,
    metalness: 0.04,
    clearcoat: 0.12,
    clearcoatRoughness: 0.8,
    alphaMap: groundAlpha,
    transparent: true,
    envMapIntensity: 0.18,
  }));
  const ground = new THREE.Mesh(keep(new THREE.CircleGeometry(9.5, 96)), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const gridMesh = new THREE.Mesh(
    keep(new THREE.CircleGeometry(8.2, 96)),
    keep(new THREE.MeshBasicMaterial({
      map: keep(gridTexture()),
      alphaMap: groundAlpha,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })),
  );
  gridMesh.rotation.x = -Math.PI / 2;
  gridMesh.position.y = 0.006;
  scene.add(gridMesh);

  const shadowTex = keep(radialTexture('rgba(4,12,18,0.55)', 'rgba(4,12,18,0)'));
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
        color: 0xa9bcc8,
        roughness: 0.52,
        metalness: 0.04,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
        emissive: 0xffffff,
        emissiveMap: keep(windowTexture()),
        emissiveIntensity: 0.9,
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

  // A scatter of dim distant nodes so the three subjects sit in a network
  // rather than on an empty plane.
  const farGeo = keep(new THREE.CylinderGeometry(0.3, 0.34, 0.08, 6));
  const farMat = keep(new THREE.MeshStandardMaterial({
    color: 0x1f5560, roughness: 0.55, metalness: 0.15, emissive: 0x2dd4bf, emissiveIntensity: 0.85,
  }));
  const FAR = [
    [-5.6, -3.4], [-4.2, -5.2], [0.6, -6.0], [4.4, -4.6], [6.0, -1.6], [5.4, 3.4], [-5.8, 2.2],
  ];
  for (const [x, z] of FAR) {
    const node = new THREE.Mesh(farGeo, farMat);
    node.position.set(x, 0.04, z);
    node.rotation.y = Math.random() * Math.PI;
    scene.add(node);
  }

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

  const core = new THREE.Mesh(
    keep(new THREE.IcosahedronGeometry(0.3, 1)),
    keep(new THREE.MeshBasicMaterial({ color: 0xffd9c2, transparent: true })),
  );
  scene.add(core);

  // A second, counter-rotating ring reads as an identifier being bound to the
  // batch rather than a single decorative orbit.
  const idRing2 = new THREE.Mesh(
    keep(new THREE.TorusGeometry(0.62, 0.014, 12, 72)),
    keep(new THREE.MeshStandardMaterial({
      color: 0xfbbf9a, emissive: 0xfbbf9a, emissiveIntensity: 1.3, roughness: 0.35, transparent: true,
    })),
  );
  scene.add(idRing2);
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

  // Three staggered rings per city read as a repeating pulse; a single ring
  // just looked like a painted circle on the floor.
  const RINGS_PER_CITY = 3;
  const signalGeo = keep(new THREE.RingGeometry(0.82, 1, 128));
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
    new THREE.Vector3(CITY_POS[0].x, 0.95, CITY_POS[0].z),
    new THREE.Vector3(0, 4.5, 3.4),
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
  const cargoGlow = glowSprite(WARM, 1.05);

  const trail = [0, 1, 2, 3, 4].map(() => glowSprite(WARM, 0.72));
  const packets = [0, 1, 2].map(() => glowSprite(0x5eead4, 0.42));

  const coin = new THREE.Mesh(
    keep(new THREE.CylinderGeometry(0.3, 0.3, 0.075, 48, 1)),
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
  const coinGlow = glowSprite(GOLD, 1.15);

  // --- camera choreography -----------------------------------------------
  // Framed so the three cities stay inside a 16:10 crop at every chapter.
  const SHOTS = [
    { pos: new THREE.Vector3(-0.6, 4.4, 11.0), look: new THREE.Vector3(-0.5, 1.1, 0.1) },
    { pos: new THREE.Vector3(-0.4, 4.8, 10.8), look: new THREE.Vector3(-0.7, 1.3, 0.1) },
    { pos: new THREE.Vector3(0, 9.4, 9.4), look: new THREE.Vector3(0, 0.0, -0.1) },
    { pos: new THREE.Vector3(0, 5.4, 12.0), look: new THREE.Vector3(0, 1.5, 0.2) },
    { pos: new THREE.Vector3(0.7, 4.9, 11.4), look: new THREE.Vector3(0.1, 1.4, 0.3) },
  ];
  const camPos = SHOTS[0].pos.clone();
  const camLook = SHOTS[0].look.clone();
  const tmp = new THREE.Vector3();

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
      item.ring.scale.setScalar(0.4 + wave * 2.5 * strength);
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
    tmp.set(shot.pos.x + drift, shot.pos.y + Math.sin(time * 0.4) * 0.18, shot.pos.z);
    camPos.lerp(tmp, immediate ? 1 : 0.035);
    camLook.lerp(shot.look, immediate ? 1 : 0.05);
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    composer.render();
    return index;
  }

  function resize() {
    const width = mount.clientWidth;
    if (!width) return;
    const height = width * (10 / 16);
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    if (!lowPower) bloom.setSize(width, height);
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
