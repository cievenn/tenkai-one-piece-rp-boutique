const express = require('express');
const { db, generateTicketUid, TICKET_CATEGORIES } = require('../database/init');
const { isAuthenticated, isStaffOrAdmin } = require('../middleware/auth');
const { writeLimiter, sanitizeBody, validateLength } = require('../middleware/security');

const router = express.Router();

const VALID_CATEGORIES = TICKET_CATEGORIES.map(c => c.value);
const VALID_STATUSES = ['Ouvert', 'En attente', 'Fermé'];

router.get('/categories', isAuthenticated, (req, res) => {
  res.json({ categories: TICKET_CATEGORIES });
});

router.get('/', isAuthenticated, (req, res) => {
  try {
    let tickets;
    const baseQuery = `
      SELECT t.*, u.display_name AS author_name, u.discord_avatar AS author_avatar, u.steam_id AS author_steam_id,
        (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id) AS message_count
      FROM tickets t JOIN users u ON t.author_id = u.id
    `;
    if (req.user.role === 'Staff' || req.user.role === 'Admin') {
      tickets = db.prepare(`${baseQuery} ORDER BY t.updated_at DESC`).all();
    } else {
      tickets = db.prepare(`${baseQuery} WHERE t.author_id = ? ORDER BY t.updated_at DESC`).all(req.user.id);
    }
    res.json({ tickets });
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/recent', isAuthenticated, (req, res) => {
  try {
    const recent = db.prepare(`
      SELECT t.ticket_uid, t.title, t.category, t.status, t.created_at,
        u.display_name AS author_name
      FROM tickets t JOIN users u ON t.author_id = u.id
      WHERE t.created_at > datetime('now', '-3 days')
      ORDER BY t.created_at DESC LIMIT 10
    `).all();
    res.json({ tickets: recent });
  } catch (err) {
    console.error('Error fetching recent tickets:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/:uid', isAuthenticated, (req, res) => {
  try {
    const ticket = db.prepare(`
      SELECT t.*, u.display_name AS author_name, u.discord_avatar AS author_avatar
      FROM tickets t JOIN users u ON t.author_id = u.id WHERE t.ticket_uid = ?
    `).get(req.params.uid);

    if (!ticket) return res.status(404).json({ error: 'Ticket introuvable.' });
    if (ticket.author_id !== req.user.id && req.user.role !== 'Staff' && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    const messages = db.prepare(`
      SELECT tm.*, u.display_name AS author_name, u.discord_avatar AS author_avatar, u.role AS author_role
      FROM ticket_messages tm JOIN users u ON tm.author_id = u.id
      WHERE tm.ticket_id = ? ORDER BY tm.created_at ASC
    `).all(ticket.id);

    res.json({ ticket: { ...ticket, messages } });
  } catch (err) {
    console.error('Error fetching ticket:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/', isAuthenticated, writeLimiter, sanitizeBody, (req, res) => {
  try {
    const { title, category } = req.body;
    const titleErr = validateLength('Titre', title, 3, 200);
    if (titleErr) return res.status(400).json({ error: titleErr });
    if (!VALID_CATEGORIES.includes(category)) return res.status(400).json({ error: 'Catégorie invalide.' });

    const ticketUid = generateTicketUid();
    const result = db.prepare('INSERT INTO tickets (ticket_uid, author_id, title, category) VALUES (?, ?, ?, ?)')
      .run(ticketUid, req.user.id, title, category);

    const ticket = db.prepare(`
      SELECT t.*, u.display_name AS author_name, u.discord_avatar AS author_avatar
      FROM tickets t JOIN users u ON t.author_id = u.id WHERE t.id = ?
    `).get(result.lastInsertRowid);

    db.prepare('INSERT INTO notifications (type, title, content, author_id) VALUES (?, ?, ?, ?)')
      .run('ticket', `Nouveau ticket: ${category}`, title, req.user.id);

    res.status(201).json({ ticket: { ...ticket, messages: [] } });
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/:uid/messages', isAuthenticated, writeLimiter, sanitizeBody, (req, res) => {
  try {
    const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_uid = ?').get(req.params.uid);
    if (!ticket) return res.status(404).json({ error: 'Ticket introuvable.' });
    if (ticket.author_id !== req.user.id && req.user.role !== 'Staff' && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Accès refusé.' });
    }
    if (ticket.status === 'Fermé') return res.status(400).json({ error: 'Ce ticket est fermé.' });

    const { content } = req.body;
    const contentErr = validateLength('Message', content, 1, 2000);
    if (contentErr) return res.status(400).json({ error: contentErr });

    db.prepare('INSERT INTO ticket_messages (ticket_id, author_id, content) VALUES (?, ?, ?)').run(ticket.id, req.user.id, content);
    db.prepare('UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(ticket.id);

    const message = db.prepare(`
      SELECT tm.*, u.display_name AS author_name, u.discord_avatar AS author_avatar, u.role AS author_role
      FROM ticket_messages tm JOIN users u ON tm.author_id = u.id WHERE tm.id = last_insert_rowid()
    `).get();

    res.status(201).json({ message });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.patch('/:uid/status', isAuthenticated, isStaffOrAdmin, sanitizeBody, (req, res) => {
  try {
    const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_uid = ?').get(req.params.uid);
    if (!ticket) return res.status(404).json({ error: 'Ticket introuvable.' });
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'Statut invalide.' });

    db.prepare('UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, ticket.id);
    res.json({ success: true, status });
  } catch (err) {
    console.error('Error updating ticket status:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
