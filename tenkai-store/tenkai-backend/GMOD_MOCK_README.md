# GMod Mock - Tests locaux sans serveur Garry's Mod

## Activation

1. Dans `.env`, ajoutez :
   ```
   USE_GMOD_MOCK=true
   GMOD_MOCK_STEAM_ID=STEAM_0:0:12345678
   ```
   Remplacez `STEAM_0:0:12345678` par votre Steam ID (visible dans le Panel après avoir lié Steam).

2. Redémarrez le backend.

## Utilisation

### Option A : Bouton "Simuler achat" dans le panier

- Connectez-vous avec Discord.
- Liez votre compte Steam (Panel > Paramètres).
- Ajoutez des articles au panier.
- Un bouton violet **"Simuler achat (sans paiement)"** apparaît.
- Cliquez dessus pour créer des entrées de sync sans passer par Stripe.

### Option B : Mock client (simule le serveur GMod)

Le mock client simule les appels que le serveur GMod ferait vers le backend.

```bash
cd tenkai-backend
npm run gmod-mock
```

Ou manuellement :
```bash
node gmod-mock-client.js
```

Variables d'environnement optionnelles :
- `GMOD_MOCK_STEAM_ID` : Steam ID à surveiller (défaut : STEAM_0:0:12345678)
- `GMOD_MOCK_POLL_MS` : Intervalle de poll en ms (défaut : 5000)

Le client interroge régulièrement `/api/gmod/player/:steamId` et valide les achats en attente via `/api/gmod/ack-sync`.

## Désactivation

Retirez ou commentez `USE_GMOD_MOCK=true` dans `.env` et redémarrez. Le bouton "Simuler achat" disparaîtra.
