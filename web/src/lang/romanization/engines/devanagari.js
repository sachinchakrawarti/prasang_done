// Devanagari → ISO 15919 Roman
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
  'श':'ś','ष':'ṣ','स':'s','ह':'h',
  'ळ':'ḷ','क़':'q','ख़':'k͟h','ग़':'ġ','ज़':'z','ड़':'ṛ','ढ़':'ṛh','फ़':'f',
};
const MATRAS = {
  'ा':'ā','ि':'i','ी':'ī','ु':'u','ू':'ū','ृ':'r̥','े':'ē','ै':'ai','ो':'ō','ौ':'au',
};
const DIGITS = { '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9' };

const VIRAMA = '्', ANUSVARA = 'ं', CANDRABINDU = 'ँ', VISARGA = 'ः';

export function romanizeDevanagari(input) {
  const out = [];
  const chars = [...input];
  let i = 0;
  while (i < chars.length) {
    const c = chars[i];

    if (DIGITS[c] !== undefined) { out.push(DIGITS[c]); i++; continue; }

    if (CONSONANTS[c]) {
      let s = CONSONANTS[c];
      const next = chars[i + 1];
      if (next === VIRAMA) { out.push(s); i += 2; continue; }
      if (next && MATRAS[next] !== undefined) { out.push(s + MATRAS[next]); i += 2; continue; }
      out.push(s + 'a'); i++; continue;
    }

    if (VOWELS[c])         { out.push(VOWELS[c]); i++; continue; }
    if (c === ANUSVARA)    { out.push('ṁ'); i++; continue; }
    if (c === CANDRABINDU) { out.push('m̐'); i++; continue; }
    if (c === VISARGA)     { out.push('ḥ'); i++; continue; }
    if (c === VIRAMA)      { i++; continue; }

    out.push(c); i++;
  }
  return out.join('');
}
