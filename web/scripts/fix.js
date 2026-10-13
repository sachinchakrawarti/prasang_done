#!/usr/bin/env node
/**
 * web/scripts/fix.js
 * Adds all Indic + Cyrillic romanization engines,
 * updates engines/index.js and providers/google.js,
 * and rewrites translitStore.js to be language-aware.
 *
 *   node scripts/fix.js
 *   node scripts/fix.js --force
 */

const fs   = require('fs');
const path = require('path');

const ROOT  = path.resolve(__dirname, '..');
const FORCE = process.argv.includes('--force');

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
    console.log(`  \x1b[32m+\x1b[0m ${path.relative(ROOT, p)}/`);
  }
}

function write(relPath, content) {
  const full = path.join(ROOT, relPath);
  ensureDir(path.dirname(full));
  if (fs.existsSync(full) && !FORCE) {
    console.log(`  \x1b[33m·\x1b[0m ${relPath} (exists, skipped)`);
    return;
  }
  fs.writeFileSync(full, content.replace(/^\n/, ''), 'utf8');
  console.log(`  \x1b[32m✓\x1b[0m ${relPath}`);
}

const FILES = {

  /* ============================================================
   *  SHARED BRAHMIC HELPER
   * ============================================================ */
  'src/lang/romanization/engines/_brahmic.js': `
// Generic Brahmic romanizer.
// Pass in the Unicode block tables; get back a working romanizer.
export function makeBrahmicRomanizer({
  vowels, consonants, matras,
  virama, anusvara, visarga, candrabindu,
  digits,
}) {
  return function romanize(input) {
    const out = [];
    const chars = [...input];
    let i = 0;

    while (i < chars.length) {
      const c = chars[i];

      if (digits && digits[c] !== undefined) { out.push(digits[c]); i++; continue; }

      if (consonants[c]) {
        let s = consonants[c];
        const next = chars[i + 1];
        if (virama && next === virama) { out.push(s); i += 2; continue; }
        if (next && matras[next] !== undefined) { out.push(s + matras[next]); i += 2; continue; }
        out.push(s + 'a'); i++; continue;
      }

      if (vowels[c])                       { out.push(vowels[c]); i++; continue; }
      if (anusvara    && c === anusvara)   { out.push('ṁ'); i++; continue; }
      if (candrabindu && c === candrabindu){ out.push('m̐'); i++; continue; }
      if (visarga     && c === visarga)    { out.push('ḥ'); i++; continue; }
      if (virama      && c === virama)     { i++; continue; }

      out.push(c); i++;
    }
    return out.join('');
  };
}
`,

  /* ============================================================
   *  INDIC ENGINES
   * ============================================================ */
  'src/lang/romanization/engines/devanagari.js': `
import { makeBrahmicRomanizer } from './_brahmic.js';

const VOWELS = {
  'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'r̥','ए':'ē','ऐ':'ai','ओ':'ō','औ':'au',
};
const CONSONANTS = {
  'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ',
  'च':'c','छ':'ch','ज':'j','झ':'jh','ञ':'ñ',
  'ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ',
  'त':'t','थ':'th','द':'d','ध':'dh','न':'n',
  'प':'p','फ':'ph','ब':'b','भ':'bh','म':'m',
  'य':'y','र':'r','ल':'l','व':'v',
  'श':'ś','ष':'ṣ','स':'s','ह':'h','ळ':'ḷ',
  'क़':'q','ख़':'k͟h','ग़':'ġ','ज़':'z','ड़':'ṛ','ढ़':'ṛh','फ़':'f',
};
const MATRAS = { 'ा':'ā','ि':'i','ी':'ī','ु':'u','ू':'ū','ृ':'r̥','े':'ē','ै':'ai','ो':'ō','ौ':'au' };

export const romanizeDevanagari = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '्', anusvara: 'ं', visarga: 'ः', candrabindu: 'ँ',
  digits: { '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9' },
});
`,

  'src/lang/romanization/engines/bengali.js': `
import { makeBrahmicRomanizer } from './_brahmic.js';

const VOWELS = {
  'অ':'a','আ':'ā','ই':'i','ঈ':'ī','উ':'u','ঊ':'ū','ঋ':'r̥','এ':'ē','ঐ':'ai','ও':'ō','ঔ':'au',
};
const CONSONANTS = {
  'ক':'k','খ':'kh','গ':'g','ঘ':'gh','ঙ':'ṅ',
  'চ':'c','ছ':'ch','জ':'j','ঝ':'jh','ঞ':'ñ',
  'ট':'ṭ','ঠ':'ṭh','ড':'ḍ','ঢ':'ḍh','ণ':'ṇ',
  'ত':'t','থ':'th','দ':'d','ধ':'dh','ন':'n',
  'প':'p','ফ':'ph','ব':'b','ভ':'bh','ম':'m',
  'য':'y','র':'r','ল':'l','ৱ':'w','শ':'ś','ষ':'ṣ','স':'s','হ':'h',
};
const MATRAS = { 'া':'ā','ি':'i','ী':'ī','ু':'u','ূ':'ū','ৃ':'r̥','ে':'ē','ৈ':'ai','ো':'ō','ৌ':'au' };

export const romanizeBengali = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '্', anusvara: 'ং', visarga: 'ঃ', candrabindu: 'ঁ',
  digits: { '০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9' },
});
`,

  'src/lang/romanization/engines/gurmukhi.js': `
import { makeBrahmicRomanizer } from './_brahmic.js';

const VOWELS = {
  'ਅ':'a','ਆ':'ā','ਇ':'i','ਈ':'ī','ਉ':'u','ਊ':'ū','ਏ':'ē','ਐ':'ai','ਓ':'ō','ਔ':'au',
};
const CONSONANTS = {
  'ਕ':'k','ਖ':'kh','ਗ':'g','ਘ':'gh','ਙ':'ṅ',
  'ਚ':'c','ਛ':'ch','ਜ':'j','ਝ':'jh','ਞ':'ñ',
  'ਟ':'ṭ','ਠ':'ṭh','ਡ':'ḍ','ਢ':'ḍh','ਣ':'ṇ',
  'ਤ':'t','ਥ':'th','ਦ':'d','ਧ':'dh','ਨ':'n',
  'ਪ':'p','ਫ':'ph','ਬ':'b','ਭ':'bh','ਮ':'m',
  'ਯ':'y','ਰ':'r','ਲ':'l','ਵ':'v','ਸ':'s','ਹ':'h','ੜ':'ṛ',
};
const MATRAS = { 'ਾ':'ā','ਿ':'i','ੀ':'ī','ੁ':'u','ੂ':'ū','ੇ':'ē','ੈ':'ai','ੋ':'ō','ੌ':'au' };

export const romanizeGurmukhi = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '੍', anusvara: 'ਂ', visarga: 'ਃ', candrabindu: null,
  digits: { '੦':'0','੧':'1','੨':'2','੩':'3','੪':'4','੫':'5','੬':'6','੭':'7','੮':'8','੯':'9' },
});
`,

  'src/lang/romanization/engines/gujarati.js': `
import { makeBrahmicRomanizer } from './_brahmic.js';

const VOWELS = {
  'અ':'a','આ':'ā','ઇ':'i','ઈ':'ī','ઉ':'u','ઊ':'ū','ઋ':'r̥','એ':'ē','ઐ':'ai','ઓ':'ō','ઔ':'au',
};
const CONSONANTS = {
  'ક':'k','ખ':'kh','ગ':'g','ઘ':'gh','ઙ':'ṅ',
  'ચ':'c','છ':'ch','જ':'j','ઝ':'jh','ઞ':'ñ',
  'ટ':'ṭ','ઠ':'ṭh','ડ':'ḍ','ઢ':'ḍh','ણ':'ṇ',
  'ત':'t','થ':'th','દ':'d','ધ':'dh','ન':'n',
  'પ':'p','ફ':'ph','બ':'b','ભ':'bh','મ':'m',
  'ય':'y','ર':'r','લ':'l','વ':'v','શ':'ś','ષ':'ṣ','સ':'s','હ':'h','ળ':'ḷ',
};
const MATRAS = { 'ા':'ā','િ':'i','ી':'ī','ુ':'u','ૂ':'ū','ૃ':'r̥','ે':'ē','ૈ':'ai','ો':'ō','ૌ':'au' };

export const romanizeGujarati = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '્', anusvara: 'ં', visarga: 'ઃ', candrabindu: 'ઁ',
  digits: { '૦':'0','૧':'1','૨':'2','૩':'3','૪':'4','૫':'5','૬':'6','૭':'7','૮':'8','૯':'9' },
});
`,

  'src/lang/romanization/engines/tamil.js': `
import { makeBrahmicRomanizer } from './_brahmic.js';

const VOWELS = {
  'அ':'a','ஆ':'ā','இ':'i','ஈ':'ī','உ':'u','ஊ':'ū','எ':'e','ஏ':'ē','ஐ':'ai','ஒ':'o','ஓ':'ō','ஔ':'au',
};
const CONSONANTS = {
  'க':'k','ங':'ṅ','ச':'c','ஞ':'ñ','ட':'ṭ','ண':'ṇ','த':'t','ந':'n',
  'ப':'p','ம':'m','ய':'y','ர':'r','ல':'l','வ':'v','ழ':'ḻ','ள':'ḷ','ற':'ṟ','ன':'ṉ',
};
const MATRAS = { 'ா':'ā','ி':'i','ீ':'ī','ு':'u','ூ':'ū','ெ':'e','ே':'ē','ை':'ai','ொ':'o','ோ':'ō','ௌ':'au' };

export const romanizeTamil = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '்', anusvara: null, visarga: null, candrabindu: null,
  digits: { '௦':'0','௧':'1','௨':'2','௩':'3','௪':'4','௫':'5','௬':'6','௭':'7','௮':'8','௯':'9' },
});
`,

  'src/lang/romanization/engines/telugu.js': `
import { makeBrahmicRomanizer } from './_brahmic.js';

const VOWELS = {
  'అ':'a','ఆ':'ā','ఇ':'i','ఈ':'ī','ఉ':'u','ఊ':'ū','ఋ':'r̥','ఎ':'e','ఏ':'ē','ఐ':'ai','ఒ':'o','ఓ':'ō','ఔ':'au',
};
const CONSONANTS = {
  'క':'k','ఖ':'kh','గ':'g','ఘ':'gh','ఙ':'ṅ',
  'చ':'c','ఛ':'ch','జ':'j','ఝ':'jh','ఞ':'ñ',
  'ట':'ṭ','ఠ':'ṭh','డ':'ḍ','ఢ':'ḍh','ణ':'ṇ',
  'త':'t','థ':'th','ద':'d','ధ':'dh','న':'n',
  'ప':'p','ఫ':'ph','బ':'b','భ':'bh','మ':'m',
  'య':'y','ర':'r','ల':'l','వ':'v','శ':'ś','ష':'ṣ','స':'s','హ':'h','ళ':'ḷ',
};
const MATRAS = { 'ా':'ā','ి':'i','ీ':'ī','ు':'u','ూ':'ū','ృ':'r̥','ె':'e','ే':'ē','ై':'ai','ొ':'o','ో':'ō','ౌ':'au' };

export const romanizeTelugu = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '్', anusvara: 'ం', visarga: 'ః', candrabindu: null,
  digits: { '౦':'0','౧':'1','౨':'2','౩':'3','౪':'4','౫':'5','౬':'6','౭':'7','౮':'8','౯':'9' },
});
`,

  'src/lang/romanization/engines/kannada.js': `
import { makeBrahmicRomanizer } from './_brahmic.js';

const VOWELS = {
  'ಅ':'a','ಆ':'ā','ಇ':'i','ಈ':'ī','ಉ':'u','ಊ':'ū','ಋ':'r̥','ಎ':'e','ಏ':'ē','ಐ':'ai','ಒ':'o','ಓ':'ō','ಔ':'au',
};
const CONSONANTS = {
  'ಕ':'k','ಖ':'kh','ಗ':'g','ಘ':'gh','ಙ':'ṅ',
  'ಚ':'c','ಛ':'ch','ಜ':'j','ಝ':'jh','ಞ':'ñ',
  'ಟ':'ṭ','ಠ':'ṭh','ಡ':'ḍ','ಢ':'ḍh','ಣ':'ṇ',
  'ತ':'t','ಥ':'th','ದ':'d','ಧ':'dh','ನ':'n',
  'ಪ':'p','ಫ':'ph','ಬ':'b','ಭ':'bh','ಮ':'m',
  'ಯ':'y','ರ':'r','ಲ':'l','ವ':'v','ಶ':'ś','ಷ':'ṣ','ಸ':'s','ಹ':'h','ಳ':'ḷ',
};
const MATRAS = { 'ಾ':'ā','ಿ':'i','ೀ':'ī','ು':'u','ೂ':'ū','ೃ':'r̥','ೆ':'e','ೇ':'ē','ೈ':'ai','ೊ':'o','ೋ':'ō','ೌ':'au' };

export const romanizeKannada = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '್', anusvara: 'ಂ', visarga: 'ಃ', candrabindu: null,
  digits: { '೦':'0','೧':'1','೨':'2','೩':'3','೪':'4','೫':'5','೬':'6','೭':'7','೮':'8','೯':'9' },
});
`,

  'src/lang/romanization/engines/malayalam.js': `
import { makeBrahmicRomanizer } from './_brahmic.js';

const VOWELS = {
  'അ':'a','ആ':'ā','ഇ':'i','ഈ':'ī','ഉ':'u','ഊ':'ū','ഋ':'r̥','എ':'e','ഏ':'ē','ഐ':'ai','ഒ':'o','ഓ':'ō','ഔ':'au',
};
const CONSONANTS = {
  'ക':'k','ഖ':'kh','ഗ':'g','ഘ':'gh','ങ':'ṅ',
  'ച':'c','ഛ':'ch','ജ':'j','ഝ':'jh','ഞ':'ñ',
  'ട':'ṭ','ഠ':'ṭh','ഡ':'ḍ','ഢ':'ḍh','ണ':'ṇ',
  'ത':'t','ഥ':'th','ദ':'d','ധ':'dh','ന':'n',
  'പ':'p','ഫ':'ph','ബ':'b','ഭ':'bh','മ':'m',
  'യ':'y','ര':'r','ല':'l','വ':'v','ശ':'ś','ഷ':'ṣ','സ':'s','ഹ':'h','ള':'ḷ','ഴ':'ḻ','റ':'ṟ',
};
const MATRAS = { 'ാ':'ā','ി':'i','ീ':'ī','ു':'u','ൂ':'ū','ൃ':'r̥','െ':'e','േ':'ē','ൈ':'ai','ൊ':'o','ോ':'ō','ൌ':'au' };

export const romanizeMalayalam = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '്', anusvara: 'ം', visarga: 'ഃ', candrabindu: null,
  digits: { '൦':'0','൧':'1','൨':'2','൩':'3','൪':'4','൫':'5','൬':'6','൭':'7','൮':'8','൯':'9' },
});
`,

  'src/lang/romanization/engines/odia.js': `
import { makeBrahmicRomanizer } from './_brahmic.js';

const VOWELS = {
  'ଅ':'a','ଆ':'ā','ଇ':'i','ଈ':'ī','ଉ':'u','ଊ':'ū','ଋ':'r̥','ଏ':'ē','ଐ':'ai','ଓ':'ō','ଔ':'au',
};
const CONSONANTS = {
  'କ':'k','ଖ':'kh','ଗ':'g','ଘ':'gh','ଙ':'ṅ',
  'ଚ':'c','ଛ':'ch','ଜ':'j','ଝ':'jh','ଞ':'ñ',
  'ଟ':'ṭ','ଠ':'ṭh','ଡ':'ḍ','ଢ':'ḍh','ଣ':'ṇ',
  'ତ':'t','ଥ':'th','ଦ':'d','ଧ':'dh','ନ':'n',
  'ପ':'p','ଫ':'ph','ବ':'b','ଭ':'bh','ମ':'m',
  'ଯ':'y','ର':'r','ଲ':'l','ଵ':'v','ଶ':'ś','ଷ':'ṣ','ସ':'s','ହ':'h','ଳ':'ḷ',
};
const MATRAS = { 'ା':'ā','ି':'i','ୀ':'ī','ୁ':'u','ୂ':'ū','ୃ':'r̥','େ':'ē','ୈ':'ai','ୋ':'ō','ୌ':'au' };

export const romanizeOdia = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '୍', anusvara: 'ଂ', visarga: 'ଃ', candrabindu: 'ଁ',
  digits: { '୦':'0','୧':'1','୨':'2','୩':'3','୪':'4','୫':'5','୬':'6','୭':'7','୮':'8','୯':'9' },
});
`,

  /* ============================================================
   *  ARABIC-FAMILY ENGINE (Urdu, Arabic, Persian, Pashto)
   * ============================================================ */
  'src/lang/romanization/engines/arabic.js': `
// Arabic-script romanizer.
// Union of Urdu, Arabic, Persian, Pashto letters — a superset.
// Accuracy per-dialect is imperfect, but the pipeline is uniform.
const MAP = {
  // core Arabic
  'ا':'a','آ':'ā','أ':'a','إ':'i','ٱ':'a',
  'ب':'b','ت':'t','ث':'th',
  'ج':'j','ح':'ḥ','خ':'kh',
  'د':'d','ذ':'dh',
  'ر':'r','ز':'z',
  'س':'s','ش':'sh','ص':'ṣ','ض':'ḍ','ط':'ṭ','ظ':'ẓ',
  'ع':'ʻ','غ':'gh',
  'ف':'f','ق':'q','ك':'k','ک':'k',
  'ل':'l','م':'m','ن':'n',
  'ه':'h','ہ':'h','ة':'h','ھ':'h',
  'و':'w','ؤ':'w',
  'ي':'y','ی':'y','ى':'ā','ئ':'y',
  // Urdu/Persian additions
  'پ':'p','چ':'c','ژ':'zh','گ':'g',
  'ٹ':'ṭ','ڈ':'ḍ','ڑ':'ṛ',
  'ں':'ṉ','ے':'e','ۓ':'e',
  // Persian
  'خ':'kh','ذ':'dh','ض':'ż','ظ':'ẓ','غ':'gh',
  // Pashto additions
  'ټ':'ṭ','ډ':'ḍ','ړ':'ṛ','ږ':'ẓ̌','ښ':'ṣ̌','ګ':'g','ڼ':'ṇ','ې':'e','ۍ':'əy',
  // Arabic digits
  '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9',
  '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9',
  // diacritics (lowercase → short vowels)
  '\\u0650':'i','\\u064E':'a','\\u064F':'u','\\u0652':'','\\u0651':'',
  '\\u064B':'an','\\u064D':'in','\\u064C':'un',
};

export function romanizeArabic(input) {
  return [...input].map((c) => MAP[c] ?? c).join('');
}
`,

  /* ============================================================
   *  CYRILLIC ENGINE (Russian)
   * ============================================================ */
  'src/lang/romanization/engines/cyrillic.js': `
const MAP = {
  'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh','З':'Z',
  'И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R',
  'С':'S','Т':'T','У':'U','Ф':'F','Х':'Kh','Ц':'Ts','Ч':'Ch','Ш':'Sh',
  'Щ':'Shch','Ъ':'"','Ы':'Y','Ь':"'",'Э':'E','Ю':'Yu','Я':'Ya',
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z',
  'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r',
  'с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh',
  'щ':'shch','ъ':'"','ы':'y','ь':"'",'э':'e','ю':'yu','я':'ya',
};

export function romanizeCyrillic(input) {
  return [...input].map((c) => MAP[c] ?? c).join('');
}
`,

  /* ============================================================
   *  LATIN ENGINE (English, French, German, Spanish, Turkish)
   * ============================================================ */
  'src/lang/romanization/engines/latin.js': `
// Latin-script languages are already Roman. Passthrough.
export function romanizeLatin(input) { return input; }
`,

  /* ============================================================
   *  ENGINE REGISTRY
   * ============================================================ */
  'src/lang/romanization/engines/index.js': `
import { romanizeDevanagari } from './devanagari.js';
import { romanizeBengali }    from './bengali.js';
import { romanizeGurmukhi }   from './gurmukhi.js';
import { romanizeGujarati }   from './gujarati.js';
import { romanizeTamil }      from './tamil.js';
import { romanizeTelugu }     from './telugu.js';
import { romanizeKannada }    from './kannada.js';
import { romanizeMalayalam }  from './malayalam.js';
import { romanizeOdia }       from './odia.js';
import { romanizeArabic }     from './arabic.js';
import { romanizeCyrillic }   from './cyrillic.js';
import { romanizeLatin }      from './latin.js';

const HANDLERS = {
  Devanagari: romanizeDevanagari,
  Bengali:    romanizeBengali,
  Gurmukhi:   romanizeGurmukhi,
  Gujarati:   romanizeGujarati,
  Tamil:      romanizeTamil,
  Telugu:     romanizeTelugu,
  Kannada:    romanizeKannada,
  Malayalam:  romanizeMalayalam,
  Odia:       romanizeOdia,
  Arabic:     romanizeArabic,
  Cyrillic:   romanizeCyrillic,
  Latin:      romanizeLatin,
};

export const SUPPORTED_SCRIPTS = Object.keys(HANDLERS);

export function romanize(text, script) {
  const fn = HANDLERS[script];
  return fn ? fn(text) : text;
}

const CACHE = new Map();
export function romanizeCached(text, script) {
  const key = \`\${script}:\${text}\`;
  if (CACHE.has(key)) return CACHE.get(key);
  const out = romanize(text, script);
  CACHE.set(key, out);
  return out;
}

/* ---------- ASCII pivot for transliteration ---------- */
const DIACRITIC_MAP = {
  'ā':'a','ī':'i','ū':'u','ē':'e','ō':'o','ṛ':'r','ṝ':'r','ḷ':'l','ḹ':'l',
  'ṅ':'n','ñ':'n','ṭ':'t','ḍ':'d','ṇ':'n','ś':'s','ṣ':'s','ḥ':'h','ṁ':'n',
  'Ā':'A','Ī':'I','Ū':'U','Ē':'E','Ō':'O','Ṛ':'R','Ḷ':'L','Ṅ':'N','Ñ':'N',
  'Ṭ':'T','Ḍ':'D','Ṇ':'N','Ś':'S','Ṣ':'S','Ḥ':'H','Ṁ':'M',
  'ġ':'g','ẓ':'z','ż':'z','ẓ̌':'z','ṣ̌':'sh','ə':'a',
  'ʾ':'','ʻ':'','k͟h':'kh',
};

export function toAscii(text) {
  let out = '';
  for (const ch of text) out += DIACRITIC_MAP[ch] ?? ch;
  return out.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
}

const ASCII_CACHE = new Map();
export function romanizeAsciiCached(text, script) {
  const key = \`\${script}:\${text}\`;
  if (ASCII_CACHE.has(key)) return ASCII_CACHE.get(key);
  const out = toAscii(romanize(text, script));
  ASCII_CACHE.set(key, out);
  return out;
}
`,

  /* ============================================================
   *  SCRIPT → GOOGLE LANGUAGE CODE (fallback)
   *  Used when the caller doesn't pass toLanguage explicitly.
   * ============================================================ */
  'src/lang/transliteration/providers/google.js': `
// Fallback mapping: script → Google Input Tools language code.
// Prefer the caller's toLanguage when available.
const LANG_FOR_SCRIPT = {
  Devanagari: 'hi',
  Bengali:    'bn',
  Gurmukhi:   'pa',
  Gujarati:   'gu',
  Tamil:      'ta',
  Telugu:     'te',
  Kannada:    'kn',
  Malayalam:  'ml',
  Odia:       'or',
  Arabic:     'ur',        // default; caller should override with 'fa', 'ps', 'ar'
  Cyrillic:   'ru',
  Latin:      'en',
};

// Google Input Tools language codes we support.
// 'zh' uses pinyin mode (special: itc=zh-t-i0-pinyin).
const SUPPORTED_GOOGLE_LANGS = new Set([
  'hi','ur','ar','fa','ps','bn','pa','gu','ta','te','kn','ml','or',
  'en','fr','de','es','tr','ru','ja','ko',
]);

function itcFor(lang) {
  if (lang === 'zh') return 'zh-t-i0-pinyin';
  return \`\${lang}-t-i0-und\`;
}

export async function fetchTransliteration(text, _fromScript, toScript, toLanguage) {
  const lang = toLanguage ?? LANG_FOR_SCRIPT[toScript];
  if (!lang) throw new Error(\`no google lang for script \${toScript}\`);
  if (!SUPPORTED_GOOGLE_LANGS.has(lang)) {
    throw new Error(\`google input tools does not support lang=\${lang}\`);
  }

  const url =
    'https://inputtools.google.com/request' +
    \`?text=\${encodeURIComponent(text)}\` +
    \`&itc=\${itcFor(lang)}&num=1&app=test\`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(\`google inputtools \${res.status}\`);
  const data = await res.json();
  return data?.[1]?.[0]?.[1]?.[0] ?? text;
}

export { SUPPORTED_GOOGLE_LANGS, LANG_FOR_SCRIPT };
`,

  /* ============================================================
   *  TRANSLITERATION STORE (language-aware)
   * ============================================================ */
  'src/lang/transliteration/translitStore.js': `
import { romanizeAsciiCached } from '../romanization/engines/index.js';
import { fetchTransliteration } from './providers/google.js';

const CACHE_MAX = 500;
const cache    = new Map();
const inflight = new Map();

const state = { loading: false };
const listeners = new Set();
const emit = () => { for (const l of listeners) l(); };

function setLoading(v) {
  if (state.loading === v) return;
  state.loading = v;
  emit();
}
function cacheSet(key, value) {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, value);
}

export const translitStore = {
  getState: () => state,
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },

  /**
   * transliterate(text, fromScript, toScript, toLanguage?)
   *
   * toLanguage is optional. If provided, it overrides the script-based
   * language guess — this matters for Arabic-script languages
   * (Urdu 'ur' vs Persian 'fa' vs Pashto 'ps' vs Arabic 'ar').
   */
  async transliterate(text, fromScript, toScript, toLanguage) {
    if (!text) return '';
    if (fromScript === toScript && !toLanguage) return text;

    const key = \`\${fromScript}>\${toScript}@\${toLanguage ?? ''}:\${text}\`;
    if (cache.has(key))    return cache.get(key);
    if (inflight.has(key)) return inflight.get(key);

    setLoading(true);

    const promise = (async () => {
      // Latin is already the pivot — send straight to Google.
      const pivot = fromScript === 'Latin'
        ? text
        : romanizeAsciiCached(text, fromScript);

      const out = await fetchTransliteration(pivot, 'Latin', toScript, toLanguage);
      cacheSet(key, out);
      return out;
    })()
      .catch((err) => {
        console.warn('[translit]', err.message);
        return text;
      })
      .finally(() => {
        inflight.delete(key);
        if (inflight.size === 0) setLoading(false);
      });

    inflight.set(key, promise);
    return promise;
  },

  clearCache() { cache.clear(); inflight.clear(); },
};
`,

  /* ============================================================
   *  BARRELS
   * ============================================================ */
  'src/lang/romanization/index.js': `
export { romanize, romanizeCached, romanizeAsciiCached, toAscii, SUPPORTED_SCRIPTS } from './engines/index.js';
`,

  'src/lang/transliteration/index.js': `
export { translitStore } from './translitStore.js';
export { SUPPORTED_GOOGLE_LANGS, LANG_FOR_SCRIPT } from './providers/google.js';
`,

  'src/lang/index.js': `
export * from './romanization/index.js';
export * from './transliteration/index.js';
`,

  /* ============================================================
   *  LANGUAGE REGISTRY
   * ============================================================ */
  'src/lang/languages.js': `
// Master registry: every language the platform supports.
// script      = Unicode script family (drives romanization engine)
// googleLang  = Google Input Tools language code (drives transliteration)
// dir         = text direction
// native      = name in the language itself

export const LANGUAGES = {
  hi: { code:'hi', name:'Hindi',    native:'हिन्दी',   script:'Devanagari', googleLang:'hi', dir:'ltr' },
  ur: { code:'ur', name:'Urdu',     native:'اردو',      script:'Arabic',     googleLang:'ur', dir:'rtl' },
  ar: { code:'ar', name:'Arabic',   native:'العربية',   script:'Arabic',     googleLang:'ar', dir:'rtl' },
  fa: { code:'fa', name:'Persian',  native:'فارسی',     script:'Arabic',     googleLang:'fa', dir:'rtl' },
  ps: { code:'ps', name:'Pashto',   native:'پښتو',     script:'Arabic',     googleLang:'ps', dir:'rtl' },
  bn: { code:'bn', name:'Bengali',  native:'বাংলা',     script:'Bengali',    googleLang:'bn', dir:'ltr' },
  pa: { code:'pa', name:'Punjabi',  native:'ਪੰਜਾਬੀ',    script:'Gurmukhi',   googleLang:'pa', dir:'ltr' },
  gu: { code:'gu', name:'Gujarati', native:'ગુજરાતી',   script:'Gujarati',   googleLang:'gu', dir:'ltr' },
  ta: { code:'ta', name:'Tamil',    native:'தமிழ்',     script:'Tamil',      googleLang:'ta', dir:'ltr' },
  te: { code:'te', name:'Telugu',   native:'తెలుగు',    script:'Telugu',     googleLang:'te', dir:'ltr' },
  kn: { code:'kn', name:'Kannada',  native:'ಕನ್ನಡ',     script:'Kannada',    googleLang:'kn', dir:'ltr' },
  ml: { code:'ml', name:'Malayalam',native:'മലയാളം',    script:'Malayalam',  googleLang:'ml', dir:'ltr' },
  or: { code:'or', name:'Odia',     native:'ଓଡ଼ିଆ',     script:'Odia',       googleLang:'or', dir:'ltr' },
  en: { code:'en', name:'English',  native:'English',  script:'Latin',      googleLang:'en', dir:'ltr' },
  fr: { code:'fr', name:'French',   native:'Français', script:'Latin',      googleLang:'fr', dir:'ltr' },
  de: { code:'de', name:'German',   native:'Deutsch',  script:'Latin',      googleLang:'de', dir:'ltr' },
  es: { code:'es', name:'Spanish',  native:'Español',  script:'Latin',      googleLang:'es', dir:'ltr' },
  tr: { code:'tr', name:'Turkish',  native:'Türkçe',   script:'Latin',      googleLang:'tr', dir:'ltr' },
  ru: { code:'ru', name:'Russian',  native:'Русский',  script:'Cyrillic',   googleLang:'ru', dir:'ltr' },
  zh: { code:'zh', name:'Chinese',  native:'中文',     script:'Han',        googleLang:'zh', dir:'ltr' },
  ja: { code:'ja', name:'Japanese', native:'日本語',    script:'Kana',       googleLang:'ja', dir:'ltr' },
  ko: { code:'ko', name:'Korean',   native:'한국어',    script:'Hangul',     googleLang:'ko', dir:'ltr' },
};

export const LANGUAGE_CODES = Object.keys(LANGUAGES);

export function getLanguage(code) {
  return LANGUAGES[code] ?? LANGUAGES.en;
}
`,

};

console.log(`\n\x1b[36mRunning fix.js in ${ROOT}\x1b[0m\n`);

for (const [rel, content] of Object.entries(FILES)) write(rel, content);

console.log(`\n\x1b[32mDone.\x1b[0m\n`);
console.log('Structure written:');
console.log(`
  web/src/lang/
  ├── index.js
  ├── languages.js
  ├── romanization/
  │   ├── index.js
  │   ├── scriptStore.js              (unchanged)
  │   └── engines/
  │       ├── _brahmic.js
  │       ├── index.js
  │       ├── devanagari.js
  │       ├── bengali.js
  │       ├── gurmukhi.js
  │       ├── gujarati.js
  │       ├── tamil.js
  │       ├── telugu.js
  │       ├── kannada.js
  │       ├── malayalam.js
  │       ├── odia.js
  │       ├── arabic.js
  │       ├── cyrillic.js
  │       └── latin.js
  └── transliteration/
      ├── index.js
      ├── translitStore.js
      └── providers/
          └── google.js
`);

console.log(`\x1b[36mNext:\x1b[0m test the pipeline

  import { romanizeCached, romanizeAsciiCached, SUPPORTED_SCRIPTS } from '@/lang/romanization';
  import { translitStore } from '@/lang/transliteration';
  import { LANGUAGES } from '@/lang/languages';

  console.log(SUPPORTED_SCRIPTS);
  // ["Devanagari","Bengali","Gurmukhi","Gujarati","Tamil","Telugu",
  //  "Kannada","Malayalam","Odia","Arabic","Cyrillic","Latin"]

  const out = await translitStore.transliterate('नमस्ते', 'Devanagari', 'Arabic', 'ur');
  // نمستے
`);