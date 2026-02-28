// tenkai-backend/server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const cors = require('cors');

const app = express();

// 1. Autoriser React à parler au serveur
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true // Crucial pour laisser passer les cookies de session
}));

// 2. Configuration des sessions sécurisées
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true en HTTPS (prod)
        httpOnly: true, // Empêche le vol de cookie via JavaScript
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 semaine
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// 3. Configuration de la Stratégie Steam
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: process.env.STEAM_API_KEY
  },
  function(identifier, profile, done) {
    // Ici, tu pourrais chercher l'utilisateur dans ta base de données
    // Pour l'instant, on renvoie juste son profil Steam
    return done(null, profile);
  }
));

// --- ROUTES API ---

// Lancer la connexion Steam
app.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/' }));

// Le retour de Steam après validation
app.get('/auth/steam/return', 
  passport.authenticate('steam', { failureRedirect: process.env.CLIENT_URL }),
  (req, res) => {
    // Connexion réussie ! On redirige vers ton site React
    res.redirect(process.env.CLIENT_URL);
  }
);

// Vérifier si un utilisateur est connecté (utilisé par React)
app.get('/auth/session', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                steamId: req.user.id,
                name: req.user.displayName,
                avatar: req.user.photos[2].value // L'avatar en haute qualité
            }
        });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

// Déconnexion
app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect(process.env.CLIENT_URL);
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Serveur Tenkai démarré sur le port ${process.env.PORT} 🏴‍☠️`);
});