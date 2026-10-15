import { makeBrahmicRomanizer } from './_brahmic.js';
const VOWELS = { 'à®…':'a','à®†':'Ä','à®‡':'i','à®ˆ':'Ä«','à®‰':'u','à®Š':'Å«','à®Ž':'e','à®':'Ä“','à®':'ai','à®’':'o','à®“':'Å','à®”':'au' };
const CONSONANTS = {
  'à®•':'k','à®™':'á¹…','à®š':'c','à®ž':'Ã±','à®Ÿ':'á¹­','à®£':'á¹‡','à®¤':'t','à®¨':'n',
  'à®ª':'p','à®®':'m','à®¯':'y','à®°':'r','à®²':'l','à®µ':'v','à®´':'á¸»','à®³':'á¸·','à®±':'á¹Ÿ','à®©':'á¹‰',
};
const MATRAS = { 'à®¾':'Ä','à®¿':'i','à¯€':'Ä«','à¯':'u','à¯‚':'Å«','à¯†':'e','à¯‡':'Ä“','à¯ˆ':'ai','à¯Š':'o','à¯‹':'Å','à¯Œ':'au' };
export const romanizeTamil = makeBrahmicRomanizer({
  vowels: VOWELS, consonants: CONSONANTS, matras: MATRAS,
  virama: 'à¯', anusvara: null, visarga: null, candrabindu: null,
  digits: { 'à¯¦':'0','à¯§':'1','à¯¨':'2','à¯©':'3','à¯ª':'4','à¯«':'5','à¯¬':'6','à¯­':'7','à¯®':'8','à¯¯':'9' },
});