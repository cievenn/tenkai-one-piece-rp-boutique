const express = require('express');
const { db } = require('../database/init');
const { isAuthenticated, isStaffOrAdmin } = require('../middleware/auth');
const { writeLimiter, sanitizeBody, validateLength } = require('../middleware/security');

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
  try {
    const notifications = db.prepare(`
      SELECT n.*, u.display_name AS author_name, u.discord_avatar AS author_avatar
      FROM notifications n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE (n.target_user_id IS NULL OR n.target_user_id = ?)
        AND n.created_at > datetime('now', '-3 days')
      ORDER BY n.created_at DESC
      LIMIT 30
    `).all(req.user.id);

    res.json({ notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/', isAuthenticated, isStaffOrAdmin, writeLimiter, sanitizeBody, (req, res) => {
  try {
    const { type, title, content, targetUserId } = req.body;

    const validTypes = ['ticket', 'announcement', 'system', 'candidature'];
    if (!validTypes.includes(type)) return res.status(400).json({ error: 'Type invalide.' });

    const titleErr = validateLength('Titre', title, 2, 200);
    if (titleErr) return res.status(400).json({ error: titleErr });

    db.prepare('INSERT INTO notifications (type, title, content, author_id, target_user_id) VALUES (?, ?, ?, ?, ?)')
      .run(type, title, content || null, req.user.id, targetUserId || null);

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.delete('/:id', isAuthenticated, isStaffOrAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM notifications WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
