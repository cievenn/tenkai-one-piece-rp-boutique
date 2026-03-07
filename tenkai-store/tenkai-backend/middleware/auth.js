const crypto = require('crypto');

function isAuthenticated(req, res, next) {
  try {
    if (req.isAuthenticated && typeof req.isAuthenticated === 'function' && req.isAuthenticated() && req.user) return next();
  } catch (_) { /* passport non initialisé */ }
  return res.status(401).json({ error: 'Authentification requise.' });
}

function requireSteamLinked(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentification requise.' });
  if (!req.user.steam_id) return res.status(403).json({ error: 'Vous devez lier votre compte Steam.' });
  return next();
}

function isStaffOrAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentification requise.' });
  if (req.user.role === 'Staff' || req.user.role === 'Admin') return next();
  return res.status(403).json({ error: 'Accès réservé au Staff.' });
}

function isAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentification requise.' });
  if (req.user.role === 'Admin') return next();
  return res.status(403).json({ error: 'Accès réservé aux Administrateurs.' });
}

function gmodApiAuth(req, res, next) {
  const key = req.headers['x-gmod-api-key'];
  if (!key || key !== process.env.GMOD_API_KEY) {
    return res.status(401).json({ error: 'Clé API GMod invalide.' });
  }
  next();
}

function generateCsrfToken(req) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  return req.session.csrfToken;
}

function verifyCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const token = req.headers['x-csrf-token'];
  if (!req.session || !token || token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Jeton CSRF invalide. Rechargez la page.' });
  }
  next();
}

module.exports = { isAuthenticated, requireSteamLinked, isStaffOrAdmin, isAdmin, gmodApiAuth, generateCsrfToken, verifyCsrf };
