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
  async uploadToStorage(signedUrl: string, file: File): Promise<void> {
    const contentType = file.type || (file.name.endsWith('.webm') ? 'video/webm' : 'video/mp4');
    await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": contentType,
      },
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

    // Step 2: Upload to storage
    if (onProgress) onProgress(20);
    await this.uploadToStorage(signedUrl, file);

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

