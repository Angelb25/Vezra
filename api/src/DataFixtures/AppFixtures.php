<?php

namespace App\DataFixtures;

use App\Entity\Badge;
use App\Entity\Challenge;
use App\Entity\Sport;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        // --- Sports ---
        $sportsData = [
            ['nom' => 'Course à pied', 'categorie' => 'cardio'],
            ['nom' => 'Tennis', 'categorie' => 'raquette'],
            ['nom' => 'Football', 'categorie' => 'collectif'],
            ['nom' => 'Musculation', 'categorie' => 'force'],
            ['nom' => 'Natation', 'categorie' => 'cardio'],
        ];

        $sports = [];
        foreach ($sportsData as $data) {
            $sport = new Sport();
            $sport->setNom($data['nom']);
            $sport->setCategorie($data['categorie']);
            $manager->persist($sport);
            $sports[] = $sport;
        }

        // --- Badges (les 15 définis dans gamification-config-vezra.md) ---
        $badgesData = [
            ['nom' => 'Premier défi créé', 'description' => 'Tu as créé ton premier défi.', 'conditionType' => 'nombre_defis_crees', 'conditionValeur' => 1, 'icone' => 'ti-flag'],
            ['nom' => 'Premier défi terminé', 'description' => 'Tu as terminé ton premier défi.', 'conditionType' => 'nombre_defis_termines', 'conditionValeur' => 1, 'icone' => 'ti-trophy'],
            ['nom' => '5 défis terminés', 'description' => 'Tu as terminé 5 défis.', 'conditionType' => 'nombre_defis_termines', 'conditionValeur' => 5, 'icone' => 'ti-trophy'],
            ['nom' => 'Premier 5 km', 'description' => 'Tu as couru 5 km cumulés.', 'conditionType' => 'distance_totale', 'conditionValeur' => 5, 'icone' => 'ti-run'],
            ['nom' => '10 km cumulés', 'description' => 'Tu as parcouru 10 km cumulés.', 'conditionType' => 'distance_totale', 'conditionValeur' => 10, 'icone' => 'ti-run'],
            ['nom' => '50 km cumulés', 'description' => 'Tu as parcouru 50 km cumulés.', 'conditionType' => 'distance_totale', 'conditionValeur' => 50, 'icone' => 'ti-run'],
            ['nom' => '100 km cumulés', 'description' => 'Tu as parcouru 100 km cumulés.', 'conditionType' => 'distance_totale', 'conditionValeur' => 100, 'icone' => 'ti-run'],
            ['nom' => '10 séances', 'description' => 'Tu as enregistré 10 séances.', 'conditionType' => 'nombre_activites', 'conditionValeur' => 10, 'icone' => 'ti-repeat'],
            ['nom' => '50 séances', 'description' => 'Tu as enregistré 50 séances.', 'conditionType' => 'nombre_activites', 'conditionValeur' => 50, 'icone' => 'ti-repeat'],
            ['nom' => '100 séances', 'description' => 'Tu as enregistré 100 séances.', 'conditionType' => 'nombre_activites', 'conditionValeur' => 100, 'icone' => 'ti-repeat'],
            ['nom' => 'Série de 7 jours', 'description' => 'Tu as tenu 7 jours d\'affilée.', 'conditionType' => 'streak_max', 'conditionValeur' => 7, 'icone' => 'ti-flame'],
            ['nom' => 'Série de 14 jours', 'description' => 'Tu as tenu 14 jours d\'affilée.', 'conditionType' => 'streak_max', 'conditionValeur' => 14, 'icone' => 'ti-flame'],
            ['nom' => 'Série de 30 jours', 'description' => 'Tu as tenu 30 jours d\'affilée.', 'conditionType' => 'streak_max', 'conditionValeur' => 30, 'icone' => 'ti-flame'],
            ['nom' => 'Niveau 5 atteint', 'description' => 'Tu as atteint le niveau 5.', 'conditionType' => 'niveau', 'conditionValeur' => 5, 'icone' => 'ti-star'],
            ['nom' => 'Niveau 10 atteint', 'description' => 'Tu as atteint le niveau 10.', 'conditionType' => 'niveau', 'conditionValeur' => 10, 'icone' => 'ti-star'],
        ];

        foreach ($badgesData as $data) {
            $badge = new Badge();
            $badge->setNom($data['nom']);
            $badge->setDescription($data['description']);
            $badge->setConditionType($data['conditionType']);
            $badge->setConditionValeur((string) $data['conditionValeur']);
            $badge->setIcone($data['icone']);
            $manager->persist($badge);
        }

        // --- Utilisateur de test ---
        $user = new User();
        $user->setEmail('lea.demo@test.com');
        $user->setPseudo('LeaDemo');
        $user->setPassword($this->passwordHasher->hashPassword($user, 'motdepasse123'));
        $user->setDateInscription(new \DateTimeImmutable());
        $user->setNiveau(1);
        $user->setXpTotal(0);
        $manager->persist($user);

        // --- Un défi de test pour cet utilisateur ---
        $challenge = new Challenge();
        $challenge->setTitre('Courir 5 km');
        $challenge->setType('distance');
        $challenge->setObjectifValeur('5.00');
        $challenge->setUnite('km');
        $challenge->setDateCreation(new \DateTimeImmutable());
        $challenge->setDateLimite(new \DateTimeImmutable('+30 days'));
        $challenge->setStatut('en_cours');
        $challenge->setOwner($user);
        $challenge->setSport($sports[0]); // Course à pied
        $manager->persist($challenge);

        $manager->flush();
    }
}