<?php
namespace Src\Db;
use PDO;
use PDOException;

class MySQLClient implements DatabaseClient {

    private $host = "127.0.0.1";
    private $db_name = "meubanco";
    private $username = "root";
    private $password = "root";
    public $conn;

    public function connect()
    {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
        } catch (PDOException $exception) {
            echo "Erro na conexão: " . $exception->getMessage();
        }
        return $this->conn;
    }
}