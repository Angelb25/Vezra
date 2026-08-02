<?php

namespace App\Controller;

use App\Entity\Challenge;
use App\Entity\Sport;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ChallengeController extends AbstractController
{
    private const TYPES_VALIDES = ['distance', 'repetition', 'frequence', 'occurrence'];

    #[Route('/api/challenges', name: 'challenge_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        // Validation basique des champs requis
        if (empty($data['titre']) || empty($data['type']) || empty($data['objectifValeur']) || empty($data['unite'])) {
            return new JsonResponse(['error' => 'titre, type, objectifValeur et unite sont requis'], 400);
        }

        if (!in_array($data['type'], self::TYPES_VALIDES, true)) {
            return new JsonResponse(['error' => 'type invalide. Valeurs autorisées : ' . implode(', ', self::TYPES_VALIDES)], 400);
        }

        $challenge = new Challenge();
        $challenge->setTitre($data['titre']);
        $challenge->setType($data['type']);
        $challenge->setObjectifValeur((string) $data['objectifValeur']);
        $challenge->setUnite($data['unite']);
        $challenge->setDateCreation(new \DateTimeImmutable());
        $challenge->setStatut('en_cours');
        $challenge->setOwner($user);

        if (!empty($data['dateLimite'])) {
            $challenge->setDateLimite(new \DateTimeImmutable($data['dateLimite']));
        }

        if (!empty($data['sportId'])) {
            $sport = $entityManager->getRepository(Sport::class)->find($data['sportId']);
            if ($sport) {
                $challenge->setSport($sport);
            }
        }

        $entityManager->persist($challenge);
        $entityManager->flush();

        return new JsonResponse([
            'id' => $challenge->getId(),
            'titre' => $challenge->getTitre(),
            'type' => $challenge->getType(),
            'objectifValeur' => $challenge->getObjectifValeur(),
            'unite' => $challenge->getUnite(),
            'statut' => $challenge->getStatut(),
            'dateLimite' => $challenge->getDateLimite()?->format('Y-m-d'),
        ], 201);
    }
    #[Route('/api/challenges', name: 'challenge_list', methods: ['GET'])]
    public function list(EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $challenges = $entityManager->getRepository(Challenge::class)
            ->findBy(['owner' => $user], ['dateCreation' => 'DESC']);

        $data = array_map(fn(Challenge $c) => [
            'id' => $c->getId(),
            'titre' => $c->getTitre(),
            'type' => $c->getType(),
            'objectifValeur' => $c->getObjectifValeur(),
            'unite' => $c->getUnite(),
            'statut' => $c->getStatut(),
            'dateCreation' => $c->getDateCreation()->format('Y-m-d'),
            'dateLimite' => $c->getDateLimite()?->format('Y-m-d'),
            'sport' => $c->getSport()?->getNom(),
        ], $challenges);

        return new JsonResponse($data);
    }

    #[Route('/api/challenges/{id}', name: 'challenge_detail', methods: ['GET'])]
    public function detail(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $challenge = $entityManager->getRepository(Challenge::class)->find($id);

        if (!$challenge) {
            return new JsonResponse(['error' => 'Défi introuvable'], 404);
        }

        // Sécurité : un utilisateur ne peut voir que ses propres défis
        if ($challenge->getOwner() !== $user) {
            return new JsonResponse(['error' => 'Accès refusé'], 403);
        }

        return new JsonResponse([
            'id' => $challenge->getId(),
            'titre' => $challenge->getTitre(),
            'type' => $challenge->getType(),
            'objectifValeur' => $challenge->getObjectifValeur(),
            'unite' => $challenge->getUnite(),
            'statut' => $challenge->getStatut(),
            'dateCreation' => $challenge->getDateCreation()->format('Y-m-d'),
            'dateLimite' => $challenge->getDateLimite()?->format('Y-m-d'),
            'sport' => $challenge->getSport()?->getNom(),
        ]);
    }
}