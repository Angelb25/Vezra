/**
 * Script de test automatique de l'API Vezra.
 * Usage : node test-api.js
 * Prérequis : le serveur PHP (php -S 127.0.0.1:8000 -t public) et Docker doivent tourner.
 */

const BASE_URL = 'http://127.0.0.1:8000/api';

// Compte de test unique à chaque exécution, pour ne jamais entrer en conflit
const timestamp = Date.now();
const testEmail = `test.${timestamp}@vezra.dev`;
const testPassword = 'motdepasse123';
const testPseudo = `Test${timestamp}`;

let token = null;
let passed = 0;
let failed = 0;

function log(status, label, detail = '', rawText = null) {
  const icon = status ? '✅' : '❌';
  console.log(`${icon} ${label}${detail ? ' — ' + detail : ''}`);
  if (!status && rawText !== null && rawText !== undefined) {
    const snippet = typeof rawText === 'string' ? rawText.slice(0, 300) : JSON.stringify(rawText);
    console.log(`   ↳ brut : ${snippet}`);
  }
  if (status) passed++; else failed++;
}

async function request(method, path, body = null, useAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (useAuth && token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { /* pas du JSON, on garde le texte brut */ }

  return { status: res.status, data, text };
}

async function run() {
  console.log(`\n=== Tests API Vezra — ${new Date().toLocaleString('fr-FR')} ===\n`);

  // --- 1. Inscription ---
  const register = await request('POST', '/register', {
    email: testEmail,
    password: testPassword,
    pseudo: testPseudo,
  }, false);
  log(register.status === 201, 'Inscription', `status ${register.status}`);

  // --- 2. Connexion ---
  const login = await request('POST', '/login_check', {
    username: testEmail,
    password: testPassword,
  }, false);
  log(login.status === 200 && !!login.data?.token, 'Connexion (login_check)', `status ${login.status}`);
  token = login.data?.token;

  if (!token) {
    console.log('\n❌ Impossible de continuer sans token. Arrêt des tests.\n');
    printSummary();
    return;
  }

  // --- 3. Profil (/api/me) ---
  const me = await request('GET', '/me');
  log(me.status === 200 && me.data?.email === testEmail, 'GET /api/me', `pseudo: ${me.data?.pseudo}`);

  // --- 4. Créer un défi distance ---
  const createChallenge = await request('POST', '/challenges', {
    titre: 'Test automatique - distance',
    type: 'distance',
    objectifValeur: 5,
    unite: 'km',
  });
  log(createChallenge.status === 201, 'Créer un défi', `id: ${createChallenge.data?.id}`);
  const challengeId = createChallenge.data?.id;

  // --- 5. Lister mes défis ---
  const list = await request('GET', '/challenges');
  log(list.status === 200 && Array.isArray(list.data) && list.data.length === 1, 'Lister mes défis', `${list.data?.length} défi(s)`);

  // --- 6. Détail d'un défi ---
  const detail = await request('GET', `/challenges/${challengeId}`);
  log(detail.status === 200 && detail.data?.id === challengeId, 'Détail du défi');

  // --- 7. Ajouter une progression (partielle) ---
  const progress1 = await request('POST', `/challenges/${challengeId}/progress`, { valeur: 2 });
  log(
    progress1.status === 201 && progress1.data?.statutDefi === 'en_cours',
    'Ajouter progression (2/5 km)',
    `status ${progress1.status}`,
    progress1.text
  );

  // --- 8. Ajouter une progression qui termine le défi ---
  const progress2 = await request('POST', `/challenges/${challengeId}/progress`, { valeur: 3 });
  log(
    progress2.status === 201 && progress2.data?.statutDefi === 'termine',
    'Ajouter progression (atteint 5/5 km → terminé)',
    `status ${progress2.status}`,
    progress2.text
  );
  log(
    progress1.data?.nouveauxBadges?.some((b) => b.nom === 'Premier défi créé'),
    'Badge "Premier défi créé" débloqué (dès la 1ère progression)',
    '',
    progress1.text
  );
  log(
    progress2.data?.nouveauxBadges?.some((b) => b.nom === 'Premier défi terminé'),
    'Badge "Premier défi terminé" débloqué'
  );
  log(
    progress2.data?.nouveauxBadges?.some((b) => b.nom === 'Premier 5 km'),
    'Badge "Premier 5 km" débloqué'
  );

  // --- 9. Historique de progression ---
  const history = await request('GET', `/challenges/${challengeId}/progress`);
  log(history.status === 200 && history.data?.length === 2, 'Historique des progressions', `${history.data?.length} entrée(s)`);

  // --- 10. Impossible d'ajouter une progression sur un défi terminé ---
  const progressOnFinished = await request('POST', `/challenges/${challengeId}/progress`, { valeur: 1 });
  log(progressOnFinished.status === 400, 'Rejet ajout progression sur défi terminé', `status ${progressOnFinished.status}`);

  // --- 11. Modifier un défi ---
  const update = await request('PUT', `/challenges/${challengeId}`, { titre: 'Titre modifié' });
  log(update.status === 200 && update.data?.titre === 'Titre modifié', 'Modifier le défi');

  // --- 12. Liste des badges ---
  const badges = await request('GET', '/badges');
  const debloquesCount = badges.data?.filter((b) => b.debloque).length;
  log(badges.status === 200 && badges.data?.length === 15, 'Liste des badges', `${badges.data?.length} badges, ${debloquesCount} débloqués`);

  // --- 13. Sécurité : un autre utilisateur ne doit pas voir ce défi ---
  const otherEmail = `other.${timestamp}@vezra.dev`;
  await request('POST', '/register', { email: otherEmail, password: testPassword, pseudo: 'Other' }, false);
  const otherLogin = await request('POST', '/login_check', { username: otherEmail, password: testPassword }, false);
  const otherToken = otherLogin.data?.token;

  const savedToken = token;
  token = otherToken;
  const forbiddenAccess = await request('GET', `/challenges/${challengeId}`);
  token = savedToken;
  log(forbiddenAccess.status === 403, 'Sécurité : accès refusé aux défis des autres', `status ${forbiddenAccess.status}`);

  // --- 14. Supprimer le défi ---
  const del = await request('DELETE', `/challenges/${challengeId}`);
  log(del.status === 204, 'Supprimer le défi', `status ${del.status}`);

  // --- 15. Le défi ne doit plus exister ---
  const afterDelete = await request('GET', `/challenges/${challengeId}`);
  log(afterDelete.status === 404, 'Défi bien introuvable après suppression', `status ${afterDelete.status}`);

  printSummary();
}

function printSummary() {
  console.log(`\n=== Résumé : ${passed} réussis / ${failed} échoués ===\n`);
  if (failed === 0) {
    console.log('🎉 Tous les tests backend sont passés !');
  } else {
    console.log('⚠️  Certains tests ont échoué — regarde les ❌ ci-dessus.');
  }
}

run().catch((err) => {
  console.error('\n💥 Erreur inattendue pendant les tests :', err.message);
  console.error('Vérifie que le serveur PHP et Docker tournent bien.');
});
