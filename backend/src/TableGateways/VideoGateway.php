<?php

namespace Ilia\Backend\TableGateways;

class videoGateway {
    private $db = null;

    public function __construct($dbConnection) {
        $this->db = $dbConnection;
    }

    public function GetAll() {
        $query = "
            SELECT id, caption, url, created_at 
            FROM videos
            ORDER BY created_at DESC
        ";

        try {
            $stmt = $this->db->query($query);
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function Insert($caption, $url) {
        $query = "
            INSERT INTO videos (caption, url)
            VALUES (:caption, :url)
        ";

        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'caption' => $caption,
                'url' => $url
            ]);
            return $this->db->lastInsertId();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
}
