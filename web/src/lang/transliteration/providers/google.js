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
