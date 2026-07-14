"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

interface BeerTrackerProps {
  liters: number;
  goal: number;
}

function formatLiters(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function AnimatedLiters({
  liters,
  reduceMotion,
}: {
  liters: number;
  reduceMotion: boolean | null;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(formatLiters(0));

  useMotionValueEvent(value, "change", (latest) => {
    setDisplay(formatLiters(latest));
  });

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      value.set(liters);
      return;
    }

    const controls = animate(value, liters, {
      duration: 1.15,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [inView, liters, reduceMotion, value]);

  return <span ref={ref}>{display}</span>;
}

export default function BeerTracker({ liters, goal }: BeerTrackerProps) {
  const reduceMotion = useReducedMotion();
  const trackerRef = useRef<HTMLDivElement>(null);
  const trackerInView = useInView(trackerRef, { once: true, amount: 0.3 });
  const percent = goal > 0 ? Math.min((liters / goal) * 100, 100) : 0;

  return (
    <motion.div
      ref={trackerRef}
      initial={reduceMotion ? false : { opacity: 0, transform: "translateY(36px) rotate(-1deg)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px) rotate(0deg)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[2rem] border-[3px] border-ink bg-accent p-7 text-paper shadow-[10px_10px_0_var(--ink)] sm:p-10 md:p-14"
    >
      <div className="relative z-[1] grid gap-10 md:grid-cols-[0.75fr_1.25fr] md:items-end">
        <div>
          <p className="font-display text-2xl font-semibold italic text-paper/75">
            Beer count
          </p>
          <h2 className="text-balance mt-3 text-5xl font-black leading-[0.9] tracking-[-0.065em] md:text-7xl">
            That is a lot of beer.
          </h2>
          <p className="mt-5 max-w-sm text-base font-semibold leading-relaxed text-paper/75">
            This number comes from the live tab. No imaginary pints, no marketing
            math.
          </p>
        </div>

        <div className="md:text-right">
          <div className="flex items-end gap-3 md:justify-end">
            <motion.span
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, transform: "translateY(24px) scale(0.94)" }
              }
              whileInView={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.18, delay: 0.12 }}
              className="tabular-nums text-[clamp(6rem,18vw,13rem)] font-black leading-[0.73] tracking-[-0.09em]"
            >
              <AnimatedLiters liters={liters} reduceMotion={reduceMotion} />
            </motion.span>
            <span className="pb-1 text-3xl font-black sm:pb-3 sm:text-5xl">L</span>
          </div>
          <div
            className="mt-8 overflow-hidden rounded-full border-2 border-paper bg-ink/20 p-1"
            role="progressbar"
            aria-label={`${percent.toFixed(0)} percent of the ${goal} liter goal`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(percent)}
          >
            <motion.div
              initial={
                reduceMotion
                  ? false
                  : { transform: "translate3d(-100%, 0, 0)" }
              }
              animate={
                reduceMotion
                  ? undefined
                  : {
                      transform: `translate3d(${trackerInView ? percent - 100 : -100}%, 0, 0)`,
                    }
              }
              style={
                reduceMotion
                  ? { transform: `translate3d(${percent - 100}%, 0, 0)` }
                  : undefined
              }
              transition={{ duration: 1.1, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="h-4 w-full rounded-full bg-background"
            />
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3 md:justify-end">
            <span className="rounded-full border-2 border-paper bg-paper px-4 py-2 text-sm font-black text-accent">
              {percent.toFixed(0)}% of {goal} L
            </span>
            <span className="text-sm font-bold text-paper/75">and still standing</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
