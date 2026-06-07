/**
 * Online room helper — MVP uses local simulation + bot fallback.
 * For real multiplayer: set window.GAME_PEER_ID and load PeerJS CDN, or point to your WebSocket server.
 *
 * Enable PeerJS (example in README):
 *   <script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>
 *   window.GAME_PEER_HOST = '0.peerjs.com'; // or self-hosted
 */
export class RoomManager {
  constructor(gameId) {
    this.gameId = gameId;
    this.roomCode = null;
    this.isHost = false;
    this.peers = [];
    this.onMessage = null;
    this._peer = null;
    this._conn = null;
    this.mode = 'offline'; // offline | simulated | peer
  }

  generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let c = '';
    for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
    return c;
  }

  async createRoom() {
    this.roomCode = this.generateCode();
    this.isHost = true;
    if (typeof Peer !== 'undefined' && window.GAME_PEER_ID) {
      try {
        this._peer = new Peer(this.roomCode, { host: window.GAME_PEER_HOST || '0.peerjs.com', secure: true, port: 443 });
        await new Promise((res, rej) => {
          this._peer.on('open', res);
          this._peer.on('error', rej);
          setTimeout(() => rej(new Error('peer timeout')), 8000);
        });
        this._peer.on('connection', conn => this._bindConn(conn));
        this.mode = 'peer';
        return { code: this.roomCode, mode: 'peer' };
      } catch (e) {
        console.warn('PeerJS unavailable, using simulated lobby', e);
      }
    }
    this.mode = 'simulated';
    try {
      localStorage.setItem(`room:${this.gameId}:${this.roomCode}`, JSON.stringify({ host: true, t: Date.now() }));
    } catch (_) {}
    return { code: this.roomCode, mode: 'simulated', note: 'Simulated lobby — add PeerJS or WebSocket for real players' };
  }

  async joinRoom(code) {
    this.roomCode = code.toUpperCase().trim();
    this.isHost = false;
    if (typeof Peer !== 'undefined') {
      try {
        this._peer = new Peer(undefined, { host: window.GAME_PEER_HOST || '0.peerjs.com', secure: true, port: 443 });
        await new Promise((res, rej) => {
          this._peer.on('open', res);
          this._peer.on('error', rej);
          setTimeout(() => rej(new Error('peer timeout')), 8000);
        });
        this._conn = this._peer.connect(this.roomCode);
        await new Promise((res, rej) => {
          this._conn.on('open', res);
          this._conn.on('error', rej);
          setTimeout(() => rej(new Error('connect timeout')), 8000);
        });
        this._bindConn(this._conn);
        this.mode = 'peer';
        return { mode: 'peer' };
      } catch (e) {
        console.warn('Peer join failed', e);
      }
    }
    this.mode = 'simulated';
    return { mode: 'simulated', note: 'Playing with bots — real join needs PeerJS/WebSocket' };
  }

  _bindConn(conn) {
    conn.on('data', data => this.onMessage?.(data));
    this._conn = conn;
  }

  broadcast(data) {
    if (this._conn?.open) this._conn.send(data);
    this.onMessage?.({ ...data, local: true });
  }

  useBots(count = 3) {
    this.mode = 'bots';
    return Array.from({ length: count }, (_, i) => ({
      id: `bot-${i}`,
      name: `Bot ${i + 1}`,
      isBot: true,
    }));
  }
}
