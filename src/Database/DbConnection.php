<?php
namespace Src\Database;

use PDOException;

class DbConnection
{
    public function __construct($type, $dbHost, $dbName, $dbUser, $dbPass)
    {
        try {
            switch ($type) {
                case DbTypes::MYSQL:
                    return new MysqlDB($dbHost, $dbName, $dbUser, $dbPass);
                default:
                    throw new \Exception("Tipo invalido. por favor escolha um tipo de banco de dados valido");
            }
        } catch (PDOException $e) {
            echo "Erro na conexão com MySQL: " . $e->getMessage();
            die();
        }
    }
}