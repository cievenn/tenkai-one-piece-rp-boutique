const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { db } = require('../database/init');
const { isAuthenticated } = require('../middleware/auth');
const { writeLimiter, sanitizeBody, sanitizeString, validateLength } = require('../middleware/security');

const router = express.Router();

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${req.user.id}_${file.fieldname}_${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new Error('Format non autorisé. Utilisez JPG, PNG, WebP ou GIF.'));
    }
    cb(null, true);
  }
});

router.get('/me', isAuthenticated, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

  res.json({
    user: {
      id: user.id,
      steamId: user.steam_id,
      username: user.username,
      avatar: user.avatar,
      avatarCustom: user.avatar_custom,
      banner: user.banner,
      bio: user.bio,
      role: user.role,
      discordId: user.discord_id,
      discordUsername: user.discord_username,
      discordAvatar: user.discord_avatar,
      createdAt: user.created_at
    }
  });
});

router.patch('/me', isAuthenticated, writeLimiter, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), (req, res) => {
  try {
    const updates = [];
    const params = [];

    if (req.body.bio !== undefined) {
      const bio = sanitizeString(req.body.bio);
      const bioErr = validateLength('Bio', bio, 0, 500);
      if (bioErr) return res.status(400).json({ error: bioErr });
      updates.push('bio = ?');
      params.push(bio);
    }

    if (req.files?.avatar?.[0]) {
      updates.push('avatar_custom = ?');
      params.push(`/uploads/${req.files.avatar[0].filename}`);
    }

    if (req.files?.banner?.[0]) {
      updates.push('banner = ?');
      params.push(`/uploads/${req.files.banner[0].filename}`);
    }

    if (req.body.avatarSource === 'steam') {
      updates.push('avatar_custom = NULL');
    } else if (req.body.avatarSource === 'discord') {
      const user = db.prepare('SELECT discord_avatar FROM users WHERE id = ?').get(req.user.id);
      if (user?.discord_avatar) {
        updates.push('avatar_custom = ?');
        params.push(user.discord_avatar);
      }
    }

    if (updates.length === 0) return res.status(400).json({ error: 'Aucune modification.' });

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.user.id);

    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    req.user = updated;

    res.json({
      user: {
        id: updated.id,
        steamId: updated.steam_id,
        username: updated.username,
        avatar: updated.avatar,
        avatarCustom: updated.avatar_custom,
        banner: updated.banner,
        bio: updated.bio,
        role: updated.role,
        discordId: updated.discord_id,
        discordUsername: updated.discord_username,
        discordAvatar: updated.discord_avatar,
        createdAt: updated.created_at
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/profile/:steamId', isAuthenticated, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, steam_id, username, avatar, avatar_custom, banner, bio, role,
        discord_username, created_at
      FROM users WHERE steam_id = ?
    `).get(req.params.steamId);

    if (!user) return res.status(404).json({ error: 'Profil introuvable.' });

    const commentCount = db.prepare('SELECT COUNT(*) as count FROM profile_comments WHERE author_id = ?').get(user.id).count;

    res.json({
      profile: {
        id: user.id,
        steamId: user.steam_id,
        username: user.username,
        avatar: user.avatar_custom || user.avatar,
        banner: user.banner,
        bio: user.bio,
        role: user.role,
        discordUsername: user.discord_username,
        commentCount,
        createdAt: user.created_at
      }
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/profile/:steamId/comments', isAuthenticated, (req, res) => {
  try {
    const profileUser = db.prepare('SELECT id FROM users WHERE steam_id = ?').get(req.params.steamId);
    if (!profileUser) return res.status(404).json({ error: 'Profil introuvable.' });

    const comments = db.prepare(`
      SELECT pc.*, u.username AS author_name, u.avatar AS author_avatar,
        u.avatar_custom AS author_avatar_custom, u.steam_id AS author_steam_id
      FROM profile_comments pc
      JOIN users u ON pc.author_id = u.id
      WHERE pc.profile_user_id = ?
      ORDER BY pc.created_at DESC
      LIMIT 50
    `).all(profileUser.id);

    res.json({ comments });
  } catch (err) {
    console.error('Error fetching profile comments:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/profile/:steamId/comments', isAuthenticated, writeLimiter, sanitizeBody, (req, res) => {
  try {
    const profileUser = db.prepare('SELECT id FROM users WHERE steam_id = ?').get(req.params.steamId);
    if (!profileUser) return res.status(404).json({ error: 'Profil introuvable.' });

    const { content } = req.body;
    const contentErr = validateLength('Commentaire', content, 1, 300);
    if (contentErr) return res.status(400).json({ error: contentErr });

    db.prepare('INSERT INTO profile_comments (profile_user_id, author_id, content) VALUES (?, ?, ?)')
      .run(profileUser.id, req.user.id, content);

    const comment = db.prepare(`
      SELECT pc.*, u.username AS author_name, u.avatar AS author_avatar,
        u.avatar_custom AS author_avatar_custom, u.steam_id AS author_steam_id
      FROM profile_comments pc
      JOIN users u ON pc.author_id = u.id
      WHERE pc.id = last_insert_rowid()
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

    const isAuthor = comment.author_id === req.user.id;
    const isProfileOwner = comment.profile_user_id === req.user.id;
    const isAdmin = req.user.role === 'Admin';

    if (!isAuthor && !isProfileOwner && !isAdmin) {
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
