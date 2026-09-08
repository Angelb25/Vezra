<?php

namespace App\Tests;

use App\Entity\User;
use App\Entity\Challenge;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ChallengeControllerTest extends WebTestCase
{
    public function testCreateChallengeWithAuthenticatedUser(): void
    {
        $client = static::createClient();

        $entityManager = static::getContainer()->get(EntityManagerInterface::class);
        $passwordHasher = static::getContainer()->get(UserPasswordHasherInterface::class);

        $user = new User();
        $user->setEmail('test@example.com');
        $user->setPseudo('TestUser');
        $user->setPassword($passwordHasher->hashPassword($user, 'secret123'));
        $user->setDateInscription(new \DateTimeImmutable());
        $user->setNiveau(1);
        $user->setXpTotal(0);

        $entityManager->persist($user);
        $entityManager->flush();

        $client->loginUser($user);

        $client->request('POST', '/api/challenges', [], [], [], json_encode([
            'titre' => 'Défi test',
            'type' => 'distance',
            'objectifValeur' => 5,
            'unite' => 'km',
            'dateLimite' => '2026-08-15',
            'sportId' => 1,
        ]));

        $this->assertResponseStatusCodeSame(201);

        $content = json_decode($client->getResponse()->getContent(), true);
        $this->assertSame('Défi test', $content['titre']);
        $this->assertSame('distance', $content['type']);
    }

    public function testGamificationRewardsBadgeForCompletedChallenge(): void
    {
        $entityManager = static::getContainer()->get(EntityManagerInterface::class);
        $passwordHasher = static::getContainer()->get(UserPasswordHasherInterface::class);

        $user = new User();
        $user->setEmail('badge-test@example.com');
        $user->setPseudo('BadgeUser');
        $user->setPassword($passwordHasher->hashPassword($user, 'secret123'));
        $user->setDateInscription(new \DateTimeImmutable());
        $user->setNiveau(1);
        $user->setXpTotal(0);

        $entityManager->persist($user);
        $entityManager->flush();

        $challenge = new \App\Entity\Challenge();
        $challenge->setTitre('Premier défi terminé');
        $challenge->setType('distance');
        $challenge->setObjectifValeur('1.00');
        $challenge->setUnite('km');
        $challenge->setDateCreation(new \DateTimeImmutable());
        $challenge->setStatut('en_cours');
        $challenge->setOwner($user);
        $entityManager->persist($challenge);
        $entityManager->flush();

        $progress = new \App\Entity\Progress();
        $progress->setValeur('1.00');
        $progress->setDate(new \DateTimeImmutable());
        $progress->setChallenge($challenge);
        $entityManager->persist($progress);
        $entityManager->flush();

        $challenge->setStatut('termine');
        $user->setXpTotal(180);
        $entityManager->flush();

        $service = static::getContainer()->get(\App\Service\GamificationService::class);
        $service->refreshUserStats($user);

        $badge = $entityManager->getRepository(\App\Entity\Badge::class)->findOneBy(['nom' => 'Premier défi terminé']);
        $this->assertNotNull($badge);

        $userBadge = $entityManager->getRepository(\App\Entity\UserBadge::class)->findOneBy([
            'owner' => $user,
            'badge' => $badge,
        ]);

        $this->assertNotNull($userBadge);
    }
}