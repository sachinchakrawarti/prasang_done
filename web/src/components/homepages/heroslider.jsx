// src/components/homepages/heroslider.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
  FaQuoteRight,
  FaUser,
  FaBook,
  FaHeart,
  FaFeather,
  FaStar,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

const HeroSlider = () => {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Sample slides data with translations
  const slides = [
    {
      id: 1,
      titleKey: "welcome",
      subtitleKey: "heroSubtitle",
      descriptionKey: "heroDescription",
      image: null,
      ctaTextKey: "explorePoems",
      ctaLink: "/poems",
      featured: true,
      author: "Prasang Team",
      color: "from-amber-500 to-yellow-500",
      gradient: "from-amber-600/20 to-yellow-600/20",
    },
    {
      id: 2,
      title: "William Shakespeare",
      subtitle: "Featured Poet",
      description:
        "Explore the timeless sonnets and plays of the greatest writer in the English language.",
      image: null,
      ctaText: "Read Sonnets",
      ctaLink: "/poems/shakespeare",
      featured: true,
      author: "William Shakespeare",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-600/20 to-pink-600/20",
    },
    {
      id: 3,
      title: "Literary Criticism",
      subtitle: "Deep Analysis",
      description:
        "Dive into the world of literary criticism and discover new perspectives on classic works.",
      image: null,
      ctaText: "Explore Criticism",
      ctaLink: "/prose/criticism",
      featured: true,
      author: "Dr. Sarah Johnson",
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-600/20 to-cyan-600/20",
    },
    {
      id: 4,
      title: "Join Our Community",
      subtitle: "Share Your Voice",
      description:
        "Connect with fellow poetry lovers, share your work, and be part of a growing literary community.",
      image: null,
      ctaText: "Sign Up Now",
      ctaLink: "/signup",
      featured: true,
      author: "Prasang Community",
      color: "from-rose-500 to-orange-500",
      gradient: "from-rose-600/20 to-orange-600/20",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    }
    if (touchStartX - touchEndX < -50) {
      prevSlide();
    }
  };

  // Navigation functions
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Theme-aware styles
  const getTextColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-600 dark:text-green-400";
      case "lavender":
        return "text-purple-600 dark:text-purple-400";
      case "rose":
        return "text-rose-600 dark:text-rose-400";
      case "sepia":
        return "text-amber-600 dark:text-amber-400";
      default:
        return "text-amber-600 dark:text-amber-400";
    }
  };

  const getGradient = () => {
    switch (themeName) {
      case "forest":
        return "from-green-600 to-emerald-500";
      case "lavender":
        return "from-purple-600 to-pink-500";
      case "rose":
        return "from-rose-600 to-pink-500";
      case "sepia":
        return "from-amber-700 to-yellow-600";
      default:
        return "from-amber-600 to-yellow-500";
    }
  };

  const textColor = getTextColor();
  const gradient = getGradient();

  const slide = slides[currentSlide];

  // Get slide content with translations
  const getSlideTitle = () => {
    if (slide.titleKey) {
      return t(slide.titleKey) || slide.title;
    }
    return slide.title;
  };

  const getSlideSubtitle = () => {
    if (slide.subtitleKey) {
      return t(slide.subtitleKey) || slide.subtitle;
    }
    return slide.subtitle;
  };

  const getSlideDescription = () => {
    if (slide.descriptionKey) {
      return t(slide.descriptionKey) || slide.description;
    }
    return slide.description;
  };

  const getSlideCtaText = () => {
    if (slide.ctaTextKey) {
      return t(slide.ctaTextKey) || slide.ctaText;
    }
    return slide.ctaText;
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${slide.color} shadow-xl`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Hero slider"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 border-4 border-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 border-4 border-white rounded-full animate-pulse delay-1500"></div>
      </div>

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-30`}
      ></div>

      {/* Slide Content */}
      <div
        className={`relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
      >
        <div className="max-w-3xl mx-auto text-center text-white">
          {/* Featured Badge */}
          {slide.featured && (
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium animate-pulse">
              <FaStar size={12} className="text-yellow-300" />
              <span>{t("featured") || "Featured"}</span>
            </div>
          )}

          {/* Quote Icon */}
          <FaQuoteLeft className="text-3xl mb-4 opacity-50 mx-auto" />

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 drop-shadow-lg">
            {getSlideTitle()}
          </h1>

          {/* Subtitle */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4 opacity-90 drop-shadow-lg">
            {getSlideSubtitle()}
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl mb-6 opacity-80 max-w-2xl mx-auto drop-shadow">
            {getSlideDescription()}
          </p>

          {/* Author */}
          <p className="text-sm mb-6 opacity-70 flex items-center justify-center gap-2">
            <FaFeather size={12} />
            <span>{slide.author}</span>
          </p>

          {/* CTA Button */}
          <Link
            href={`/${lang}${slide.ctaLink}`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-full font-medium shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:bg-gray-50"
          >
            {getSlideCtaText()}
            <FaBook size={16} />
          </Link>

          {/* Quote End */}
          <FaQuoteRight className="text-3xl mt-4 opacity-50 mx-auto" />
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all backdrop-blur-sm z-20 hover:scale-110"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all backdrop-blur-sm z-20 hover:scale-110"
        aria-label="Next slide"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? `w-8 bg-white ${textColor}`
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button
          onClick={toggleAutoPlay}
          className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white hover:bg-black/50 transition-all"
          aria-label={isAutoPlaying ? "Pause autoplay" : "Play autoplay"}
        >
          {isAutoPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
        </button>
        <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
