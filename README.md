# Zaplay Games —  Browser Games

A multi-game web project with a colorful hub launcher, **25 offline** games, and **5 online-ready** games (including **Combat Strike 3D** FPS and **Street Racer 3D**). All UI text is in **English**. Built with HTML, CSS, JavaScript, and Three.js (CDN) — no build step required.

Ideal for embedding in **Google Sites** via iframes.

## Quick start (local)

**Do not** rely on opening `index.html` via `file://` (double-click or Cursor’s built-in preview). Browsers block `file://` pages inside iframes and may block ES modules — you may see:

`Unsafe attempt to load URL file:///.../index.html from frame with URL file:///...`

### Recommended (Windows)

1. Double-click **`start.bat`** (or run `.\start.ps1` in PowerShell).
2. Your browser should open **http://localhost:3000/** automatically.
3. Use Chrome or Edge directly — **not** Cursor’s built-in HTML preview (that uses `file://` in an iframe).

Requires **Python** (`python -m http.server`) or **Node.js** (`npm start`). If neither is installed, install Python from [python.org](https://www.python.org/downloads/) and check “Add to PATH”.

### Alternative

```bash
python -m http.server 3000
# or: npx serve -l 3000 .
```

Then open http://localhost:3000/

> **Google Sites:** Host the folder on GitHub Pages / Netlify (HTTPS). Iframes must use `https://` URLs, never `file://`.

## Project structure

```
game-project/
├── index.html          # Hub launcher (all 30 games)
├── README.md
├── shared/
│   ├── styles.css      # Hub styling
│   ├── game-base.css   # In-game UI chrome
│   ├── utils.js        # Canvas, input, storage helpers
│   └── online.js       # RoomManager (PeerJS-ready, bot fallback)
└── games/
    ├── team-shooter/   # ONLINE
    ├── car-racing/     # ONLINE
    ├── atv-rider/      # ONLINE
    ├── online-trivia/  # ONLINE
    ├── online-bomber/  # ONLINE
    └── … (25 offline game folders)
```

Each game folder contains:

- `index.html` — title, instructions, hub link
- `game.js` — main game logic (ES module)

## All 30 games

| # | Game | Path | Type |
|---|------|------|------|
| 1 | Team Shooter | `games/team-shooter/` | **Online** |
| 2 | Car Racing | `games/car-racing/` | **Online** |
| 3 | ATV Rider | `games/atv-rider/` | **Online** |
| 4 | Live Trivia | `games/online-trivia/` | **Online** |
| 5 | Bomb Arena | `games/online-bomber/` | **Online** |
| 6 | Snake | `games/snake/` | Offline |
| 7 | Block Drop (Tetris-like) | `games/tetris/` | Offline |
| 8 | Breakout | `games/breakout/` | Offline |
| 9 | Memory Match | `games/memory/` | Offline |
| 10 | 2048 | `games/2048/` | Offline |
| 11 | Minesweeper | `games/minesweeper/` | Offline |
| 12 | Sudoku | `games/sudoku/` | Offline |
| 13 | Chess vs AI | `games/chess/` | Offline |
| 14 | Checkers vs AI | `games/checkers/` | Offline |
| 15 | Connect Four | `games/connect-four/` | Offline |
| 16 | Flappy Sky | `games/flappy/` | Offline |
| 17 | Platform Jump | `games/platformer/` | Offline |
| 18 | Tower Defense | `games/tower-defense/` | Offline |
| 19 | Space Invaders | `games/space-invaders/` | Offline |
| 20 | Asteroids | `games/asteroids/` | Offline |
| 21 | Maze Chomper | `games/pac-maze/` | Offline |
| 22 | Whack-a-Mole | `games/whack-mole/` | Offline |
| 23 | Simon Says | `games/simon/` | Offline |
| 24 | 15 Puzzle | `games/sliding-puzzle/` | Offline |
| 25 | Hangman | `games/hangman/` | Offline |
| 26 | Word Search | `games/word-search/` | Offline |
| 27 | Tic-Tac-Toe | `games/tic-tac-toe/` | Offline |
| 28 | Pong | `games/pong/` | Offline |
| 29 | Power Bricks | `games/brick-power/` | Offline |
| 30 | Zombie Survival | `games/zombie-survival/` | Offline |

## Deploy to Google Sites

1. **Host the files** on any static host (Google Drive public folder is awkward; prefer GitHub Pages, Netlify, Cloudflare Pages, or school web hosting).
2. Get the public URL of your hosted `index.html` (e.g. `https://yoursite.github.io/game-project/`).
3. In Google Sites: **Insert → Embed → Embed code**
4. Paste an iframe for the hub or a single game:

```html
<iframe
  src="https://YOUR-HOSTED-URL/index.html"
  width="100%"
  height="600"
  style="border:0; max-width:100%;"
  allowfullscreen
  loading="lazy"
  title="Game Arcade">
</iframe>
```

For one game only:

```html
<iframe src="https://YOUR-HOSTED-URL/games/snake/" width="100%" height="500" style="border:0;"></iframe>
```

5. Publish the site. Offline games work after the first load without internet. Online games need network for real multiplayer (see below).

## Online games — what works today

| Feature | Status |
|---------|--------|
| Full gameplay vs **bots** | ✅ Works offline after load |
| Room **create/join UI** + room codes | ✅ Simulated lobby |
| **PeerJS** peer-to-peer | ⚙️ Plug-in ready (`shared/online.js`) |
| Dedicated WebSocket server | ❌ Not included — optional upgrade |

### Enable real PeerJS multiplayer

1. Add to the game’s `index.html` before `game.js`:

```html
<script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>
```

2. Optionally set a custom PeerJS server:

```html
<script>window.GAME_PEER_HOST = '0.peerjs.com';</script>
```

3. Host creates a room and shares the 6-letter code; guest joins with the same code.

Without PeerJS, `RoomManager` uses **simulated lobbies** and fills empty slots with **bots** so demos always work.

### Online game summaries

- **Team Shooter** — Teams / FFA / moving targets; WASD + mouse shoot.
- **Car Racing** — Standard, combat (shoot), time trial modes.
- **ATV Rider** — Career stages, shop, currency, bot/online races with obstacles.
- **Live Trivia** — Host/join room; timed multiple-choice vs bots.
- **Bomb Arena** — Top-down bomber; place bombs, blast bots/rivals.

## Games that need internet

Only these **5** are designed for online/multiplayer features (bots still work offline):

1. `games/team-shooter/`
2. `games/car-racing/`
3. `games/atv-rider/`
4. `games/online-trivia/`
5. `games/online-bomber/`

All **25 offline** games run without network after the initial page load.

## Recommended next steps

- Host on **GitHub Pages** or **Netlify** for stable iframe URLs on Google Sites.
- Add **PeerJS** script tags to online games for real P2P rooms.
- Add a small **Node + Socket.io** server if you need authoritative multiplayer (racing/shooter sync).
- Replace emoji art with sprite sheets for polish.
- Add sound effects (Web Audio) per game.

## License

Educational / personal project — customize freely.
