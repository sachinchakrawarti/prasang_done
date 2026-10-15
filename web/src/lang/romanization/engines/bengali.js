import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'অ':'a','আ':'ā','ই':'i','ঈ':'ī','উ':'u','ঊ':'ū','ঋ':'r̥','এ':'ē','ঐ':'ai','ও':'ō','ঔ':'au' };
const CONSONANTS = {
  'ক':'k','খ':'kh','গ':'g','ঘ':'gh','ঙ':'ṅ','চ':'c','ছ':'ch','জ':'j','ঝ':'jh','ঞ':'ñ',
  'ট':'ṭ','ঠ':'ṭh','ড':'ḍ','ঢ':'ḍh','ণ':'ṇ','ত':'t','থ':'th','দ':'d','ধ':'dh','ন':'n',
  'প':'p','ফ':'ph','ব':'b','ভ':'bh','ম':'m','য':'y','র':'r','ল':'l','ৱ':'w','শ':'ś','ষ':'ṣ','স':'s','হ':'h',
};
const MATRAS = { 'া':'ā','ি':'i','ী':'ī','ু':'u','ূ':'ū','ৃ':'r̥','ে':'ē','ৈ':'ai','ো':'ō','ৌ':'au' };
export const romanizeBengali = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '্', anusvara: 'ং', visarga: 'ঃ', candrabindu: 'ঁ',
  digits: { '০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9' },
});
