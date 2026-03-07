const express = require('express');
const { db } = require('../database/init');
const { gmodApiAuth } = require('../middleware/auth');

const router = express.Router();

router.use(gmodApiAuth);

router.get('/player/:steamId', (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, steam_id, discord_id, discord_username, display_name, avatar, role, bio, created_at
      FROM users WHERE steam_id = ?
    `).get(req.params.steamId);

    if (!user) return res.status(404).json({ error: 'Joueur non enregistré sur le panel.' });

    const purchases = db.prepare(`
      SELECT id, action, payload, status, created_at FROM gmod_sync_log
      WHERE steam_id = ? AND action = 'purchase' AND status = 'pending'
      ORDER BY created_at ASC
    `).all(req.params.steamId);

    res.json({ player: user, pendingPurchases: purchases });
  } catch (err) {
    console.error('GMod player fetch error:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/sync-purchase', (req, res) => {
  try {
    const { steamId, itemId, itemName, price } = req.body;
    if (!steamId || !itemId) return res.status(400).json({ error: 'steamId et itemId requis.' });

    const user = db.prepare('SELECT id FROM users WHERE steam_id = ?').get(steamId);
    if (!user) return res.status(404).json({ error: 'Joueur non enregistré.' });

    const payload = JSON.stringify({ itemId, itemName, price, timestamp: Date.now() });
    db.prepare('INSERT INTO gmod_sync_log (steam_id, action, payload) VALUES (?, ?, ?)')
      .run(steamId, 'purchase', payload);

    res.status(201).json({ success: true, message: 'Achat en attente de synchronisation.' });
  } catch (err) {
    console.error('GMod sync-purchase error:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/ack-sync', (req, res) => {
  try {
    const { syncIds } = req.body;
    if (!Array.isArray(syncIds) || syncIds.length === 0) return res.status(400).json({ error: 'syncIds requis.' });

    const placeholders = syncIds.map(() => '?').join(',');
    db.prepare(`UPDATE gmod_sync_log SET status = 'synced' WHERE id IN (${placeholders})`).run(...syncIds);

    res.json({ success: true, synced: syncIds.length });
  } catch (err) {
    console.error('GMod ack-sync error:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/update-player', (req, res) => {
  try {
    const { steamId, money, bounty, faction, playtime } = req.body;
    if (!steamId) return res.status(400).json({ error: 'steamId requis.' });

    const payload = JSON.stringify({ money, bounty, faction, playtime, timestamp: Date.now() });
    db.prepare('INSERT INTO gmod_sync_log (steam_id, action, payload, status) VALUES (?, ?, ?, ?)')
      .run(steamId, 'player_update', payload, 'synced');

    res.json({ success: true });
  } catch (err) {
    console.error('GMod update-player error:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
