"use client";

import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  variant?: "video" | "text" | "circle";
  className?: string;
}

export default function SkeletonLoader({ 
  variant = "video", 
  className = "" 
}: SkeletonLoaderProps) {
  const baseClasses = "bg-gradient-to-r from-gray-800/50 via-gray-700/50 to-gray-800/50 bg-[length:200%_100%] animate-shimmer";
  
  const variantClasses = {
    video: "w-full aspect-square rounded-3xl",
    text: "h-4 rounded-md",
    circle: "w-12 h-12 rounded-full"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        animation: "shimmer 2s ease-in-out infinite"
      }}
    />
  );
}
