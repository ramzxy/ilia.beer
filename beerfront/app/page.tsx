"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "./lib/definitions";
import { videoService } from "./lib/api/videos";
import MeshGradientBackground from "@/components/ui/mesh-gradient-background";
import BuyMeBeerButton from "@/components/ui/buy-me-beer-button";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";

export default function Page() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoLoadingStates, setVideoLoadingStates] = useState<Record<number, boolean>>({});
  const [videoThumbnails, setVideoThumbnails] = useState<Record<number, string>>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const thumbnailRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const processedThumbnails = useRef<Set<number>>(new Set());

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.muted) {
        video.muted = false;
        video.play().catch(() => {
          // If play fails, keep muted
          video.muted = true;
        });
      } else {
        video.muted = true;
      }
    }
  };

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

  useEffect(() => {
    const observers = videoRefs.current
      .filter((video) => video !== null)
      .map((video, index) => {
        // Set up loading event listeners
        const handleCanPlay = () => {
          setVideoLoadingStates((prev) => ({ ...prev, [index]: false }));
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
                // Load video if not already loaded (browser will cache it)
                if (video.readyState === 0) {
                  video.load();
                }
                // Reset and play video when it enters viewport
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
            rootMargin: "0px",
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
      <section className="relative z-10 min-h-screen snap-start md:snap-align-none flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-wide" style={{ fontFamily: "NightyDemo, sans-serif" }}>
              Buy me a beer!
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-lg mx-auto">
              Order a beer and write a message for me.
            </p>
            <div className="pt-4">
              <BuyMeBeerButton />
            </div>
            <div className="pt-10 space-y-4">
              <p className="text-gray-500 text-sm font-light tracking-wide">
                See other submissions
              </p>
              <div className="animate-bounce">
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
              </div>
            </div>
        </div>
      </section>

      {/* Video Feed */}
      <main className="relative z-10 md:max-w-xl md:mx-auto md:px-4 md:py-8 md:space-y-12">
        {loading ? (
          <div className="min-h-screen snap-start flex items-center justify-center md:py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
              <p className="text-gray-500 text-base font-light tracking-wide">
                Loading videos...
              </p>
            </div>
          </div>
        ) : videos.length > 0 ? (
          <>
            {videos.map((video, index) => (
              <article
                key={video.id}
                className="min-h-screen snap-start md:snap-align-none md:min-h-0 flex flex-col justify-center items-center px-4 md:block md:space-y-3"
              >
                  {/* Video Container */}
                  <div 
                    className="relative w-full aspect-square max-w-lg md:max-w-none bg-black rounded-3xl overflow-hidden border border-gray-800 md:hover:border-gray-700 transition-all md:hover:shadow-2xl md:hover:shadow-gray-900/50 cursor-pointer"
                    onClick={() => handleVideoClick(index)}
                  >
                    {/* Blurred Thumbnail Background */}
                    {videoLoadingStates[index] && videoThumbnails[index] && (
                      <div 
                        className="absolute inset-0 z-0"
                        style={{
                          backgroundImage: `url(${videoThumbnails[index]})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          filter: "blur(20px)",
                          transform: "scale(1.1)",
                        }}
                      />
                    )}
                    
                    {/* Loading Placeholder */}
                    {videoLoadingStates[index] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30 z-10">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                          <p className="text-gray-500 text-xs font-light">Loading video...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Hidden video for thumbnail generation */}
                    <video
                      ref={(el) => {
                        thumbnailRefs.current[index] = el;
                      }}
                      src={video.url}
                      className="hidden"
                      preload="metadata"
                      muted
                      playsInline
                    />
                    
                    {/* Main video */}
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={video.url}
                      className={`w-full h-full object-cover ${videoLoadingStates[index] ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
                      loop
                      muted
                      playsInline
                      preload="none"
                      autoPlay={false}
                    />
                  </div>

                  {/* Caption Section */}
                  <div className="px-2 space-y-1 mt-1 md:mt-0 max-w-lg md:max-w-none w-full">
                    <p className="text-white text-base font-light leading-relaxed tracking-wide">
                      {video.caption || "Untitled Video"}
                    </p>
                    <time className="text-gray-600 text-xs block font-mono uppercase tracking-wider">
                      {new Date(video.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </article>
            ))}
            {/* End of content message */}
            <section className="min-h-screen snap-start md:snap-align-none md:min-h-0 flex items-center justify-center px-4 py-20">
              <p className="text-gray-500 text-base font-light tracking-wide">
                You&apos;ve seen it all
              </p>
            </section>
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
