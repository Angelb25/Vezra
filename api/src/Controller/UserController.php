<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Badge;
use App\Entity\UserBadge;
use Doctrine\ORM\EntityManagerInterface;

class UserController extends AbstractController
{
    #[Route('/api/badges', name: 'badges_list', methods: ['GET'])]
    public function badges(EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $allBadges = $entityManager->getRepository(Badge::class)->findAll();

        $userBadges = $entityManager->getRepository(UserBadge::class)->findBy(['owner' => $user]);

        // On construit un tableau [badgeId => dateDeblocage] pour un accès rapide
        $unlockedMap = [];
        foreach ($userBadges as $ub) {
            $unlockedMap[$ub->getBadge()->getId()] = $ub->getDateDeblocage()->format('Y-m-d');
        }

        $data = array_map(function (Badge $badge) use ($unlockedMap) {
            $isUnlocked = isset($unlockedMap[$badge->getId()]);
            return [
                'id' => $badge->getId(),
                'nom' => $badge->getNom(),
                'description' => $badge->getDescription(),
                'icone' => $badge->getIcone(),
                'debloque' => $isUnlocked,
                'dateDeblocage' => $unlockedMap[$badge->getId()] ?? null,
            ];
        }, $allBadges);

        return new JsonResponse($data);
    }

    #[Route('/api/me', name: 'user_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
            'avatarUrl' => $user->getAvatarUrl(),
            'niveau' => $user->getNiveau(),
            'xpTotal' => $user->getXpTotal(),
            'dateInscription' => $user->getDateInscription()->format('Y-m-d'),
        ]);
    }
}