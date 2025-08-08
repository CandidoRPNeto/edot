<?php
namespace Src\Entities;

class Classroom implements Entity
{
    protected $name;
    protected $description;
    
    public function __construct(array $data) {
        $this->create($data);
    }

    public function create(array $data): void{
        $this->setName($data["name"]);
        $this->setDescription($data["description"]);

    }

    public function toArray(): array{
        return [
            'name' => $this->getName(),
            'description' => $this->getDescription()
        ];
    }

    public function getDescription(): string{
        return $this->description;
    }

    public function setDescription(string $description): void{
        if (empty(trim($description))) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }
        $this->description = $description;
    }
    
    public function getName(): string{
        return $this->name;
    }

    public function setName(string $name): void{
        $name = trim($name);
        if (empty($name)) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }
        if (mb_strlen($name) < 3) {
            throw new \InvalidArgumentException("Nome muito curto");
        }
        $this->name = $name;
    }
}