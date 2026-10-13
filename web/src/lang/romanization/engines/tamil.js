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
