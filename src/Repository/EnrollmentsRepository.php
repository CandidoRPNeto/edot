<?php
namespace Src\Repository;

use PDO;
use Src\Entities\Entity;

class EnrollmentsRepository extends CrudRepository
{

    protected string $table = "enrollments";

    protected array $fields = [
        'student_id',
        'classroom_id'
    ];
    public function listAll($page, $search = []): array
    {
        $limit = 10;
        $offset = ($page - 1) * $limit;
        $where = '';
        $params = [];

        if (!empty($search['username'])) {
            $where = 'WHERE u.name LIKE :name';
            $params[':name'] = '%' . $search['username'] . '%';
        } else if (!empty($search['classname'])) {
            $where = 'WHERE c.name LIKE :name';
            $params[':name'] = '%' . $search['classname'] . '%';
        }

        $countSql = "SELECT COUNT(*) AS total 
                    FROM enrollments e
                    JOIN classrooms c ON e.classroom_id = c.id
                    JOIN students s ON e.student_id = s.id
                    JOIN users u ON s.user_id = u.id
                     $where";

        $countStmt = $this->conn->prepare($countSql);
        $countStmt->execute($params);
        $totalItems = (int) $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $sql = "SELECT 
                    e.id,
                    s.id as student_id,
                    u.name as student,
                    c.id as classroom_id,
                    c.name as classroom,
                    e.created_at
                    FROM enrollments e
                    JOIN classrooms c ON e.classroom_id = c.id
                    JOIN students s ON e.student_id = s.id
                    JOIN users u ON s.user_id = u.id
                $where
                ORDER BY u.name ASC, c.name ASC
                LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($sql);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value, PDO::PARAM_STR);
        }

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

    public function create(Entity $entity)
    {
        $data = $entity->toArray();
        $count = $this->count([
            'student_id' => $data['student_id'],
            'classroom_id' => $data['classroom_id'],
        ]);
        if ($count > 1) {
            throw new \InvalidArgumentException("Aluno ja esta matriculado");
        }
        return parent::create($entity);
    }

}