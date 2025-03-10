"use client";

import { Source_Serif_4 } from "next/font/google";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Script from "next/script";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
});

export default function ComingSoon() {
  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if Ctrl+K was pressed
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault(); // Prevent default browser behavior
        // Trigger Typeform popup programmatically if needed
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[300px] md:w-[800px] lg:w-[1200px] h-[300px] md:h-[800px] lg:h-[1200px] border-2 border-[#F97316] rounded-full opacity-20"
      />
      <motion.div
        animate={{
          rotate: -360,
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[250px] md:w-[600px] lg:w-[1000px] h-[250px] md:h-[600px] lg:h-[1000px] border-2 border-[#F97316] rounded-full opacity-20"
      />

      <div className="text-center max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold text-[#2C3338] mb-6 ${sourceSerif.className}`}
          >
            Coming Soon
          </h1>
          <div className="w-20 h-1 bg-[#F97316] mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-[#2C3338]/80 mb-4 font-light">
            A new chapter in emotional wellness is about to unfold
          </p>
          <p className="text-lg md:text-xl text-[#2C3338]/70 font-light">
            Join our waitlist to be the first to experience Feelmitra
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-8"
        >
          <div id="typeform-div" className="flex justify-center">
            <div data-tf-live="01JP09YTXEKF1RMR2J3DJ44FR3"></div>
          </div>

          <div className="mt-12">
            <p className="text-[#2C3338]/60 text-sm md:text-base">
              Be part of our journey towards holistic wellness
            </p>
          </div>
        </motion.div>
      </div>

      {/* Background gradient elements */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{
          duration: 2,
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute w-[250px] md:w-[600px] lg:w-[900px] h-[250px] md:h-[600px] lg:h-[900px] bg-gradient-to-br from-[#FF6B6B] via-[#FFE66D] to-[#4ECDC4] rounded-full blur-3xl opacity-30"
      />

      <Script
        id="typeform-script"
        strategy="afterInteractive"
        src="//embed.typeform.com/next/embed.js"
      />
    </div>
  );
}
