import { setupCanvas, loop, keys } from '../../shared/utils.js';

const W = 10, H = 20, BS = 30;
const SHAPES = [[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[1,1,0],[0,1,1]],[[0,1,1],[1,1,0]]];
const COLORS = ['#06b6d4','#eab308','#a855f7','#f97316','#3b82f6','#22c55e','#ef4444'];
const { canvas, ctx } = setupCanvas(W * BS, H * BS);
const k = keys();
let grid, piece, px, py, score, lines, dropTimer;

function reset() {
  grid = Array.from({ length: H }, () => Array(W).fill(0));
  score = 0; lines = 0; dropTimer = 0;
  newPiece();
  updateHud();
}
function newPiece() {
  const t = Math.floor(Math.random() * SHAPES.length);
  piece = SHAPES[t].map(r => [...r]);
  px = 3; py = 0;
  if (collide()) { grid = Array.from({ length: H }, () => Array(W).fill(0)); score = 0; }
}
function collide(dx = 0, dy = 0, p = piece) {
  for (let y = 0; y < p.length; y++)
    for (let x = 0; x < p[y].length; x++)
      if (p[y][x] && (grid[py + y + dy]?.[px + x + dx] || px + x + dx < 0 || px + x + dx >= W || py + y + dy >= H))
        return true;
  return false;
}
function merge() {
  for (let y = 0; y < piece.length; y++)
    for (let x = 0; x < piece[y].length; x++)
      if (piece[y][x]) grid[py + y][px + x] = 1;
  let cleared = 0;
  for (let y = H - 1; y >= 0; y--) {
    if (grid[y].every(c => c)) { grid.splice(y, 1); grid.unshift(Array(W).fill(0)); cleared++; y++; }
  }
  if (cleared) { lines += cleared; score += cleared * 100 * cleared; updateHud(); }
  newPiece();
}
function rotate() {
  const p = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
  if (!collide(0, 0, p)) piece = p;
}
function updateHud() {
  document.getElementById('hud').textContent = `Score: ${score} | Lines: ${lines}`;
}
let moveCd = 0;
loop((dt) => {
  moveCd -= dt; dropTimer += dt;
  if (moveCd <= 0) {
    if (k.is('ArrowLeft')) { if (!collide(-1)) px--; moveCd = 0.08; }
    if (k.is('ArrowRight')) { if (!collide(1)) px++; moveCd = 0.08; }
    if (k.is('ArrowDown')) { if (!collide(0, 1)) { py++; score++; } moveCd = 0.05; }
    if (k.has('ArrowUp')) { rotate(); moveCd = 0.15; }
    if (k.has('Space')) { while (!collide(0, 1)) { py++; score += 2; } merge(); }
  }
  if (dropTimer > 0.5) { dropTimer = 0; if (!collide(0, 1)) py++; else merge(); }
  ctx.fillStyle = '#0a0a12';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (grid[y][x]) { ctx.fillStyle = '#64748b'; ctx.fillRect(x * BS, y * BS, BS - 1, BS - 1); }
  ctx.fillStyle = '#38bdf8';
  for (let y = 0; y < piece.length; y++)
    for (let x = 0; x < piece[y].length; x++)
      if (piece[y][x]) ctx.fillRect((px + x) * BS, (py + y) * BS, BS - 1, BS - 1);
});
document.getElementById('restart').onclick = reset;
reset();
