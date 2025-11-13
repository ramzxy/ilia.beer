<?php
require 'vendor/autoload.php';
use Dotenv\Dotenv;
use Ilia\Backend\System\DatabaseConnector;
use Google\Cloud\Storage\StorageClient;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$dbConnection = (new DatabaseConnector())->GetConnection();

// Initialize Google Cloud Storage
putenv('GOOGLE_APPLICATION_CREDENTIALS=' . __DIR__ . '/GCS.json');
$storage = new StorageClient([
    'projectId' => 'facilitypipeline',
]);
$bucket = $storage->bucket('ilia_beer');

return [
    'db' => $dbConnection,
    'bucket' => $bucket
];



