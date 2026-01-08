"use client"

import { MeshGradient } from "@paper-design/shaders-react"
import { motion } from "framer-motion"

export default function MeshGradientBackground() {
  return (
    <div className="w-full h-full absolute inset-0 bg-[#0d0906]">
      <MeshGradient
        className="w-full h-full absolute inset-0"
        colors={["#0d0906", "#1a1209", "#251a0d", "#2d1f10", "#1a150c"]}
        speed={0.4}
        style={{ willChange: "transform" }}
      />
      
      {/* Warm glow overlay from top */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(199, 127, 50, 0.08) 0%, transparent 60%)"
        }}
      />
      
      {/* Enhanced lighting overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/3 w-48 h-48 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(199, 127, 50, 0.08)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-36 h-36 rounded-full blur-2xl"
          style={{ backgroundColor: "rgba(229, 168, 75, 0.06)" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-2/3 left-1/4 w-28 h-28 rounded-full blur-xl"
          style={{ backgroundColor: "rgba(166, 93, 33, 0.05)" }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>
      
      {/* Subtle grain texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px"
        }}
      />
    </div>
  )
}
