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
