// src/components/homepages/Testimonials.jsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import {
  FaQuoteLeft,
  FaQuoteRight,
  FaStar,
  FaStarHalf,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaGlobe,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

const Testimonials = () => {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Dr. Emily Chen",
      role: "Professor of Comparative Literature",
      quote:
        "Prasang has become an invaluable resource for my students. The curated collection of poetry and prose is exceptional, spanning multiple languages and cultures.",
      rating: 5,
      avatar: null,
      location: "Harvard University, USA",
      social: {
        twitter: "@emilychen",
        instagram: "@dremilychen",
      },
    },
    {
      id: 2,
      name: "Michael Torres",
      role: "Poet & Writer",
      quote:
        "This platform has given me a space to share my work and connect with a community of passionate readers and writers. It's been transformative for my creative journey.",
      rating: 5,
      avatar: null,
      location: "Mexico City, Mexico",
      social: {
        twitter: "@michaeltorres",
        instagram: "@michael_poet",
      },
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Literary Translator",
      quote:
        "The multilingual approach of Prasang is groundbreaking. It bridges cultures and makes poetry accessible to everyone, regardless of their native language.",
      rating: 5,
      avatar: null,
      location: "London, UK",
      social: {
        twitter: "@aishapatel",
        instagram: "@aisha_translates",
      },
    },
    {
      id: 4,
      name: "James O'Brien",
      role: "Book Club Organizer",
      quote:
        "My book club has discovered so many wonderful works through Prasang. The discussion guides and author interviews are incredibly helpful for our meetings.",
      rating: 4,
      avatar: null,
      location: "Dublin, Ireland",
      social: {
        twitter: "@jamesobrien",
        instagram: "@james_books",
      },
    },
    {
      id: 5,
      name: "Dr. Rajesh Kumar",
      role: "Scholar of Indian Literature",
      quote:
        "The depth and breadth of Indian poetry available on Prasang is remarkable. It's preserving and promoting our literary heritage for future generations.",
      rating: 5,
      avatar: null,
      location: "Delhi, India",
      social: {
        twitter: "@rajeshkumar",
        instagram: "@drrajesh_lit",
      },
    },
    {
      id: 6,
      name: "Sarah Al-Faisal",
      role: "Arabic Poetry Enthusiast",
      quote:
        "Finding a platform that celebrates Arabic poetry alongside other languages is wonderful. Prasang is truly a global literary community.",
      rating: 5,
      avatar: null,
      location: "Riyadh, Saudi Arabia",
      social: {
        twitter: "@sarahalfaisal",
        instagram: "@sarah_poetry",
      },
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) return;

    timerRef.current = setInterval(() => {
      nextTestimonial();
    }, 6000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAutoPlaying, isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevTestimonial();
      } else if (e.key === "ArrowRight") {
        nextTestimonial();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nextTestimonial = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, testimonials.length]);

  const prevTestimonial = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, testimonials.length]);

  const goToTestimonial = useCallback(
    (index) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning, currentIndex],
  );

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

  const getBorderColor = () => {
    switch (themeName) {
      case "forest":
        return "border-green-200 dark:border-green-800";
      case "lavender":
        return "border-purple-200 dark:border-purple-800";
      case "rose":
        return "border-rose-200 dark:border-rose-800";
      case "sepia":
        return "border-amber-200 dark:border-amber-800";
      default:
        return "border-amber-200 dark:border-amber-800";
    }
  };

  const getHoverBg = () => {
    switch (themeName) {
      case "forest":
        return "hover:bg-green-50 dark:hover:bg-green-900/20";
      case "lavender":
        return "hover:bg-purple-50 dark:hover:bg-purple-900/20";
      case "rose":
        return "hover:bg-rose-50 dark:hover:bg-rose-900/20";
      case "sepia":
        return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
      default:
        return "hover:bg-amber-50 dark:hover:bg-amber-900/20";
    }
  };

  const textColor = getTextColor();
  const gradient = getGradient();
  const borderColor = getBorderColor();
  const hoverBg = getHoverBg();

  const testimonial = testimonials[currentIndex];

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" size={16} />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <FaStarHalf key={i} className="text-yellow-400" size={16} />,
        );
      } else {
        stars.push(
          <FaStar
            key={i}
            className="text-gray-300 dark:text-gray-600"
            size={16}
          />,
        );
      }
    }
    return stars;
  };

  // Get user initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div
              className={`p-3 rounded-full bg-gradient-to-r ${gradient} bg-opacity-10`}
            >
              <FaQuoteLeft className={`w-6 h-6 ${textColor}`} />
            </div>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {t("whatReadersSay") || "What Our Readers Say"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            {t("testimonialsDesc") ||
              "Hear from our community of readers, writers, and literature enthusiasts"}
          </p>
        </div>

        {/* Testimonial Card */}
        <div
          className={`relative p-8 rounded-2xl border ${borderColor} bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow`}
        >
          {/* Decorative Quote Icons */}
          <FaQuoteLeft
            className={`absolute top-4 left-4 text-3xl ${textColor} opacity-10`}
          />
          <FaQuoteRight
            className={`absolute bottom-4 right-4 text-3xl ${textColor} opacity-10`}
          />

          {/* Content */}
          <div
            className={`text-center transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
          >
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-4">
              {renderStars(testimonial.rating)}
            </div>

            {/* Quote */}
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 leading-relaxed mb-6 italic">
              "{testimonial.quote}"
            </p>

            {/* Avatar and Name */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-xl shadow-lg`}
              >
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-lg">
                    {getInitials(testimonial.name)}
                  </span>
                )}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.role}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-1">
                  <FaGlobe size={10} />
                  {testimonial.location}
                </p>
              </div>
            </div>

            {/* Social Links */}
            {testimonial.social && (
              <div className="flex justify-center gap-3 mt-3">
                {testimonial.social.twitter && (
                  <a
                    href={`https://twitter.com/${testimonial.social.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-blue-400 transition-colors hover:scale-110 transform`}
                    aria-label="Twitter"
                  >
                    <FaTwitter size={18} />
                  </a>
                )}
                {testimonial.social.instagram && (
                  <a
                    href={`https://instagram.com/${testimonial.social.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-pink-500 transition-colors hover:scale-110 transform`}
                    aria-label="Instagram"
                  >
                    <FaInstagram size={18} />
                  </a>
                )}
                {testimonial.social.facebook && (
                  <a
                    href={`https://facebook.com/${testimonial.social.facebook.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-blue-600 transition-colors hover:scale-110 transform`}
                    aria-label="Facebook"
                  >
                    <FaFacebook size={18} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${hoverBg} border ${borderColor} transition-all hover:shadow-md hover:scale-110`}
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className={textColor} size={18} />
          </button>

          <button
            onClick={nextTestimonial}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${hoverBg} border ${borderColor} transition-all hover:shadow-md hover:scale-110`}
            aria-label="Next testimonial"
          >
            <FaChevronRight className={textColor} size={18} />
          </button>

          {/* Auto-play Toggle */}
          <button
            onClick={toggleAutoPlay}
            className={`absolute top-4 right-4 p-2 rounded-full ${hoverBg} border ${borderColor} transition-all text-xs text-gray-500 dark:text-gray-400`}
            aria-label={isAutoPlaying ? "Pause autoplay" : "Play autoplay"}
          >
            {isAutoPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? `w-8 ${textColor} bg-current`
                  : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="text-center mt-4 text-sm text-gray-400 dark:text-gray-500">
          {currentIndex + 1} / {testimonials.length}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
