// src/app/(main)/[lang]/page.js
"use client";

import { useParams } from "next/navigation";
import { useTheme } from "@/themes/ThemeContext";
import { useTranslation } from "@/hooks/useLoalization";

// Import all homepage components
import HeroSlider from "@/components/homepages/heroslider";
import ExplorePoems from "@/components/homepages/exploerpoems";
import ExplorePoets from "@/components/homepages/exploerpoets";
import FeaturedContributors from "@/components/homepages/featuredcontributors";
import LiteraryCategories from "@/components/homepages/literarycategories";
import Testimonials from "@/components/homepages/testimonials";
import Newsletter from "@/components/homepages/newsletter";
import CTASection from "@/components/homepages/ctasection";


export default function HomePage() {
  const params = useParams();
  const lang = params?.lang || 'en';
  const { themeName } = useTheme();
  const { t } = useTranslation();

  // Theme-aware styles for the page wrapper
  const getGradient = () => {
    switch (themeName) {
      case "forest": return "from-green-600 to-emerald-500";
      case "lavender": return "from-purple-600 to-pink-500";
      case "rose": return "from-rose-600 to-pink-500";
      case "sepia": return "from-amber-700 to-yellow-600";
      default: return "from-amber-600 to-yellow-500";
    }
  };

  const gradient = getGradient();

  return (
    <div className="min-h-screen">
      {/* Hero Slider - Full width */}
      <HeroSlider />

      {/* Explore Poems Section */}
      <ExplorePoems />

      {/* Literary Categories Section */}
      <LiteraryCategories />

      {/* Explore Poets Section */}
      <ExplorePoets />

      {/* Featured Contributors Section */}
      <FeaturedContributors />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Call to Action Section */}
      <CTASection />

      {/* Decorative Footer Note */}
      <div className="text-center py-6 px-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("footerNote") || "Made with ❤️ for poetry and literature lovers around the world"}
        </p>
        <div className="flex justify-center gap-2 mt-2">
          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`}></span>
          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`}></span>
          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`}></span>
          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`}></span>
          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`}></span>
        </div>
      </div>
    </div>
  );
}