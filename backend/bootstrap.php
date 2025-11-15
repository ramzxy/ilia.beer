<?php
require 'vendor/autoload.php';
use Dotenv\Dotenv;
use Ilia\Backend\System\DatabaseConnector;
use Google\Cloud\Storage\StorageClient;
use Google\Cloud\Video\Transcoder\V1\Client\TranscoderServiceClient;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$dbConnection = (new DatabaseConnector())->GetConnection();

// Initialize Google Cloud Storage
putenv('GOOGLE_APPLICATION_CREDENTIALS=' . __DIR__ . '/GCS.json');
$storage = new StorageClient([
    'projectId' => 'facilitypipeline',
]);
$bucket = $storage->bucket('ilia_beer');

// Initialize transcoder client
$transcoder = new TranscoderServiceClient();
$parent = $transcoder->locationName('facilitypipeline', 'europe-west4');

return [
    'db' => $dbConnection,
    'bucket' => $bucket,
    'parent' => $parent,
    'transcoder' => $transcoder
];



