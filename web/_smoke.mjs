import { romanizeCached } from './src/lang/romanization/engines/index.js';

console.log('Devanagari:', romanizeCached('नमस्ते दोस्तों', 'Devanagari'));
console.log('Arabic:    ', romanizeCached('سلام دوستو', 'Arabic'));
console.log('Latin:     ', romanizeCached('already roman', 'Latin'));

import { translitStore } from './src/lang/transliteration/translitStore.js';

const out = await translitStore.transliterate('नमस्ते दोस्तों', 'Devanagari', 'Arabic');
console.log('Devanagari → Arabic:', out);