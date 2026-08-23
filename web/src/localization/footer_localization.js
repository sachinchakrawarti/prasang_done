// src/localization/footer_localization.js

export const footerLocalization = {
  en: {
    // Brand
    "brandDescription": "A sanctuary for poetry, prose, and literary expression. Discover works from diverse voices across languages and cultures.",
    
    // Quick Links
    "quickLinks": "Quick Links",
    "home": "Home",
    "poems": "Poems",
    "poets": "Poets",
    "poetryForms": "Poetry Forms",
    "about": "About",
    
    // Resources
    "resources": "Resources",
    "writingTips": "Writing Tips",
    "poetryGlossary": "Poetry Glossary",
    "famousPoets": "Famous Poets",
    "contests": "Contests",
    "workshops": "Workshops",
    
    // Contact
    "getInTouch": "Get In Touch",
    "subscribe": "Subscribe",
    "yourEmail": "Your email",
    "subscribeBtn": "Subscribe",
    
    // Bottom Bar
    "allRightsReserved": "All rights reserved",
    "privacy": "Privacy",
    "terms": "Terms",
    "sitemap": "Sitemap",
    "madeWith": "Made with",
    "for": "for",
    "poetryLovers": "Poetry Lovers",
    "languages": "Languages",
    "backToTop": "Back to Top",
  },
  
  hi: {
    // Brand
    "brandDescription": "कविता, गद्य और साहित्यिक अभिव्यक्ति का अभयारण्य। विभिन्न भाषाओं और संस्कृतियों से विविध आवाज़ों की खोज करें।",
    
    // Quick Links
    "quickLinks": "त्वरित लिंक",
    "home": "होम",
    "poems": "कविताएँ",
    "poets": "कवि",
    "poetryForms": "कविता के रूप",
    "about": "हमारे बारे में",
    
    // Resources
    "resources": "संसाधन",
    "writingTips": "लेखन युक्तियाँ",
    "poetryGlossary": "कविता शब्दकोश",
    "famousPoets": "प्रसिद्ध कवि",
    "contests": "प्रतियोगिताएँ",
    "workshops": "कार्यशालाएँ",
    
    // Contact
    "getInTouch": "संपर्क करें",
    "subscribe": "सदस्यता लें",
    "yourEmail": "आपका ईमेल",
    "subscribeBtn": "सदस्यता लें",
    
    // Bottom Bar
    "allRightsReserved": "सभी अधिकार सुरक्षित",
    "privacy": "गोपनीयता",
    "terms": "नियम",
    "sitemap": "साइटमैप",
    "madeWith": "के साथ बनाया गया",
    "for": "के लिए",
    "poetryLovers": "कविता प्रेमी",
    "languages": "भाषाएँ",
    "backToTop": "ऊपर जाएं",
  },
  
  ur: {
    // Brand
    "brandDescription": "شاعری، نثر اور ادبی اظہار کی پناہ گاہ۔ مختلف زبانوں اور ثقافتوں سے متنوع آوازوں کو دریافت کریں۔",
    
    // Quick Links
    "quickLinks": "فوری لنکس",
    "home": "ہوم",
    "poems": "شعری",
    "poets": "شعرا",
    "poetryForms": "شعری اشکال",
    "about": "تعارف",
    
    // Resources
    "resources": "وسائل",
    "writingTips": "تحریر کی تجاویز",
    "poetryGlossary": "شعری لغت",
    "famousPoets": "مشہور شعرا",
    "contests": "مقابلے",
    "workshops": "ورکشاپس",
    
    // Contact
    "getInTouch": "رابطہ کریں",
    "subscribe": "سبسکرائب کریں",
    "yourEmail": "آپ کا ای میل",
    "subscribeBtn": "سبسکرائب کریں",
    
    // Bottom Bar
    "allRightsReserved": "جملہ حقوق محفوظ ہیں",
    "privacy": "رازداری",
    "terms": "شرائط",
    "sitemap": "سائٹ کا نقشہ",
    "madeWith": "کے ساتھ بنایا گیا",
    "for": "کے لیے",
    "poetryLovers": "شعری شوقین",
    "languages": "زبانیں",
    "backToTop": "اوپر جائیں",
  }
};

// Helper function to get translation
export const translateFooter = (text, language) => {
  return footerLocalization[language]?.[text] || footerLocalization.en[text] || text;
};