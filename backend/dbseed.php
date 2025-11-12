<?php
$dbConnection = require 'bootstrap.php';

$query = <<<EOS
    CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        caption VARCHAR(255),
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=INNODB;

    INSERT INTO videos
    (caption, url)
    VALUES
        ('test caption lalala', 'Test url lalala')
EOS;

try {
    $createTable = $dbConnection->exec($query);
    echo "Table created!\n";
} catch (\PDOException $e) {
    exit($e->getMessage());
}