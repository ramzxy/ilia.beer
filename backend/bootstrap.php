<?php
require 'vendor/autoload.php';
use Dotenv\Dotenv;
use Ilia\Backend\System\DatabaseConnector;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$dbConnection = (new DatabaseConnector())->GetConnection();

return $dbConnection;



