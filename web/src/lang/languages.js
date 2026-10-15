export const LANGUAGES = {
  hi: { code:'hi', name:'Hindi',    native:'à¤¹à¤¿à¤¨à¥à¤¦à¥€',   script:'Devanagari', googleLang:'hi', dir:'ltr' },
  ur: { code:'ur', name:'Urdu',     native:'Ø§Ø±Ø¯Ùˆ',      script:'Arabic',     googleLang:'ur', dir:'rtl' },
  ar: { code:'ar', name:'Arabic',   native:'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',   script:'Arabic',     googleLang:'ar', dir:'rtl' },
  fa: { code:'fa', name:'Persian',  native:'ÙØ§Ø±Ø³ÛŒ',     script:'Arabic',     googleLang:'fa', dir:'rtl' },
  ps: { code:'ps', name:'Pashto',   native:'Ù¾ÚšØªÙˆ',     script:'Arabic',     googleLang:'ps', dir:'rtl' },
  bn: { code:'bn', name:'Bengali',  native:'à¦¬à¦¾à¦‚à¦²à¦¾',     script:'Bengali',    googleLang:'bn', dir:'ltr' },
  pa: { code:'pa', name:'Punjabi',  native:'à¨ªà©°à¨œà¨¾à¨¬à©€',    script:'Gurmukhi',   googleLang:'pa', dir:'ltr' },
  gu: { code:'gu', name:'Gujarati', native:'àª—à«àªœàª°àª¾àª¤à«€',   script:'Gujarati',   googleLang:'gu', dir:'ltr' },
  ta: { code:'ta', name:'Tamil',    native:'à®¤à®®à®¿à®´à¯',     script:'Tamil',      googleLang:'ta', dir:'ltr' },
  te: { code:'te', name:'Telugu',   native:'à°¤à±†à°²à±à°—à±',    script:'Telugu',     googleLang:'te', dir:'ltr' },
  kn: { code:'kn', name:'Kannada',  native:'à²•à²¨à³à²¨à²¡',     script:'Kannada',    googleLang:'kn', dir:'ltr' },
  ml: { code:'ml', name:'Malayalam',native:'à´®à´²à´¯à´¾à´³à´‚',    script:'Malayalam',  googleLang:'ml', dir:'ltr' },
  or: { code:'or', name:'Odia',     native:'à¬“à¬¡à¬¼à¬¿à¬†',     script:'Odia',       googleLang:'or', dir:'ltr' },
  en: { code:'en', name:'English',  native:'English',  script:'Latin',      googleLang:'en', dir:'ltr' },
  fr: { code:'fr', name:'French',   native:'FranÃ§ais', script:'Latin',      googleLang:'fr', dir:'ltr' },
  de: { code:'de', name:'German',   native:'Deutsch',  script:'Latin',      googleLang:'de', dir:'ltr' },
  es: { code:'es', name:'Spanish',  native:'EspaÃ±ol',  script:'Latin',      googleLang:'es', dir:'ltr' },
  tr: { code:'tr', name:'Turkish',  native:'TÃ¼rkÃ§e',   script:'Latin',      googleLang:'tr', dir:'ltr' },
  ru: { code:'ru', name:'Russian',  native:'Ð ÑƒÑÑÐºÐ¸Ð¹',  script:'Cyrillic',   googleLang:'ru', dir:'ltr' },
  zh: { code:'zh', name:'Chinese',  native:'ä¸­æ–‡',     script:'Han',        googleLang:'zh', dir:'ltr' },
  ja: { code:'ja', name:'Japanese', native:'æ—¥æœ¬èªž',    script:'Kana',       googleLang:'ja', dir:'ltr' },
  ko: { code:'ko', name:'Korean',   native:'í•œêµ­ì–´',    script:'Hangul',     googleLang:'ko', dir:'ltr' },
};

export const LANGUAGE_CODES = Object.keys(LANGUAGES);
export const SCRIPT_TO_LANGUAGES = Object.values(LANGUAGES).reduce((acc, l) => {
  (acc[l.script] ??= []).push(l);
  return acc;
}, {});
export function getLanguage(code) { return LANGUAGES[code] ?? LANGUAGES.en; }