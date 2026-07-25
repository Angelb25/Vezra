# Vezra — Cadrage technique préparatoire

## 1. Entités principales (haut niveau)

Ce n'est pas encore le modèle de données détaillé (avec types de champs, contraintes, etc.) — juste la carte des entités et de leurs relations, pour valider la cohérence avant de passer au vrai schéma.

- **User** — email, mot de passe (hashé), pseudo, avatar, date d'inscription, niveau, XP total
- **Défi** — appartient à un User, type (distance / répétition / fréquence / occurrence), objectif, valeur actuelle, unité, date de création, date limite, statut (en cours / terminé / abandonné)
- **Activité / Progression** — appartient à un Défi, valeur ajoutée, date, note optionnelle (préparation du futur module Passport, cf. story 5.3)
- **Badge** — nom, description, condition de déblocage (règle), icône
- **UserBadge** — table de liaison User ↔ Badge avec date de déblocage
- **Sport** *(optionnel dès le MVP, ou en dur en V1)* — nom, catégorie. Peut rester une simple énumération au départ plutôt qu'une vraie table, pour ne pas complexifier inutilement le MVP.

*(Le schéma détaillé avec types de champs et contraintes viendra dans une étape dédiée, juste avant de coder le M1.)*

---

## 2. Choix technos — confirmé

| Couche | Techno | Remarque |
|---|---|---|
| Backend | Symfony + API Platform | Génère l'API REST rapidement à partir des entités Doctrine |
| Frontend | React + TypeScript | Cohérent avec ce qu'on a prévu depuis le début |
| Base de données | PostgreSQL | Bon support JSON (utile pour des champs flexibles comme les conditions de badges) |
| Auth | JWT via LexikJWTAuthenticationBundle | Bundle standard, bien documenté, évite de réinventer la roue |
| Styling front | À définir en démarrant le M1 (CSS Modules, Tailwind, ou styled-components) | Pas bloquant pour le cadrage |

---

## 3. Hébergement — 100% gratuit

Pour un side-project, voici une stack entièrement sur free tier, réaliste en 2026 :

| Composant | Service recommandé | Limite à connaître |
|---|---|---|
| Base de données PostgreSQL | **Neon** | Free tier généreux (branching, autoscaling), mais le stockage/compute a un plafond — largement suffisant pour un MVP solo |
| Backend Symfony | **Render** (free web service) | Le service se met en veille après inactivité et redémarre au premier appel (quelques secondes de délai) — acceptable pour un projet perso, gênant si tu veux une démo instantanée à un recruteur |
| Frontend React | **Vercel** ou **Netlify** | Free tier solide, pas de mise en veille, déploiement automatique depuis Git |
| Nom de domaine | Optionnel au début | Tu peux rester sur les sous-domaines gratuits (`.vercel.app`, `.onrender.com`) le temps du MVP |

**Point de vigilance à connaître :** avec Render gratuit, le backend "s'endort" après un moment sans requête. Si tu comptes montrer l'app à un recruteur ou un utilisateur test, prévois de "réveiller" le service quelques minutes avant, ou budgétise un petit plan payant (~7€/mois) le jour où tu veux une démo fiable.

---

## 4. Stratégie d'auth — confirmé

**LexikJWTAuthenticationBundle**, plutôt qu'un système JWT fait maison :
- Bundle mature, largement utilisé avec Symfony/API Platform
- Gère la génération de clés, la signature, la validation des tokens
- S'intègre nativement avec le security.yaml de Symfony
- Documentation abondante si tu bloques

---

## 5. Structure de repo — mono-repo

**Décision : mono-repo**, avec cette structure :

```
vezra/
├── api/          # Symfony + API Platform
├── app/          # React + TypeScript
├── docs/         # Tes documents de cadrage (concept, personas, user stories...)
└── README.md
```

**Pourquoi mono-repo plutôt que deux repos séparés**, pour un projet solo :
- Un seul endroit pour suivre l'avancement global, pas besoin de jongler entre deux repos GitHub
- Les commits qui touchent front + back en même temps (ex : ajouter un champ à une entité + l'afficher côté UI) restent groupés et lisibles dans l'historique
- Plus simple à cloner et à mettre en place pour toi tout seul — le vrai avantage des repos séparés (déploiements indépendants, équipes séparées) ne s'applique pas ici puisque tu es seul sur les deux couches

---

## 6. Squelette de repo — checklist de démarrage

- [ ] Créer le repo GitHub `vezra`
- [ ] Initialiser `api/` avec `symfony new api --webapp` puis installer API Platform
- [ ] Initialiser `app/` avec Vite + React + TypeScript (`npm create vite@latest app -- --template react-ts`)
- [ ] Ajouter un `.gitignore` global (vendor/, node_modules/, .env.local, var/)
- [ ] Créer `docs/` et y déplacer les fichiers déjà produits (concept, personas, user stories, backlog)
- [ ] Rédiger le README avec : description du projet, stack, instructions d'installation locale
- [ ] Configurer Docker Compose pour PostgreSQL en local (évite d'installer Postgres nativement)
- [ ] Premier commit + push

---

## Bilan — le cadrage est terminé

Avec cette section, les 5 parties du backlog de cadrage sont bouclées : identité de marque, identité visuelle, cadrage produit, organisation projet, cadrage technique. Tu peux passer au modèle de données détaillé puis au code du M1 (Fondations) en confiance.
