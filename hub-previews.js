/** Animated mini-previews for hub cards (GIF-like loops) */
const previews = {};

function loop(id, draw, fps = 12) {
  const canvases = () => document.querySelectorAll(`canvas.preview[data-preview="${id}"]`);
  let t = 0;
  const step = () => {
    t += 1 / fps;
    canvases().forEach(c => {
      if (!c.isConnected) return;
      const ctx = c.getContext('2d');
      const w = c.width;
      const h = c.height;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, t);
    });
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function bg(ctx, w, h, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

previews['team-shooter'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#0f172a', '#2563eb');
  ctx.fillStyle = '#38bdf8';
  ctx.globalAlpha = 0.28;
  ctx.fillRect(0, 0, w, h * 0.34);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(w * 0.38, h * 0.48);
  ctx.lineTo(w * 0.62, h * 0.48);
  ctx.lineTo(w, h);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  for (let i = 0; i < 5; i++) ctx.fillRect(i * 34 + 8, h * 0.22, 18, 34 + i * 4);

  const aimX = w * 0.5 + Math.sin(t * 1.8) * 16;
  const aimY = h * 0.45 + Math.cos(t * 1.4) * 8;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(aimX - 10, aimY);
  ctx.lineTo(aimX + 10, aimY);
  ctx.moveTo(aimX, aimY - 10);
  ctx.lineTo(aimX, aimY + 10);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.48);
    ctx.lineTo(i * (w / 7), h);
    ctx.stroke();
  }

  for (let i = 0; i < 4; i++) {
    const ex = w * (0.2 + i * 0.18) + Math.sin(t * 2 + i) * 9;
    const scale = 1 + i * 0.12;
    ctx.fillStyle = i % 2 ? '#ef4444' : '#f97316';
    ctx.fillRect(ex - 5 * scale, h * (0.39 + i * 0.03), 10 * scale, 22 * scale);
    ctx.fillStyle = '#111827';
    ctx.fillRect(ex - 8 * scale, h * (0.52 + i * 0.03), 16 * scale, 4);
  }

  ctx.save();
  ctx.translate(w * 0.72, h * 0.82);
  ctx.rotate(-0.26 + Math.sin(t * 9) * 0.02);
  ctx.fillStyle = '#111827';
  ctx.fillRect(-34, -12, 72, 15);
  ctx.fillStyle = '#374151';
  ctx.fillRect(10, -20, 42, 9);
  ctx.fillStyle = '#06d6a0';
  ctx.fillRect(-18, 3, 18, 26);
  if (Math.sin(t * 12) > 0.62) {
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(54, -16);
    ctx.lineTo(80, -10);
    ctx.lineTo(54, -4);
    ctx.fill();
  }
  ctx.restore();
};

previews['car-racing'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#7dd3fc', '#0f172a');
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(0, h * 0.45, w, h * 0.55);
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(w * 0.42, h * 0.18);
  ctx.lineTo(w * 0.58, h * 0.18);
  ctx.lineTo(w * 0.9, h);
  ctx.lineTo(w * 0.1, h);
  ctx.closePath();
  ctx.fill();
  const off = (t * 120) % 28;
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 3;
  for (let y = h * 0.18; y < h + 40; y += 28) {
    const p = (y + off) / h;
    const x1 = w * (0.5 - p * 0.06);
    const x2 = w * (0.5 + p * 0.06);
    ctx.beginPath();
    ctx.moveTo(x1, y + off);
    ctx.lineTo(x2, y + off + 14);
    ctx.stroke();
  }
  function car(x, y, color, s = 1) {
    ctx.fillStyle = color;
    ctx.fillRect(x - 11 * s, y - 18 * s, 22 * s, 36 * s);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillRect(x - 7 * s, y - 10 * s, 14 * s, 10 * s);
    ctx.fillStyle = '#111827';
    ctx.fillRect(x - 15 * s, y - 10 * s, 4 * s, 18 * s);
    ctx.fillRect(x + 11 * s, y - 10 * s, 4 * s, 18 * s);
  }
  car(w * 0.5 + Math.sin(t * 2.2) * 18, h * 0.78, '#3b82f6', 1.25);
  car(w * 0.37, (h * 0.35 + (t * 34) % 78), '#ef4444', 0.7);
  car(w * 0.62, (h * 0.28 + (t * 24) % 92), '#ffd166', 0.62);
  if (Math.sin(t * 5) > 0.15) {
    ctx.fillStyle = 'rgba(6,214,160,0.85)';
    ctx.fillRect(w * 0.5 - 18, h * 0.93, 36, 4);
  }
  ctx.fillStyle = '#fff';
  ctx.font = '900 12px sans-serif';
  ctx.fillText(Math.floor(150 + Math.sin(t * 1.4) * 45) + ' KM/H', 8, 18);
};

previews['atv-rider'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#14532d', '#4ade80');
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(0, h * 0.7, w, h * 0.3);
  const x = w * 0.3 + (t * 25) % (w * 0.5);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(x, h * 0.55, 28, 18);
  ctx.beginPath();
  ctx.arc(x + 6, h * 0.73, 6, 0, Math.PI * 2);
  ctx.arc(x + 22, h * 0.73, 6, 0, Math.PI * 2);
  ctx.fill();
};

previews['online-trivia'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#581c87', '#e879f9');
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('?', w / 2 - 8, h / 2 + 8);
  const colors = ['#f43f5e', '#3b82f6', '#22c55e', '#eab308'];
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 2 + i);
    ctx.fillRect(12 + i * 28, h - 28, 22, 14);
  });
  ctx.globalAlpha = 1;
};

previews['online-bomber'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#7f1d1d', '#fb923c');
  const grid = 5;
  for (let i = 0; i < grid; i++)
    for (let j = 0; j < grid; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#a16207' : '#ca8a04';
      ctx.fillRect(8 + i * 22, 8 + j * 22, 20, 20);
    }
  if (Math.sin(t * 4) > 0) {
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 12 + Math.sin(t * 6) * 4, 0, Math.PI * 2);
    ctx.fill();
  }
};

previews['snake'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#052e16', '#22c55e');
  const len = 5;
  for (let i = 0; i < len; i++) {
    ctx.fillStyle = i === 0 ? '#86efac' : '#16a34a';
    const x = w / 2 - i * 12 + Math.sin(t * 0.5) * 20;
    const y = h / 2 + Math.cos(t * 0.5) * 15;
    ctx.fillRect(x, y, 11, 11);
  }
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(w * 0.75, h * 0.35, 6, 0, Math.PI * 2);
  ctx.fill();
};

previews['tetris'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#1e1b4b', '#6366f1');
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
  const yOff = (t * 20) % 24;
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(20 + i * 22, 30 + yOff + i * 8, 18, 18);
  });
};

previews['breakout'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#0f172a', '#06b6d4');
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `hsl(${i * 60}, 80%, 55%)`;
    ctx.fillRect(10 + i * 28, 12, 24, 10);
  }
  const px = w / 2 + Math.sin(t * 2) * (w * 0.35);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(px - 22, h - 18, 44, 8);
  const by = h * 0.5 + Math.abs(Math.sin(t * 3)) * (h * 0.35);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(w / 2, by, 6, 0, Math.PI * 2);
  ctx.fill();
};

previews['memory'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#4c1d95', '#c084fc');
  const flip = Math.sin(t) > 0;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = flip && i < 2 ? '#f472b6' : '#312e81';
    ctx.fillRect(16 + (i % 2) * 36, 20 + Math.floor(i / 2) * 44, 30, 38);
    if (flip && i < 2) {
      ctx.fillStyle = '#fff';
      ctx.font = '18px sans-serif';
      ctx.fillText('*', 26 + (i % 2) * 36, 48 + Math.floor(i / 2) * 44);
    }
  }
};

previews['2048'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#78716c', '#fde68a');
  const vals = [2, 4, 8, 16];
  vals.forEach((v, i) => {
    const s = 20 + i * 4 + Math.sin(t + i) * 2;
    ctx.fillStyle = ['#fef3c7', '#fcd34d', '#f97316', '#ef4444'][i];
    ctx.fillRect(14 + i * 24, 30 + Math.sin(t * 0.5 + i) * 8, s, s);
    ctx.fillStyle = '#444';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(String(v), 18 + i * 24, 42 + Math.sin(t * 0.5 + i) * 8);
  });
};

previews['minesweeper'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#374151', '#9ca3af');
  for (let i = 0; i < 16; i++) {
    const x = (i % 4) * 22 + 12;
    const y = Math.floor(i / 4) * 22 + 12;
    ctx.fillStyle = Math.sin(t + i) > 0.3 ? '#6b7280' : '#d1d5db';
    ctx.fillRect(x, y, 20, 20);
  }
  if (Math.sin(t * 5) > 0.8) {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(56, 34, 20, 20);
  }
};

previews['sudoku'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#eff6ff', '#3b82f6');
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 3; i++) {
    ctx.strokeRect(14, 14, 72, 72);
    ctx.beginPath();
    ctx.moveTo(14 + i * 24, 14);
    ctx.lineTo(14 + i * 24, 86);
    ctx.moveTo(14, 14 + i * 24);
    ctx.lineTo(86, 14 + i * 24);
    ctx.stroke();
  }
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(String(1 + Math.floor(t) % 9), 38, 52);
};

previews['chess'] = (ctx, w, h, t) => {
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#d4a574' : '#8b5a2b';
      ctx.fillRect(10 + i * 22, 10 + j * 22, 22, 22);
    }
  const lift = Math.sin(t * 2) * 4;
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.arc(54, 32 - lift, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(32, 54 + lift, 10, 0, Math.PI * 2);
  ctx.fill();
};

previews['checkers'] = previews['chess'];
previews['connect-four'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#1d4ed8', '#60a5fa');
  for (let c = 0; c < 5; c++)
    for (let r = 0; r < 4; r++) {
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(18 + c * 18, 20 + r * 20, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  const col = Math.floor(t * 2) % 5;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(18 + col * 18, 18 + (t % 4) * 5, 7, 0, Math.PI * 2);
  ctx.fill();
};

previews['flappy'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#7dd3fc', '#0ea5e9');
  const gap = h * 0.35;
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(w * 0.55, 0, 28, gap - 20);
  ctx.fillRect(w * 0.55, gap + 40, 28, h);
  const fy = h / 2 + Math.sin(t * 6) * 25;
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(w * 0.35, fy, 10, 0, Math.PI * 2);
  ctx.fill();
};

previews['platformer'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#312e81', '#818cf8');
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(0, h - 16, w, 16);
  ctx.fillRect(30, h - 50, 40, 12);
  const jx = 40 + (t * 30) % (w - 60);
  const jy = h - 32 - Math.abs(Math.sin(t * 4)) * 35;
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(jx, jy, 14, 18);
};

previews['tower-defense'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#14532d', '#86efac');
  ctx.fillStyle = '#a16207';
  ctx.fillRect(w / 2 - 8, h * 0.4, 16, 30);
  const ex = (t * 40) % w;
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(ex, h * 0.75, 12, 12);
  if (Math.sin(t * 6) > 0.5) {
    ctx.strokeStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.45);
    ctx.lineTo(ex + 6, h * 0.8);
    ctx.stroke();
  }
};

previews['space-invaders'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#000', '#1e1b4b');
  ctx.fillStyle = '#22c55e';
  for (let i = 0; i < 4; i++)
    ctx.fillRect(20 + i * 22 + Math.sin(t + i) * 4, 24, 16, 12);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(w / 2 - 12, h - 22, 24, 10);
  if (Math.sin(t * 8) > 0) {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(w / 2 - 2, h - 40, 4, 12);
  }
};

previews['asteroids'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#000', '#312e81');
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const ax = w * 0.3 + i * 25 + Math.sin(t + i) * 8;
    const ay = h * 0.35 + Math.cos(t * 0.7 + i) * 10;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax + 14, ay + 8);
    ctx.lineTo(ax + 6, ay + 16);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(w / 2, h * 0.65);
  ctx.lineTo(w / 2 - 8, h * 0.78);
  ctx.lineTo(w / 2 + 8, h * 0.78);
  ctx.fill();
};

previews['pac-maze'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#000', '#1e3a8a');
  ctx.fillStyle = '#312e81';
  ctx.fillRect(0, 0, w, 12);
  ctx.fillRect(0, h - 12, w, 12);
  const px = w / 2 + Math.cos(t * 2) * 30;
  const py = h / 2 + Math.sin(t * 2) * 20;
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(px, py, 9, 0.2, Math.PI * 2 - 0.2);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(w * 0.7, h * 0.4, 3, 0, Math.PI * 2);
  ctx.fill();
};

previews['whack-mole'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#78350f', '#a16207');
  for (let i = 0; i < 3; i++) {
    const up = Math.sin(t * 3 + i * 2) > 0.4;
    ctx.fillStyle = '#451a03';
    ctx.fillRect(14 + i * 30, h * 0.55, 24, 20);
    if (up) {
      ctx.fillStyle = '#6b7280';
      ctx.beginPath();
      ctx.arc(26 + i * 30, h * 0.5, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

previews['simon'] = (ctx, w, h, t) => {
  const i = Math.floor(t * 3) % 4;
  const cols = ['#ef4444', '#22c55e', '#eab308', '#3b82f6'];
  cols.forEach((c, j) => {
    ctx.fillStyle = j === i ? c : c + '44';
    ctx.fillRect(10 + (j % 2) * 42, 14 + Math.floor(j / 2) * 42, 38, 38);
  });
};

previews['sliding-puzzle'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#fce7f3', '#ec4899');
  const n = 3;
  const slide = Math.floor(t * 2) % 4;
  for (let i = 0; i < n * n - 1; i++) {
    const pos = i === slide ? (slide + 1) % 8 : i;
    const x = 12 + (pos % n) * 28;
    const y = 12 + Math.floor(pos / n) * 28;
    ctx.fillStyle = `hsl(${i * 40}, 70%, 60%)`;
    ctx.fillRect(x, y, 26, 26);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(String(i + 1), x + 9, y + 18);
  }
};

previews['hangman'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#fef3c7', '#f59e0b');
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, h - 10);
  ctx.lineTo(60, h - 10);
  ctx.lineTo(40, h - 10);
  ctx.lineTo(40, 20);
  ctx.lineTo(70, 20);
  ctx.lineTo(70, 32);
  ctx.stroke();
  const step = Math.min(4, Math.floor(t * 0.8));
  if (step >= 1) { ctx.beginPath(); ctx.arc(70, 42, 10, 0, Math.PI * 2); ctx.stroke(); }
  if (step >= 2) { ctx.beginPath(); ctx.moveTo(70, 52); ctx.lineTo(70, 72); ctx.stroke(); }
};

previews['word-search'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#ecfdf5', '#10b981');
  ctx.font = '10px monospace';
  ctx.fillStyle = '#065f46';
  'ZAPLAY'.split('').forEach((ch, i) => {
    ctx.fillText(ch, 14 + i * 14, 28 + Math.sin(t + i) * 2);
  });
  for (let i = 0; i < 20; i++)
    ctx.fillText(String.fromCharCode(65 + (i * 7) % 26), 10 + (i % 5) * 18, 40 + Math.floor(i / 5) * 16);
};

previews['tic-tac-toe'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#fdf4ff', '#d946ef');
  ctx.strokeStyle = '#a21caf';
  ctx.lineWidth = 3;
  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(14 + i * 28, 14);
    ctx.lineTo(14 + i * 28, 86);
    ctx.moveTo(14, 14 + i * 28);
    ctx.lineTo(86, 14 + i * 28);
    ctx.stroke();
  }
  const show = Math.sin(t) > 0;
  if (show) {
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(24, 24);
    ctx.lineTo(52, 52);
    ctx.stroke();
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(62, 38, 8, 0, Math.PI * 2);
    ctx.fill();
  }
};

previews['pong'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#000', '#1e293b');
  const by = h / 2 + Math.sin(t * 2.5) * (h * 0.35);
  ctx.fillStyle = '#fff';
  ctx.fillRect(8, by - 20, 8, 40);
  ctx.fillRect(w - 16, h / 2 - 15 + Math.cos(t * 2) * 30, 8, 30);
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 + Math.sin(t * 3) * 40, 6, 0, Math.PI * 2);
  ctx.fill();
};

previews['brick-power'] = previews['breakout'];

previews['zombie-survival'] = (ctx, w, h, t) => {
  bg(ctx, w, h, '#1c1917', '#44403c');
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.65, 8, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    const zx = (t * 30 + i * 40) % w;
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(zx, h * 0.4 + i * 12, 10, 16);
  }
  if (Math.sin(t * 10) > 0) {
    ctx.strokeStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.65);
    ctx.lineTo(w / 2 + 40, h * 0.5);
    ctx.stroke();
  }
};

const started = new Set();
export function initHubPreviews() {
  Object.keys(previews).forEach(id => {
    if (started.has(id)) return;
    started.add(id);
    loop(id, previews[id]);
  });
}

export function attachPreviewCanvas(card, gameId) {
  const wrap = document.createElement('div');
  wrap.className = 'preview-wrap';
  const canvas = document.createElement('canvas');
  canvas.className = 'preview';
  canvas.dataset.preview = gameId;
  canvas.width = 280;
  canvas.height = 160;
  wrap.appendChild(canvas);
  card.insertBefore(wrap, card.firstChild);
}
