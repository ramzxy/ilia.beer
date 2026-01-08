"use client";

import { motion } from "framer-motion";

export default function BuyMeBeerButton() {
  return (
    <motion.a
      href="https://buymeacoffee.com/rmxzy/e/473225"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold rounded-full transition-all relative overflow-hidden group"
      style={{
        background: "linear-gradient(135deg, #e5a84b 0%, #c77f32 50%, #a65d21 100%)",
        color: "#1a0f05",
        border: "2px solid rgba(229, 168, 75, 0.6)",
        boxShadow: "0 0 20px rgba(199, 127, 50, 0.25), 0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 30px rgba(199, 127, 50, 0.4), 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%)",
          backgroundSize: "200% 100%"
        }}
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 2
        }}
      />
      
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
      <span className="relative z-10 tracking-wide">Buy me a beer 🍺</span>
    </motion.a>
  );
}
