/**
 * Client-side video compression using browser APIs
 * Falls back to original file if compression fails or is not supported
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxBitrate?: number; // in kbps
  quality?: number; // 0.0 to 1.0
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  maxBitrate: 2500, // 2.5 Mbps
  quality: 0.8,
};

/**
 * Compress video using browser MediaRecorder API
 * This provides basic compression without external dependencies
 */
export async function compressVideo(
  file: File,
  options: CompressionOptions = {},
  onProgress?: (progress: number) => void
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Skip compression if file is already small (< 10MB)
  if (file.size < 10 * 1024 * 1024) {
    console.log("File is already small, skipping compression");
    return file;
  }

  // Skip compression if file is too large (> 500MB) - would take too long
  if (file.size > 500 * 1024 * 1024) {
    console.warn("File too large for client-side compression, using original");
    return file;
  }

  // Check if MediaRecorder is supported
  if (!window.MediaRecorder || !MediaRecorder.isTypeSupported("video/webm")) {
    console.warn("MediaRecorder not supported, using original file");
    return file;
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      if (onProgress) onProgress(20);
      
      // Calculate dimensions maintaining aspect ratio
      let width = video.videoWidth;
      let height = video.videoHeight;

      if (width > opts.maxWidth || height > opts.maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = Math.min(width, opts.maxWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(height, opts.maxHeight);
          width = height * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;
      
      if (onProgress) onProgress(30);

      // Set up MediaRecorder
      const stream = canvas.captureStream(30); // 30 fps
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
        ? "video/webm;codecs=vp8"
        : "video/webm";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: opts.maxBitrate * 1000,
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (onProgress) onProgress(90);
        
        const compressedBlob = new Blob(chunks, { type: mimeType });
        
        // Only use compressed version if it's actually smaller (at least 10% reduction)
        if (compressedBlob.size < file.size * 0.9) {
          const compressedFile = new File(
            [compressedBlob],
            file.name.replace(/\.[^/.]+$/, ".webm"),
            { type: mimeType }
          );
          const reduction = ((1 - compressedBlob.size / file.size) * 100).toFixed(1);
          console.log(
            `Compressed ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedBlob.size / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`
          );
          if (onProgress) onProgress(100);
          resolve(compressedFile);
        } else {
          console.log("Compression didn't reduce size, using original");
          if (onProgress) onProgress(100);
          resolve(file);
        }

        // Cleanup
        stream.getTracks().forEach((track) => track.stop());
        const videoSrc = video.src;
        video.src = "";
        if (videoSrc.startsWith("blob:")) {
          URL.revokeObjectURL(videoSrc);
        }
      };

      mediaRecorder.onerror = (error) => {
        console.error("MediaRecorder error:", error);
        resolve(file); // Fallback to original
      };

      // Start recording
      video.currentTime = 0;
      mediaRecorder.start();

      // Draw video frames to canvas
      const drawFrame = () => {
        if (video.ended || video.paused) {
          mediaRecorder.stop();
          return;
        }

        ctx.drawImage(video, 0, 0, width, height);
        requestAnimationFrame(drawFrame);
      };

      video.onplay = () => {
        drawFrame();
      };

      video.onended = () => {
        mediaRecorder.stop();
      };

      // Start playback
      video.play().catch((error) => {
        console.error("Video play error:", error);
        resolve(file); // Fallback to original
      });
    };

    video.onerror = () => {
      console.error("Video load error");
      resolve(file); // Fallback to original
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Simple compression using canvas (for very basic cases)
 * This is a fallback that just resizes the video
 */
export async function resizeVideo(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<File> {
  return compressVideo(file, { maxWidth, maxHeight });
}

