"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface BeerTrackerProps {
  liters: number;
  goal: number;
}

export default function BeerTracker({ liters, goal }: BeerTrackerProps) {
  const [mounted, setMounted] = useState(false);
  const [animatedFill, setAnimatedFill] = useState(0);
  const fillPercent = Math.min((liters / goal) * 100, 100);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedFill(prev => {
        const diff = fillPercent - prev;
        if (Math.abs(diff) < 0.5) return fillPercent;
        return prev + diff * 0.08;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [fillPercent]);

  const bubbles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 20 + ((i * 17) % 60),
      delay: (i * 0.25) % 3,
      duration: 2 + (i % 3),
      size: 2 + (i % 4),
    }));
  }, []);

  const beerY = 200 - (animatedFill / 100) * 170;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="w-10 h-10 rounded-full animate-spin"
          style={{
            border: "3px solid rgba(199, 127, 50, 0.2)",
            borderTopColor: "rgba(229, 168, 75, 0.8)"
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-4xl mx-auto">
      {/* Beer Mug */}
      <div className="relative flex-shrink-0">
        {/* Glow effect */}
        <div
          className="absolute inset-0 blur-3xl opacity-50 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, rgba(212, 130, 10, ${0.15 + animatedFill * 0.003}) 0%, transparent 60%)`,
            transform: "scale(2)"
          }}
        />

        <svg
          width="180"
          height="220"
          viewBox="0 0 180 220"
          className="relative z-10"
          style={{ filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.5))" }}
        >
          <defs>
            <linearGradient id="glassBodyTracker" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
              <stop offset="20%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.04)" />
              <stop offset="80%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.18)" />
            </linearGradient>

            <linearGradient id="beerFillTracker" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5B041" />
              <stop offset="30%" stopColor="#E59932" />
              <stop offset="60%" stopColor="#D4820A" />
              <stop offset="100%" stopColor="#B8660A" />
            </linearGradient>

            <linearGradient id="glassShineTracker" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.2)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>

            <clipPath id="mugClipTracker">
              <path d="M25 25 L30 185 Q33 200 45 200 L115 200 Q127 200 130 185 L135 25 Z" />
            </clipPath>

            <linearGradient id="handleGradTracker" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.18)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.06)" />
            </linearGradient>
          </defs>

          {/* Mug body */}
          <path
            d="M20 20 Q15 20 15 30 L25 185 Q28 205 45 205 L115 205 Q132 205 135 185 L145 30 Q145 20 140 20 Z"
            fill="url(#glassBodyTracker)"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
          />

          {/* Beer */}
          <g clipPath="url(#mugClipTracker)">
            <rect
              x="25"
              y={beerY}
              width="110"
              height={200 - beerY + 10}
              fill="url(#beerFillTracker)"
            />

            <rect
              x="25"
              y={beerY - 3}
              width="110"
              height="6"
              fill="rgba(255, 220, 150, 0.35)"
            />

            {animatedFill > 5 && bubbles.map((bubble) => (
              <motion.circle
                key={bubble.id}
                r={bubble.size}
                fill="rgba(255, 255, 255, 0.5)"
                initial={{ cx: bubble.x + 25, cy: 200, opacity: 0 }}
                animate={{
                  cy: [200, Math.max(40, beerY + 15)],
                  opacity: [0, 0.5, 0.5, 0],
                }}
                transition={{
                  duration: bubble.duration,
                  repeat: Infinity,
                  delay: bubble.delay,
                  ease: "linear",
                }}
              />
            ))}
          </g>

          {/* Shine */}
          <path
            d="M35 30 L38 180 Q38 185 42 185 L50 185 L47 30 Z"
            fill="url(#glassShineTracker)"
            opacity="0.7"
          />

          {/* Handle */}
          <path
            d="M140 45 Q165 45 165 80 L165 140 Q165 175 140 175"
            fill="none"
            stroke="url(#handleGradTracker)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M140 45 Q165 45 165 80 L165 140 Q165 175 140 175"
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Rim */}
          <ellipse
            cx="80"
            cy="22"
            rx="58"
            ry="4"
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Stats */}
      <div className="text-center md:text-left">
        <div className="flex items-baseline gap-2 justify-center md:justify-start">
          <motion.span
            className="text-6xl md:text-7xl font-bold tabular-nums"
            style={{
              color: "#e5a84b",
              textShadow: "0 0 40px rgba(229, 168, 75, 0.5)"
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {liters.toFixed(1)}
          </motion.span>
          <span
            className="text-2xl md:text-3xl font-light"
            style={{ color: "rgba(229, 168, 75, 0.5)" }}
          >
            / {goal}L
          </span>
        </div>

        <p
          className="text-sm mt-2 tracking-[0.15em] uppercase font-light"
          style={{ color: "rgba(200, 180, 160, 0.6)" }}
        >
          liters donated
        </p>

        {/* Progress bar */}
        <div
          className="mt-5 h-3 rounded-full overflow-hidden w-64 mx-auto md:mx-0"
          style={{ background: "rgba(199, 127, 50, 0.15)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #B8660A 0%, #D4820A 50%, #E5A84B 100%)",
              boxShadow: "0 0 15px rgba(229, 168, 75, 0.6)"
            }}
            initial={{ width: 0 }}
            animate={{ width: `${fillPercent}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        <p
          className="text-sm mt-3 font-light"
          style={{ color: "rgba(199, 127, 50, 0.5)" }}
        >
          {fillPercent.toFixed(0)}% of goal reached
        </p>
      </div>
    </div>
  );
}
