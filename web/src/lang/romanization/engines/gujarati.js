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
