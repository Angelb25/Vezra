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
}