<?php
namespace Src\Controllers;

use Src\Entities\Classroom;
use Src\Repository\ClassroomRepository;

class ClassroomController
{
    protected ClassroomRepository $repository;
    public function __construct()
    {
        $this->repository = new ClassroomRepository();
    }

    public function create($data)
    {
        $class = new Classroom($data);
        return $this->repository->create($class);
    }

    public function update($id, $data)
    {
        $class = new Classroom($data);
        return $this->repository->update($id, $class);
    }

    public function search($page, $search)
    {
        return $this->repository->listAll($page, ['name' => $search]);
    }

    public function getOptionList($search)
    {
        return $this->repository->listOptions($search);
    }

    public function show($id)
    {
        return $this->repository->read($id);
    }

    public function index($page)
    {
        return $this->repository->listAll($page);
    }

    public function delete($id)
    {
        return $this->repository->delete($id);
    }
}