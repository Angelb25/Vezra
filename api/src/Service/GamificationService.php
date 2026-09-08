<?php

namespace App\Service;

use App\Entity\Badge;
use App\Entity\Challenge;
use App\Entity\Progress;
use App\Entity\User;
use App\Entity\UserBadge;
use Doctrine\ORM\EntityManagerInterface;

class GamificationService
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    public function refreshUserStats(User $user): array
    {
        $stats = $this->calculateStats($user);

        $user->setNiveau((int) max(1, floor($stats['xpTotal'] / 200) + 1));
        $this->entityManager->flush();

        $this->awardBadgesForUser($user, $stats);

        return $stats;
    }

    public function calculateStats(User $user): array
    {
        $challenges = $this->entityManager->getRepository(Challenge::class)->findBy(['owner' => $user]);

        $nombreDefisTermines = 0;
        $distanceTotale = 0.0;
        $nombreActivites = 0;
        $datesActives = [];

        foreach ($challenges as $challenge) {
            if ($challenge->getStatut() === 'termine') {
                ++$nombreDefisTermines;
            }

            $progressEntries = $this->entityManager->getRepository(Progress::class)->findBy([
                'challenge' => $challenge,
            ]);

            foreach ($progressEntries as $progress) {
                ++$nombreActivites;

                $dateKey = $progress->getDate()->format('Y-m-d');
                $datesActives[$dateKey] = true;

                if (in_array($challenge->getType(), ['distance', 'repetition'], true)) {
                    $distanceTotale += (float) $progress->getValeur();
                }
            }
        }

        $xpTotal = (int) ($user->getXpTotal() ?? 0);
        $niveau = (int) max(1, floor($xpTotal / 200) + 1);

        return [
            'nombre_defis_crees' => count($challenges),
            'nombre_defis_termines' => $nombreDefisTermines,
            'distance_totale' => round($distanceTotale, 2),
            'nombre_activites' => $nombreActivites,
            'streak_actuel' => $this->calculateCurrentStreak($datesActives),
            'streak_max' => $this->calculateMaxStreak($datesActives),
            'niveau' => $niveau,
            'xpTotal' => $xpTotal,
        ];
    }

    public function awardBadgesForUser(User $user, ?array $stats = null): array
    {
        $stats ??= $this->calculateStats($user);

        $badges = $this->entityManager->getRepository(Badge::class)->findAll();
        $awarded = [];

        foreach ($badges as $badge) {
            if (!$this->isBadgeUnlocked($badge, $stats, $user)) {
                continue;
            }

            if ($this->hasUserBadge($user, $badge)) {
                continue;
            }

            $userBadge = new UserBadge();
            $userBadge->setOwner($user);
            $userBadge->setBadge($badge);
            $userBadge->setDateDeblocage(new \DateTimeImmutable());

            $this->entityManager->persist($userBadge);
            $awarded[] = [
                'id' => $badge->getId(),
                'nom' => $badge->getNom(),
            ];
        }

        if ($awarded !== []) {
            $this->entityManager->flush();
        }

        return $awarded;
    }

    private function isBadgeUnlocked(Badge $badge, array $stats, User $user): bool
    {
        $conditionType = $badge->getConditionType();
        $conditionValeur = (float) $badge->getConditionValeur();

        return match ($conditionType) {
            'nombre_defis_crees' => (int) $stats['nombre_defis_crees'] >= $conditionValeur,
            'nombre_defis_termines' => (int) $stats['nombre_defis_termines'] >= $conditionValeur,
            'distance_totale' => (float) $stats['distance_totale'] >= $conditionValeur,
            'nombre_activites' => (int) $stats['nombre_activites'] >= $conditionValeur,
            'streak_max' => (int) $stats['streak_max'] >= $conditionValeur,
            'niveau' => (int) $user->getNiveau() >= $conditionValeur,
            default => false,
        };
    }

    private function hasUserBadge(User $user, Badge $badge): bool
    {
        $existing = $this->entityManager->getRepository(UserBadge::class)->findOneBy([
            'owner' => $user,
            'badge' => $badge,
        ]);

        return $existing !== null;
    }

    private function calculateCurrentStreak(array $datesActives): int
    {
        if ($datesActives === []) {
            return 0;
        }

        $dates = array_keys($datesActives);
        sort($dates);

        $latestDate = new \DateTimeImmutable($dates[array_key_last($dates)]);
        $streak = 0;
        $cursor = $latestDate;

        while (true) {
            $key = $cursor->format('Y-m-d');
            if (!isset($datesActives[$key])) {
                break;
            }

            ++$streak;
            $cursor = $cursor->modify('-1 day');
        }

        return $streak;
    }

    private function calculateMaxStreak(array $datesActives): int
    {
        if ($datesActives === []) {
            return 0;
        }

        $dates = array_keys($datesActives);
        sort($dates);

        $maxStreak = 0;
        $currentStreak = 0;
        $previousDate = null;

        foreach ($dates as $dateString) {
            $date = new \DateTimeImmutable($dateString);

            if ($previousDate === null) {
                $currentStreak = 1;
                $previousDate = $date;
                $maxStreak = max($maxStreak, $currentStreak);
                continue;
            }

            $diffInDays = $previousDate->diff($date)->days;
            if ($diffInDays === 1) {
                ++$currentStreak;
            } else {
                $currentStreak = 1;
            }

            $previousDate = $date;
            $maxStreak = max($maxStreak, $currentStreak);
        }

        return $maxStreak;
    }
}
