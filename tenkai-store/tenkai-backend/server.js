require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const cors = require('cors');
// 1. IMPORT DE STRIPE
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// 2. PERMET AU SERVEUR DE LIRE LE FORMAT JSON (Le panier)
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: process.env.STEAM_API_KEY
  },
  function(identifier, profile, done) {
    return done(null, profile);
  }
));

// --- ROUTES STEAM --- (Garde celles que tu as déjà)
app.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/' }));
app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: process.env.CLIENT_URL }), (req, res) => { res.redirect(process.env.CLIENT_URL); });
app.get('/auth/session', (req, res) => {
    if (req.isAuthenticated()) res.json({ authenticated: true, user: { steamId: req.user.id, name: req.user.displayName, avatar: req.user.photos[2].value }});
    else res.status(401).json({ authenticated: false });
});
app.get('/auth/logout', (req, res) => { req.logout((err) => { res.redirect(process.env.CLIENT_URL); }); });

// --- NOUVELLE ROUTE : STRIPE CHECKOUT ---
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { cart } = req.body;

        // 1. On transforme ton panier React en panier compréhensible par Stripe
        const lineItems = cart.map((item) => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name || item.title,
                },
                // Stripe gère les prix en centimes (5.00€ devient 500)
                unit_amount: Math.round(item.price * 100), 
            },
            quantity: 1,
        }));

        // 2. On demande à Stripe de créer une session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'paypal'], // Tu pourras rajouter d'autres moyens de paiement depuis ton dashboard Stripe
            line_items: lineItems,
            mode: 'payment',
            // URLs de retour après le paiement
            success_url: `${process.env.CLIENT_URL}/?payment=success`,
            cancel_url: `${process.env.CLIENT_URL}/?payment=cancel`,
        });

        // 3. On renvoie l'URL sécurisée au Frontend
        res.json({ url: session.url });
    } catch (error) {
        console.error("Erreur Stripe:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Serveur Tenkai démarré sur le port ${process.env.PORT} 🏴‍☠️`);
});