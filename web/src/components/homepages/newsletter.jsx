// src/components/homepages/Newsletter.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  FaEnvelope,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaBell,
  FaHeart,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

const Newsletter = () => {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-hide success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSubmitted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email) {
      setError(t("emailRequired") || "Please enter your email");
      return;
    }
    if (!validateEmail(email)) {
      setError(t("invalidEmail") || "Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowSuccess(true);
      setSubmitted(true);
      setEmail("");
      setName("");
    } catch (err) {
      setError(
        t("subscriptionError") || "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
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

  // Benefits list with translation keys
  const benefits = [
    {
      icon: FaHeart,
      textKey: "weeklyPoems",
      text: "Weekly curated poems",
    },
    {
      icon: FaUser,
      textKey: "exclusiveContent",
      text: "Exclusive content from featured poets",
    },
    {
      icon: FaBell,
      textKey: "eventUpdates",
      text: "Event and contest updates",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${gradient} shadow-xl`}
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white rounded-full animate-pulse delay-500"></div>
          </div>

          <div className="relative z-10 p-8 sm:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Content */}
              <div>
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4 animate-pulse">
                  <FaEnvelope className="text-3xl" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                  {t("subscribeNewsletter") || "Subscribe to Our Newsletter"}
                </h2>
                <p className="text-lg opacity-90 mb-6">
                  {t("newsletterDesc") ||
                    "Get the latest poems, prose, and literary news delivered to your inbox"}
                </p>

                {/* Benefits */}
                <div className="space-y-2 mb-6">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-sm opacity-90 group"
                      >
                        <Icon
                          className="text-white group-hover:scale-110 transition-transform"
                          size={16}
                        />
                        <span>{t(benefit.textKey) || benefit.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side - Form */}
              <div>
                {submitted && showSuccess ? (
                  // Success State
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center animate-fadeIn">
                    <div className="flex justify-center mb-3">
                      <FaCheckCircle className="text-4xl text-green-300 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">
                      {t("subscribedSuccess") || "You're Subscribed! 🎉"}
                    </h3>
                    <p className="text-sm opacity-90">
                      {t("subscribedDesc") ||
                        "Thank you for subscribing. Check your inbox for confirmation."}
                    </p>
                  </div>
                ) : (
                  // Form
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1 opacity-80">
                        {t("yourName") || "Your Name (Optional)"}
                      </label>
                      <div className="relative">
                        <FaUser
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder={t("enterName") || "Enter your name"}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 opacity-80">
                        {t("emailAddress") || "Email Address"}
                      </label>
                      <div className="relative">
                        <FaEnvelope
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
                          size={16}
                        />
                        <input
                          type="email"
                          placeholder={t("enterEmail") || "Enter your email"}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border ${
                            error ? "border-red-300" : "border-white/30"
                          } text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all`}
                        />
                      </div>
                      {error && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-200 animate-fadeIn">
                          <FaTimesCircle size={12} />
                          <span>{error}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-6 bg-white text-gray-900 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                        isLoading
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:scale-[1.02] hover:shadow-xl"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          {t("subscribing") || "Subscribing..."}
                        </>
                      ) : (
                        <>
                          {t("subscribe") || "Subscribe"}
                          <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center opacity-70 mt-2">
                      {t("noSpam") || "No spam. Unsubscribe anytime."}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
