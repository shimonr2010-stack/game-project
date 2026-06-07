import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const FINISH_DIST = 3000;
let mode = 'race';
let playing = false;
let speed = 0;
let distance = 0;
let laneX = 0;
let crashed = false;
let finishTime = 0;
let nitro = 100;
let shakeT = 0;
const maxSpeed = 240;
const keys = {};
const traffic = [];
const roadMarks = [];
const scenery = [];

const container = document.getElementById('game-container');
const overlay = document.getElementById('start-overlay');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x38bdf8);
scene.fog = new THREE.Fog(0x38bdf8, 42, 150);

const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 220);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.insertBefore(renderer.domElement, container.firstChild);

scene.add(new THREE.AmbientLight(0xffffff, 0.72));
const sun = new THREE.DirectionalLight(0xfff5e6, 1);
sun.position.set(-10, 18, 12);
scene.add(sun);

const roadW = 14;
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(roadW, 430),
  new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 })
);
road.rotation.x = -Math.PI / 2;
road.position.z = -190;
scene.add(road);

const grassMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.9 });
[-1, 1].forEach(side => {
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(70, 430), grassMat);
  grass.rotation.x = -Math.PI / 2;
  grass.position.set(side * 42, -0.02, -190);
  scene.add(grass);

  const rail = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.38, 430),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 })
  );
  rail.position.set(side * 7.4, 0.35, -190);
  scene.add(rail);
});

for (let i = 0; i < 56; i++) {
  const mark = new THREE.Mesh(
    new THREE.PlaneGeometry(0.34, 3.8),
    new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffffff : 0xffd166 })
  );
  mark.rotation.x = -Math.PI / 2;
  mark.position.set(0, 0.03, -i * 9);
  scene.add(mark);
  roadMarks.push(mark);
}

for (let i = 0; i < 46; i++) {
  const side = i % 2 ? 1 : -1;
  const h = 5 + Math.random() * 20;
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(5 + Math.random() * 5, h, 5 + Math.random() * 5),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL((0.55 + i * 0.037) % 1, 0.54, 0.43),
      roughness: 0.62,
      metalness: 0.08,
    })
  );
  building.position.set(side * (17 + Math.random() * 16), h / 2, -i * 10 - 22);
  scene.add(building);
  scenery.push(building);
}

const finishGate = new THREE.Group();
[-1, 1].forEach(side => {
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 5, 0.45),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  post.position.set(side * 7.1, 2.5, -98);
  finishGate.add(post);
});
const banner = new THREE.Mesh(
  new THREE.BoxGeometry(14.6, 1, 0.35),
  new THREE.MeshStandardMaterial({ color: 0xff006e, emissive: 0x7f002e, emissiveIntensity: 0.25 })
);
banner.position.set(0, 5.1, -98);
finishGate.add(banner);
scene.add(finishGate);

function makeCar(color, scale = 1) {
  const car = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.75 * scale, 0.58 * scale, 3.35 * scale),
    new THREE.MeshStandardMaterial({ color, metalness: 0.45, roughness: 0.28 })
  );
  body.position.y = 0.46 * scale;
  car.add(body);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.22 * scale, 0.48 * scale, 1.24 * scale),
    new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.2, roughness: 0.2 })
  );
  cabin.position.set(0, 0.88 * scale, -0.25 * scale);
  car.add(cabin);

  const lights = new THREE.Mesh(
    new THREE.BoxGeometry(1.1 * scale, 0.08 * scale, 0.08 * scale),
    new THREE.MeshBasicMaterial({ color: 0xfff7ad })
  );
  lights.position.set(0, 0.53 * scale, -1.72 * scale);
  car.add(lights);

  [-0.68, 0.68].forEach(x => {
    [-1.08, 1.08].forEach(z => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.29 * scale, 0.29 * scale, 0.22 * scale, 14),
        new THREE.MeshStandardMaterial({ color: 0x020617 })
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x * scale, 0.24 * scale, z * scale);
      car.add(wheel);
    });
  });
  return car;
}

const playerCar = makeCar(0x3b82f6, 1.12);
playerCar.position.set(0, 0, 0);
scene.add(playerCar);

const carColors = [0xef4444, 0xeab308, 0x22c55e, 0xa855f7, 0xf97316, 0x06d6a0];

function spawnTraffic() {
  traffic.forEach(t => scene.remove(t.mesh));
  traffic.length = 0;
  for (let i = 0; i < 14; i++) {
    const lane = (Math.floor(Math.random() * 3) - 1) * 3.5;
    const mesh = makeCar(carColors[i % carColors.length], 1);
    mesh.position.set(lane, 0, -42 - i * 24 - Math.random() * 34);
    scene.add(mesh);
    traffic.push({ mesh, speed: 58 + Math.random() * 55 });
  }
}

function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', resize);
resize();

function startRace() {
  playing = true;
  crashed = false;
  speed = 0;
  distance = 0;
  laneX = 0;
  finishTime = 0;
  nitro = 100;
  shakeT = 0;
  playerCar.position.set(0, 0, 0);
  playerCar.rotation.set(0, 0, 0);
  finishGate.position.z = 0;
  spawnTraffic();
  overlay.classList.add('hidden');
  updateHud();
}

document.getElementById('play-btn').onclick = startRace;
document.querySelectorAll('[data-mode]').forEach(btn =>
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    updateHud();
  })
);

document.addEventListener('keydown', e => { keys[e.code] = true; });
document.addEventListener('keyup', e => { keys[e.code] = false; });

function updateHud() {
  document.getElementById('speed-val').textContent = String(Math.floor(speed));
  document.getElementById('nitro-val').textContent = `NITRO ${Math.floor(nitro)}%`;
  document.getElementById('race-progress-fill').style.width = `${Math.min(100, (distance / FINISH_DIST) * 100)}%`;
  const goal = mode === 'trial' ? 'Time attack' : `${FINISH_DIST} m finish`;
  document.getElementById('hud-distance').textContent = `${Math.floor(distance)} m / ${goal}`;
  const best = localStorage.getItem('zaplay-race-best');
  if (distance >= FINISH_DIST) {
    document.getElementById('hud-status').textContent = `FINISH! Time: ${finishTime.toFixed(1)}s`;
  } else if (crashed) {
    document.getElementById('hud-status').textContent = 'CRASH - slow down and steer!';
  } else {
    document.getElementById('hud-status').textContent = best
      ? `Up gas | Down brake | Left/Right steer | Space nitro | Best: ${best}s`
      : 'Up gas | Down brake | Left/Right steer | Space nitro | avoid cars!';
  }
}

const clock = new THREE.Clock();

function update(dt) {
  if (!playing) return;
  if (distance < FINISH_DIST) finishTime += dt;

  const boosting = keys.Space && nitro > 0 && speed > 48;
  const topSpeed = boosting ? maxSpeed + 82 : maxSpeed;
  const acceleration = (mode === 'trial' ? 156 : 142) + (boosting ? 140 : 0);
  if (keys.ArrowUp) speed = Math.min(topSpeed, speed + acceleration * dt);
  else if (keys.ArrowDown) speed = Math.max(0, speed - 220 * dt);
  else speed = Math.max(0, speed - 34 * dt);
  if (boosting) nitro = Math.max(0, nitro - 34 * dt);
  else nitro = Math.min(100, nitro + (crashed ? 4 : 12) * dt);

  const steer = (keys.ArrowLeft ? 1 : 0) - (keys.ArrowRight ? 1 : 0);
  laneX += steer * 18 * dt * (0.42 + speed / maxSpeed);
  laneX = THREE.MathUtils.clamp(laneX, -5.15, 5.15);
  playerCar.position.x = laneX;
  playerCar.rotation.y = -steer * 0.16;

  const move = (speed / 3.6) * dt;
  distance += move;

  roadMarks.forEach(m => {
    m.position.z += move * 2.1;
    if (m.position.z > 18) m.position.z -= 500;
  });
  scenery.forEach((s, i) => {
    s.position.z += move * 1.35;
    if (s.position.z > 32) s.position.z = -450 - (i % 24) * 8;
  });
  finishGate.position.z = -98 + (distance / FINISH_DIST) * 105;

  crashed = false;
  traffic.forEach(t => {
    t.mesh.position.z += (t.speed - speed * 0.52) * 0.09 * dt;
    if (t.mesh.position.z > 30) {
      t.mesh.position.z = -95 - Math.random() * 75;
      t.mesh.position.x = (Math.floor(Math.random() * 3) - 1) * 3.5;
      t.speed = 58 + Math.random() * 55;
    }
    const dx = Math.abs(t.mesh.position.x - playerCar.position.x);
    const dz = Math.abs(t.mesh.position.z - playerCar.position.z);
    if (dx < 2.05 && dz < 3.9) {
      crashed = true;
      shakeT = 0.22;
      speed = Math.max(speed * 0.3 - 70 * dt, 12);
      playerCar.rotation.z = Math.sin(finishTime * 62) * 0.08;
    }
  });
  if (!crashed) playerCar.rotation.z *= 0.86;

  playerCar.children.forEach((part, i) => {
    if (i >= 3) part.rotation.x -= (speed / 36) * dt;
  });

  const shake = shakeT > 0 ? Math.sin(finishTime * 90) * shakeT : 0;
  shakeT = Math.max(0, shakeT - dt);
  camera.position.set(playerCar.position.x * 0.34 + shake, 4.35 + speed / 170, 9.2 + speed / 125);
  camera.lookAt(playerCar.position.x * 0.55, 1.05, -9 - speed / 55);
  renderer.domElement.style.filter = boosting ? 'saturate(1.25) contrast(1.08)' : '';

  if (distance >= FINISH_DIST && playing) {
    playing = false;
    const best = localStorage.getItem('zaplay-race-best');
    if (!best || finishTime < parseFloat(best)) {
      localStorage.setItem('zaplay-race-best', String(finishTime.toFixed(2)));
    }
    overlay.classList.remove('hidden');
    overlay.querySelector('h2').textContent = 'Race Complete!';
    overlay.querySelector('p').textContent = `You finished in ${finishTime.toFixed(1)} seconds.`;
    overlay.querySelector('button').textContent = 'RACE AGAIN';
  }
  updateHud();
}

function animate() {
  requestAnimationFrame(animate);
  update(Math.min(clock.getDelta(), 0.05));
  renderer.render(scene, camera);
}
animate();
