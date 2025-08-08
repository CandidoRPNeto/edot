<?php
namespace Src\Repository;

use PDO;
use Src\Db\MySQLClient;
use Src\Helpers\JwtHelper;
use src\Config\Database;
use Src\Entities\Auth;

class AuthRepository
{
    private PDO $conn;

    public function __construct()
    {
        require_once __DIR__ . '/../config/database.php';
        $database = new Database(new MySQLClient());
        $this->conn = $database->getConnection();
    }

    public function login(Auth $credentials): array|false
    {
        $password = $credentials->getPassword();
        $email = $credentials->getEmail();
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']);
            return [
                'message' => 'usuario logado com sucesso',
                'token' => JwtHelper::generateToken($user)
            ];
        }
        return false;
    }
}
