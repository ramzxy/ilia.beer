"use client";

import { useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useLenis } from "@/app/providers/lenis-provider";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsVisible(latest > 0.14);
  });

  const scrollToTop = () => {
    if (lenis && !reduceMotion) {
      lenis.scrollTo(0, {
        duration: 0.85,
        easing: (value: number) => 1 - Math.pow(1 - value, 3),
      });
      return;
    }

    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={reduceMotion ? false : { opacity: 0, transform: "translateY(12px) scale(0.96)" }}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={{ opacity: 0, transform: "translateY(8px) scale(0.96)" }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="interactive-press fixed bottom-4 right-4 z-10 flex size-12 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink shadow-[4px_4px_0_var(--ink)] hover:-translate-y-0.5 hover:bg-accent hover:text-paper md:bottom-7 md:right-7"
        >
          <ArrowUpIcon aria-hidden="true" className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
