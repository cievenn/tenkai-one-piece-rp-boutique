const express = require('express');
const passport = require('passport');
const { db, findOrCreateDiscordUser, linkSteamToUser } = require('../database/init');
const { generateCsrfToken, isAuthenticated, verifyCsrf } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

function buildDiscordAvatar(discordUser) {
  if (discordUser.avatar) {
    const ext = discordUser.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${ext}?size=256`;
  }
  return `https://cdn.discordapp.com/embed/avatars/${(BigInt(discordUser.id) >> 22n) % 6n}.png`;
}

router.get('/discord/login', authLimiter, (req, res) => {
  try {
    const clientId = (process.env.DISCORD_CLIENT_ID || '').trim();
    const redirectUri = (process.env.DISCORD_REDIRECT_URI || '').trim();
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').trim();

    if (!clientId) {
      console.log('[Discord OAuth] ERREUR: DISCORD_CLIENT_ID manquant ou vide');
      return res.redirect(clientUrl + '/panel?error=discord_not_configured');
    }
    if (!redirectUri) {
      console.log('[Discord OAuth] ERREUR: DISCORD_REDIRECT_URI manquant');
      return res.redirect(clientUrl + '/panel?error=discord_not_configured');
    }

    const state = generateCsrfToken(req);
    req.session.oauthState = state;
    const encodedRedirect = encodeURIComponent(redirectUri);
    const scope = encodeURIComponent('identify email');
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodedRedirect}&response_type=code&scope=${scope}&state=${state}`;

    console.log('[Discord OAuth] Redirection vers Discord, state=', state?.substring(0, 8) + '...');
    req.session.save((err) => {
      if (err) {
        console.error('[Discord OAuth] Erreur sauvegarde session avant redirect:', err);
        return res.redirect(clientUrl + '/panel?error=session_error');
      }
      res.redirect(authUrl);
    });
  } catch (err) {
    console.error('[Discord OAuth] Erreur inattendue /discord/login:', err);
    res.redirect((process.env.CLIENT_URL || 'http://localhost:5173') + '/panel?error=discord_error');
  }
});

router.get('/discord/callback', authLimiter, async (req, res) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').trim();
  const { code, state } = req.query;

  console.log('[Discord OAuth] Callback reçu, code=', !!code, 'state=', state?.substring?.()?.slice(0, 8) + '...', 'sessionId=', req.sessionID?.slice(0, 8) + '...');

  if (!code) {
    console.log('[Discord OAuth] Pas de code fourni par Discord');
    return res.redirect(clientUrl + '/panel?error=discord_denied');
  }

  const storedState = req.session?.oauthState || req.session?.csrfToken;
  if (storedState && state !== storedState) {
    console.log('[Discord OAuth] CSRF invalide: stored=', storedState?.slice(0, 8) + '...', 'received=', state?.slice(0, 8) + '...');
    return res.redirect(clientUrl + '/panel?error=csrf_invalid');
  }

  try {
    const clientId = (process.env.DISCORD_CLIENT_ID || '').trim();
    const clientSecret = (process.env.DISCORD_CLIENT_SECRET || '').trim();
    const redirectUri = (process.env.DISCORD_REDIRECT_URI || '').trim();
    if (!clientId || !clientSecret || !redirectUri) {
      console.log('[Discord OAuth] Variables manquantes: clientId, clientSecret ou redirectUri');
      return res.redirect(clientUrl + '/panel?error=discord_not_configured');
    }

    const cleanCode = String(code).trim();
    console.log('[Discord OAuth] Échange du code contre un token... redirect_uri=', redirectUri);
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: cleanCode,
        redirect_uri: redirectUri
      })
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[Discord OAuth] ERREUR TOKEN - Status:', tokenRes.status);
      console.error('[Discord OAuth] Réponse Discord:', errText);
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error === 'invalid_grant' || errJson.error_description?.includes('redirect')) {
          console.error('[Discord OAuth] >>> Vérifiez que l\'URL de redirection dans le Discord Developer Portal est EXACTEMENT:', redirectUri);
          console.error('[Discord OAuth] >>> (pas 127.0.0.1 si vous utilisez localhost, pas de slash final)');
        }
      } catch (_) {}
      return res.redirect(clientUrl + '/panel?error=discord_token');
    }

    const tokenData = await tokenRes.json();
    console.log('[Discord OAuth] Token obtenu, récupération du profil...');

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    if (!userRes.ok) {
      console.error('[Discord OAuth] Erreur profil Discord:', userRes.status);
      return res.redirect(clientUrl + '/panel?error=discord_user');
    }

    const discordUser = await userRes.json();
    const avatar = buildDiscordAvatar(discordUser);
    const user = findOrCreateDiscordUser(discordUser.id, discordUser.username, avatar);

    if (discordUser.email && !user.email) {
      db.prepare('UPDATE users SET email = ? WHERE id = ?').run(discordUser.email, user.id);
    }

    console.log('[Discord OAuth] Utilisateur:', user.id, user.discord_username, '- login...');

    req.login(user, (err) => {
      if (err) {
        console.error('[Discord OAuth] Erreur req.login:', err);
        return res.redirect(clientUrl + '/panel?error=login_failed');
      }
      req.session.oauthState = null;
      req.session.save((saveErr) => {
        if (saveErr) console.error('[Discord OAuth] Erreur sauvegarde session après login:', saveErr);
        console.log('[Discord OAuth] Succès, redirection vers page liaison Steam');
        res.redirect(clientUrl + '/panel?step=link-steam');
      });
    });
  } catch (err) {
    console.error('[Discord OAuth] Erreur inattendue callback:', err);
    res.redirect(clientUrl + '/panel?error=discord_error');
  }
});

router.get('/steam/link', isAuthenticated, authLimiter, (req, res, next) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').trim();
  if (!req.user) {
    console.log('[Steam] Utilisateur non authentifié');
    return res.redirect(clientUrl + '/panel?error=not_authenticated');
  }
  req.session._steamLinkUserId = req.user.id;
  req.session.save((err) => {
    if (err) console.error('[Steam] Erreur sauvegarde session:', err);
    console.log('[Steam] Redirection vers Steam pour liaison, userId=', req.user.id);
    passport.authenticate('steam')(req, res, next);
  });
});

router.get('/steam/link/return', authLimiter, (req, res, next) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').trim();
  console.log('[Steam] Retour Steam, isAuth=', !!req.isAuthenticated?.(), 'userId=', req.user?.id);

  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    console.log('[Steam] Session perdue au retour - utilisateur non authentifié');
    return res.redirect(clientUrl + '/panel?step=link-steam&error=not_authenticated');
  }

  passport.authenticate('steam', { failureRedirect: clientUrl + '/panel?step=link-steam&error=steam_failed' })(req, res, (err) => {
    if (err) {
      console.error('[Steam] Erreur authenticate:', err);
      return res.redirect(clientUrl + '/panel?step=link-steam&error=steam_failed');
    }

    const steamProfile = req.session._steamLinkProfile;
    if (!steamProfile) {
      console.log('[Steam] Profil Steam non trouvé dans la session');
      return res.redirect(clientUrl + '/panel?step=link-steam&error=steam_no_profile');
    }
    delete req.session._steamLinkProfile;

    const originalUserId = req.session._steamLinkUserId;
    if (!originalUserId) {
      console.log('[Steam] originalUserId manquant');
      return res.redirect(clientUrl + '/panel?step=link-steam&error=steam_no_user');
    }
    delete req.session._steamLinkUserId;

    const result = linkSteamToUser(originalUserId, steamProfile.id, steamProfile.displayName, steamProfile.avatar);
    if (result.error) {
      console.log('[Steam] Steam déjà lié à un autre compte');
      return res.redirect(clientUrl + '/panel?step=link-steam&error=steam_duplicate');
    }

    console.log('[Steam] Liaison réussie pour userId=', originalUserId, 'steamId=', steamProfile.id);
    req.login(result, (loginErr) => {
      if (loginErr) return res.redirect(clientUrl + '/panel?step=link-steam&error=login_failed');
      res.redirect(clientUrl + '/panel?steam=linked');
    });
  });
});

router.get('/session', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    const u = req.user;
    const csrfToken = generateCsrfToken(req);
    return res.json({
      authenticated: true,
      user: {
        id: u.id,
        discordId: u.discord_id,
        discordUsername: u.discord_username,
        discordAvatar: u.discord_avatar,
        displayName: u.display_name || u.discord_username,
        email: u.email,
        steamId: u.steam_id,
        steamUsername: u.steam_username,
        avatar: u.avatar,
        avatarCustom: u.avatar_custom,
        banner: u.banner,
        bio: u.bio,
        role: u.role,
        steamLinked: !!u.steam_id,
        createdAt: u.created_at
      },
      csrfToken
    });
  }
  res.status(401).json({ authenticated: false });
});

router.get('/csrf-token', isAuthenticated, (req, res) => {
  res.json({ csrfToken: generateCsrfToken(req) });
});

router.get('/logout', (req, res) => {
  req.logout(() => {
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

router.post('/steam/unlink', isAuthenticated, verifyCsrf, (req, res) => {
  db.prepare('UPDATE users SET steam_id = NULL, steam_username = NULL, avatar = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(req.user.id);
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  req.user = updated;
  res.json({ success: true });
});

module.exports = router;
