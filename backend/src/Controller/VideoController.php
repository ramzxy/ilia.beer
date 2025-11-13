<?php

namespace Ilia\Backend\Controller;

use Ilia\Backend\TableGateways\VideoGateway;

class VideoController{
    private $db = null;
    private $requestMethod = null;
    private $videoGateway = null;
    private $uri = null;
    private $bucket = null;
    
    public function __construct($db, $requestMethod, $uri, $bucket = null){
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->videoGateway = new VideoGateway($db);
        $this->uri = $uri;
        $this->bucket = $bucket;
    }

    public function processRequest(){
        switch($this->requestMethod){
            case 'GET':
                if ($this->uri[2] === 'videos') {
                    $response = $this->getVideos();
                } else {
                    $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
                    $response['body'] = json_encode(['error' => 'Endpoint not found']);
                }
                break;
            case 'POST':
                if ($this->uri[2] === 'videos' && isset($this->uri[3]) && $this->uri[3] === 'signed-url') {
                    $response = $this->createVideoUpload();
                } else {
                    $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
                    $response['body'] = json_encode(['error' => 'Endpoint not found']);
                }
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

    private function getVideos()
    {
        $result = $this->videoGateway->GetAll();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = $result;
        return $response;
    }

    private function createVideoUpload()
    {
        try {
            // Get request body
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['caption'])) {
                $response['status_code_header'] = 'HTTP/1.1 400 Bad Request';
                $response['body'] = ['error' => 'Caption is required'];
                return $response;
            }
            
            $caption = $input['caption'];
            $fileName = uniqid() . '.mp4';
            $gcsUrl = 'https://storage.googleapis.com/ilia_beer/' . $fileName;

            // Insert video metadata into database
            $videoId = $this->videoGateway->Insert($caption, $gcsUrl);

            // Generate signed URL for upload
            $signedUrl = $this->bucket->object($fileName)->signedUrl(
                new \DateTime('+10 minutes'),
                [
                    'method' => 'PUT',
                    'contentType' => 'video/mp4',
                ]
            );

            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = [
                'signedUrl' => $signedUrl,
                'fileName' => $fileName,
                'videoId' => $videoId
            ];
            return $response;
        } catch (\Exception $e) {
            $response['status_code_header'] = 'HTTP/1.1 500 Internal Server Error';
            $response['body'] = ['error' => $e->getMessage()];
            return $response;
        }
    }
}

