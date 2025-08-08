<?php
namespace Src\Controllers;

use Src\Repository\{ClassroomRepository, EnrollmentsRepository, UserRepository};

session_start();
class DashboardController
{
    public function getInfo(): array
    {
        $classroomRepository = new ClassroomRepository();
        $enrollmentsRepository = new EnrollmentsRepository();
        $userRepository = new UserRepository();
        return [
            'students' => $userRepository->count(['role' => 'STD']),
            'class' => $classroomRepository->count(),
            'enrollments' => $enrollmentsRepository->count()
        ];
    }
}