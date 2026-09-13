// src/utils/romanization/devanagari.js

export const scriptName = "devanagari";
export const langCodes = ["hi", "sa", "mr", "ne"];

// --------------------------------------------------
// Character tables
// --------------------------------------------------

// Independent vowels
const VOWELS = {
  "अ": "a",  "आ": "aa", "इ": "i",  "ई": "ee",
  "उ": "u",  "ऊ": "oo", "ऋ": "ri",
  "ए": "e",  "ऐ": "ai", "ओ": "o",  "औ": "au",
  "ऍ": "e",  "ऑ": "o",  "ऎ": "e",  "ऒ": "o",
};

// Consonants (base form — no inherent vowel yet)
const CONS = {
  "क":"k",  "ख":"kh", "ग":"g",  "घ":"gh", "ङ":"ng",
  "च":"ch", "छ":"chh","ज":"j",  "झ":"jh", "ञ":"ny",
  "ट":"t",  "ठ":"th", "ड":"d",  "ढ":"dh", "ण":"n",
  "त":"t",  "थ":"th", "द":"d",  "ध":"dh", "न":"n",
  "प":"p",  "फ":"ph", "ब":"b",  "भ":"bh", "म":"m",
  "य":"y",  "र":"r",  "ल":"l",  "व":"v",
  "श":"sh", "ष":"sh", "स":"s",  "ह":"h",
  "ळ":"l",  "ऴ":"zh",
  // Nukta consonants
  "क़":"q", "ख़":"kh","ग़":"g", "ज़":"z",
  "ड़":"r", "ढ़":"rh","फ़":"f", "य़":"y",
};

// Vowel signs (matras) — apply after a consonant
const MATRAS = {
  "ा": "aa", "ि": "i",  "ी": "ee",
  "ु": "u",  "ू": "oo", "ृ": "ri",
  "े": "e",  "ै": "ai", "ो": "o",  "ौ": "au",
  "ॅ": "e",  "ॉ": "o",  "ॆ": "e",  "ॊ": "o",
  "ॄ": "ri",
};

// Special marks
const HALANT   = "्";  // virama — kills inherent vowel
const ANUSVARA = "ं";  // anusvara — nasal
const CANDRABINDU = "ँ"; // candrabindu — nasal
const VISARGA  = "ः";  // visarga — h
const NUKTA    = "़";  // nukta — modifies consonant
const AVAGRAHA = "ऽ";  // avagraha — apostrophe-like

// Consonants that commonly form conjuncts with an explicit map
// (skips the intermediate halant processing)
const CONJUNCTS = {
  "क्ष": "ksh",
  "त्र": "tr",
  "ज्ञ": "gy",
  "श्र": "shr",
  "द्य": "dy",
  "द्व": "dv",
  "ह्म": "hm",
  "ह्य": "hy",
  "ह्र": "hr",
  "ह्व": "hv",
  "क्र": "kr",
  "प्र": "pr",
  "ब्र": "br",
  "ग्र": "gr",
  "भ्र": "bhr",
  "म्र": "mr",
  "स्र": "sr",
  "स्व": "sv",
  "स्थ": "sth",
  "स्प": "sp",
  "स्क": "sk",
  "स्न": "sn",
  "स्त": "st",
  "स्त्र": "str",
  "क्ष्म": "kshm",
  "क्ष्ण": "kshn",
  "ष्ट": "sht",
  "ष्ण": "shn",
  "ष्प": "shp",
  "ष्ठ": "shth",
  "ट्ट": "tt",
  "ट्ठ": "tth",
  "ड्ड": "dd",
  "ड्ढ": "ddh",
  "ण्ड": "nd",
  "न्त": "nt",
  "न्द": "nd",
  "म्प": "mp",
  "म्ब": "mb",
  "म्भ": "mbh",
  "ङ्क": "nk",
  "ङ्ग": "ng",
  "ञ्च": "nch",
  "ञ्ज": "nj",
  "त्त": "tt",
  "त्थ": "tth",
  "त्त्व": "ttv",
  "द्ध": "ddh",
  "द्द": "dd",
  "क्त": "kt",
  "क्य": "ky",
  "क्व": "kv",
  "ख्य": "khy",
  "ग्य": "gy",
  "ग्व": "gv",
  "घ्न": "ghn",
  "च्य": "chy",
  "च्छ": "chh",
  "ज्य": "jy",
  "ज्व": "jv",
  "झ्":  "jh",
  "ट्य": "ty",
  "ड्य": "dy",
  "ण्य": "ny",
  "त्य": "ty",
  "त्र्य": "try",
  "थ्य": "thy",
  "द्य": "dy",
  "ध्":  "dh",
  "न्य": "ny",
  "न्व": "nv",
  "प्य": "py",
  "प्ल": "pl",
  "प्र": "pr",
  "फ्":  "ph",
  "ब्य": "by",
  "ब्र": "br",
  "भ्य": "bhy",
  "म्य": "my",
  "म्ल": "ml",
  "य्य": "yy",
  "र्य": "ry",
  "र्र": "rr",
  "ल्य": "ly",
  "ल्ल": "ll",
  "व्य": "vy",
  "व्व": "vv",
  "श्य": "shy",
  "श्व": "shv",
  "श्र": "shr",
  "ष्य": "shy",
  "स्म": "sm",
  "स्य": "sy",
  "ह्य": "hy",
  "ह्र": "hr",
};

// --------------------------------------------------
// Schwa deletion
// --------------------------------------------------
//
// Hindi drops the inherent "a" from a consonant in specific positions:
//   - word-final position (कमल -> kamal, not kamala)
//   - before another vowel-bearing consonant when the vowel is not
//     an inherent "a" ... (this rule is complex and irregular)
//
// We implement a practical heuristic:
//   1) Drop inherent "a" at end of word (very common, safe)
//   2) Drop inherent "a" from the second of two adjacent consonants
//      if the second has no matra (a "dead" consonant cluster)
//   3) Keep "a" if the word is very short (< 3 consonants) to avoid
//      mangling loanwords
//
// This is the best a pure algorithm can do without a dictionary.

function applySchwaDeletion(parts) {
  // `parts` is an array of { type, text, isConsonant, hasMatra, isWordEnd }
  // We process right-to-left, then rebuild.

  const out = parts.slice();

  for (let i = 0; i < out.length; i++) {
    const p = out[i];
    if (p.type !== "consonant") continue;
    if (p.hasMatra) continue;      // matra explicitly added a vowel
    if (p.halant) continue;        // halant kills it anyway

    // Rule 1: word-final consonant — drop inherent 'a'
    const isLast = i === out.length - 1;
    const nextIsPunct = i < out.length - 1 && out[i + 1].type === "punct";
    const nextIsSpace = i < out.length - 1 && out[i + 1].type === "space";
    const isEffectiveWordEnd = isLast || nextIsPunct || nextIsSpace;

    if (isEffectiveWordEnd) {
      p.inherent = "";
      continue;
    }

    // Rule 2: before another consonant cluster, sometimes drop 'a'.
    // In Hindi, this happens in words like "कमल" -> kamal (kept),
    // "पुस्तक" -> pustak (dropped the 'a' in "sta"). We approximate:
    // drop inherent 'a' if the next consonant also lacks a matra.
    const next = out[i + 1];
    if (
      next &&
      next.type === "consonant" &&
      !next.hasMatra &&
      !next.halant
    ) {
      // Some Hindi words do keep the "a" (kamal, kamar). We err on
      // the side of dropping it for compound-heavy words, and keeping
      // it for short words. Word length heuristic:
      const consonantCount = out.filter((x) => x.type === "consonant").length;
      if (consonantCount >= 3) {
        p.inherent = "";
      }
    }
  }

  return out;
}

// --------------------------------------------------
// Tokenizer
// --------------------------------------------------

const isDevanagari = (ch) => /[\u0900-\u097F]/.test(ch);

function tokenize(text) {
  const chars = Array.from(text);
  const tokens = [];
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];

    // Whitespace
    if (/\s/.test(ch)) {
      tokens.push({ type: "space", text: ch });
      i++;
      continue;
    }

    // Punctuation (Latin or Devanagari danda)
    if (/[।॥.,!?;:()\[\]{}'"“”‘’\-–—/\\]/.test(ch)) {
      tokens.push({ type: "punct", text: ch });
      i++;
      continue;
    }

    // Non-Devanagari letters (Latin, digits, etc.)
    if (!isDevanagari(ch)) {
      tokens.push({ type: "other", text: ch });
      i++;
      continue;
    }

    // Independent vowel
    if (VOWELS[ch]) {
      tokens.push({ type: "vowel", text: VOWELS[ch] });
      i++;
      continue;
    }

    // Consonant (possibly with nukta, halant, matra, anusvara)
    if (CONS[ch]) {
      // Check for nukta modifier
      let consChar = ch;
      let next = chars[i + 1];
      if (next === NUKTA) {
        const combined = consChar + NUKTA;
        if (CONS[combined]) {
          consChar = combined;
          i++;
          next = chars[i + 1];
        }
      }

      // Check for multi-char conjunct (only when followed by halant + consonant)
      // Try up to 3-char conjuncts from the current position
      const remaining = chars.slice(i, i + 4).join("");
      let matchedConjunct = null;
      for (let len = 4; len >= 2; len--) {
        const slice = chars.slice(i, i + len).join("");
        if (CONJUNCTS[slice]) {
          matchedConjunct = { text: CONJUNCTS[slice], len };
          break;
        }
      }

      // If we matched a conjunct that ends with a real consonant (not halant),
      // consume it and mark as consonant with no inherent vowel
      if (matchedConjunct) {
        tokens.push({
          type: "consonant",
          text: matchedConjunct.text,
          isConsonant: true,
          hasMatra: false,
          halant: false,
          inherent: "",
        });
        i += matchedConjunct.len;
        continue;
      }

      // Consonant alone — decide what follows
      const baseText = CONS[consChar];
      let hasMatra = false;
      let halant = false;
      let nasal = "";
      let visarga = false;
      let inherent = "a"; // default

      // Look ahead for modifiers
      let j = i + (consChar.length > 1 ? 2 : 1);

      // Halant
      if (chars[j] === HALANT) {
        halant = true;
        inherent = "";
        j++;
      }

      // Matra
      if (!halant && chars[j] && MATRAS[chars[j]]) {
        hasMatra = true;
        inherent = "";
        j++;
      }

      // Anusvara / candrabindu / visarga (can stack up to 2)
      while (chars[j] === ANUSVARA || chars[j] === CANDRABINDU) {
        nasal += "n";
        j++;
      }
      if (chars[j] === VISARGA) {
        visarga = true;
        j++;
      }

      tokens.push({
        type: "consonant",
        text: baseText + (hasMatra ? MATRAS[chars[j - 1]] : "") + nasal,
        isConsonant: true,
        hasMatra,
        halant,
        inherent,
        matraValue: hasMatra ? MATRAS[chars[j - 1]] : "",
        nasal,
        visarga,
      });

      i = j;
      continue;
    }

    // Standalone matra (rare, malformed)
    if (MATRAS[ch]) {
      tokens.push({ type: "vowel", text: MATRAS[ch] });
      i++;
      continue;
    }

    // Anusvara / candrabindu / visarga standalone
    if (ch === ANUSVARA || ch === CANDRABINDU) {
      tokens.push({ type: "other", text: "n" });
      i++;
      continue;
    }
    if (ch === VISARGA) {
      tokens.push({ type: "other", text: "h" });
      i++;
      continue;
    }

    // Avagraha
    if (ch === AVAGRAHA) {
      tokens.push({ type: "other", text: "'" });
      i++;
      continue;
    }

    // Halant alone — skip
    if (ch === HALANT) {
      i++;
      continue;
    }

    // Nukta alone — skip
    if (ch === NUKTA) {
      i++;
      continue;
    }

    // Anything else Devanagari (digits etc.)
    if (/[०-९]/.test(ch)) {
      tokens.push({ type: "other", text: String("०१२३४५६७८९".indexOf(ch)) });
      i++;
      continue;
    }

    tokens.push({ type: "other", text: ch });
    i++;
  }

  return tokens;
}

// --------------------------------------------------
// Assemble
// --------------------------------------------------

function assemble(tokens) {
  // Apply schwa deletion to the consonant tokens
  const processed = applySchwaDeletion(tokens);

  let out = "";
  for (const tok of processed) {
    if (tok.type === "consonant") {
      out += tok.text;
      if (tok.inherent) out += tok.inherent;
      if (tok.visarga) out += "h";
    } else {
      out += tok.text;
    }
  }
  return out;
}

// --------------------------------------------------
// Word overrides
// --------------------------------------------------
//
// Add words here when the algorithm gets them wrong. Keys are the
// raw Devanagari, values are the desired Latin output.
// This takes precedence over the algorithmic transliteration.

export const wordOverrides = {
  // Common short words where the schwa rule misfires
  "कर": "kar",
  "कम": "kam",
  "कल": "kal",
  "घर": "ghar",
  "मन": "man",
  "तन": "tan",
  "धन": "dhan",
  "जन": "jan",
  "वन": "van",
  "बस": "bas",
  "रस": "ras",
  "हस": "has",
  "नल": "nal",
  "मल": "mal",
  "बल": "bal",
  "पल": "pal",
  "फल": "phal",
  "जल": "jal",
  "थल": "thal",
  "दल": "dal",
  "गल": "gal",
  "हल": "hal",

  // Function words
  "का": "ka",  "की": "ki",  "के": "ke",
  "को": "ko",  "से": "se",  "ने": "ne",
  "में": "mein", "पर": "par", "और": "aur",
  "है": "hai", "हैं": "hain", "था": "tha", "थी": "thi", "थे": "the",
  "हो": "ho",  "हूँ": "hoon", "हूं": "hoon",
  "यह": "yeh", "वह": "woh", "ये": "ye", "वे": "ve",
  "मैं": "main", "हम": "hum", "तुम": "tum", "आप": "aap",
  "वो": "wo",  "जो": "jo",  "कि": "ki",  "कि": "ki",
  "ना": "na",  "न": "na",   "नहीं": "nahin",
  "भी": "bhi", "तो": "to",  "ही": "hi",  "कुछ": "kuch",
  "कोई": "koi","सब": "sab", "अब": "ab",  "तब": "tab",
  "जब": "jab", "कब": "kab", "यहाँ": "yahan", "वहाँ": "wahan",

  // Common nouns that show up in poetry
  "जीवन": "jeevan",
  "मरण": "maran",
  "कमल": "kamal",
  "नयन": "nayan",
  "चरण": "charan",
  "वचन": "vachan",
  "मगन": "magan",
  "सजन": "sajan",
  "अगन": "agan",
  "भुवन": "bhuvan",
  "गगन": "gagan",
  "पवन": "pawan",
  "सुमन": "suman",
  "चमन": "chaman",
  "मिलन": "milan",
  "जतन": "jatan",
  "वदन": "vadan",
  "सदन": "sadan",
  "निर्मल": "nirmal",
  "कमल": "kamal",
  "अंचल": "anchal",
  "आँचल": "aanchal",
  "मंगल": "mangal",
  "कंगन": "kangan",
  "बंधन": "bandhan",
  "चंदन": "chandan",
  "वंदन": "vandan",

  // Poet names, common across the poems in this app
  "गुलज़ार": "gulzar",
  "गुलजार": "gulzar",
  "बच्चन": "bachchan",
  "दिनकर": "dinkar",
  "निराला": "nirala",
  "प्रसाद": "prasad",
  "पंत": "pant",
  "महादेवी": "mahadevi",
  "वर्मा": "verma",
  "चतुर्वेदी": "chaturvedi",
  "सूर्यकांत": "suryakant",
  "रामधारी": "ramdhari",
  "जयशंकर": "jaishankar",
  "सुमित्रानंदन": "sumitranandan",
  "हरिवंश": "harivansh",
  "राय": "rai",
  "माखनलाल": "makhanlal",

  // Poetic forms
  "रश्मिरथी": "rashmirathi",
  "मधुशाला": "madhushala",
  "अग्निपथ": "agnipath",
};

// --------------------------------------------------
// Detection
// --------------------------------------------------

export function detect(text) {
  return /[\u0900-\u097F]/.test(text);
}

// --------------------------------------------------
// Public: transliterate
// --------------------------------------------------

export function transliterate(text) {
  if (!text) return "";

  // 1) Word-level overrides
  const withOverrides = text
    .split(/(\s+)/)
    .map((token) => {
      if (/^\s+$/.test(token)) return token;

      // Preserve trailing punctuation
      const m = token.match(/^([\u0900-\u097F]+)(.*)$/);
      if (!m) return token;
      const [, word, tail] = m;
      if (wordOverrides[word] !== undefined) {
        return wordOverrides[word] + tail;
      }
      return token;
    })
    .join("");

  // 2) Tokenize + assemble per "word" (split on whitespace/punct)
  // We tokenize the entire string because the tokenizer already
  // handles spaces and punctuation.
  const tokens = tokenize(withOverrides);
  return assemble(tokens);
}

// --------------------------------------------------
// Export charMap/digraphs shape for compatibility
// (index.js may expect these names — but since we have a custom
//  transliterate(), they're mostly ignored.)
// --------------------------------------------------

export const charMap = CONS;
export const digraphs = [];