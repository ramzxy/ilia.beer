"use client";

import { useState } from "react";
import { videoService } from "../lib/api/videos";
import type { Video } from "../lib/definitions";
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
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === UPLOAD_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      loadVideos();
    } else {
      setPasswordError("Incorrect password");
      setPassword("");
    }
  };

  const loadVideos = async () => {
    setLoadingVideos(true);
    try {
      const data = await videoService.getAll();
      setVideos(data);
    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleEditStart = (video: Video) => {
    setEditingId(video.id);
    setEditCaption(video.caption);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditCaption("");
  };

  const handleEditSave = async (id: number) => {
    try {
      await videoService.update(id, editCaption);
      setVideos(videos.map(v => v.id === id ? { ...v, caption: editCaption } : v));
      setEditingId(null);
      setEditCaption("");
    } catch (error) {
      console.error("Failed to update video:", error);
      alert("Failed to update video. Please try again.");
    }
  };

  const handleDeleteVideo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      return;
    }

    try {
      await videoService.delete(id);
      setVideos(videos.filter(v => v.id !== id));
    } catch (error) {
      console.error("Failed to delete video:", error);
      alert("Failed to delete video. Please try again.");
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
    setUploadStatus("Preparing upload...");
    setUploadProgress(0);

    try {
      const { fileName } = await videoService.upload(
        file,
        caption.trim(),
        (progress) => {
          setUploadProgress(progress);
          if (progress < 20) {
            setUploadStatus("Creating video entry...");
          } else if (progress >= 20 && progress < 100) {
            const uploadPercent = Math.floor(((progress - 20) / 80) * 100);
            setUploadStatus(`Uploading ${file.name}... ${uploadPercent}%`);
          } else {
            setUploadStatus("Upload complete!");
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

      // Reload videos to show the newly uploaded one
      loadVideos();
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
            <div className="space-y-6">
            {/* Upload Form Card */}
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

            {/* Manage Videos Section */}
            <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-white tracking-wide">
                  Manage Videos
                </h2>
                <button
                  onClick={loadVideos}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                  disabled={loadingVideos}
                >
                  {loadingVideos ? "Loading..." : "Refresh"}
                </button>
              </div>

              {loadingVideos ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : videos.length === 0 ? (
                <p className="text-gray-400 text-center py-8 font-light">
                  No videos yet
                </p>
              ) : (
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-black/50 border border-gray-800 rounded-xl p-4 space-y-3"
                    >
                      {editingId === video.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-900 text-white text-sm font-light leading-relaxed rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none resize-none"
                            rows={3}
                            placeholder="Enter caption..."
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSave(video.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-light rounded-lg transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-light rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <p className="text-white text-sm font-light leading-relaxed whitespace-pre-wrap">
                                {video.caption || "Untitled Video"}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500 font-light">
                                <time className="font-mono uppercase tracking-wider">
                                  {new Date(video.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </time>
                                <span className="text-gray-700">•</span>
                                <span className="text-gray-600">ID: {video.id}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleEditStart(video)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                title="Edit caption"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteVideo(video.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors"
                                title="Delete video"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1="10" y1="11" x2="10" y2="17" />
                                  <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-800">
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-500 hover:text-gray-400 font-mono break-all transition-colors"
                            >
                              {video.url}
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

