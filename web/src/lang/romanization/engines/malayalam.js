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
