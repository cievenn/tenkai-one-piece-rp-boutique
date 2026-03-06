require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { db, findOrCreateUser, SQLiteSessionStore } = require('./database/init');
const { verifyCsrf } = require('./middleware/auth');
const { globalLimiter } = require('./middleware/security');

const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token']
}));

app.use(globalLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  setHeaders: (res) => {
    res.set('X-Content-Type-Options', 'nosniff');
  }
}));

const sessionStore = new SQLiteSessionStore();
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'tenkai.sid',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;

passport.use(new SteamStrategy({
    returnURL: `${BACKEND_URL}/auth/steam/return`,
    realm: BACKEND_URL + '/',
    apiKey: process.env.STEAM_API_KEY
  },
  function(identifier, profile, done) {
    try {
      const steamId = profile.id;
      const username = profile.displayName;
      const avatar = profile.photos?.[2]?.value || profile.photos?.[0]?.value || '';
      const user = findOrCreateUser(steamId, username, avatar);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

app.use('/auth', authRoutes);
app.use('/api/tickets', verifyCsrf, ticketRoutes);
app.use('/api/users', verifyCsrf, userRoutes);

app.post('/api/create-checkout-session', verifyCsrf, async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentification requise.' });
  }

  try {
    const { cart } = req.body;
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Panier vide.' });
    }

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
      metadata: { steamId: req.user.steam_id }
    });

    res.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Erreur Stripe:", error);
    res.status(500).json({ error: 'Erreur lors de la création du paiement.' });
  }
});

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Fichier trop volumineux (max 5 Mo).' });
  }
  if (err.message?.includes('Format non autorisé')) {
    return res.status(400).json({ error: err.message });
  }
  console.error('Server error:', err);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur Tenkai démarré sur le port ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
});

process.on('SIGINT', () => {
  sessionStore.close();
  db.close();
  process.exit(0);
});
