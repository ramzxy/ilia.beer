"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { Video } from "./lib/definitions";
import { beerService, videoService } from "./lib/api/videos";
import BuyMeBeerButton from "@/components/ui/buy-me-beer-button";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import VideoGallery from "@/components/ui/video-gallery";
import BeerTracker from "@/components/ui/beer-tracker";

const BEER_GOAL = 100;
const BUY_URL = "https://buymeacoffee.com/rmxzy/e/473225";

const headlineLines = [
  { text: "You buy it.", accent: false },
  { text: "I drink it.", accent: true },
];

const marqueeCopies = Array.from({ length: 4 }, (_, index) => index);

export default function Page() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [beerLiters, setBeerLiters] = useState(0);
  const [dataError, setDataError] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const reelYRaw = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const reelRotateRaw = useTransform(scrollYProgress, [0, 1], [2.5, 0]);
  const reelScaleRaw = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const reelY = useSpring(reelYRaw, { stiffness: 90, damping: 24 });
  const reelRotate = useSpring(reelRotateRaw, { stiffness: 90, damping: 24 });
  const reelScale = useSpring(reelScaleRaw, { stiffness: 90, damping: 24 });
  const reelTransform = useMotionTemplate`translate3d(0, ${reelY}px, 0) rotate(${reelRotate}deg) scale(${reelScale})`;

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [videosData, beerData] = await Promise.all([
          videoService.getAll(),
          beerService.getCount(),
        ]);

        if (!active) return;
        setVideos(videosData);
        setBeerLiters(beerData.liters);
      } catch (error) {
        console.error("Failed to load page data:", error);
        if (active) setDataError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[30] -translate-y-24 rounded-2xl bg-ink px-5 py-3 font-bold text-paper transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="relative z-10">
        <nav
          aria-label="Main navigation"
          className="site-container flex h-[72px] items-center justify-between border-b-2 border-ink/20"
        >
          <a
            href="#top"
            className="interactive-press text-lg font-black tracking-[-0.055em] text-ink"
          >
            ilia<span className="text-accent">.</span>beer
          </a>

          <div className="flex items-center gap-5 sm:gap-8">
            <a
              href="#proof"
              className="hover-line relative hidden text-sm font-bold text-ink/70 hover:text-ink sm:block"
            >
              The evidence
            </a>
            <a
              href="#the-tab"
              className="hover-line relative hidden text-sm font-bold text-ink/70 hover:text-ink sm:block"
            >
              Beer count
            </a>
            <a
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-press inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-paper px-4 py-2.5 text-sm font-black text-ink shadow-[4px_4px_0_var(--ink)] hover:-translate-y-0.5 hover:bg-accent hover:text-paper sm:px-5"
            >
              Buy me a beer
              <ArrowUpRightIcon aria-hidden="true" className="size-4 stroke-[2.5]" />
            </a>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section
          ref={heroRef}
          id="top"
          className="site-container relative grid min-h-[calc(100dvh-72px)] grid-cols-1 items-center gap-8 overflow-hidden py-8 md:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.58fr)] md:gap-16 md:py-12"
        >
          <div className="relative z-[1] max-w-4xl">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.16em] text-accent">
              The deal is very simple
            </p>
            <h1
              aria-label="You buy it. I drink it."
              className="max-w-4xl text-[clamp(4rem,9.8vw,9.4rem)] font-black leading-[0.86] tracking-[-0.085em] text-ink"
            >
              {headlineLines.map((line, index) => (
                <span
                  key={line.text}
                  aria-hidden="true"
                  className="-mx-[0.06em] -mb-[0.12em] block overflow-hidden px-[0.06em] pb-[0.2em]"
                >
                  <motion.span
                    className={`block whitespace-nowrap ${line.accent ? "text-accent" : ""}`}
                    initial={
                      reduceMotion
                        ? false
                        : { transform: "translate3d(0, 108%, 0)" }
                    }
                    animate={{ transform: "translate3d(0, 0%, 0)" }}
                    transition={{
                      duration: 0.76,
                      delay: 0.08 + index * 0.13,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, transform: "translateY(16px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.5, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="text-pretty mt-6 max-w-md text-base font-semibold leading-relaxed text-ink/70 md:text-lg"
            >
              You send a beer. I drink it. The video goes right here as proof.
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, transform: "translateY(14px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 flex flex-wrap items-center gap-5"
            >
              <BuyMeBeerButton />
              <a
                href="#proof"
                className="interactive-press hover-line relative inline-flex items-center gap-2 py-3 text-sm font-black text-ink"
              >
                See me drink them
                <ArrowDownIcon aria-hidden="true" className="size-4 stroke-[2.5]" />
              </a>
            </motion.div>
          </div>

          <motion.div
            style={reduceMotion ? undefined : { transform: reelTransform }}
            className="relative z-[1] mx-auto w-full max-w-[27rem]"
          >
            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      transform: "translate3d(0, 40px, 0) rotate(5deg) scale(0.95)",
                    }
              }
              animate={{
                opacity: 1,
                transform: "translate3d(0, 0px, 0) rotate(0deg) scale(1)",
              }}
              transition={{ type: "spring", duration: 0.9, bounce: 0.16, delay: 0.28 }}
            >
              <div className="overflow-hidden rounded-[1.75rem] border-[3px] border-ink bg-ink p-2 shadow-[10px_12px_0_var(--accent)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-ink/10">
                  {loading ? (
                    <div className="video-skeleton absolute inset-0 grid place-items-center text-center text-sm font-black text-paper/75">
                      Finding the latest drink...
                    </div>
                  ) : videos[0] ? (
                    <video
                      src={videos[0].url}
                      autoPlay={!reduceMotion}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-paper text-7xl" aria-label="Beer">
                      🍺
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16 text-sm font-bold text-white">
                    {videos[0]?.caption || "The next one could have your name on it."}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <div
          className="marquee border-y-[3px] border-ink bg-accent py-4 text-paper"
          aria-label="How it works: You buy it, I drink it, the video goes here"
        >
          <div className="marquee-track font-black uppercase tracking-[-0.03em]">
            {[0, 1].map((group) => (
              <div
                key={group}
                className="marquee-group"
                aria-hidden="true"
              >
                {marqueeCopies.map((copy) => (
                  <span key={copy} className="marquee-copy">
                    You buy it&nbsp;&nbsp;/&nbsp;&nbsp; I drink it&nbsp;&nbsp;/&nbsp;&nbsp; The video goes here&nbsp;&nbsp;/
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <VideoGallery videos={videos} loading={loading} error={dataError} />

        <section id="the-tab" className="site-container py-20 md:py-32">
          <BeerTracker liters={beerLiters} goal={BEER_GOAL} />
        </section>

        <section className="site-container pb-20 md:pb-32">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, transform: "translateY(28px) rotate(-1deg)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px) rotate(0deg)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-8 rounded-[2rem] border-[3px] border-ink bg-paper p-7 shadow-[10px_10px_0_var(--ink)] sm:p-10 md:grid-cols-[1fr_auto] md:items-end md:p-14"
          >
            <div>
              <p className="font-display text-2xl font-semibold italic text-accent">
                Feeling generous?
              </p>
              <h2 className="text-balance mt-3 max-w-3xl text-5xl font-black leading-[0.9] tracking-[-0.065em] text-ink md:text-7xl">
                This next one is on you.
              </h2>
            </div>
            <BuyMeBeerButton variant="dark" />
          </motion.div>
        </section>
      </main>

      <footer className="border-t-[3px] border-ink bg-paper">
        <div className="site-container flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-black tracking-[-0.04em] text-ink">
            Cheers, legend <span aria-hidden="true">🍻</span>
          </p>
          <div className="flex gap-5 text-sm font-bold text-ink/65">
            <a className="hover-line relative hover:text-ink" href="#proof">
              The evidence
            </a>
            <a
              className="hover-line relative hover:text-ink"
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy me a beer
            </a>
          </div>
        </div>
      </footer>

      <ScrollToTopButton />
    </div>
  );
}
