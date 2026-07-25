# Backlog — Phase de cadrage

## 1. Identité de marque
- [x] Choisir le nom final → **VEZRA** (validé après vérification web : aucun conflit dans le sport, aucune marque déposée majeure trouvée)
- [ ] Vérifier disponibilité `vezra.com` / `.app` / `.fr` sur un registrar (OVH, Namecheap, Gandi) — à faire par toi directement pour une réponse fiable à 100%
- [ ] Réserver les réseaux sociaux `@vezra` (Instagram, X, TikTok)
- [ ] Recherche INPI si dépôt de marque prévu en France
- [x] Définir le pitch en une phrase → voir `personas-pitch-vezra.md`
- [x] Définir 2-3 personas types → Léa (régulière motivée), Karim (social sportif), Sophie (collectionneuse de souvenirs)

## 2. Identité visuelle
- [x] Moodboard (références d'apps sportives : Strava, Komoot, Whoop...)
- [x] Palette de couleurs → Orange primaire #FF6B35, Ambre secondaire #FFB84D, Anthracite #2D2A32, fond clair #FFF8F3
- [x] Choix de typographie → Sans-serif géométrique arrondie (Sora / Manrope / Poppins)
- [x] Logo — validé : V minimal (victoire + flèche ascendante), déclinable en wordmark et en icône carrée sur fond dégradé
- [x] Déclinaison logo (favicon, icône app, version claire/sombre) → testée sur fond clair et sombre
- [ ] Charte graphique minimale (espacements, style des boutons, style des cartes) — à affiner en phase de design UI

## 3. Cadrage produit
- [ ] Reformuler le concept en document produit (déjà fait ✅)
- [ ] Découper le MVP en epics (Défis, Dashboard, Badges, Auth, Profil)
- [x] Rédiger les user stories du MVP (format "En tant que... je veux... afin de...") → voir `user-stories-mvp-vezra.md`
- [x] Prioriser les user stories (Must-have / Should-have / Could-have) → MoSCoW appliqué dans le même fichier
- [ ] Définir la Definition of Done du MVP
- [x] Wireframes basse fidélité des écrans clés (Dashboard, Créer un défi, Détail défi, Profil) → validés visuellement, cohérents avec la charte Vezra

## 4. Organisation projet
- [ ] Choisir l'outil de gestion (Trello / Notion / Linear / GitHub Projects)
- [ ] Créer le board avec les colonnes (Backlog / À faire / En cours / Terminé)
- [ ] Découper en milestones (ex : Milestone 1 = Auth + modèle de données, Milestone 2 = Défis CRUD, Milestone 3 = Dashboard + Badges)
- [ ] Estimer un ordre de grandeur par epic (jours/semaines)
- [ ] Définir la cadence de travail (combien d'heures/semaine réalistes)

## 5. Cadrage technique (préparatoire, avant modèle de données)
- [ ] Lister les entités principales à haut niveau (User, Défi, Activité, Badge, Sport)
- [ ] Choisir l'hébergement cible (Railway, Fly.io, VPS...)
- [ ] Choisir la stratégie d'auth (JWT maison vs Symfony bundle type LexikJWT)
- [ ] Décider du repo (mono-repo front+back vs deux repos)
- [ ] Mettre en place le squelette de repo (README, structure de dossiers, CI basique)

---

*Une fois les sections 1 à 3 avancées, on enchaîne naturellement sur le modèle de données et l'architecture technique.*
