<?php

namespace Ilia\Backend\TableGateways;

class videoGateway {
    private $db = null;

    public function __construct($dbConnection) {
        $this->db = $dbConnection;
    }

    public function GetAll() {
        $query = "
            SELECT caption, url 
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
}
