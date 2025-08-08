<?php
namespace Src\Entities;

class User implements Entity
{
    protected $name;
    protected $email;
    protected $password;
    protected $role;

    public function __construct(array $data)
    {
        $this->create($data);
    }

    public function create(array $data): void
    {
        $this->setName($data["name"]);
        $this->setEmail($data["email"]);
        $this->setPassword($data["password"]);
        $role = $data["role"] ?? 'STD';
        $this->setRole($role);
    }

    public function toArray($hidden = false): array
    {
        $user = [
            "name" => $this->getName(),
            "email" => $this->getEmail(),
            "password" => $this->getPassword(),
            "role" => $this->getRole()
        ];
        if ($hidden) {
            unset($user['password']);
        }
        return $user;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $name = trim($name);
        if (empty($name)) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }
        if (mb_strlen($name) < 3) {
            throw new \InvalidArgumentException("Nome muito curto");
        }
        $this->name = $name;
    }
    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $email = trim($email);

        if (empty($email)) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }

        if (!preg_match('/^[\w\.\-]+@([\w\-]+\.)+[a-zA-Z]{2,}$/', $email)) {
            throw new \InvalidArgumentException("E-mail inválido");
        }

        $this->email = $email;
    }

    private function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): void
    {
        $password = trim($password);
        if (empty($password)) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }

        if (!preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/', $password)) {
            throw new \InvalidArgumentException("A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.");
        }
        $password = password_hash($password, PASSWORD_DEFAULT);
        $this->password = $password;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function setRole(string $role): void
    {
        $role = trim($role);
        if (empty($role)) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }
        if ($role !== 'STD' && $role !== 'ADM') {
            throw new \InvalidArgumentException("Role invalida");
        }
        $this->role = $role;
    }
}