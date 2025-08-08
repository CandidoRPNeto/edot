<?php
namespace Src\Entities;

interface Entity
{

    public function create(array $data): void;

    public function toArray(): array;

}