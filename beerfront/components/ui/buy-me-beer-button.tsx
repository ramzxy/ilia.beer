"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "framer-motion";

const BUY_URL = "https://buymeacoffee.com/rmxzy/e/473225";

interface BuyMeBeerButtonProps {
  variant?: "accent" | "dark";
}

export default function BuyMeBeerButton({
  variant = "accent",
}: BuyMeBeerButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={BUY_URL}
      target="_blank"
      rel="noopener noreferrer"
      initial={reduceMotion ? false : { opacity: 0, transform: "translateY(12px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={`interactive-press inline-flex w-fit items-center justify-center gap-3 rounded-2xl border-2 border-ink px-6 py-3.5 text-sm font-black shadow-[5px_5px_0_var(--ink)] hover:-translate-y-0.5 sm:px-7 sm:py-4 ${
        variant === "accent"
          ? "bg-accent text-paper hover:bg-paper hover:text-ink"
          : "bg-ink text-paper hover:bg-accent"
      }`}
    >
      Buy me a beer
      <ArrowUpRightIcon aria-hidden="true" className="size-4 stroke-[2.5]" />
    </motion.a>
  );
}
