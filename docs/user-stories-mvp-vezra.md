# Vezra — User stories du MVP

Format : "En tant que [persona], je veux [action], afin de [bénéfice]."
Priorité MoSCoW : **M** = Must-have (bloquant pour le MVP) · **S** = Should-have (important mais pas bloquant) · **C** = Could-have (si le temps le permet)

---

## Epic 1 — Authentification & Profil

| # | User story | Priorité |
|---|---|---|
| 1.1 | En tant qu'utilisateur, je veux créer un compte (email + mot de passe), afin d'accéder à l'application. | M |
| 1.2 | En tant qu'utilisateur, je veux me connecter et rester connecté, afin de ne pas ressaisir mes identifiants à chaque ouverture. | M |
| 1.3 | En tant qu'utilisateur, je veux réinitialiser mon mot de passe, afin de récupérer l'accès à mon compte si je l'oublie. | M |
| 1.4 | En tant qu'utilisateur, je veux renseigner un pseudo et une photo de profil, afin de personnaliser mon compte. | S |
| 1.5 | En tant qu'utilisateur, je veux me connecter avec Google/Apple, afin de créer un compte plus rapidement. | C |

## Epic 2 — Défis

| # | User story | Priorité |
|---|---|---|
| 2.1 | En tant que Léa, je veux créer un défi en choisissant un type (distance, répétition, fréquence, occurrence), afin de me fixer un objectif concret. | M |
| 2.2 | En tant que Léa, je veux définir une date limite pour mon défi, afin de me donner un cadre temporel. | M |
| 2.3 | En tant que Léa, je veux enregistrer manuellement ma progression (ex : j'ai couru 3 km aujourd'hui), afin de suivre mon avancement. | M |
| 2.4 | En tant que Léa, je veux voir la progression de mon défi sous forme de barre/pourcentage, afin de visualiser en un coup d'œil où j'en suis. | M |
| 2.5 | En tant que Léa, je veux voir la liste de tous mes défis en cours et terminés, afin de garder une vue d'ensemble. | M |
| 2.6 | En tant que Léa, je veux modifier ou supprimer un défi, afin de corriger une erreur ou changer d'objectif. | S |
| 2.7 | En tant que Karim, je veux créer un défi de type "jouer X matchs par semaine", afin de suivre ma régularité sur un sport collectif. | S |
| 2.8 | En tant qu'utilisateur, je veux recevoir une notification quand je suis proche de la date limite d'un défi, afin de ne pas le rater. | C |

## Epic 3 — Dashboard

| # | User story | Priorité |
|---|---|---|
| 3.1 | En tant que Léa, je veux voir un résumé du jour (défis en cours, % d'avancement global), afin d'avoir une vue rapide en ouvrant l'app. | M |
| 3.2 | En tant que Léa, je veux voir ma série de jours actifs (streak), afin de rester motivée à ne pas la casser. | M |
| 3.3 | En tant que Léa, je veux voir mon prochain objectif à atteindre, afin de savoir sur quoi me concentrer. | S |
| 3.4 | En tant qu'utilisateur, je veux voir un historique simple de mes activités récentes, afin de me souvenir de ce que j'ai fait cette semaine. | S |

## Epic 4 — Badges & Gamification

| # | User story | Priorité |
|---|---|---|
| 4.1 | En tant qu'utilisateur, je veux gagner de l'XP quand je progresse dans un défi, afin de sentir une récompense immédiate. | M |
| 4.2 | En tant qu'utilisateur, je veux débloquer des badges pour certains accomplissements (premier 5 km, 100 séances...), afin de me sentir reconnu dans ma progression. | M |
| 4.3 | En tant qu'utilisateur, je veux voir ma collection de badges débloqués et ceux restant à débloquer, afin d'avoir de nouveaux objectifs à viser. | S |
| 4.4 | En tant qu'utilisateur, je veux monter de niveau global en cumulant de l'XP, afin d'avoir un indicateur de progression à long terme. | S |
| 4.5 | En tant qu'utilisateur, je veux voir une animation/notification quand je débloque un badge, afin que ce soit un moment gratifiant. | C |

## Epic 5 — Fondations techniques (non visibles utilisateur mais nécessaires)

| # | User story | Priorité |
|---|---|---|
| 5.1 | En tant que dev, je dois modéliser les entités Défi/Activité de façon extensible, afin de pouvoir ajouter de nouveaux types de défis sans refonte. | M |
| 5.2 | En tant que dev, je dois sécuriser l'API avec JWT, afin de protéger les données utilisateur. | M |
| 5.3 | En tant que dev, je dois prévoir un champ/relation permettant de rattacher un futur "souvenir" (photo, note) à une activité, afin de préparer le module Passport (V3) sans migration lourde plus tard. | S |

---

## Ce qui n'est volontairement PAS dans le MVP

Pour rappel (cohérent avec le concept initial) :
- Import automatique Strava/Garmin → saisie manuelle uniquement en V1
- Recherche de partenaires, événements → V2
- Passport, carte, souvenirs → V3
- Statistiques annuelles "Wrapped" → V4
- Recommandations IA → V5

---

## Prochaine étape suggérée

À partir de ce tableau, on peut :
1. Créer les milestones dans l'outil de gestion de projet en regroupant les stories **M** en premier
2. Passer aux wireframes des écrans correspondant aux stories Must-have (Dashboard, Créer un défi, Détail défi, Profil)
