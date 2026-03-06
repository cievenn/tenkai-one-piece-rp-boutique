const express = require('express');
const passport = require('passport');
const { db } = require('../database/init');
const { generateCsrfToken, isAuthenticated, verifyCsrf } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

router.get('/steam', authLimiter, passport.authenticate('steam', { failureRedirect: '/' }));

router.get('/steam/return',
  authLimiter,
  passport.authenticate('steam', { failureRedirect: process.env.CLIENT_URL }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL + '/panel');
  }
);

router.get('/session', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    const csrfToken = generateCsrfToken(req);
    return res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        steamId: req.user.steam_id,
        username: req.user.username,
        avatar: req.user.avatar,
        avatarCustom: req.user.avatar_custom,
        banner: req.user.banner,
        bio: req.user.bio,
        role: req.user.role,
        discordId: req.user.discord_id,
        discordUsername: req.user.discord_username,
        discordAvatar: req.user.discord_avatar,
        createdAt: req.user.created_at
      },
      csrfToken
    });
  }
  res.status(401).json({ authenticated: false });
});

router.get('/csrf-token', isAuthenticated, (req, res) => {
  const csrfToken = generateCsrfToken(req);
  res.json({ csrfToken });
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie('tenkai.sid');
        res.redirect(process.env.CLIENT_URL);
      });
    } else {
      res.clearCookie('tenkai.sid');
      res.redirect(process.env.CLIENT_URL);
    }
  });
});

router.get('/discord', authLimiter, (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    return res.redirect(process.env.CLIENT_URL + '/panel?error=not_authenticated');
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    console.error('DISCORD_CLIENT_ID is not configured');
    return res.redirect(process.env.CLIENT_URL + '/panel?error=discord_not_configured');
  }

  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI || `${process.env.BACKEND_URL}/auth/discord/callback`);
  const scope = encodeURIComponent('identify');
  const state = generateCsrfToken(req);
  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
  res.redirect(url);
});

router.get('/discord/callback', authLimiter, async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    return res.redirect(process.env.CLIENT_URL + '/panel?error=not_authenticated');
  }

  const { code, state } = req.query;

  if (!code) return res.redirect(process.env.CLIENT_URL + '/panel?error=discord_denied');
  if (state !== req.session.csrfToken) return res.redirect(process.env.CLIENT_URL + '/panel?error=csrf_invalid');

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI || `${process.env.BACKEND_URL}/auth/discord/callback`
      })
    });

    if (!tokenResponse.ok) {
      console.error('Discord token exchange failed:', await tokenResponse.text());
      return res.redirect(process.env.CLIENT_URL + '/panel?error=discord_token');
    }

    const tokenData = await tokenResponse.json();

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    if (!userResponse.ok) {
      console.error('Discord user fetch failed:', await userResponse.text());
      return res.redirect(process.env.CLIENT_URL + '/panel?error=discord_user');
    }

    const discordUser = await userResponse.json();
    const discordAvatar = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${discordUser.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${(BigInt(discordUser.id) >> 22n) % 6n}.png`;

    db.prepare(`
      UPDATE users SET discord_id = ?, discord_username = ?, discord_avatar = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(discordUser.id, discordUser.username, discordAvatar, req.user.id);

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    req.user = updated;

    res.redirect(process.env.CLIENT_URL + '/panel?discord=linked');
  } catch (err) {
    console.error('Discord OAuth error:', err);
    res.redirect(process.env.CLIENT_URL + '/panel?error=discord_error');
  }
});

router.post('/discord/unlink', isAuthenticated, verifyCsrf, (req, res) => {
  db.prepare('UPDATE users SET discord_id = NULL, discord_username = NULL, discord_avatar = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(req.user.id);
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  req.user = updated;
  res.json({ success: true });
});

module.exports = router;
