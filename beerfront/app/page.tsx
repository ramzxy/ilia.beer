"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Video } from "./lib/definitions";
import { videoService, beerService } from "./lib/api/videos";
import MeshGradientBackground from "@/components/ui/mesh-gradient-background";
import BuyMeBeerButton from "@/components/ui/buy-me-beer-button";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import VideoGallery from "@/components/ui/video-gallery";
import BeerTracker from "@/components/ui/beer-tracker";

const BEER_GOAL = 100;

export default function Page() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [beerLiters, setBeerLiters] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [videosData, beerData] = await Promise.all([
          videoService.getAll(),
          beerService.getCount()
        ]);
        setVideos(videosData);
        setBeerLiters(beerData.liters);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-[#0d0906] min-h-screen">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0">
        <MeshGradientBackground />
      </div>

      {/* Hero Section - Simple intro */}
      <motion.section
        className="relative z-10 pt-16 pb-8 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-normal tracking-wide"
          style={{
            fontFamily: "Pacifico, cursive",
            color: "#f5efe6",
            textShadow: "0 2px 30px rgba(199, 127, 50, 0.4), 0 4px 60px rgba(0, 0, 0, 0.6)"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Buy me a beer!
        </motion.h1>

        <motion.p
          className="mt-3 text-base md:text-lg font-light max-w-md mx-auto"
          style={{ color: "rgba(200, 180, 160, 0.7)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          
        </motion.p>
      </motion.section>

      {/* Video Gallery Section - Main content */}
      <main className="relative z-10 py-8">
        <VideoGallery videos={videos} loading={loading} />
      </main>

      {/* Beer Tracker & CTA Section */}
      <section className="relative z-10 py-16 px-4">
        {/* Section header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-800/40" />
            <span
              className="text-sm tracking-[0.2em] uppercase font-light"
              style={{ color: "rgba(199, 127, 50, 0.5)" }}
            >
              Support the cause
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-800/40" />
          </div>

          <h2
            className="text-3xl md:text-4xl font-normal"
            style={{
              fontFamily: "Pacifico, cursive",
              color: "#f5efe6",
              textShadow: "0 2px 20px rgba(199, 127, 50, 0.3)"
            }}
          >
            Best beer you will ever buy someone
          </h2>
        </motion.div>

        {/* Beer Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <BeerTracker liters={beerLiters} goal={BEER_GOAL} />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BuyMeBeerButton />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center">
        <p
          className="text-xs tracking-wider"
          style={{ color: "rgba(160, 140, 120, 0.4)" }}
        >
          Made with love and hops
        </p>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}
