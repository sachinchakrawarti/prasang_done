// src/components/homepages/CTASection.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaRocket,
  FaUserPlus,
  FaBook,
  FaArrowRight,
  FaFeather,
  FaHeart,
  FaUsers,
  FaPenFancy,
  FaGlobe,
  FaCheckCircle,
  FaEnvelope,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

const CTASection = () => {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();

  // State for newsletter
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Features/benefits with translations
  const features = [
    {
      icon: FaFeather,
      titleKey: "shareVoice",
      title: "Share Your Voice",
      descriptionKey: "shareVoiceDesc",
      description: "Publish your poetry and prose to a global audience",
    },
    {
      icon: FaUsers,
      titleKey: "connectCommunity",
      title: "Connect with Community",
      descriptionKey: "connectCommunityDesc",
      description: "Join discussions with fellow literature enthusiasts",
    },
    {
      icon: FaPenFancy,
      titleKey: "discoverWorks",
      title: "Discover New Works",
      descriptionKey: "discoverWorksDesc",
      description: "Explore curated collections from diverse voices",
    },
    {
      icon: FaGlobe,
      titleKey: "multilingualPlatform",
      title: "Multilingual Platform",
      descriptionKey: "multilingualPlatformDesc",
      description: "Read and write in multiple languages",
    },
  ];

  // Stats data with translations
  const stats = [
    { value: "10K+", labelKey: "members", label: "Members" },
    { value: "5K+", labelKey: "poems", label: "Poems" },
    { value: "20+", labelKey: "languages", label: "Languages" },
  ];

  // Trust indicators with translations
  const trustIndicators = [
    {
      icon: FaHeart,
      titleKey: "trustLoved",
      title: "Loved by Readers",
      descKey: "trustLovedDesc",
      description: "Thousands of poetry lovers",
    },
    {
      icon: FaPenFancy,
      titleKey: "trustCurated",
      title: "Curated Content",
      descKey: "trustCuratedDesc",
      description: "Handpicked by experts",
    },
    {
      icon: FaUsers,
      titleKey: "trustCommunity",
      title: "Active Community",
      descKey: "trustCommunityDesc",
      description: "Connect with fellow readers",
    },
    {
      icon: FaGlobe,
      titleKey: "trustGlobal",
      title: "Global Reach",
      descKey: "trustGlobalDesc",
      description: "Readers from 100+ countries",
    },
  ];

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError(t("emailRequired") || "Please enter your email");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError(t("invalidEmail") || "Please enter a valid email");
      return;
    }

    setEmailError("");
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    } catch (error) {
      setEmailError(
        t("subscriptionError") || "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-hide success message
  useEffect(() => {
    if (subscribed) {
      const timer = setTimeout(() => setSubscribed(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [subscribed]);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Main CTA Card */}
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${gradient} shadow-xl`}
        >
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-white rounded-full animate-pulse delay-500"></div>
          </div>

          <div className="relative z-10 p-8 sm:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Content */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4 animate-pulse">
                  <FaRocket className="text-white" size={14} />
                  <span>{t("ctaBadge") || "Join the Community"}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                  {t("ctaTitle") || "Ready to Begin Your Literary Journey?"}
                </h2>
                <p className="text-lg opacity-90 max-w-lg drop-shadow">
                  {t("ctaDescription") ||
                    "Join thousands of poets, writers, and literature lovers who are already part of our growing community."}
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start gap-2 group">
                        <Icon
                          className="text-white mt-1 group-hover:scale-110 transition-transform"
                          size={16}
                        />
                        <div>
                          <h4 className="text-sm font-medium">
                            {t(feature.titleKey) || feature.title}
                          </h4>
                          <p className="text-xs opacity-75">
                            {t(feature.descriptionKey) || feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side - CTA Buttons & Newsletter */}
              <div className="flex flex-col gap-4">
                {/* Join Now Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                  <h3 className="text-xl font-bold mb-2">
                    {t("ctaJoinNow") || "Join Now for Free"}
                  </h3>
                  <p className="text-sm opacity-80 mb-4">
                    {t("ctaJoinDesc") ||
                      "Create your account and start exploring today."}
                  </p>
                  <div className="space-y-3">
                    <Link
                      href={`/${lang}/signup`}
                      className="w-full py-3 px-6 bg-white text-gray-900 rounded-lg font-medium hover:shadow-2xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] group"
                    >
                      <FaUserPlus
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                      />
                      {t("signUp") || "Sign Up Now"}
                    </Link>
                    <Link
                      href={`/${lang}/about`}
                      className="w-full py-3 px-6 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg font-medium hover:bg-white/30 transition-all flex items-center justify-center gap-2 group"
                    >
                      <FaBook size={18} />
                      {t("learnMore") || "Learn More"}
                      <FaArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FaEnvelope size={16} />
                    <h4 className="text-sm font-medium">
                      {t("subscribeNewsletter") || "Subscribe to Newsletter"}
                    </h4>
                  </div>
                  <form
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row gap-2"
                  >
                    <input
                      type="email"
                      placeholder={t("enterEmail") || "Enter your email"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                        isSubmitting
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:scale-[1.02]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin">⟳</span>
                          {t("subscribing") || "Subscribing..."}
                        </>
                      ) : (
                        <>
                          {t("subscribeBtn") || "Subscribe"}
                          <FaArrowRight size={12} />
                        </>
                      )}
                    </button>
                  </form>
                  {emailError && (
                    <p className="text-xs text-red-300 mt-1">{emailError}</p>
                  )}
                  {subscribed && (
                    <p className="text-xs text-green-300 mt-1 flex items-center gap-1">
                      <FaCheckCircle size={12} />
                      {t("subscribedSuccess") || "Subscribed successfully! 🎉"}
                    </p>
                  )}
                  <p className="text-xs opacity-60 mt-2">
                    {t("noSpam") || "No spam. Unsubscribe anytime."}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all"
                    >
                      <div className="text-2xl font-bold drop-shadow">
                        {stat.value}
                      </div>
                      <div className="text-xs opacity-70">
                        {t(stat.labelKey) || stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {trustIndicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div
                key={index}
                className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}
              >
                <div className="flex justify-center mb-2">
                  <div className={`p-2 rounded-full ${hoverBg} ${textColor}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t(indicator.titleKey) || indicator.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t(indicator.descKey) || indicator.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CTASection;
