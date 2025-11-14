<?php
/**
 * Script to set cache headers on existing videos in Google Cloud Storage
 * Run this once to optimize existing videos: php set-video-cache-headers.php
 */

require 'bootstrap.php';

use Google\Cloud\Storage\StorageClient;

try {
    $storage = new StorageClient([
        'keyFilePath' => __DIR__ . '/GCS.json',
    ]);
    
    $bucket = $storage->bucket('ilia_beer');
    
    // Get all video objects
    $objects = $bucket->objects(['prefix' => '']);
    
    $count = 0;
    foreach ($objects as $object) {
        // Only process .mp4 files
        if (pathinfo($object->name(), PATHINFO_EXTENSION) === 'mp4') {
            // Update metadata with cache headers
            $object->update([
                'metadata' => [
                    'cacheControl' => 'public, max-age=31536000, immutable',
                ],
            ]);
            
            $count++;
            echo "Updated cache headers for: {$object->name()}\n";
        }
    }
    
    echo "\nTotal videos updated: {$count}\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}

