"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { Source_Serif_4 } from "next/font/google";
import dynamic from "next/dynamic";
import Script from "next/script";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  // Define the weight range you need
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  // Include italic if needed
  style: ["normal", "italic"],
  variable: "--font-source-serif",
});

// Fix the font paths by removing the extra forward slash

// Create a client-side only YouTube component
const YouTubeEmbed = dynamic(() => import("./components/YouTubeEmbed"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-white/80 animate-pulse flex items-center justify-center">
      <span className="text-[#F97316]">Loading video...</span>
    </div>
  ),
});

// Update the constant to use the public env variable
const YOUTUBE_VIDEO_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_URL ||
  "https://www.youtube.com/embed/oAVGsJGi-u4?si=QApsEMaqYwkD_LHa";

export default function FeelMitraLandingPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if Ctrl+K was pressed
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault(); // Prevent default browser behavior
        console.log("Analyze button clicked");
        window.location.href = "./coming-soon";
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Updated scrollToSection function with improved smooth scrolling
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Offset for fixed header
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  // Updated useEffect for better scroll behavior
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    // Optional: Add scroll event listener for active section detection
    const handleScroll = () => {
      const sections = ["hero", "about", "features", "team"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -100 && rect.top <= 150;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const teamMembers = [
    {
      name: "Aman Pandit",
      role: "Founder & CEO",
      image: "/Aman_2.jpg?zoom=0.5",
      description:
        "Visionary leader driving Feel Mitra's mission of emotional intelligence.",
      social: {
        twitter: "https://twitter.com/_aman045",
        linkedin: "https://linkedin.com/in/aman045",
        whatsapp: "https://wa.me/9734662257",
      },
    },
    {
      name: "Shubh Srivastava",
      role: "Product Strategy Lead",
      image: "/Shubh_4.jpg",
      description:
        "Tech genius behind our advanced emotional analysis algorithms.",
      social: {
        twitter: "https://twitter.com/idleshubh",
        linkedin: "https://linkedin.com/in/srivastavshubh",
        whatsapp: "https://wa.me/9118766776",
      },
    },
    {
      name: "Apoorv Dixit",
      role: "Product Design Lead",
      image: "/Apoorv_3.jpg",
      description:
        "Crafting intuitive experiences that make emotional tracking seamless.",
      social: {
        twitter: "https://twitter.com/Dixitt_apoorvv",
        linkedin: "https://linkedin.com/in/apoorv-dixit-06106b305",
        whatsapp: "https://wa.me/9452878147",
      },
    },
    {
      name: "Anant Vardhan",
      role: "Frontend Developer",
      image: "/AVP.jpg",
      description: "Crafting the frontend of Feel Mitra from intitutive UI/UX",
      social: {
        twitter: "https://twitter.com/your-handle",
        linkedin: "https://www.linkedin.com/in/avpthegreat",
        whatsapp: "https://wa.me/+918874497809",
      },
    },
  ];

  const features = [
    {
      title: "Sentiment Analysis",
      description:
        "Analyzes the sentiment of journal entries and provides deep insights",
      image: "/features/sentiment.svg",
    },
    {
      title: "Emotional Analysis",
      description: "Breaks down emotional trends over time",
      image: "/features/emotional.svg",
    },
    {
      title: "Guided Journaling",
      description:
        "Express yourself with daily prompts and themed questions designed to promote self-reflection and growth.",
      image: "/features/trends.svg",
    },
    {
      title: "Habit Insights",
      description:
        "Monitor your daily habits and see how they connect to your mood patterns and overall mental health.",
      image: "/features/daily.svg",
    },
  ];

  return (
    <div
      className="bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] min-h-screen"
      suppressHydrationWarning
    >
      <Head>
        <title>Feel Mitra - Your Emotional Companion</title>
        <link rel="icon" href="/icon.png" type="image/png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
          suppressHydrationWarning
        />
      </Head>

      {/* Floating Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed z-50 w-[95%] md:w-[90%] mx-auto left-0 right-0 mt-4 bg-white/80 backdrop-blur-md rounded-full px-4 md:px-6 py-3 flex items-center justify-between shadow-lg"
      >
        <div
          onClick={() => scrollToSection("hero")}
          className="text-xl md:text-2xl font-bold text-[#EA580C] cursor-pointer hover:text-[#F97316] transition-colors"
        >
          <Image
            src="/feelmitralogo.png"
            alt="Feel Mitra"
            width={100}
            height={30}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#F97316]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {["About", "Features", "Team", "Steps to Your Wellness"].map(
            (item) => (
              <button
                key={item}
                onClick={() =>
                  scrollToSection(
                    item === "Steps to Your Wellness"
                      ? "cta"
                      : item.toLowerCase()
                  )
                }
                className="text-[#F97316] hover:text-[#EA580C] transition-colors"
              >
                {item}
              </button>
            )
          )}
        </nav>

        <div className="hidden md:flex space-x-4">
          <div id="typeform-div" className="flex items-center">
            <div
              data-tf-live="01JP09YTXEKF1RMR2J3DJ44FR3"
              className="typeform-button"
            ></div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed z-40 top-20 left-0 right-0 bg-white/90 backdrop-blur-md p-4 md:hidden"
        >
          <div className="flex flex-col space-y-4">
            {["About", "Features", "Team", "Steps to Emotional Wellness"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() =>
                    scrollToSection(
                      item === "Steps to Emotional Wellness"
                        ? "cta"
                        : item.toLowerCase()
                    )
                  }
                  className="text-[#F97316] hover:text-[#EA580C] transition-colors py-2"
                >
                  {item}
                </button>
              )
            )}
            <div className="flex justify-center pt-2">
              <div id="typeform-div-mobile" className="flex items-center">
                <div
                  data-tf-live="01JP09YTXEKF1RMR2J3DJ44FR3"
                  className="typeform-button"
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] px-4 py-20 md:py-0"
      >
        {/* Animated Circular Lines - Scale based on screen size */}
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
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-[200px] md:w-[500px] lg:w-[800px] h-[200px] md:h-[500px] lg:h-[800px] border-2 border-[#EA580C] rounded-full opacity-20"
        />

        {/* Additional Vibrant Gradient Backgrounds */}
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

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute w-[200px] md:w-[500px] lg:w-[800px] h-[200px] md:h-[500px] lg:h-[800px] bg-gradient-to-br from-[#EA580C] via-[#F97316] to-[#FF9F1C] rounded-full blur-3xl opacity-40"
        />

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={`text-center z-10 relative px-4 flex flex-col justify-center items-center min-h-[40vh] ${sourceSerif.className}`}
        >
          <h1
            className={`flex flex-col text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium text-black pt-12 ${sourceSerif.className}`}
          >
            Your Journey to
            <span className={`text-[#EA580C] italic`}>Mental Well-being</span>
          </h1>
          <p
            className={`text-lg sm:text-xl md:text-2xl lg:text-4xl mt-8 text-black font-normal`}
          >
            Because Every Feeling Deserves a Friend
          </p>
        </motion.div>

        {/* Writing Box with Input */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-20 w-full max-w-[1000px] min-h-[180px] sm:min-h-[220px] md:min-h-[250px] bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-4 md:p-6 lg:p-8 flex flex-col mx-auto mt-10"
        >
          <div className="flex-grow" /> {/* Spacer to push content down */}
          <textarea
            placeholder="Your thoughts deserve a home, Start journaling now ..."
            className={`w-full flex-grow text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#EA580C] placeholder-[#EA580C]/50 outline-none resize-none mb-4 bg-transparent font-normal italic min-h-[80px] md:min-h-[100px] lg:min-h-[120px] ${sourceSerif.className}`}
          />
          <button
            className="self-end bg-[#EA580C] text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-[#F97316] transition-all text-base md:text-lg flex items-center justify-center"
            onClick={() => {
              console.log("Analyze button clicked");
              window.location.href = "./coming-soon";
            }}
            id="analyze-button"
            aria-label="Analyze button. Shortcut: Ctrl+K"
          >
            Analyze{" "}
            <span className="ml-2 text-sm font-medium tracking-wide bg-white/10 px-2 py-0.5 rounded">
              Ctrl+K
            </span>
          </button>
        </motion.div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] px-4 py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[1200px] relative z-10"
        >
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-12 text-center ${sourceSerif.className}`}
          >
            About Feel Mitra
          </h2>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Main Image */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl relative h-[300px] lg:h-[500px]"
            >
              <div className="relative w-full h-full">
                <YouTubeEmbed videoUrl={YOUTUBE_VIDEO_URL} />
              </div>
            </motion.div>

            {/* Right Column - Info Cards */}
            <div className="flex flex-col space-y-6">
              {/* Vision Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border-2 border-[#F97316] flex-1"
              >
                <div className="w-12 h-12 bg-[#F97316] rounded-full mb-4 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#EA580C] mb-2">
                  Our Vision
                </h3>
                <p className="text-[#F97316]">
                  To create a world where everyone has access to emotional
                  support and understanding through technology
                </p>
              </motion.div>

              {/* Mission Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border-2 border-[#F97316] flex-1"
              >
                <div className="w-12 h-12 bg-[#F97316] rounded-full mb-4 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#EA580C] mb-2">
                  Our Values
                </h3>
                <p className="text-[#F97316]">
                  Privacy, empathy, and innovation guide everything we do to
                  support your emotional well-being journey
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] px-4 py-20 md:py-24"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-8 md:mb-16 text-center w-full max-w-[1000px] ${sourceSerif.className}`}
        >
          Features
        </motion.h2>

        {/* Updated Features Grid Layout */}
        <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 relative z-10">
          {/* Main Feature Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 bg-white/90 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-[#F97316]/20 hover:border-[#F97316]/40 transition-all duration-300"
          >
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#EA580C] bg-clip-text text-transparent mb-6">
              Mood Tracking & Analysis
            </h3>
            <p className="text-base md:text-lg lg:text-xl text-[#EA580C]/90 mb-8 leading-relaxed">
              Track your emotions with our intuitive system and discover
              patterns in your emotional well-being through advanced AI
              analysis.
            </p>

            {/* Feature Grid Inside Main Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.slice(0, 2).map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-[#FFEDD5]/70 to-[#FFF7ED]/70 p-6 rounded-2xl flex flex-col sm:flex-row items-start gap-5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#EA580C] to-[#F97316] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform -rotate-6 hover:rotate-0 transition-all duration-300">
                    {index === 0 ? (
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[#EA580C] font-bold text-lg md:text-xl mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-sm md:text-base text-[#F97316]/90 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Secondary Feature Cards */}
          {features.slice(2).map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#F97316]/20 hover:border-[#F97316]/40 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FFEDD5] to-[#FFF7ED] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  {index === 0 ? (
                    <svg
                      className="w-8 h-8 text-[#F97316]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 text-[#F97316]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#F97316] to-[#EA580C] bg-clip-text text-transparent mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-sm md:text-base lg:text-lg text-[#EA580C]/90 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section
        id="team"
        className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] px-4 py-16 md:py-24"
      >
        <div className="w-full max-w-[1400px] relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-8 md:mb-16 text-center ${sourceSerif.className}`}
          >
            Team
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl flex flex-col items-center text-center h-full"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 md:mb-6 border-4 border-[#F97316] shadow-lg">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    priority
                  />
                </div>
                <h3 className="text-base md:text-lg lg:text-xl text-black font-bold mb-2">
                  {member.name}
                </h3>
                <p className="text-[#F97316] text-sm md:text-base font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-xs md:text-sm text-[#EA580C] leading-relaxed mb-4 text-center px-2">
                  {member.description}
                </p>

                {/* Add social links */}
                <div className="flex space-x-3 mt-auto">
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F97316] hover:text-[#EA580C] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F97316] hover:text-[#EA580C] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href={member.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F97316] hover:text-[#EA580C] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}

      <section
        id="cta"
        className="min-h-[50vh] flex flex-col justify-center items-center relative z-10 py-12 px-4 md:px-8 lg:px-16 overflow-x-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl w-full flex flex-col items-center"
        >
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-6 ${sourceSerif.className}`}
          >
            Simple Steps to Emotional Wellness
          </h2>
          <p className="text-xl md:text-2xl text-[#F97316] mb-12">
            Your journey to better emotional health starts here
          </p>

          {/* Updated Steps Grid with better responsiveness */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6 lg:gap-8 w-full max-w-[1200px] px-4">
            {/* Step 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-4 lg:p-6 shadow-xl border-2 border-[#F97316] relative h-[160px] lg:h-[180px] w-full flex flex-col justify-center"
            >
              <div className="w-14 lg:w-16 h-14 lg:h-16 bg-[#FFF7ED] rounded-full absolute -top-7 lg:-top-8 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 border-2 border-[#F97316] flex items-center justify-center">
                <svg
                  className="w-7 lg:w-8 h-7 lg:h-8 text-[#F97316]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div className="pt-4 lg:pt-6">
                <h3
                  className={`text-lg lg:text-xl text-black font-bold mb-2 ${sourceSerif.className}`}
                >
                  Write Your Thoughts
                </h3>
                <p className="text-sm text-[#F97316] line-clamp-3">
                  Express yourself freely in our secure journaling space. Share
                  your thoughts, feelings, and experiences without judgment.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-4 lg:p-6 shadow-xl border-2 border-[#F97316] relative h-[160px] lg:h-[180px] w-full flex flex-col justify-center"
            >
              <div className="w-14 lg:w-16 h-14 lg:h-16 bg-[#FFF7ED] rounded-full absolute -top-7 lg:-top-8 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 border-2 border-[#F97316] flex items-center justify-center">
                <svg
                  className="w-7 lg:w-8 h-7 lg:h-8 text-[#F97316]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="pt-4 lg:pt-6">
                <h3
                  className={`text-lg lg:text-xl text-black font-bold mb-2 ${sourceSerif.className}`}
                >
                  AI Analysis
                </h3>
                <p className="text-sm text-[#F97316] line-clamp-3">
                  Our advanced AI analyzes your entries to understand your
                  emotional patterns and identify areas for growth.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-4 lg:p-6 shadow-xl border-2 border-[#F97316] relative h-[160px] lg:h-[180px] w-full flex flex-col justify-center"
            >
              <div className="w-14 lg:w-16 h-14 lg:h-16 bg-[#FFF7ED] rounded-full absolute -top-7 lg:-top-8 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 border-2 border-[#F97316] flex items-center justify-center">
                <svg
                  className="w-7 lg:w-8 h-7 lg:h-8 text-[#F97316]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="pt-4 lg:pt-6">
                <h3
                  className={`text-lg lg:text-xl text-black font-bold mb-2 ${sourceSerif.className}`}
                >
                  Get Insights
                </h3>
                <p className="text-sm text-[#F97316] line-clamp-3">
                  Receive personalized insights and recommendations based on
                  your emotional patterns and needs.
                </p>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-4 lg:p-6 shadow-xl border-2 border-[#F97316] relative h-[160px] lg:h-[180px] w-full flex flex-col justify-center"
            >
              <div className="w-14 lg:w-16 h-14 lg:h-16 bg-[#FFF7ED] rounded-full absolute -top-7 lg:-top-8 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 border-2 border-[#F97316] flex items-center justify-center">
                <svg
                  className="w-7 lg:w-8 h-7 lg:h-8 text-[#F97316]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
              <div className="pt-4 lg:pt-6">
                <h3
                  className={`text-lg lg:text-xl text-black font-bold mb-2 ${sourceSerif.className}`}
                >
                  Track Progress
                </h3>
                <p className="text-sm text-[#F97316] line-clamp-3">
                  Monitor your emotional growth over time with detailed
                  analytics and progress tracking.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Start Journaling Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#EA580C] text-white text-lg md:text-xl px-8 md:px-12 py-3 md:py-4 rounded-full hover:bg-[#F97316] transition-all shadow-lg hover:shadow-xl mt-16 flex items-center gap-2"
            onClick={() => {
              window.location.href = "./coming-soon";
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            Start Journaling Now
          </motion.button>

          {/* Newsletter Subscription Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-md mt-16 px-4 sm:px-6"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.email.value;
                const button = e.target.querySelector("button");

                // Update button to loading state
                button.disabled = true;
                button.innerHTML = `
                  <div class="flex items-center justify-center gap-3">
                    <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span class="font-medium">Subscribing...</span>
                  </div>
                `;

                fetch("/api/subscribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email,
                    adminEmail: "amanpandit1406@gmail.com",
                    senderEmail: "admin@feelmitra.in",
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.success) {
                      // Success toast notification
                      const toast = document.createElement("div");
                      toast.className = `
                      fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3
                      bg-white text-green-800 px-6 py-4 rounded-lg shadow-lg
                      transform transition-all duration-500 ease-out
                      border border-green-200 sm:text-base text-sm
                      max-w-[90vw] sm:max-w-md z-10
                    `;
                      toast.innerHTML = `
                      <svg class="w-6 h-6 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <div>
                        <p class="font-semibold">Successfully subscribed!</p>
                        <p class="text-green-700 text-sm mt-0.5">We'll keep you updated with the latest news.</p>
                      </div>
                    `;

                      // Animate toast
                      document.body.appendChild(toast);
                      requestAnimationFrame(() => {
                        toast.style.transform = "translate(-50%, 100%)";
                        requestAnimationFrame(() => {
                          toast.style.transform = "translate(-50%, 0)";
                          setTimeout(() => {
                            toast.style.opacity = "0";
                            toast.style.transform = "translate(-50%, 100%)";
                            setTimeout(() => toast.remove(), 300);
                          }, 3000);
                        });
                      });

                      // Reset form
                      e.target.reset();
                    } else {
                      throw new Error("Subscription failed");
                    }
                  })
                  .catch((error) => {
                    // Error toast notification
                    const toast = document.createElement("div");
                    toast.className = `
                    fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3
                    bg-red-50 text-red-800 px-6 py-4 rounded-lg shadow-lg
                    transform transition-all duration-500 ease-out
                    border border-red-200 sm:text-base text-sm
                    max-w-[90vw] sm:max-w-md
                  `;
                    toast.innerHTML = `
                    <svg class="w-6 h-6 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                      <p class="font-semibold">Subscription failed</p>
                      <p class="text-red-700 text-sm mt-0.5">Please check your email and try again.</p>
                    </div>
                  `;

                    // Animate toast
                    document.body.appendChild(toast);
                    requestAnimationFrame(() => {
                      toast.style.transform = "translate(-50%, 100%)";
                      requestAnimationFrame(() => {
                        toast.style.transform = "translate(-50%, 0)";
                        setTimeout(() => {
                          toast.style.opacity = "0";
                          toast.style.transform = "translate(-50%, 100%)";
                          setTimeout(() => toast.remove(), 300);
                        }, 3000);
                      });
                    });
                  })
                  .finally(() => {
                    // Reset button state
                    button.disabled = false;
                    button.innerHTML = `
                    <span class="font-medium">Subscribe to Newsletter</span>
                  `;
                  });
              }}
              className="flex flex-col gap-4"
            >
              <div className="relative w-full">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 rounded-xl bg-white/95 backdrop-blur-md border-2 border-[#F97316]/20 focus:border-[#EA580C] focus:ring-4 focus:ring-[#EA580C]/10 outline-none transition-all duration-300 text-[#EA580C] placeholder-[#F97316]/40 text-base sm:text-lg hover:border-[#EA580C]/40"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#EA580C] to-[#F97316] 
                          text-white rounded-xl hover:from-[#F97316] hover:to-[#EA580C] 
                          transition-all duration-300 shadow-lg hover:shadow-xl 
                          text-base sm:text-lg font-medium disabled:opacity-70 
                          disabled:cursor-not-allowed disabled:hover:scale-100
                          transform-gpu"
              >
                Subscribe to Newsletter
              </motion.button>
            </form>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-[#F97316] text-sm sm:text-base mt-4 text-center"
            >
              Join our mailing list for updates and emotional wellness tips
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      <Script
        id="typeform-script"
        strategy="afterInteractive"
        src="//embed.typeform.com/next/embed.js"
      />
    </div>
  );
}
