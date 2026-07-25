# api — Backend Symfony

Ce dossier est prêt à recevoir le projet Symfony. Il n'a pas pu être généré automatiquement dans l'environnement de préparation (pas d'accès réseau à Packagist).

## À faire en local

```bash
cd api
composer create-project symfony/skeleton .
composer require api          # API Platform
composer require symfony/orm-pack
composer require symfony/maker-bundle --dev
composer require lexik/jwt-authentication-bundle
```

Voir le README à la racine du repo pour la suite de la configuration (base de données, clés JWT).

## Première entité à créer (M1)

Une fois Symfony installé, générer les entités à partir du MCD/MLD dans `../docs/mcd-mld-vezra.md` :

```bash
php bin/console make:entity User
php bin/console make:entity Challenge
php bin/console make:entity Progress
php bin/console make:entity Badge
php bin/console make:entity UserBadge
php bin/console make:entity Sport
```
