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
            case 'PUT':
                if ($this->uri[2] === 'videos' && isset($this->uri[3])) {
                    $response = $this->updateVideo($this->uri[3]);
                } else {
                    $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
                    $response['body'] = json_encode(['error' => 'Endpoint not found']);
                }
                break;
            case 'DELETE':
                if ($this->uri[2] === 'videos' && isset($this->uri[3])) {
                    $response = $this->deleteVideo($this->uri[3]);
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

    private function updateVideo($id)
    {
        try {
            // Get request body
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['caption'])) {
                $response['status_code_header'] = 'HTTP/1.1 400 Bad Request';
                $response['body'] = ['error' => 'Caption is required'];
                return $response;
            }

            // Check if video exists
            $video = $this->videoGateway->GetById($id);
            if (!$video) {
                $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
                $response['body'] = ['error' => 'Video not found'];
                return $response;
            }

            // Update the caption
            $rowsAffected = $this->videoGateway->Update($id, $input['caption']);

            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = [
                'success' => true,
                'message' => 'Video updated successfully',
                'rowsAffected' => $rowsAffected
            ];
            return $response;
        } catch (\Exception $e) {
            $response['status_code_header'] = 'HTTP/1.1 500 Internal Server Error';
            $response['body'] = ['error' => $e->getMessage()];
            return $response;
        }
    }

    private function deleteVideo($id)
    {
        try {
            // Check if video exists
            $video = $this->videoGateway->GetById($id);
            if (!$video) {
                $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
                $response['body'] = ['error' => 'Video not found'];
                return $response;
            }

            // Extract filename from URL to delete from GCS
            $url = $video['url'];
            $fileName = basename($url);

            // Delete from GCS if bucket is available
            if ($this->bucket) {
                try {
                    $object = $this->bucket->object($fileName);
                    if ($object->exists()) {
                        $object->delete();
                    }
                } catch (\Exception $e) {
                    // Log error but continue with database deletion
                    error_log("Failed to delete file from GCS: " . $e->getMessage());
                }
            }

            // Delete from database
            $rowsAffected = $this->videoGateway->Delete($id);

            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = [
                'success' => true,
                'message' => 'Video deleted successfully',
                'rowsAffected' => $rowsAffected
            ];
            return $response;
        } catch (\Exception $e) {
            $response['status_code_header'] = 'HTTP/1.1 500 Internal Server Error';
            $response['body'] = ['error' => $e->getMessage()];
            return $response;
        }
    }
}

