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
