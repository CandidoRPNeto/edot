<?php
namespace Src\Repository;

use PDO;
use Src\Config\Database;
use Src\Db\MySQLClient;
use Src\Entities\Entity;

class CrudRepository
{
    protected PDO $conn;

    protected string $table;

    protected array $fields;

    public function __construct()
    {
        require_once __DIR__ . '/../config/database.php';
        $database = new Database(new MySQLClient());
        $this->conn = $database->getConnection();
    }

    public function count($where = [])
    {
        $sql = "SELECT COUNT(*) AS total FROM {$this->table}";
        $params = [];
    
        if (!empty($where)) {
            $conditions = [];
            foreach ($where as $column => $value) {
                $conditions[] = "{$column} = :{$column}";
                $params[$column] = $value;
            }
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }
    
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
    
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? (int)$result['total'] : 0;
    }

    public function create(Entity $entity)
    {
        $data = $entity->toArray();
        $fields = $this->fields;
        $columns = implode(', ', $fields);
        $placeholders = ':' . implode(', :', $fields);

        $sql = "INSERT INTO {$this->table} ($columns) VALUES ($placeholders)";
        $stmt = $this->conn->prepare($sql);

        foreach ($fields as $field) {
            $stmt->bindValue(":$field", $data[$field] ?? null);
        }

        $stmt->execute();
        $data = $entity->toArray(true);
        $data['id'] = $this->conn->lastInsertId();
        return $data;
    }

    public function read(int $id): ?array
    {
        $sql = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id", $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }


    public function update(int $id, Entity $entity): array
    {
        $data = $entity->toArray();
        $fields = $this->fields;
        
        $validFields = array_filter($fields, fn($f) => array_key_exists($f, $data));
    
        if (empty($validFields)) {
            throw new \InvalidArgumentException("Campos invalidos");
        }
        
        $set = implode(', ', array_map(fn($f) => "$f = :$f", $validFields));
        $sql = "UPDATE {$this->table} SET $set WHERE id = :id";
    
        $stmt = $this->conn->prepare($sql);
        foreach ($validFields as $field) {
            $stmt->bindValue(":$field", $data[$field]);
        }
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $data = $entity->toArray(true);
        $data['id'] = $id;
        return $data;
    }

    public function delete(int $id): bool
    {
        $sql = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id", $id);
        return $stmt->execute();
    }

    public function listAll($page): array
    {
        $limit = 10;
        $offset = ($page - 1) * $limit;
        
        $countSql = "SELECT COUNT(*) AS total FROM {$this->table}";
        $countStmt = $this->conn->query($countSql);
        $totalItems = (int) $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $sql = "SELECT * FROM {$this->table} 
                ORDER BY name ASC
                LIMIT :limit OFFSET :offset";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $totalPages = (int) ceil($totalItems / $limit);

        return [
            'items' => $items,
            'total_pages' => $totalPages,
        ];
    }

}
