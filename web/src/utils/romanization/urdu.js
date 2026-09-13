// src/utils/romanization/urdu.js

export const scriptName = "arabic";
export const langCodes = ["ur", "ar", "fa"];

// --------------------------------------------------
// Character tables
// --------------------------------------------------

// Multi-char digraphs applied first (before per-char mapping)
const DIGRAPHS = [
  ["کھ", "kh"], ["گھ", "gh"], ["چھ", "chh"], ["جھ", "jh"],
  ["تھ", "th"], ["دھ", "dh"], ["ٹھ", "th"], ["ڈھ", "dh"],
  ["بھ", "bh"], ["پھ", "ph"], ["رھ", "rh"], ["لھ", "lh"],
  ["نھ", "nh"], ["مھ", "mh"], ["وھ", "wh"], ["یھ", "yh"],
];

// Base character map
const CHAR_MAP = {
  // Alif variants
  "ا": "a",  "آ": "aa", "أ": "a",  "إ": "i",  "ٱ": "a",
  // Consonants
  "ب": "b",  "پ": "p",  "ت": "t",  "ٹ": "t",  "ث": "s",
  "ج": "j",  "چ": "ch", "ح": "h",  "خ": "kh",
  "د": "d",  "ڈ": "d",  "ذ": "z",  "ر": "r",  "ڑ": "r",
  "ز": "z",  "ژ": "zh", "س": "s",  "ش": "sh",
  "ص": "s",  "ض": "z",  "ط": "t",  "ظ": "z",
  "ع": "",   "غ": "gh", "ف": "f",  "ق": "q",
  "ک": "k",  "گ": "g",  "ل": "l",  "م": "m",
  "ن": "n",  "ں": "n",  "و": "o",  "ہ": "h",
  "ھ": "h",  "ء": "",   "ی": "i",  "ے": "e",
  "ۓ": "e",  "ؤ": "o",  "ئ": "i",
  // Harakat (short vowels)
  "َ": "a",  "ِ": "i",  "ُ": "u",
  "ً": "an", "ٍ": "in", "ٌ": "un",
  "ْ": "",   "ّ": "",   "ٰ": "a",
  // Arabic punctuation (mapped to ASCII where sensible)
  "۔": ".",  "،": ",",  "؟": "?",  "؛": ";",
  // Arabic-Indic digits
  "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4",
  "۵":"5","۶":"6","۷":"7","۸":"8","۹":"9",
  // Extended Arabic-Indic digits (Persian/Urdu variants)
  "٠":"0","١":"1","٢":"2","٣":"3","٤":"4",
  "٥":"5","٦":"6","٧":"7","٨":"8","٩":"9",
};

// --------------------------------------------------
// Word-level dictionary
// --------------------------------------------------
//
// Add words here when the algorithm gets them wrong. Keys are the
// raw Urdu (matching the exact Unicode sequence in your DB). Values
// are the desired Latin output.
//
// This takes precedence over everything else.

export const wordOverrides = {
  // Function words
  "کہ":  "ke",
  "نہ":  "na",
  "تو":  "to",
  "ہی":  "hi",
  "بھی": "bhi",
  "کی":  "ki",
  "کا":  "ka",
  "کے":  "ke",
  "کو":  "ko",
  "ہے":  "hai",
  "ہیں": "hain",
  "تھا": "tha",
  "تھی": "thi",
  "تھے": "the",
  "نے":  "ne",
  "سے":  "se",
  "میں":"mein",
  "ہم":  "hum",
  "تم":  "tum",
  "وہ":  "woh",
  "یہ":  "yeh",
  "اور": "aur",
  "پر":  "par",
  "اب":  "ab",
  "بھر":"bhar",
  "کیا": "kya",
  "کیوں":"kyun",
  "کوئی":"koi",
  "کچھ":"kuch",
  "جس":  "jis",
  "اس":  "is",
  "ان":  "in",
  "جن":  "jin",
  "سب":  "sab",
  "کب":  "kab",
  "جب":  "jab",
  "تب":  "tab",
  "یا":  "ya",
  "اگر": "agar",
  "مگر": "magar",
  "لیکن": "lekin",
  "پھر": "phir",
  "بہت": "bahut",
  "کم":  "kam",
  "زیادہ": "zyada",

  // Nouns / proper nouns from seeded poems
  "خدا":  "khuda",
  "خودی": "khudi",
  "رضا":  "raza",
  "پہلے":"pehle",
  "پہلی":"pehli",
  "دل":   "dil",
  "دلِ":  "dil-e",
  "ناداں":"nadaan",
  "تجھے":"tujhe",
  "ہوا":  "hua",
  "آخر":  "aakhir",
  "اس":   "is",
  "درد":  "dard",
  "دوا":  "dawa",
  "مشتاق":"mushtaq",
  "بیزار":"bezaar",
  "یا":   "ya",
  "الٰہی":"ilahi",
  "ماجرا":"maajra",
  "تقدیر":"taqdeer",
  "بندے": "bande",
  "خود":  "khud",
  "پوچھے":"poochhe",
  "بتا":  "bata",
  "تیری":"teri",
  "ہزاروں":"hazaaron",
  "خواہشیں":"khwahishen",
  "ایسی":"aisi",
  "ہر":   "har",
  "خواہش":"khwahish",
  "پہ":   "pe",
  "دم":   "dam",
  "نکلے":"nikle",
  "مرے":  "mere",
  "ارمان":"armaan",
  "لیکن":"lekin",
  "بھی":  "bhi",
  "کم":   "kam",
  "لب":   "lab",
  "آتی":  "aati",
  "دعا":  "dua",
  "بن":   "ban",
  "کے":   "ke",
  "تمنا":"tamanna",
  "میری":"meri",
  "زندگی":"zindagi",
  "شمع":  "shama",
  "صورت":"soorat",
  "ہو":   "ho",
  "خدایا":"khudaya",
  "محبت":"mohabbat",
  "محبوب":"mehboob",
  "مانگ": "maang",
  "مجھ":  "mujh",
  "سمجھا":"samjha",
  "درخشاں":"darakhshan",
  "حیات": "hayaat",
  "بندہ":"banda",
  "بنائے":"banaye",
  "قوم":"qaum",
  "خوب":"khoob",
};

// --------------------------------------------------
// Detection
// --------------------------------------------------

export function detect(text) {
  if (!text || typeof text !== "string") return false;
  // Arabic block + Arabic Supplement (covers Urdu-specific chars)
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

// --------------------------------------------------
// Core transliteration
// --------------------------------------------------

function applyWordOverrides(text) {
  if (!text) return text;
  return text
    .split(/(\s+)/)
    .map((token) => {
      if (/^\s+$/.test(token)) return token;

      // Preserve trailing punctuation
      const m = token.match(/^([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)(.*)$/);
      if (!m) return token;

      const [, word, tail] = m;
      if (wordOverrides[word] !== undefined) {
        return wordOverrides[word] + tail;
      }
      return token;
    })
    .join("");
}

function applyDigraphs(text) {
  let out = text;
  for (const [seq, rep] of DIGRAPHS) {
    out = out.split(seq).join(rep);
  }
  return out;
}

function applyCharMap(text) {
  return text
    .split("")
    .map((ch) => CHAR_MAP[ch] ?? ch)
    .join("");
}

/**
 * Urdu/Arabic/Persian -> Latin.
 */
export function transliterate(text) {
  if (!text || typeof text !== "string") return "";
  let out = text;
  out = applyWordOverrides(out);
  out = applyDigraphs(out);
  out = applyCharMap(out);
  return out;
}

// --------------------------------------------------
// Compatibility exports (used by generic pipeline in index.js
// if a module does NOT export its own transliterate)
// --------------------------------------------------

export const charMap = CHAR_MAP;
export const digraphs = DIGRAPHS;