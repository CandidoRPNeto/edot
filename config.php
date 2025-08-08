<?php

use Src\Database\DbConnection;
use Src\Database\DbTypes;

$db = new DbConnection(
    DbTypes::MYSQL,
    'localhost',
    'nome_do_banco',
    'usuario',
    'senha'
);