"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "@/app/providers/lenis-provider";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenis = useLenis();

  const updateScrollState = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Use Lenis scroll position if available, otherwise use window scroll
    const scrollY = lenis?.scroll ?? window.scrollY ?? document.documentElement.scrollTop ?? 0;
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = windowHeight > 0 ? (scrollY / windowHeight) * 100 : 0;
    
    setIsVisible(scrollY > 300);
    setScrollProgress(progress);
  }, [lenis]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (lenis) {
      // Desktop: Listen to Lenis scroll events
      lenis.on("scroll", updateScrollState);
      // Initial check
      updateScrollState();
      
      return () => {
        lenis.off("scroll", updateScrollState);
      };
    } else {
      // Mobile: Listen to native scroll events with throttling
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateScrollState();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      // Initial check
      updateScrollState();
      
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [lenis, updateScrollState]);

  const scrollToTop = useCallback(() => {
    if (lenis) {
      // Desktop: Use Lenis smooth scroll
      lenis.scrollTo(0, { 
        duration: 1.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        immediate: false 
      });
    } else {
      // Mobile: Use native smooth scroll
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [lenis]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 glass-effect-strong hover:bg-white/15 rounded-full transition-all duration-300 group"
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {/* Circular progress indicator */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="3"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(245, 158, 11, 0.8)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: scrollProgress / 100 }}
              transition={{ duration: 0.2 }}
              style={{
                strokeDasharray: "283",
                strokeDashoffset: 283 * (1 - scrollProgress / 100),
              }}
            />
          </svg>
          
          {/* Arrow icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white relative z-10 transition-transform group-hover:-translate-y-1"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
