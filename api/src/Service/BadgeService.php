<?php

namespace App\Service;

use App\Entity\Badge;
use App\Entity\Challenge;
use App\Entity\Progress;
use App\Entity\User;
use App\Entity\UserBadge;
use Doctrine\ORM\EntityManagerInterface;

class BadgeService
{
    /**
     * Vérifie toutes les conditions de badges non encore débloqués par l'utilisateur,
     * et débloque ceux qui sont désormais atteints. Retourne la liste des badges
     * nouvellement débloqués (utile pour afficher une notif côté front).
     */
    public function checkAndUnlockBadges(User $user, EntityManagerInterface $em): array
    {
        $newlyUnlocked = [];

        $allBadges = $em->getRepository(Badge::class)->findAll();

        $unlockedBadgeIds = array_map(
            fn(UserBadge $ub) => $ub->getBadge()->getId(),
            $em->getRepository(UserBadge::class)->findBy(['owner' => $user])
        );

        $stats = $this->computeStats($user, $em);

        foreach ($allBadges as $badge) {
            if (in_array($badge->getId(), $unlockedBadgeIds, true)) {
                continue; // déjà débloqué, on ne revérifie pas
            }

            $valeurActuelle = $stats[$badge->getConditionType()] ?? 0;
            $seuil = (float) $badge->getConditionValeur();

            if ($valeurActuelle >= $seuil) {
                $userBadge = new UserBadge();
                $userBadge->setOwner($user);
                $userBadge->setBadge($badge);
                $userBadge->setDateDeblocage(new \DateTimeImmutable());
                $em->persist($userBadge);

                // Bonus XP pour le déblocage (règle définie dans gamification-config-vezra.md)
                $user->setXpTotal($user->getXpTotal() + 100);
                $user->setNiveau((int) floor($user->getXpTotal() / 200) + 1);

                $newlyUnlocked[] = $badge;
            }
        }

        return $newlyUnlocked;
    }

    /**
     * Calcule les statistiques nécessaires pour vérifier chaque conditionType.
     * ⚠️ streak_max n'est pas encore implémenté (logique de streak absente) — reste à 0 pour l'instant.
     */
    private function computeStats(User $user, EntityManagerInterface $em): array
    {
        $challenges = $em->getRepository(Challenge::class)->findBy(['owner' => $user]);

        $nombreDefisTermines = count(array_filter(
            $challenges,
            fn(Challenge $c) => $c->getStatut() === 'termine'
        ));

        $distanceTotale = 0;
        $nombreActivites = 0;

        foreach ($challenges as $challenge) {
            $entries = $em->getRepository(Progress::class)->findBy(['challenge' => $challenge]);
            $nombreActivites += count($entries);

            if ($challenge->getType() === 'distance') {
                foreach ($entries as $entry) {
                    $distanceTotale += (float) $entry->getValeur();
                }
            }
        }

        return [
            'nombre_defis_crees' => count($challenges),
            'nombre_defis_termines' => $nombreDefisTermines,
            'distance_totale' => $distanceTotale,
            'nombre_activites' => $nombreActivites,
            'streak_max' => 0, // TODO: à brancher une fois la logique de streak codée
            'niveau' => $user->getNiveau(),
        ];
    }
}