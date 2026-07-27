<?php

namespace App\Entity;

use App\Repository\UserBadgeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserBadgeRepository::class)]
#[ORM\Table(name: 'user_badge')]
#[ORM\UniqueConstraint(name: 'uniq_user_badge', columns: ['owner_id', 'badge_id'])]
class UserBadge{
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $dateDeblocage = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Badge $badge = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateDeblocage(): ?\DateTimeImmutable
    {
        return $this->dateDeblocage;
    }

    public function setDateDeblocage(\DateTimeImmutable $dateDeblocage): static
    {
        $this->dateDeblocage = $dateDeblocage;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getBadge(): ?Badge
    {
        return $this->badge;
    }

    public function setBadge(?Badge $badge): static
    {
        $this->badge = $badge;

        return $this;
    }
}
