/** Shared helpers for browser games */
export function $(sel, root = document) { return root.querySelector(sel); }
export function rand(a, b) { return a + Math.random() * (b - a); }
export function randInt(a, b) { return Math.floor(rand(a, b + 1)); }
export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
export function dist(ax, ay, bx, by) { return Math.hypot(bx - ax, by - ay); }

export function setupCanvas(w, h, id = 'game') {
  const c = document.getElementById(id) || document.createElement('canvas');
  c.id = id;
  c.width = w;
  c.height = h;
  c.classList.add('game-canvas');
  return { canvas: c, ctx: c.getContext('2d') };
}

export function loop(fn) {
  let last = performance.now();
  function frame(t) {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    fn(dt, t);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export function keys() {
  const down = new Set();
  window.addEventListener('keydown', e => { down.add(e.code); if (['ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault(); });
  window.addEventListener('keyup', e => down.delete(e.code));
  return {
    is: (...codes) => codes.some(c => down.has(c)),
    has: c => down.has(c),
  };
}

export function aiDelayPick(moves, depth = 1) {
  if (!moves.length) return null;
  if (depth <= 1 || moves.length === 1) return moves[randInt(0, moves.length - 1)];
  return moves[0];
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function saveJSON(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {}
}
export function loadJSON(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch (_) { return fallback; }
}

export function showOverlay(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}
