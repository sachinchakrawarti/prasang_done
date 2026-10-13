const LANG_FOR_SCRIPT = {
  Devanagari: 'hi',
  Arabic:     'ur',
  Bengali:    'bn',
  Tamil:      'ta',
  Telugu:     'te',
  Gurmukhi:   'pa',
  Gujarati:   'gu',
  Kannada:    'kn',
  Malayalam:  'ml',
  Odia:       'or',
  Latin:      'en',
};

export async function fetchTransliteration(text, _fromScript, toScript) {
  const lang = LANG_FOR_SCRIPT[toScript];
  if (!lang) return text;

  const url =
    'https://inputtools.google.com/request' +
    `?text=${encodeURIComponent(text)}` +
    `&itc=${lang}-t-i0-und&num=1&app=test`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`google inputtools ${res.status}`);
  const data = await res.json();
  return data?.[1]?.[0]?.[1]?.[0] ?? text;
}
