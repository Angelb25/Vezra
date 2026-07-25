# Le concept

Une application qui devient le compagnon de ta vie sportive.

Elle ne sert pas uniquement à s'entraîner, ni uniquement à garder des souvenirs. Elle regroupe tout ce qui fait la vie d'un sportif ou d'un passionné de sport.

En une phrase :
**"L'application qui centralise tous tes défis, tes performances, tes rencontres et tes souvenirs sportifs."**

---

# Version 1 (MVP)

Le but est de sortir quelque chose en **3 à 4 mois** (le calcul de progression des défis est plus complexe qu'il n'y paraît — mieux vaut prévoir large que de sous-estimer).

## 🎯 Défis

L'utilisateur crée des objectifs, à partir d'un **nombre limité de types de défis prédéfinis** au départ (plutôt qu'un système 100% générique dès le début) :

- Défi **distance** (ex : courir 5 km, parcourir 100 km dans le mois)
- Défi **répétition** (ex : faire 50 pompes, 100 séances)
- Défi **fréquence** (ex : aller à la salle 3 fois par semaine)
- Défi **occurrence simple** (ex : jouer 20 matchs de tennis, faire un trail)

Chaque type a sa propre logique de calcul de progression, mais tous partagent la même structure de données (XP, badges, niveaux, date limite), ce qui permet d'ajouter facilement de nouveaux types plus tard sans casser l'architecture.

**Validation des défis (MVP) :** saisie manuelle par l'utilisateur (je fais 5km, je coche une séance, etc.). Pas d'import automatique (Strava/Garmin) dans cette version — ce sera une évolution possible mais pas un prérequis du MVP.

Chaque défi possède :
- progression
- XP
- badges
- niveaux
- date limite

## 📊 Tableau de bord

Aujourd'hui :
- 2 défis en cours
- 15 % d'avancement
- série de 8 jours
- prochain objectif

## 🏅 Badges

Premier 5 km
Premier marathon
100 séances
100 km parcourus
10 sports essayés
etc.

---

# Version 2

L'application devient sociale.

⚠️ **Point de vigilance :** cette version est un produit à part entière (matching + disponibilités + géolocalisation + événements temps réel). À traiter comme un projet de la même ampleur que le MVP, pas comme une simple extension.

## 🤝 Trouver des partenaires

Tu veux jouer :
- tennis
- padel
- basket
- foot
- badminton

Tu renseignes :
- ton niveau
- ton âge (optionnel)
- ta ville
- tes disponibilités

Tu trouves quelqu'un.

## 📅 Événements

Création d'événements.

Exemple :
Foot ce soir
5 contre 5
20h
Il manque 2 joueurs.

---

# Version 3

La partie "Passport".

Tu construis ton histoire sportive.

## Événements vécus

J'ai assisté :
✅ Lyon - Marseille
✅ Roland-Garros
✅ Tour de France
✅ Coupe Davis
✅ NBA Paris Games

Tu peux ajouter :
- photos
- billet
- note
- souvenirs

## Carte

Une carte affiche :
📍 tous les lieux visités
- stades
- salles
- circuits
- piscines
- courts

Tu peux filtrer par sport.

---

# Version 4

Les statistiques.

Exemple :
En 2027 :
Tu as :
🏃 812 km
⚽ 87 matchs joués
🎾 54 matchs de tennis
🏟️ 18 événements
🥇 32 badges
🔥 série maximale : 54 jours

C'est ton **"Wrapped Sport"**.

---

# Version 5

L'IA.

Elle analyse tes habitudes.

Exemple :
Tu joues surtout au tennis le mercredi.
ou
Tu n'as plus couru depuis 10 jours.
ou
Il reste seulement 12 km pour atteindre ton défi mensuel.

Elle peut aussi proposer :
Trois joueurs de ton niveau cherchent un partenaire ce week-end.

---

# Ce que j'aime dans cette idée

Elle est modulaire. Tu n'es pas obligé de tout développer dès le départ.

Tu peux commencer petit et ajouter des fonctionnalités sans avoir à refaire l'architecture.

Tu peux également choisir les modules que tu actives.

Par exemple :

```
Accueil
🎯 Défis
📅 Activités
🤝 Joueurs
🏟️ Événements
🗺️ Carte
🏅 Collection
👤 Profil
⚙️ Paramètres
```

Chaque menu peut être développé indépendamment.

⚠️ **Point de vigilance :** pour que cette modularité tienne dans le temps, le modèle de données des défis et des activités doit être pensé dès le MVP en gardant en tête les besoins des versions futures (notamment le "Legacy", voir plus bas), même si ces fonctionnalités ne sont pas encore affichées.

---

# Techniquement, c'est un excellent projet

Tu vas toucher à presque tout ce qu'un recruteur aime voir :

- ✅ Symfony (API REST ou API Platform)
- ✅ React + TypeScript
- ✅ Authentification JWT
- ✅ PostgreSQL
- ✅ Upload de photos
- ✅ Géolocalisation
- ✅ Carte interactive (Leaflet ou Mapbox)
- ✅ Notifications
- ✅ Temps réel pour les événements
- ✅ Recherche multicritères
- ✅ Gamification (XP, badges, niveaux)
- ✅ Statistiques et graphiques
- ✅ IA pour les recommandations

---

# Une idée qui peut faire la différence

J'ajouterais un système de **"Legacy"**.

Après plusieurs années, l'application raconte ton histoire sportive :

Depuis ton inscription :
- 1 248 km parcourus
- 327 activités
- 9 sports pratiqués
- 14 stades visités
- 3 pays où tu as fait du sport
- 78 personnes rencontrées
- 152 défis réussis

**"Voici cinq ans de ta vie sportive."**
