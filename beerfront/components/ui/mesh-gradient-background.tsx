"use client"

import { MeshGradient } from "@paper-design/shaders-react"
import { motion } from "framer-motion"

export default function MeshGradientBackground() {
  return (
    <div className="w-full h-full absolute inset-0 bg-black">
      <MeshGradient
        className="w-full h-full absolute inset-0"
        colors={["#000000", "#1a1a1a", "#2a2a2a", "#3a2a1a", "#1f150a"]}
        speed={0.6}
        style={{ willChange: "transform" }}
      />
      
      {/* Enhanced lighting overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/3 w-40 h-40 bg-amber-900/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-white/3 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-24 h-24 bg-gray-800/5 rounded-full blur-xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>
    </div>
  )
}
