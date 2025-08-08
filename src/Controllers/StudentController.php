<?php
namespace Src\Controllers;

use Src\Entities\Student;
use Src\Entities\User;
use Src\Repository\{UserRepository, StudentRepository};

class StudentController
{

    public function __construct(protected StudentRepository $studentRepository,protected UserRepository $userRepository)
    {
    }

    public function create($data)
    {
        $data['role'] = 'STD';
        $user = new User($data);
        $user = $this->userRepository->create($user);
        $data['user_id'] = $user['id'];
        $student = new Student($data);
        $student = $this->studentRepository->create($student);
        return array_merge($user, $student);
    }

    public function update($id, $data)
    {
        $user = new User($data);
        $user = $this->userRepository->updateByStudent($id, $user);
        $data['user_id'] = $user['id'];
        $student = new Student($data);
        $student = $this->studentRepository->update($id, $student);
        return array_merge($user, $student);
    }

    public function getOptionList($search)
    {
        return $this->studentRepository->listOptions($search);
    }

    public function show($id)
    {
        return $this->studentRepository->read($id);
    }

    public function search($page, $search)
    {
        return $this->studentRepository->listAll($page, ['name' => $search]);
    }

    public function index($page)
    {
        return $this->studentRepository->listAll($page);
    }

    public function delete($id)
    {
        return $this->studentRepository->delete($id);
    }
}