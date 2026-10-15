import { makeBrahmicRomanizer } from './_brahmic.js';

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
  'श':'ś','ष':'ṣ','स':'s','ह':'h','ळ':'ḷ',
  'क़':'q','ख़':'k͟h','ग़':'ġ','ज़':'z','ड़':'ṛ','ढ़':'ṛh','फ़':'f',
};
const MATRAS = { 'ा':'ā','ि':'i','ी':'ī','ु':'u','ू':'ū','ृ':'r̥','े':'ē','ै':'ai','ो':'ō','ौ':'au' };

export const romanizeDevanagari = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '्', anusvara: 'ं', visarga: 'ः', candrabindu: 'ँ',
  digits: { '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9' },
});
