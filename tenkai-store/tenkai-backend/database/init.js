const Database = require('better-sqlite3');
const path = require('path');
const session = require('express-session');

const DB_PATH = path.join(__dirname, '..', 'tenkai.db');

const db = new Database(DB_PATH, { verbose: null });

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    steam_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    avatar TEXT,
    avatar_custom TEXT,
    banner TEXT DEFAULT '/bg_op.webp',
    bio TEXT DEFAULT '',
    role TEXT DEFAULT 'Citoyen' CHECK(role IN ('Citoyen', 'Staff', 'Admin')),
    discord_id TEXT,
    discord_username TEXT,
    discord_avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_uid TEXT UNIQUE NOT NULL,
    author_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('Bug', 'Plainte', 'Boutique', 'Question', 'Autre')),
    status TEXT DEFAULT 'Ouvert' CHECK(status IN ('Ouvert', 'En attente', 'Fermé')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ticket_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS post_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS post_reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('like', 'fire', 'skull', 'anchor')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(post_id, author_id, type)
  );

  CREATE TABLE IF NOT EXISTS profile_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_user_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess TEXT NOT NULL,
    expired INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tickets_author ON tickets(author_id);
  CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
  CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
  CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
  CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);
  CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON post_reactions(post_id);
  CREATE INDEX IF NOT EXISTS idx_profile_comments_profile ON profile_comments(profile_user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expired ON sessions(expired);
`);

function findOrCreateUser(steamId, username, avatar) {
  const existing = db.prepare('SELECT * FROM users WHERE steam_id = ?').get(steamId);
  if (existing) {
    db.prepare('UPDATE users SET username = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE steam_id = ?')
      .run(username, avatar, steamId);
    return db.prepare('SELECT * FROM users WHERE steam_id = ?').get(steamId);
  }
  db.prepare('INSERT INTO users (steam_id, username, avatar) VALUES (?, ?, ?)').run(steamId, username, avatar);
  return db.prepare('SELECT * FROM users WHERE steam_id = ?').get(steamId);
}

function generateTicketUid() {
  const last = db.prepare('SELECT ticket_uid FROM tickets ORDER BY id DESC LIMIT 1').get();
  if (!last) return 'TK-0001';
  const num = parseInt(last.ticket_uid.split('-')[1], 10) + 1;
  return `TK-${String(num).padStart(4, '0')}`;
}

class SQLiteSessionStore extends session.Store {
  constructor() {
    super();
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  get(sid, callback) {
    try {
      const row = db.prepare('SELECT sess FROM sessions WHERE sid = ? AND expired > ?').get(sid, Date.now());
      if (!row) return callback(null, null);
      callback(null, JSON.parse(row.sess));
    } catch (err) { callback(err); }
  }

  set(sid, session, callback) {
    try {
      const maxAge = session.cookie?.maxAge || 86400000;
      const expired = Date.now() + maxAge;
      db.prepare('INSERT OR REPLACE INTO sessions (sid, sess, expired) VALUES (?, ?, ?)')
        .run(sid, JSON.stringify(session), expired);
      if (callback) callback(null);
    } catch (err) { if (callback) callback(err); }
  }

  destroy(sid, callback) {
    try {
      db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
      if (callback) callback(null);
    } catch (err) { if (callback) callback(err); }
  }

  touch(sid, session, callback) {
    try {
      const maxAge = session.cookie?.maxAge || 86400000;
      const expired = Date.now() + maxAge;
      db.prepare('UPDATE sessions SET expired = ? WHERE sid = ?').run(expired, sid);
      if (callback) callback(null);
    } catch (err) { if (callback) callback(err); }
  }

  cleanup() {
    try { db.prepare('DELETE FROM sessions WHERE expired < ?').run(Date.now()); } catch {}
  }

  close() {
    clearInterval(this.cleanupInterval);
  }
}

module.exports = { db, findOrCreateUser, generateTicketUid, SQLiteSessionStore };
