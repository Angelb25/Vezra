<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
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