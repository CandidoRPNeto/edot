<?php
namespace src\Config;
use Src\Db\DatabaseClient;

class Database
{
    public function __construct(protected DatabaseClient $client)
    {
    }
    
    public function getConnection()
    {
        return $this->client->connect();
    }
}