const rateLimit = require('express-rate-limit');
const sanitizeHtml = require('sanitize-html');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes. Réessayez dans quelques minutes.' },
  validate: { xForwardedForHeader: false }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives de connexion. Réessayez plus tard.' }
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Limite d\'écriture atteinte. Réessayez plus tard.' }
});

const SANITIZE_OPTIONS = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: 'recursiveEscape'
};

function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return sanitizeHtml(str.trim(), SANITIZE_OPTIONS);
}

function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }
  next();
}

function validateLength(field, value, min, max) {
  if (typeof value !== 'string') return `${field} doit être une chaîne de caractères.`;
  if (value.length < min) return `${field} doit contenir au moins ${min} caractères.`;
  if (value.length > max) return `${field} ne doit pas dépasser ${max} caractères.`;
  return null;
}

module.exports = {
  globalLimiter,
  authLimiter,
  writeLimiter,
  sanitizeString,
  sanitizeBody,
  validateLength
};
