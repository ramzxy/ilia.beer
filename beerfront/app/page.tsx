"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Video } from "./lib/definitions";
import { videoService } from "./lib/api/videos";
import MeshGradientBackground from "@/components/ui/mesh-gradient-background";
import BuyMeBeerButton from "@/components/ui/buy-me-beer-button";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import VideoCard from "@/components/ui/video-card";
import SkeletonLoader from "@/components/ui/skeleton-loader";

export default function Page() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoLoadingStates, setVideoLoadingStates] = useState<Record<number, boolean>>({});
  const [videoThumbnails, setVideoThumbnails] = useState<Record<number, string>>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const thumbnailRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const processedThumbnails = useRef<Set<number>>(new Set());
  const nextVideoToDownload = useRef<number>(0);
  const downloadingVideos = useRef<Set<number>>(new Set());
  const startDownloadingNextVideoRef = useRef<(() => void) | null>(null);

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      // Toggle mute/unmute
      video.muted = !video.muted;
      if (!video.muted) {
        // If unmuting, try to play
        video.play().catch(() => {
          // If play fails, keep muted
          video.muted = true;
        });
      }
    }
  };

  const startDownloadingNextVideo = useCallback(() => {
    const currentIndex = nextVideoToDownload.current;
    
    // Check if there are more videos to download
    if (currentIndex >= videos.length) {
      return;
    }

    const video = videoRefs.current[currentIndex];
    if (!video) {
      return;
    }

    // Skip if already downloading or already loaded
    if (downloadingVideos.current.has(currentIndex) || video.readyState >= 3) {
      // Move to next video
      nextVideoToDownload.current = currentIndex + 1;
      if (startDownloadingNextVideoRef.current) {
        startDownloadingNextVideoRef.current();
      }
      return;
    }

    // Start downloading this video
    downloadingVideos.current.add(currentIndex);
    video.preload = "auto";
    video.load();
  }, [videos.length]);

  // Store the function in a ref so it can be called recursively
  startDownloadingNextVideoRef.current = startDownloadingNextVideo;

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      try {
        const data = await videoService.getAll();
        setVideos(data);
        // Initialize loading states for all videos
        const initialLoadingStates: Record<number, boolean> = {};
        data.forEach((_, index) => {
          initialLoadingStates[index] = true;
        });
        setVideoLoadingStates(initialLoadingStates);
        
        // Reset download tracking
        nextVideoToDownload.current = 0;
        downloadingVideos.current.clear();
      } catch (error) {
        console.error("Failed to load videos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  useEffect(() => {
    // Reset processed thumbnails and clear thumbnails when videos change
    processedThumbnails.current.clear();
    setVideoThumbnails({});
    
    // Generate thumbnails for videos
    thumbnailRefs.current.forEach((thumbnailVideo, index) => {
      if (!thumbnailVideo || processedThumbnails.current.has(index)) return;

      const handleSeeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = thumbnailVideo.videoWidth;
          canvas.height = thumbnailVideo.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(thumbnailVideo, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.7);
            setVideoThumbnails((prev) => ({ ...prev, [index]: thumbnailUrl }));
            processedThumbnails.current.add(index);
          }
          thumbnailVideo.removeEventListener("seeked", handleSeeked);
        } catch (error) {
          console.error("Failed to generate thumbnail:", error);
          thumbnailVideo.removeEventListener("seeked", handleSeeked);
        }
      };

      const handleLoadedMetadata = () => {
        // Seek to 1 second or 10% of video duration, whichever is smaller
        const seekTime = Math.min(1, thumbnailVideo.duration * 0.1);
        thumbnailVideo.currentTime = seekTime;
        thumbnailVideo.addEventListener("seeked", handleSeeked);
        thumbnailVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };

      thumbnailVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
      if (thumbnailVideo.readyState >= 1 && thumbnailVideo.duration) {
        // Metadata already loaded
        handleLoadedMetadata();
      } else {
        thumbnailVideo.load();
      }
    });
  }, [videos]);

  // Start downloading the first video when videos are loaded
  useEffect(() => {
    if (videos.length > 0 && !loading) {
      // Wait a bit for refs to be set
      const timer = setTimeout(() => {
        startDownloadingNextVideo();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [videos, loading, startDownloadingNextVideo]);

  useEffect(() => {
    const observers = videoRefs.current
      .filter((video) => video !== null)
      .map((video, index) => {
        // Set up loading event listeners
        const handleCanPlay = () => {
          setVideoLoadingStates((prev) => ({ ...prev, [index]: false }));
          
          // When this video finishes downloading, start downloading the next one
          if (downloadingVideos.current.has(index)) {
            downloadingVideos.current.delete(index);
            nextVideoToDownload.current = index + 1;
            if (startDownloadingNextVideoRef.current) {
              startDownloadingNextVideoRef.current();
            }
          }
        };
        
        const handleLoadStart = () => {
          setVideoLoadingStates((prev) => ({ ...prev, [index]: true }));
        };

        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("loadstart", handleLoadStart);

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Reset and play video when it enters viewport
                // Video should already be downloaded sequentially
                video.currentTime = 0;
                video
                  .play()
                  .then(() => {
                    // Video started playing successfully
                  })
                  .catch((error) => {
                    // Autoplay might be blocked, try again on user interaction
                    console.log("Autoplay blocked:", error);
                  });
              } else {
                // Pause and reset video when it leaves viewport
                video.pause();
                video.currentTime = 0;
              }
            });
          },
          {
            threshold: 0.2, // Play when 20% visible (earlier trigger)
            rootMargin: "50px", // Start loading 50px before entering viewport
          }
        );

        observer.observe(video);
        return { observer, video, handleCanPlay, handleLoadStart };
      });

    return () => {
      observers.forEach(({ observer, video, handleCanPlay, handleLoadStart }) => {
        observer.disconnect();
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("loadstart", handleLoadStart);
      });
    };
  }, [videos]);

  return (
    <div className="bg-black">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0">
        <MeshGradientBackground />
      </div>


      {/* Hero Section */}
      <motion.section 
        className="relative z-10 min-h-screen snap-start md:snap-align-none flex flex-col items-center justify-center px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <motion.h1 
            className="text-5xl md:text-7xl font-light text-white tracking-wide" 
            style={{ fontFamily: "NightyDemo, sans-serif" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Buy me a beer!
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Order a beer and write a message for me.
          </motion.p>
          <div className="pt-4">
            <BuyMeBeerButton />
          </div>
          <motion.div 
            className="pt-10 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-500 text-sm font-light tracking-wide">
              See other submissions
            </p>
            <motion.div 
              className="animate-bounce"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                width="52"
                height="52"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600 mx-auto"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Video Feed */}
      <main className="relative z-10 md:max-w-xl md:mx-auto md:px-4 md:py-8 md:space-y-12">
        {loading ? (
          <div className="min-h-screen snap-start flex items-center justify-center md:py-20">
            <div className="flex flex-col items-center gap-6 max-w-lg w-full px-4">
              <SkeletonLoader variant="video" />
              <div className="w-full space-y-2">
                <SkeletonLoader variant="text" className="w-3/4" />
                <SkeletonLoader variant="text" className="w-1/2" />
              </div>
            </div>
          </div>
        ) : videos.length > 0 ? (
          <>
            {videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                videoRef={(el) => {
                  videoRefs.current[index] = el;
                }}
                thumbnailRef={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                isLoading={videoLoadingStates[index]}
                thumbnail={videoThumbnails[index]}
                onVideoClick={() => handleVideoClick(index)}
              />
            ))}
            {/* End of content message */}
            <motion.section 
              className="min-h-screen snap-start md:snap-align-none md:min-h-0 flex items-center justify-center px-4 py-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-500 text-base font-light tracking-wide">
                You&apos;ve seen it all
              </p>
            </motion.section>
          </>
        ) : (
          <div className="min-h-screen snap-start flex items-center justify-center md:py-20">
            <p className="text-gray-500 text-base">No videos yet</p>
          </div>
        )}
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}
