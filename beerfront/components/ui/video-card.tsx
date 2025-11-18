"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import type { Video } from "@/app/lib/definitions";

interface VideoCardProps {
  video: Video;
  index: number;
  videoRef: (el: HTMLVideoElement | null) => void;
  thumbnailRef: (el: HTMLVideoElement | null) => void;
  isLoading: boolean;
  thumbnail: string | undefined;
  onVideoClick: () => void;
}

function VideoCard({
  video,
  index,
  videoRef,
  thumbnailRef,
  isLoading,
  thumbnail,
  onVideoClick,
}: VideoCardProps) {
  const [isMuted, setIsMuted] = useState(true);

  const handleClick = () => {
    setIsMuted(!isMuted);
    onVideoClick();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="min-h-screen snap-start md:snap-align-none md:min-h-0 flex flex-col justify-center items-center px-4 md:block md:space-y-3"
    >
      {/* Video Container */}
      <motion.div
        className="relative w-full aspect-square max-w-lg md:max-w-none bg-black rounded-3xl overflow-hidden border border-gray-800 transition-all cursor-pointer group"
        onClick={handleClick}
        whileHover={{ borderColor: "rgba(156, 163, 175, 0.5)", scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Blurred Thumbnail Background */}
        {isLoading && thumbnail && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${thumbnail})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px)",
              transform: "scale(1.1)",
            }}
          />
        )}

        {/* Loading Placeholder */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
              <p className="text-gray-500 text-xs font-light">Loading video...</p>
            </div>
          </div>
        )}

        {/* Hidden video for thumbnail generation */}
        <video
          ref={thumbnailRef}
          src={video.url}
          className="hidden"
          preload="metadata"
          muted
          playsInline
        />

        {/* Main video */}
        <video
          ref={videoRef}
          src={video.url}
          className={`w-full h-full object-cover ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          loop
          playsInline
          preload="none"
          autoPlay={false}
          poster={thumbnail || undefined}
          muted={isMuted}
        />

        {/* Mute/Unmute indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isMuted ? 0 : 1, scale: isMuted ? 0.8 : 1 }}
          className="absolute top-4 right-4 z-20 glass-effect-strong rounded-full p-3"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </motion.div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </motion.div>

      {/* Caption Section */}
      <motion.div
        className="px-2 space-y-1 mt-1 md:mt-0 max-w-lg md:max-w-none w-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-white text-base font-light leading-relaxed tracking-wide whitespace-pre-wrap">
          {video.caption || "Untitled Video"}
        </p>
        <time className="text-gray-600 text-xs block font-mono uppercase tracking-wider">
          {new Date(video.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </motion.div>
    </motion.article>
  );
}

export default memo(VideoCard);
