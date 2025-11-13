import apiClient from "./client";
import type { Video } from "../definitions";

export interface SignedUrlResponse {
  signedUrl: string;
  fileName: string;
}

export interface CreateVideoPayload {
  caption: string;
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
      return response.data;
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
    await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": "video/mp4",
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
    // Step 1: Get signed URL
    if (onProgress) onProgress(10);
    const { signedUrl, fileName } = await this.getSignedUrl({ caption });

    // Step 2: Upload to storage
    if (onProgress) onProgress(50);
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

