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
      duration: 2.0, // Slower scroll duration
      easing: (t) => 1 - Math.pow(1 - t, 3), // Smoother cubic ease-out
      smoothWheel: true,
      wheelMultiplier: 0.7, // Slower wheel scrolling
      touchMultiplier: 0,
      touchInertiaMultiplier: 0,
      infinite: false,
    });

    setLenis(lenisInstance);

    function raf(time: number) {
      lenisInstance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
