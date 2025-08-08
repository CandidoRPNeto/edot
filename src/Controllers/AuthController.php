<?php
namespace Src\Controllers;

use Src\Entities\Auth;
use Src\Repository\AuthRepository;

session_start();
class AuthController
{
    
    public function __construct(protected AuthRepository $repository)
    {
    }
    public function login($data): array
    {
        $credentials = new Auth($data);
        $login = $this->repository->login($credentials);
        if ($login) {
            $_SESSION['token'] = $login['token'];
            return $login;
        }
        return ['message' => 'login ou senha incorretos'];
    }
}