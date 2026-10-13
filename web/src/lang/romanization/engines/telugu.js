import { makeBrahmicRomanizer } from './_brahmic.js';

const VOWELS = {
  'అ':'a','ఆ':'ā','ఇ':'i','ఈ':'ī','ఉ':'u','ఊ':'ū','ఋ':'r̥','ఎ':'e','ఏ':'ē','ఐ':'ai','ఒ':'o','ఓ':'ō','ఔ':'au',
};
const CONSONANTS = {
  'క':'k','ఖ':'kh','గ':'g','ఘ':'gh','ఙ':'ṅ',
  'చ':'c','ఛ':'ch','జ':'j','ఝ':'jh','ఞ':'ñ',
  'ట':'ṭ','ఠ':'ṭh','డ':'ḍ','ఢ':'ḍh','ణ':'ṇ',
  'త':'t','థ':'th','ద':'d','ధ':'dh','న':'n',
  'ప':'p','ఫ':'ph','బ':'b','భ':'bh','మ':'m',
  'య':'y','ర':'r','ల':'l','వ':'v','శ':'ś','ష':'ṣ','స':'s','హ':'h','ళ':'ḷ',
};
const MATRAS = { 'ా':'ā','ి':'i','ీ':'ī','ు':'u','ూ':'ū','ృ':'r̥','ె':'e','ే':'ē','ై':'ai','ొ':'o','ో':'ō','ౌ':'au' };

export const romanizeTelugu = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '్', anusvara: 'ం', visarga: 'ః', candrabindu: null,
  digits: { '౦':'0','౧':'1','౨':'2','౩':'3','౪':'4','౫':'5','౬':'6','౭':'7','౮':'8','౯':'9' },
});
