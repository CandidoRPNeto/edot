<?php
namespace Src\Database;

use PDO;

class MysqlDB
{

    public function __construct($dbHost, $dbName, $dbUser, $dbPass)
    {
        $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8", $dbUser, $dbPass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "Conexão com MySQL realizada com sucesso!";
    }
}