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
