"use client";

import { useState } from "react";
import { videoService } from "../lib/api/videos";
import MeshGradientBackground from "@/components/ui/mesh-gradient-background";
import Link from "next/link";

const UPLOAD_PASSWORD = "ilia1245"; // Hardcoded password

export default function UploadPage() {
  const [password, setPassword] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === UPLOAD_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password");
      setPassword("");
    }
  };

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
    <div className="bg-black min-h-screen">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0">
        <MeshGradientBackground />
      </div>

      {/* Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-block text-gray-400 hover:text-white transition-colors mb-6 text-sm font-light tracking-wide"
            >
              ← Back to home
            </Link>
            <h1
              className="text-5xl md:text-6xl font-light text-white tracking-wide mb-4"
              style={{ fontFamily: "NightyDemo, sans-serif" }}
            >
              Upload Video
            </h1>
            <p className="text-gray-400 font-light text-base md:text-lg">
              Share your message with a video
            </p>
          </div>

          {/* Password Form */}
          {!isAuthenticated ? (
            <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="password-input"
                    className="block text-sm font-light text-gray-400 mb-3 tracking-wide"
                  >
                    Password
                  </label>
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder="Enter password"
                    className="block w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition-all font-light"
                    autoFocus
                  />
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-300 font-light">
                      {passwordError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!password.trim()}
                  className="w-full bg-white text-black py-4 px-6 rounded-xl font-light text-base hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-wide"
                >
                  Continue
                </button>
              </form>
            </div>
          ) : (
            /* Upload Form Card */
            <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
            {/* Caption Input */}
            <div>
              <label
                htmlFor="caption-input"
                className="block text-sm font-light text-gray-400 mb-3 tracking-wide"
              >
                Caption
              </label>
              <textarea
                id="caption-input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={uploading}
                placeholder="Enter a caption for your video"
                rows={4}
                className="block w-full px-4 py-4 bg-black/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-light resize-none"
              />
            </div>

            {/* File Input */}
            <div>
              <label
                htmlFor="file-input"
                className="block text-sm font-light text-gray-400 mb-3 tracking-wide"
              >
                Select Video
              </label>
              <div className="relative">
                <input
                  id="file-input"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-light file:bg-gray-800 file:text-white hover:file:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Selected File Info */}
            {file && (
              <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <p className="text-sm text-white font-light mb-1">
                  <span className="text-gray-400">Selected:</span> {file.name}
                </p>
                <p className="text-xs text-gray-500 font-light">
                  Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || !caption.trim() || uploading}
              className="w-full bg-white text-black py-4 px-6 rounded-xl font-light text-base hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-wide"
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </button>

            {/* Progress Bar */}
            {uploading && (
              <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {/* Status Message */}
            {uploadStatus && (
              <div
                className={`p-4 rounded-xl border ${
                  uploadStatus.includes("Error") ||
                  uploadStatus.includes("Please")
                    ? "bg-red-950/30 border-red-900/50 text-red-300"
                    : uploadStatus.includes("successful")
                    ? "bg-green-950/30 border-green-900/50 text-green-300"
                    : "bg-gray-900/50 border-gray-800 text-gray-300"
                }`}
              >
                <p className="text-sm font-light">{uploadStatus}</p>
              </div>
            )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

