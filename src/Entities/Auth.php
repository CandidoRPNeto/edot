<?php
namespace Src\Entities;

class Auth implements Entity
{
    protected $email;

    protected $password;

    public function __construct(array $data) {
        $this->create($data);
    }

    public function create(array $data): void{
        $this->setEmail($data["email"]);
        $this->setPassword($data["password"]);
    }

    public function toArray(): array{
        return [];
    }

    public function setEmail($email){
        if (empty(trim($email))) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }
        $this->email = $email;
    }

    public function getEmail():string{
        return $this->email;
    }

    public function setPassword($password){
        if (empty(trim($password))) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }
        $this->password = $password;
    }

    public function getPassword():string{
        return $this->password;
    }
    
}