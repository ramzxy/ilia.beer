"use client";

import { memo, useEffect, useRef, useState } from "react";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import type { Video } from "@/app/lib/definitions";

interface VideoGalleryProps {
  videos: Video[];
  loading: boolean;
  error?: boolean;
}

interface VideoItemProps {
  video: Video;
  index: number;
}

const VideoItem = memo(function VideoItem({ video, index }: VideoItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoElement.play().catch(() => undefined);
        } else {
          videoElement.pause();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(videoElement);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const toggleSound = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const nextMuted = !videoElement.muted;
    videoElement.muted = nextMuted;
    setIsMuted(nextMuted);
    if (videoElement.paused) videoElement.play().catch(() => undefined);
  };

  return (
    <motion.article
      initial={
        reduceMotion
          ? false
          : { opacity: 0, transform: "translate3d(0, 28px, 0)" }
      }
      whileInView={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{
        duration: 0.58,
        delay: (index % 3) * 0.055,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="video-grid-item h-full"
    >
      <div className="video-receipt flex h-full flex-col overflow-hidden rounded-[1.5rem] border-[3px] border-ink bg-background shadow-[7px_7px_0_var(--ink)]">
        <motion.button
          type="button"
          aria-label={`${isMuted ? "Turn sound on for" : "Mute"} ${video.caption || "video evidence"}`}
          aria-pressed={!isMuted}
          onClick={toggleSound}
          initial={
            reduceMotion
              ? false
              : { clipPath: "inset(0 0 12% 0 round 1.25rem 1.25rem 0 0)" }
          }
          whileInView={{ clipPath: "inset(0 0 0% 0 round 1.25rem 1.25rem 0 0)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.72, ease: [0.77, 0, 0.175, 1] }}
          className="group relative block aspect-square w-full shrink-0 cursor-pointer overflow-hidden bg-[#202020] text-left"
        >
          {!isLoaded && (
            <div className="video-skeleton absolute inset-0" aria-hidden="true" />
          )}

          <video
            ref={videoRef}
            src={video.url}
            className={`h-full w-full object-cover transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.015] ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            loop
            playsInline
            muted={isMuted}
            preload="metadata"
            onCanPlay={() => setIsLoaded(true)}
          />

          <span className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink shadow-[3px_3px_0_var(--ink)] sm:right-4 sm:top-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isMuted ? "muted" : "playing"}
                initial={reduceMotion ? false : { opacity: 0, transform: "scale(0.92)" }}
                animate={{ opacity: 1, transform: "scale(1)" }}
                exit={{ opacity: 0, transform: "scale(0.92)" }}
                transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
              >
                {isMuted ? (
                  <SpeakerXMarkIcon aria-hidden="true" className="size-4" />
                ) : (
                  <SpeakerWaveIcon aria-hidden="true" className="size-4" />
                )}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.button>

        <div className="flex flex-1 flex-col px-5 pb-5 pt-4 text-ink">
          <p className="text-pretty min-h-[2.5em] text-lg font-black leading-tight tracking-[-0.025em]">
            {video.caption || "Beer successfully consumed"}
          </p>
          <time className="mt-auto block pt-3 text-xs font-bold text-ink/55">
            {new Date(video.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
      </div>
    </motion.article>
  );
});

function VideoSkeleton() {
  return (
    <div className="video-grid-item">
      <div className="overflow-hidden rounded-[1.5rem] border-[3px] border-ink bg-background shadow-[7px_7px_0_var(--ink)]">
        <div className="video-skeleton aspect-square" />
        <div className="h-[6.5rem]" />
      </div>
    </div>
  );
}

export default function VideoGallery({
  videos,
  loading,
  error = false,
}: VideoGalleryProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="proof" className="border-b-[3px] border-ink bg-paper py-20 md:py-32">
      <div className="site-container">
        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, transform: "translate3d(0, 26px, 0)" }
          }
          whileInView={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 max-w-3xl md:mb-16"
        >
          <p className="font-display text-2xl font-semibold italic text-accent md:text-3xl">
            Video receipts
          </p>
          <h2 className="text-balance mt-2 pb-[0.08em] text-5xl font-black leading-[0.96] tracking-[-0.065em] text-ink md:text-8xl">
            Proof I drank them.
          </h2>
          <p className="mt-5 max-w-lg text-base font-semibold leading-relaxed text-ink/65 md:text-lg">
            Tap any video for sound. Yes, I really do drink every single one.
          </p>
        </motion.div>

        {loading ? (
          <div className="video-grid">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <VideoSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[1.75rem] border-[3px] border-ink bg-background px-6 py-16 text-center shadow-[8px_8px_0_var(--ink)] sm:px-10">
            <h3 className="text-2xl font-black tracking-[-0.04em] text-ink">
              The evidence is hiding.
            </h3>
            <p className="mx-auto mt-3 max-w-md font-semibold text-ink/65">
              Refresh the page and the videos should come stumbling back in.
            </p>
          </div>
        ) : videos.length === 0 ? (
          <div className="grid min-h-[22rem] place-items-center rounded-[1.75rem] border-[3px] border-ink bg-background px-6 py-16 text-center shadow-[8px_8px_0_var(--ink)]">
            <div>
              <p className="text-5xl" aria-hidden="true">
                🍺
              </p>
              <p className="mt-4 text-3xl font-black tracking-[-0.04em] text-ink">
                No evidence yet.
              </p>
              <p className="mx-auto mt-3 max-w-sm font-semibold text-ink/65">
                Buy the first one and give this empty wall something to do.
              </p>
            </div>
          </div>
        ) : (
          <div className="video-grid">
            {videos.map((video, index) => (
              <VideoItem
                key={`${video.id}:${video.url}`}
                video={video}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
