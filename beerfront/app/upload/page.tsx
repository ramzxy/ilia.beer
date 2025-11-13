"use client";

import { useState } from "react";
import { videoService } from "../lib/api/videos";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate it's a video file
      if (!selectedFile.type.startsWith("video/")) {
        setUploadStatus("Please select a valid video file");
        return;
      }

      setFile(selectedFile);
      setUploadStatus("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first");
      return;
    }

    if (!caption.trim()) {
      setUploadStatus("Please enter a caption");
      return;
    }

    setUploading(true);
    setUploadStatus("Creating video entry...");
    setUploadProgress(0);

    try {
      const { fileName } = await videoService.upload(
        file,
        caption.trim(),
        (progress) => {
          setUploadProgress(progress);
          if (progress === 10) {
            setUploadStatus("Creating video entry...");
          } else if (progress === 50) {
            setUploadStatus(`Uploading ${file.name}...`);
          }
        }
      );

      setUploadStatus(`Upload successful! File: ${fileName}`);

      // Reset form
      setFile(null);
      setCaption("");
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadStatus(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Video Upload
        </h1>

        <div className="space-y-6">
          {/* Caption Input */}
          <div>
            <label
              htmlFor="caption-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Caption
            </label>
            <input
              id="caption-input"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={uploading}
              placeholder="Enter a caption for your video"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* File Input */}
          <div>
            <label
              htmlFor="file-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Video
            </label>
            <input
              id="file-input"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Selected File Info */}
          {file && (
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Selected:</span> {file.name}
              </p>
              <p className="text-sm text-gray-500">
                Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || !caption.trim() || uploading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>

          {/* Progress Bar */}
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Status Message */}
          {uploadStatus && (
            <div
              className={`p-4 rounded-md ${
                uploadStatus.includes("Error") ||
                uploadStatus.includes("Please")
                  ? "bg-red-50 text-red-700"
                  : uploadStatus.includes("successful")
                  ? "bg-green-50 text-green-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              <p className="text-sm">{uploadStatus}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
