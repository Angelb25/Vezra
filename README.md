# Vezra

"Live your sport." — L'application qui centralise tes défis, tes performances, tes rencontres et tes souvenirs sportifs.

## Stack

- **Backend** : Symfony + API Platform (dans `api/`)
- **Frontend** : React + TypeScript, Vite (dans `app/`)
- **Base de données** : PostgreSQL
- **Auth** : JWT (LexikJWTAuthenticationBundle)

## Structure du repo

```
vezra/
├── api/          # API Symfony
├── app/          # Front React
├── docs/         # Documentation de cadrage (concept, personas, user stories, MCD/MLD...)
├── docker-compose.yml
└── README.md
```

## Installation locale

### 1. Base de données

```bash
docker compose up -d
```

Postgres sera accessible sur `localhost:5432` (user: `vezra`, password: `vezra`, db: `vezra`).
Adminer (interface web de gestion DB) sur `http://localhost:8081`.

### 2. Backend (api/)

⚠️ Le squelette Symfony n'a pas pu être généré automatiquement dans cet environnement (pas d'accès à Packagist). À faire en local :

```bash
cd api
composer create-project symfony/skeleton .
composer require api
composer require symfony/orm-pack
composer require lexik/jwt-authentication-bundle
```

Puis configurer `DATABASE_URL` dans `.env.local` :
```
DATABASE_URL="postgresql://vezra:vezra@127.0.0.1:5432/vezra?serverVersion=16&charset=utf8"
```

Générer les clés JWT :
```bash
php bin/console lexik:jwt:generate-keypair
```

### 3. Frontend (app/)

```bash
cd app
npm install
npm run dev
```

L'app sera accessible sur `http://localhost:5173`.

## Documentation

Voir le dossier `docs/` pour :
- Le concept produit et les versions (V1 à V5)
- Les personas et le pitch
- Les user stories du MVP (priorisées MoSCoW)
- Le détail des tâches (organisé pour Trello)
- Le cadrage technique (hébergement, stack, stratégie d'auth)
- Le MCD/MLD du modèle de données

## Roadmap MVP

Voir `docs/trello-taches-vezra.md` pour le détail des milestones :
- **M1** — Fondations (auth, modèle de données)
- **M2** — Défis (CRUD, progression)
- **M3** — Dashboard & Gamification
- **M4** — Profil & finitions
