<?php

namespace Ilia\Backend\Controller;

use Ilia\Backend\TableGateways\videoGateway;

class VideoController{
    private $db = null;
    private $requestMethod = null;
    private $videoGateway = null;
    private $uri = null;
    public function __construct($db, $requestMethod, $uri){
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->videoGateway = new videoGateway($db);
        $this->uri = $uri;
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
            default:
                $response['status_code_header'] = 'HTTP/1.1 405 Method Not Allowed';
                $response['body'] = json_encode(['error' => 'Method not allowed']);
                break;
        }
        
        // Send response
        header($response['status_code_header']);
        if ($response['body']) {
            echo json_encode($response['body']);
        }
    }

    private function getVideos()
    {
        $result = $this->videoGateway->GetAll();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = $result;
        return $response;
    }
}

