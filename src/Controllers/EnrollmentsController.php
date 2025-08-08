<?php
namespace Src\Controllers;

use Src\Entities\Enrollments;
use Src\Repository\EnrollmentsRepository;

class EnrollmentsController
{
    
    public function __construct(protected EnrollmentsRepository $repository)
    {
    }

    public function create($data)
    {
        $enrollment = new Enrollments($data);
        return $this->repository->create($enrollment);
    }

    public function update($id, $data)
    {
        $enrollment = new Enrollments($data);
        return $this->repository->update($id, $enrollment);
    }

    public function search($page, $search, $filter = 1)
    {
        if ($filter == 1) {
            $search = ['username' => $search];
        } else if ($filter == 2) {
            $search = ['classname' => $search];
        }
        return $this->repository->listAll($page, $search);
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