<?php 
namespace Src\Database;

enum DbTypes: string {
    case MYSQL = 'mysql';
    case PGSQL = 'pgsql';
}
