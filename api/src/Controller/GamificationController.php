<?php

namespace App\Controller;

use App\Entity\Badge;
use App\Entity\User;
use App\Entity\UserBadge;
use App\Service\GamificationService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class GamificationController extends AbstractController
{
    #[Route('/api/me/stats', name: 'api_me_stats', methods: ['GET'])]
    public function stats(
        GamificationService $gamificationService,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $stats = $gamificationService->calculateStats($user);

        return new JsonResponse([
            'nombreDefisCree' => $stats['nombre_defis_crees'],
            'nombreDefisTermines' => $stats['nombre_defis_termines'],
            'distanceTotale' => $stats['distance_totale'],
            'nombreActivites' => $stats['nombre_activites'],
            'streakActuel' => $stats['streak_actuel'],
            'streakMax' => $stats['streak_max'],
            'niveau' => $stats['niveau'],
            'xpTotal' => $stats['xpTotal'],
        ]);
    }

    #[Route('/api/me/badges', name: 'api_me_badges', methods: ['GET'])]
    public function myBadges(
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $allBadges = $entityManager->getRepository(Badge::class)->findAll();
        $userBadges = $entityManager->getRepository(UserBadge::class)->findBy(['owner' => $user]);
        $unlockedIds = array_map(fn (UserBadge $ub) => $ub->getBadge()?->getId(), $userBadges);

        $badges = array_map(function (Badge $badge) use ($unlockedIds) {
            return [
                'id' => $badge->getId(),
                'nom' => $badge->getNom(),
                'description' => $badge->getDescription(),
                'conditionType' => $badge->getConditionType(),
                'conditionValeur' => $badge->getConditionValeur(),
                'icone' => $badge->getIcone(),
                'debloque' => in_array($badge->getId(), $unlockedIds, true),
            ];
        }, $allBadges);

        return new JsonResponse([
            'total' => count($badges),
            'debloques' => count(array_filter($badges, fn (array $badge) => $badge['debloque'])),
            'badges' => $badges,
        ]);
    }

    #[Route('/api/badges', name: 'api_badges_catalog', methods: ['GET'])]
    public function catalog(
        EntityManagerInterface $entityManager,
        GamificationService $gamificationService
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $badges = $entityManager->getRepository(Badge::class)->findAll();
        $stats = $gamificationService->calculateStats($user);
        $userBadges = $entityManager->getRepository(UserBadge::class)->findBy(['owner' => $user]);
        $unlockedIds = array_map(fn (UserBadge $ub) => $ub->getBadge()?->getId(), $userBadges);

        $payload = []; 
        foreach ($badges as $badge) {
            $payload[] = [
                'id' => $badge->getId(),
                'nom' => $badge->getNom(),
                'description' => $badge->getDescription(),
                'conditionType' => $badge->getConditionType(),
                'conditionValeur' => $badge->getConditionValeur(),
                'icone' => $badge->getIcone(),
                'debloque' => in_array($badge->getId(), $unlockedIds, true),
            ];
        }

        return new JsonResponse($payload);
    }
}
