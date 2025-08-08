<?php
namespace Src\Structures;

abstract class Migration {
    
    protected string $table = '';

    protected array $fields = [];

    protected int $qtd_inserts = 1;

    protected function createTable(){}

    protected function insertSeeders(){}

    protected function createConstraints(){}

    protected function createIndexes(){}

}