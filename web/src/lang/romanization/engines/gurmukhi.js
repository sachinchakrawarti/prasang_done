import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'ਅ':'a','ਆ':'ā','ਇ':'i','ਈ':'ī','ਉ':'u','ਊ':'ū','ਏ':'ē','ਐ':'ai','ਓ':'ō','ਔ':'au' };
const CONSONANTS = {
  'ਕ':'k','ਖ':'kh','ਗ':'g','ਘ':'gh','ਙ':'ṅ','ਚ':'c','ਛ':'ch','ਜ':'j','ਝ':'jh','ਞ':'ñ',
  'ਟ':'ṭ','ਠ':'ṭh','ਡ':'ḍ','ਢ':'ḍh','ਣ':'ṇ','ਤ':'t','ਥ':'th','ਦ':'d','ਧ':'dh','ਨ':'n',
  'ਪ':'p','ਫ':'ph','ਬ':'b','ਭ':'bh','ਮ':'m','ਯ':'y','ਰ':'r','ਲ':'l','ਵ':'v','ਸ':'s','ਹ':'h','ੜ':'ṛ',
};
const MATRAS = { 'ਾ':'ā','ਿ':'i','ੀ':'ī','ੁ':'u','ੂ':'ū','ੇ':'ē','ੈ':'ai','ੋ':'ō','ੌ':'au' };
export const romanizeGurmukhi = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: '੍', anusvara: 'ਂ', visarga: 'ਃ', candrabindu: null,
  digits: { '੦':'0','੧':'1','੨':'2','੩':'3','੪':'4','੫':'5','੬':'6','੭':'7','੮':'8','੯':'9' },
});
