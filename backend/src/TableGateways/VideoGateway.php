<?php

namespace Ilia\Backend\TableGateways;

class VideoGateway {
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

    public function Update($id, $caption) {
        $query = "
            UPDATE videos 
            SET caption = :caption
            WHERE id = :id
        ";

        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'id' => $id,
                'caption' => $caption
            ]);
            return $stmt->rowCount();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function Delete($id) {
        $query = "
            DELETE FROM videos 
            WHERE id = :id
        ";

        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute(['id' => $id]);
            return $stmt->rowCount();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function GetById($id) {
        $query = "
            SELECT id, caption, url, created_at 
            FROM videos
            WHERE id = :id
        ";

        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute(['id' => $id]);
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
}
