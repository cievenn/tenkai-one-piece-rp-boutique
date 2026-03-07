/**
 * GMod Mock Client - Simule le serveur Garry's Mod pour tests locaux
 *
 * Ce script simule les appels que le serveur GMod ferait vers le backend Tenkai.
 * Permet de tester le panel (boutique, sync achats, profil) sans serveur GMod.
 *
 * Usage: node gmod-mock-client.js
 * Prérequis: BACKEND_URL et GMOD_API_KEY dans .env (ou variables d'environnement)
 */

require('dotenv').config();

const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');
const GMOD_API_KEY = process.env.GMOD_API_KEY || 'tenkai-gmod-api-key-change-me';
const POLL_INTERVAL_MS = parseInt(process.env.GMOD_MOCK_POLL_MS || '5000', 10);

// Steam ID de test - à remplacer par un steam_id d'un utilisateur ayant lié Steam
// Vous pouvez le récupérer depuis la base users (steam_id) après avoir lié un compte
const TEST_STEAM_ID = process.env.GMOD_MOCK_STEAM_ID || 'STEAM_0:0:12345678';

async function fetchGmod(endpoint, options = {}) {
  const url = `${BACKEND_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-GMOD-API-Key': GMOD_API_KEY,
      ...options.headers,
    },
  });
  return res;
}

async function getPlayer(steamId) {
  const res = await fetchGmod(`/api/gmod/player/${encodeURIComponent(steamId)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Player fetch failed: ${res.status}`);
  return res.json();
}

async function ackSync(syncIds) {
  const res = await fetchGmod('/api/gmod/ack-sync', {
    method: 'POST',
    body: JSON.stringify({ syncIds }),
  });
  if (!res.ok) throw new Error(`Ack sync failed: ${res.status}`);
  return res.json();
}

async function updatePlayer(steamId, data) {
  const res = await fetchGmod('/api/gmod/update-player', {
    method: 'POST',
    body: JSON.stringify({ steamId, ...data }),
  });
  if (!res.ok) throw new Error(`Update player failed: ${res.status}`);
  return res.json();
}

async function pollAndProcess() {
  try {
    const data = await getPlayer(TEST_STEAM_ID);
    if (!data) {
      console.log(`[GMod Mock] Joueur ${TEST_STEAM_ID} non trouvé (normal si Steam non lié)`);
      return;
    }
    const { pendingPurchases = [] } = data;
    if (pendingPurchases.length > 0) {
      const ids = pendingPurchases.map((p) => p.id).filter(Boolean);
      if (ids.length > 0) {
        const result = await ackSync(ids);
        console.log(`[GMod Mock] Sync ack: ${result.synced || ids.length} achats validés`);
      }
    }
  } catch (err) {
    console.error('[GMod Mock] Erreur:', err.message);
  }
}

async function main() {
  console.log('[GMod Mock] Démarrage - Backend:', BACKEND_URL);
  console.log('[GMod Mock] Steam ID test:', TEST_STEAM_ID);
  console.log('[GMod Mock] Poll toutes les', POLL_INTERVAL_MS / 1000, 'secondes');
  console.log('---');

  setInterval(pollAndProcess, POLL_INTERVAL_MS);
  await pollAndProcess();
}

main().catch((err) => {
  console.error('[GMod Mock] Fatal:', err);
  process.exit(1);
});
