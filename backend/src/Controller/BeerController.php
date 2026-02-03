<?php

namespace Ilia\Backend\Controller;

class BeerController {
    private $requestMethod = null;
    private $dataFile = null;

    public function __construct($requestMethod) {
        $this->requestMethod = $requestMethod;
        $this->dataFile = __DIR__ . '/../../data/beer_count.json';

        // Ensure data directory exists
        $dataDir = dirname($this->dataFile);
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }

        // Initialize file if it doesn't exist
        if (!file_exists($this->dataFile)) {
            file_put_contents($this->dataFile, json_encode(['liters' => 0, 'updated_at' => date('c')]));
        }
    }

    public function processRequest() {
        switch($this->requestMethod) {
            case 'GET':
                $response = $this->getBeerCount();
                break;
            case 'PUT':
                $response = $this->updateBeerCount();
                break;
            default:
                $response['status_code_header'] = 'HTTP/1.1 405 Method Not Allowed';
                $response['body'] = json_encode(['error' => 'Method not allowed']);
                break;
        }

        // Send response
        header($response['status_code_header']);
        if (isset($response['body'])) {
            echo is_string($response['body']) ? $response['body'] : json_encode($response['body']);
        }
    }

    private function getBeerCount() {
        try {
            $data = json_decode(file_get_contents($this->dataFile), true);

            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = $data;
            return $response;
        } catch (\Exception $e) {
            $response['status_code_header'] = 'HTTP/1.1 500 Internal Server Error';
            $response['body'] = ['error' => $e->getMessage()];
            return $response;
        }
    }

    private function updateBeerCount() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['liters']) || !is_numeric($input['liters'])) {
                $response['status_code_header'] = 'HTTP/1.1 400 Bad Request';
                $response['body'] = ['error' => 'Liters value is required and must be a number'];
                return $response;
            }

            $liters = floatval($input['liters']);

            if ($liters < 0 || $liters > 10000) {
                $response['status_code_header'] = 'HTTP/1.1 400 Bad Request';
                $response['body'] = ['error' => 'Liters must be between 0 and 10000'];
                return $response;
            }

            $data = [
                'liters' => $liters,
                'updated_at' => date('c')
            ];

            file_put_contents($this->dataFile, json_encode($data, JSON_PRETTY_PRINT));

            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = $data;
            return $response;
        } catch (\Exception $e) {
            $response['status_code_header'] = 'HTTP/1.1 500 Internal Server Error';
            $response['body'] = ['error' => $e->getMessage()];
            return $response;
        }
    }
}
