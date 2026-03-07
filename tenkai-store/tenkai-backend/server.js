require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { db, linkSteamToUser, SQLiteSessionStore } = require('./database/init');
const { verifyCsrf } = require('./middleware/auth');
const { globalLimiter } = require('./middleware/security');

const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');
const gmodRoutes = require('./routes/gmod');
const notificationRoutes = require('./routes/notifications');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'X-GMOD-API-Key']
}));

app.use(globalLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  setHeaders: (res) => { res.set('X-Content-Type-Options', 'nosniff'); }
}));

const sessionStore = new SQLiteSessionStore();
const isProd = process.env.NODE_ENV === 'production';
app.use(session({
  store: sessionStore,
  secret: (process.env.SESSION_SECRET || 'change-me-dev').trim(),
  resave: false,
  saveUninitialized: false,
  name: 'tenkai.sid',
  cookie: {
    secure: isProd,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: isProd ? 'none' : 'lax',
    path: '/'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    done(null, user || null);
  } catch (err) { done(err, null); }
});

const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;

passport.use(new SteamStrategy({
    returnURL: `${BACKEND_URL}/auth/steam/link/return`,
    realm: BACKEND_URL + '/',
    apiKey: process.env.STEAM_API_KEY,
    passReqToCallback: true
  },
  function(req, identifier, profile, done) {
    try {
      if (req.user) {
        req.session._steamLinkProfile = {
          id: profile.id,
          displayName: profile.displayName,
          avatar: profile.photos?.[2]?.value || profile.photos?.[0]?.value || ''
        };
        req.session._steamLinkUserId = req.user.id;
        return done(null, req.user);
      }
      return done(null, false);
    } catch (err) { return done(err, null); }
  }
));

app.use('/auth', authRoutes);
app.use('/api/tickets', verifyCsrf, ticketRoutes);
app.use('/api/users', verifyCsrf, userRoutes);
app.use('/api/notifications', verifyCsrf, notificationRoutes);
app.use('/api/gmod', gmodRoutes);

// --- ROUTES DEV MOCK GMod (uniquement si USE_GMOD_MOCK=true) ---
const useGmodMock = process.env.USE_GMOD_MOCK === 'true' || process.env.USE_GMOD_MOCK === '1';
if (useGmodMock) {
  const { isAuthenticated } = require('./middleware/auth');
  const { db } = require('./database/init');
  app.get('/api/dev/mock-enabled', (req, res) => res.json({ enabled: true }));
  app.post('/api/dev/simulate-purchase', isAuthenticated, verifyCsrf, (req, res) => {
    try {
      const user = req.user;
      if (!user?.steam_id) {
        return res.status(400).json({ error: 'Liez d\'abord votre compte Steam pour simuler un achat.' });
      }
      const { cart } = req.body;
      if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: 'Panier vide.' });
      }
      for (const item of cart) {
        const payload = JSON.stringify({
          itemId: item.id || item.name,
          itemName: item.name || item.title || 'Item',
          price: item.price || 0,
          timestamp: Date.now()
        });
        db.prepare('INSERT INTO gmod_sync_log (steam_id, action, payload) VALUES (?, ?, ?)')
          .run(user.steam_id, 'purchase', payload);
      }
      console.log('[GMod Mock] Achats simulés pour', user.steam_id, ':', cart.length, 'items');
      res.json({ success: true, message: `${cart.length} achat(s) simulé(s). Lancez le mock client pour les valider.` });
    } catch (err) {
      console.error('[GMod Mock] Erreur simulate-purchase:', err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });
  console.log('[GMod Mock] Route /api/dev/simulate-purchase activée');
}

app.post('/api/create-checkout-session', verifyCsrf, async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentification requise.' });
  }
  try {
    const { cart } = req.body;
    if (!Array.isArray(cart) || cart.length === 0) return res.status(400).json({ error: 'Panier vide.' });

    const lineItems = cart.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: String(item.name || item.title).substring(0, 200) },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: 1,
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/?payment=cancel`,
      metadata: { steamId: req.user.steam_id || '', discordId: req.user.discord_id }
    });
    res.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Erreur Stripe:", error);
    res.status(500).json({ error: 'Erreur lors de la création du paiement.' });
  }
});

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Fichier trop volumineux (max 5 Mo).' });
  if (err.message?.includes('Format non autorisé')) return res.status(400).json({ error: err.message });
  console.error('Server error:', err);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur Tenkai démarré sur le port ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
});

process.on('SIGINT', () => { sessionStore.close(); db.close(); process.exit(0); });
