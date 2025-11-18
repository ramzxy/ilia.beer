import apiClient from "./client";
import type { Video } from "../definitions";

export interface SignedUrlResponse {
  signedUrl: string;
  fileName: string;
}

export interface CreateVideoPayload {
  caption: string;
  fileExtension?: string; // 'mp4' or 'webm'
}

/**
 * Video Service
 * All video-related API calls
 */
export const videoService = {
  /**
   * Get all videos
   */
  async getAll(): Promise<Video[]> {
    try {
      const response = await apiClient.get<Video[]>("/api/videos");
      // Ensure response.data is always an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      console.warn("API returned non-array response:", response.data);
      return [];
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      return [];
    }
  },

  /**
   * Get a signed URL for uploading a video
   */
  async getSignedUrl(payload: CreateVideoPayload): Promise<SignedUrlResponse> {
    const response = await apiClient.post<SignedUrlResponse>(
      "/api/videos/signed-url",
      payload
    );
    return response.data;
  },

  /**
   * Upload video file to Google Cloud Storage
   */
  async uploadToStorage(signedUrl: string, file: File, onProgress?: (progress: number) => void): Promise<void> {
    const contentType = file.type || (file.name.endsWith('.webm') ? 'video/webm' : 'video/mp4');
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = Math.floor((e.loaded / e.total) * 100);
          // Map to 20-100% range (since we're already at 20% when this starts)
          const mappedProgress = 20 + Math.floor((percentComplete / 100) * 80);
          onProgress(mappedProgress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });
      
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'));
      });
      
      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.send(file);
    });
  },

  /**
   * Complete video upload process
   * 1. Get signed URL from backend
   * 2. Upload file to cloud storage
   */
  async upload(
    file: File,
    caption: string,
    onProgress?: (progress: number) => void
  ): Promise<SignedUrlResponse> {
    // Step 1: Get signed URL (pass file extension for proper content-type)
    if (onProgress) onProgress(10);
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'mp4';
    const { signedUrl, fileName } = await this.getSignedUrl({ 
      caption,
      fileExtension: fileExtension === 'webm' ? 'webm' : 'mp4'
    });

    // Step 2: Upload to storage (progress will be tracked internally)
    await this.uploadToStorage(signedUrl, file, onProgress);

    if (onProgress) onProgress(100);
    return { signedUrl, fileName };
  },

  /**
   * Update video caption
   */
  async update(id: number, caption: string): Promise<void> {
    await apiClient.put(`/api/videos/${id}`, { caption });
  },

  /**
   * Delete a video
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/videos/${id}`);
  },
};

/**
 * Get total beers/supporters count from Buy Me a Coffee
 */
export async function getBeerCount(): Promise<number> {
  try {
    const response = await apiClient.get<{ count: number }>("/api/beers");
    return response.data.count;
  } catch (error) {
    console.error("Failed to fetch beer count:", error);
    return 0;
  }
}

