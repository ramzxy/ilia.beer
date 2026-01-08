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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      className="min-h-screen snap-start md:snap-align-none md:min-h-0 flex flex-col justify-center items-center px-4 md:block md:space-y-4"
    >
      {/* Video Container */}
      <motion.div
        className="relative w-full aspect-square max-w-lg md:max-w-none overflow-hidden cursor-pointer group"
        style={{
          backgroundColor: "#0d0906",
          borderRadius: "1.25rem",
          border: "1px solid rgba(199, 127, 50, 0.15)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4), 0 0 40px rgba(199, 127, 50, 0.05)"
        }}
        onClick={handleClick}
        whileHover={{ 
          borderColor: "rgba(199, 127, 50, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(199, 127, 50, 0.1)"
        }}
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
          <div className="absolute inset-0 flex items-center justify-center z-10" style={{ backgroundColor: "rgba(13, 9, 6, 0.6)" }}>
            <div className="flex flex-col items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full animate-spin"
                style={{ 
                  border: "2px solid rgba(199, 127, 50, 0.2)",
                  borderTopColor: "rgba(229, 168, 75, 0.8)"
                }}
              />
              <p className="text-xs font-light" style={{ color: "rgba(200, 180, 160, 0.6)" }}>Loading video...</p>
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
          } transition-opacity duration-500`}
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
          className="absolute top-4 right-4 z-20 rounded-full p-3"
          style={{
            background: "rgba(13, 9, 6, 0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(199, 127, 50, 0.2)"
          }}
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
            style={{ color: "#f5efe6" }}
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </motion.div>

        {/* Hover overlay */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 50%, rgba(13, 9, 6, 0.6) 100%)"
          }}
        />
      </motion.div>

      {/* Caption Section */}
      <motion.div
        className="px-2 space-y-2 mt-2 md:mt-0 max-w-lg md:max-w-none w-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p 
          className="text-base font-light leading-relaxed tracking-wide whitespace-pre-wrap"
          style={{ color: "rgba(245, 239, 230, 0.9)" }}
        >
          {video.caption || "Untitled Video"}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-amber-700/50" />
          <time 
            className="text-xs uppercase tracking-wider"
            style={{ 
              color: "rgba(199, 127, 50, 0.5)",
              fontFamily: "var(--font-outfit)"
            }}
          >
            {new Date(video.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default memo(VideoCard);

