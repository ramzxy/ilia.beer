"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "./lib/definitions";
import { videoService } from "./lib/api/videos";
import MeshGradientBackground from "@/components/ui/mesh-gradient-background";
import BuyMeBeerButton from "@/components/ui/buy-me-beer-button";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";

export default function Page() {
  const [videos, setVideos] = useState<Video[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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
      const data = await videoService.getAll();
      setVideos(data);
    }
    loadVideos();
  }, []);

  useEffect(() => {
    const observers = videoRefs.current
      .filter((video) => video !== null)
      .map((video) => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Play video when it enters viewport
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
                // Pause video when it leaves viewport
                video.pause();
              }
            });
          },
          {
            threshold: 0.2, // Play when 20% visible (earlier trigger)
            rootMargin: "0px",
          }
        );

        observer.observe(video);
        return observer;
      });

    return () => {
      observers.forEach((observer) => observer.disconnect());
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
              Order a beer and for me and write a message for me.
            </p>
            <div className="pt-4">
              <BuyMeBeerButton />
            </div>
            <div className="pt-12 animate-bounce">
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
      </section>

      {/* Video Feed */}
      <main className="relative z-10 md:max-w-xl md:mx-auto md:px-4 md:py-8 md:space-y-2">
        {videos.length > 0 ? (
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
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={video.url}
                      className="w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                      preload="auto"
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
