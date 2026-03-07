const Database = require('better-sqlite3');
const path = require('path');
const session = require('express-session');

const DB_PATH = path.join(__dirname, '..', 'tenkai.db');
const db = new Database(DB_PATH, { verbose: null });

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

function runMigrations() {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_version (version INTEGER PRIMARY KEY)`);
  const row = db.prepare('SELECT MAX(version) as v FROM schema_version').get();
  const currentVersion = row?.v || 0;

  if (currentVersion < 1) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id TEXT UNIQUE NOT NULL,
        discord_username TEXT NOT NULL,
        discord_avatar TEXT,
        display_name TEXT,
        email TEXT,
        steam_id TEXT UNIQUE,
        steam_username TEXT,
        avatar TEXT,
        avatar_custom TEXT,
        banner TEXT DEFAULT '/bg_op.webp',
        bio TEXT DEFAULT '',
        role TEXT DEFAULT 'Citoyen' CHECK(role IN ('Citoyen', 'Staff', 'Admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_uid TEXT UNIQUE NOT NULL,
        author_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
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

      CREATE TABLE IF NOT EXISTS profile_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_user_id INTEGER NOT NULL,
        author_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (profile_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('ticket', 'announcement', 'system', 'candidature')),
        title TEXT NOT NULL,
        content TEXT,
        author_id INTEGER,
        target_user_id INTEGER,
        reference_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS gmod_sync_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        steam_id TEXT NOT NULL,
        action TEXT NOT NULL,
        payload TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'synced', 'failed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT PRIMARY KEY,
        sess TEXT NOT NULL,
        expired INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_users_discord ON users(discord_id);
      CREATE INDEX IF NOT EXISTS idx_users_steam ON users(steam_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_author ON tickets(author_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
      CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
      CREATE INDEX IF NOT EXISTS idx_profile_comments_profile ON profile_comments(profile_user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_target ON notifications(target_user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_gmod_sync_steam ON gmod_sync_log(steam_id);
      CREATE INDEX IF NOT EXISTS idx_gmod_sync_status ON gmod_sync_log(status);
      CREATE INDEX IF NOT EXISTS idx_sessions_expired ON sessions(expired);

      INSERT INTO schema_version VALUES (1);
    `);
  }
}

runMigrations();

const TICKET_CATEGORIES = [
  { value: 'Candidature RP', description: 'Postuler pour un rôle RP (Staff, Faction, Marine...)' },
  { value: 'Demande RPK', description: 'Demander la validation d\'un RPK sur un personnage' },
  { value: 'Plainte Joueur', description: 'Signaler le comportement d\'un joueur' },
  { value: 'Plainte Staff', description: 'Signaler le comportement d\'un membre du Staff' },
  { value: 'Bug Report', description: 'Signaler un bug technique sur le serveur ou le panel' },
  { value: 'Boutique', description: 'Problème avec un achat ou une transaction' },
  { value: 'Unban', description: 'Contester un bannissement' },
  { value: 'Question', description: 'Question générale sur le serveur ou les règles' },
  { value: 'Suggestion', description: 'Proposer une idée ou amélioration' },
  { value: 'Autre', description: 'Autre demande ne rentrant dans aucune catégorie' }
];

function findOrCreateDiscordUser(discordId, discordUsername, discordAvatar) {
  const existing = db.prepare('SELECT * FROM users WHERE discord_id = ?').get(discordId);
  if (existing) {
    db.prepare('UPDATE users SET discord_username = ?, discord_avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE discord_id = ?')
      .run(discordUsername, discordAvatar, discordId);
    return db.prepare('SELECT * FROM users WHERE discord_id = ?').get(discordId);
  }
  db.prepare('INSERT INTO users (discord_id, discord_username, discord_avatar, display_name) VALUES (?, ?, ?, ?)')
    .run(discordId, discordUsername, discordAvatar, discordUsername);
  return db.prepare('SELECT * FROM users WHERE discord_id = ?').get(discordId);
}

function linkSteamToUser(userId, steamId, steamUsername, steamAvatar) {
  const existing = db.prepare('SELECT id FROM users WHERE steam_id = ? AND id != ?').get(steamId, userId);
  if (existing) return { error: 'Ce compte Steam est déjà lié à un autre utilisateur.' };
  db.prepare('UPDATE users SET steam_id = ?, steam_username = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(steamId, steamUsername, steamAvatar, userId);
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
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
  set(sid, sess, callback) {
    try {
      const maxAge = sess.cookie?.maxAge || 86400000;
      const expired = Date.now() + maxAge;
      db.prepare('INSERT OR REPLACE INTO sessions (sid, sess, expired) VALUES (?, ?, ?)').run(sid, JSON.stringify(sess), expired);
      if (callback) callback(null);
    } catch (err) { if (callback) callback(err); }
  }
  destroy(sid, callback) {
    try { db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid); if (callback) callback(null); }
    catch (err) { if (callback) callback(err); }
  }
  touch(sid, sess, callback) {
    try {
      const maxAge = sess.cookie?.maxAge || 86400000;
      db.prepare('UPDATE sessions SET expired = ? WHERE sid = ?').run(Date.now() + maxAge, sid);
      if (callback) callback(null);
    } catch (err) { if (callback) callback(err); }
  }
  cleanup() { try { db.prepare('DELETE FROM sessions WHERE expired < ?').run(Date.now()); } catch {} }
  close() { clearInterval(this.cleanupInterval); }
}

module.exports = { db, findOrCreateDiscordUser, linkSteamToUser, generateTicketUid, SQLiteSessionStore, TICKET_CATEGORIES };
