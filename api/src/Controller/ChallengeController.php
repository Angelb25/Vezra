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
use App\Entity\Progress;

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
    #[Route('/api/challenges/{id}/progress', name: 'challenge_add_progress', methods: ['POST'])]
    public function addProgress(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        $challenge = $entityManager->getRepository(Challenge::class)->find($id);

        if (!$challenge) {
            return new JsonResponse(['error' => 'Défi introuvable'], 404);
        }

        if ($challenge->getOwner() !== $user) {
            return new JsonResponse(['error' => 'Accès refusé'], 403);
        }

        if ($challenge->getStatut() !== 'en_cours') {
            return new JsonResponse(['error' => 'Ce défi n\'est plus en cours'], 400);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['valeur']) || !is_numeric($data['valeur'])) {
            return new JsonResponse(['error' => 'valeur est requise et doit être numérique'], 400);
        }

        // Crée l'entrée de progression
        $progress = new Progress();
        $progress->setValeur((string) $data['valeur']);
        $progress->setDate(new \DateTimeImmutable());
        $progress->setChallenge($challenge);
        if (!empty($data['note'])) {
            $progress->setNote($data['note']);
        }
        
        $entityManager->persist($progress);
        $entityManager->flush(); // on écrit d'abord en base pour que le calcul suivant voie cette nouvelle entrée

        // Recalcule la progression totale du défi selon son type
        $progressionActuelle = $this->calculerProgression($challenge, $entityManager);
        $objectif = (float) $challenge->getObjectifValeur();

        // Si l'objectif est atteint, on marque le défi comme terminé
        if ($progressionActuelle >= $objectif) {
            $challenge->setStatut('termine');
        }

        $entityManager->flush();

        return new JsonResponse([
            'id' => $progress->getId(),
            'valeur' => $progress->getValeur(),
            'date' => $progress->getDate()->format('Y-m-d H:i:s'),
            'progressionActuelle' => $progressionActuelle,
            'objectif' => $objectif,
            'pourcentage' => min(100, round(($progressionActuelle / $objectif) * 100)),
            'statutDefi' => $challenge->getStatut(),
        ], 201);
    }

    /**
     * Calcule la progression cumulée d'un défi selon son type.
     * - distance / repetition : somme des valeurs de toutes les entrées Progress
     * - occurrence : nombre d'entrées Progress (chaque entrée = 1, peu importe sa valeur)
     * - frequence : nombre d'entrées Progress, cumulé sur toute la durée du défi
     */
    private function calculerProgression(Challenge $challenge, EntityManagerInterface $entityManager): float
    {
        $entries = $entityManager->getRepository(Progress::class)
            ->findBy(['challenge' => $challenge]);

        if (in_array($challenge->getType(), ['distance', 'repetition'], true)) {
            return array_sum(array_map(fn(Progress $p) => (float) $p->getValeur(), $entries));
        }

        // occurrence et frequence : on compte simplement le nombre d'entrées
        return count($entries);
    }
}