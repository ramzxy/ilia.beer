"use client";

import { useState, useEffect, useCallback } from "react";
import { useLenis } from "@/app/providers/lenis-provider";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  const toggleVisibility = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Use Lenis scroll position if available, otherwise use window scroll
    const scrollY = lenis?.scroll ?? window.scrollY ?? document.documentElement.scrollTop ?? 0;
    setIsVisible(scrollY > 300);
  }, [lenis]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (lenis) {
      // Desktop: Listen to Lenis scroll events
      lenis.on("scroll", toggleVisibility);
      // Initial check
      toggleVisibility();
      
      return () => {
        lenis.off("scroll", toggleVisibility);
      };
    } else {
      // Mobile: Listen to native scroll events with throttling
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            toggleVisibility();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      // Initial check
      toggleVisibility();
      
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [lenis, toggleVisibility]);

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
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-gray-700 hover:border-gray-600 rounded-full transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
