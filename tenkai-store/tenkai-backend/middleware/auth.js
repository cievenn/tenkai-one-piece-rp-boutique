const crypto = require('crypto');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    return next();
  }
  return res.status(401).json({ error: 'Authentification requise.' });
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

function generateCsrfToken(req) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  return req.session.csrfToken;
}

function verifyCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const token = req.headers['x-csrf-token'];
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Jeton CSRF invalide. Rechargez la page.' });
  }
  next();
}

module.exports = { isAuthenticated, isStaffOrAdmin, isAdmin, generateCsrfToken, verifyCsrf };
