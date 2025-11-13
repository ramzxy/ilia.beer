"use client";

import { useEffect, createContext, useContext, useState, useRef, useCallback } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

// Smooth easing function - cubic ease-out
const smoothEasing = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

// Check if device is mobile
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export default function LenisScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const isInitializedRef = useRef(false);

  // Optimized RAF loop
  const raf = useCallback((time: number) => {
    if (lenisRef.current) {
      lenisRef.current.raf(time);
    }
    rafRef.current = requestAnimationFrame(raf);
  }, []);

  // Clean up Lenis instance
  const destroyLenis = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
      isInitializedRef.current = false;
    }
    document.documentElement.classList.remove('lenis');
    document.documentElement.classList.remove('lenis-smooth');
    setLenis(null);
  }, []);

  // Initialize Lenis
  const initLenis = useCallback(() => {
    // Don't initialize on mobile or if already initialized
    if (isMobileDevice() || isInitializedRef.current) {
      return;
    }

    // Clean up existing instance if any
    destroyLenis();

    try {
      // Create Lenis instance with optimized settings
      const lenisInstance = new Lenis({
        duration: 1.2,
        easing: smoothEasing,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
        infinite: false,
        syncTouch: false,
        lerp: 0.1,
      });

      lenisRef.current = lenisInstance;
      isInitializedRef.current = true;

      // Add classes to html element
      document.documentElement.classList.add('lenis');
      document.documentElement.classList.add('lenis-smooth');

      // Start RAF loop
      rafRef.current = requestAnimationFrame(raf);

      // Set state
      setLenis(lenisInstance);
    } catch (error) {
      console.error('Failed to initialize Lenis:', error);
    }
  }, [raf, destroyLenis]);

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') return;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initLenis();
    }, 100);

    // Handle resize - debounced
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isMobileDevice() && lenisRef.current) {
          // Destroy Lenis if resized to mobile
          destroyLenis();
        } else if (!isMobileDevice() && !lenisRef.current && !isInitializedRef.current) {
          // Initialize Lenis if resized to desktop
          initLenis();
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      destroyLenis();
    };
  }, [initLenis, destroyLenis]);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
