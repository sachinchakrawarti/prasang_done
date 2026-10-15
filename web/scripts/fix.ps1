# ============================================================
#  web/scripts/fix.ps1
#  Writes all romanization + transliteration files,
#  runs smoke tests, opens the test page.
# ============================================================

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $Root 'package.json'))) {
    $Root = (Get-Location).Path
}
Write-Host ""
Write-Host "fix.ps1 running in: $Root" -ForegroundColor Cyan
Write-Host ""

# ------------------------------------------------------------
# helpers
# ------------------------------------------------------------
function New-Dir($path) {
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "  + $(Resolve-Path -Relative $path)/" -ForegroundColor Green
    }
}

function Write-File($rel, $content) {
    $full = Join-Path $Root $rel
    $dir  = Split-Path -Parent $full
    New-Dir $dir
    [System.IO.File]::WriteAllText($full, $content, [System.Text.UTF8Encoding]::new($false))
    Write-Host "  v $rel" -ForegroundColor Green
}

# ------------------------------------------------------------
#  SHARED BRAHMIC HELPER
# ------------------------------------------------------------
Write-File 'src\lang\romanization\engines\_brahmic.js' @'
export function makeBrahmicRomanizer({
  vowels, consonants, matras,
  virama, anusvara, visarga, candrabindu, digits,
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
      if (vowels[c])                        { out.push(vowels[c]); i++; continue; }
      if (anusvara    && c === anusvara)    { out.push('ṁ'); i++; continue; }
      if (candrabindu && c === candrabindu) { out.push('m̐'); i++; continue; }
      if (visarga     && c === visarga)     { out.push('ḥ'); i++; continue; }
      if (virama      && c === virama)      { i++; continue; }
      out.push(c); i++;
    }
    return out.join('');
  };
}
'@

# ------------------------------------------------------------
#  INDIC ENGINES
# ------------------------------------------------------------
Write-File 'src\lang\romanization\engines\devanagari.js' @'
import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'r̥','ए':'ē','ऐ':'ai','ओ':'ō','औ':'au' };
const CONSONANTS = {
  'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ','च':'c','छ':'ch','ज':'j','झ':'jh','ञ':'ñ',
  'ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ','त':'t','थ':'th','द':'d','ध':'dh','न':'n',
  'प':'p','फ':'ph','ब':'b','भ':'bh','म':'m','य':'y','र':'r','ल':'l','व':'v',
  'श':'ś','ष':'ṣ','स':'s','ह':'h','ळ':'ḷ',
  'क़':'q','ख़':'k͟h','ग़':'ġ','ज़':'z','ड़':'ṛ','ढ़':'ṛh','फ़':'f',
};
const MATRAS = { 'ा':'ā','ि':'i','ी':'ī','ु':'u','ू':'ū','ृ':'r̥','े':'ē','ै':'ai','ो':'ō','ौ':'au' };
export const romanizeDevanagari = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '्', anusvara: 'ं', visarga: 'ः', candrabindu: 'ँ',
  digits: { '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9' },
});
'@

Write-File 'src\lang\romanization\engines\bengali.js' @'
import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'অ':'a','আ':'ā','ই':'i','ঈ':'ī','উ':'u','ঊ':'ū','ঋ':'r̥','এ':'ē','ঐ':'ai','ও':'ō','ঔ':'au' };
const CONSONANTS = {
  'ক':'k','খ':'kh','গ':'g','ঘ':'gh','ঙ':'ṅ','চ':'c','ছ':'ch','জ':'j','ঝ':'jh','ঞ':'ñ',
  'ট':'ṭ','ঠ':'ṭh','ড':'ḍ','ঢ':'ḍh','ণ':'ṇ','ত':'t','থ':'th','দ':'d','ধ':'dh','ন':'n',
  'প':'p','ফ':'ph','ব':'b','ভ':'bh','ম':'m','য':'y','র':'r','ল':'l','ৱ':'w','শ':'ś','ষ':'ṣ','স':'s','হ':'h',
};
const MATRAS = { 'া':'ā','ি':'i','ী':'ī','ু':'u','ূ':'ū','ৃ':'r̥','ে':'ē','ৈ':'ai','ো':'ō','ৌ':'au' };
export const romanizeBengali = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '্', anusvara: 'ং', visarga: 'ঃ', candrabindu: 'ঁ',
  digits: { '০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9' },
});
'@

Write-File 'src\lang\romanization\engines\gurmukhi.js' @'
import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'ਅ':'a','ਆ':'ā','ਇ':'i','ਈ':'ī','ਉ':'u','ਊ':'ū','ਏ':'ē','ਐ':'ai','ਓ':'ō','ਔ':'au' };
const CONSONANTS = {
  'ਕ':'k','ਖ':'kh','ਗ':'g','ਘ':'gh','ਙ':'ṅ','ਚ':'c','ਛ':'ch','ਜ':'j','ਝ':'jh','ਞ':'ñ',
  'ਟ':'ṭ','ਠ':'ṭh','ਡ':'ḍ','ਢ':'ḍh','ਣ':'ṇ','ਤ':'t','ਥ':'th','ਦ':'d','ਧ':'dh','ਨ':'n',
  'ਪ':'p','ਫ':'ph','ਬ':'b','ਭ':'bh','ਮ':'m','ਯ':'y','ਰ':'r','ਲ':'l','ਵ':'v','ਸ':'s','ਹ':'h','ੜ':'ṛ',
};
const MATRAS = { 'ਾ':'ā','ਿ':'i','ੀ':'ī','ੁ':'u','ੂ':'ū','ੇ':'ē','ੈ':'ai','ੋ':'ō','ੌ':'au' };
export const romanizeGurmukhi = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '੍', anusvara: 'ਂ', visarga: 'ਃ', candrabindu: null,
  digits: { '੦':'0','੧':'1','੨':'2','੩':'3','੪':'4','੫':'5','੬':'6','੭':'7','੮':'8','੯':'9' },
});
'@

Write-File 'src\lang\romanization\engines\gujarati.js' @'
import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'અ':'a','આ':'ā','ઇ':'i','ઈ':'ī','ઉ':'u','ઊ':'ū','ઋ':'r̥','એ':'ē','ઐ':'ai','ઓ':'ō','ઔ':'au' };
const CONSONANTS = {
  'ક':'k','ખ':'kh','ગ':'g','ઘ':'gh','ઙ':'ṅ','ચ':'c','છ':'ch','જ':'j','ઝ':'jh','ઞ':'ñ',
  'ટ':'ṭ','ઠ':'ṭh','ડ':'ḍ','ઢ':'ḍh','ણ':'ṇ','ત':'t','થ':'th','દ':'d','ધ':'dh','ન':'n',
  'પ':'p','ફ':'ph','બ':'b','ભ':'bh','મ':'m','ય':'y','ર':'r','લ':'l','વ':'v','શ':'ś','ષ':'ṣ','સ':'s','હ':'h','ળ':'ḷ',
};
const MATRAS = { 'ા':'ā','િ':'i','ી':'ī','ુ':'u','ૂ':'ū','ૃ':'r̥','ે':'ē','ૈ':'ai','ો':'ō','ૌ':'au' };
export const romanizeGujarati = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '્', anusvara: 'ં', visarga: 'ઃ', candrabindu: 'ઁ',
  digits: { '૦':'0','૧':'1','૨':'2','૩':'3','૪':'4','૫':'5','૬':'6','૭':'7','૮':'8','૯':'9' },
});
'@

Write-File 'src\lang\romanization\engines\tamil.js' @'
import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'அ':'a','ஆ':'ā','இ':'i','ஈ':'ī','உ':'u','ஊ':'ū','எ':'e','ஏ':'ē','ஐ':'ai','ஒ':'o','ஓ':'ō','ஔ':'au' };
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
'@

Write-File 'src\lang\romanization\engines\telugu.js' @'
import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'అ':'a','ఆ':'ā','ఇ':'i','ఈ':'ī','ఉ':'u','ఊ':'ū','ఋ':'r̥','ఎ':'e','ఏ':'ē','ఐ':'ai','ఒ':'o','ఓ':'ō','ఔ':'au' };
const CONSONANTS = {
  'క':'k','ఖ':'kh','గ':'g','ఘ':'gh','ఙ':'ṅ','చ':'c','ఛ':'ch','జ':'j','ఝ':'jh','ఞ':'ñ',
  'ట':'ṭ','ఠ':'ṭh','డ':'ḍ','ఢ':'ḍh','ణ':'ṇ','త':'t','థ':'th','ద':'d','ధ':'dh','న':'n',
  'ప':'p','ఫ':'ph','బ':'b','భ':'bh','మ':'m','య':'y','ర':'r','ల':'l','వ':'v','శ':'ś','ష':'ṣ','స':'s','హ':'h','ళ':'ḷ',
};
const MATRAS = { 'ా':'ā','ి':'i','ీ':'ī','ు':'u','ూ':'ū','ృ':'r̥','ె':'e','ే':'ē','ై':'ai','ొ':'o','ో':'ō','ౌ':'au' };
export const romanizeTelugu = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '్', anusvara: 'ం', visarga: 'ః', candrabindu: null,
  digits: { '౦':'0','౧':'1','౨':'2','౩':'3','౪':'4','౫':'5','౬':'6','౭':'7','౮':'8','౯':'9' },
});
'@

Write-File 'src\lang\romanization\engines\kannada.js' @'
import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'ಅ':'a','ಆ':'ā','ಇ':'i','ಈ':'ī','ಉ':'u','ಊ':'ū','ಋ':'r̥','ಎ':'e','ಏ':'ē','ಐ':'ai','ಒ':'o','ಓ':'ō','ಔ':'au' };
const CONSONANTS = {
  'ಕ':'k','ಖ':'kh','ಗ':'g','ಘ':'gh','ಙ':'ṅ','ಚ':'c','ಛ':'ch','ಜ':'j','ಝ':'jh','ಞ':'ñ',
  'ಟ':'ṭ','ಠ':'ṭh','ಡ':'ḍ','ಢ':'ḍh','ಣ':'ṇ','ತ':'t','ಥ':'th','ದ':'d','ಧ':'dh','ನ':'n',
  'ಪ':'p','ಫ':'ph','ಬ':'b','ಭ':'bh','ಮ':'m','ಯ':'y','ರ':'r','ಲ':'l','ವ':'v','ಶ':'ś','ಷ':'ṣ','ಸ':'s','ಹ':'h','ಳ':'ḷ',
};
const MATRAS = { 'ಾ':'ā','ಿ':'i','ೀ':'ī','ು':'u','ೂ':'ū','ೃ':'r̥','ೆ':'e','ೇ':'ē','ೈ':'ai','ೊ':'o','ೋ':'ō','ೌ':'au' };
export const romanizeKannada = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '್', anusvara: 'ಂ', visarga: 'ಃ', candrabindu: null,
  digits: { '೦':'0','೧':'1','೨':'2','೩':'3','೪':'4','೫':'5','೬':'6','೭':'7','೮':'8','೯':'9' },
});
'@

Write-File 'src\lang\romanization\engines\malayalam.js' @'
import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'അ':'a','ആ':'ā','ഇ':'i','ഈ':'ī','ഉ':'u','ഊ':'ū','ഋ':'r̥','എ':'e','ഏ':'ē','ഐ':'ai','ഒ':'o','ഓ':'ō','ഔ':'au' };
const CONSONANTS = {
  'ക':'k','ഖ':'kh','ഗ':'g','ഘ':'gh','ങ':'ṅ','ച':'c','ഛ':'ch','ജ':'j','ഝ':'jh','ഞ':'ñ',
  'ട':'ṭ','ഠ':'ṭh','ഡ':'ḍ','ഢ':'ḍh','ണ':'ṇ','ത':'t','ഥ':'th','ദ':'d','ധ':'dh','ന':'n',
  'പ':'p','ഫ':'ph','ബ':'b','ഭ':'bh','മ':'m','യ':'y','ര':'r','ല':'l','വ':'v','ശ':'ś','ഷ':'ṣ','സ':'s','ഹ':'h','ള':'ḷ','ഴ':'ḻ','റ':'ṟ',
};
const MATRAS = { 'ാ':'ā','ി':'i','ീ':'ī','ു':'u','ൂ':'ū','ൃ':'r̥','െ':'e','േ':'ē','ൈ':'ai','ൊ':'o','ോ':'ō','ൌ':'au' };
export const romanizeMalayalam = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '്', anusvara: 'ം', visarga: 'ഃ', candrabindu: null,
  digits: { '൦':'0','൧':'1','൨':'2','൩':'3','൪':'4','൫':'5','൬':'6','൭':'7','൮':'8','൯':'9' },
});
'@

Write-File 'src\lang\romanization\engines\odia.js' @'
import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'ଅ':'a','ଆ':'ā','ଇ':'i','ଈ':'ī','ଉ':'u','ଊ':'ū','ଋ':'r̥','ଏ':'ē','ଐ':'ai','ଓ':'ō','ଔ':'au' };
const CONSONANTS = {
  'କ':'k','ଖ':'kh','ଗ':'g','ଘ':'gh','ଙ':'ṅ','ଚ':'c','ଛ':'ch','ଜ':'j','ଝ':'jh','ଞ':'ñ',
  'ଟ':'ṭ','ଠ':'ṭh','ଡ':'ḍ','ଢ':'ḍh','ଣ':'ṇ','ତ':'t','ଥ':'th','ଦ':'d','ଧ':'dh','ନ':'n',
  'ପ':'p','ଫ':'ph','ବ':'b','ଭ':'bh','ମ':'m','ଯ':'y','ର':'r','ଲ':'l','ଵ':'v','ଶ':'ś','ଷ':'ṣ','ସ':'s','ହ':'h','ଳ':'ḷ',
};
const MATRAS = { 'ା':'ā','ି':'i','ୀ':'ī','ୁ':'u','ୂ':'ū','ୃ':'r̥','େ':'ē','ୈ':'ai','ୋ':'ō','ୌ':'au' };
export const romanizeOdia = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '୍', anusvara: 'ଂ', visarga: 'ଃ', candrabindu: 'ଁ',
  digits: { '୦':'0','୧':'1','୨':'2','୩':'3','୪':'4','୫':'5','୬':'6','୭':'7','୮':'8','୯':'9' },
});
'@

# ------------------------------------------------------------
#  ARABIC FAMILY
# ------------------------------------------------------------
Write-File 'src\lang\romanization\engines\arabic.js' @'
const MAP = {
  'ا':'a','آ':'ā','أ':'a','إ':'i','ٱ':'a','ى':'ā','ئ':'y','ؤ':'w',
  'ب':'b','ت':'t','ث':'th','ج':'j','ح':'ḥ','خ':'kh',
  'د':'d','ذ':'dh','ر':'r','ز':'z',
  'س':'s','ش':'sh','ص':'ṣ','ض':'ḍ','ط':'ṭ','ظ':'ẓ',
  'ع':'ʻ','غ':'gh','ف':'f','ق':'q','ك':'k','ک':'k',
  'ل':'l','م':'m','ن':'n','ه':'h','ہ':'h','ة':'h','ھ':'h',
  'و':'w','ي':'y','ی':'y',
  'پ':'p','چ':'c','ژ':'zh','گ':'g',
  'ٹ':'ṭ','ڈ':'ḍ','ڑ':'ṛ','ں':'ṉ','ے':'e','ۓ':'e',
  'ټ':'ṭ','ډ':'ḍ','ړ':'ṛ','ږ':'ẓ̌','ښ':'ṣ̌','ګ':'g','ڼ':'ṇ','ې':'e','ۍ':'əy',
  '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9',
  '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9',
  '\u0650':'i','\u064E':'a','\u064F':'u','\u0652':'','\u0651':'',
  '\u064B':'an','\u064D':'in','\u064C':'un',
};
export function romanizeArabic(input) {
  return [...input].map((c) => MAP[c] ?? c).join('');
}
'@

# ------------------------------------------------------------
#  CYRILLIC
# ------------------------------------------------------------
Write-File 'src\lang\romanization\engines\cyrillic.js' @'
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
'@

# ------------------------------------------------------------
#  CJK
# ------------------------------------------------------------
Write-File 'src\lang\romanization\engines\han.js' @'
export function romanizeHan(input) { return input; }
'@

Write-File 'src\lang\romanization\engines\kana.js' @'
const MAP = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'o','ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ゃ':'ya','ゅ':'yu','ょ':'yo','っ':'','ー':'-',
  'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
  'カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
  'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so',
  'タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
  'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no',
  'ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
  'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo',
  'ヤ':'ya','ユ':'yu','ヨ':'yo',
  'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro',
  'ワ':'wa','ヲ':'o','ン':'n',
};
export function romanizeKana(input) {
  return [...input].map((c) => MAP[c] ?? c).join('');
}
'@

Write-File 'src\lang\romanization\engines\hangul.js' @'
const CHO = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const JUNG = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const JONG = ['','k','k','k','n','n','n','t','l','k','m','p','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t'];
export function romanizeHangul(input) {
  return [...input].map((c) => {
    const code = c.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return c;
    const cho = Math.floor(code / 588);
    const jung = Math.floor((code % 588) / 28);
    const jong = code % 28;
    return CHO[cho] + JUNG[jung] + JONG[jong];
  }).join('');
}
'@

Write-File 'src\lang\romanization\engines\latin.js' @'
export function romanizeLatin(input) { return input; }
'@

# ------------------------------------------------------------
#  ENGINE REGISTRY
# ------------------------------------------------------------
Write-File 'src\lang\romanization\engines\index.js' @'
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
import { romanizeHan }        from './han.js';
import { romanizeKana }       from './kana.js';
import { romanizeHangul }     from './hangul.js';
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
  Han:        romanizeHan,
  Kana:       romanizeKana,
  Hangul:     romanizeHangul,
  Latin:      romanizeLatin,
};

export const SUPPORTED_SCRIPTS = Object.keys(HANDLERS);

export function romanize(text, script) {
  const fn = HANDLERS[script];
  return fn ? fn(text) : text;
}

const CACHE = new Map();
export function romanizeCached(text, script) {
  const key = `${script}:${text}`;
  if (CACHE.has(key)) return CACHE.get(key);
  const out = romanize(text, script);
  CACHE.set(key, out);
  return out;
}

const DIACRITIC_MAP = {
  'ā':'a','ī':'i','ū':'u','ē':'e','ō':'o','ṛ':'r','ṝ':'r','ḷ':'l','ḹ':'l',
  'ṅ':'n','ñ':'n','ṭ':'t','ḍ':'d','ṇ':'n','ś':'s','ṣ':'s','ḥ':'h','ṁ':'n',
  'Ā':'A','Ī':'I','Ū':'U','Ē':'E','Ō':'O','Ṛ':'R','Ḷ':'L','Ṅ':'N','Ñ':'N',
  'Ṭ':'T','Ḍ':'D','Ṇ':'N','Ś':'S','Ṣ':'S','Ḥ':'H','Ṁ':'M',
  'ġ':'g','ẓ':'z','ż':'z','ẓ̌':'z','ṣ̌':'sh','ə':'a','ʻ':'','ʾ':'',
};
export function toAscii(text) {
  let out = '';
  for (const ch of text) out += DIACRITIC_MAP[ch] ?? ch;
  return out.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const ASCII_CACHE = new Map();
export function romanizeAsciiCached(text, script) {
  const key = `${script}:${text}`;
  if (ASCII_CACHE.has(key)) return ASCII_CACHE.get(key);
  const out = toAscii(romanize(text, script));
  ASCII_CACHE.set(key, out);
  return out;
}
'@

# ------------------------------------------------------------
#  GOOGLE PROVIDER
# ------------------------------------------------------------
Write-File 'src\lang\transliteration\providers\google.js' @'
const LANG_FOR_SCRIPT = {
  Devanagari: 'hi', Bengali: 'bn', Gurmukhi: 'pa', Gujarati: 'gu',
  Tamil: 'ta', Telugu: 'te', Kannada: 'kn', Malayalam: 'ml', Odia: 'or',
  Arabic: 'ur', Cyrillic: 'ru', Han: 'zh', Kana: 'ja', Hangul: 'ko', Latin: 'en',
};

const SUPPORTED_GOOGLE_LANGS = new Set([
  'hi','ur','ar','fa','ps','bn','pa','gu','ta','te','kn','ml','or',
  'en','fr','de','es','tr','ru','ja','ko','zh',
]);

function itcFor(lang) {
  if (lang === 'zh') return 'zh-t-i0-pinyin';
  return `${lang}-t-i0-und`;
}

export async function fetchTransliteration(text, _fromScript, toScript, toLanguage) {
  const lang = toLanguage ?? LANG_FOR_SCRIPT[toScript];
  if (!lang) throw new Error(`no google lang for script ${toScript}`);
  if (!SUPPORTED_GOOGLE_LANGS.has(lang)) throw new Error(`unsupported lang ${lang}`);

  const url =
    'https://inputtools.google.com/request' +
    `?text=${encodeURIComponent(text)}` +
    `&itc=${itcFor(lang)}&num=1&app=test`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`google inputtools ${res.status}`);
  const data = await res.json();
  return data?.[1]?.[0]?.[1]?.[0] ?? text;
}

export { SUPPORTED_GOOGLE_LANGS, LANG_FOR_SCRIPT };
'@

# ------------------------------------------------------------
#  TRANSLIT STORE
# ------------------------------------------------------------
Write-File 'src\lang\transliteration\translitStore.js' @'
import { romanizeAsciiCached } from '../romanization/engines/index.js';
import { fetchTransliteration } from './providers/google.js';

const CACHE_MAX = 500;
const cache    = new Map();
const inflight = new Map();
const state    = { loading: false };
const listeners = new Set();
const emit = () => { for (const l of listeners) l(); };
function setLoading(v) { if (state.loading === v) return; state.loading = v; emit(); }
function cacheSet(key, value) {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, value);
}

export const translitStore = {
  getState: () => state,
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },

 