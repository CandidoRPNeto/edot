<?php
namespace Src\Repository;

use PDO;

class ClassroomRepository extends CrudRepository
{

    protected string $table = "classrooms";

    protected array $fields = [
        'name',
        'description'
    ];

    

    public function listOptions($search): ?array
    {
        $sql = "SELECT id, name FROM {$this->table} 
                WHERE name LIKE :name
                ORDER BY name ASC
                LIMIT 5";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":name", '%' . $search . '%', PDO::PARAM_STR);
        $stmt->execute();
    
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function listAll($page, $search = []): array
    {
        $limit = 10;
        $offset = ($page - 1) * $limit;
    
        $where = '';
        $params = [];
    
        if (!empty($search['name'])) {
            $where = 'WHERE c.name LIKE :name';
            $params[':name'] = '%' . $search['name'] . '%';
        }

        $countSql = "SELECT COUNT(*) AS total FROM {$this->table} c $where";
        $countStmt = $this->conn->prepare($countSql);
        $countStmt->execute($params);
        $totalItems = (int) $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $sql = "SELECT 
                    c.*, 
                    (
                        SELECT COUNT(*) 
                        FROM enrollments e 
                        WHERE e.classroom_id = c.id
                    ) AS students_count
                FROM classrooms c 
                $where
                ORDER BY name ASC
                LIMIT $limit OFFSET $offset";
    
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        $totalPages = (int) ceil($totalItems / $limit);
    
        return [
            'items' => $items,
            'total_pages' => $totalPages,
        ];
    }

}