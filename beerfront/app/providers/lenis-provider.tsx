"use client";

import { useEffect, createContext, useContext, useState, useRef } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function LenisScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable Lenis on desktop (>= 768px)
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // On mobile, don't initialize Lenis - use native scroll-snap
      return;
    }

    // Desktop: Initialize Lenis for smooth scrolling
    const lenisInstance = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Add lenis class to html element for CSS targeting
    document.documentElement.classList.add('lenis');
    document.documentElement.classList.add('lenis-smooth');

    function raf(time: number) {
      lenisInstance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);
    
    // Defer state update to avoid cascading renders
    queueMicrotask(() => setLenis(lenisInstance));

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenisInstance.destroy();
      document.documentElement.classList.remove('lenis');
      document.documentElement.classList.remove('lenis-smooth');
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
