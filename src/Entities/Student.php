<?php
namespace Src\Entities;

class Student implements Entity
{
    protected $birthDate;
    protected $cpf;
    protected $userId;
    
    public function __construct(array $data)
    {
        $this->create($data);
    }

    public function create(array $data): void{
        $this->setCpf($data["cpf"]);
        $this->setUserId($data["user_id"]);
        $this->setBirthDate($data["birth_date"]);
    }

    public function toArray(): array{
        return [
            "cpf" => $this->getCpf(),
            "user_id" => $this->getUserId(),
            "birth_date" => $this->getBirthDate()
        ];
    }

    public function setCpf(string $cpf): void{
        $cpf = trim($cpf);
        if (empty($cpf)) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }
        $this->cpf = $cpf;
    }

    public function getCpf(): string{
        return $this->cpf;
    }

    public function setUserId(int $userId): void{
        if (empty($userId)) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }
        $this->userId = $userId;
    }

    public function getUserId(): int{
        return $this->userId;
    }

    public function setBirthDate(string $birthDate): void{
        $birthDate = trim($birthDate);
        if (empty($birthDate)) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }
        $this->birthDate = $birthDate;
    }

    public function getBirthDate(): string{
        return $this->birthDate;
    }
}