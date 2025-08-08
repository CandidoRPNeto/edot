<?php
namespace Src\Entities;

class Enrollments implements Entity
{
    protected $studentId;
    protected $classroomId;
    
    public function __construct(array $data) {
        $this->create($data);
    }

    public function create(array $data): void{
        $this->setStudentId($data["student_id"]);
        $this->setClassroomId($data["classroom_id"]);

    }

    public function toArray(): array{
        return [
            'student_id' => $this->getStudentId(),
            'classroom_id' => $this->getClassroomId()
        ];
    }

    public function getStudentId(): string{
        return $this->studentId;
    }

    public function setStudentId(string $id): void{
        if (empty(trim($id))) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }
        $this->studentId = $id;
    }
    
    public function getClassroomId(): string{
        return $this->classroomId;
    }

    public function setClassroomId(string $id): void{
        if (empty($id)) {
            throw new \InvalidArgumentException("Campo precisa estar preenchido");
        }
        $this->classroomId = $id;
    }
}