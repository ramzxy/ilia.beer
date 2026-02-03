"use client";

import { memo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { Video } from "@/app/lib/definitions";

interface VideoGalleryProps {
  videos: Video[];
  loading: boolean;
}

interface VideoItemProps {
  video: Video;
  index: number;
  onExpand: (video: Video) => void;
}

// Individual video card with polaroid style
const VideoItem = memo(function VideoItem({ video, index, onExpand }: VideoItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Intersection observer for autoplay
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isLoaded) {
            videoEl.currentTime = 0;
            videoEl.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoEl.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoEl);
    return () => observer.disconnect();
  }, [isLoaded]);

  const handleVideoClick = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.muted = !videoEl.muted;
    setIsMuted(videoEl.muted);
  };

  // Staggered random rotation for organic feel
  const rotation = ((index * 7) % 9) - 4; // Random-ish rotation between -4 and 4 degrees

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: rotation * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="relative group"
    >
      <motion.div
        className="relative overflow-hidden cursor-pointer"
        style={{
          background: "linear-gradient(145deg, #1a1410 0%, #0d0906 100%)",
          borderRadius: "1rem",
          border: "1px solid rgba(199, 127, 50, 0.15)",
          boxShadow: `
            0 4px 20px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(199, 127, 50, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.03)
          `,
          transform: `rotate(${rotation}deg)`
        }}
        whileHover={{
          scale: 1.02,
          rotate: 0,
          boxShadow: `
            0 12px 40px rgba(0, 0, 0, 0.5),
            0 0 60px rgba(199, 127, 50, 0.08)
          `
        }}
        transition={{ duration: 0.3 }}
        onClick={handleVideoClick}
      >
        {/* Video container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* Main video */}
          <video
            ref={videoRef}
            src={video.url}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted={isMuted}
            onCanPlay={() => setIsLoaded(true)}
          />

          {/* Loading overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0d0906]">
              <div
                className="w-8 h-8 rounded-full animate-spin"
                style={{
                  border: "2px solid rgba(199, 127, 50, 0.2)",
                  borderTopColor: "rgba(229, 168, 75, 0.8)"
                }}
              />
            </div>
          )}

          {/* Sound indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: !isMuted ? 1 : 0, scale: !isMuted ? 1 : 0.8 }}
            className="absolute top-3 right-3 z-20 rounded-full p-2.5"
            style={{
              background: "rgba(13, 9, 6, 0.8)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(199, 127, 50, 0.2)"
            }}
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
              style={{ color: "#f5efe6" }}
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </motion.div>

          {/* Hover gradient */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: "linear-gradient(0deg, rgba(13, 9, 6, 0.5) 0%, transparent 40%)"
            }}
          />
        </div>

        {/* Caption area - polaroid style */}
        <div className="p-4 pb-5">
          <p
            className="text-sm font-light leading-relaxed line-clamp-2"
            style={{ color: "rgba(245, 239, 230, 0.85)" }}
          >
            {video.caption || "Untitled"}
          </p>
          <time
            className="block mt-2 text-xs uppercase tracking-wider"
            style={{ color: "rgba(199, 127, 50, 0.5)" }}
          >
            {new Date(video.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </time>
        </div>
      </motion.div>
    </motion.div>
  );
});

// Loading skeleton
function VideoSkeleton({ index }: { index: number }) {
  const rotation = ((index * 7) % 9) - 4;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1a1410 0%, #0d0906 100%)",
        borderRadius: "1rem",
        border: "1px solid rgba(199, 127, 50, 0.1)",
        transform: `rotate(${rotation}deg)`
      }}
    >
      <div className="aspect-[4/5] animate-pulse bg-gradient-to-br from-amber-900/10 to-transparent" />
      <div className="p-4 pb-5 space-y-3">
        <div className="h-4 bg-amber-900/10 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-amber-900/10 rounded animate-pulse w-1/3" />
      </div>
    </div>
  );
}

// Main gallery component
export default function VideoGallery({ videos, loading }: VideoGalleryProps) {
  const [expandedVideo, setExpandedVideo] = useState<Video | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-8 max-w-7xl mx-auto">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <VideoSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg" style={{ color: "rgba(200, 180, 160, 0.6)" }}>
          No videos yet
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-8 max-w-7xl mx-auto">
        {videos.map((video, index) => (
          <VideoItem
            key={video.id}
            video={video}
            index={index}
            onExpand={setExpandedVideo}
          />
        ))}
      </div>

    </>
  );
}
