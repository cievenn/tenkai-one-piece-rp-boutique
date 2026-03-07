const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { db } = require('../database/init');
const { isAuthenticated } = require('../middleware/auth');
const { writeLimiter, sanitizeBody, sanitizeString, validateLength } = require('../middleware/security');

const router = express.Router();

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user.id}_${file.fieldname}_${crypto.randomBytes(8).toString('hex')}${ext}`);
  }
});
const upload = multer({
  storage, limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) return cb(new Error('Format non autorisé. Utilisez JPG, PNG, WebP ou GIF.'));
    cb(null, true);
  }
});

function formatUser(u) {
  return {
    id: u.id, discordId: u.discord_id, discordUsername: u.discord_username, discordAvatar: u.discord_avatar,
    displayName: u.display_name || u.discord_username, email: u.email,
    steamId: u.steam_id, steamUsername: u.steam_username,
    avatar: u.avatar, avatarCustom: u.avatar_custom, banner: u.banner, bio: u.bio,
    role: u.role, steamLinked: !!u.steam_id, createdAt: u.created_at
  };
}

router.get('/me', isAuthenticated, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  res.json({ user: formatUser(user) });
});

router.patch('/me', isAuthenticated, writeLimiter, upload.fields([
  { name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }
]), (req, res) => {
  try {
    const updates = [];
    const params = [];

    if (req.body.displayName !== undefined) {
      const name = sanitizeString(req.body.displayName);
      const nameErr = validateLength('Pseudo', name, 2, 32);
      if (nameErr) return res.status(400).json({ error: nameErr });
      updates.push('display_name = ?'); params.push(name);
    }
    if (req.body.bio !== undefined) {
      const bio = sanitizeString(req.body.bio);
      const bioErr = validateLength('Bio', bio, 0, 500);
      if (bioErr) return res.status(400).json({ error: bioErr });
      updates.push('bio = ?'); params.push(bio);
    }
    if (req.body.email !== undefined) {
      const email = sanitizeString(req.body.email);
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email invalide.' });
      updates.push('email = ?'); params.push(email || null);
    }
    if (req.files?.avatar?.[0]) { updates.push('avatar_custom = ?'); params.push(`/uploads/${req.files.avatar[0].filename}`); }
    if (req.files?.banner?.[0]) { updates.push('banner = ?'); params.push(`/uploads/${req.files.banner[0].filename}`); }
    if (req.body.avatarSource === 'steam' && req.user.avatar) { updates.push('avatar_custom = ?'); params.push(req.user.avatar); }
    if (req.body.avatarSource === 'discord') { updates.push('avatar_custom = ?'); params.push(req.user.discord_avatar); }
    if (req.body.avatarSource === 'reset') { updates.push('avatar_custom = NULL'); }

    if (updates.length === 0) return res.status(400).json({ error: 'Aucune modification.' });

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.user.id);
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    req.user = updated;
    res.json({ user: formatUser(updated) });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/profile/:id', isAuthenticated, (req, res) => {
  try {
    const paramId = req.params.id;
    let user;
    if (/^\d+$/.test(paramId)) {
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(paramId);
    } else {
      user = db.prepare('SELECT * FROM users WHERE steam_id = ? OR discord_id = ?').get(paramId, paramId);
    }
    if (!user) return res.status(404).json({ error: 'Profil introuvable.' });

    const commentCount = db.prepare('SELECT COUNT(*) as count FROM profile_comments WHERE author_id = ?').get(user.id).count;

    res.json({
      profile: {
        id: user.id, discordId: user.discord_id, discordUsername: user.discord_username,
        displayName: user.display_name || user.discord_username,
        steamId: user.steam_id, steamUsername: user.steam_username,
        avatar: user.avatar_custom || user.avatar || user.discord_avatar,
        banner: user.banner, bio: user.bio, role: user.role,
        commentCount, createdAt: user.created_at
      }
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/profile/:id/comments', isAuthenticated, (req, res) => {
  try {
    const paramId = req.params.id;
    let profileUser;
    if (/^\d+$/.test(paramId)) {
      profileUser = db.prepare('SELECT id FROM users WHERE id = ?').get(paramId);
    } else {
      profileUser = db.prepare('SELECT id FROM users WHERE steam_id = ? OR discord_id = ?').get(paramId, paramId);
    }
    if (!profileUser) return res.status(404).json({ error: 'Profil introuvable.' });

    const comments = db.prepare(`
      SELECT pc.*, u.display_name AS author_name, u.discord_avatar AS author_avatar,
        u.avatar_custom AS author_avatar_custom, u.discord_id AS author_discord_id
      FROM profile_comments pc JOIN users u ON pc.author_id = u.id
      WHERE pc.profile_user_id = ? ORDER BY pc.created_at DESC LIMIT 50
    `).all(profileUser.id);
    res.json({ comments });
  } catch (err) {
    console.error('Error fetching profile comments:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/profile/:id/comments', isAuthenticated, writeLimiter, sanitizeBody, (req, res) => {
  try {
    const paramId = req.params.id;
    let profileUser;
    if (/^\d+$/.test(paramId)) {
      profileUser = db.prepare('SELECT id FROM users WHERE id = ?').get(paramId);
    } else {
      profileUser = db.prepare('SELECT id FROM users WHERE steam_id = ? OR discord_id = ?').get(paramId, paramId);
    }
    if (!profileUser) return res.status(404).json({ error: 'Profil introuvable.' });

    const { content } = req.body;
    const contentErr = validateLength('Commentaire', content, 1, 300);
    if (contentErr) return res.status(400).json({ error: contentErr });

    db.prepare('INSERT INTO profile_comments (profile_user_id, author_id, content) VALUES (?, ?, ?)').run(profileUser.id, req.user.id, content);

    const comment = db.prepare(`
      SELECT pc.*, u.display_name AS author_name, u.discord_avatar AS author_avatar,
        u.avatar_custom AS author_avatar_custom, u.discord_id AS author_discord_id
      FROM profile_comments pc JOIN users u ON pc.author_id = u.id WHERE pc.id = last_insert_rowid()
    `).get();
    res.status(201).json({ comment });
  } catch (err) {
    console.error('Error posting profile comment:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.delete('/profile/comments/:id', isAuthenticated, (req, res) => {
  try {
    const comment = db.prepare('SELECT * FROM profile_comments WHERE id = ?').get(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Commentaire introuvable.' });
    if (comment.author_id !== req.user.id && comment.profile_user_id !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Accès refusé.' });
    }
    db.prepare('DELETE FROM profile_comments WHERE id = ?').run(comment.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting profile comment:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
