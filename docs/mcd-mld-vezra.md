# Vezra — Modèle de données (MCD / MLD)

## MCD — Modèle Conceptuel de Données

### Entités et attributs

**UTILISATEUR**
- id_utilisateur *(identifiant)*
- email
- mot_de_passe_hash
- pseudo
- avatar_url
- date_inscription
- niveau
- xp_total

**DEFI**
- id_defi *(identifiant)*
- titre
- type *(distance / répétition / fréquence / occurrence)*
- objectif_valeur
- unite
- date_creation
- date_limite
- statut *(en_cours / termine / abandonne)*

**ACTIVITE**
- id_activite *(identifiant)*
- valeur
- date
- note *(nullable — champ réservé pour le futur module Passport)*

**BADGE**
- id_badge *(identifiant)*
- nom
- description
- condition_type
- condition_valeur
- icone

**SPORT**
- id_sport *(identifiant)*
- nom
- categorie

### Associations et cardinalités

```
UTILISATEUR (1,1) ────< POSSEDER >──── (0,n) DEFI

DEFI (1,1) ────< ENREGISTRER >──── (0,n) ACTIVITE

UTILISATEUR (0,n) ────< DEBLOQUER >──── (0,n) BADGE
                            │
                       date_deblocage  (attribut porté par l'association)

DEFI (0,1) ────< CONCERNER >──── (0,n) SPORT
```

**Lecture des cardinalités :**
- Un utilisateur possède 0 à n défis ; un défi appartient à exactement 1 utilisateur.
- Un défi enregistre 0 à n activités (entrées de progression) ; une activité appartient à exactement 1 défi.
- Un utilisateur débloque 0 à n badges, et un badge peut être débloqué par 0 à n utilisateurs (association many-to-many, avec la date de déblocage comme attribut porté).
- Un défi concerne 0 ou 1 sport (optionnel, pour rester simple en V1) ; un sport peut être concerné par 0 à n défis.

---

## MLD — Modèle Logique de Données

Traduction relationnelle du MCD. Les clés primaires sont soulignées (`PK`), les clés étrangères indiquées (`FK`).

```
UTILISATEUR (
    id_utilisateur   PK
    email                       VARCHAR(180)   UNIQUE, NOT NULL
    mot_de_passe_hash           VARCHAR(255)   NOT NULL
    pseudo                      VARCHAR(50)    NOT NULL
    avatar_url                  VARCHAR(255)   NULLABLE
    date_inscription            DATETIME       NOT NULL
    niveau                      INTEGER        NOT NULL DEFAULT 1
    xp_total                    INTEGER        NOT NULL DEFAULT 0
)

SPORT (
    id_sport          PK
    nom                         VARCHAR(50)    NOT NULL
    categorie                   VARCHAR(50)    NULLABLE
)

DEFI (
    id_defi            PK
    id_utilisateur                 FK → UTILISATEUR.id_utilisateur, NOT NULL
    id_sport                       FK → SPORT.id_sport, NULLABLE
    titre                       VARCHAR(100)   NOT NULL
    type                         ENUM('distance','repetition','frequence','occurrence') NOT NULL
    objectif_valeur              DECIMAL(10,2)  NOT NULL
    unite                        VARCHAR(20)    NOT NULL
    date_creation                DATETIME       NOT NULL
    date_limite                  DATE           NULLABLE
    statut                        ENUM('en_cours','termine','abandonne') NOT NULL DEFAULT 'en_cours'
)

ACTIVITE (
    id_activite         PK
    id_defi                         FK → DEFI.id_defi, NOT NULL
    valeur                       DECIMAL(10,2)  NOT NULL
    date                          DATETIME       NOT NULL
    note                          TEXT           NULLABLE
)

BADGE (
    id_badge            PK
    nom                          VARCHAR(100)   NOT NULL
    description                  TEXT           NOT NULL
    condition_type                VARCHAR(50)    NOT NULL
    condition_valeur               DECIMAL(10,2)  NOT NULL
    icone                         VARCHAR(255)   NOT NULL
)

UTILISATEUR_BADGE (
    id_utilisateur       PK, FK → UTILISATEUR.id_utilisateur
    id_badge              PK, FK → BADGE.id_badge
    date_deblocage                DATETIME       NOT NULL
)
```

**Notes de traduction MCD → MLD :**
- L'association `POSSEDER` (1,1)–(0,n) devient une simple clé étrangère `id_utilisateur` dans la table `DEFI` — pas besoin de table de jointure.
- L'association `ENREGISTRER` suit la même logique : clé étrangère `id_defi` dans `ACTIVITE`.
- L'association many-to-many `DEBLOQUER` (0,n)–(0,n) devient une table de jointure `UTILISATEUR_BADGE`, avec une clé primaire composite et l'attribut porté `date_deblocage`.
- L'association `CONCERNER` (0,1)–(0,n) devient une clé étrangère nullable `id_sport` dans `DEFI`.

---

## Correspondance avec les entités Doctrine (Symfony)

| Table MLD | Entité Doctrine |
|---|---|
| UTILISATEUR | `User` |
| DEFI | `Challenge` |
| ACTIVITE | `Progress` (ou `ActivityLog`) |
| BADGE | `Badge` |
| UTILISATEUR_BADGE | `UserBadge` |
| SPORT | `Sport` |

*(Noms anglais recommandés côté code pour rester cohérent avec les conventions Symfony/API Platform, même si le MCD/MLD ci-dessus est en français pour rester lisible en phase de cadrage.)*

---

## Points de vigilance à garder en tête pour le M1

- Le champ `note` sur `ACTIVITE` est nullable et inutilisé en V1 — c'est le point d'ancrage prévu pour rattacher un souvenir (story 5.3) sans migration lourde en V3.
- Le champ `type` sur `DEFI` en ENUM fonctionne pour le MVP (4 types fixes) ; si tu ajoutes des types dynamiques plus tard, il faudra migrer vers une table `TYPE_DEFI` séparée — mais ce n'est pas nécessaire maintenant, ce serait de la sur-ingénierie prématurée.
- `id_sport` est nullable dans `DEFI` : un défi peut ne pas être rattaché à un sport précis (ex : "aller à la salle 3x/semaine" est plus une habitude qu'un sport).
