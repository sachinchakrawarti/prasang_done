// src/app/(main)/[lang]/(public)/about/page.jsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FaFeather,
  FaBook,
  FaUser,
  FaHeart,
  FaGlobe,
  FaQuoteLeft,
  FaQuoteRight,
  FaStar,
  FaUsers,
  FaRocket,
  FaShieldAlt,
  FaLightbulb,
  FaHandshake,
  FaAward,
  FaPenFancy,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

export default function AboutPage() {
  const params = useParams();
  const lang = params?.lang || "en";
  const { themeName } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("mission");

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

  // Team members data with images
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & Editor-in-Chief",
      bio: "Professor of Comparative Literature with a passion for cross-cultural poetic traditions.",
      avatar: null,
      social: {
        twitter: "@sarahjohnson",
        linkedin: "sarah-johnson",
      },
    },
    {
      name: "Mohammed Al-Rashid",
      role: "Head Translator",
      bio: "Award-winning translator of Arabic poetry into English and other languages.",
      avatar: null,
      social: {
        twitter: "@alrashid",
        linkedin: "mohammed-al-rashid",
      },
    },
    {
      name: "Priya Sharma",
      role: "Senior Editor",
      bio: "Expert in South Asian literature and contemporary poetry.",
      avatar: null,
      social: {
        twitter: "@priyasharma",
        linkedin: "priya-sharma",
      },
    },
    {
      name: "James Morrison",
      role: "Literary Critic",
      bio: "Writes extensively on modern poetry and its cultural impact.",
      avatar: null,
      social: {
        twitter: "@jamesmorrison",
        linkedin: "james-morrison",
      },
    },
  ];

  // Values data with icons
  const values = [
    {
      icon: FaGlobe,
      titleKey: "globalVoices",
      title: "Global Voices",
      descriptionKey: "globalVoicesDesc",
      description:
        "Celebrating poetry and prose from diverse cultures and languages.",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: FaShieldAlt,
      titleKey: "authenticity",
      title: "Authenticity",
      descriptionKey: "authenticityDesc",
      description:
        "Preserving the integrity and original beauty of literary works.",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: FaLightbulb,
      titleKey: "innovation",
      title: "Innovation",
      descriptionKey: "innovationDesc",
      description:
        "Embracing new forms of literary expression and interpretation.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: FaHandshake,
      titleKey: "community",
      title: "Community",
      descriptionKey: "communityDesc",
      description:
        "Building a supportive community of writers, readers, and scholars.",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  // Stats data with translations
  const stats = [
    { value: "10K+", labelKey: "poems", label: "Poems" },
    { value: "500+", labelKey: "poets", label: "Poets" },
    { value: "20+", labelKey: "languages", label: "Languages" },
    { value: "50K+", labelKey: "readers", label: "Readers" },
    { value: "100+", labelKey: "contributors", label: "Contributors" },
    { value: "5+", labelKey: "years", label: "Years" },
  ];

  // Language-specific content
  const getContent = () => {
    switch (lang) {
      case "hi":
        return {
          title: "हमारे बारे में",
          subtitle: "कविता, गद्य और साहित्यिक अभिव्यक्ति का अभयारण्य",
          mission:
            "हमारा मिशन दुनिया भर की विविध आवाज़ों को खोजने, साझा करने और उनका जश्न मनाने के लिए एक मंच प्रदान करना है। हम मानते हैं कि कविता और गद्य में सीमाओं को पार करने और लोगों को गहरे स्तर पर जोड़ने की शक्ति है।",
          vision:
            "एक ऐसी दुनिया की कल्पना करें जहाँ हर आवाज़ सुनी जाती है, हर कहानी को महत्व दिया जाता है, और हर संस्कृति को मनाया जाता है। हम एक ऐसा प्लेटफ़ॉर्म बनाने का प्रयास करते हैं जो साहित्यिक विविधता को बढ़ावा देता है और सार्थक संवाद को प्रोत्साहित करता है।",
        };
      case "ur":
        return {
          title: "ہمارے بارے میں",
          subtitle: "شاعری، نثر اور ادبی اظہار کی پناہ گاہ",
          mission:
            "ہمارا مشن دنیا بھر کی متنوع آوازوں کو دریافت کرنے، شیئر کرنے اور منانے کے لیے ایک پلیٹ فارم فراہم کرنا ہے۔ ہم مانتے ہیں کہ شاعری اور نثر میں حدود کو عبور کرنے اور لوگوں کو گہری سطح پر جوڑنے کی طاقت ہے۔",
          vision:
            "ایسی دنیا کا تصور کریں جہاں ہر آواز سنی جاتی ہے، ہر کہانی کی قدر کی جاتی ہے، اور ہر ثقافت کو منایا جاتا ہے۔ ہم ایسا پلیٹ فارم بنانے کی کوشش کرتے ہیں جو ادبی تنوع کو فروغ دیتا ہے اور بامعنی مکالمے کی حوصلہ افزائی کرتا ہے۔",
        };
      default:
        return {
          title: "About Us",
          subtitle: "A sanctuary for poetry, prose, and literary expression",
          mission:
            "Our mission is to provide a platform for discovering, sharing, and celebrating diverse voices from around the world. We believe that poetry and prose have the power to transcend boundaries and connect people on a deeper level.",
          vision:
            "Imagine a world where every voice is heard, every story is valued, and every culture is celebrated. We strive to create a platform that fosters literary diversity and encourages meaningful dialogue.",
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-full bg-gradient-to-r ${gradient} bg-opacity-10`}
            >
              <FaFeather className={`w-12 h-12 ${textColor}`} />
            </div>
          </div>
          <h1
            className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div
            className={`inline-flex rounded-lg border ${borderColor} p-1 bg-white dark:bg-gray-800`}
          >
            {[
              { id: "mission", label: t("ourMission") || "Mission" },
              { id: "vision", label: t("ourVision") || "Vision" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${gradient} text-white shadow-md`
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mission/Vision Section */}
        <div className="mb-16">
          <div
            className={`p-8 rounded-2xl border ${borderColor} bg-white dark:bg-gray-800 transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-4">
              {activeTab === "mission" ? (
                <FaRocket className={`text-2xl ${textColor}`} />
              ) : (
                <FaQuoteLeft className={`text-2xl ${textColor}`} />
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeTab === "mission"
                  ? t("ourMission") || "Our Mission"
                  : t("ourVision") || "Our Vision"}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              {activeTab === "mission" ? content.mission : content.vision}
            </p>
            {activeTab === "vision" && (
              <div className="mt-4 flex justify-end">
                <FaQuoteRight className={`text-2xl ${textColor} opacity-50`} />
              </div>
            )}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t("ourValues") || "Our Values"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border ${borderColor} bg-white dark:bg-gray-800 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
                >
                  <div className={`flex justify-center mb-3`}>
                    <div
                      className={`p-3 rounded-full ${value.bgColor} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`text-3xl ${value.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t(value.titleKey) || value.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t(value.descriptionKey) || value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div
            className={`p-8 rounded-3xl bg-gradient-to-r ${gradient} bg-opacity-5 border ${borderColor}`}
          >
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              {t("ourImpact") || "Our Impact"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div
                    className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t(stat.labelKey) || stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t("ourTeam") || "Our Team"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border ${borderColor} bg-white dark:bg-gray-800 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div
                  className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-white text-2xl" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className={`text-sm ${textColor} font-medium`}>
                  {member.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {member.bio}
                </p>
                {member.social && (
                  <div className="flex justify-center gap-3 mt-3">
                    {member.social.twitter && (
                      <a
                        href={`https://twitter.com/${member.social.twitter.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        aria-label="Twitter"
                      >
                        <FaTwitter size={16} />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${member.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedin size={16} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          className={`p-8 rounded-3xl bg-gradient-to-r ${gradient} text-white text-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              {t("joinUs") || "Join Our Community"}
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-6 opacity-90">
              {t("joinUsDesc") ||
                "Whether you're a poet, writer, or literature enthusiast, there's a place for you at Prasang."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${lang}/signup`}
                className="px-8 py-3 bg-white text-amber-600 rounded-full font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                {t("signUp") || "Sign Up"}
                <FaArrowRight size={16} />
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-amber-600 transition-all"
              >
                {t("contactUs") || "Contact Us"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
