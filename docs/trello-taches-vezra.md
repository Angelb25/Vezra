# Vezra — Board Trello

Structure conseillée : une liste par milestone, une carte par tâche. Les sous-puces sous chaque tâche correspondent aux checklists à créer dans la carte Trello.

---

## Liste : Backlog (idées / V2+)
*Cartes à créer mais à ne pas prioriser maintenant — juste pour ne rien perdre*
- Import Strava/Garmin
- Recherche de partenaires (V2)
- Événements (V2)
- Module Passport / carte des lieux (V3)
- Wrapped Sport annuel (V4)
- Recommandations IA (V5)

---

## Liste : M1 — Fondations

**Setup projet**
- [ ] Créer le repo Git (mono-repo ou 2 repos front/back — à trancher)
- [ ] Initialiser projet Symfony (API Platform)
- [ ] Initialiser projet React + TypeScript
- [ ] Configurer PostgreSQL en local (Docker recommandé)
- [ ] Mettre en place les variables d'environnement (.env)
- [ ] Configurer un linter/formatter (PHP-CS-Fixer, ESLint, Prettier)
- [ ] Rédiger le README avec instructions d'installation

**Authentification (stories 1.1, 1.2, 1.3, 5.2)**
- [ ] Installer et configurer LexikJWTAuthenticationBundle
- [ ] Créer l'entité User (email, password hashé, pseudo, avatar, dates)
- [ ] Endpoint API : inscription (POST /api/register)
- [ ] Endpoint API : connexion (POST /api/login_check)
- [ ] Endpoint API : refresh token (si applicable)
- [ ] Endpoint API : mot de passe oublié (envoi email + reset)
- [ ] Écran front : formulaire d'inscription
- [ ] Écran front : formulaire de connexion
- [ ] Écran front : mot de passe oublié
- [ ] Gestion du stockage du token côté front (httpOnly cookie ou storage sécurisé)
- [ ] Middleware/guard de routes protégées côté front

**Modèle de données (story 5.1)**
- [ ] Modéliser l'entité Défi (type, objectif, unité, date limite, statut)
- [ ] Modéliser l'entité Activité/Progression (liée à un défi, valeur, date)
- [ ] Modéliser l'entité Badge (nom, condition de déblocage, icône)
- [ ] Modéliser la relation User ↔ Badges débloqués
- [ ] Prévoir le champ/relation extensible pour un futur "souvenir" (story 5.3)
- [ ] Écrire les migrations Doctrine
- [ ] Créer des fixtures de données de test

---

## Liste : M2 — Défis

**Backend**
- [ ] Endpoint : créer un défi (POST /api/defis)
- [ ] Endpoint : lister mes défis (GET /api/defis)
- [ ] Endpoint : détail d'un défi (GET /api/defis/{id})
- [ ] Endpoint : modifier un défi (PUT /api/defis/{id})
- [ ] Endpoint : supprimer un défi (DELETE /api/defis/{id})
- [ ] Endpoint : ajouter une progression (POST /api/defis/{id}/progression)
- [ ] Logique de calcul de progression — type distance
- [ ] Logique de calcul de progression — type répétition
- [ ] Logique de calcul de progression — type fréquence
- [ ] Logique de calcul de progression — type occurrence
- [ ] Validation des données (DTO/contraintes API Platform)
- [ ] Tests unitaires sur le calcul de progression (au moins 1 par type)

**Frontend**
- [ ] Écran : liste des défis en cours / terminés
- [ ] Écran : formulaire de création de défi (sélection du type)
- [ ] Composant : sélecteur de type de défi
- [ ] Écran : détail d'un défi avec barre/jauge de progression
- [ ] Composant : formulaire d'ajout de progression
- [ ] Composant : historique des entrées de progression
- [ ] Fonction : modifier / supprimer un défi
- [ ] Gestion des états de chargement et des erreurs API

---

## Liste : M3 — Dashboard & Gamification

**Backend**
- [ ] Endpoint : résumé dashboard (défis en cours, % global, streak)
- [ ] Logique de calcul du streak (série de jours actifs)
- [ ] Logique d'attribution d'XP à chaque progression
- [ ] Logique de déblocage des badges (règles par badge)
- [ ] Endpoint : liste des badges (débloqués + à débloquer)
- [ ] Endpoint : niveau et XP de l'utilisateur
- [ ] Seed des badges initiaux en base (premier 5 km, 100 séances, etc.)

**Frontend**
- [ ] Écran : dashboard (résumé du jour, streak, défis en cours)
- [ ] Composant : carte "prochain objectif"
- [ ] Écran : collection de badges (grille débloqués/verrouillés)
- [ ] Composant : barre XP / niveau
- [ ] Animation ou feedback visuel lors d'un déblocage de badge (si le temps le permet)

---

## Liste : M4 — Profil & finitions

**Profil (stories 1.4, 4.3, 4.4)**
- [ ] Endpoint : consulter/modifier le profil (pseudo, avatar)
- [ ] Écran : page profil (avatar, niveau, XP, badges résumés)
- [ ] Écran : paramètres du compte (infos perso, notifications, déconnexion)
- [ ] Upload de photo de profil (stockage local ou S3-compatible)

**Qualité & déploiement**
- [ ] Revue UI globale : cohérence avec la charte graphique (couleurs, typo, espacements)
- [ ] Tests manuels de bout en bout sur les 4 écrans clés
- [ ] Corriger les bugs remontés lors des tests
- [ ] Configurer le déploiement backend (Railway, Fly.io, ou VPS)
- [ ] Configurer le déploiement frontend (Vercel, Netlify)
- [ ] Configurer un nom de domaine (si applicable)
- [ ] Mettre en place un minimum de monitoring/logs d'erreurs
- [ ] Rédiger une courte doc utilisateur ou FAQ

---

## Liste : Done
*Vide au départ — tu déplaces les cartes ici au fur et à mesure*

---

## Conseil d'usage Trello
- Utilise des **labels** par epic (Auth, Défis, Dashboard, Badges, Profil, Technique) pour filtrer facilement.
- Ajoute une **due date** sur chaque liste de milestone (pas sur chaque carte individuellement, trop lourd à maintenir seul).
- Une carte = idéalement une tâche de 1 à 4h. Si une carte te semble prendre plus d'une journée, découpe-la en sous-cartes.
